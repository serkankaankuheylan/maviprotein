/**
 * Aquaculture turnkey plates (services.json → aquaculture → turnkey). Each is a plan-cut isometric of a
 * typical facility of that type, at real proportions: walls cut at sill height, the envelope in phantom
 * line, equipment at true size. They are illustrative layouts, not a record of a specific project.
 */
import type { Plate, V3 } from '../iso';

/* ------------------------------------------------------------------ 01 hatchery */
export function kulucka(P: Plate) {
  const W = 44, D = 24, t = 0.3;
  P.ground(-5, -3, W + 3, D + 3.5, 0.6);
  P.zone('su', [[t, t], [7.93, t], [7.93, D - t], [t, D - t]], { tint: 'w', h: 3 });
  P.zone('anac', [[8.08, t], [21.93, t], [21.93, 10.93], [8.08, 10.93]], { tint: 'l', h: 1.8 });
  P.zone('kulucka', [[8.08, 13.07], [13.93, 13.07], [13.93, D - t], [8.08, D - t]], { tint: 'l', h: 2.2 });
  P.zone('canli', [[14.08, 13.07], [23.93, 13.07], [23.93, D - t], [14.08, D - t]], { tint: 'l', h: 2.6 });
  P.zone('larva', [[22.08, t], [W - t, t], [W - t, 10.93], [22.08, 10.93]], { tint: 'l', h: 1.8 });
  P.zone('nursery', [[24.08, 13.07], [W - t, 13.07], [W - t, D - t], [24.08, D - t]], { tint: 'l', h: 1.8 });

  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.1, eave: 5.2, ridge: 7.2, ridgeAxis: 'x',
    doors: [{ side: 'y1', at: 4.2, w: 2.8 }, { side: 'x1', at: 12, w: 1.85 }],
    parts: [
      { axis: 'y', at: 8, from: t, to: D - t, doors: [{ at: 12, w: 1.3, arc: true }] },
      { axis: 'x', at: 11, from: 8.08, to: W - t, doors: [{ at: 15, w: 1.1, arc: true }, { at: 33.4, w: 1.1, arc: true }] },
      { axis: 'x', at: 13, from: 8.08, to: W - t, doors: [{ at: 11, w: 1, arc: true }, { at: 19, w: 1, arc: true }, { at: 35, w: 1.1, arc: true }] },
      { axis: 'y', at: 22, from: t, to: 10.93 },
      { axis: 'y', at: 14, from: 13.07, to: D - t },
      { axis: 'y', at: 24, from: 13.07, to: D - t },
    ],
  });

  // liquid oxygen tank and vaporiser outside the plant room
  P.vessel(-2.6, 1.8, 0.8, 0, 3.6, 'st', { head: 'dome', headH: 0.4, legs: 0.7 });
  P.box(-3.9, 3.6, 0, -1.4, 4.3, 2.2, 'st', 'tlr', [0.5, 1, 1.5, 2].map((k) => P.line([[-3.9 + k, 4.3, 0.15], [-3.9 + k, 4.3, 2.05]], 'e')).join(''));
  P.pipe([[-1.4, 3.95, 1.8], [0.3, 3.95, 1.8]], 0.05, 'pa');

  // plant room: intake → sand filters → UV → heat exchange → reservoir
  P.pipe([[-5, 6.2, 0.35], [0.9, 6.2, 0.35]], 0.12);
  for (const y of [3.1, 5.3, 7.5]) P.vessel(1.6, y, 0.72, 0, 1.5, 'st', { head: 'dome', headH: 0.32, legs: 0.35 });
  P.box(3.6, 2.6, 0, 5.4, 8.8, 0.2, 'st');
  P.hcyl('y', 3.2, 8.2, 4.1, 0.95, 0.17, 'st');
  P.hcyl('y', 3.2, 8.2, 4.9, 0.95, 0.17, 'st');
  P.box(6.3, 1.6, 0, 7.4, 2.3, 1.8, 'st');
  P.vessel(6.9, 3.6, 0.36, 0, 2.3, 'st', { head: 'dome', headH: 0.2 });
  P.box(6.4, 6.8, 0, 7.4, 8.4, 1.7, 'st', 'tlr', [0.25, 0.5, 0.75, 1, 1.25].map((k) => P.line([[7.4, 6.8 + k, 0.2], [7.4, 6.8 + k, 1.5]], 'e')).join(''));
  P.box(3.6, 10.4, 0, 5.6, 12.4, 1.4, 'st', 'tlr', P.ellipse(4.6, 11.4, 1.41, 0.62, 'dk t'));
  for (const y of [14.4, 15.6, 16.8]) { P.box(0.8, y - 0.35, 0, 2.2, y + 0.35, 0.18, 'st'); P.hcyl('x', 1.0, 1.7, y, 0.45, 0.22, 'dk'); P.hcyl('x', 1.7, 2.1, y, 0.45, 0.16, 'st'); }
  P.tank(4.4, 20.4, 1.9, 0, 2.1, { level: 0.35 });
  P.pipe([[2.2, 3.1, 1.25], [2.6, 3.1, 1.25], [2.6, 9.6, 1.25], [4.5, 9.6, 1.25], [4.5, 10.4, 1.25]], 0.06);
  // distribution: a main along the corridor, one rack per room between the tank rows, a drop to each tank
  P.pipe([[4.4, 18.3, 2.6], [4.4, 12, 2.6], [W - 0.7, 12, 2.6]], 0.08);
  const rack = (xFrom: number, xTo: number, y: number, drops: [number, number][]) => {
    P.pipe([[xFrom, 12, 2.6], [xFrom, y, 2.6], [xTo, y, 2.6]], 0.05);
    for (const [x, yd] of drops) P.pipe([[x, y, 2.6], [x, yd, 2.6], [x, yd, 1.55]], 0.035);
  };

  // broodstock: four large round tanks with egg collectors
  for (const [x, y] of [[11.6, 2.9], [18.4, 2.9], [11.6, 8.2], [18.4, 8.2]]) {
    P.tank(x, y, 2.2, 0, 1.3, { drain: true });
    P.box(x + 2.35, y - 0.3, 0, x + 2.95, y + 0.3, 0.65, 'pe');
  }
  rack(9.0, 20.8, 5.55, [[11.6, 4.4], [18.4, 4.4], [11.6, 6.7], [18.4, 6.7]]);
  // incubation: cylindro-conical incubators on stands
  for (const x of [9.8, 12.2]) for (const y of [15, 17.2, 19.4, 21.6]) P.tank(x, y, 0.45, 0, 0.6, { cone: 0.45, legs: 0.45 });
  // live feed: algae columns against a light panel, rotifer tanks, artemia hatching cones
  P.box(14.7, 13.35, 0, 21.6, 13.5, 2.5, 'pe');
  for (let i = 0; i < 8; i++) P.vessel(15.1 + i * 0.88, 14.0, 0.18, 0, 2.1, 'ac', { head: 'flat' });
  for (const x of [16.2, 18.4, 20.6]) P.tank(x, 17.6, 0.72, 0, 0.9, { cone: 0.5, legs: 0.4, liquid: 'ar' });
  for (const x of [15.6, 17.0, 18.4, 19.8]) P.tank(x, 21.4, 0.3, 0, 0.55, { cone: 0.45, legs: 0.5, liquid: 'ar' });
  // larval rearing
  for (const x of [24.8, 30.0, 35.2, 40.4]) for (const y of [2.6, 8.3]) P.tank(x, y, 1.6, 0, 1.25, { drain: true });
  rack(23.2, 41.6, 5.45, [24.8, 30.0, 35.2, 40.4].flatMap((x) => [[x, 3.7], [x, 7.2]] as [number, number][]));
  // nursery
  for (const x of [27.0, 33.4, 39.8]) for (const y of [15.6, 21.2]) P.tank(x, y, 2.0, 0, 1.3, { drain: true });
  rack(25.2, 41.4, 18.4, [27.0, 33.4, 39.8].flatMap((x) => [[x, 17.0], [x, 19.8]] as [number, number][]));

  P.flow('product', [[15, 5.5, 1.6], [11, 18.3, 1.4], [32.6, 5.5, 1.6], [33.4, 18.4, 1.6]], 0.22);
}

/* ------------------------------------------------------------------ 04 sea and lake cages */
export function kafes(P: Plate) {
  // a 3 × 2 grid of 40 m cells in 24 m of water; HDPE circular cages (~90 m circumference), nets to 10 m
  const X = 182, Y = 136, Dp = 24;
  const GX = [30, 70, 110, 150], GY = [28, 68, 108], zg = -5;
  const cages: [number, number][] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) cages.push([(GX[i] + GX[i + 1]) / 2, (GY[j] + GY[j + 1]) / 2]);
  const R = 14.3, trunk = 64.5;

  // layer 0: seabed, anchors, mooring lines, grid, nets
  P.layer(0);
  P.ground(0, 0, X, Y, 2.5, 'sd', -Dp);
  P.zone('cipa', [[0, 0], [X, 0], [X, Y], [0, Y]], { tint: 's', z0: -Dp, h: 1.2, at: [110, Y - 3, -Dp + 9], noTint: true });
  const anchors: [V3, V3][] = [];
  for (const y of GY) { anchors.push([[GX[0], y, zg], [5, y, -Dp]]); anchors.push([[GX[3], y, zg], [X - 5, y, -Dp]]); }
  for (const x of GX) { anchors.push([[x, GY[0], zg], [x, 3, -Dp]]); anchors.push([[x, GY[2], zg], [x, Y - 3, -Dp]]); }
  for (const [a, b] of anchors) {
    P.solid(Math.min(a[0], b[0]), Math.min(a[1], b[1]), b[2], Math.max(a[0], b[0]), Math.max(a[1], b[1]), a[2], P.line([a, [b[0], b[1], b[2] + 0.7]], 'mo'));
    P.box(b[0] - 1.1, b[1] - 1.1, b[2], b[0] + 1.1, b[1] + 1.1, b[2] + 0.8, 'dk');
  }
  // the submerged grid frame, its plates and buoy lines
  for (const y of GY) P.solid(GX[0], y, zg, GX[3], y + 0.01, zg, P.line([[GX[0], y, zg], [GX[3], y, zg]], 'mo'));
  for (const x of GX) P.solid(x, GY[0], zg, x + 0.01, GY[2], zg, P.line([[x, GY[0], zg], [x, GY[2], zg]], 'mo'));
  for (const x of GX) for (const y of GY) P.box(x - 0.7, y - 0.7, zg - 0.12, x + 0.7, y + 0.7, zg + 0.12, 'st', 'tlr', P.line([[x, y, zg + 0.12], [x, y, -0.4]], 'mo'));
  // net pens: walls to 10 m, a shallow cone to 13 m, a sinker tube; bridles to the grid corners
  for (const [cx, cy] of cages) {
    let s = '';
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      s += P.line([[x, y, 0], [x, y, -10], [cx, cy, -13]], 'net');
    }
    for (const z of [-2.5, -5, -7.5]) s += P.ellipse(cx, cy, z, R, 'net');
    s += P.ellipse(cx, cy, -10, R, 'sink');
    for (const [gx, gy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const a = Math.atan2(gy, gx), px = cx + Math.cos(a) * (R + 0.5), py = cy + Math.sin(a) * (R + 0.5);
      s += P.line([[px, py, 0], [cx + gx * 20, cy + gy * 20, zg]], 'mo');
    }
    P.solid(cx - R - 6, cy - R - 6, -13, cx + R + 6, cy + R + 6, 0, s);
  }
  // submerged part of the feed barge hull
  P.box(155, 60, -1.4, 176, 69, 0, 'st');

  // layer 1: the water body — the column's two cut faces and the surface
  P.layer(1);
  P.pre(P.path([[X, 0, 0], [X, Y, 0], [X, Y, -Dp], [X, 0, -Dp]], 'wv') + P.path([[0, Y, 0], [X, Y, 0], [X, Y, -Dp], [0, Y, -Dp]], 'wv'));
  P.pre(P.path([[0, 0, 0], [X, 0, 0], [X, Y, 0], [0, Y, 0]], 'ws'));

  // layer 2: what floats — buoys, feed hoses, cage collars, the barge
  P.layer(2);
  P.zone('kafes', [[GX[0] + 4, GY[0] + 4], [GX[3] - 4, GY[0] + 4], [GX[3] - 4, GY[2] - 4], [GX[0] + 4, GY[2] - 4]], { tint: 'w', z0: -13, h: 14.2, at: [90, 88, 3.4], noTint: true });
  P.zone('izgara', [[GX[0], GY[0]], [GX[3], GY[0]], [GX[3], GY[2]], [GX[0], GY[2]]], { tint: 's', z0: zg - 0.6, h: 1.2, at: [GX[3], GY[0], 3], noTint: true });
  P.zone('bar', [[154, 59], [177, 59], [177, 70], [154, 70]], { tint: 'm', z0: -1.4, h: 7.6, noTint: true });
  for (const x of GX) for (const y of GY) P.vessel(x, y, 0.6, -0.2, 0.8, 'pe', { head: 'dome', headH: 0.35 });
  let hoses = P.line([[155, trunk, 0.05], [cages[0][0], trunk, 0.05]], 'hs');
  for (const [cx, cy] of cages) hoses += P.line([[cx, trunk, 0.05], [cx, cy < 68 ? cy + R + 0.7 : cy - R - 0.7, 0.05]], 'hs');
  P.pre(hoses);
  for (const [cx, cy] of cages) {
    let s = P.ellipse(cx, cy, 0.1, R + 0.9, 'col') + P.ellipse(cx, cy, 0.1, R, 'col');
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2, x = cx + Math.cos(a) * (R + 0.45), y = cy + Math.sin(a) * (R + 0.45);
      s += P.line([[x, y, 0.15], [x, y, 1.05]], 'rl');
    }
    s += P.ellipse(cx, cy, 1.05, R + 0.45, 'hr');
    P.solid(cx - R - 1, cy - R - 1, 0, cx + R + 1, cy + R + 1, 1.1, s);
  }
  // feed barge: hull, three feed silos, the blower and control house
  P.box(155, 60, 0, 176, 69, 1.6, 'st');
  for (const x of [158.6, 162.6, 166.6]) P.vessel(x, 64.5, 1.55, 1.6, 3.8, 'pe', { head: 'cone', headH: 0.9 });
  P.box(169.5, 61.2, 1.6, 175, 67.8, 4.9, 'tb', 'tlr', P.path([[175, 62.4, 4.1], [175, 66.6, 4.1], [175, 66.6, 3.1], [175, 62.4, 3.1]], 'e nf'));

  P.flow('product', [[155, trunk, 0.6], [cages[0][0], trunk, 0.6]]);
  for (const [cx, cy] of cages) P.flow('product', [[cx, trunk, 0.6], [cx, cy < 68 ? cy + R : cy - R, 0.6]]);
}

/* ------------------------------------------------------------------ 02 recirculating (RAS) and open systems */
export function ras(P: Plate) {
  const W = 40, D = 22, t = 0.3;
  P.ground(-3, -3, W + 5, D + 3, 0.6);
  P.zone('tank', [[t, t], [18.6, t], [18.6, D - t], [t, D - t]], { tint: 'l', h: 2.4 });
  P.zone('tambur', [[19.2, 8.6], [23.8, 8.6], [23.8, 13.4], [19.2, 13.4]], { tint: 'w', h: 2.4, at: [21.2, 10.6, 4.2] });
  P.zone('pompa', [[23.8, 8.6], [29, 8.6], [29, 13.6], [23.8, 13.6]], { tint: 'w', h: 1.9, at: [27.4, 12.6, 1.9] });
  P.zone('biyo', [[23.4, 0.6], [31, 0.6], [31, 8.2], [23.4, 8.2]], { tint: 'w', h: 3 });
  P.zone('gaz', [[30.4, 8.6], [35.6, 8.6], [35.6, 15.4], [30.4, 15.4]], { tint: 'w', h: 4, at: [31.9, 10.2, 5.8] });
  P.zone('uv', [[35.8, 11], [39.7, 11], [39.7, 16.6], [35.8, 16.6]], { tint: 'w', h: 1.8, at: [38.6, 15.6, 2.2] });
  P.building({ x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.1, eave: 6, ridge: 8, ridgeAxis: 'x', doors: [{ side: 'y1', at: 26, w: 3.5 }, { side: 'x1', at: 4, w: 1.2, arc: true }] });

  // culture tanks with central drains into a floor trench
  P.pre(P.flat([[3, 10.7], [21, 10.7], [21, 11.3], [3, 11.3]], 0.02, 'grate'));
  for (const [x, y] of [[5, 5.4], [13.6, 5.4], [5, 16.6], [13.6, 16.6]]) P.tank(x, y, 3.4, 0, 2, { drain: true, m: 'bl' });
  // drum filter: the drum turning in its tank
  P.box(19.6, 9.4, 0, 23.4, 12.6, 1.2, 'st');
  P.hcyl('x', 19.9, 23.1, 11, 1.35, 0.75, 'st', P.line([[23.1, 11, 2.1], [23.1, 11, 0.6]], 'e'));
  // pump sump and pumps
  P.basin(24.2, 9.2, 0, 28.6, 13.2, 1.3, { m: 'cn', level: 0.35 });
  for (const y of [10, 12.4]) { P.hcyl('x', 24.6, 25.4, y, 1.65, 0.22, 'dk'); P.hcyl('x', 25.4, 26, y, 1.65, 0.17, 'st'); }
  // moving-bed biofilter: two cells, media on the surface
  P.basin(23.8, 1, 0, 27.3, 7.8, 2.6, { m: 'pe', t: 0.12, level: 0.3, fill: 'pd' });
  P.basin(27.3, 1, 0, 30.8, 7.8, 2.6, { m: 'pe', t: 0.12, level: 0.3, fill: 'pd' });
  // CO2 stripper over its own sump, oxygen cones, liquid oxygen outside
  P.box(30.9, 9.2, 0, 33, 11.3, 3.4, 'st', 'tlr', [0.6, 1.2, 1.8, 2.4, 3].map((z) => P.line([[30.9, 11.3, z], [33, 11.3, z]], 'e')).join('') + P.ellipse(31.95, 10.25, 3.41, 0.6, 'dk t'));
  for (const y of [12.6, 14.4]) P.vessel(32.4, y, 0.6, 0, 0.7, 'st', { head: 'cone', headH: 2.1, legs: 0.35 });
  P.vessel(W + 2.4, 2.4, 0.9, 0, 4.2, 'st', { head: 'dome', headH: 0.45, legs: 0.6 });
  // UV on its stand
  P.box(36.4, 12.4, 0, 39.2, 15.2, 0.7, 'st');
  P.hcyl('y', 12.2, 15.4, 37.2, 1.05, 0.22, 'st');
  P.hcyl('y', 12.2, 15.4, 38.4, 1.05, 0.22, 'st');
  // return main between the tank rows, a drop to each tank
  P.pipe([[37.8, 15.4, 1.3], [37.8, 17.6, 1.3], [37.8, 17.6, 2.7], [37.8, 11, 2.7], [1.6, 11, 2.7]], 0.09);
  for (const x of [5, 13.6]) { P.pipe([[x, 11, 2.7], [x, 8, 2.7], [x, 8, 2.2]], 0.06); P.pipe([[x, 11, 2.7], [x, 14, 2.7], [x, 14, 2.2]], 0.06); }
  P.pipe([[W + 1.4, 2.4, 1.6], [W - 0.6, 2.4, 1.6], [33.2, 2.4, 1.6], [33.2, 12, 1.6]], 0.04, 'pa');

  P.flow('water', [[9.3, 11, 0.4], [21.5, 11, 2.4], [26.4, 11.2, 1.6], [25.6, 4.4, 2.9], [31.9, 10.2, 3.8], [32.4, 13.5, 3.4], [37.8, 13.8, 1.6], [37.8, 11, 3], [9.3, 11, 3]]);
}

/* ------------------------------------------------------------------ 03 grow-out farm: flow-through raceways */
export function besi(P: Plate) {
  const X = 70, Y = 47;
  P.ground(0, 0, X, Y, 1.6, 'ea');
  // the stream along the back edge
  P.pit(0, 0.6, X, 6.4, 1.1, { run: 1.1, level: 0.45, liquid: 'wd' });
  P.zone('alma', [[3, 6.4], [10, 6.4], [10, 12.6], [3, 12.6]], { tint: 'w', h: 2.4 });
  P.zone('kanal', [[10, 9.6], [62.6, 9.6], [62.6, 12.4], [10, 12.4]], { tint: 'w', h: 1.5 });
  P.zone('havuz', [[10.4, 12.8], [44.4, 12.8], [44.4, 38.2], [10.4, 38.2]], { tint: 'l', h: 1.7 });
  P.zone('cikis', [[[8.6, 38.4], [47.6, 38.4], [47.6, 42.4], [8.6, 42.4]], [[47.6, 29.4], [62.6, 29.4], [62.6, 42.4], [47.6, 42.4]], [[62.6, 6.4], [65.6, 6.4], [65.6, 42.4], [62.6, 42.4]]], { tint: 'w', h: 1.3, at: [55, 36, 2] });
  P.zone('bina', [[47.6, 13.6], [60.4, 13.6], [60.4, 25.4], [47.6, 25.4]], { tint: 's', h: 5 });
  // intake: weir with a gate, a short channel to the supply canal
  P.basin(3.6, 6.4, 0, 9.4, 12.4, 1.4, { m: 'cn', t: 0.3, level: 0.4 });
  P.box(3.6, 8.6, 1.4, 9.4, 8.9, 2.6, 'st', 'tlr', [4.6, 5.6, 6.6, 7.6, 8.6].map((x) => P.line([[x, 8.9, 1.4], [x, 8.9, 2.6]], 'e')).join(''));
  P.basin(9.4, 9.8, 0, 62.4, 12.2, 1.1, { m: 'cn', t: 0.22, level: 0.3 });
  // ten concrete raceways, a demand feeder on each
  for (let i = 0; i < 10; i++) {
    const x0 = 10.6 + i * 3.35;
    P.basin(x0, 12.6, 0, x0 + 3.35, 38, 1.2, { m: 'cn', t: 0.18, level: 0.28 });
    P.vessel(x0 + 1.68, 21, 0.38, 1.3, 0.5, 'pe', { cone: 0.35, legs: 0.0 });
  }
  // outlet canal, settling pond, return channel to the stream
  P.basin(8.8, 38.6, 0, 47.4, 41.6, 1.0, { m: 'cn', t: 0.22, level: 0.3 });
  P.basin(47.8, 29.6, 0, 62.4, 42.2, 1.4, { m: 'cn', t: 0.3, level: 0.35, liquid: 'wd' });
  P.basin(62.8, 6.6, 0, 65.4, 42.2, 0.9, { m: 'cn', t: 0.2, level: 0.3 });
  // feed store and service building
  P.building({ x0: 48, y0: 14, x1: 60, y1: 25, t: 0.25, cut: 1.1, eave: 4.5, ridge: 6, ridgeAxis: 'x', doors: [{ side: 'x0', at: 19.5, w: 3 }] });
  for (const [x, y] of [[50, 16], [52.6, 16], [55.2, 16], [50, 18.6], [52.6, 18.6]]) P.box(x, y, 0, x + 2.2, y + 2.2, 1.3, 'ld');

  P.flow('water', [[3, 3.6, 0.3], [6.5, 9, 1.8], [11, 11, 1.5], [27.4, 11, 1.5], [27.4, 30, 1.6], [27.4, 40.1, 1.4], [47.6, 40.1, 1.4], [55, 36, 1.7], [64.1, 30, 1.3], [64.1, 7, 1.3], [64.1, 3.6, 0.3]]);
}

/* ------------------------------------------------------------------ 05 land-based farm on the coast */
export function karada(P: Plate) {
  const X = 66, Y = 46, S = 16;
  // land first (plinth and quay wall), then the sea in front of it, then everything on land
  P.layer(0);
  P.ground(0, 0, X, Y, 1.4, 'sl');
  P.pre(P.faces(0, Y - 0.01, -6.2, X, Y, -1.4, 'cn', 'lr'));
  P.pre(P.faces(0, Y, -7, X, Y + S, -6.2, 'sd'));
  P.pipe([[9, Y + S - 2, -3.4], [9, Y + 0.4, -3.4]], 0.22, 'pk');
  P.pipe([[57, Y + 0.4, -2.6], [57, Y + S - 4, -2.6]], 0.2, 'pk');
  P.layer(1);
  P.pre(P.path([[X, Y, -0.8], [X, Y + S, -0.8], [X, Y + S, -6.2], [X, Y, -6.2]], 'wv') + P.path([[0, Y + S, -0.8], [X, Y + S, -0.8], [X, Y + S, -6.2], [0, Y + S, -6.2]], 'wv'));
  P.pre(P.path([[0, Y, -0.8], [X, Y, -0.8], [X, Y + S, -0.8], [0, Y + S, -0.8]], 'ws'));
  P.layer(2);
  P.zone('alma', [[3.6, 35.6], [12.4, 35.6], [12.4, 44.4], [3.6, 44.4]], { tint: 'w', h: 3.2 });
  P.zone('depo', [[14.6, 36.4], [22, 36.4], [22, 43.6], [14.6, 43.6]], { tint: 'w', h: 5.4 });
  P.zone('tank', [[21.6, 2.4], [60.4, 2.4], [60.4, 31.6], [21.6, 31.6]], { tint: 'l', h: 2.2 });
  P.zone('cikis', [[[60.6, 2.4], [64, 2.4], [64, 45.6], [60.6, 45.6]], [[47.6, 35.4], [60.6, 35.4], [60.6, 45.6], [47.6, 45.6]]], { tint: 'w', h: 1.6, at: [54, 40.5, 2.2] });
  P.zone('bina', [[3.6, 3.6], [16.4, 3.6], [16.4, 20.4], [3.6, 20.4]], { tint: 's', h: 4.4 });
  // pump station on the quay
  P.building({ x0: 4, y0: 36, x1: 12, y1: 44, t: 0.25, cut: 1.1, eave: 4, ridge: 5.2, ridgeAxis: 'y', doors: [{ side: 'x1', at: 39, w: 1.2, arc: true }] });
  for (const x of [6.2, 8.2, 10.2]) { P.box(x - 0.5, 40, 0, x + 0.5, 41.6, 0.2, 'st'); P.hcyl('y', 40.2, 40.9, x, 0.55, 0.28, 'dk'); P.hcyl('y', 40.9, 41.5, x, 0.55, 0.22, 'st'); }
  P.pipe([[9, Y + 0.4, -3.4], [9, Y + 0.4, 0.3], [9, 42.6, 0.3], [9, 42.6, 0.55]], 0.22, 'pk');
  // header tank on its plinth
  P.box(15.2, 37.2, 0, 21.4, 43, 2, 'cn');
  P.tank(18.3, 40.1, 2.6, 2, 2.6, { level: 0.4 });
  P.pipe([[10.2, 41.6, 0.55], [10.2, 42.8, 0.55], [10.2, 42.8, 4.4], [16.4, 42.8, 4.4]], 0.11);
  P.pipe([[18.3, 37.4, 2.4], [18.3, 34, 2.4], [21.2, 34, 2.4], [21.2, 12, 2.4], [59.6, 12, 2.4]], 0.11);
  P.pipe([[21.2, 34, 2.4], [59.6, 34, 2.4]], 0.09);
  // twelve grow-out tanks
  for (const x of [26, 35.8, 45.6, 55.4]) for (const y of [7, 17, 27]) P.tank(x, y, 4, 0, 1.8, { drain: true, m: 'cn' });
  for (const x of [26, 35.8, 45.6, 55.4]) {
    P.pipe([[x, 12, 2.4], [x, 10.4, 2.4], [x, 10.4, 1.9]], 0.05);
    P.pipe([[x, 12, 2.4], [x, 13.6, 2.4], [x, 13.6, 1.9]], 0.05);
    P.pipe([[x, 34, 2.4], [x, 30.6, 2.4], [x, 30.6, 1.9]], 0.05);
  }
  // effluent channel, settling basin, outfall
  P.basin(60.8, 2.6, 0, 63.8, 35.2, 0.9, { m: 'cn', t: 0.2, level: 0.3 });
  P.basin(48, 35.6, 0, 63.8, 45.4, 1.4, { m: 'cn', t: 0.3, level: 0.35, liquid: 'wd' });
  P.pipe([[57, 45.4, 0.3], [57, Y + 0.4, 0.3], [57, Y + 0.4, -2.6]], 0.2, 'pk');
  // service building and feed store
  P.building({ x0: 4, y0: 4, x1: 16, y1: 20, t: 0.25, cut: 1.1, eave: 4.6, ridge: 6.2, ridgeAxis: 'y', doors: [{ side: 'x1', at: 16, w: 3.2 }], parts: [{ axis: 'x', at: 10, from: 4.25, to: 15.75, doors: [{ at: 7, w: 1, arc: true }] }] });
  for (const [x, y] of [[5.4, 11.4], [8, 11.4], [10.6, 11.4], [5.4, 14], [8, 14], [5.4, 16.6]]) P.box(x, y, 0, x + 2.2, y + 2.2, 1.4, 'ld');

  P.flow('water', [[9, Y + 9, -0.5], [9, 42, 3.4], [18.3, 40.1, 5.2], [21.2, 34, 2.9], [21.2, 12, 2.9], [55.4, 12, 2.9], [62.3, 18, 1.3], [62.3, 35, 1.3], [56, 40.5, 1.8], [57, Y + 8, -0.5]]);
}

/* ------------------------------------------------------------------ 06 earthen and concrete ponds */
export function havuz(P: Plate) {
  const X = 122, Y = 74;
  P.ground(0, 0, X, Y, 2.6, 'ea');
  P.zone('pompa', [[1.6, 1.6], [9.4, 1.6], [9.4, 8.4], [1.6, 8.4]], { tint: 'w', h: 3.4 });
  P.zone('giris', [[1.6, 8.8], [120.4, 8.8], [120.4, 12], [1.6, 12]], { tint: 'w', h: 1.3 });
  P.zone('toprak', [[3, 14], [100.4, 14], [100.4, 62], [3, 62]], { tint: 'l', z0: -1.8, h: 2.3, noTint: true, at: [64, 38, 1.4] });
  P.zone('beton', [[103.6, 13.6], [119.4, 13.6], [119.4, 62.4], [103.6, 62.4]], { tint: 'l', h: 1.8 });
  P.zone('bosaltma', [[1.6, 64.4], [120.4, 64.4], [120.4, 70.6], [1.6, 70.6]], { tint: 'w', z0: -1.6, h: 2, noTint: true, at: [110, 67.5, 1.4] });
  // pump station and inlet canal with a valve at each pond
  P.building({ x0: 2, y0: 2, x1: 9, y1: 8, t: 0.25, cut: 1.1, eave: 3.8, ridge: 5, ridgeAxis: 'x', doors: [{ side: 'x1', at: 5, w: 1.1, arc: true }] });
  for (const x of [4, 6.6]) { P.hcyl('x', x - 0.6, x + 0.2, 5, 0.5, 0.28, 'dk'); P.hcyl('x', x + 0.2, x + 0.7, 5, 0.5, 0.22, 'st'); }
  P.basin(2, 9, 0, 120, 11.8, 0.9, { m: 'cn', t: 0.2, level: 0.3 });
  // four earthen ponds (1:2 banks, 1.8 m deep), monks at the deep end
  const ponds = [3, 27.6, 52.2, 76.8];
  for (const x0 of ponds) {
    P.pit(x0, 14, x0 + 23.6, 62, 1.8, { run: 2, level: 0.45 });
    P.box(x0 + 11, 11.8, 0, x0 + 12.6, 12.8, 0.6, 'st');
  }
  P.layer(1);
  for (const x0 of ponds) {
    P.box(x0 + 11.2, 59.4, -1.8, x0 + 12.4, 60.6, 0.5, 'cn');
    for (const [ax, ay] of [[x0 + 6, 24], [x0 + 17, 47]]) {
      P.box(ax - 0.9, ay - 0.35, -0.45, ax + 0.9, ay + 0.35, -0.15, 'pe');
      P.hcyl('x', ax - 1.6, ax - 0.95, ay, -0.3, 0.4, 'st');
      P.hcyl('x', ax + 0.95, ax + 1.6, ay, -0.3, 0.4, 'st');
      P.box(ax - 0.3, ay - 0.25, -0.15, ax + 0.3, ay + 0.25, 0.3, 'dk');
    }
  }
  P.layer(0);
  // concrete ponds
  for (let i = 0; i < 4; i++) P.basin(104, 14 + i * 12, 0, 119, 25.6 + i * 12, 1.5, { m: 'cn', t: 0.25, level: 0.3 });
  // drain canal along the front
  P.pit(2, 64.8, 120, 70.2, 1.6, { run: 1, level: 0.5, m: 'cn', liquid: 'wd' });

  P.flow('water', [[5.5, 5, 3.2], [5.5, 10.4, 1.4], [64, 10.4, 1.4], [64, 13.6, 0.6], [64, 38, -0.2], [64, 60, -0.2], [64, 67.5, -0.6], [121, 67.5, -0.6]]);
}

/* ------------------------------------------------------------------ 07 fish processing plant */
export function isleme(P: Plate) {
  const W = 50, D = 24, t = 0.3;
  P.ground(-2, -2, W + 12, D + 11, 0.6);
  P.zone('kabul', [[t, t], [8.93, t], [8.93, D - t], [t, D - t]], { tint: 'm', h: 2.6 });
  P.zone('yikama', [[9.07, t], [18.93, t], [18.93, D - t], [9.07, D - t]], { tint: 'w', h: 2 });
  P.zone('fileto', [[19.07, t], [30.93, t], [30.93, D - t], [19.07, D - t]], { tint: 'p', h: 2 });
  P.zone('paket', [[31.07, t], [39.93, t], [39.93, D - t], [31.07, D - t]], { tint: 'p', h: 2 });
  P.zone('soguk', [[40.07, t], [W - t, t], [W - t, D - t], [40.07, D - t]], { tint: 'c', h: 3.6 });
  P.zone('sevk', [[W, 2.2], [W + 11.5, 2.2], [W + 11.5, 9.8], [W, 9.8]], { tint: 's', h: 4 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 6, ridge: 7.6, ridgeAxis: 'x',
    doors: [{ side: 'y1', at: 4.4, w: 3.6 }, { side: 'x1', at: 6, w: 3 }, { side: 'y0', at: 24, w: 1, arc: true }],
    parts: [
      { axis: 'y', at: 9, from: t, to: D - t, doors: [{ at: 9, w: 2.4 }] },
      { axis: 'y', at: 19, from: t, to: D - t, doors: [{ at: 8, w: 2.4 }] },
      { axis: 'y', at: 31, from: t, to: D - t, doors: [{ at: 7.6, w: 2.4 }] },
      { axis: 'y', at: 40, from: t, to: D - t, doors: [{ at: 7.6, w: 1.8 }, { at: 18, w: 1.8 }], t: 0.2, h: 1.6 },
      { axis: 'x', at: 13, from: 40.1, to: W - t, t: 0.2, h: 1.6, doors: [{ at: 45, w: 1.6 }] },
    ],
  });
  // reception: iced tubs, flake-ice machine, platform scale
  for (const x of [1.2, 3, 4.8]) for (const y of [14.6, 16.4]) P.basin(x, y, 0, x + 1.4, y + 1.2, 0.8, { m: 'bl', t: 0.06, level: 0.12, liquid: 'ice' });
  P.box(6.2, 1, 0, 8.4, 3.2, 1.2, 'st');
  P.box(6.4, 1.2, 1.2, 8.2, 3, 2.6, 'st', 'tlr', P.path([[8.2, 1.6, 2.3], [8.2, 2.6, 2.3], [8.2, 2.6, 1.6], [8.2, 1.6, 1.6]], 'e nf'));
  P.box(2, 6, 0, 5, 8.6, 0.12, 'dk');
  // washing and grading
  P.box(10, 8, 0, 13.6, 10.2, 1.2, 'st', 'tlr', P.flat([[10.2, 8.2], [13.4, 8.2], [13.4, 10], [10.2, 10]], 1.21, 'wa'));
  P.box(13.6, 8.7, 0.85, 15.2, 9.5, 1.0, 'st');
  P.box(15.2, 6.6, 0, 18.4, 11.6, 1.35, 'st', 'tlr', [7.4, 8.2, 9, 9.8, 10.6].map((y) => P.line([[15.4, y, 1.36], [18.2, y, 1.36]], 'e')).join(''));
  for (const x of [15.4, 16.6, 17.8]) P.basin(x, 12.4, 0, x + 1, 13.4, 0.7, { m: 'bl', t: 0.05, level: 0.15, liquid: 'ice' });
  // gutting and filleting: two tables either side of a conveyor, two machines
  P.box(19.8, 5, 0, 30.2, 6.3, 0.9, 'st');
  P.box(19.8, 7.3, 0, 30.2, 8.3, 1.0, 'st');
  P.box(19.8, 9.3, 0, 30.2, 10.6, 0.9, 'st');
  P.box(21, 14.4, 0, 24.2, 16.2, 1.6, 'st', 'tlr', P.path([[24.2, 14.8, 1.3], [24.2, 15.8, 1.3], [24.2, 15.8, 0.6], [24.2, 14.8, 0.6]], 'e nf'));
  P.box(25.6, 14.4, 0, 28.4, 15.9, 1.3, 'st');
  // packing: tables, check weigher, cartons
  P.box(32, 4.2, 0, 38.6, 5.5, 0.9, 'st');
  P.box(32, 9.2, 0, 38.6, 10.5, 0.9, 'st');
  P.box(32.4, 7, 0.6, 39.6, 7.9, 0.9, 'st');
  for (const [x, y, z] of [[33, 15.5, 0], [34.3, 15.5, 0], [33, 16.8, 0], [33, 15.5, 0.6]]) P.box(x, y, z, x + 1.2, y + 1.2, z + 0.6, 'ld');
  // blast freezer and cold store
  P.racks(41, 1.2, 49.4, 2.6, 2, 'x');
  P.racks(41, 5.6, 49.4, 7, 2, 'x');
  P.racks(41, 9.4, 49.4, 10.8, 2, 'x');
  P.box(42, 13.4, 2.6, 48, 14.3, 3.4, 'st', 'tlr', [43.5, 45, 46.5].map((x) => P.disc('y', [x, 14.3, 3], 0.3, 'fan')).join(''));
  for (const x of [41.6, 43.6, 45.6]) P.box(x, 16.4, 0, x + 1.4, 18.6, 1.8, 'st');
  // trucks at the reception door and the dispatch dock
  P.truck(4.4, D + 6.2, 'y+');
  P.box(W, 4.6, 0, W + 1.2, 7.4, 1.1, 'dk');
  P.truck(W + 6.3, 6, 'x+');

  P.flow('product', [[4.4, D + 2.5, 1.6], [4.4, 15.6, 1.5], [11.8, 9.1, 1.8], [16.8, 9.1, 1.9], [25, 7.8, 1.6], [35.3, 7.4, 1.4], [45, 15.6, 2.4], [45, 6, 3.4], [W + 1, 6, 1.9]], 0.12);
}

/* ------------------------------------------------------------------ 08 feed and food machinery: the fish feed extrusion line
   Station order from src/data/journeys.ts ('kultur-baligi-yemi'): silo → hammer mill → mixer → extruder with
   conditioner → air conveyor → multi-layer dryer → SGT-II two-drum flavouring → cooling conveyor → crumbler →
   vibrating sieve → SPK packaging. */
export function yemGida(P: Plate) {
  const W = 48, D = 18, t = 0.3, yl = 8;
  P.ground(-10, -3, W + 3, D + 3, 0.6);
  P.zone('hammadde', [[-8.6, 0.8], [5.4, 0.8], [5.4, 13.2], [-8.6, 13.2]], { tint: 'm', h: 3, at: [1.6, 11.6, 3.4] });
  P.zone('karisim', [[5.6, 5.6], [10.8, 5.6], [10.8, 10.4], [5.6, 10.4]], { tint: 'm', h: 3 });
  P.zone('ekstruder', [[11, 5.4], [22.6, 5.4], [22.6, 10.6], [11, 10.6]], { tint: 'p', h: 3.8 });
  P.zone('kurutma', [[23, 4.6], [33.6, 4.6], [33.6, 11.4], [23, 11.4]], { tint: 'p', h: 4.6 });
  P.zone('yaglama', [[33.8, 5.6], [44.2, 5.6], [44.2, 10.4], [33.8, 10.4]], { tint: 'p', h: 2.6 });
  P.zone('paket', [[44.4, 2.4], [W - t, 2.4], [W - t, 12.4], [44.4, 12.4]], { tint: 's', h: 3.6 });
  P.building({ x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 9, ridge: 10.8, ridgeAxis: 'x', doors: [{ side: 'y1', at: 44, w: 4 }, { side: 'y1', at: 8, w: 1.1, arc: true }] });

  // raw material silos outside, an inclined screw into the mill
  for (const y of [3.6, 10.4]) P.vessel(-4.6, y, 2.4, 0, 6, 'st', { head: 'cone', headH: 1.1, cone: 2.8, legs: 2.2 });
  P.beam([-3.2, 6.4, 2.2], [3.4, 7.2, 3.2], 0.36, 0.36);
  // hammer mill with its feed hopper and motor
  P.box(2.4, 6.6, 0, 4.6, 8.4, 1.6, 'st');
  P.box(2.7, 6.9, 1.6, 4.3, 8.1, 2.4, 'st');
  P.hcyl('y', 8.4, 9.4, 3.5, 0.8, 0.42, 'dk');
  // ribbon mixer on its frame
  P.box(6, 6.6, 0, 10.2, 8.4, 1.2, 'st');
  P.hcyl('x', 6, 10.2, yl - 0.5, 1.95, 0.85, 'st');
  P.box(5.4, 7, 1.4, 6, 8, 2.4, 'dk');
  P.beam([10.2, 7.5, 1.6], [13.6, 7.5, 2.9], 0.3, 0.3);
  // extruder: motor, barrel, conditioner and feeder, die and cutter
  P.box(12.4, 6.6, 0, 21.4, 8.4, 0.9, 'st');
  P.box(12.6, 6.8, 0.9, 14.6, 8.2, 2.1, 'dk');
  P.hcyl('x', 14.6, 20.6, yl - 0.5, 1.3, 0.36, 'st');
  P.hcyl('x', 15.2, 19.8, yl - 0.5, 2.35, 0.48, 'st');
  P.box(14.9, 7, 2.8, 16.1, 8, 3.8, 'st');
  P.box(20.6, 7, 0.9, 21.4, 8, 1.8, 'st');
  // air conveyor up to the cyclone over the dryer
  P.pipe([[21.2, 7.5, 1.6], [21.2, 7.5, 6.3], [24.4, 7.5, 6.3]], 0.16, 'pa');
  P.vessel(25.2, 7.5, 0.7, 4.8, 1.4, 'st', { head: 'dome', headH: 0.25, cone: 0.7 });
  // multi-layer dryer with exhaust fans and its steam coil
  P.box(23.6, 5.6, 0, 33, 9.4, 4.2, 'st', 'tlr', [1.1, 2.1, 3.1].map((z) => P.line([[23.6, 9.4, z], [33, 9.4, z]], 'e')).join('') + P.ellipse(27.4, 7.5, 4.21, 0.55, 'dk t') + P.ellipse(30.4, 7.5, 4.21, 0.55, 'dk t'));
  P.box(29, 9.4, 0, 32, 10.6, 1.8, 'st');
  // two-drum flavouring line, cooling conveyor
  for (const x0 of [34.2, 37.6]) { P.box(x0 + 0.2, 6.9, 0, x0 + 2.8, 8.1, 0.8, 'st'); P.hcyl('x', x0, x0 + 3, yl - 0.5, 1.45, 0.62, 'st'); }
  P.box(40.4, 6.6, 0, 44, 8.4, 1.5, 'st', 'tlr', P.ellipse(42.2, 7.5, 1.51, 0.45, 'dk t'));
  // crumbler, vibrating sieve, vertical packaging machine, cartons
  P.box(44.6, 6.8, 0, 45.8, 8.2, 1.7, 'st');
  P.box(44.6, 9.4, 0, 47.2, 11, 1.05, 'st');
  P.box(45.4, 3, 0, 47.4, 4.8, 3.1, 'st', 'tlr', P.path([[47.4, 3.4, 2.4], [47.4, 4.4, 2.4], [47.4, 4.4, 1.2], [47.4, 3.4, 1.2]], 'e nf'));
  P.box(45.8, 3.3, 3.1, 47, 4.5, 3.6, 'st');
  for (const [x, y, z] of [[42.2, 13.6, 0], [43.5, 13.6, 0], [42.2, 14.9, 0], [42.2, 13.6, 0.7]]) P.box(x, y, z, x + 1.2, y + 1.2, z + 0.7, 'ld');
  // bagged raw materials beside the mill, a control room on the front wall
  for (const [x, y] of [[1.4, 12.4], [3, 12.4], [4.6, 12.4], [1.4, 14.2], [3, 14.2]]) P.box(x, y, 0, x + 1.3, y + 1.3, 1.1, 'ld');
  P.building({ x0: 14, y0: 12.6, x1: 22, y1: 17.7, t: 0.15, cut: 1.2, bare: true, doors: [{ side: 'y0', at: 16, w: 1, arc: true }] });
  P.box(15, 13.2, 0, 19, 13.9, 0.8, 'st');

  P.flow('product', [[-4.6, 7, 8.6], [3.5, 7.5, 2.8], [8.1, 7.5, 3.1], [17.5, 7.5, 3.3], [25.2, 7.5, 7], [28.3, 7.5, 4.6], [39.1, 7.5, 2.4], [42.2, 7.5, 1.9], [46.4, 3.9, 3.9]]);
}

/* ------------------------------------------------------------------ 09 freshwater and marine aquarium */
export function akvaryum(P: Plate) {
  const W = 34, D = 22, t = 0.3;
  P.ground(-2, -2, W + 2, D + 3, 0.6);
  P.zone('ana', [[2.6, 1.6], [17.6, 1.6], [17.6, 12], [2.6, 12]], { tint: 'w', h: 4.6 });
  P.zone('sergi', [[t, 12.1], [W - t, 12.1], [W - t, D - t], [t, D - t]], { tint: 'p', h: 2.9 });
  P.zone('lss', [[19.07, t], [27.93, t], [27.93, 6.6], [19.07, 6.6]], { tint: 'w', h: 3.4 });
  P.zone('rezerv', [[19.07, 6.6], [27.93, 6.6], [27.93, 10.4], [19.07, 10.4]], { tint: 'w', h: 2 });
  P.zone('karantina', [[28.07, t], [W - t, t], [W - t, 10.4], [28.07, 10.4]], { tint: 'l', h: 1.6 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.2, eave: 7, ridge: 8.6, ridgeAxis: 'x',
    doors: [{ side: 'y1', at: 28, w: 2.6 }, { side: 'x0', at: 6, w: 1.1, arc: true }],
    parts: [
      { axis: 'x', at: 10.5, from: 19, to: W - t, doors: [{ at: 21, w: 1.1, arc: true }] },
      { axis: 'y', at: 19, from: t, to: 10.58, doors: [{ at: 1.6, w: 1.1 }] },
      { axis: 'y', at: 28, from: t, to: 10.42, doors: [{ at: 8.8, w: 1, arc: true }] },
    ],
  });
  // main exhibit tank: concrete with an acrylic window to the gallery, a service catwalk behind
  P.basin(3, 2.6, 0, 17.4, 11.8, 4.2, { m: 'cn', t: 0.35, level: 0.3, liquid: 'wd' });
  P.post(P.path([[4.6, 11.8, 3.6], [15.8, 11.8, 3.6], [15.8, 11.8, 0.5], [4.6, 11.8, 0.5]], 'acr'));
  P.box(3, 1.2, 4, 17.4, 2.6, 4.2, 'st');
  P.rail([3, 1.2, 4.2], [17.4, 1.2, 4.2], 1.1);
  // display aquaria in the wall to the gallery, columnar tanks in the gallery, a bench
  for (const x of [19.6, 23.2, 26.8, 30.4]) {
    P.box(x, 10.7, 0, x + 3, 11.9, 0.85, 'st');
    P.box(x, 10.7, 0.85, x + 3, 11.9, 2.3, 'acr', 'tlr');
  }
  for (const [x, y] of [[8, 17.4], [14.6, 18.6], [21.4, 17.2]]) P.vessel(x, y, 0.85, 0, 2.6, 'acr', { head: 'flat' });
  P.box(7, 13.4, 0, 13.6, 14, 0.45, 'pe');
  // life support: sand filters, protein skimmers, UV, heat pump; reserve sumps and salt mixing
  for (const x of [20.4, 22.4]) P.vessel(x, 1.6, 0.8, 0, 1.6, 'st', { head: 'dome', headH: 0.35, legs: 0.3 });
  for (const x of [24.6, 26]) P.vessel(x, 1.4, 0.48, 0, 2.6, 'st', { head: 'cone', headH: 0.4 });
  P.box(20, 4.2, 0, 23.2, 5.2, 0.6, 'st');
  P.hcyl('x', 20.2, 23, 4.7, 0.95, 0.2, 'st');
  P.box(24.4, 3.6, 0, 27.4, 5.8, 1.5, 'st', 'tlr', P.ellipse(25.9, 4.7, 1.51, 0.6, 'dk t'));
  P.basin(19.6, 7, 0, 23.4, 10, 1.3, { m: 'pe', t: 0.08, level: 0.3 });
  P.tank(25.6, 8.5, 1.3, 0, 1.6, { level: 0.35 });
  // quarantine tanks
  for (const x of [28.8, 31.4]) for (const y of [1.4, 4.2]) P.basin(x, y, 0, x + 2.2, y + 1.8, 1.0, { m: 'pe', t: 0.06, level: 0.15 });
  // supply and return between the exhibit and the life support room
  P.pipe([[17.4, 6, 3.4], [21.4, 6, 3.4], [21.4, 2.6, 3.4], [21.4, 2.6, 2.3]], 0.12);
  P.pipe([[26, 5.8, 3], [26, 9.6, 3], [17.4, 9.6, 3]], 0.1);

  P.flow('water', [[10.2, 7.2, 4.6], [21.4, 6, 3.8], [21.4, 1.6, 2.6], [25.3, 1.4, 3.4], [21.6, 4.7, 1.6], [25.9, 4.7, 2.2], [26, 9.6, 3.4], [10.2, 9.6, 4.6]]);
}

/* ------------------------------------------------------------------ 10 aquaponics in a greenhouse */
export function akuaponik(P: Plate) {
  const W = 36, D = 16;
  P.ground(-2, -2, W + 2, D + 2, 0.5);
  P.zone('balik', [[0.8, 0.8], [6.4, 0.8], [6.4, 15.2], [0.8, 15.2]], { tint: 'l', h: 2.1, at: [3.6, 11.4, 2.6] });
  P.zone('ayirici', [[6.6, 6.2], [9.4, 6.2], [9.4, 9.8], [6.6, 9.8]], { tint: 'w', h: 2.6, at: [8, 8, 3.4] });
  P.zone('biyo', [[9.4, 6.2], [12.6, 6.2], [12.6, 9.8], [9.4, 9.8]], { tint: 'w', h: 1.7, at: [11.6, 8.8, 1.9] });
  P.zone('bitki', [[13.2, 1.2], [34.8, 1.2], [34.8, 14.8], [13.2, 14.8]], { tint: 'l', h: 0.9 });
  P.zone('hazne', [[7.8, 11.4], [12.4, 11.4], [12.4, 15.2], [7.8, 15.2]], { tint: 'w', h: 1.4, at: [11.4, 14.4, 1.3] });
  // knee wall and the arched frame of the greenhouse
  P.building({ x0: 0, y0: 0, x1: W, y1: D, t: 0.2, cut: 0.6, bare: true, doors: [{ side: 'x0', at: 8, w: 2 }] });
  for (let x = 0; x <= W; x += 4) P.phantom(P.archPts('x', x, 0, D, 3.2, 6.4));
  P.phantom([[0, 0, 3.2], [W, 0, 3.2]]); P.phantom([[0, D, 3.2], [W, D, 3.2]]); P.phantom([[0, D / 2, 6.4], [W, D / 2, 6.4]]);
  for (const x of [0, W]) for (const y of [0, D]) P.phantom([[x, y, 0.6], [x, y, 3.2]]);
  // fish tanks, swirl separator, biofilter, sump
  P.tank(3.6, 4.6, 2.2, 0, 1.6, { drain: true, m: 'bl' });
  P.tank(3.6, 11.4, 2.2, 0, 1.6, { drain: true, m: 'bl' });
  P.tank(8, 8, 0.85, 0, 1, { cone: 0.75, legs: 0.35 });
  P.basin(9.6, 6.6, 0, 12.4, 9.4, 1.3, { m: 'pe', t: 0.08, level: 0.25, fill: 'pd' });
  P.basin(8.2, 11.8, 0, 12, 14.8, 0.9, { m: 'pe', t: 0.08, level: 0.25 });
  P.hcyl('x', 9.4, 10.2, 13.3, 1.15, 0.2, 'dk');
  // three deep-water beds with rafts of plants
  for (const y0 of [1.6, 6.6, 11.6]) P.basin(13.6, y0, 0, 34.4, y0 + 2.8, 0.45, { m: 'pe', t: 0.1, level: 0.06, fill: 'pg' });
  // piping: tanks → separator → biofilter → beds; beds → sump → tanks
  P.pipe([[5.6, 8, 1.3], [7.2, 8, 1.3]], 0.07);
  P.pipe([[12.4, 8, 1.1], [13, 8, 1.1], [13, 3, 1.1], [13, 13, 1.1]], 0.06);
  P.pipe([[34.8, 3, 0.3], [34.8, 15.4, 0.3], [11, 15.4, 0.3], [11, 14.8, 0.3]], 0.06);
  P.pipe([[9.8, 13.3, 1.2], [9.8, 15.6, 1.2], [3.6, 15.6, 1.2], [3.6, 13.6, 1.2]], 0.06);

  P.flow('water', [[3.6, 8, 2.1], [8, 8, 2.6], [11, 8, 1.8], [13.2, 8, 1.1], [34, 8, 0.8], [34.8, 15.4, 0.6], [10, 15.4, 0.6], [10, 13.3, 1.4], [3.6, 13.3, 2.1]]);
}

/* ------------------------------------------------------------------ 11 live feed and algae production */
export function canliYem(P: Plate) {
  const W = 30, D = 14, t = 0.3;
  P.ground(-2, -2, W + 2, 33, 0.5);
  P.zone('stok', [[t, t], [5.93, t], [5.93, D - t], [t, D - t]], { tint: 'l', h: 2.3 });
  P.zone('pbr', [[6.07, t], [15.93, t], [15.93, D - t], [6.07, D - t]], { tint: 'l', h: 2.6 });
  P.zone('rotifer', [[16.07, t], [22.93, t], [22.93, D - t], [16.07, D - t]], { tint: 'l', h: 2.3 });
  P.zone('artemia', [[23.07, t], [W - t, t], [W - t, D - t], [23.07, D - t]], { tint: 'l', h: 1.9 });
  P.zone('havuz', [[1.6, 17.6], [28.4, 17.6], [28.4, 30.4], [1.6, 30.4]], { tint: 'l', h: 1.2 });
  P.building({
    x0: 0, y0: 0, x1: W, y1: D, t, cut: 1.1, eave: 4.6, ridge: 6.2, ridgeAxis: 'x',
    doors: [{ side: 'y1', at: 11, w: 1.2, arc: true }, { side: 'y1', at: 26, w: 1.6 }],
    parts: [
      { axis: 'y', at: 6, from: t, to: D - t, doors: [{ at: 11.6, w: 1, arc: true }] },
      { axis: 'y', at: 16, from: t, to: D - t, doors: [{ at: 11.6, w: 1.2 }] },
      { axis: 'y', at: 23, from: t, to: D - t, doors: [{ at: 11.6, w: 1.2 }] },
    ],
  });
  // stock cultures: flasks on a lit shelf, carboys on a bench, a laminar flow cabinet
  let shelf = '';
  for (const z of [0.5, 1.0, 1.5]) for (let i = 0; i < 6; i++) shelf += P.ellipse(1.3 + i * 0.7, 1.05, z + 0.28, 0.13, 'al');
  P.box(0.8, 0.6, 0, 5.4, 1.5, 1.8, 'pe', 'tlr', [0.5, 1, 1.5].map((z) => P.path([[0.8, 1.5, z], [5.4, 1.5, z], [5.4, 0.6, z]], 'e nf', false)).join(''));
  P.post(shelf);
  P.box(0.8, 5, 0, 2.2, 10, 0.9, 'st');
  for (const y of [5.6, 6.6, 7.6, 8.6, 9.4]) P.vessel(1.5, y, 0.3, 0.9, 0.5, 'ac', { head: 'dome', headH: 0.15 });
  P.box(3.6, 11.4, 0, 5.6, 12.6, 2, 'st');
  // photobioreactor columns in two rows against light panels
  for (const y of [3, 9.4]) {
    P.box(6.8, y - 0.9, 0, 15.2, y - 0.75, 2.5, 'pe');
    for (let i = 0; i < 9; i++) P.vessel(7.3 + i * 0.95, y - 0.2, 0.22, 0, 2.2, 'ac', { head: 'flat' });
  }
  // rotifer tanks and artemia hatching cones
  for (const x of [17.8, 20.8]) for (const y of [3.4, 8.2]) P.tank(x, y, 0.85, 0, 1, { cone: 0.6, legs: 0.4, liquid: 'ar' });
  for (const x of [24.4, 25.9, 27.4, 28.8]) for (const y of [2.6, 4.6]) P.tank(x, y, 0.32, 0, 0.6, { cone: 0.45, legs: 0.6, liquid: 'ar' });
  for (const x of [25.2, 28]) P.tank(x, 9.4, 0.62, 0, 0.9, { cone: 0.4, legs: 0.4, liquid: 'ar' });
  // outdoor raceway pond under a tunnel, paddle wheel on one channel
  P.stadium(2.2, 18.4, 27.8, 29.6, 0.5, 'al');
  P.layer(1);
  P.hcyl('y', 24.3, 29.1, 6.2, 0.6, 0.45, 'st', [0, 45, 90, 135].map((a) => { const q = (a * Math.PI) / 180; return P.line([[6.2 - Math.cos(q) * 0.45, 29.1, 0.6 - Math.sin(q) * 0.45], [6.2 + Math.cos(q) * 0.45, 29.1, 0.6 + Math.sin(q) * 0.45]], 'e'); }).join(''));
  P.box(5.7, 23.6, 0.5, 6.7, 24.3, 1.3, 'dk');
  P.layer(0);
  for (let x = 2; x <= 28; x += 4.33) P.phantom(P.archPts('x', x, 17, 31, 0, 3.6));
  P.phantom([[2, 24, 3.6], [28, 24, 3.6]]);

  P.flow('product', [[3.1, 1, 2.6], [11, 6, 2.9], [19.3, 5.8, 2.4]], 0.18);
  P.flow('product', [[11, 6, 2.9], [15, 24, 1.2]], 0.18);
}
