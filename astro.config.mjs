import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Preview builds (scripts/deploy-preview.mjs) pass their own address in SITE_URL.
  site: process.env.SITE_URL || 'https://theblueprotein.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR', en: 'en-US', ar: 'ar' } },
    }),
  ],
  devToolbar: { enabled: false },
  scopedStyleStrategy: 'class',
});
