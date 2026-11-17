/**
 * Open water — the aquaculture hero.
 * The home hero looks down at caustics on the sea floor, the closing scene looks up at the surface;
 * this one looks across the water column of a sea cage. Daylight falls in soft shafts, marine snow
 * drifts through them (lit only where a shaft catches it), the farmed school circles in the haze,
 * and one gilthead sea bream close to the lens carries the surface's caustics on its back.
 *
 * Three layers on one clock:
 *  - water (WebGL, reduced resolution): the water column, shafts, haze
 *  - life (2D, full resolution): marine snow and the school, sprites cut from the same bream photo
 *  - fish (WebGL, wide screens): the <img> redrawn in place — tinted by the water, caustics, rim
 *    light, a slow tail beat. The <img> stays underneath as the fallback.
 * Same rules as caustics.ts: paused off-screen, one still frame for reduced motion; the CSS
 * background and the plain <img> remain when WebGL or the image is missing. The layers join after the
 * hero has painted, their shaders compiled off the main thread (gl.ts).
 */
import { frame as nextFrame, idle, linkProgram } from './gl';

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
// The sun: above the frame, beyond its right edge, so the shafts fan in diagonally.
// Scene space: x · aspect, y up, LTR (RTL mirrors the whole scene).
const SUN = { x: 1.02, y: 1.62 };
const TEX = { w: 1024, h: 512 };

const COMMON = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float hash1(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash1(i), hash1(i + vec2(1.0, 0.0)), u.x), mix(hash1(i + vec2(0.0, 1.0)), hash1(i + vec2(1.0, 1.0)), u.x), u.y);
}
// Daylight shafts by angle around the sun. Mirrored in JS by shafts() below: keep the two in step.
float shafts(float a, float t) {
  float s1 = max(sin(a * 23.0 + t * 0.21 + 1.7 * sin(a * 7.0 - t * 0.13)), 0.0);
  float s2 = max(sin(a * 41.0 - t * 0.17 + 2.1 * sin(a * 11.0 + t * 0.09 + 2.0)), 0.0);
  float s3 = 0.5 + 0.5 * sin(a * 13.0 + t * 0.07 + 4.0);
  return s1 * s1 * s1 * 0.55 + s2 * s2 * s2 * s2 * 0.35 + s3 * s3 * 0.3;
}
vec2 sun(float aspect, float px) { return vec2((${SUN.x.toFixed(3)} + px * 0.02) * aspect, ${SUN.y.toFixed(3)}); }
`;

const WATER = COMMON + `
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uRtl;
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  if (uRtl > 0.5) uv.x = 1.0 - uv.x;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec2 P = vec2(uv.x * aspect, uv.y);

  // water column: abyss below, lit toward the surface and toward the sun
  vec3 col = mix(vec3(0.020, 0.082, 0.165), vec3(0.030, 0.135, 0.255), smoothstep(0.0, 0.45, uv.y));
  col = mix(col, vec3(0.047, 0.227, 0.380), smoothstep(0.3, 1.0, uv.y));
  float open = exp(-length((P - vec2(0.84 * aspect, 1.12)) * vec2(0.55, 1.0)) * 1.35);
  col = mix(col, vec3(0.110, 0.392, 0.537), open * 0.75);

  // shafts; the waves passing overhead send slow pulses down each one
  vec2 d = P - sun(aspect, uPointer.x - 0.5);
  float a = atan(d.x, -d.y), dist = length(d);
  float fall = exp(-(dist - 0.75) * 0.9);
  float pulse = 0.6 + 0.4 * vnoise(vec2(a * 30.0, dist * 2.6 - t * 0.22));
  col += vec3(0.50, 0.82, 0.95) * shafts(a, t) * fall * pulse * 0.2;
  // soft glow where the light enters
  col += vec3(0.30, 0.62, 0.80) * exp(-dist * 1.6) * 0.16;

  // suspended haze, drifting slower than everything else
  float haze = vnoise(P * 1.6 + vec2(t * 0.018, -t * 0.006)) * vnoise(P * 3.3 + vec2(-t * 0.012, t * 0.01) + 5.0);
  col += vec3(0.18, 0.42, 0.56) * haze * 0.07 * smoothstep(0.05, 0.85, uv.y);

  // film grain against banding
  col += (hash1(gl_FragCoord.xy + fract(t) * 61.0) - 0.5) * 0.014;
  gl_FragColor = vec4(col, 1.0);
}`;

const FISH = COMMON + `
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uBeat;
uniform vec4 uMap;
uniform float uAspect;
uniform vec2 uPointer;
uniform sampler2D uTex;

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
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  // Tail beat. From the side a lateral stroke shows as the tail foreshortening while it swings
  // toward and away from us (twice per beat), the fin turning in and out of the light.
  float hinge = 0.27;
  float beat = sin(t * 5.0) * (0.7 + 0.3 * sin(t * 0.23));
  float w = 1.0 - smoothstep(0.02, hinge, uv.x);
  vec2 tuv = uv;
  tuv.x = hinge - (hinge - uv.x) / (1.0 - 0.11 * uBeat * beat * beat * w);
  vec4 f = texture2D(uTex, tuv, -0.5);
  float a = tuv.x < 0.0 ? 0.0 : f.a;
  if (a < 0.003) { gl_FragColor = vec4(0.0); return; }
  vec3 c = f.rgb / f.a;
  float v = uv.y;

  c *= 1.0 + 0.09 * uBeat * beat * w;
  // the water takes the red out; the light comes from above
  c *= vec3(0.84, 0.95, 1.03);
  c *= mix(0.8, 1.08, smoothstep(0.12, 0.85, v));

  // caustics on the back: the home hero's moving net, falling on the flank
  vec2 css = gl_FragCoord.xy / uDpr;
  vec2 p = css / 130.0;
  float tt = t * 0.3;
  vec2 q = p + 0.09 * vec2(sin(p.y * 4.3 + tt * 0.9), cos(p.x * 3.7 - tt * 0.7));
  float c1 = exp(-edges(q, tt) * 26.0);
  float c2 = exp(-edges(q * 1.7 + 1.3, tt * 1.31) * 34.0);
  float net = c1 * 0.55 + c2 * 0.3 + c1 * c2 * 1.5;
  float lum = dot(c, vec3(0.3, 0.55, 0.15));
  c += vec3(0.60, 0.88, 0.98) * net * (0.10 + 0.6 * smoothstep(0.32, 0.9, v)) * (0.35 + 0.65 * lum) * 0.9;

  // rim: the dorsal outline catches the light
  float up = texture2D(uTex, tuv + vec2(0.0, 5.0 / uRes.y)).a;
  c += vec3(0.55, 0.84, 0.97) * clamp(a - up, 0.0, 1.0) * 0.55;

  // the shafts in the water between us and the fish
  vec2 s = vec2(uMap.x + uMap.y * css.x, uMap.z + uMap.w * css.y);
  vec2 d = vec2(s.x * uAspect, s.y) - sun(uAspect, uPointer.x - 0.5);
  c += vec3(0.50, 0.82, 0.95) * shafts(atan(d.x, -d.y), t) * exp(-(length(d) - 0.75) * 0.9) * 0.05;

  c = mix(c, vec3(0.10, 0.31, 0.46), 0.08);
  gl_FragColor = vec4(c * a, a);
}`;

/* JS twin of the GLSL shafts(): marine snow is lit where the shafts fall. */
const shafts = (a: number, t: number) => {
  const s1 = Math.max(Math.sin(a * 23 + t * 0.21 + 1.7 * Math.sin(a * 7 - t * 0.13)), 0);
  const s2 = Math.max(Math.sin(a * 41 - t * 0.17 + 2.1 * Math.sin(a * 11 + t * 0.09 + 2)), 0);
  const s3 = 0.5 + 0.5 * Math.sin(a * 13 + t * 0.07 + 4);
  return s1 * s1 * s1 * 0.55 + s2 * s2 * s2 * s2 * 0.35 + s3 * s3 * 0.3;
};
const daylight = (x: number, y: number, aspect: number, px: number, t: number) => {
  const dx = (x - SUN.x - px * 0.02) * aspect, dy = y - SUN.y;
  return shafts(Math.atan2(dx, -dy), t) * Math.exp(-(Math.hypot(dx, dy) - 0.75) * 0.9);
};

type Layer = { resize(): void; draw(t: number): void };
type Uniform = (name: string) => WebGLUniformLocation | null;

async function program(gl: WebGLRenderingContext, frag: string): Promise<Uniform | null> {
  const prog = await linkProgram(gl, VERT, frag);
  if (!prog) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return (name) => gl.getUniformLocation(prog, name);
}

/** Halve repeatedly, then land on the target width: a clean small copy of a large photo. */
function shrink(src: HTMLImageElement, width: number) {
  let cur: CanvasImageSource = src;
  let w = src.naturalWidth, h = src.naturalHeight;
  const ratio = h / w;
  const step = (nw: number) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(nw));
    c.height = Math.max(1, Math.round(nw * ratio));
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, c.width, c.height);
    cur = c; w = c.width; h = c.height;
    return c;
  };
  while (w / 2 >= width) step(w / 2);
  return step(width);
}

export async function mountPelagic(root: HTMLElement) {
  const waterCv = root.querySelector<HTMLCanvasElement>('[data-pelagic-water]');
  const lifeCv = root.querySelector<HTMLCanvasElement>('[data-pelagic-life]');
  const fishBox = root.querySelector<HTMLElement>('[data-pelagic-fish]');
  const fishCv = root.querySelector<HTMLCanvasElement>('[data-pelagic-fishgl]');
  const img = fishBox?.querySelector('img') ?? null;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const wide = matchMedia('(min-width: 961px)');
  const rtl = document.documentElement.dir === 'rtl';
  const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const clock = performance.now() - 30000 * Math.random();
  const since = (ts = performance.now()) => (ts - clock) / 1000;
  const layers: Layer[] = [];
  let W = 1, H = 1, visible = true, raf = 0;

  /* ---- water ---- */
  const makeWater = async (): Promise<Layer | null> => {
    const gl = waterCv?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!waterCv || !gl) return null;
    const u = await program(gl, WATER);
    if (!u) return null;
    const uRes = u('uRes'), uTime = u('uTime'), uPointer = u('uPointer');
    gl.uniform1f(u('uRtl'), rtl ? 1 : 0);
    const scale = small ? 0.42 : 0.6;
    return {
      resize() {
        waterCv.width = Math.max(1, Math.round(W * scale));
        waterCv.height = Math.max(1, Math.round(H * scale));
        gl.viewport(0, 0, waterCv.width, waterCv.height);
        gl.uniform2f(uRes, waterCv.width, waterCv.height);
      },
      draw(t) {
        gl.uniform1f(uTime, t);
        gl.uniform2f(uPointer, ptr.x, ptr.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  };

  /* ---- life: marine snow + the school ---- */
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const ctx = lifeCv?.getContext('2d') ?? null;
  type Mote = { x: number; y: number; z: number; v: number; ph: number };
  type Fish = { th: number; r: number; y: number; w: number; ph: number; len: number; tilt: number; sy: number; a: number };
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const motes: Mote[] = Array.from({ length: small ? 36 : 72 }, () => {
    const z = Math.random();
    return { x: Math.random(), y: Math.random(), z, v: 0.006 + z * 0.01, ph: rnd(0, 6.28) };
  });
  // The cage: the school circles a ring ahead of us, right of centre and a little below eye level,
  // one way round (about 0.3 m/s), so the far side swims left and the near side right.
  const CAGE = { x: 3, y: -0.25, z: 11, r: 5 };
  const school: Fish[] = Array.from({ length: small ? 22 : 54 }, () => ({
    th: rnd(0, Math.PI * 2),
    r: CAGE.r * rnd(0.82, 1.2),
    y: CAGE.y + (Math.random() + Math.random() - 1) * 0.9,
    w: 0.06 * rnd(0.88, 1.12),
    ph: rnd(0, 6.28),
    len: rnd(0.3, 0.4),
    tilt: rnd(-0.07, 0.07),
    sy: rnd(0.94, 1.04),
    a: rnd(0.75, 1),
  }));
  let sprites: HTMLCanvasElement[] = [];
  let spriteRatio = 0.5;
  let schoolFrom = Infinity;
  const dot = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(232, 247, 253, 1)');
    g.addColorStop(0.3, 'rgba(207, 234, 248, 0.55)');
    g.addColorStop(1, 'rgba(207, 234, 248, 0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 32, 32);
    return c;
  })();
  const makeSprites = (src: HTMLImageElement) => {
    spriteRatio = src.naturalHeight / src.naturalWidth;
    // Seen through metres of water: red drained, bluer and flatter, darker below. Small copies
    // drawn larger than themselves double as the blur of distance.
    sprites = [192, 96, 48, 24].map((sw) => {
      const c = shrink(src, sw);
      const x = c.getContext('2d')!;
      x.globalCompositeOperation = 'source-atop';
      x.fillStyle = 'rgba(30, 98, 146, 0.5)';
      x.fillRect(0, 0, c.width, c.height);
      const g = x.createLinearGradient(0, 0, 0, c.height);
      g.addColorStop(0, 'rgba(160, 215, 240, 0.16)');
      g.addColorStop(1, 'rgba(4, 22, 44, 0.5)');
      x.fillStyle = g;
      x.fillRect(0, 0, c.width, c.height);
      return c;
    });
  };
  const life: Layer | null = lifeCv && ctx ? {
    resize() {
      lifeCv.width = Math.round(W * dpr);
      lifeCv.height = Math.round(H * dpr);
    },
    draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const aspect = W / H;
      const px = ptr.x - 0.5;
      const mote = (m: Mote) => {
        const y = ((m.y + m.v * t) % 1.08) - 0.04;
        const x = m.x + Math.sin(t * 0.25 + m.ph) * 0.006 - px * 0.02 * (0.2 + m.z);
        const light = daylight(x, 1 - y, aspect, px, t);
        const r = 0.8 + m.z * m.z * 2.6;
        ctx.globalAlpha = Math.min(0.9, (0.18 + 0.55 * m.z) * (0.35 + 1.8 * light));
        ctx.drawImage(dot, (rtl ? 1 - x : x) * W - r * 2, y * H - r * 2, r * 4, r * 4);
      };
      motes.forEach((m) => m.z < 0.55 && mote(m));
      if (sprites.length) {
        const fade = Math.min(1, Math.max(0, (t - schoolFrom) / 2.5));
        const F = Math.min(H * 0.95, W * 0.85);
        const fish = school.map((f) => {
          const th = f.th + f.w * t;
          return { f, th, x: CAGE.x + f.r * Math.cos(th), z: CAGE.z + f.r * Math.sin(th), y: f.y + Math.sin(t * 0.35 + f.ph) * 0.06 };
        }).sort((a, b) => b.z - a.z);
        for (const p of fish) {
          const k = F / p.z;
          const len = p.f.len * k;
          let sx = W * 0.5 + p.x * k - px * 70 / p.z;
          const sy = H * 0.5 - p.y * k;
          const vx = -Math.sin(p.th);
          let dir = vx >= 0 ? 1 : -1;
          if (rtl) { sx = W - sx; dir = -dir; }
          // head-on at the turns; a slight squeeze with each tail beat
          const beat = Math.sin(t * 4.6 + p.f.ph);
          const fore = Math.max(0.14, Math.abs(vx)) * (1 - 0.05 * beat * beat);
          const soft = Math.min(1, Math.max(0.45, 1.15 - (p.z - 6) * 0.06));
          const spr = sprites.find((s) => s.width <= len * dpr * soft * 1.2) ?? sprites[sprites.length - 1];
          const tilt = p.f.tilt + 0.04 * Math.sin(t * 0.3 + p.f.ph);
          const cs = Math.cos(tilt), sn = Math.sin(tilt) * dir;
          const ax = dpr * dir * fore, ay = dpr * p.f.sy;
          ctx.globalAlpha = fade * p.f.a * 0.9 * Math.exp(-(p.z - 5) * 0.12);
          ctx.setTransform(ax * cs, ax * sn, -ay * sn, ay * cs, sx * dpr, sy * dpr);
          ctx.drawImage(spr, -len / 2, -len * spriteRatio / 2, len, len * spriteRatio);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      motes.forEach((m) => m.z >= 0.55 && mote(m));
      ctx.globalAlpha = 1;
    },
  } : null;

  /* ---- fish: the hero bream, redrawn in the water ---- */
  let fish: Layer | null = null;
  let beatFrom = Infinity;
  const makeFish = async (src: HTMLImageElement): Promise<Layer | null> => {
    const gl = fishCv?.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!fishBox || !fishCv || !gl) return null;
    const u = await program(gl, FISH);
    if (!u) return null;
    // Resampled to power-of-two sides so it can be mipmapped (clean at any size).
    const pot = document.createElement('canvas');
    pot.width = TEX.w;
    pot.height = TEX.h;
    const px = pot.getContext('2d')!;
    px.imageSmoothingQuality = 'high';
    px.drawImage(src, 0, 0, pot.width, pot.height);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uRes = u('uRes'), uDpr = u('uDpr'), uTime = u('uTime'), uBeat = u('uBeat');
    const uMap = u('uMap'), uAspect = u('uAspect'), uPointer = u('uPointer');
    gl.uniform1i(u('uTex'), 0);
    return {
      resize() {
        const cw = fishCv.clientWidth, ch = fishCv.clientHeight;
        // no finer than the texture itself: more pixels would only magnify it
        const scale = Math.min(dpr, (TEX.w * 1.1) / Math.max(1, cw));
        fishCv.width = Math.max(1, Math.round(cw * scale));
        fishCv.height = Math.max(1, Math.round(ch * scale));
        gl.viewport(0, 0, fishCv.width, fishCv.height);
        gl.uniform2f(uRes, fishCv.width, fishCv.height);
        gl.uniform1f(uDpr, scale);
        // canvas css px (from its bottom-left) → scene uv; the box is mirrored by CSS in RTL
        const r = root.getBoundingClientRect(), b = fishCv.getBoundingClientRect();
        const x0 = b.left - r.left, y0 = b.top - r.top;
        gl.uniform4f(uMap, (rtl ? W - x0 - cw : x0) / W, 1 / W, (H - y0 - ch) / H, 1 / H);
        gl.uniform1f(uAspect, W / H);
      },
      draw(t) {
        if (!wide.matches) return;
        gl.uniform1f(uTime, t);
        gl.uniform1f(uBeat, reduce ? 0 : Math.min(1, Math.max(0, (t - beatFrom) / 3)));
        gl.uniform2f(uPointer, ptr.x, ptr.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  };

  /* ---- one clock ---- */
  const frame = (ts = performance.now()) => {
    ptr.x += (ptr.tx - ptr.x) * 0.04;
    ptr.y += (ptr.ty - ptr.y) * 0.04;
    const t = reduce ? 14 : since(ts);
    layers.forEach((l) => l.draw(t));
  };
  // Resizing clears a canvas; redraw before the next paint so it never flashes empty.
  const resize = () => {
    const r = root.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    layers.forEach((l) => l.resize());
    frame();
  };
  const loop = (ts: number) => {
    raf = 0;
    if (!visible) return;
    frame(ts);
    raf = requestAnimationFrame(loop);
  };
  const run = () => { if (visible && !reduce && !raf) raf = requestAnimationFrame(loop); };

  // The hero paints first on its CSS water, the bream as a plain <img>; the layers fade in once the page has
  // painted and gone idle (a synchronous shader link here froze the hero while it was coming in).
  await nextFrame();
  await idle(700);
  const water = await makeWater();
  if (water) layers.push(water);
  if (life) layers.push(life);
  resize();
  if (water) waterCv!.classList.add('is-live');
  if (life) lifeCv!.classList.add('is-live');

  let fishing = false;
  const syncFish = async () => {
    if (wide.matches && !fish && !fishing && img?.naturalWidth) {
      fishing = true;
      fish = await makeFish(img);
      if (fish) { layers.push(fish); fish.resize(); }
    }
    const on = !!fish && wide.matches;
    if (on && !root.classList.contains('is-fishgl')) beatFrom = since() + 1.4;
    root.classList.toggle('is-fishgl', on);
    if (reduce) frame();
  };
  if (img) {
    const ready = img.complete && img.naturalWidth ? Promise.resolve() : img.decode();
    ready.then(() => {
      if (!img.naturalWidth) return;
      makeSprites(img);
      schoolFrom = reduce ? -Infinity : since();
      syncFish();
    }).catch(() => {});
    wide.addEventListener('change', syncFish);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(root);
  if (fishBox) ro.observe(fishBox);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    run();
  }).observe(root);
  if (matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', (e) => { ptr.tx = e.clientX / innerWidth; ptr.ty = 1 - e.clientY / innerHeight; }, { passive: true });
  }
  run();
}
