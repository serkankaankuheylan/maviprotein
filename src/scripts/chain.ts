/**
 * Production chain compass (components/Chain.astro).
 *
 * The page scrolls freely and natively: nothing is intercepted. The track is n steps long plus one
 * screen; scroll position maps to a position t (0…n-1, half a step of rest at both ends), eased with a
 * short hold on either side of each step (HOLD) so slow reading lands on whole objects. A soft detent
 * (detent.ts) smooths wheel steps and, once the page is still, lets only the dial finish its turn onto
 * the nearest whole step — never resting half-way through a dissolve, never moving the page.
 */
import { createChainGL, type ChainGL } from './chain-gl';
import { createDetent } from './detent';
import { afterLoad, idle } from './gl';

const HOLD = 0.15; // share of each step spent at rest on either side
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function mountChain(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-chain-track]');
  if (!track) return;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-chain-step]')];
  const list = root.querySelector<HTMLElement>('[data-chain-steps]')!;
  const tags = [...root.querySelectorAll<SVGGElement>('[data-chain-tag]')];
  const segs = [...root.querySelectorAll<HTMLButtonElement>('[data-chain-go]')];
  const objs = [...root.querySelectorAll<HTMLImageElement>('[data-chain-obj]')];
  const ring = root.querySelector<SVGGElement>('[data-chain-ring]')!;
  const arc = root.querySelector<SVGCircleElement>('[data-chain-arc]')!;
  const odo = root.querySelector<HTMLElement>('[data-chain-odo]')!;
  const pool = root.querySelector<HTMLElement>('[data-chain-pool]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-chain-gl]')!;
  const n = steps.length;
  if (n < 2) return;
  const glows = ['#d9e3ee', '#ecd6b1', '#cfe3c4', '#c7e6f4', '#ead8bd', '#d6dde4', '#cde4f2', '#d4e8f1'];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const per = 360 / n;

  const stage = root.querySelector<HTMLElement>('.chain__stage')!;
  let active = -1;
  let gl: ChainGL | null = null;
  let p = 0; // page progress through the pinned track, 0..1 (read with the scroll)

  // Only the first object ships with a source. The others (~1 MB) wait in data-src until the page itself
  // has loaded and gone idle, or until the reader enters the track, so they never compete with the fonts
  // and the hero. A step whose object is still on its way holds its neighbour (chain-gl / cross-fade).
  let rest = false;
  const hydrateRest = () => {
    if (rest) return;
    rest = true;
    objs.forEach((o) => {
      if (o.dataset.srcset) o.srcset = o.dataset.srcset;
      if (o.dataset.src) o.src = o.dataset.src;
      o.removeAttribute('data-srcset');
      o.removeAttribute('data-src');
    });
  };
  afterLoad().then(hydrateRest);

  /** scroll → t (linear, in steps); also updates p. Geometry is read live each frame (before any
      write, so it costs no forced layout): content above or the stage's own height may change. */
  const read = () => {
    const r = track.getBoundingClientRect();
    const span = Math.max(1, r.height - (stage.offsetHeight || innerHeight));
    p = Math.min(1, Math.max(0, -r.top / span));
    if (p > 0) hydrateRest();
    return Math.min(n - 1, Math.max(0, p * n - 0.5));
  };
  const ease = (t: number) => {
    const i = Math.min(n - 2, Math.floor(t));
    return i + smooth(HOLD, 1 - HOLD, t - i);
  };
  /** where t rests whole: inside a hold already, or the nearest hold edge (a little biased toward the
      direction the reader was going) */
  const nearest = (t: number, dir: number) => {
    t = Math.min(n - 1, Math.max(0, t));
    const i = Math.min(n - 2, Math.floor(t));
    const f = t - i;
    if (f <= HOLD || f >= 1 - HOLD) return t;
    return f < 0.5 - dir * 0.05 ? i + HOLD : i + 1 - HOLD;
  };

  const setActive = (i: number) => {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    list.style.setProperty('--dir', String(dir));
    steps.forEach((s, k) => {
      s.classList.toggle('is-on', k === i);
      s.classList.toggle('is-ahead', k > i);
    });
    tags.forEach((g, k) => { g.classList.toggle('is-on', k === i); g.classList.toggle('is-past', k < i); });
    segs.forEach((b, k) => b.toggleAttribute('aria-current', k === i));
    pool.style.setProperty('--glow', glows[i % glows.length]);
    active = i;
  };

  /** te: dial position in steps; p: page progress through the track */
  let shown = NaN, shownP = NaN;
  const render = (te: number, p: number) => {
    if (te === shown && p === shownP) return;
    shown = te; shownP = p;
    const close = smooth((n - 0.5) / n, 1, p); // the last half-step closes the ring
    const still = reduce.matches;
    ring.style.setProperty('--rot', `${(still ? -Math.round(te) : -te) * per}deg`);
    arc.style.setProperty('--arc', String(te * per + close * per));
    odo.style.setProperty('--odo', (still ? Math.round(te) : te).toFixed(3));
    segs.forEach((b, k) => b.style.setProperty('--f', String(Math.min(1, Math.max(0, te - k + 1)))));
    setActive(Math.round(te));

    const i = Math.min(n - 2, Math.floor(te));
    const m = te - i;
    if (gl) gl.draw(i, i + 1, still ? (m < 0.5 ? 0 : 1) : m);
    else objs.forEach((o, k) => {
      const d = Math.abs(te - k);
      const o1 = Math.max(0, 1 - d * (still ? 2 : 1.6));
      o.style.opacity = o1.toFixed(3);
      o.style.transform = still ? '' : `translateY(${((k - te) * 6).toFixed(2)}%) scale(${(1 - Math.min(1, d) * 0.08).toFixed(3)})`;
      o.style.filter = still ? '' : `blur(${(Math.min(1, d) * 8).toFixed(1)}px) drop-shadow(0 24px 22px rgba(13,27,44,.16))`;
    });
  };

  // ---- free scroll with a soft detent ---------------------------------------------------------------
  const detent = createDetent({
    read,
    nearest,
    apply: (t) => render(ease(Math.min(n - 1, Math.max(0, t))), p),
    jump: 1.5,
    eps: 1e-4,
  });
  const redraw = () => { shown = NaN; render(ease(Math.min(n - 1, Math.max(0, detent.value()))), p); };

  // nav segments and keyboard focus: a native smooth scroll to the middle of that step's rest
  const go = (k: number) => {
    const r = track.getBoundingClientRect();
    const span = Math.max(1, r.height - (stage.offsetHeight || innerHeight));
    scrollTo({ top: r.top + scrollY + ((k + 0.5) / n) * span + 1, behavior: reduce.matches ? 'auto' : 'smooth' });
  };
  segs.forEach((b, k) => b.addEventListener('click', () => go(k)));
  steps.forEach((s, k) => s.addEventListener('focusin', () => { if (k !== active) go(k); }));

  // WebGL only once the stage is near, and only if the objects decode
  const io = new IntersectionObserver(async (es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    objs.forEach((o) => (o.loading = 'eager'));
    await idle(1200);
    try {
      gl = await createChainGL(canvas, objs);
      if (gl) { root.classList.add('is-gl'); objs.forEach((o) => { o.style.opacity = ''; o.style.transform = ''; o.style.filter = ''; }); }
    } catch { gl = null; }
    redraw();
  }, { rootMargin: '60% 0px' });
  io.observe(track);
  canvas.addEventListener('webglcontextlost', () => { gl = null; root.classList.remove('is-gl'); redraw(); });

  new ResizeObserver(() => { gl?.resize(); redraw(); detent.kick(); }).observe(track);
  // on phones the dial follows the free height (browser bars, header): keep the canvas sharp as it grows
  new ResizeObserver(() => { if (gl) { gl.resize(); redraw(); } }).observe(canvas);
  detent.reset();
}
