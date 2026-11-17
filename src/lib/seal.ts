/**
 * Geometry of the engraved standard seals (home banderole, certification page).
 * ORIGINAL drawings — guilloche + engraved ring text — never the ISO logo or a certification
 * body's mark: ISO forbids use of its logo and certification marks belong to accredited bodies.
 * All coordinates live in a 200 × 200 viewBox centred on (100, 100).
 */
export const f2 = (n: number) => +n.toFixed(2);

/** Guilloche ring: phase-shifted sine bands between r0 and r1 — security-print feel, unique per seed. */
export function guilloche(seed: number, r0: number, r1: number, strands = 10, steps = 360) {
  const k = 14 + (seed % 5) * 3; // lobes (integer → the curve closes seamlessly)
  const m = 3 + (seed % 3); // slow swell, also integer
  const mid = (r0 + r1) / 2;
  const amp = (r1 - r0) / 2;
  const out: string[] = [];
  for (let s = 0; s < strands; s++) {
    const ph = (s / strands) * Math.PI * 2;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const r = mid + amp * Math.sin(k * a + ph) * (0.72 + 0.28 * Math.cos(m * a));
      d += `${i ? 'L' : 'M'}${f2(100 + r * Math.cos(a))} ${f2(100 + r * Math.sin(a))}`;
    }
    out.push(d + 'Z');
  }
  return out;
}

/** Scalloped, coin-like rim. */
export function rim(n = 96, rOut = 97, rIn = 94.6) {
  let d = '';
  for (let i = 0; i <= n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? rIn : rOut;
    d += `${i ? 'L' : 'M'}${f2(100 + r * Math.cos(a))} ${f2(100 + r * Math.sin(a))}`;
  }
  return d + 'Z';
}

/** Fine radial engraving (sunburst) for the medallion field. */
export function rays(n = 120, r0 = 38, r1 = 52) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    d += `M${f2(100 + r0 * Math.cos(a))} ${f2(100 + r0 * Math.sin(a))}L${f2(100 + r1 * Math.cos(a))} ${f2(100 + r1 * Math.sin(a))}`;
  }
  return d;
}

/** Ring path for the inscription; starts at the bottom so 50% sits at the top (Arabic is centred there). */
export const RING_PATH = 'M100 164.5a64.5 64.5 0 1 1 0-129a64.5 64.5 0 1 1 0 129';

/** "ISO 22000" → { pre: 'ISO', big: '22000' }; OIC/SMIIC 1 → the word "Halal" in the field. */
export function sealFace(code: string, lang: string) {
  const m = code.match(/^(ISO)\s+(\d+)$/);
  if (m) return { pre: m[1], big: m[2], word: false };
  return { pre: code, big: lang === 'ar' ? 'حلال' : lang === 'tr' ? 'Helal' : 'Halal', word: true };
}

/** The engraved inscription: the title in capitals, repeated round the ring. Arabic can't be letter-spaced
 *  (it breaks the joins), so it is filled by repetition and fitted by a page script instead. */
export function sealRing(title: string, lang: string) {
  const ring = lang === 'ar' ? title : title.toLocaleUpperCase(lang === 'tr' ? 'tr' : 'en');
  const reps = lang === 'ar' ? Math.max(2, Math.floor(110 / (ring.length + 5))) : ring.length < 26 ? 3 : 2;
  return Array(reps).fill(ring).join('  ✦  ') + '  ✦  ';
}
