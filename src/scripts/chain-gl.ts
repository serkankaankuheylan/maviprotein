/**
 * Liquid hand-over between two transparent objects (one WebGL1 quad, one shader).
 *
 * A noise field with an upward bias decides which pixel belongs to which object.
 * As `m` goes 0→1 a front sweeps the field: the outgoing object sinks away from the
 * bottom up and the incoming one condenses in its place. Along the front the image
 * is pulled by the noise gradient (water) and a thin brass/aegean seam glows only
 * where an object actually is, so empty paper never lights up.
 *
 * Cost: drawn only when the scroll position changes (no idle loop), canvas capped
 * at 1.5× DPR on touch devices and 2× elsewhere, 8 textures ≤ 1200 px.
 */
import { linkProgram } from './gl';

export interface ChainGL { draw(a: number, b: number, m: number): void; resize(): void }

const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FS = `precision mediump float;
varying vec2 v;
uniform sampler2D uA, uB;
uniform vec2 uSA, uSB;
uniform float uM, uSeed;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), u.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), u.x), u.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
vec4 fit(sampler2D t, vec2 uv, vec2 size, float k, float dy){
  vec2 q = (uv - vec2(.5, .5 + dy)) / (size * k) + .5;
  if (q.x < 0. || q.y < 0. || q.x > 1. || q.y > 1.) return vec4(0.);
  return texture2D(t, vec2(q.x, 1. - q.y));
}
void main(){
  float m = uM;
  float wob = sin(3.14159 * m);
  float nz = fbm(v * 3.1 + uSeed);
  float f = clamp((nz * .74 + v.y * .26 - .17) / .66, 0., 1.);
  float w = .075;
  float e = mix(-2.2 * w, 1. + 2.2 * w, m);
  float front = (1. - smoothstep(0., .24, abs(f - e))) * wob;
  vec2 g = vec2(fbm(v * 4.7 + uSeed + 3.1), fbm(v * 4.7 + uSeed + 7.7)) - .5;
  vec2 d = g * (.075 * front + .018 * wob);
  vec4 A = fit(uA, v + d, uSA, 1. + .06 * m, -.025 * m);
  vec4 B = fit(uB, v - d * .8, uSB, .94 + .06 * m, .03 * (1. - m));
  float kA = smoothstep(e, e + w, f);
  float kB = 1. - smoothstep(e - w, e, f);
  vec4 col = A * kA + B * kB;
  float seam = exp(-pow((f - e) / (w * .3), 2.)) * max(A.a, B.a) * wob;
  float drop = step(.965, h(floor(v * 240.) + uSeed)) * front * front * max(A.a, B.a);
  vec3 tint = mix(vec3(.86, .63, .36), vec3(.97, .92, .82), smoothstep(.35, .65, nz));
  float ga = clamp(seam * .7 + drop * .5, 0., 1.);
  col.rgb = col.rgb * (1. - ga) + tint * ga;
  col.a = col.a + ga * (1. - col.a);
  gl_FragColor = col;
}`;

const load = async (img: HTMLImageElement) => {
  if (!img.complete || !img.naturalWidth) await new Promise((r, j) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', j, { once: true }); });
  await img.decode?.().catch(() => {});
  return img;
};

export async function createChainGL(canvas: HTMLCanvasElement, imgs: HTMLImageElement[]): Promise<ChainGL | null> {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const prog = await linkProgram(gl, VS, FS);
  if (!prog) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (name: string) => gl.getUniformLocation(prog, name);
  const uA = U('uA'), uB = U('uB'), uSA = U('uSA'), uSB = U('uSB'), uM = U('uM'), uSeed = U('uSeed');
  gl.uniform1i(uA, 0);
  gl.uniform1i(uB, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const coarse = matchMedia('(pointer: coarse)').matches;
  let last: [number, number, number] | null = null;
  // the first two first, so the stage is live quickly; the rest stream in
  const S = 0.9; // share of the canvas an object may occupy along its long side
  const tex: (WebGLTexture | null)[] = imgs.map(() => null);
  const size: [number, number][] = imgs.map(() => [S, S]);
  const upload = async (k: number) => {
    const img = await load(imgs[k]);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const a = img.naturalWidth / img.naturalHeight;
    size[k] = a >= 1 ? [S, S / a] : [S * a, S];
    tex[k] = t;
    if (last && ready) api.draw(last[0], last[1], last[2], true);
  };
  let ready = false;
  await Promise.all([upload(0), upload(1)]);
  ready = true;
  imgs.slice(2).forEach((_, k) => upload(k + 2).catch(() => {}));

  const resize = () => {
    const r = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
    const w = Math.round(canvas.clientWidth * r), h = Math.round(canvas.clientHeight * r);
    if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (last) api.draw(last[0], last[1], last[2], true);
  };

  const api = {
    draw(a: number, b: number, m: number, force = false) {
      if (!force && last && last[0] === a && last[1] === b && Math.abs(last[2] - m) < 1e-4) return;
      last = [a, b, m];
      // a texture still streaming in: hold the neighbour that is ready
      const ta = tex[a] ?? tex[b], tb = tex[b] ?? tex[a];
      if (!ta || !tb) return;
      const sa = tex[a] ? size[a] : size[b], sb = tex[b] ? size[b] : size[a];
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ta);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tb);
      gl.uniform2f(uSA, sa[0], sa[1]);
      gl.uniform2f(uSB, sb[0], sb[1]);
      gl.uniform1f(uM, m);
      gl.uniform1f(uSeed, a * 3.71 + 1.3);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    resize,
  };
  resize();
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  return api;
}
