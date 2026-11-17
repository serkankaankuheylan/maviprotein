/**
 * A small isometric drafting engine for the turnkey facility plates (TASARIM.md §3.4: facilities are drawn as
 * illustrative technical drawings, never generated as fake photos).
 *
 * World units are metres. x runs to the lower right, y to the lower left, z up; the viewer looks from
 * (+x, +y, +z), so every solid shows its top ("t"), its +y face ("l", lower left) and its +x face ("r", lower
 * right). A plate is a stack of layers; each layer has floor work drawn first (`pre`: ground, zone tints, door
 * swings), then its solids back to front, then `post`. Solids are ordered by a separating-axis test on their
 * bounding boxes and a topological sort, so a plate is a true hidden-surface drawing in plain SVG paths.
 * Phantom lines (the building envelope, ISO 128 long-dash) go on top of everything.
 *
 * Zones and flows are not part of the drawing: they are returned as projected geometry for the interactive
 * overlay (FacilitySet.astro), so the same plate can light a zone or trace a flow without being redrawn.
 */

export type V3 = [number, number, number];
export type V2 = [number, number];
export type XY = [number, number];
export type Tint = 'w' | 'l' | 'p' | 'c' | 's' | 'm';
export type FlowKind = 'water' | 'product' | 'air';

interface BB { x0: number; y0: number; z0: number; x1: number; y1: number; z1: number }
interface Solid { bb: BB; svg: string }
interface Layer { pre: string[]; solids: Solid[]; post: string[] }
interface ZoneDef { key: string; polys: XY[][]; z0: number; h: number; tint: Tint; at?: V3 }
interface FlowDef { kind: FlowKind; pts: V3[]; arc: number }

export interface ZoneOut { key: string; tint: Tint; top: string; sides: string; hull: string; leader: string; mark: V2 }
export interface FlowOut { kind: FlowKind; d: string; arrows: string }
export interface PlateOut { svg: string; vb: [number, number, number, number]; zones: ZoneOut[]; flows: FlowOut[] }

export interface Door { at: number; w: number; arc?: boolean }
export interface Building {
  x0: number; y0: number; x1: number; y1: number;
  /** wall thickness, cut height (walls are drawn cut, plan-style), eave and ridge heights of the phantom envelope */
  t?: number; cut?: number; eave?: number; ridge?: number; ridgeAxis?: 'x' | 'y';
  doors?: ({ side: 'x0' | 'x1' | 'y0' | 'y1' } & Door)[];
  /** interior partitions; `from`/`to` run along the axis, `at` is the fixed coordinate */
  parts?: { axis: 'x' | 'y'; at: number; from: number; to: number; doors?: Door[]; t?: number; h?: number }[];
  /** walls drawn to full height instead of cut (e.g. a gable end carrying fans) */
  full?: ('x0' | 'x1' | 'y0' | 'y1')[];
  /** no phantom envelope (the caller draws its own frame) */
  bare?: boolean;
  /** an open shed: no walls, only the phantom roof */
  open?: boolean;
}

const CO = Math.cos(Math.PI / 6);
/** svg units per metre */
const K = 10;
/** isometric ellipse of a horizontal circle: rx = r·√2·cos30·K, ry = r·√2/2·K */
const ERX = Math.SQRT2 * CO * K;
const ERY = (Math.SQRT2 / 2) * K;
const f = (n: number) => String(Math.round(n * 10) / 10);

function hull(p: V2[]): V2[] {
  const pts = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: V2[] = [], hi: V2[] = [];
  for (const q of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = pts.length - 1; i >= 0; i--) { const q = pts[i]; while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
const d2 = (p: V2[], close = true) => p.map(([x, y], i) => (i ? 'L' : 'M') + f(x) + ' ' + f(y)).join('') + (close ? 'Z' : '');

/** Back-to-front order of solids: separating axis on bounding boxes, for pairs whose screen hexagons overlap. */
function order(items: Solid[]): Solid[] {
  const n = items.length, E = 1e-6;
  const H = items.map(({ bb: b }) => [b.x0 - b.y1, b.x1 - b.y0, b.x0 - b.z1, b.x1 - b.z0, b.y0 - b.z1, b.y1 - b.z0]);
  const before: number[][] = items.map(() => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = H[i], c = H[j];
    if (a[1] <= c[0] + E || c[1] <= a[0] + E || a[3] <= c[2] + E || c[3] <= a[2] + E || a[5] <= c[4] + E || c[5] <= a[4] + E) continue;
    const A = items[i].bb, B = items[j].bb;
    let iFirst: boolean;
    if (A.x1 <= B.x0 + E) iFirst = true;
    else if (B.x1 <= A.x0 + E) iFirst = false;
    else if (A.y1 <= B.y0 + E) iFirst = true;
    else if (B.y1 <= A.y0 + E) iFirst = false;
    else if (A.z1 <= B.z0 + E) iFirst = true;
    else if (B.z1 <= A.z0 + E) iFirst = false;
    else iFirst = A.x0 + A.x1 + A.y0 + A.y1 + A.z0 + A.z1 <= B.x0 + B.x1 + B.y0 + B.y1 + B.z0 + B.z1;
    if (iFirst) before[j].push(i); else before[i].push(j);
  }
  const out: Solid[] = [], st = new Uint8Array(n);
  const visit = (k: number) => {
    if (st[k]) return;
    st[k] = 1;
    for (const b of before[k]) visit(b);
    st[k] = 2;
    out.push(items[k]);
  };
  for (let k = 0; k < n; k++) visit(k);
  return out;
}

/** gaps cut out of a run [a, b] */
function runs(a: number, b: number, gaps: Door[] = []): [number, number][] {
  const g = [...gaps].sort((p, q) => p.at - q.at);
  const out: [number, number][] = [];
  let s = a;
  for (const { at, w } of g) { const g0 = at - w / 2, g1 = at + w / 2; if (g0 > s) out.push([s, Math.min(g0, b)]); s = Math.max(s, g1); }
  if (s < b) out.push([s, b]);
  return out.filter(([p, q]) => q - p > 0.02);
}

export class Plate {
  private L: Layer[] = [{ pre: [], solids: [], post: [] }];
  private li = 0;
  private top: string[] = [];
  private zs: ZoneDef[] = [];
  private fs: FlowDef[] = [];
  private bx = [Infinity, -Infinity];
  private by = [Infinity, -Infinity];

  /* ---------------- projection & raw output ---------------- */

  /** project a world point (and grow the frame) */
  P(x: number, y: number, z: number): V2 {
    const sx = (x - y) * CO * K, sy = ((x + y) / 2 - z) * K;
    this.grow(sx, sy);
    return [sx, sy];
  }
  private grow(sx: number, sy: number) {
    if (sx < this.bx[0]) this.bx[0] = sx;
    if (sx > this.bx[1]) this.bx[1] = sx;
    if (sy < this.by[0]) this.by[0] = sy;
    if (sy > this.by[1]) this.by[1] = sy;
  }
  d(pts: V3[], close = true) { return d2(pts.map((q) => this.P(...q)), close); }
  path(pts: V3[], cls: string, close = true) { return `<path class="${cls}" d="${this.d(pts, close)}"/>`; }

  layer(i: number) { while (this.L.length <= i) this.L.push({ pre: [], solids: [], post: [] }); this.li = i; return this; }
  pre(svg: string) { this.L[this.li].pre.push(svg); }
  post(svg: string) { this.L[this.li].post.push(svg); }
  over(svg: string) { this.top.push(svg); }
  add(bb: BB, svg: string) { this.L[this.li].solids.push({ bb, svg }); }
  solid(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, svg: string) {
    this.add({ x0: Math.min(x0, x1), y0: Math.min(y0, y1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), y1: Math.max(y0, y1), z1: Math.max(z0, z1) }, svg);
  }

  /* ---------------- faces ---------------- */

  faces(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, m: string, which = 'tlr') {
    let s = '';
    if (which.includes('l')) s += this.path([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], m + ' l');
    if (which.includes('r')) s += this.path([[x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [x1, y0, z0]], m + ' r');
    if (which.includes('t')) s += this.path([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], m + ' t');
    return s;
  }
  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, m = 'st', which = 'tlr', extra = '') {
    this.solid(x0, y0, z0, x1, y1, z1, this.faces(x0, y0, z0, x1, y1, z1, m, which) + extra);
  }
  /** a flat polygon on a horizontal plane */
  flat(poly: XY[], z: number, cls: string) { return this.path(poly.map(([x, y]) => [x, y, z] as V3), cls); }
  /** polyline (open) */
  line(pts: V3[], cls = 'e') { return this.path(pts, cls, false); }

  /* ---------------- round things ---------------- */

  private E(cx: number, cy: number, z: number, r: number) {
    const [x, y] = this.P(cx, cy, z);
    const rx = r * ERX, ry = r * ERY;
    this.grow(x - rx, y - ry); this.grow(x + rx, y + ry);
    return { x, y, rx, ry };
  }
  ellipse(cx: number, cy: number, z: number, r: number, cls: string) {
    const e = this.E(cx, cy, z, r);
    return `<ellipse class="${cls}" cx="${f(e.x)}" cy="${f(e.y)}" rx="${f(e.rx)}" ry="${f(e.ry)}"/>`;
  }
  /** visible side of a vertical cylinder */
  cylSide(cx: number, cy: number, r: number, z0: number, z1: number, m: string) {
    const t = this.E(cx, cy, z1, r), b = this.E(cx, cy, z0, r);
    const { rx, ry } = t;
    return `<path class="${m} c" d="M${f(t.x - rx)} ${f(t.y)}L${f(b.x - rx)} ${f(b.y)}A${f(rx)} ${f(ry)} 0 0 0 ${f(b.x + rx)} ${f(b.y)}L${f(t.x + rx)} ${f(t.y)}A${f(rx)} ${f(ry)} 0 0 1 ${f(t.x - rx)} ${f(t.y)}Z"/>`;
  }
  /** cone hanging below a circle at z (apex `depth` lower) */
  coneDown(cx: number, cy: number, r: number, z: number, depth: number, m: string) {
    const e = this.E(cx, cy, z, r);
    const [, ay] = this.P(cx, cy, z - depth);
    const H = ay - e.y;
    if (H <= e.ry + 0.05) return '';
    const yt = (e.ry * e.ry) / H, xt = e.rx * Math.sqrt(1 - (e.ry * e.ry) / (H * H));
    return `<path class="${m} c" d="M${f(e.x - e.rx)} ${f(e.y)}A${f(e.rx)} ${f(e.ry)} 0 0 0 ${f(e.x - xt)} ${f(e.y + yt)}L${f(e.x)} ${f(ay)}L${f(e.x + xt)} ${f(e.y + yt)}A${f(e.rx)} ${f(e.ry)} 0 0 0 ${f(e.x + e.rx)} ${f(e.y)}Z"/>`;
  }
  /** conical roof rising `h` above a circle at z */
  coneUp(cx: number, cy: number, r: number, z: number, h: number, m: string) {
    const e = this.E(cx, cy, z, r);
    const [ax, ay] = this.P(cx, cy, z + h);
    const H = e.y - ay;
    if (H <= e.ry + 0.05) {
      // a shallow cone: its apex falls inside the rim; draw the rim and the two visible ridges to the apex
      return this.ellipse(cx, cy, z, r, m + ' t') + `<path class="e" d="M${f(e.x - e.rx)} ${f(e.y)}L${f(ax)} ${f(ay)}L${f(e.x + e.rx)} ${f(e.y)}M${f(ax)} ${f(ay)}L${f(e.x)} ${f(e.y + e.ry)}"/>`;
    }
    const yt = -(e.ry * e.ry) / H, xt = e.rx * Math.sqrt(1 - (e.ry * e.ry) / (H * H));
    return `<path class="${m} c" d="M${f(e.x - xt)} ${f(e.y + yt)}L${f(ax)} ${f(ay)}L${f(e.x + xt)} ${f(e.y + yt)}A${f(e.rx)} ${f(e.ry)} 0 1 1 ${f(e.x - xt)} ${f(e.y + yt)}Z"/>`;
  }
  /** dished head `h` high on a circle at z */
  dome(cx: number, cy: number, r: number, z: number, h: number, m: string) {
    const e = this.E(cx, cy, z, r);
    const ry2 = Math.sqrt(e.ry * e.ry + h * K * h * K);
    this.grow(e.x, e.y - ry2);
    return `<path class="${m} t" d="M${f(e.x - e.rx)} ${f(e.y)}A${f(e.rx)} ${f(ry2)} 0 0 1 ${f(e.x + e.rx)} ${f(e.y)}A${f(e.rx)} ${f(e.ry)} 0 0 1 ${f(e.x - e.rx)} ${f(e.y)}Z"/>` +
      `<path class="e" d="M${f(e.x - e.rx)} ${f(e.y)}A${f(e.rx)} ${f(e.ry)} 0 0 0 ${f(e.x + e.rx)} ${f(e.y)}" fill="none"/>`;
  }
  /** the lens of a liquid surface seen inside an open round tank (rim at zt, liquid at zw) */
  lens(cx: number, cy: number, r: number, zt: number, zw: number, cls: string) {
    const t = this.E(cx, cy, zt, r);
    const dd = (zt - zw) * K;
    if (dd >= 2 * t.ry - 0.1) return '';
    if (dd <= 0.05) return this.ellipse(cx, cy, zt, r, cls);
    const yi = t.y + dd / 2, xi = t.rx * Math.sqrt(1 - (dd / 2) ** 2 / (t.ry * t.ry));
    return `<path class="${cls}" d="M${f(t.x - xi)} ${f(yi)}A${f(t.rx)} ${f(t.ry)} 0 0 1 ${f(t.x + xi)} ${f(yi)}A${f(t.rx)} ${f(t.ry)} 0 0 1 ${f(t.x - xi)} ${f(yi)}Z"/>`;
  }
  /** a circle drawn on a vertical face (axis = the face normal) */
  disc(axis: 'x' | 'y', c: V3, r: number, cls: string, n = 24) {
    const pts: V3[] = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, u = Math.cos(a) * r, v = Math.sin(a) * r;
      pts.push(axis === 'x' ? [c[0], c[1] + u, c[2] + v] : [c[0] + u, c[1], c[2] + v]);
    }
    return this.path(pts, cls);
  }
  /** arc on a horizontal plane, angles in degrees (0 = +x, 90 = +y) */
  arc(cx: number, cy: number, z: number, r: number, a0: number, a1: number, cls = 'e', close = false) {
    const pts: V3[] = [];
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 7.5));
    for (let i = 0; i <= n; i++) { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]); }
    if (close) pts.push([cx, cy, z]);
    return this.path(pts, cls, close);
  }

  /** closed vertical vessel: flat, dished or conical head; flat or conical bottom; optional legs */
  vessel(cx: number, cy: number, r: number, z0: number, h: number, m = 'st', o: { head?: 'flat' | 'dome' | 'cone'; headH?: number; cone?: number; legs?: number; extra?: string } = {}) {
    const zb = z0 + (o.legs ?? 0) + (o.cone ?? 0), zt = zb + h;
    let s = '';
    if (o.legs) s += this.legs(cx, cy, r * 0.82, z0, z0 + o.legs + (o.cone ?? 0) * 0.5, 'back');
    if (o.cone) s += this.coneDown(cx, cy, r, zb, o.cone, m);
    s += this.cylSide(cx, cy, r, zb, zt, m);
    const head = o.head ?? 'flat', hh = o.headH ?? r * 0.35;
    if (head === 'flat') s += this.ellipse(cx, cy, zt, r, m + ' t');
    else if (head === 'dome') s += this.dome(cx, cy, r, zt, hh, m);
    else s += this.coneUp(cx, cy, r, zt, hh, m);
    if (o.legs) s += this.legs(cx, cy, r * 0.82, z0, z0 + o.legs + (o.cone ?? 0) * 0.5, 'front');
    s += o.extra ?? '';
    this.solid(cx - r, cy - r, z0, cx + r, cy + r, zt + (head === 'flat' ? 0 : hh), s);
  }
  private legs(cx: number, cy: number, r: number, z0: number, z1: number, which: 'back' | 'front') {
    const angs = which === 'back' ? [225, 135, 315] : [45];
    return angs.map((a) => { const q = (a * Math.PI) / 180, x = cx + Math.cos(q) * r, y = cy + Math.sin(q) * r; return this.line([[x, y, z0], [x, y, z1]], 'lg'); }).join('');
  }
  /** open round tank with its liquid */
  tank(cx: number, cy: number, r: number, z0: number, h: number, o: { m?: string; level?: number; liquid?: string; cone?: number; legs?: number; drain?: boolean } = {}) {
    const m = o.m ?? 'pe', zb = z0 + (o.legs ?? 0) + (o.cone ?? 0), zt = zb + h;
    let s = '';
    if (o.legs) s += this.legs(cx, cy, r * 0.82, z0, z0 + o.legs + (o.cone ?? 0) * 0.5, 'back');
    if (o.cone) s += this.coneDown(cx, cy, r, zb, o.cone, m);
    s += this.cylSide(cx, cy, r, zb, zt, m);
    s += this.ellipse(cx, cy, zt, r, m + ' in');
    const zw = zt - (o.level ?? Math.min(0.2, h * 0.15));
    s += this.lens(cx, cy, r, zt, zw, o.liquid ?? 'wa');
    if (o.drain) s += this.ellipse(cx, cy, zw, Math.min(0.12, r * 0.08), 'dr');
    s += this.ellipse(cx, cy, zt, Math.max(r - 0.07, r * 0.95), 'e nf');
    if (o.legs) s += this.legs(cx, cy, r * 0.82, z0, z0 + o.legs + (o.cone ?? 0) * 0.5, 'front');
    this.solid(cx - r, cy - r, z0, cx + r, cy + r, zt, s);
  }
  /** open rectangular tank/basin with walls of thickness t */
  basin(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, o: { m?: string; t?: number; level?: number; liquid?: string; fill?: string } = {}) {
    const m = o.m ?? 'cn', t = o.t ?? 0.2, zw = z1 - (o.level ?? 0.25);
    let s = '';
    // inner faces of the two far walls, from the liquid up to the rim
    s += this.path([[x0 + t, y0 + t, z1], [x1 - t, y0 + t, z1], [x1 - t, y0 + t, zw], [x0 + t, y0 + t, zw]], m + ' l');
    s += this.path([[x0 + t, y0 + t, z1], [x0 + t, y1 - t, z1], [x0 + t, y1 - t, zw], [x0 + t, y0 + t, zw]], m + ' r');
    s += this.flat([[x0 + t, y0 + t], [x1 - t, y0 + t], [x1 - t, y1 - t], [x0 + t, y1 - t]], zw, o.liquid ?? 'wa');
    if (o.fill) s += `<path class="${o.fill}" d="${this.d([[x0 + t, y0 + t, zw], [x1 - t, y0 + t, zw], [x1 - t, y1 - t, zw], [x0 + t, y1 - t, zw]])}"/>`;
    // rim (frame) as one even-odd face
    s += `<path class="${m} t" fill-rule="evenodd" d="${this.d([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])}${this.d([[x0 + t, y0 + t, z1], [x0 + t, y1 - t, z1], [x1 - t, y1 - t, z1], [x1 - t, y0 + t, z1]])}"/>`;
    s += this.faces(x0, y0, z0, x1, y1, z1, m, 'lr');
    this.solid(x0, y0, z0, x1, y1, z1, s);
  }

  /* ---------------- prisms & pipes ---------------- */

  /**
   * A straight prism along an axis. `prof` is a convex profile in the plane across the axis: (y, z) for x,
   * (x, z) for y, (x, y) for z. `smooth` draws the side as one shaded hull (cylinders); otherwise each
   * visible face gets its own tone.
   */
  prism(axis: 'x' | 'y' | 'z', a0: number, a1: number, prof: XY[], m: string, smooth = false, extra = '') {
    const at = (a: number, [u, v]: XY): V3 => (axis === 'x' ? [a, u, v] : axis === 'y' ? [u, a, v] : [u, v, a]);
    const A = prof.map((q) => at(a0, q)), B = prof.map((q) => at(a1, q));
    const all = [...A, ...B];
    let s = '';
    if (smooth) s += `<path class="${m} c" d="${d2(hull(all.map((q) => this.P(...q))))}"/>`;
    else {
      const cu = prof.reduce((acc, q) => acc + q[0], 0) / prof.length, cv = prof.reduce((acc, q) => acc + q[1], 0) / prof.length;
      for (let i = 0; i < prof.length; i++) {
        const q0 = prof[i], q1 = prof[(i + 1) % prof.length];
        let nu = q1[1] - q0[1], nv = -(q1[0] - q0[0]);
        if (nu * ((q0[0] + q1[0]) / 2 - cu) + nv * ((q0[1] + q1[1]) / 2 - cv) < 0) { nu = -nu; nv = -nv; }
        const N: V3 = axis === 'x' ? [0, nu, nv] : axis === 'y' ? [nu, 0, nv] : [nu, nv, 0];
        const len = Math.hypot(...N) || 1;
        const [nx, ny, nz] = N.map((v) => v / len);
        if (nx + ny + nz <= 1e-6) continue;
        const face = nz >= 0.55 ? 't' : ny >= nx ? 'l' : 'r';
        s += this.path([at(a0, q0), at(a1, q0), at(a1, q1), at(a0, q1)], `${m} ${face}`);
      }
    }
    s += this.path(B, `${m} ${axis === 'x' ? 'r' : axis === 'y' ? 'l' : 't'}${smooth ? ' cap' : ''}`);
    s += extra;
    const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]), zs = all.map((q) => q[2]);
    this.solid(Math.min(...xs), Math.min(...ys), Math.min(...zs), Math.max(...xs), Math.max(...ys), Math.max(...zs), s);
  }
  /** horizontal cylinder along x or y, centred on (c1, c2) = (y, z) or (x, z) */
  hcyl(axis: 'x' | 'y', a0: number, a1: number, c1: number, c2: number, r: number, m = 'st', extra = '') {
    const prof: XY[] = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; prof.push([c1 + Math.cos(a) * r, c2 + Math.sin(a) * r]); }
    this.prism(axis, a0, a1, prof, m, true, extra);
  }
  /** a pipe run of axis-aligned segments; each segment is a sorted solid */
  pipe(pts: V3[], r: number, cls = 'pw') {
    const w = 2 * r * K;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dd = this.d([a, b], false);
      this.solid(Math.min(a[0], b[0]) - r, Math.min(a[1], b[1]) - r, Math.min(a[2], b[2]) - r, Math.max(a[0], b[0]) + r, Math.max(a[1], b[1]) + r, Math.max(a[2], b[2]) + r,
        `<path class="${cls} po" style="stroke-width:${f(w + 1.4)}" d="${dd}"/><path class="${cls} pi" style="stroke-width:${f(Math.max(0.6, w - 0.6))}" d="${dd}"/>`);
    }
  }
  /** a square beam between two arbitrary points (inclined conveyors, augers, stair flights) */
  beam(a: V3, b: V3, w: number, h: number, m = 'st') {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const px = (-dy / L) * (w / 2), py = (dx / L) * (w / 2);
    const c = (q: V3, sx: number, sz: number): V3 => [q[0] + px * sx, q[1] + py * sx, q[2] + sz];
    const corners = [a, b].flatMap((q) => [c(q, -1, 0), c(q, 1, 0), c(q, 1, h), c(q, -1, h)]);
    let s = `<path class="${m} c" d="${d2(hull(corners.map((q) => this.P(...q))))}"/>`;
    s += this.path([c(a, -1, h), c(b, -1, h), c(b, 1, h), c(a, 1, h)], m + ' t');
    const xs = corners.map((q) => q[0]), ys = corners.map((q) => q[1]), zs = corners.map((q) => q[2]);
    this.solid(Math.min(...xs), Math.min(...ys), Math.min(...zs), Math.max(...xs), Math.max(...ys), Math.max(...zs), s);
  }
  /** railing: posts every ~1.5 m and a top rail, along an axis-aligned run */
  rail(a: V3, b: V3, h = 1.1, cls = 'rl') {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(1, Math.round(L / 1.5));
    let s = this.line([[a[0], a[1], a[2] + h], [b[0], b[1], b[2] + h]], cls) + this.line([[a[0], a[1], a[2] + h * 0.5], [b[0], b[1], b[2] + h * 0.5]], cls);
    for (let i = 0; i <= n; i++) { const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t; s += this.line([[x, y, z], [x, y, z + h]], cls); }
    this.solid(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[0], b[0]) + 0.01, Math.max(a[1], b[1]) + 0.01, Math.max(a[2], b[2]) + h, s);
  }

  /** an excavated pond or channel: banks of `run` metres per metre of depth, and its water */
  pit(x0: number, y0: number, x1: number, y1: number, depth: number, o: { run?: number; level?: number; m?: string; liquid?: string; fill?: string } = {}) {
    const run = o.run ?? 2, s = depth * run, m = o.m ?? 'ea', lv = o.level ?? 0.4;
    const [bx0, by0, bx1, by1] = [x0 + s, y0 + s, x1 - s, y1 - s];
    let svg = this.path([[x0, y0, 0], [x1, y0, 0], [bx1, by0, -depth], [bx0, by0, -depth]], m + ' l');
    svg += this.path([[x0, y0, 0], [x0, y1, 0], [bx0, by1, -depth], [bx0, by0, -depth]], m + ' r');
    svg += this.path([[x0, y1, 0], [x1, y1, 0], [bx1, by1, -depth], [bx0, by1, -depth]], m + ' t');
    svg += this.path([[x1, y0, 0], [x1, y1, 0], [bx1, by1, -depth], [bx1, by0, -depth]], m + ' t');
    const w = lv * run;
    const wpoly: XY[] = [[x0 + w, y0 + w], [x1 - w, y0 + w], [x1 - w, y1 - w], [x0 + w, y1 - w]];
    svg += this.flat(wpoly, -lv, o.liquid ?? 'wa');
    if (o.fill) svg += this.flat(wpoly, -lv, o.fill);
    this.solid(x0, y0, -depth, x1, y1, 0, svg);
  }
  /** a raceway pond: stadium-shaped low wall along x, its liquid and the centre divider */
  stadium(x0: number, y0: number, x1: number, y1: number, h: number, liquid = 'al', extra = '') {
    const r = (y1 - y0) / 2, cy = (y0 + y1) / 2;
    const ring = (inset: number, z: number): V3[] => {
      const pts: V3[] = [], rr = r - inset;
      for (let i = 0; i <= 14; i++) { const a = -Math.PI / 2 + (Math.PI * i) / 14; pts.push([x1 - r + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]); }
      for (let i = 0; i <= 14; i++) { const a = Math.PI / 2 + (Math.PI * i) / 14; pts.push([x0 + r + Math.cos(a) * rr, cy + Math.sin(a) * rr, z]); }
      return pts;
    };
    let svg = `<path class="cn c" d="${d2(hull([...ring(0, 0), ...ring(0, h)].map((q) => this.P(...q))))}"/>`;
    svg += this.path(ring(0, h), 'cn t') + this.path(ring(0.25, h - 0.08), liquid);
    svg += this.faces(x0 + r, cy - 0.1, 0, x1 - r, cy + 0.1, h + 0.05, 'cn');
    svg += extra;
    this.solid(x0, y0, 0, x1, y1, h, svg);
  }
  /** points of an arch across a span (greenhouse and tunnel frames) */
  archPts(axis: 'x' | 'y', at: number, a0: number, a1: number, zs: number, zr: number, n = 14): V3[] {
    const pts: V3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, z = zs + (zr - zs) * Math.pow(Math.sin(Math.PI * t), 0.75), a = a0 + (a1 - a0) * t;
      pts.push(axis === 'x' ? [at, a, z] : [a, at, z]);
    }
    return pts;
  }

  /* ---------------- ground, buildings, phantom ---------------- */

  /** the site plinth, drawn first in the current layer */
  ground(x0: number, y0: number, x1: number, y1: number, depth = 0.5, m = 'sl', z = 0) {
    this.pre(this.faces(x0, y0, z - depth, x1, y1, z, m));
  }
  phantom(pts: V3[], close = false) { this.over(this.path(pts, 'ph', close)); }
  /** walls cut at `cut` (dark poché on the cut), a phantom envelope up to eave and ridge */
  building(o: Building) {
    const t = o.t ?? 0.3, cut = o.cut ?? 1.2, full = new Set(o.full ?? []);
    const eave = o.eave ?? 6, ridge = o.ridge ?? eave + 2;
    const { x0, y0, x1, y1 } = o;
    const doors = (side: string) => (o.doors ?? []).filter((d) => d.side === side);
    const hOf = (side: 'x0' | 'x1' | 'y0' | 'y1') => (full.has(side) ? eave : cut);
    if (!o.open) {
    for (const [a, b] of runs(x0, x1, doors('y0'))) this.box(a, y0, 0, b, y0 + t, hOf('y0'), 'wl');
    for (const [a, b] of runs(x0, x1, doors('y1'))) this.box(a, y1 - t, 0, b, y1, hOf('y1'), 'wl');
    for (const [a, b] of runs(y0 + t, y1 - t, doors('x0'))) this.box(x0, a, 0, x0 + t, b, hOf('x0'), 'wl');
    for (const [a, b] of runs(y0 + t, y1 - t, doors('x1'))) this.box(x1 - t, a, 0, x1, b, hOf('x1'), 'wl');
    }
    for (const d of o.doors ?? []) if (d.arc) {
      const inward = d.side === 'y0' ? 90 : d.side === 'y1' ? -90 : d.side === 'x0' ? 0 : 180;
      if (d.side === 'y0' || d.side === 'y1') {
        const y = d.side === 'y0' ? y0 + t : y1 - t, hx = d.at - d.w / 2;
        this.pre(this.arc(hx, y, 0.02, d.w, 0, inward) + this.line([[hx, y, 0.02], [hx, y + Math.sign(inward) * d.w, 0.02]], 'e'));
      } else {
        const x = d.side === 'x0' ? x0 + t : x1 - t, hy = d.at - d.w / 2;
        this.pre(this.arc(x, hy, 0.02, d.w, 90, inward === 0 ? 0 : 180) + this.line([[x, hy, 0.02], [x + (inward === 0 ? d.w : -d.w), hy, 0.02]], 'e'));
      }
    }
    for (const p of o.parts ?? []) {
      const pt = p.t ?? 0.15, ph = p.h ?? cut;
      for (const [a, b] of runs(p.from, p.to, p.doors)) {
        if (p.axis === 'x') this.box(a, p.at - pt / 2, 0, b, p.at + pt / 2, ph, 'wl');
        else this.box(p.at - pt / 2, a, 0, p.at + pt / 2, b, ph, 'wl');
      }
      for (const d of p.doors ?? []) if (d.arc) {
        const h0 = d.at - d.w / 2;
        if (p.axis === 'x') this.pre(this.arc(h0, p.at, 0.02, d.w, 0, 90) + this.line([[h0, p.at, 0.02], [h0, p.at + d.w, 0.02]], 'e'));
        else this.pre(this.arc(p.at, h0, 0.02, d.w, 90, 0) + this.line([[p.at, h0, 0.02], [p.at + d.w, h0, 0.02]], 'e'));
      }
    }
    if (o.bare) return;
    // phantom envelope: eaves, corners above the cut, gables and ridge
    this.phantom([[x0, y0, eave], [x1, y0, eave], [x1, y1, eave], [x0, y1, eave]], true);
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as XY[]) this.phantom([[x, y, o.open ? 0 : cut], [x, y, eave]]);
    if ((o.ridgeAxis ?? 'x') === 'x') {
      const ym = (y0 + y1) / 2;
      this.phantom([[x0, y0, eave], [x0, ym, ridge], [x0, y1, eave]]);
      this.phantom([[x1, y0, eave], [x1, ym, ridge], [x1, y1, eave]]);
      this.phantom([[x0, ym, ridge], [x1, ym, ridge]]);
    } else {
      const xm = (x0 + x1) / 2;
      this.phantom([[x0, y0, eave], [xm, y0, ridge], [x1, y0, eave]]);
      this.phantom([[x0, y1, eave], [xm, y1, ridge], [x1, y1, eave]]);
      this.phantom([[xm, y0, ridge], [xm, y1, ridge]]);
    }
  }
  /** structural columns cut like the walls */
  columns(pts: XY[], s = 0.35, h = 1.2) { for (const [x, y] of pts) this.box(x - s / 2, y - s / 2, 0, x + s / 2, y + s / 2, h, 'wl'); }

  /* ---------------- common equipment ---------------- */

  /** box truck: cab + body + wheels; `dir` is the way the cab faces */
  truck(x: number, y: number, dir: 'x+' | 'x-' | 'y+' | 'y-', len = 9) {
    const W = 2.5, cab = 2.2, bodyH = 3.6, cabH = 2.9;
    const along = dir[0] as 'x' | 'y', sgn = dir[1] === '+' ? 1 : -1;
    const seg = (a: number, b: number, z0: number, z1: number, m: string) => {
      const [p0, p1] = [Math.min(a, b), Math.max(a, b)];
      if (along === 'x') this.box(x + p0, y - W / 2, z0, x + p1, y + W / 2, z1, m);
      else this.box(x - W / 2, y + p0, z0, x + W / 2, y + p1, z1, m);
    };
    // body behind the cab, cab at the front end
    const bodyA = -sgn * len / 2, bodyB = sgn * (len / 2 - cab - 0.3);
    seg(bodyA, bodyB, 0.9, bodyH, 'tb');
    seg(sgn * (len / 2 - cab), sgn * len / 2, 0.6, cabH, 'tc');
    // chassis
    seg(bodyA, sgn * len / 2, 0.5, 0.9, 'dk');
  }
  /** pallet rack bay rows: uprights, beams and loads */
  racks(x0: number, y0: number, x1: number, y1: number, levels: number, axis: 'x' | 'y', o: { bay?: number; lh?: number; load?: string } = {}) {
    const bay = o.bay ?? 2.7, lh = o.lh ?? 1.6, load = o.load ?? 'ld';
    const len = axis === 'x' ? x1 - x0 : y1 - y0, n = Math.max(1, Math.round(len / bay));
    const step = len / n;
    for (let i = 0; i < n; i++) for (let l = 0; l < levels; l++) {
      const a = (axis === 'x' ? x0 : y0) + i * step + 0.12, b = a + step - 0.24, z = l * lh + 0.15;
      if (axis === 'x') this.box(a, y0 + 0.05, z, b, y1 - 0.05, z + lh * 0.72, load);
      else this.box(x0 + 0.05, a, z, x1 - 0.05, b, z + lh * 0.72, load);
    }
    // uprights and beams as one frame on the visible long side
    let s = '';
    for (let i = 0; i <= n; i++) {
      const a = (axis === 'x' ? x0 : y0) + i * step;
      if (axis === 'x') s += this.line([[a, y1, 0], [a, y1, levels * lh]], 'rk') + this.line([[a, y0, levels * lh], [a, y1, levels * lh]], 'rk');
      else s += this.line([[x1, a, 0], [x1, a, levels * lh]], 'rk') + this.line([[x0, a, levels * lh], [x1, a, levels * lh]], 'rk');
    }
    for (let l = 1; l <= levels; l++) {
      const z = l * lh;
      s += axis === 'x' ? this.line([[x0, y1, z], [x1, y1, z]], 'rk') : this.line([[x1, y0, z], [x1, y1, z]], 'rk');
    }
    this.solid(x0, y0, levels * lh - 0.01, x1, y1, levels * lh, s);
  }

  /* ---------------- overlay data ---------------- */

  /** a planning zone: tinted floor area(s), drawn now, and a volume for the overlay */
  zone(key: string, poly: XY[] | XY[][], o: { tint?: Tint; z0?: number; h?: number; at?: V3; noTint?: boolean } = {}) {
    const z0 = o.z0 ?? 0, tint = o.tint ?? 'p';
    const polys = (Array.isArray(poly[0][0]) ? poly : [poly]) as XY[][];
    if (!o.noTint) for (const q of polys) this.pre(this.flat(q, z0 + 0.01, `z z${tint}`));
    this.zs.push({ key, polys, z0, h: o.h ?? 3, tint, at: o.at });
  }
  /** a flow traced over the plate; `arc` > 0 lifts each leg into an arc of that rise per metre */
  flow(kind: FlowKind, pts: V3[], arc = 0) { this.fs.push({ kind, pts, arc }); }

  /* ---------------- output ---------------- */

  render(aspect = 1.6, css = ''): PlateOut {
    let body = '';
    for (const l of this.L) body += l.pre.join('') + order(l.solids).map((s) => s.svg).join('') + l.post.join('');
    body += this.top.join('');

    const zones = this.zs.map((z) => {
      const z1 = z.z0 + z.h;
      let sides = '', top = '';
      const pts: V2[] = [];
      for (const q of z.polys) {
        const area = q.reduce((a, [x, y], i) => { const [u, v] = q[(i + 1) % q.length]; return a + x * v - u * y; }, 0);
        const poly = area < 0 ? [...q].reverse() : q; // counter-clockwise in world xy
        for (let i = 0; i < poly.length; i++) {
          const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
          // outward normal of a CCW polygon is (dy, -dx); keep the faces turned to the viewer
          if (by - ay - (bx - ax) > 1e-6) sides += this.d([[ax, ay, z1], [bx, by, z1], [bx, by, z.z0], [ax, ay, z.z0]]);
        }
        top += this.d(poly.map(([x, y]) => [x, y, z1] as V3));
        for (const [x, y] of poly) pts.push(this.P(x, y, z.z0), this.P(x, y, z1));
      }
      const q0 = z.polys[0];
      const cx = q0.reduce((a, q) => a + q[0], 0) / q0.length, cy = q0.reduce((a, q) => a + q[1], 0) / q0.length;
      const at = z.at ?? [cx, cy, z1 + 0.6];
      const mark = this.P(...at);
      const leader = d2([this.P(at[0], at[1], z.z0), mark], false);
      return { key: z.key, tint: z.tint, top, sides, hull: d2(hull(pts)), leader, mark };
    });

    const raw = this.fs.map((fl) => {
      const pts: V2[] = [];
      if (fl.arc > 0) {
        for (let i = 0; i < fl.pts.length - 1; i++) {
          const a = fl.pts[i], b = fl.pts[i + 1];
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const n = 18;
          for (let k = i ? 1 : 0; k <= n; k++) {
            const t = k / n;
            const lift = 4 * t * (1 - t) * fl.arc * L;
            pts.push(this.P(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t + lift));
          }
        }
      } else for (const q of fl.pts) pts.push(this.P(...q));
      return { kind: fl.kind, pts, arc: fl.arc };
    });

    // frame: content bounds + margin, widened to the plate aspect
    const pad = Math.max(this.bx[1] - this.bx[0], this.by[1] - this.by[0]) * 0.035;
    let vx = this.bx[0] - pad, vy = this.by[0] - pad, vw = this.bx[1] - this.bx[0] + pad * 2, vh = this.by[1] - this.by[0] + pad * 2;
    if (vw / vh > aspect) { const nh = vw / aspect; vy -= (nh - vh) / 2; vh = nh; } else { const nw = vh * aspect; vx -= (nw - vw) / 2; vw = nw; }

    const ah = vw * 0.0075;
    const flows = raw.map(({ kind, pts, arc }) => {
      let arrows = '';
      const legs: [V2, V2][] = [];
      if (arc > 0) {
        // one arrow per arc, at its crown
        const per = 18;
        for (let i = 0; i + per <= pts.length - 1; i += per) legs.push([pts[i + per / 2 - 1], pts[i + per / 2 + 1]]);
      } else for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]];
        if (Math.hypot(b[0] - a[0], b[1] - a[1]) > ah * 7) legs.push([a, b]);
      }
      for (const [a, b] of legs) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
        const mx = (a[0] + b[0]) / 2 + ux * ah, my = (a[1] + b[1]) / 2 + uy * ah;
        arrows += `M${f(mx - ux * ah * 1.6 - uy * ah)} ${f(my - uy * ah * 1.6 + ux * ah)}L${f(mx)} ${f(my)}L${f(mx - ux * ah * 1.6 + uy * ah)} ${f(my - uy * ah * 1.6 - ux * ah)}`;
      }
      return { kind, d: d2(pts, false), arrows };
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(vx)} ${f(vy)} ${f(vw)} ${f(vh)}" width="1600" height="${Math.round(1600 / aspect)}"><style>${PLATE_CSS}${css}</style><defs>${DEFS}</defs>${body}</svg>`;
    return { svg, vb: [vx, vy, vw, vh], zones, flows };
  }
}

/* ---------------- plate style ----------------
   Paper-white tops, two steps of shade on the sides (light from the upper left), ink edges that keep their
   width at any size (non-scaling), poché on cut walls, water and plants as the only colour. */
const PLATE_CSS = `
path,ellipse{stroke:#1e2b3a;stroke-opacity:.8;stroke-width:.7;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.e{fill:none;stroke-width:.45;stroke-opacity:.55}.nf{fill:none}
.lg{fill:none;stroke-width:.9;stroke-opacity:.75}.rl{fill:none;stroke-width:.4;stroke-opacity:.6}.rk{fill:none;stroke-width:.55;stroke-opacity:.7}
.ph{fill:none;stroke-width:.6;stroke-opacity:.5;stroke-dasharray:9 3 1.5 3}
.po,.pi{fill:none;vector-effect:none;stroke-opacity:1}
.pw.po{stroke:#3d7fab}.pw.pi{stroke:#b6dcf0}.pa.po{stroke:#5d6874}.pa.pi{stroke:#e3e7eb}.pf.po{stroke:#8d6232}.pf.pi{stroke:#e6c290}.pk.po{stroke:#2b3035}.pk.pi{stroke:#59616a}
.sl.t{fill:#efebe4}.sl.l{fill:#dfd8cc}.sl.r{fill:#cfc7b9}
.cn.t{fill:#ebe8e1}.cn.l{fill:#dbd6cc}.cn.r{fill:#cbc4b7}.cn.c{fill:url(#gcn)}.cn.in{fill:#d9d4ca}
.wl.t{fill:#2a3644}.wl.l{fill:#efece6}.wl.r{fill:#dfd9cf}
.st.t{fill:#f6f8f9}.st.l{fill:#e3e8ec}.st.r{fill:#cfd6dc}.st.c{fill:url(#gst)}.st.in{fill:#d3d9df}
.pe.t{fill:#fbfaf8}.pe.l{fill:#ecebe6}.pe.r{fill:#dddbd4}.pe.c{fill:url(#gpe)}.pe.in{fill:#e2e0d9}
.bl.t{fill:#eef4f8}.bl.l{fill:#d9e5ee}.bl.r{fill:#c3d4e1}.bl.c{fill:url(#gbl)}.bl.in{fill:#cfdde8}
.dk.t{fill:#66727e}.dk.l{fill:#525d69}.dk.r{fill:#434d58}.dk.c{fill:url(#gdk)}
.tb.t{fill:#fbfbfa}.tb.l{fill:#eceeef}.tb.r{fill:#dde1e4}.tc.t{fill:#e6eaed}.tc.l{fill:#cdd4da}.tc.r{fill:#b9c2ca}
.ld.t{fill:#f3ede3}.ld.l{fill:#e7ddcd}.ld.r{fill:#d9cbb4}
.ea.t{fill:#e9e0cf}.ea.l{fill:#d8cab0}.ea.r{fill:#c8b797}.ea.c{fill:url(#gea)}
.gn.t{fill:#b7d2bf}.gn.l{fill:#a0c1aa}.gn.r{fill:#8bb096}.gn.c{fill:url(#ggn)}
.si.t{fill:#ddd6b4}.si.l{fill:#cdc49c}.si.r{fill:#bdb387}
.mn{fill:#c9b79a;stroke-opacity:.5}.mn2{fill:#b9a283}
.gl.t,.gl.l,.gl.r{fill:#fff;fill-opacity:.38;stroke-opacity:.45;stroke-width:.5}
.wa{fill:#cbe6f4;stroke:#2a6f9f;stroke-opacity:.5;stroke-width:.45}
.wd{fill:#c0e0f1;stroke:#2a6f9f;stroke-opacity:.45;stroke-width:.45}
.al{fill:#b9d9a9;stroke:#3f7a4f;stroke-opacity:.5;stroke-width:.45}
.ar{fill:#ecd3aa;stroke:#9a6a35;stroke-opacity:.5;stroke-width:.45}
.oil{fill:#e3cf7d;stroke:#8d6232;stroke-opacity:.5;stroke-width:.45}
.dr{fill:#1e2b3a;stroke:none;fill-opacity:.55}
.z{stroke-width:.5;stroke-opacity:.35;stroke-dasharray:4 3}
.zw{fill:#dceef7}.zl{fill:#e2efe6}.zp{fill:#f1ebe0}.zc{fill:#e2eaf2}.zs{fill:#f3efe8}.zm{fill:#f4e8d6}
.sd.t{fill:#e7dec9}.sd.l{fill:#d8cbaf}.sd.r{fill:#c8b997}
.ac.t{fill:#d7eacb}.ac.l{fill:#bcdcae}.ac.r{fill:#a5cd96}.ac.c{fill:url(#gac)}
.mo{fill:none;stroke-width:.5;stroke-opacity:.55}.net{fill:none;stroke-width:.35;stroke-opacity:.42}.sink{fill:none;stroke-width:.9;stroke-opacity:.6}
.wv{fill:url(#gwv);stroke:#2a6f9f;stroke-opacity:.35;stroke-width:.5}.ws{fill:#d5ecf7;fill-opacity:.55;stroke:#2a6f9f;stroke-opacity:.45;stroke-width:.5}
.hs{fill:none;stroke:#3a434c;stroke-width:.8;stroke-opacity:.8}.col{fill:none;stroke:#252b31;stroke-width:1.5;stroke-opacity:.95}.hr{fill:none;stroke-width:.45;stroke-opacity:.6}
.ice{fill:#f2f6f8;stroke-opacity:.4;stroke-width:.4}.acr{fill:#a9d6ee;fill-opacity:.75;stroke:#2a6f9f;stroke-opacity:.6}
.acr.t{fill:#cbe6f4}.acr.c{fill:url(#gacr)}
.hy.t{fill:#efe2b4}.hy.l{fill:#e2d29b}.hy.r{fill:#d3c185}
.fl{fill:#fff;fill-opacity:.42;stroke-opacity:.5;stroke-width:.5}
.pad.t{fill:#e0e8df}.pad.l{fill:#cfdccf}.pad.r{fill:#bccbbd}
.fan{fill:#3f4954;stroke-opacity:.9}.fb{fill:none;stroke:#cfd6dc;stroke-width:.5;stroke-opacity:.9}
.pan{fill:none;stroke-width:2.4;stroke-dasharray:0 4.5;stroke-opacity:.6}.fd{fill:none;stroke-width:.5;stroke-opacity:.6}
.drip{fill:none;stroke:#2a6f9f;stroke-width:.5;stroke-opacity:.6}.heat{fill:none;stroke:#9a6a35;stroke-width:.6;stroke-opacity:.55}
.grate{fill:#5b6672;fill-opacity:.45;stroke-opacity:.5}.ol{fill:#5f6b3c;stroke:#2f3520;stroke-opacity:.5;stroke-width:.4}
.stl{fill:none;stroke-width:.6;stroke-opacity:.7}.gls{fill:#fff;fill-opacity:.3;stroke:#1e2b3a;stroke-opacity:.35;stroke-width:.45}
.carc{fill:none;stroke-width:.5;stroke-opacity:.7}
.pd{fill:url(#pdot);stroke:none}.pg{fill:url(#pgn);stroke:none}
`;

const DEFS =
  `<linearGradient id="gst" x1="0" x2="1"><stop offset="0" stop-color="#f1f4f6"/><stop offset=".5" stop-color="#e2e7eb"/><stop offset="1" stop-color="#c4ccd3"/></linearGradient>` +
  `<linearGradient id="gpe" x1="0" x2="1"><stop offset="0" stop-color="#f8f7f4"/><stop offset=".5" stop-color="#e9e8e2"/><stop offset="1" stop-color="#d1cec6"/></linearGradient>` +
  `<linearGradient id="gbl" x1="0" x2="1"><stop offset="0" stop-color="#ecf3f8"/><stop offset=".5" stop-color="#d7e4ee"/><stop offset="1" stop-color="#b9ccdb"/></linearGradient>` +
  `<linearGradient id="gcn" x1="0" x2="1"><stop offset="0" stop-color="#eae7e0"/><stop offset=".5" stop-color="#dcd7ce"/><stop offset="1" stop-color="#c6bfb2"/></linearGradient>` +
  `<linearGradient id="gwv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#bfe0f1" stop-opacity=".22"/><stop offset="1" stop-color="#7fb9da" stop-opacity=".3"/></linearGradient>` +
  `<linearGradient id="gacr" x1="0" x2="1"><stop offset="0" stop-color="#cce7f5" stop-opacity=".9"/><stop offset="1" stop-color="#8cc4e2" stop-opacity=".9"/></linearGradient>` +
 `<linearGradient id="gac" x1="0" x2="1"><stop offset="0" stop-color="#d3e9c6"/><stop offset=".5" stop-color="#b6d9a6"/><stop offset="1" stop-color="#8fbf80"/></linearGradient>` +
  `<linearGradient id="gdk" x1="0" x2="1"><stop offset="0" stop-color="#6c7884"/><stop offset="1" stop-color="#3e4853"/></linearGradient>` +
  `<linearGradient id="gea" x1="0" x2="1"><stop offset="0" stop-color="#e6dccb"/><stop offset="1" stop-color="#c7b596"/></linearGradient>` +
  `<linearGradient id="ggn" x1="0" x2="1"><stop offset="0" stop-color="#b5d1bd"/><stop offset="1" stop-color="#86ab91"/></linearGradient>` +
  // dot grid lying in the floor plane (media, plant holes): pattern space is metres, mapped by the iso matrix
  `<pattern id="pdot" width=".6" height=".6" patternUnits="userSpaceOnUse" patternTransform="matrix(${f(CO * K)} ${f(K / 2)} ${f(-CO * K)} ${f(K / 2)} 0 0)"><circle cx=".3" cy=".3" r=".09" fill="#1e2b3a" fill-opacity=".35"/></pattern>` +
  `<pattern id="pgn" width=".5" height=".5" patternUnits="userSpaceOnUse" patternTransform="matrix(${f(CO * K)} ${f(K / 2)} ${f(-CO * K)} ${f(K / 2)} 0 0)"><rect width=".5" height=".5" fill="#e7efe5"/><circle cx=".25" cy=".25" r=".17" fill="#6f9f7c"/></pattern>`;
