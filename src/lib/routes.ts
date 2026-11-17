import type { Lang } from './i18n';
import { LANGS } from './i18n';

/**
 * Every page of the site, per language. `:slug` marks a dynamic segment.
 * The catch-all route (src/pages/[...path].astro) is generated from this table.
 */
export const ROUTES = {
  home: { tr: '/', en: '/en/', ar: '/ar/' },
  aquaculture: { tr: '/cozumler/su-urunleri', en: '/en/solutions/aquaculture', ar: '/ar/solutions/aquaculture' },
  lines: { tr: '/cozumler/yem-gida-hatlari', en: '/en/solutions/feed-food-lines', ar: '/ar/solutions/feed-food-lines' },
  agri: { tr: '/cozumler/tarim-hayvancilik', en: '/en/solutions/agriculture-livestock', ar: '/ar/solutions/agriculture-livestock' },
  line: { tr: '/hatlar/:slug', en: '/en/lines/:slug', ar: '/ar/lines/:slug' },
  machines: { tr: '/makineler', en: '/en/machines', ar: '/ar/machines' },
  machine: { tr: '/makineler/:slug', en: '/en/machines/:slug', ar: '/ar/machines/:slug' },
  funding: { tr: '/hizmetler/proje-ve-fon', en: '/en/services/projects-funding', ar: '/ar/services/projects-funding' },
  feasibility: { tr: '/hizmetler/fizibilite-muhendislik', en: '/en/services/feasibility-engineering', ar: '/ar/services/feasibility-engineering' },
  supply: { tr: '/hizmetler/tedarik-lojistik', en: '/en/services/supply-logistics', ar: '/ar/services/supply-logistics' },
  certification: { tr: '/hizmetler/belgelendirme', en: '/en/services/certification', ar: '/ar/services/certification' },
  projects: { tr: '/projeler', en: '/en/projects', ar: '/ar/projects' },
  algophyco: { tr: '/algophyco', en: '/en/algophyco', ar: '/ar/algophyco' },
  about: { tr: '/hakkimizda', en: '/en/about', ar: '/ar/about' },
  notes: { tr: '/notlar', en: '/en/notes', ar: '/ar/notes' },
  note: { tr: '/notlar/:slug', en: '/en/notes/:slug', ar: '/ar/notes/:slug' },
  catalog: { tr: '/katalog', en: '/en/catalog', ar: '/ar/catalog' },
  archive: { tr: '/arsiv', en: '/en/archive', ar: '/ar/archive' },
  contact: { tr: '/iletisim', en: '/en/contact', ar: '/ar/contact' },
  start: { tr: '/proje-baslat', en: '/en/start-a-project', ar: '/ar/start-a-project' },
  privacy: { tr: '/kvkk', en: '/en/privacy', ar: '/ar/privacy' },
  cookies: { tr: '/cerez-politikasi', en: '/en/cookies', ar: '/ar/cookies' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof ROUTES;

export function href(key: RouteKey, lang: Lang, slug?: string, hash?: string) {
  let p: string = ROUTES[key][lang];
  if (slug) p = p.replace(':slug', slug);
  return p + (hash ? `#${hash}` : '');
}

/** All language variants of the same page (for the language switcher and hreflang). */
export function alternates(key: RouteKey, slug?: string) {
  return Object.fromEntries(LANGS.map((l) => [l, href(key, l, slug)])) as Record<Lang, string>;
}
