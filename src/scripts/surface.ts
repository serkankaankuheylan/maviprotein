/**
 * Back to the surface — the closing scene, the counterpart of the hero.
 * The hero looks down at caustics on the sea floor; here we look up from just under the
 * surface: the bright Snell's window (the sky seen through moving water), the underside of
 * the surface receding in perspective, light shafts fanning down from the window, and
 * bubbles rising toward the light (the hero's pellets sink; these rise).
 * Same rules as caustics.ts: reduced resolution, paused off-screen, single frame for
 * reduced motion, CSS background stays as the fallback when WebGL is missing.
 */
import { idle, linkProgram, near } from './gl';

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uRtl;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
float hash1(float n) { return fract(sin(n) * 43758.5453); }
float noise1(float x) {
  float i = floor(x), f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash1(i), hash1(i + 1.0), u);
}
// Worley border (F2 - F1): the bright filaments of a rippled surface.
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
  if (uRtl > 0.5) uv.x = 1.0 - uv.x;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec2 ptr = uPointer - 0.5;

  // ---- water column: abyss below, lit turquoise toward the surface
  vec3 abyss = vec3(0.020, 0.075, 0.150);
  vec3 mid = vec3(0.035, 0.180, 0.320);
  vec3 shallow = vec3(0.090, 0.380, 0.520);
  float h = uv.y;
  vec3 col = mix(abyss, mid, smoothstep(0.0, 0.62, h));
  col = mix(col, shallow, smoothstep(0.55, 1.0, h) * 0.75);

  // light source: the sun overhead, just above the frame, right of centre
  vec2 L = vec2((0.70 + ptr.x * 0.03) * aspect, 1.10 + ptr.y * 0.02);
  vec2 P = vec2(uv.x * aspect, uv.y);
  vec2 d = P - L;
  float dist = length(d * vec2(1.0, 1.15));

  // ---- underside of the surface (top band), receding in perspective
  float H = 0.58;                         // where the surface meets the haze
  float s = clamp((uv.y - H) / (1.0 - H), 0.0, 1.0);
  float surf = smoothstep(0.0, 0.35, s);
  float z = 1.0 / (s + 0.06);              // distance along the surface
  vec2 sp = vec2((uv.x - 0.5) * aspect * z * 0.9, z * 1.2);
  sp += vec2(t * 0.025, -t * 0.04);
  vec2 wob = 0.12 * vec2(sin(sp.y * 1.7 + t * 0.6), cos(sp.x * 1.3 - t * 0.5));
  float e1 = edges((sp + wob) * 1.6, t * 0.55);
  float e2 = edges((sp - wob) * 2.9 + 3.1, t * 0.8);
  float rip = exp(-e1 * 18.0) * 0.6 + exp(-e2 * 24.0) * 0.35;
  // far surface acts as a dark mirror: ripples only catch faint glints
  col += vec3(0.45, 0.78, 0.92) * rip * surf * (0.05 + 0.22 * s * s);
  col = mix(col, col * 0.82, surf * (1.0 - s) * 0.5);

  // ---- Snell's window: the sky through the surface, edge shivering with the waves
  float edgeN = (noise1(atan(d.x, -d.y) * 9.0 + t * 0.35) - 0.5) * 0.06
              + (e1 - 0.3) * 0.05 * s;
  float R = 0.62;
  float win = 1.0 - smoothstep(R - 0.18, R + 0.02, dist + edgeN);
  float rim = exp(-pow((dist + edgeN - R + 0.05) * 13.0, 2.0));
  vec3 sky = vec3(0.80, 0.94, 0.99);
  vec3 inside = mix(vec3(0.42, 0.76, 0.90), sky, smoothstep(R, 0.0, dist));
  // the sky breaks into bright cells behind the moving water
  inside *= 0.82 + 0.35 * exp(-e2 * 14.0) + 0.18 * rip;
  col = mix(col, inside, win * smoothstep(0.35, 0.8, uv.y));
  col += vec3(0.62, 0.90, 1.0) * rim * 0.22 * smoothstep(0.5, 0.9, uv.y);
  // sun hot-spot
  col += vec3(1.0, 0.98, 0.92) * exp(-dist * 7.5) * 0.55;

  // ---- light shafts fanning down from the window
  float ang = atan(d.x, -d.y);
  float r1 = noise1(ang * 16.0 + t * 0.10);
  float r2 = noise1(ang * 37.0 - t * 0.16 + 4.0);
  float r3 = noise1(ang * 7.0 + t * 0.05 + 9.0);
  float shafts = pow(r1, 3.0) * 0.6 + pow(r2, 4.0) * 0.45 + pow(r3, 2.0) * 0.35;
  float fall = exp(-dist * 1.15);
  float below = smoothstep(1.05, 0.55, uv.y) * 0.6 + 0.4;
  col += vec3(0.55, 0.84, 0.96) * shafts * fall * below * 0.42;
  // diffuse glow around the window
  col += vec3(0.30, 0.62, 0.80) * exp(-dist * 2.2) * 0.22;

  // ---- suspended haze: slow drifting density
  float haze = noise1(P.x * 3.0 + t * 0.03) * noise1(P.y * 4.0 - t * 0.02 + 2.0);
  col += vec3(0.20, 0.45, 0.60) * haze * 0.05 * smoothstep(0.0, 0.8, uv.y);

  // ---- deep end: fall back into the abyss (meets the footer)
  col = mix(abyss * 0.9, col, smoothstep(0.0, 0.32, uv.y));

  // film grain against banding
  col += (hash2(gl_FragCoord.xy + fract(t)).x - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

export async function mountSurface(canvas: HTMLCanvasElement) {
  // The closing scene sits at the foot of the page: no context, no compile until the reader is a screen away.
  // Until then (and without WebGL) the CSS scene behind the canvas is what shows.
  await near(canvas, '100% 0px');
  await idle(400);
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
  gl.uniform1f(gl.getUniformLocation(prog, 'uRtl'), document.documentElement.dir === 'rtl' ? 1 : 0);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const scale = small ? 0.4 : 0.55;
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let visible = false;
  let raf = 0;
  const start = performance.now() - 30000 * Math.random();

  const draw = (now: number) => {
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * scale));
    canvas.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    draw(reduce ? start + 12000 : performance.now());
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
  }, { rootMargin: '120px 0px' }).observe(canvas);
  if (matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', (e) => { pointer.tx = e.clientX / innerWidth; pointer.ty = 1 - e.clientY / innerHeight; }, { passive: true });
  }
  resize();
  canvas.classList.add('is-live');
}

/**
 * Bubbles rising toward the light plus fine suspended particles (marine snow).
 * Bubbles gather in streams on the light side so the headline keeps calm water.
 */
export function mountRising(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;
  const rtl = document.documentElement.dir === 'rtl';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, raf = 0, visible = false, last = performance.now();

  type B = { x: number; y: number; r: number; v: number; ph: number; amp: number; z: number };
  type M = { x: number; y: number; r: number; v: number; ph: number; a: number };
  // three streams on the bright side + scattered loners
  const streams = [0.62, 0.78, 0.9];
  const bubbleX = () => {
    const x = Math.random() < 0.72 ? streams[(Math.random() * streams.length) | 0] + (Math.random() - 0.5) * 0.06 : 0.35 + Math.random() * 0.65;
    return rtl ? 1 - x : x;
  };
  const newBubble = (y = 1.05 + Math.random() * 0.4): B => {
    const z = Math.random();
    return { x: bubbleX(), y, r: 1.2 + z * z * 5.5, v: 0.05 + z * 0.07, ph: Math.random() * 6.28, amp: 3 + z * 9, z };
  };
  const newMote = (y = Math.random()): M => ({ x: Math.random(), y, r: 0.5 + Math.random() * 1.3, v: 0.004 + Math.random() * 0.01, ph: Math.random() * 6.28, a: 0.15 + Math.random() * 0.35 });
  const bubbles: B[] = Array.from({ length: small ? 22 : 46 }, () => newBubble(Math.random() * 1.2));
  const motes: M[] = Array.from({ length: small ? 40 : 90 }, () => newMote());
  bubbles.sort((a, b) => a.z - b.z);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  };
  const bubble = (b: B) => {
    const x = b.x * w + Math.sin(b.ph) * b.amp;
    const y = b.y * h;
    // fade in from the deep, fade out at the surface
    const life = Math.min(1, (1.05 - b.y) * 4) * Math.min(1, b.y * 6);
    if (life <= 0) return;
    const a = (0.25 + b.z * 0.55) * life;
    const r = b.r * (1 + (1 - b.y) * 0.25); // expand slightly as pressure drops
    ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, 'rgba(207,234,248,0.04)');
    g.addColorStop(0.75, 'rgba(207,234,248,0.10)');
    g.addColorStop(1, 'rgba(225,244,252,0.55)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(230,246,253,0.7)';
    ctx.lineWidth = Math.max(0.6, r * 0.12);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.38, Math.max(0.5, r * 0.2), 0, Math.PI * 2); ctx.fill();
  };
  const render = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgb(207,234,248)';
    for (const m of motes) {
      // brighter near the surface, where the shafts catch them
      ctx.globalAlpha = m.a * (0.35 + 0.65 * (1 - m.y));
      ctx.beginPath(); ctx.arc(m.x * w + Math.sin(m.ph) * 6, m.y * h, m.r, 0, Math.PI * 2); ctx.fill();
    }
    bubbles.forEach(bubble);
    ctx.globalAlpha = 1;
  };
  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const b of bubbles) {
      b.y -= b.v * dt * (1 + (1 - b.y) * 0.6); // accelerate toward the surface
      b.ph += dt * (2.2 + b.z * 1.5);
      if (b.y < -0.05) Object.assign(b, newBubble());
    }
    for (const m of motes) {
      m.y -= m.v * dt * 0.4;
      m.ph += dt * 0.3;
      if (m.y < -0.02) Object.assign(m, newMote(1.02));
    }
    render();
    raf = requestAnimationFrame(loop);
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduce && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }, { rootMargin: '120px 0px' }).observe(canvas);
  resize();
}
