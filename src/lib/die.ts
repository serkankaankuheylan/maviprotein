/**
 * The extruder die face of each line, as a technical drawing: the openings are the cross-section of the
 * product that line makes (catalogue product photos, die plates on p.10–16, "kalıplar" on p.20, the
 * rotary-head plates on p.24). Muesli bars are not extruded: their plate is the forming mould.
 * Everything is in a 600 × 600 box centred on (300, 300); the knife group turns about the centre.
 */
export type DieKind =
  | 'round' | 'micro' | 'kibble' | 'star' | 'slit' | 'flake-pellet' | 'rotary'
  | 'lattice' | 'mould' | 'coex' | 'puff' | 'rope' | 'grain' | 'fibre';

export interface DieDrawing {
  /** plate outlines, bolt holes, hub (stroked) */
  plate: string;
  /** the product openings (stroked, slightly brighter) */
  holes: string;
  /** a few openings drawn filled, so the face reads at a glance */
  solid: string;
  /** knife blades + hub, turned as one group */
  knife: string;
  /** centre lines, dimension ticks (dash-dot) */
  guides: string;
}

const C = 300;
const f = (n: number) => +n.toFixed(2);
const P = (r: number, a: number) => [f(C + r * Math.cos(a)), f(C + r * Math.sin(a))] as const;

const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

/** a closed polygon from points, rotated by `rot` about (cx, cy) */
const poly = (pts: [number, number][], cx: number, cy: number, rot = 0) => {
  const c = Math.cos(rot), s = Math.sin(rot);
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(cx + x * c - y * s)} ${f(cy + x * s + y * c)}`).join('') + 'Z';
};
/** rounded rectangle centred on (cx, cy), rotated */
const rrect = (cx: number, cy: number, w: number, h: number, r: number, rot = 0) => {
  const pts: [number, number][] = [];
  const corners: [number, number, number][] = [[w / 2 - r, -h / 2 + r, -Math.PI / 2], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI]];
  for (const [x, y, a0] of corners) for (let k = 0; k <= 4; k++) { const a = a0 + (k / 4) * (Math.PI / 2); pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  return poly(pts, cx, cy, rot);
};
const ellipse = (cx: number, cy: number, rx: number, ry: number, rot = 0) => {
  const pts: [number, number][] = [];
  for (let k = 0; k < 28; k++) { const a = (k / 28) * Math.PI * 2; pts.push([rx * Math.cos(a), ry * Math.sin(a)]); }
  return poly(pts, cx, cy, rot);
};
const star = (cx: number, cy: number, ro: number, ri: number, n: number, rot = 0) => {
  const pts: [number, number][] = [];
  for (let k = 0; k < n * 2; k++) { const r = k % 2 ? ri : ro; const a = (k / (n * 2)) * Math.PI * 2 - Math.PI / 2; pts.push([r * Math.cos(a), r * Math.sin(a)]); }
  return poly(pts, cx, cy, rot);
};
const bone = (cx: number, cy: number, s: number, rot = 0) => {
  // shaft + four knuckles, as one outline
  const pts: [number, number][] = [];
  const L = s * 1.1, T = s * 0.28, K = s * 0.34;
  const knuckle = (x: number, y: number, a0: number, a1: number) => { for (let k = 0; k <= 6; k++) { const a = a0 + (k / 6) * (a1 - a0); pts.push([x + K * Math.cos(a), y + K * Math.sin(a)]); } };
  knuckle(L, -K * 0.62, Math.PI * 0.9, Math.PI * 2.25);
  knuckle(L, K * 0.62, -Math.PI * 0.25, Math.PI * 1.1);
  pts.push([L - K * 0.4, T], [-L + K * 0.4, T]);
  knuckle(-L, K * 0.62, Math.PI * -0.1, Math.PI * 1.25);
  knuckle(-L, -K * 0.62, Math.PI * 0.75, Math.PI * 2.1);
  pts.push([-L + K * 0.4, -T], [L - K * 0.4, -T]);
  return poly(pts, cx, cy, rot);
};
const fish = (cx: number, cy: number, s: number, rot = 0) => {
  const pts: [number, number][] = [];
  for (let k = 0; k <= 16; k++) { const a = Math.PI * (0.18 + (k / 16) * 1.64); pts.push([s * 0.55 + s * 0.75 * Math.cos(a), s * 0.48 * Math.sin(a)]); }
  pts.push([-s * 0.55, 0], [-s * 0.95, s * 0.42], [-s * 0.95, -s * 0.42], [-s * 0.55, 0]);
  return poly(pts.reverse(), cx, cy, rot);
};
const tri = (cx: number, cy: number, s: number, rot = 0) => poly([[0, -s], [s * 0.87, s * 0.5], [-s * 0.87, s * 0.5]], cx, cy, rot);
const cross = (cx: number, cy: number, s: number, rot = 0) => {
  const a = s, b = s * 0.36;
  return poly([[-b, -a], [b, -a], [b, -b], [a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b], [-a, b], [-a, -b], [-b, -b]], cx, cy, rot);
};

/** openings placed on rings: [radius, count, phase] */
const rings = (spec: [number, number, number][], draw: (x: number, y: number, a: number, ring: number) => string) =>
  spec.flatMap(([r, n, ph], ring) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + ph;
    const [x, y] = r ? P(r, a) : [C, C];
    return draw(x, y, a, ring);
  })).join('');

export function dieDrawing(kind: DieKind): DieDrawing {
  const R = 262; // flange
  const plateR = 214; // die plate inside the flange
  const bolts = Array.from({ length: 12 }, (_, i) => { const [x, y] = P(240, (i / 12) * Math.PI * 2 + Math.PI / 12); return circle(x, y, 7.5) + `M${f(x - 12)} ${f(y)}h24M${f(x)} ${f(y - 12)}v24`; }).join('');
  let plate = circle(C, C, R) + circle(C, C, R - 6) + circle(C, C, plateR) + bolts + circle(C, C, 34) + circle(C, C, 22);
  let holes = '', solid = '';
  let blades = 4, bladeR = plateR - 10;

  switch (kind) {
    case 'round': // cylindrical pellets: three rings of round inserts
      holes = rings([[70, 8, 0], [124, 14, 0.1], [176, 20, 0.05]], (x, y) => circle(x, y, 9) + circle(x, y, 4.2));
      solid = rings([[70, 8, 0]], (x, y) => circle(x, y, 4.2));
      break;
    case 'micro': // micro granules: a dense field of fine holes
      holes = rings([[56, 10, 0], [86, 16, 0.1], [116, 22, 0], [146, 28, 0.06], [176, 34, 0]], (x, y) => circle(x, y, 3.4));
      solid = rings([[86, 16, 0.1]], (x, y) => circle(x, y, 3.4));
      break;
    case 'kibble': { // kibble shapes in rotation: bone, fish, star, ring, triangle, cross
      const shapes = [(x: number, y: number, a: number) => bone(x, y, 15, a), (x: number, y: number, a: number) => fish(x, y, 20, a + Math.PI / 2),
        (x: number, y: number, a: number) => star(x, y, 17, 8, 5, a), (x: number, y: number) => circle(x, y, 13) + circle(x, y, 5),
        (x: number, y: number, a: number) => tri(x, y, 15, a), (x: number, y: number, a: number) => cross(x, y, 14, a)];
      holes = rings([[92, 6, 0], [164, 12, Math.PI / 12]], (x, y, a, ring) => shapes[(Math.round((a / (Math.PI * 2)) * (ring ? 12 : 6)) + ring) % 6](x, y, a));
      solid = rings([[92, 6, 0]], (x, y, a) => shapes[Math.round((a / (Math.PI * 2)) * 6) % 6](x, y, a));
      blades = 3;
      break;
    }
    case 'star': // co-extruded twisted chews: star nozzles with a two-colour split
      holes = rings([[104, 4, Math.PI / 4]], (x, y, a) => star(x, y, 46, 24, 6, a) + `M${f(x - 46 * Math.cos(a + 0.6))} ${f(y - 46 * Math.sin(a + 0.6))}L${f(x + 46 * Math.cos(a + 0.6))} ${f(y + 46 * Math.sin(a + 0.6))}`)
        + rings([[178, 8, 0]], (x, y, a) => star(x, y, 17, 9, 6, a));
      solid = rings([[178, 8, 0]], (x, y, a) => star(x, y, 17, 9, 6, a));
      blades = 2;
      break;
    case 'slit': // chips: sheet die, parallel slots + the patterned mould rollers' grid
      holes = Array.from({ length: 5 }, (_, i) => rrect(C, C - 128 + i * 64, 330 - Math.abs(i - 2) * 46, 12, 6)).join('')
        + Array.from({ length: 9 }, (_, i) => `M${C - 150 + i * 37.5} ${C - 172}v18`).join('');
      solid = rrect(C, C, 330, 12, 6);
      blades = 0;
      break;
    case 'flake-pellet': // corn flakes: small round pellet holes, later flattened between the rolls
      holes = rings([[60, 10, 0], [100, 16, 0.08], [140, 22, 0], [180, 28, 0.04]], (x, y) => circle(x, y, 6));
      solid = rings([[140, 22, 0]], (x, y) => circle(x, y, 6));
      break;
    case 'rotary': // crispy curls: two brass plates, one turning, grooved radially
      holes = rings([[0, 1, 0]], () => '') + Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2; const [x0, y0] = P(48, a); const [x1, y1] = P(196, a + 0.42);
        return `M${x0} ${y0}Q${P(130, a + 0.05).join(' ')} ${x1} ${y1}`;
      }).join('') + circle(C, C, 196) + circle(C, C, 120);
      solid = '';
      blades = 0;
      break;
    case 'lattice': // 3D pellets: a wide sheet slot with a lattice-embossed band
      holes = rrect(C, C, 360, 70, 10) + Array.from({ length: 13 }, (_, i) => `M${C - 168 + i * 28} ${C - 35}l14 70`).join('') + Array.from({ length: 13 }, (_, i) => `M${C - 154 + i * 28} ${C - 35}l-14 70`).join('')
        + rrect(C, C - 120, 260, 26, 13) + rrect(C, C + 120, 260, 26, 13);
      solid = rrect(C, C - 120, 260, 26, 13);
      blades = 0;
      break;
    case 'mould': // muesli bars: the forming mould's cavities (bar, square, ball)
      plate = rrect(C, C, 470, 380, 14) + rrect(C, C, 446, 356, 10)
        + [[-205, -160], [205, -160], [-205, 160], [205, 160]].map(([dx, dy]) => circle(C + dx, C + dy, 7) ).join('');
      holes = [-1, 0, 1].map((k) => rrect(C, C - 105 + k * 0 + k * 0, 0, 0, 0)).join('')
        + Array.from({ length: 4 }, (_, i) => rrect(C - 150 + i * 100, C - 90, 78, 120, 8)).join('')
        + Array.from({ length: 4 }, (_, i) => rrect(C - 150 + i * 100, C + 70, 60, 60, 6)).join('')
        + Array.from({ length: 4 }, (_, i) => circle(C - 150 + i * 100, C + 140, 18)).join('');
      solid = rrect(C - 150, C - 90, 78, 120, 8) + rrect(C + 150, C - 90, 78, 120, 8);
      blades = 0;
      break;
    case 'coex': // filled pillows: annular tube nozzles with a centre filling nozzle
      holes = rings([[110, 4, Math.PI / 4]], (x, y) => circle(x, y, 44) + circle(x, y, 30) + circle(x, y, 13) + `M${x - 44} ${y}h14M${x + 30} ${y}h14`)
        + rings([[190, 12, 0]], (x, y) => circle(x, y, 9));
      solid = rings([[110, 4, Math.PI / 4]], (x, y) => circle(x, y, 13));
      blades = 2;
      break;
    case 'puff': // infant cereal puffs: open round holes, few and large
      holes = rings([[0, 1, 0], [90, 6, 0], [160, 12, Math.PI / 12]], (x, y, _a, ring) => ring === 0 ? '' : circle(x, y, 13));
      solid = rings([[90, 6, 0]], (x, y) => circle(x, y, 13));
      break;
    case 'rope': // starch: a few large rope holes
      holes = rings([[120, 6, 0]], (x, y) => circle(x, y, 26) + circle(x, y, 19));
      solid = rings([[120, 6, 0]], (x, y) => circle(x, y, 19));
      blades = 3;
      break;
    case 'grain': // reconstituted rice: rice-grain shaped openings, radial
      holes = rings([[70, 10, 0], [118, 16, 0.1], [166, 22, 0.05]], (x, y, a) => ellipse(x, y, 11, 4.4, a));
      solid = rings([[118, 16, 0.1]], (x, y, a) => ellipse(x, y, 11, 4.4, a));
      break;
    case 'fibre': // textured protein: radial slot channels
      holes = rings([[128, 18, 0]], (x, y, a) => rrect(x, y, 70, 10, 5, a)) + rings([[60, 8, 0.2]], (x, y, a) => rrect(x, y, 30, 8, 4, a));
      solid = rings([[60, 8, 0.2]], (x, y, a) => rrect(x, y, 30, 8, 4, a));
      break;
  }

  // knife: thin curved blades sweeping across the face from the hub
  let knife = '';
  for (let i = 0; i < blades; i++) {
    const a = (i / blades) * Math.PI * 2;
    const [x0, y0] = P(24, a), [x1, y1] = P(bladeR, a + 0.18), [xc, yc] = P(bladeR * 0.55, a - 0.06);
    const [x2, y2] = P(bladeR, a + 0.26), [xc2, yc2] = P(bladeR * 0.55, a + 0.1), [x3, y3] = P(24, a + 0.42);
    knife += `M${x0} ${y0}Q${xc} ${yc} ${x1} ${y1}L${x2} ${y2}Q${xc2} ${yc2} ${x3} ${y3}`;
  }
  if (blades) knife += circle(C, C, 16) + `M${C - 4} ${C - 16}h8v8h-8Z`;

  const guides = kind === 'mould'
    ? `M${C - 280} ${C}H${C + 280}M${C} ${C - 230}V${C + 230}`
    : `M${C - 292} ${C}H${C + 292}M${C} ${C - 292}V${C + 292}` + circle(C, C, 240);
  return { plate, holes, solid, knife, guides };
}

/** which die each line uses (by slug) */
export const LINE_DIE: Record<string, DieKind> = {
  'hayvancilik-yemi': 'round',
  'akvaryum-yemi': 'micro',
  'kultur-baligi-yemi': 'round',
  'evcil-hayvan-mamasi': 'kibble',
  'evcil-hayvan-odul-mamasi': 'star',
  'ekstrude-cips-kraker': 'slit',
  'misir-gevregi-kahvaltilik-tahil': 'flake-pellet',
  'citir-atistirmalik': 'rotary',
  'kizartilmis-halka-3d-pelet': 'lattice',
  'musli-tahil-bar': 'mould',
  'pofidik-rulokat': 'coex',
  'bebek-mamasi': 'puff',
  'jelatinize-modifiye-nisasta': 'rope',
  'yapay-pirinc': 'grain',
  'bitkisel-protein-dokusu': 'fibre',
};
