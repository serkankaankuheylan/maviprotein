/**
 * Agriculture & livestock turnkey plates (services.json → agriculture-livestock → turnkey). Same drawing
 * rules as aqua.ts: a typical facility of each type at real proportions, walls cut at sill height,
 * envelopes in phantom line. Illustrative layouts, not a record of a specific project.
 */
import type { Plate, V3, XY } from '../iso';

const pallets = (P: Plate, pts: XY[], h = 1.2, s = 1.2) => { for (const [x, y] of pts) P.box(x, y, 0, x + s, y + s, h, 'ld'); };

/* ------------------------------------------------------------------ greenhouse */
export function sera(P: Plate) {
  const L = 48, SP = 9.6, Wd = SP * 4, gut = 5, rid = 6.6;
  P.ground(-14, -3, L + 3, Wd + 3, 0.5);
  P.zone('uretim', [[0.2, 0.2], [L - 0.2, 0.2], [L - 0.2, Wd - 0.2], [0.2, Wd - 0.2]], { tint: 'l', h: 2 });
  P.zone('gubre', [[-11.7, 0.3], [-6.08, 0.3], [-6.08, 11.7], [-11.7, 11.7]], { tint: 'w', h: 2.2, at: [-10.4, 2, 3.4] });
  P.zone('isitma', [[[-5.92, 0.3], [-1.3, 0.3], [-1.3, 11.7], [-5.92, 11.7]], [[-5.4, 13], [-1.4, 13], [-1.4, 17.4], [-5.4, 17.4]]], { tint: 'm', h: 2.6, at: [-3.6, 6.4, 3] });
  P.zone('depo', [[-12.8, 21.6], [-2.6, 21.6], [-2.6, 31.8], [-12.8, 31.8]], { tint: 'w', h: 3.4 });
  P.zone('ortu', [[0, 0], [L, 0], [L, 2 * SP], [0, 2 * SP]], { tint: 'l', z0: gut, h: rid - gut + 0.3, noTint: true });
  // headhouse: fertigation room and boiler room; the greenhouse knee wall
  P.building({ x0: -12, y0: 0, x1: -1, y1: 12, t: 0.3, cut: 1.2, eave: 4.6, ridge: 5.8, ridgeAxis: 'x', doors: [{ side: 'x1', at: 6, w: 2 }, { side: 'y1', at: -9, w: 1.1, arc: true }], parts: [{ axis: 'y', at: -6, from: 0.3, to: 11.7, doors: [{ at: 9.5, w: 1, arc: true }] }] });
  P.building({ x0: 0, y0: 0, x1: L, y1: Wd, t: 0.15, cut: 0.5, bare: true, doors: [{ side: 'x0', at: 6, w: 2 }, { side: 'y1', at: 24, w: 3 }] });
  for (const x of [-11, -9.7, -8.4]) P.vessel(x, 1.8, 0.55, 0, 1.5, 'pe', { head: 'dome', headH: 0.2 });
  P.box(-10.9, 5, 0, -8, 7.2, 1.5, 'st', 'tlr', P.line([[-10.9, 7.2, 1.1], [-8, 7.2, 1.1]], 'e'));
  P.box(-7.4, 9.2, 0, -6.6, 11.2, 2, 'st');
  P.box(-5.4, 3, 0, -2, 5, 0.3, 'st');
  P.hcyl('x', -5.4, -2, 4, 1.15, 0.85, 'st');
  P.vessel(-2.2, 8.6, 0.3, 0, 9.5, 'dk', { head: 'flat' });
  P.vessel(-3.4, 15.2, 1.6, 0, 6.8, 'st', { head: 'dome', headH: 0.5 });
  P.tank(-7.7, 26.7, 4.6, 0, 3, { m: 'cn', level: 0.5 });
  P.pipe([[-3.4, 2.2, 1.2], [-0.4, 2.2, 1.2], [-0.4, 2.2, 0.4], [0.7, 2.2, 0.4], [0.7, Wd - 0.6, 0.4]], 0.07, 'pf');
  P.pipe([[-7.7, 22.1, 1.2], [-7.7, 7.6, 1.2], [-9.4, 7.6, 1.2]], 0.07);
  P.pipe([[-8, 6, 0.9], [1.2, 6, 0.9], [1.2, 6, 0.25], [1.2, Wd - 1, 0.25]], 0.06);
  // crop rows: four double rows a span, drip lines along them
  let drip = '';
  for (let k = 0; k < 4; k++) for (const o of [1.3, 3.5, 5.9, 8.1]) {
    const y = k * SP + o;
    P.box(2.2, y, 0, L - 2, y + 0.45, 1.6, 'gn');
    drip += P.line([[1.2, y + 0.55, 0.05], [L - 2, y + 0.55, 0.05]], 'drip');
  }
  P.pre(drip);
  // the structure: posts, gutters, arches, ridge purlins
  for (let x = 0; x <= L; x += 4) for (let k = 0; k <= 4; k++) { const y = k * SP; P.box(x - 0.07, y - 0.07, 0.5, x + 0.07, y + 0.07, gut, 'st'); }
  for (let k = 0; k <= 4; k++) { const y = k * SP; P.box(0, y - 0.13, gut - 0.18, L, y + 0.13, gut, 'st'); }
  for (let x = 0; x <= L; x += 4) for (let k = 0; k < 4; k++) P.solid(x, k * SP, gut, x + 0.01, (k + 1) * SP, rid, P.line(P.archPts('x', x, k * SP, (k + 1) * SP, gut, rid, 10), 'stl'));
  for (let k = 0; k < 4; k++) { const y = k * SP + SP / 2; P.solid(0, y, rid, L, y + 0.01, rid, P.line([[0, y, rid], [L, y, rid]], 'stl')); }
  // film on the two back spans (the front two are left open), the back wall and a ridge vent each
  for (let k = 0; k < 2; k++) {
    const a = P.archPts('x', 0, k * SP, (k + 1) * SP, gut, rid, 10);
    for (let i = 0; i < a.length - 1; i++) {
      const [, y0, z0] = a[i], [, y1, z1] = a[i + 1];
      P.solid(0, Math.min(y0, y1), Math.min(z0, z1), L, Math.max(y0, y1), Math.max(z0, z1), P.path([[0, y0, z0], [L, y0, z0], [L, y1, z1], [0, y1, z1]], 'gls'));
    }
    const yv = k * SP + SP / 2;
    P.solid(2, yv, rid, L - 2, yv + 1.4, rid + 0.7, P.path([[2, yv, rid], [L - 2, yv, rid], [L - 2, yv + 1.3, rid + 0.65], [2, yv + 1.3, rid + 0.65]], 'gls'));
  }
  P.solid(0, -0.02, 0.5, L, 0, gut, P.path([[0, 0, 0.5], [L, 0, 0.5], [L, 0, gut], [0, 0, gut]], 'gls'));

  P.flow('water', [[-7.7, 26.7, 3.6], [-9.4, 6.1, 2], [1.2, 6, 0.8], [1.2, 34.6, 0.6], [44, 34.6, 0.6]]);
}

/* ------------------------------------------------------------------ fruit and vegetable packhouse */
export function sebzeMeyve(P: Plate) {
  const W = 52, D = 26, t = 0.3;
  P.ground(-2, -2, W + 2, D + 11, 0.6);
  P.zone('kabul', [[t, t], [9.93, t], [9.93, D - t], [t, D - t]], { tint: 'm', h: 2.4 });
  P.zone('yikama', [[10.07, 7.6], [24.4, 7.6], [24.4, 12.6], [10.07, 12.6]], { tint: 'w', h: 2.4 });
  P.zone('kalibre', [[24.4, 7.6], [33.6, 7.6], [33.6, 14.8], [24.4, 14.8]], { tint: 'p', h: 1.8 });
  P.zone('paket', [[24.4, 14.8], [39.93, 14.8], [39.93, D - t], [24.4, D - t]], { tint: 'p', h: 2 });
  P.zone('soguk', [[40.07, t], [W - t, t], [W - t, 17.93], [40.07, 17.93]], { tint: 'c', h: 3.4 });
  P.zone('sevk', [[40.07, 18.07], [W - t, 18.07], [W - t, D + 9.6], [40.07, D + 9.6]], { tint: 's', h: 4 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 7.5, ridge: 9.2, ridgeAxis: 'x',
    doors: [{ side: 'y1', at: 5, w: 4 }, { side: 'y1', at: 43.6, w: 3 }, { side: 'y1', at: 48.4, w: 3 }],
    parts: [
      { axis: 'x', at: 11, from: t, to: 9.93, t: 0.2, h: 1.6, doors: [{ at: 7.6, w: 3 }] },
      { axis: 'y', at: 10, from: t, to: D - t, doors: [{ at: 10, w: 3 }, { at: 20, w: 3 }] },
      { axis: 'y', at: 40, from: t, to: D - t, doors: [{ at: 21.6, w: 6 }] },
      { axis: 'x', at: 18, from: 40.1, to: W - t, t: 0.2, h: 1.6, doors: [{ at: 46, w: 3.2 }] },
    ],
  });
  // reception: field bins; forced-air pre-cooling room with its fan wall
  pallets(P, [[1, 13], [2.4, 13], [3.8, 13], [1, 14.4], [2.4, 14.4], [1, 16.6], [2.4, 16.6], [3.8, 16.6], [5.2, 16.6]], 1, 1.2);
  for (const [x, y] of [[1.2, 2], [2.6, 2], [4, 2], [5.4, 2], [1.2, 4.6], [2.6, 4.6], [4, 4.6], [5.4, 4.6]]) { P.box(x, y, 0, x + 1.2, y + 1.2, 0.9, 'ld'); P.box(x, y, 0.9, x + 1.2, y + 1.2, 1.8, 'ld'); }
  P.box(7.2, 1.2, 0, 8.2, 7, 2.6, 'st', 'tlr', [2.4, 4.1, 5.8].map((y) => P.disc('x', [8.2, y, 1.4], 0.55, 'fan')).join(''));
  // the line: bin tipper, washer, brush polisher, drying tunnel, sizer with lanes to the packing tables
  P.box(10.6, 8.8, 0, 12.6, 11.2, 1.6, 'st');
  P.box(10.8, 9.2, 1.6, 12.4, 10.8, 2.4, 'ld');
  P.basin(12.6, 9.3, 0, 17.4, 10.9, 1.1, { m: 'st', t: 0.08, level: 0.15 });
  P.box(17.4, 9.3, 0, 20.4, 10.9, 1.1, 'st', 'tlr', [17.8, 18.4, 19, 19.6].map((x) => P.line([[x, 9.4, 1.12], [x, 10.8, 1.12]], 'e')).join(''));
  P.box(20.4, 9.1, 0, 24.4, 11.1, 1.9, 'st', 'tlr', P.ellipse(21.6, 10.1, 1.91, 0.45, 'dk t') + P.ellipse(23.2, 10.1, 1.91, 0.45, 'dk t'));
  P.box(24.4, 9.3, 0, 33.2, 10.9, 1.1, 'st', 'tlr', [9.7, 10.1, 10.5].map((y) => P.line([[24.6, y, 1.12], [33, y, 1.12]], 'e')).join(''));
  for (const x of [25.6, 27.6, 29.6, 31.6]) { P.box(x, 10.9, 0.7, x + 0.5, 15.8, 0.85, 'st'); P.box(x - 0.5, 15.8, 0, x + 1, 17.2, 0.9, 'st'); }
  // packing: carton erector, pallets of packed produce
  P.box(34.6, 9, 0, 37.4, 11, 1.6, 'st');
  pallets(P, [[34.2, 16.6], [35.8, 16.6], [37.4, 16.6], [34.2, 18.4], [35.8, 18.4], [34.2, 21.4], [35.8, 21.4]], 1.5);
  // cold store racks, dispatch with two trucks at the doors
  P.racks(41, 1.2, 51.2, 2.6, 2, 'x');
  P.racks(41, 6, 51.2, 7.4, 2, 'x');
  P.racks(41, 10.8, 51.2, 12.2, 2, 'x');
  P.box(43, 0.4, 3.4, 49, 1.3, 4.2, 'st', 'tlr', [44.5, 46, 47.5].map((x) => P.disc('y', [x, 1.3, 3.8], 0.3, 'fan')).join(''));
  pallets(P, [[42, 20], [43.6, 20], [47, 21], [48.6, 21]], 1.5);
  P.truck(43.6, D + 5.3, 'y+');
  P.truck(48.4, D + 5.3, 'y+');
  P.truck(5, D + 5.3, 'y+');

  P.flow('product', [[5, D + 1.5, 1.6], [5, 16.8, 1.6], [4, 4, 2.2], [11.6, 10, 2.8], [15, 10.1, 1.5], [18.9, 10.1, 1.5], [22.4, 10.1, 2.3], [28.8, 10.1, 1.5], [28.8, 16.5, 1.3], [36, 19.5, 1.9], [46, 9, 3.6], [46, 21, 1.8], [46, D + 1.5, 1.8]]);
}

/* ------------------------------------------------------------------ olive and olive oil */
export function zeytin(P: Plate) {
  const W = 40, D = 14, t = 0.3;
  P.ground(-11, -2, W + 2, 27, 0.6);
  P.zone('kabul', [[-9.6, 2.4], [5.8, 2.4], [5.8, 11.6], [-9.6, 11.6]], { tint: 'm', h: 3, at: [-5.2, 7, 4] });
  P.zone('kirma', [[6, t], [18.93, t], [18.93, 9.4], [6, 9.4]], { tint: 'p', h: 3 });
  P.zone('dekantor', [[19.07, t], [28.43, t], [28.43, 9.4], [19.07, 9.4]], { tint: 'p', h: 2.6 });
  P.zone('depo', [[28.57, t], [W - t, t], [W - t, 8.93], [28.57, 8.93]], { tint: 'm', h: 4.9 });
  P.zone('dolum', [[28.57, 9.07], [W - t, 9.07], [W - t, D - t], [28.57, D - t]], { tint: 's', h: 2.2 });
  P.zone('sofralik', [[1.2, 16.6], [19.8, 16.6], [19.8, 25.4], [1.2, 25.4]], { tint: 'l', h: 3.4 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 7, ridge: 8.6, ridgeAxis: 'x',
    doors: [{ side: 'x0', at: 7, w: 2.8 }, { side: 'y1', at: 24, w: 3 }, { side: 'y1', at: 12, w: 1.1, arc: true }],
    parts: [
      { axis: 'y', at: 28.5, from: t, to: D - t, doors: [{ at: 11.4, w: 2 }] },
      { axis: 'x', at: 9, from: 28.58, to: W - t, doors: [{ at: 31, w: 1.6 }] },
    ],
  });
  // reception: hopper under a canopy, inclined conveyor to the leaf remover and washer
  P.building({ x0: -10, y0: 3, x1: -1, y1: 11, t: 0.2, open: true, eave: 4.6, ridge: 5.4, ridgeAxis: 'y' });
  P.box(-7.6, 5.2, 1.2, -4, 8.8, 2.2, 'st', 'tlr', P.flat([[-7.4, 5.4], [-4.2, 5.4], [-4.2, 8.6], [-7.4, 8.6]], 2.21, 'ol'));
  for (const [x, y] of [[-7.4, 5.4], [-4.2, 5.4], [-4.2, 8.6], [-7.4, 8.6]]) P.box(x - 0.08, y - 0.08, 0, x + 0.08, y + 0.08, 1.2, 'st');
  P.beam([-4, 7, 1.3], [1.4, 5.2, 2.6], 0.6, 0.3);
  P.box(1.2, 3.8, 0, 5.2, 6.6, 2.1, 'st', 'tlr', P.ellipse(4.2, 5.2, 2.11, 0.5, 'dk t'));
  P.beam([5.2, 5.2, 1.4], [7.6, 5.2, 2.8], 0.5, 0.3);
  // crusher, malaxers on a raised platform, decanter, separators
  P.box(7.2, 4.4, 0, 9.2, 6, 1.4, 'st');
  P.vessel(8.2, 5.2, 0.55, 1.4, 0.6, 'st', { head: 'cone', headH: 0.4 });
  P.box(10.2, 1.6, 0, 18.4, 6.4, 1.2, 'st');
  P.rail([10.2, 6.4, 1.2], [18.4, 6.4, 1.2], 1);
  for (const x of [11.4, 13.4, 15.4, 17.4]) P.hcyl('y', 2.2, 4.8, x, 1.95, 0.72, 'st');
  P.box(20, 3.4, 0, 25.4, 4.6, 0.7, 'st');
  P.hcyl('x', 20.4, 24.6, 4, 1.15, 0.45, 'st');
  P.box(24.6, 3.5, 0.7, 25.4, 4.5, 1.6, 'dk');
  for (const y of [2.6, 5.6]) P.vessel(27, y, 0.45, 0, 0.9, 'st', { head: 'cone', headH: 0.55, legs: 0.5 });
  // stainless oil tanks; bottling line with its cartons
  for (const x of [30.6, 33.6, 36.8]) for (const y of [2.2, 6.4]) P.vessel(x, y, 1.1, 0, 2.7, 'st', { head: 'dome', headH: 0.3, cone: 0.55, legs: 0.5 });
  P.box(29.4, 10.4, 0, 32.6, 12.4, 1.8, 'st');
  P.box(32.6, 11, 0.8, 38.6, 11.8, 0.95, 'st');
  pallets(P, [[34, 12.4], [35.4, 12.4], [36.8, 12.4]], 0.9, 1.2);
  // pomace screw to the yard
  P.beam([24.6, 5, 0.8], [24.6, 13.6, 0.8], 0.3, 0.3);
  // table olives: brine fermentation tanks in the yard
  for (const x of [3.4, 7.6, 11.8, 16]) for (const y of [18.8, 23]) P.vessel(x, y, 1.5, 0, 2.8, 'pe', { head: 'dome', headH: 0.35 });

  P.flow('product', [[-5.8, 7, 2.8], [3.2, 5.2, 2.8], [8.2, 5.2, 2.6], [14.4, 3.5, 2.9], [22.5, 4, 1.9], [27, 4.1, 2.4], [33.6, 4.3, 4.6], [31, 11.4, 2.2]]);
}

/* ------------------------------------------------------------------ cattle fattening farm */
export function besiCiftligi(P: Plate) {
  const W = 72, D = 28, ya = 11.5, yb = 16.5;
  P.ground(-4, -48, 86, D + 4, 0.6);
  P.zone('bolme', [[[0.3, 0.3], [W - 0.3, 0.3], [W - 0.3, ya], [0.3, ya]], [[0.3, yb], [W - 0.3, yb], [W - 0.3, D - 0.3], [0.3, D - 0.3]]], { tint: 'l', h: 1.6, at: [30, 5.8, 2.4] });
  P.zone('koridor', [[0.3, ya], [W - 0.3, ya], [W - 0.3, yb], [0.3, yb]], { tint: 's', h: 3.2, at: [56, 14, 3.6] });
  P.zone('silaj', [[0, -44], [26.2, -44], [26.2, -8], [0, -8]], { tint: 'm', h: 3.2 });
  P.zone('kabayem', [[32, -26], [54, -26], [54, -8], [32, -8]], { tint: 'm', h: 4 });
  P.zone('gubre', [[59.6, -30.4], [80.4, -30.4], [80.4, -7.6], [59.6, -7.6]], { tint: 's', h: 2.8 });
  // barn: low walls, open sides, ridge vent; feed fences on both sides of the drive-through alley
  P.building({ x0: 0, y0: 0, x1: W, y1: D, t: 0.25, cut: 1.2, eave: 4.6, ridge: 9, ridgeAxis: 'x', doors: [{ side: 'x0', at: 14, w: 5 }, { side: 'x1', at: 14, w: 5 }] });
  P.columns(Array.from({ length: 13 }, (_, i) => i * 6).flatMap((x) => [[Math.min(Math.max(x, 0.3), W - 0.3), ya], [Math.min(Math.max(x, 0.3), W - 0.3), yb]] as XY[]), 0.3, 1.4);
  P.rail([0.6, ya, 0], [W - 0.6, ya, 0], 1.25);
  P.rail([0.6, yb, 0], [W - 0.6, yb, 0], 1.25);
  // pen gates and water troughs
  for (let x = 12; x < W; x += 12) {
    P.rail([x, 0.4, 0], [x, ya - 0.2, 0], 1.3);
    P.rail([x, yb + 0.2, 0], [x, D - 0.4, 0], 1.3);
    P.box(x - 0.7, 1.2, 0, x + 0.7, 1.9, 0.75, 'cn', 'tlr', P.flat([[x - 0.6, 1.3], [x + 0.6, 1.3], [x + 0.6, 1.8], [x - 0.6, 1.8]], 0.7, 'wa'));
    P.box(x - 0.7, D - 1.9, 0, x + 0.7, D - 1.2, 0.75, 'cn', 'tlr', P.flat([[x - 0.6, D - 1.8], [x + 0.6, D - 1.8], [x + 0.6, D - 1.3], [x - 0.6, D - 1.3]], 0.7, 'wa'));
  }
  // feed mixer wagon in the alley
  P.box(30, 12.6, 0.5, 37, 15.4, 2.8, 'st');
  P.box(37.4, 13, 0, 40, 15, 2.6, 'dk');
  P.box(30.4, 12.9, 0, 31.4, 15.1, 0.6, 'dk');
  // three bunker silos with silage, the working face open
  for (const x of [0, 8.7, 17.4, 26.1]) P.box(x, -44, 0, x + 0.3, -8, 3, 'cn');
  P.box(0.3, -44.3, 0, 26.1, -44, 3, 'cn');
  for (const [x0, y1] of [[0.3, -12], [9, -16], [17.7, -10]]) {
    P.box(x0 + 0.05, -43.95, 0, x0 + 8.35, y1, 2.7, 'si');
  }
  // hay barn: an open shed with stacked bales
  P.building({ x0: 32, y0: -26, x1: 54, y1: -8, t: 0.2, open: true, eave: 6, ridge: 7.6, ridgeAxis: 'x' });
  P.columns([[32.2, -25.8], [43, -25.8], [53.8, -25.8], [32.2, -8.2], [43, -8.2], [53.8, -8.2]], 0.3, 6);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) P.box(33 + i * 3.4, -24.5 + j * 4.2, 0, 35.8 + i * 3.4, -21 + j * 4.2, 1.4 + (i % 3 === 0 ? 1.4 : 0), 'hy');
  // scraped alleys to a covered-free manure store
  P.basin(W, 13.2, 0, 76.6, 14.8, 0.6, { m: 'cn', t: 0.15, level: 0.3, liquid: 'mn' });
  P.basin(75, -8, 0, 76.6, 13.2, 0.6, { m: 'cn', t: 0.15, level: 0.3, liquid: 'mn' });
  P.basin(60, -30, 0, 80, -8, 2.6, { m: 'cn', t: 0.3, level: 0.8, liquid: 'mn' });

  P.flow('product', [[13, -11, 3.2], [24, 0, 3.6], [33.5, 14, 3.4], [66, 14, 1.6]], 0);
}

/* ------------------------------------------------------------------ poultry house */
export function kumes(P: Plate) {
  const L = 72, D = 15, gap = 12, eave = 2.8;
  const houses = [0, D + gap];
  P.ground(-3, -3, L + 3, 2 * D + gap + 3, 0.5);
  P.zone('ic', houses.map((y0) => [[5.1, y0 + 0.3], [L - 0.3, y0 + 0.3], [L - 0.3, y0 + D - 0.3], [5.1, y0 + D - 0.3]] as XY[]), { tint: 'l', h: 1, at: [40, D + gap + 7.5, 1.8] });
  P.zone('ped', houses.map((y0) => [[5.6, y0 + D - 0.6], [21.4, y0 + D - 0.6], [21.4, y0 + D + 0.6], [5.6, y0 + D + 0.6]] as XY[]), { tint: 'w', h: eave, at: [13.5, 2 * D + gap + 0.6, eave + 0.8] });
  P.zone('fan', houses.map((y0) => [[L - 2.4, y0], [L + 1.2, y0], [L + 1.2, y0 + D], [L - 2.4, y0 + D]] as XY[]), { tint: 'w', h: eave + 0.2, at: [L + 1.2, D + gap + 7.5, eave + 1] });
  P.zone('silo', [[1.6, D + 1.4], [10.4, D + 1.4], [10.4, D + gap - 1.4], [1.6, D + gap - 1.4]], { tint: 'm', h: 7.6 });
  P.zone('kontrol', houses.map((y0) => [[0.3, y0 + 0.3], [4.93, y0 + 0.3], [4.93, y0 + D - 0.3], [0.3, y0 + D - 0.3]] as XY[]), { tint: 's', h: 2.2, at: [2.6, D + gap + 7.5, 2.8] });
  for (const y0 of houses) {
    P.building({ x0: 0, y0, x1: L, y1: y0 + D, t: 0.3, cut: 1.2, eave, ridge: 4.4, ridgeAxis: 'x', full: ['x1'], doors: [{ side: 'x0', at: y0 + 4, w: 1.1, arc: true }, { side: 'y1', at: 30, w: 3 }], parts: [{ axis: 'y', at: 5, from: y0 + 0.3, to: y0 + D - 0.3, doors: [{ at: y0 + 10, w: 1, arc: true }] }] });
    let fans = '';
    for (let i = 0; i < 7; i++) {
      const y = y0 + 1.6 + i * 1.98;
      fans += P.disc('x', [L, y, 1.4], 0.72, 'fan');
      for (const a of [0, 60, 120]) { const q = (a * Math.PI) / 180; fans += P.line([[L, y - Math.cos(q) * 0.62, 1.4 - Math.sin(q) * 0.62], [L, y + Math.cos(q) * 0.62, 1.4 + Math.sin(q) * 0.62]], 'fb'); }
    }
    P.post(fans);
    P.box(6, y0 + D - 0.3, 1.2, 21, y0 + D, eave, 'pad', 'tlr', Array.from({ length: 30 }, (_, i) => P.line([[6.25 + i * 0.5, y0 + D, 1.25], [6.25 + i * 0.5, y0 + D, eave - 0.05]], 'e')).join(''));
    P.box(6, y0, 1.2, 21, y0 + 0.3, eave, 'pad');
    let lines = '';
    for (const y of [3, 6, 9, 12]) lines += P.line([[6.5, y0 + y, 0.3], [L - 2.6, y0 + y, 0.3]], 'pan') + P.line([[6.5, y0 + y, 0.5], [L - 2.6, y0 + y, 0.5]], 'fd');
    for (const y of [1.6, 4.5, 7.5, 10.5, 13.4]) lines += P.line([[6.5, y0 + y, 0.45], [L - 2.6, y0 + y, 0.45]], 'drip');
    P.pre(lines);
  }
  // bulk feed bins between the houses, an auger into each
  for (const x of [4.2, 7.8]) P.vessel(x, D + gap / 2, 1.45, 0, 2.8, 'st', { head: 'cone', headH: 0.9, cone: 1.6, legs: 1.9 });
  P.beam([6, D + gap / 2 - 1.2, 1.6], [6, D + 0.1, 2.6], 0.25, 0.25);
  P.beam([6, D + gap / 2 + 1.2, 1.6], [6, D + gap - 0.1, 2.6], 0.25, 0.25);

  P.flow('air', [[13.5, 2 * D + gap + 1.4, 1.6], [13.5, D + gap + 7.5, 1.6], [L - 3, D + gap + 7.5, 1.6], [L + 1.6, D + gap + 7.5, 1.6]]);
  P.flow('product', [[6, D + gap / 2, 7.6], [6, D + gap - 0.4, 2.8], [6.5, D + gap + 6, 0.8], [36, D + gap + 6, 0.8]]);
}

/* ------------------------------------------------------------------ slaughterhouse */
export function kesimhane(P: Plate) {
  const W = 54, D = 26, t = 0.3, zr = 3.8;
  P.ground(-18, -2, W + 26, D + 3, 0.6);
  P.zone('padok', [[-16.6, 1.4], [-0.6, 1.4], [-0.6, 20.6], [-16.6, 20.6]], { tint: 'l', h: 2.2 });
  P.zone('hat', [[t, t], [21.93, t], [21.93, 13.93], [t, 13.93]], { tint: 'p', h: 4.2 });
  P.zone('sakatat', [[t, 14.07], [21.93, 14.07], [21.93, D - t], [t, D - t]], { tint: 'p', h: 2 });
  P.zone('sogutma', [[22.07, t], [35.93, t], [35.93, D - t], [22.07, D - t]], { tint: 'c', h: 4.2 });
  P.zone('parcalama', [[36.07, t], [W - t, t], [W - t, D - t], [36.07, D - t]], { tint: 'p', h: 2 });
  P.zone('aritma', [[W + 2.4, -1.4], [W + 25.4, -1.4], [W + 25.4, 13.6], [W + 2.4, 13.6]], { tint: 'w', h: 3.8 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 7, ridge: 8.8, ridgeAxis: 'x',
    doors: [{ side: 'x0', at: 10, w: 1.4 }, { side: 'x1', at: 20, w: 3.2 }, { side: 'y1', at: 8, w: 1.1, arc: true }],
    parts: [
      { axis: 'x', at: 14, from: t, to: 21.93, doors: [{ at: 18, w: 2 }] },
      { axis: 'y', at: 22, from: t, to: D - t, doors: [{ at: 10, w: 2 }, { at: 20, w: 2 }], t: 0.2, h: 1.6 },
      { axis: 'x', at: 13, from: 22.1, to: 35.9, doors: [], t: 0.2, h: 1.6 },
      { axis: 'y', at: 36, from: t, to: D - t, doors: [{ at: 7, w: 2 }, { at: 19, w: 2 }], t: 0.2, h: 1.6 },
    ],
  });
  // lairage: covered pens and the race to the stunning box
  P.building({ x0: -17, y0: 1, x1: -0.3, y1: 21, t: 0.15, open: true, eave: 4, ridge: 5.2, ridgeAxis: 'y' });
  for (const y of [1.4, 7.6, 14, 20.6]) P.rail([-16.6, y, 0], [-4.6, y, 0], 1.2);
  for (const x of [-16.6, -10.6, -4.6]) P.rail([x, 1.4, 0], [x, 20.6, 0], 1.2);
  P.rail([-4.6, 9.2, 0], [0, 9.2, 0], 1.4);
  P.rail([-4.6, 10.8, 0], [0, 10.8, 0], 1.4);
  // slaughter line: stunning box, overhead rail with hooks, dressing platforms
  P.box(0.8, 9.2, 0, 3, 10.8, 1.8, 'st');
  let rail = P.line([[3.4, 10, zr], [21.6, 10, zr], [21.6, 6.6, zr], [35.4, 6.6, zr]], 'stl');
  for (let x = 4.5; x < 21; x += 1.5) rail += P.line([[x, 10, zr], [x, 10, zr - 0.5]], 'carc');
  for (let y = 2.4; y < 12.6; y += 2.2) rail += P.line([[22.6, y, zr], [35.4, y, zr]], 'stl');
  for (let y = 14.4; y < 25; y += 2.2) rail += P.line([[22.6, y, zr], [35.4, y, zr]], 'stl');
  P.over(rail);
  for (const [x, y] of [[6, 7.6], [9, 11.2], [12, 7.6], [15, 11.2], [18, 7.6]]) P.box(x, y, 0, x + 1.4, y + 1.2, 1.3, 'st');
  // offal and hides
  P.box(2, 16.6, 0, 8, 17.8, 0.9, 'st');
  P.box(2, 20.6, 0, 8, 21.8, 0.9, 'st');
  for (const x of [11, 12.6, 14.2]) P.box(x, 22, 0, x + 1.1, 23.2, 0.9, 'st');
  P.beam([17, 15.4, 2.6], [19.6, 19.8, 0.6], 0.8, 0.15);
  // cutting and packing
  P.box(38, 4, 0, 50, 5.4, 0.9, 'st');
  P.box(38, 8.6, 0, 50, 10, 0.9, 'st');
  P.box(39, 14, 0, 40.6, 15.4, 2, 'st');
  P.box(43, 15.2, 0, 50.4, 16.6, 1.4, 'st');
  pallets(P, [[44, 20.4], [45.6, 20.4], [47.2, 20.4], [44, 22]], 1.3);
  P.box(W, 18.4, 0, W + 1.2, 21.6, 1.1, 'dk');
  P.truck(W + 6.3, 20, 'x+');
  // wastewater: equalisation, dissolved-air flotation, aeration basin, clarifier
  P.tank(W + 6, 2.4, 3, 0, 3, { m: 'cn', liquid: 'wd', level: 0.4 });
  P.box(W + 10.2, 0, 0, W + 14.4, 2.4, 2.2, 'st');
  P.basin(W + 3, 6.4, 0, W + 15, 13, 3.4, { m: 'cn', t: 0.3, level: 0.4, liquid: 'wd', fill: 'pd' });
  P.tank(W + 20.6, 6, 3, 0, 2.6, { m: 'cn', liquid: 'wa', level: 0.3 });
  P.box(W + 17.6, 5.8, 2.6, W + 23.6, 6.2, 3, 'st');
  P.pipe([[3, -0.9, 0.4], [W + 3, -0.9, 0.4], [W + 3, 2.4, 0.4]], 0.12, 'pk');

  P.flow('product', [[-10.6, 10, 2.4], [-2.4, 10, 2], [2, 10, 2.6], [21.6, 10, 4.2], [21.6, 6.6, 4.2], [33, 6.6, 4.2], [44, 7.2, 1.6], [W + 1, 20, 1.8]]);
}

/* ------------------------------------------------------------------ compound feed mill
   Tower floors are drawn as light plates so the machines on the floors below stay readable. */
export function yemSanayi(P: Plate) {
  const tx0 = 36, tx1 = 50, ty0 = 0, ty1 = 14, f1 = 7, f2 = 14, top = 21;
  P.ground(-3, -3, 72, 28, 0.6);
  P.zone('kabul', [[0, 17.4], [11, 17.4], [11, 27], [0, 27]], { tint: 'm', h: 4.4 });
  P.zone('silo', [[0, 1.6], [33.6, 1.6], [33.6, 10.4], [0, 10.4]], { tint: 'm', h: 12.6 });
  P.zone('ogutme', [[tx0 + 0.3, 0.3], [tx1 - 0.3, 0.3], [tx1 - 0.3, 6], [tx0 + 0.3, 6]], { tint: 'p', z0: f1, h: 13.2, noTint: true, at: [44, 3, 21.8] });
  P.zone('karisim', [[tx0 + 0.3, 6.4], [tx1 - 0.3, 6.4], [tx1 - 0.3, ty1 - 0.3], [tx0 + 0.3, ty1 - 0.3]], { tint: 'p', z0: f1, h: 3, noTint: true });
  P.zone('pelet', [[tx0 + 0.3, 6.4], [tx1 - 0.3, 6.4], [tx1 - 0.3, ty1 - 0.3], [tx0 + 0.3, ty1 - 0.3]], { tint: 'p', h: 4 });
  P.zone('mamul', [[52.6, 1], [70.4, 1], [70.4, 27], [52.6, 27]], { tint: 's', h: 6.4, at: [57, 5, 11] });
  // intake pit under a canopy, a truck on the grate
  P.building({ x0: 0, y0: 18, x1: 11, y1: 26.6, t: 0.2, open: true, eave: 6.4, ridge: 7, ridgeAxis: 'x' });
  P.pre(P.flat([[3, 20.6], [8, 20.6], [8, 24], [3, 24]], 0.02, 'grate'));
  P.truck(5.6, 22.3, 'x+', 10);
  // raw material silos, intake elevator and the conveyor gallery over them
  for (const x of [4.2, 12.6, 21, 29.4]) { P.box(x - 3.9, 2.1, 0, x + 3.9, 9.9, 0.4, 'cn'); P.vessel(x, 6, 3.7, 0.4, 9.6, 'st', { head: 'cone', headH: 2 }); }
  P.box(0.4, 13.2, 0, 1.4, 14.4, 15.4, 'st');
  P.box(0.4, 5.4, 14.4, 35.4, 6.6, 15.4, 'st');
  P.box(0.4, 6.6, 14.4, 1.4, 13.2, 15.4, 'st');
  // tower: ground floor walls cut, two upper floors as light plates
  P.building({ x0: tx0, y0: ty0, x1: tx1, y1: ty1, t: 0.3, cut: 1.2, eave: top + 2, ridge: top + 2, ridgeAxis: 'x', doors: [{ side: 'y1', at: 46, w: 3.2 }] });
  // ground floor: conditioner + pellet press, counterflow cooler, the elevators
  P.box(39.6, 9, 0, 43.4, 11.6, 0.9, 'st');
  P.box(40, 9.4, 0.9, 42.4, 11.2, 2.4, 'st');
  P.hcyl('x', 39.6, 43.6, 10.3, 3.0, 0.45, 'st');
  P.box(42.4, 9.4, 0.9, 43.4, 11.2, 2.2, 'dk');
  P.box(44.8, 8.8, 0, 47.6, 11.6, 3.6, 'st');
  for (const [x, y] of [[36.7, 7.4], [48.6, 7.4]]) P.box(x, y, 0, x + 0.8, y + 1.2, top + 1.6, 'st');
  // first floor plate: hammer mill, mixer, weigh hopper
  P.layer(1);
  P.pre(P.flat([[tx0 + 0.3, 0.3], [tx1 - 0.3, 0.3], [tx1 - 0.3, ty1 - 0.3], [tx0 + 0.3, ty1 - 0.3]], f1, 'fl'));
  P.box(45, 2, f1, 47.6, 4.2, f1 + 1.6, 'st');
  P.hcyl('y', 4.2, 5.4, 46.3, f1 + 0.8, 0.45, 'dk');
  P.box(38.6, 8.6, f1, 43.8, 10.2, f1 + 0.9, 'st');
  P.hcyl('x', 38.6, 43.8, 9.4, f1 + 1.6, 0.85, 'st');
  P.box(38.6, 2, f1, 41.4, 4.6, f1 + 1.8, 'st');
  // second floor plate: dosing bins with hopper bottoms
  P.layer(2);
  P.pre(P.flat([[tx0 + 0.3, 0.3], [tx1 - 0.3, 0.3], [tx1 - 0.3, ty1 - 0.3], [tx0 + 0.3, ty1 - 0.3]], f2, 'fl'));
  for (const x of [37.4, 39.6, 41.8, 44]) for (const y of [1.2, 3.4]) P.box(x, y, f2, x + 2, y + 2, top - 0.6, 'st');
  P.box(46.4, 1.2, f2, 48.8, 5.4, f2 + 2.2, 'st');
  P.layer(0);
  // weighbridge and its office in the yard
  P.box(15, 20.6, 0, 33, 23.8, 0.15, 'st', 'tlr', [18, 21, 24, 27, 30].map((x) => P.line([[x, 20.6, 0.16], [x, 23.8, 0.16]], 'e')).join(''));
  P.box(34.6, 20.4, 0, 37.6, 23.2, 2.6, 'tb');
  // bulk out-loading bins over a truck lane; bagging hall
  for (const x of [54.4, 58.2, 62]) P.vessel(x, 4.2, 1.6, 0, 3.6, 'st', { head: 'cone', headH: 0.6, cone: 1.6, legs: 4.4 });
  P.building({ x0: 53, y0: 10, x1: 70, y1: 26.6, t: 0.25, cut: 1.2, eave: 7, ridge: 8.4, ridgeAxis: 'x', doors: [{ side: 'x0', at: 13, w: 3 }, { side: 'y1', at: 64, w: 4 }] });
  P.box(55, 11.6, 0, 57.4, 13.4, 2.8, 'st');
  P.box(57.4, 12.1, 0.6, 62, 12.9, 0.8, 'st');
  P.box(62, 11.4, 0, 64.6, 14, 2.2, 'st');
  pallets(P, [[55, 17], [56.6, 17], [58.2, 17], [59.8, 17], [55, 18.6], [56.6, 18.6], [58.2, 18.6], [55, 21.6], [56.6, 21.6]], 1.4);

  P.flow('product', [[5.6, 22.3, 4.4], [0.9, 13.8, 16], [12.6, 6, 15.8], [29.4, 6, 15.8], [37.1, 8, 22.8], [41.4, 3.4, 21.4], [46.3, 3.1, 9.2], [41.2, 9.4, 9.2], [41.2, 10.3, 3.6], [46.2, 10.2, 4], [49, 8, 22.8], [58.2, 4.2, 10]], 0);
}

/* ------------------------------------------------------------------ meat and dairy processing */
export function etSut(P: Plate) {
  const W = 50, D = 28, t = 0.3;
  P.ground(-15, -3, W + 12, D + 3, 0.6);
  P.zone('sut', [[-13.6, 0.4], [7.93, 0.4], [7.93, 13.93], [-13.6, 13.93]], { tint: 'm', h: 3, at: [-3.2, 7.6, 11.6] });
  P.zone('isleme', [[8.07, t], [25.93, t], [25.93, 13.93], [8.07, 13.93]], { tint: 'p', h: 3.6 });
  P.zone('et', [[t, 14.07], [21.93, 14.07], [21.93, D - t], [t, D - t]], { tint: 'p', h: 2.8 });
  P.zone('paket', [[[22.07, 14.07], [35.93, 14.07], [35.93, D - t], [22.07, D - t]], [[26.07, t], [35.93, t], [35.93, 13.93], [26.07, 13.93]]], { tint: 's', h: 1.8, at: [31, 21, 2.6] });
  P.zone('soguk', [[36.07, t], [W - t, t], [W - t, D - t], [36.07, D - t]], { tint: 'c', h: 3.6 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 7, ridge: 8.8, ridgeAxis: 'x',
    doors: [{ side: 'x0', at: 7, w: 1.4 }, { side: 'x1', at: 8, w: 3.2 }, { side: 'x1', at: 20, w: 3.2 }, { side: 'y1', at: 10, w: 1.1, arc: true }],
    parts: [
      { axis: 'x', at: 14, from: t, to: W - t, doors: [{ at: 24, w: 2 }, { at: 31, w: 2 }] },
      { axis: 'y', at: 8, from: t, to: 13.93, doors: [{ at: 7, w: 1.4 }] },
      { axis: 'y', at: 26, from: t, to: 13.93, doors: [{ at: 7, w: 2 }] },
      { axis: 'y', at: 22, from: 14.07, to: D - t, doors: [{ at: 21, w: 2 }] },
      { axis: 'y', at: 36, from: t, to: D - t, doors: [{ at: 7, w: 2 }, { at: 21, w: 2 }], t: 0.2, h: 1.6 },
    ],
  });
  // milk reception: tanker bay, three silos, CIP tanks
  for (const y of [2.6, 6.8, 11]) P.vessel(-3.4, y, 1.75, 0, 8.6, 'st', { head: 'dome', headH: 0.6, legs: 0.6 });
  P.box(-13.4, 1.4, 0.9, -10.6, 3.8, 3.1, 'tc');
  P.hcyl('y', 3.8, 12.4, -12, 2.2, 1.25, 'st');
  P.box(-13.3, 1.4, 0.3, -10.7, 12.4, 0.9, 'dk');
  for (const y of [2, 3.6, 5.2]) P.vessel(2, y, 0.6, 0, 1.8, 'st', { head: 'dome', headH: 0.2, legs: 0.3 });
  P.box(4.4, 9, 0, 7, 11.6, 1.2, 'st');
  // milk processing: plate pasteuriser, separator, homogeniser, process tanks
  P.box(9.2, 2, 0, 12.6, 3.2, 1.9, 'st', 'tlr', [9.6, 10, 10.4, 10.8, 11.2, 11.6, 12, 12.4].map((x) => P.line([[x, 3.2, 0.2], [x, 3.2, 1.7]], 'e')).join(''));
  P.vessel(14.4, 2.6, 0.5, 0, 0.9, 'st', { head: 'cone', headH: 0.5, legs: 0.3 });
  P.box(9.4, 6, 0, 11.8, 7.6, 1.5, 'st');
  for (const x of [16.4, 19.2, 22]) for (const y of [4.4, 9.4]) P.vessel(x, y, 1.05, 0, 2.4, 'st', { head: 'dome', headH: 0.3, legs: 0.6 });
  // meat processing: cutting tables, mincer, filler, cook-smoke chamber
  P.box(2, 16.4, 0, 10, 17.6, 0.9, 'st');
  P.box(2, 20.4, 0, 10, 21.6, 0.9, 'st');
  P.box(12.4, 16.4, 0, 13.8, 17.6, 1.4, 'st');
  P.box(12.4, 20, 0, 14, 21.4, 1.7, 'st');
  P.box(16.6, 23, 0, 21.2, 27.2, 2.8, 'st', 'tlr', P.path([[21.2, 23.6, 2.5], [21.2, 26.6, 2.5], [21.2, 26.6, 0.2], [21.2, 23.6, 0.2]], 'e nf'));
  // packing: thermoformer, carton erector, conveyors
  P.box(23.4, 16.4, 0, 31, 17.8, 1.4, 'st');
  P.box(27, 4, 0, 34.6, 5.2, 1.0, 'st');
  P.box(28, 8.6, 0, 30.8, 11, 1.7, 'st');
  pallets(P, [[25, 22.4], [26.6, 22.4], [25, 24], [32, 22.4]], 1.3);
  // cold rooms, dispatch docks, two trucks
  P.racks(37, 1.4, 49.2, 2.8, 2, 'x');
  P.racks(37, 6.2, 49.2, 7.6, 2, 'x');
  P.racks(37, 15.4, 49.2, 16.8, 2, 'x');
  P.racks(37, 22.4, 49.2, 23.8, 2, 'x');
  for (const y of [6.4, 18.4]) P.box(W, y, 0, W + 1.2, y + 3.2, 1.1, 'dk');
  P.truck(W + 6.3, 8, 'x+');
  P.truck(W + 6.3, 20, 'x+');

  P.flow('product', [[-12, 8, 3.6], [-3.4, 6.8, 9.6], [10.9, 2.6, 2.4], [19.2, 6.9, 3.6], [29.4, 9.8, 2.2], [30.8, 4.6, 1.6], [42, 4.4, 3.4], [W + 1, 8, 1.8]]);
  P.flow('product', [[6, 17, 1.4], [13.2, 20.7, 2.2], [18.9, 25.1, 3.2], [27.2, 17.1, 1.8], [42, 19.4, 3.4], [W + 1, 20, 1.8]]);
}

/* ------------------------------------------------------------------ cold storage */
export function sogukDepo(P: Plate) {
  const W = 48, D = 32, t = 0.2, rd = 20;
  P.ground(-2, -2, W + 10, D + 13, 0.6);
  P.zone('oda', [[t, t], [35.93, t], [35.93, rd - 0.07], [t, rd - 0.07]], { tint: 'c', h: 5.6 });
  P.zone('dondurucu', [[36.07, t], [W - t, t], [W - t, rd - 0.07], [36.07, rd - 0.07]], { tint: 'c', h: 5.6 });
  P.zone('koridor', [[t, rd + 0.07], [W - t, rd + 0.07], [W - t, D - t], [t, D - t]], { tint: 's', h: 2.6 });
  P.zone('rampa', [[2.4, D], [37.6, D], [37.6, D + 11.4], [2.4, D + 11.4]], { tint: 's', h: 4.2, at: [10, D + 4, 5.2] });
  P.zone('makine', [[W + 0.3, t], [W + 7.7, t], [W + 7.7, 13.8], [W + 0.3, 13.8]], { tint: 'm', h: 2 });
  P.zone('kondenser', [[W + 0.6, 15.6], [W + 7.6, 15.6], [W + 7.6, 29.4], [W + 0.6, 29.4]], { tint: 'm', h: 3 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 10, ridge: 11.2, ridgeAxis: 'x', full: ['y0'],
    doors: [{ side: 'y1', at: 8, w: 3.2 }, { side: 'y1', at: 20, w: 3.2 }, { side: 'y1', at: 32, w: 3.2 }, { side: 'x1', at: 26, w: 1.1 }],
    parts: [
      { axis: 'x', at: rd, from: t, to: W - t, doors: [{ at: 6, w: 3 }, { at: 18, w: 3 }, { at: 30, w: 3 }, { at: 42, w: 3 }] },
      { axis: 'y', at: 12, from: t, to: rd - 0.08 },
      { axis: 'y', at: 24, from: t, to: rd - 0.08 },
      { axis: 'y', at: 36, from: t, to: rd - 0.08 },
    ],
  });
  P.building({ x0: W, y0: 0, x1: W + 8, y1: 14, t: 0.25, cut: 1.2, eave: 5, ridge: 5, ridgeAxis: 'x', doors: [{ side: 'y1', at: W + 4, w: 1.2, arc: true }] });
  // pallet racks in each room, a unit cooler on each back wall
  for (const x0 of [0, 12, 24, 36]) {
    P.racks(x0 + 1, 1.6, x0 + 2.4, 18.4, 3, 'y', { lh: 1.8, bay: 3.4 });
    P.racks(x0 + 6.4, 1.6, x0 + 9, 18.4, 3, 'y', { lh: 1.8, bay: 3.4 });
    P.box(x0 + 3, 0.25, 6.4, x0 + 9, 1.2, 7.4, 'st', 'tlr', [4.5, 6, 7.5].map((d) => P.disc('y', [x0 + d, 1.2, 6.9], 0.32, 'fan')).join(''));
  }
  // dock levellers and three trucks backed in
  for (const x of [8, 20, 32]) { P.box(x - 1.6, D, 0, x + 1.6, D + 1.2, 1.1, 'dk'); P.truck(x, D + 6.3, 'y+'); }
  // machine room: compressors, receiver, panel; condensers outside
  for (const y of [1.6, 4.4, 7.2]) { P.box(W + 1.2, y, 0, W + 3.2, y + 1.6, 1.1, 'st'); P.hcyl('x', W + 3.2, W + 4.4, y + 0.8, 0.6, 0.35, 'dk'); }
  P.hcyl('y', 1.2, 6, W + 6.2, 0.7, 0.45, 'st');
  P.box(W + 5.6, 10.6, 0, W + 7.4, 11.2, 2, 'st');
  for (const y of [16, 23]) P.box(W + 1, y, 0, W + 7.2, y + 6, 2.4, 'st', 'tlr', [1.5, 3, 4.5].map((d) => P.ellipse(W + 4.1, y + d, 2.41, 0.9, 'fan')).join(''));
  P.pipe([[W + 4.1, 14, 2.6], [W + 4.1, 16, 2.6]], 0.08, 'pa');

  P.flow('product', [[20, D + 3.5, 1.8], [20, D - 6, 1.6], [18, rd - 3, 6], [18, 6, 6]]);
  P.flow('product', [[32, D + 3.5, 1.8], [32, D - 6, 1.6], [42, rd - 3, 6], [42, 6, 6]]);
}
