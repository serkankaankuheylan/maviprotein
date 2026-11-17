export const LANGS = ['tr', 'en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<Lang, { label: string; short: string; htmlLang: string; dir: 'ltr' | 'rtl'; locale: string }> = {
  tr: { label: 'Türkçe', short: 'TR', htmlLang: 'tr', dir: 'ltr', locale: 'tr_TR' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', dir: 'ltr', locale: 'en_US' },
  ar: { label: 'العربية', short: 'عربي', htmlLang: 'ar', dir: 'rtl', locale: 'ar_AR' },
};

/** A localised text value as stored in src/data/*.json */
export type L10n = Partial<Record<Lang, string>> | string | undefined | null;

/** Resolve a localised value. Arabic falls back to English, English to Turkish. */
export function t(v: any, lang: Lang): any {
  if (v == null) return '';
  if (typeof v !== 'object' || Array.isArray(v)) return v;
  if (!('tr' in v) && !('en' in v) && !('ar' in v)) return v;
  return v[lang] ?? (lang === 'ar' ? v.en : undefined) ?? v.tr ?? v.en ?? '';
}

/** Pick the copy dictionary for a language with the same fallback chain. */
export function pick<T>(dict: Partial<Record<Lang, T>>, lang: Lang): T {
  return (dict[lang] ?? (lang === 'ar' ? dict.en : undefined) ?? dict.tr) as T;
}

const NUM_LOCALE: Record<Lang, string> = { tr: 'tr-TR', en: 'en-GB', ar: 'ar-EG' };

export function formatDate(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }) {
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  // Arabic: keep Latin digits for dates & data (matches model names and specs)
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG-u-nu-latn' : NUM_LOCALE[lang], opts).format(d);
}

export function num(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US').format(n);
}

/** Capacity unit per language */
export const UNIT = {
  kgh: { tr: 'kg/saat', en: 'kg/h', ar: 'كغ/ساعة' },
  th: { tr: 'ton/saat', en: 't/h', ar: 'طن/ساعة' },
} as const;
