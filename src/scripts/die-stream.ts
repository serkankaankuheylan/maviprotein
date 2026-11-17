/**
 * Feed & food lines hero: product leaving the extruder die.
 *
 * The die face is an inline SVG (src/lib/die.ts) under this 2D canvas. Where a knife blade passes a ring of
 * openings, a piece of the current family's product is cut off, flung along the blade's turn, drifts toward the
 * viewer (perspective: it grows) and falls away. Near pieces are drawn from pre-blurred copies made once at load
 * (depth of field without a per-frame filter); a flat 3D tumble is faked by squashing each piece along one axis.
 *
 * The families (feed, pet food, food) each have their own die and product; `set()` switches both, pieces already
 * in the air keep flying. Started once the hero has painted and the page is idle, paused off-screen (and by the browser
 * in hidden tabs), capped at ~60 fps. With reduced motion a single still frame is drawn.
 */
import { afterLoad, frame, idle } from './gl';

export interface DieFamily {
  /** product sprites (cut-outs, ~160 px) */
  urls: string[];
  /** radii of the rings of openings, in the die drawing's 600-unit box (centre 300) */
  rings: number[];
  /** the die's knife (its CSS rotation is read to cut where a blade is); null when the head itself turns */
  knife: Element | null;
  blades: number;
  /** longest side of a piece at the die face, as a fraction of the die radius (≈ its opening) */
  size: number;
}

type Sprite = { sharp: CanvasImageSource; soft: CanvasImageSource; blur: CanvasImageSource; w: number; h: number };
type Piece = {
  s: Sprite; x: number; y: number; z: number; vx: number; vy: number; vz: number;
  a: number; va: number; ph: number; vph: number; size: number; age: number;
};

const TAU = Math.PI * 2;
const G = 0.24; // gravity, die radii / s²
const FOCUS = 0.72; // depth where pieces are sharp (1 = die face, smaller = nearer)

export function mountDieStream(canvas: HTMLCanvasElement, die: HTMLElement, families: Record<string, DieFamily>, first: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 760px)');
  const sprites: Record<string, Sprite[]> = {};
  const pieces: Piece[] = [];
  let fam = first;
  let w = 0, h = 0, cx = 0, cy = 0, R = 1, dpr = 1;
  let raf = 0, visible = false, started = false, last = 0, debt = 0;

  // ---- sprites: decode once, keep a sharp, a soft and a blurred copy ----
  const blurOk = 'filter' in ctx;
  const copy = (img: HTMLImageElement, px: number) => {
    if (!blurOk || !px) return img;
    const pad = Math.ceil(px * 3);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth + pad * 2; c.height = img.naturalHeight + pad * 2;
    const x = c.getContext('2d')!;
    x.filter = `blur(${px}px)`;
    x.drawImage(img, pad, pad);
    return c;
  };
  const load = (key: string, urgent = false) => {
    if (sprites[key]) return Promise.resolve();
    sprites[key] = [];
    return Promise.all(families[key].urls.map(async (u) => {
      const img = new Image();
      if (urgent) img.fetchPriority = 'high';
      img.src = u;
      try { await img.decode(); } catch { return; }
      sprites[key].push({ sharp: img, soft: copy(img, 2.2), blur: copy(img, 6), w: img.naturalWidth, h: img.naturalHeight });
    }));
  };

  // ---- geometry: the die's box, in canvas px ----
  const measure = () => {
    const c = canvas.getBoundingClientRect();
    const d = die.getBoundingClientRect();
    w = c.width; h = c.height;
    dpr = Math.min(devicePixelRatio || 1, narrow.matches ? 1.75 : 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = d.left - c.left + d.width / 2;
    cy = d.top - c.top + d.height / 2;
    R = d.width / 2; // the drawing's 600-unit box spans the element; 300 units = R px
    if (reduce || !raf) draw();
  };

  /** current knife turn (rad) from its CSS animation; the head itself when it has no knife */
  const turn = (f: DieFamily) => {
    const an = f.knife?.getAnimations?.()[0];
    const t = an?.currentTime, dur = (an?.effect?.getTiming().duration as number) || 0;
    return typeof t === 'number' && dur ? ((t % dur) / dur) * TAU : 0;
  };

  const spawn = () => {
    const f = families[fam];
    const set = sprites[fam];
    if (!set?.length) return;
    const ring = f.rings[(Math.random() * f.rings.length) | 0] / 300;
    const r = ring + (Math.random() - 0.5) * 0.03;
    // just behind a blade (it has turned past the opening and cut the piece), or anywhere on a turning head
    const a = f.blades
      ? turn(f) + (((Math.random() * f.blades) | 0) / f.blades) * TAU + 0.14 + Math.random() * 0.22
      : Math.random() * TAU;
    const tx = -Math.sin(a), ty = Math.cos(a); // clockwise tangent on screen
    const vt = 0.14 + Math.random() * 0.2;
    const vr = 0.03 + Math.random() * 0.06;
    const s = set[(Math.random() * set.length) | 0];
    pieces.push({
      s, x: Math.cos(a) * r, y: Math.sin(a) * r, z: 1,
      vx: tx * vt + Math.cos(a) * vr, vy: ty * vt + Math.sin(a) * vr - 0.1, vz: -(0.17 + Math.random() * 0.15),
      a: Math.random() * TAU, va: (Math.random() - 0.5) * 3.2, ph: Math.random() * TAU, vph: 1 + Math.random() * 2.4,
      size: f.size * (0.85 + Math.random() * 0.3), age: 0,
    });
  };

  const step = (dt: number) => {
    const rate = narrow.matches ? 4.5 : 7; // pieces per second
    debt += dt * rate;
    while (debt >= 1) { spawn(); debt -= 1; }
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.age += dt;
      p.vy += G * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.a += p.va * dt; p.ph += p.vph * dt;
      const sy = cy + (p.y * R) / p.z;
      if (p.z < 0.3 || sy > h + 120 || p.age > 6) pieces.splice(i, 1);
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    // far first: nearer pieces cover the ones behind them
    pieces.sort((p, q) => q.z - p.z);
    for (const p of pieces) {
      const k = 1 / p.z;
      const x = cx + p.x * R * k, y = cy + p.y * R * k;
      const len = p.size * R * k; // longest side, px
      if (x < -len || x > w + len || y < -len || y > h + len) continue;
      // depth of field: sharp around FOCUS, soft nearer, blurred nearest
      const d = Math.max(0, FOCUS - p.z);
      const img = d > 0.24 ? p.s.blur : d > 0.1 ? p.s.soft : p.s.sharp;
      const pad = img === p.s.sharp ? 0 : ((img as HTMLCanvasElement).width - p.s.w) / 2;
      const scale = len / Math.max(p.s.w, p.s.h);
      // emerging from the opening (darker, in the die's shadow) → full; fading as it reaches the lens
      const born = Math.min(1, p.age / 0.35);
      ctx.globalAlpha = born * (0.55 + 0.45 * Math.min(1, (1 - p.z) / 0.2)) * Math.min(1, (p.z - 0.3) / 0.12);
      ctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr);
      ctx.rotate(p.a);
      ctx.scale(scale, scale * (0.42 + 0.58 * Math.abs(Math.cos(p.ph))));
      ctx.drawImage(img, -p.s.w / 2 - pad, -p.s.h / 2 - pad);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  };

  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    const dt = (now - last) / 1000;
    if (dt >= 1 / 62) { // ~60 fps, also on 120 Hz screens
      last = now;
      step(Math.min(dt, 0.05));
      draw();
    }
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    if (!started || reduce || raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };

  new ResizeObserver(measure).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }).observe(canvas);
  narrow.addEventListener('change', measure);

  // The current family's sprites (a few ~160 px cut-outs) are requested at once and ahead of the rest: on a phone
  // the lazy cards below the hero would otherwise queue in front of them. The stream starts once the hero has
  // painted and the page goes idle, not at the page's `load`, which those cards hold back for seconds (16 s on a
  // slow 4G line): the die would stand still until then.
  const sprited = load(fam, true);
  frame().then(() => idle(700)).then(async () => {
    await sprited;
    measure();
    started = true;
    if (reduce) {
      // one still frame: the stream as it looks a few seconds in
      for (let t = 0; t < 4; t += 1 / 30) step(1 / 30);
      draw();
    } else {
      // pre-roll, so the first frame is already a full stream, not a die that starts spitting
      for (let t = 0; t < 2.2; t += 1 / 30) step(1 / 30);
      canvas.classList.add('is-live');
      run();
    }
    // the other families' sprites (and their blurred copies) can wait for the page itself
    afterLoad().then(() => Object.keys(families).forEach((k) => load(k)));
  });

  return {
    set(next: string) {
      if (next === fam || !families[next]) return;
      fam = next;
      load(next, true);
    },
  };
}
