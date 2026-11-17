/**
 * Spill scene for the home "Ne üretebilirsiniz?" grid (rendered by components/SpecimenSplash.astro).
 * Each piece leaves from behind the card whose product it is, on a ballistic path scrubbed by scroll.
 *
 * Units, authored at a 1440px viewport (grid 1326px wide) and scaled with the viewport:
 *  ox, ax  % of the grid width (launch point / apex or end point)
 *  oy, ay  px; zone 'top': from the grid's top edge (negative = above) · 'side': from the top of row 2 ·
 *          'bottom': from the grid's bottom edge
 *  'top' and 'side' pieces reach (ax, ay) at t = ta, the apex, then fall back; 'bottom' pieces pour and
 *  are at (ax, ay) at the end. w: width px · d: depth plane · r0/spin: start angle / total turn (deg)
 *  a: launch delay (% of the zone's scroll range) · m: phone variant (grid 343px at 375px), else hidden
 */
export type Piece = {
  s: string;
  z: 'top' | 'side' | 'bottom';
  ox: number; oy: number; ax: number; ay: number; ta?: number;
  w: number; d: 'far' | 'mid' | 'near';
  r0?: number; spin?: number; a?: number;
  m?: { ox?: number; oy?: number; ax?: number; ay?: number; w?: number };
};

type In = Omit<Piece, 'z' | 'd'> & { d?: Piece['d'] };
const top = (p: In): Piece => ({ d: 'mid', ...p, z: 'top' });
const side = (p: In): Piece => ({ d: 'mid', ...p, z: 'side' });
const pour = (p: Omit<In, 'oy' | 'ay'> & { oy?: number; ay?: number }): Piece =>
  ({ d: 'mid', oy: -30, ay: 300, ...p, z: 'bottom' });

export const splashPieces: Piece[] = [
  // ── pet food (cards 4–5, x 60–100%): the main fountain into the empty corner beside the heading.
  //    Launches fan out from x≈70–90%; the highest go furthest back (far plane, smaller, softer).
  top({ s: 'sp-kibble-02', ox: 72, oy: 30, ax: 63, ay: -150, ta: 0.44, w: 48, r0: -40, spin: 300, m: { ox: 80, ax: 93, ay: -160, w: 34 } }),
  top({ s: 'sp-kibble-12', ox: 75, oy: 30, ax: 69, ay: -250, ta: 0.5, w: 44, r0: 30, spin: -260, a: 1 }),
  top({ s: 'sp-treats-05', ox: 80, oy: 36, ax: 79, ay: -118, ta: 0.42, w: 70, r0: -20, spin: 200, a: 2, m: { ox: 86, ax: 90, ay: -24, w: 50 } }),
  top({ s: 'sp-kibble-09', ox: 83, oy: 30, ax: 87, ay: -232, ta: 0.48, w: 48, r0: 60, spin: 380, m: { ox: 70, ax: 64, ay: -186, w: 34 } }),
  top({ s: 'sp-kibble-14', ox: 86, oy: 30, ax: 93, ay: -150, ta: 0.44, w: 40, r0: -70, spin: -320, a: 3 }),
  top({ s: 'sp-kibble-01', ox: 77, oy: 30, ax: 75, ay: -330, ta: 0.5, w: 42, r0: 10, spin: 240, a: 1, m: { ox: 84, ax: 90, ay: -196, w: 28 } }),
  top({ s: 'sp-treats-03', ox: 88, oy: 36, ax: 97, ay: -292, ta: 0.5, w: 72, r0: 40, spin: -180, a: 2 }),
  top({ s: 'sp-kibble-06', ox: 70, oy: 26, ax: 66.5, ay: -70, ta: 0.38, w: 26, spin: 420, a: 4 }),
  top({ s: 'sp-kibble-07', ox: 82, oy: 28, ax: 83.5, ay: -60, ta: 0.38, w: 40, r0: 20, spin: -300, a: 6 }),
  top({ s: 'sp-kibble-11', d: 'far', ox: 80, oy: 26, ax: 81.5, ay: -300, ta: 0.5, w: 28, r0: -30, spin: 200, a: 3 }),
  top({ s: 'sp-kibble-04', d: 'far', ox: 76, oy: 26, ax: 72, ay: -196, ta: 0.46, w: 30, spin: -220, a: 5 }),
  top({ s: 'sp-kibble-08', d: 'far', ox: 86, oy: 26, ax: 89.5, ay: -88, ta: 0.4, w: 26, spin: 260, a: 5 }),
  top({ s: 'sp-kibble-03', d: 'far', ox: 73, oy: 26, ax: 68, ay: -282, ta: 0.5, w: 28, spin: 300, a: 6 }),
  top({ s: 'sp-kibble-13', d: 'far', ox: 90, oy: 26, ax: 95, ay: -318, ta: 0.5, w: 24, spin: -240, a: 4 }),
  // flies at the camera: grows and stays defocused, leaves past the right edge
  top({ s: 'sp-treats-02', d: 'near', ox: 90, oy: -10, ax: 104, ay: -250, ta: 0.55, w: 170, r0: 30, spin: -120, a: 1 }),

  // ── feed (cards 1–3, x 0–60%): low hops along the edge, under the heading; a few light flakes fly
  //    high behind it (far plane)
  top({ s: 'sp-livestock-09', ox: 9, oy: 28, ax: 7, ay: -34, ta: 0.42, w: 40, r0: -20, spin: 160, a: 2, m: { ox: 10, ax: 6, ay: -22, w: 30 } }),
  top({ s: 'sp-fish-pellets-05', ox: 13, oy: 24, ax: 15, ay: -48, ta: 0.45, w: 26, spin: -280, a: 3 }),
  top({ s: 'sp-flakes-15', ox: 20, oy: 22, ax: 19.5, ay: -24, ta: 0.4, w: 18, a: 5 }),
  top({ s: 'sp-flakes-12', ox: 27, oy: 26, ax: 24, ay: -42, ta: 0.44, w: 52, r0: -10, spin: 120, a: 1, m: { ox: 30, ax: 34, ay: -28, w: 36 } }),
  top({ s: 'sp-fish-pellets-14', ox: 31, oy: 24, ax: 33, ay: -30, ta: 0.4, w: 28, spin: 300, a: 4 }),
  top({ s: 'sp-flakes-04', ox: 38, oy: 26, ax: 41, ay: -44, ta: 0.46, w: 44, spin: -140, a: 2, m: { ox: 58, ax: 55, ay: -26, w: 32 } }),
  top({ s: 'sp-livestock-03', ox: 50, oy: 28, ax: 48, ay: -36, ta: 0.42, w: 42, r0: 30, spin: -200, a: 3 }),
  top({ s: 'sp-fish-pellets-11', ox: 53, oy: 24, ax: 55, ay: -50, ta: 0.46, w: 24, spin: 340, a: 5 }),
  top({ s: 'sp-flakes-09', ox: 57, oy: 26, ax: 59, ay: -26, ta: 0.4, w: 46, spin: 100, a: 4 }),
  top({ s: 'sp-flakes-05', d: 'far', ox: 22, oy: 26, ax: 16, ay: -320, ta: 0.5, w: 36, spin: 260, a: 2 }),
  top({ s: 'sp-livestock-11', d: 'far', ox: 35, oy: 26, ax: 36, ay: -342, ta: 0.5, w: 28, spin: 180, a: 3 }),
  top({ s: 'sp-flakes-02', d: 'far', ox: 44, oy: 26, ax: 47, ay: -300, ta: 0.5, w: 32, spin: -300, a: 4 }),

  // ── food, sides: flung out of the outer cards of rows 2–3 (chips, pofidik on the left; soy chunks on
  //    the right), they peak just outside the grid and drop down the margin
  side({ s: 'sp-chips-06', ox: 1.5, oy: 120, ax: -3.5, ay: 70, ta: 0.3, w: 64, r0: 20, spin: -260, a: 12 }),
  side({ s: 'sp-chips-10', ox: 1.5, oy: 210, ax: -2.5, ay: 180, ta: 0.25, w: 56, spin: 300, a: 18 }),
  side({ s: 'sp-chips-02', d: 'near', ox: -1, oy: 250, ax: -7, ay: 190, ta: 0.3, w: 140, r0: -30, spin: 140, a: 14 }),
  side({ s: 'sp-pofidik-02', ox: 1.5, oy: 470, ax: -4, ay: 420, ta: 0.3, w: 62, r0: -40, spin: 220, a: 36 }),
  side({ s: 'sp-pofidik-04', ox: 1.5, oy: 540, ax: -3, ay: 510, ta: 0.25, w: 56, spin: -260, a: 42 }),
  side({ s: 'sp-tvp-06', ox: 98.5, oy: 470, ax: 103.5, ay: 420, ta: 0.3, w: 58, spin: -200, a: 36 }),
  side({ s: 'sp-tvp-05', ox: 98.5, oy: 560, ax: 102.5, ay: 530, ta: 0.25, w: 46, spin: 260, a: 42 }),

  // ── food, bottom: trickles pouring out of the bottom row under their own cards, falling away behind
  //    the next section (one stream under every card of the bottom row: pofidik, baby food, starch, rice, soy chunks)
  pour({ s: 'sp-pofidik-09', ox: 9, ax: 6, w: 64, r0: 20, spin: 260, m: { ox: 20, ax: 16, ay: 200, w: 44 } }),
  pour({ s: 'sp-pofidik-04', ox: 12, ax: 16, w: 58, spin: -300, a: 9 }),
  pour({ s: 'sp-pofidik-02', ox: 10, ax: 9, w: 54, r0: 60, spin: 200, a: 18 }),
  // powders under cards 12–13: soft lumps (and an oat flake) breaking off the heaps
  pour({ s: 'sp-babyfood-01', ox: 29, ax: 27, w: 34, r0: 10, spin: 160, a: 3 }),
  pour({ s: 'sp-babyfood-03', ox: 31, ax: 34, w: 30, r0: -30, spin: -420, a: 9 }),
  pour({ s: 'sp-babyfood-05', ox: 30, ax: 29, w: 28, r0: 40, spin: 200, a: 15 }),
  pour({ s: 'sp-babyfood-11', ox: 28, ax: 25, w: 24, spin: -180, a: 21 }),
  pour({ s: 'sp-babyfood-07', ox: 32, ax: 33, w: 22, r0: -60, spin: 220, a: 27 }),
  pour({ s: 'sp-starch-04', ox: 50, ax: 52, w: 34, r0: -10, spin: -160, a: 1 }),
  pour({ s: 'sp-starch-07', ox: 49, ax: 47, w: 28, r0: 30, spin: 200, a: 7 }),
  pour({ s: 'sp-starch-11', ox: 51, ax: 50, w: 30, spin: -220, a: 13 }),
  pour({ s: 'sp-starch-05', ox: 48, ax: 45, w: 24, r0: 50, spin: 180, a: 19 }),
  pour({ s: 'sp-starch-09', ox: 51, ax: 54, w: 20, spin: -240, a: 25 }),
  // rice grains under card 14: a thin, fast stream
  pour({ s: 'sp-rice-01', ox: 69, ax: 67, w: 20, r0: 10, spin: 520, a: 2, m: { ox: 74, ax: 70, ay: 200, w: 16 } }),
  pour({ s: 'sp-rice-05', ox: 71, ax: 73, w: 22, r0: -40, spin: -480, a: 7 }),
  pour({ s: 'sp-rice-03', ox: 70, ax: 69, w: 19, r0: 60, spin: 560, a: 12, m: { ox: 78, ax: 80, ay: 200, w: 15 } }),
  pour({ s: 'sp-rice-10', ox: 72, ax: 75, w: 21, spin: -540, a: 17 }),
  pour({ s: 'sp-rice-14', ox: 68, ax: 65, w: 20, r0: -20, spin: 500, a: 22 }),
  pour({ s: 'sp-rice-07', ox: 71, ax: 71, w: 18, r0: 30, spin: -600, a: 27 }),
  pour({ s: 'sp-tvp-12', ox: 88, ax: 86, w: 30, spin: -240, a: 4, m: { ox: 30, ax: 34, ay: 200, w: 24 } }),
  pour({ s: 'sp-tvp-05', ox: 91, ax: 94, w: 46, spin: 180, a: 12 }),
  pour({ s: 'sp-tvp-10', ox: 89, ax: 90, w: 28, spin: -200, a: 21 }),
];
