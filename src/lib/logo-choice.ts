/**
 * Which logo the header shows. Three candidates are being compared, all with the same lettering:
 *   'sade'    the flat vector emblem (design-assets/logo/sade)
 *   'parlak'  the glossy emblem (design-assets/final/brand-emblem-parlak-*)
 *   'yumusak' the soft-gradient emblem (design-assets/logo/yumusak, design-assets/final/brand-emblem-yumusak-*)
 * A build ships only this one. On the dev server all are in the page and a small switch flips between them
 * (components/LogoSwitch.astro); once one is chosen, the other branches and the switch can go.
 */
export type LogoKind = 'sade' | 'parlak' | 'yumusak';
export const LOGO_KINDS: LogoKind[] = ['sade', 'parlak', 'yumusak'];
export const LOGO_LABEL: Record<LogoKind, string> = { sade: 'Sade', parlak: 'Parlak', yumusak: 'Yumuşak' };
export const LOGO: LogoKind = 'yumusak';
