/**
 * Data access. Everything here comes from src/data (extracted from the client's
 * old site and 2016 catalogue — see KAYNAK-SITE.md). Nothing is invented here.
 */
const json = import.meta.glob('../data/*.json', { eager: true, import: 'default' }) as Record<string, any>;
const postFiles = import.meta.glob('../data/posts/*.json', { eager: true, import: 'default' }) as Record<string, any>;
const get = (name: string, fallback: any) => json[`../data/${name}.json`] ?? fallback;

export type Line = {
  slug: string; order: number; category: 'feed' | 'pet' | 'food';
  name: any; shortName: any; short: any; description: any[];
  components: { n: number; name: any; machineKey?: string; variant?: string }[];
  products: any[];
  specs: { models: string[]; rows: { key: string; label: any; values: any[] }[]; data?: any[] };
  capacityRange: { min: number; max: number; unit: string };
  installedPowerRange: { min: number; max: number; unit: string };
  lineLengthRange?: { min: number; max: number; unit: string };
  relatedMachines?: string[];
  catalogPage: number; notes?: string[];
};

/** Product "specimen" image per line, in catalogue order (AI pipeline, design-assets/final). */
const PRODUCT_ASSETS = [
  'p-livestock-feed', 'p-aquarium-feed', 'fish-feed-pellets', 'p-pet-food', 'p-pet-treats',
  'p-chips-crackers', 'p-corn-flakes', 'p-puffed-snacks', 'p-3d-pellets', 'p-muesli-bar',
  'p-pofidik', 'p-baby-food', 'p-modified-starch', 'p-artificial-rice', 'p-tvp',
];

/** The same product packed by the line's packaging machine (catalogue p.50–51), shown on card hover.
 *  null = no matching machine in the catalogue's packaging series (bars need flow-pack wrapping). */
const PACK_ASSETS: (string | null)[] = [
  'pk-livestock-feed', 'pk-aquarium-feed', 'pk-feed-pouch', 'pk-pet-food', 'pk-pet-treats',
  'pk-chips-crackers', 'pk-corn-flakes', 'pk-puffed-snacks', 'pk-3d-pellets', null,
  'pk-pofidik', 'pk-baby-food', 'pk-modified-starch', 'pk-artificial-rice', 'pk-tvp',
];

export const lines: (Line & { asset: string; pack: string | null })[] = (get('lines', []) as Line[])
  .sort((a, b) => a.order - b.order)
  .map((l, i) => ({ ...l, asset: PRODUCT_ASSETS[i], pack: PACK_ASSETS[i] }));

export const lineBySlug = (slug: string) => lines.find((l) => l.slug === slug);

export const machines = get('machines', { families: [] }) as { families: any[] };
// A model "code" that is really a Turkish word ("Buharlı" = steam) falls back to the localized name.
const isCode = (m?: string) => !!m && /^(SP|SF|DKX|OKX|LXY|SGT|PYJ|JXJ|CXJ|TJJ|QDJ|SPK|SPF)/.test(m);
machines.families.forEach((f: any) => (f.models ?? []).forEach((m: any) => { if (!isCode(m.model)) m.model = null; }));
export const allModels = machines.families.flatMap((f: any) => (f.models ?? []).map((m: any) => ({ ...m, family: f })));
export const modelBySlug = (slug: string) => allModels.find((m: any) => m.slug === slug);

const servicesRaw = get('services', []) as any[];
export const services: Record<string, any> = Array.isArray(servicesRaw) ? Object.fromEntries(servicesRaw.map((g) => [g.key, g])) : servicesRaw;
/** Items of a service group, bucketed by subgroup key. */
export function grouped(g: any) {
  if (!g?.subgroups) return [{ key: 'all', title: g?.title, items: g?.items ?? [] }];
  return g.subgroups.map((sg: any) => ({ ...sg, items: (g.items ?? []).filter((i: any) => i.group === sg.key) })).filter((sg: any) => sg.items.length);
}
export const company = get('company', {}) as Record<string, any>;
export const archive = get('archive', []) as any[];

export type Post = {
  id: number; slug: string; date: string; category: string; originalCategory?: any;
  title: any; excerpt: any; body: Record<string, any[]>; readingMinutes?: number;
  images?: any[]; steps?: any[]; millGenerations?: any[]; editorNote?: any; oldUrls?: string[];
};
export const postsSorted: Post[] = Object.values(postFiles).sort((a: Post, b: Post) => b.date.localeCompare(a.date));
export const postBySlug = (slug: string) => postsSorted.find((p) => p.slug === slug);

/** Notes whose index-card photo comes from /img/records (name, width, height of the 1280 copy).
 *  55, 63: the first photo on the note's page, in its cleaned, optimised copy.
 *  61, 62: the page has no image; the card shows the fair invitation that was the post's cover on the
 *  old site (see each post's coverNote), the same file the projects page shows as the fair's record. */
const NOTE_RECORD: Record<number, [name: string, w: number, h: number]> = {
  55: ['agra-me-2016-dubai-stant', 1280, 721],
  61: ['agra-me-2016-davetiye', 1280, 835],
  62: ['future-fish-2016-davetiye', 1280, 743],
  63: ['future-fish-2016-stant-228', 1280, 720],
};
export type NoteThumb =
  | { kind: 'asset'; name: string }
  | { kind: 'photo'; src: string; srcset?: string; w?: number; h?: number };
/** Image for a note's index card: the first image on its page (cover first, then in reading order). */
export function noteThumb(p: Post): NoteThumb | undefined {
  const rec = NOTE_RECORD[p.id];
  if (rec) {
    const [name, w, h] = rec;
    const at = (s: number) => `/img/records/${name}-${s}.webp`;
    return { kind: 'photo', src: at(640), srcset: `${at(640)} 640w, ${at(1280)} 1280w`, w, h };
  }
  const pos = (i: any) => (i.cover ? -1 : i.afterBlock?.tr ?? Infinity);
  const first = [...(p.images ?? [])].sort((a, b) => pos(a) - pos(b))[0];
  if (!first) return undefined;
  return first.asset ? { kind: 'asset', name: first.asset } : { kind: 'photo', src: first.file };
}

export function fmtRange(r: { min: number; max: number } | undefined, unitTr = 'kg/saat', lang: string = 'tr') {
  if (!r) return '';
  const unit = lang === 'tr' ? unitTr : unitTr === 'kg/saat' ? (lang === 'ar' ? 'كغ/ساعة' : 'kg/h') : unitTr;
  const f = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US').format(n);
  return r.min === r.max ? `${f(r.min)} ${unit}` : `${f(r.min)}–${f(r.max)} ${unit}`;
}

export const NOTE_CATS: Record<string, any> = {
  teknik: { tr: 'Teknik notlar', en: 'Technical notes', ar: 'ملاحظات فنية' },
  biyoloji: { tr: 'Biyoloji ve spirulina', en: 'Biology & spirulina', ar: 'الأحياء والسبيرولينا' },
  saha: { tr: 'Saha ve fuar', en: 'Field & fairs', ar: 'الميدان والمعارض' },
  firma: { tr: 'Firma', en: 'Company', ar: 'الشركة' },
};

/** Studio image per machine model (AI pipeline). Same-series models share a body. */
export const MODEL_ASSET: Record<string, string> = {
  'sp95-ii': 'm-sp95-ii', 'sp85-ii': 'sp85-ii-extruder', 'sp65-iii': 'm-sp65-iii', 'sp70-ii': 'm-sp70-ii',
  sp100: 'm-sp100', sp130: 'm-sp130', 'sp-tfx': 'm-sp-tfx', sp76: 'm-sp76',
  dkx3: 'm-dryer', dkx5: 'm-dryer', okx3: 'm-dryer-okx', okx5: 'm-dryer-okx', 'buharli-kurutma-firini': 'm-dryer-steam',
  'lxy-ii': 'm-fryer-lxy', 'sgt-ii': 'm-flavoring-drum',
  'pyj-iii': 'm-pyj-iii', 'jxj-ii': 'm-jxj-ii', cxj: 'm-cxj', 'tjj-ii': 'm-tjj-ii', 'qdj-ii': 'm-qdj-ii', 'tava-ekmegi-sekillendirme': 'm-pan-shaper',
  'standart-ogutme-degirmeni': 'm-hammer-mill', 'ince-ogutme-degirmeni': 'n-fine-mill', 'mikro-ogutme-degirmeni': 'n-micro-mill',
  'spk-398': 'm-packaging', 'spk-520': 'm-packaging', 'spk-720': 'm-packaging',
  'spf-398': 'm-spf-398', 'spk-500': 'm-spk-500', 'sp-350': 'm-sp-350', 'sp-50': 'm-sp-50',
};
/** Machine key used by MachineFigure for models without a studio image. */
export const FAMILY_KEY: Record<string, string> = {
  extruders: 'extruder', dryers: 'dryer', 'frying-flavoring': 'fryer', auxiliary: 'cutter', mills: 'mill', packaging: 'packaging-glyph',
};
export const FAMILY_HASH: Record<string, string> = {
  extruders: 'ekstruderler', dryers: 'kurutucular', 'frying-flavoring': 'kizartma-tatlandirma', auxiliary: 'yardimci', mills: 'degirmenler', packaging: 'paketleme',
};
