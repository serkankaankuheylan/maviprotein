/**
 * Free scrolling with a soft detent — for pinned, scroll-driven scenes (Chain, Journey).
 *
 * Nothing is intercepted: the page always scrolls natively, at the reader's own pace, with the
 * browser's own momentum, and no input is ever cancelled. The scene follows the scroll with a light
 * smoothing (a mouse wheel's steps become glides). When the page comes to rest between two stops, only
 * the scene eases onto the nearest stop — the page itself does not move — so it never rests half-way
 * through a dissolve or between two machines. When the reader scrolls again, that small difference is
 * worked off by the scroll itself, never against it: going on, the scene moves a little slower than the
 * finger; turning back, a little faster, until the two agree again.
 *
 * Cost: passive listeners only; a rAF loop runs while the page moves and for the short settle after.
 */
export interface DetentOptions {
  /** the scene position the current scroll maps to, in any linear unit (steps, px) */
  read: () => number;
  /** the stop to rest on for a scene position, given the direction of the last movement (+1 / −1 / 0) */
  nearest: (pos: number, dir: number) => number;
  /** draw the scene at a position */
  apply: (pos: number) => void;
  /** a scroll jump bigger than this (anchor link, resize, restored scroll) is taken at once */
  jump: number;
  /** below this two positions count as the same */
  eps: number;
}
export interface Detent {
  /** re-read the scroll and run until the scene is at rest */
  kick(): void;
  /** forget any settle offset and draw the scroll position as it is */
  reset(): void;
  /** the position currently drawn */
  value(): number;
}

const FOLLOW = 0.05; // s: smoothing while scrolling (about three frames)
const SETTLE = 0.16; // s: the ease onto a stop once the page is still
const IDLE = 130; // ms of stillness, finger lifted, before settling
const GIVE = 0.6; // share of each scroll movement spent working off a settle offset

export function createDetent(o: DetentOptions): Detent {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let raw = o.read();
  let offset = 0; // scene − scroll, left by a settle and worked off by scrolling
  let shown = raw; // what is drawn
  let dir = 0, lastMove = -Infinity, touching = false, raf = 0, last = 0;

  const loop = (now: number) => {
    raf = 0;
    const dt = last ? Math.min(0.05, Math.max(0.001, (now - last) / 1000)) : 1 / 60;
    last = now;

    const r = o.read();
    const d = r - raw;
    if (Math.abs(d) > o.eps) {
      if (Math.abs(d) > o.jump) { offset = 0; shown = r; }
      else if (offset) {
        // the reader is moving again: spend part of the movement on the offset, so the scene never
        // runs against the finger and catches up without a lurch
        const give = Math.abs(d) * GIVE;
        offset = Math.abs(offset) <= give ? 0 : offset - Math.sign(offset) * give;
      }
      dir = Math.sign(d);
      raw = r;
      lastMove = now;
    }

    const still = !touching && now - lastMove > IDLE;
    let goal = offset;
    if (still && !reduce.matches) {
      goal = o.nearest(raw + offset, dir) - raw;
      offset += (goal - offset) * (1 - Math.exp(-dt / SETTLE));
      if (Math.abs(goal - offset) < o.eps) offset = goal;
    }

    const pos = raw + offset;
    shown = reduce.matches ? pos : shown + (pos - shown) * (1 - Math.exp(-dt / FOLLOW));
    if (Math.abs(pos - shown) < o.eps) shown = pos;
    o.apply(shown);

    const atRest = shown === pos && (reduce.matches || (still && offset === goal) || (touching && now - lastMove > IDLE));
    if (atRest) last = 0;
    else raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  addEventListener('scroll', kick, { passive: true });
  addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const lift = () => { touching = false; kick(); };
  addEventListener('touchend', lift, { passive: true });
  addEventListener('touchcancel', lift, { passive: true });
  addEventListener('resize', kick, { passive: true });

  return {
    kick,
    reset() { raw = o.read(); offset = 0; shown = raw; o.apply(shown); kick(); },
    value: () => shown,
  };
}
