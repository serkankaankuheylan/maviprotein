/**
 * Caustic light — sunlight refracted through the surface, falling on the sea floor.
 * Own implementation: two layers of animated Worley noise; the cell borders (F2 − F1)
 * form the bright net. Rendered at reduced resolution, paused off-screen, single frame
 * when the user prefers reduced motion. Falls back to the CSS background if WebGL is missing.
 */
import { frame, idle, linkProgram } from './gl';

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uFlip;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float edges(vec2 p, float t) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = hash2(i + g);
    o = 0.5 + 0.42 * sin(t + 6.2831 * o);
    float d = length(g + o - f);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return d2 - d1;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  if (uFlip > 0.5) uv.y = 1.0 - uv.y;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  // gentle refraction wobble + pointer bend
  vec2 w = vec2(sin(p.y * 3.1 + uTime * 0.21), cos(p.x * 2.3 - uTime * 0.17)) * 0.035;
  w += (uPointer - vec2(0.5)) * 0.05 * smoothstep(0.0, 1.0, uv.y);
  float t = uTime * 0.3;
  vec2 q = p + w + 0.11 * vec2(sin(p.y * 4.3 + t * 0.9), cos(p.x * 3.7 - t * 0.7));
  float e1 = edges(q * 3.6, t);
  float e2 = edges(q * 6.1 + 1.3, t * 1.31);
  float c1 = exp(-e1 * 26.0);
  float c2 = exp(-e2 * 32.0);
  float net = c1 * 0.55 + c2 * 0.32 + c1 * c2 * 1.6;
  // light falls off with depth (top of the frame = surface)
  float depth = smoothstep(0.02, 1.0, uv.y);
  vec3 deep = vec3(0.016, 0.075, 0.15);
  vec3 mid = vec3(0.04, 0.2, 0.36);
  vec3 col = mix(deep, mid, pow(depth, 1.6));
  vec3 light = vec3(0.56, 0.84, 0.96);
  col += light * net * (0.03 + 0.34 * pow(depth, 2.2));
  // god-ray streaks
  float rays = sin((uv.x + uv.y * 0.18) * 22.0 + uTime * 0.12) * sin((uv.x - uv.y * 0.1) * 13.0 - uTime * 0.08);
  col += light * 0.035 * max(rays, 0.0) * depth;
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

export async function mountCaustics(canvas: HTMLCanvasElement, opts: { flip?: boolean; scale?: number } = {}) {
  // The hero paints and starts surfacing first; the water joins in an idle moment (it fades in anyway).
  await frame();
  await idle(700);
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const prog = await linkProgram(gl, VERT, FRAG);
  if (!prog) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uPointer = gl.getUniformLocation(prog, 'uPointer');
  gl.uniform1f(gl.getUniformLocation(prog, 'uFlip'), opts.flip ? 1 : 0);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const scale = opts.scale ?? (small ? 0.42 : 0.6);
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let visible = true;
  let raf = 0;
  const start = performance.now() - 40000 * Math.random();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * scale));
    canvas.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    if (reduce) draw(start + 12000);
  };
  const draw = (now: number) => {
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduce && !raf) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  if (matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', (e) => { pointer.tx = e.clientX / innerWidth; pointer.ty = 1 - e.clientY / innerHeight; }, { passive: true });
  }
  resize();
  canvas.classList.add('is-live');
  if (!reduce) raf = requestAnimationFrame(loop);
}

/** Feed pellets sinking slowly through the water column (2D canvas). */
export function mountPellets(canvas: HTMLCanvasElement, count = 18) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, raf = 0, visible = true, last = performance.now();
  type P = { x: number; y: number; s: number; v: number; r: number; vr: number; ph: number; z: number };
  const ps: P[] = [];
  const spawn = (p: Partial<P> = {}): P => {
    const z = Math.random();
    return { x: Math.random(), y: -0.05 - Math.random() * 0.3, s: 3.2 + z * 6.5, v: 0.012 + z * 0.02, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.5, ph: Math.random() * 6.28, z, ...p };
  };
  for (let i = 0; i < count; i++) ps.push(spawn({ y: Math.random() }));
  ps.sort((a, b) => a.z - b.z);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) render();
  };
  const pellet = (p: P) => {
    const x = p.x * w + Math.sin(p.ph) * 10 * p.z;
    const y = p.y * h;
    const len = p.s * 1.45, rad = p.s * 0.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.r);
    ctx.globalAlpha = 0.35 + p.z * 0.6;
    const g = ctx.createLinearGradient(0, -rad, 0, rad);
    g.addColorStop(0, '#b07a45');
    g.addColorStop(0.45, '#7a4a24');
    g.addColorStop(1, '#3a210e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-len / 2, -rad, len, rad * 2, rad);
    ctx.fill();
    ctx.globalAlpha *= 0.55;
    ctx.fillStyle = '#e7c49a';
    ctx.beginPath();
    ctx.ellipse(-len * 0.12, -rad * 0.45, len * 0.26, rad * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const render = () => { ctx.clearRect(0, 0, w, h); ps.forEach(pellet); };
  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const p of ps) {
      p.y += p.v * dt * (0.8 + 0.4 * Math.sin(p.ph));
      p.ph += dt * (0.5 + p.z * 0.4);
      p.r += p.vr * dt;
      if (p.y > 1.08) Object.assign(p, spawn({ z: p.z, s: p.s, v: p.v }));
    }
    render();
    raf = requestAnimationFrame(loop);
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduce && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }).observe(canvas);
  resize();
  if (!reduce) raf = requestAnimationFrame(loop);
  else render();
}
