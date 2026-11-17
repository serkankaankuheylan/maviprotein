// Writes public/_redirects (Netlify / Cloudflare Pages syntax) from src/data/redirects.json.
// Query-string rules (blogicerik.aspx?MakaleID=N) use Netlify's query matching syntax.
import { readFileSync, writeFileSync } from 'node:fs';
const R = JSON.parse(readFileSync(new URL('../src/data/redirects.json', import.meta.url), 'utf8'));
const lines = ['# Generated from src/data/redirects.json — old maviprotein.com.tr URLs → new site (301)'];
const seen = new Set();
for (const r of R.redirects) {
  let from = r.from.replace(/^https?:\/\/[^/]+/, '');
  const [path, query] = from.split('?');
  const variants = new Set([path, path.toLowerCase()]);
  for (const p of variants) {
    const q = query ? '  ' + query.replace('&', '  ') : '';
    const key = p + q;
    if (seen.has(key) || p === r.to) continue;
    seen.add(key);
    lines.push(`${encodeURI(decodeURI(p))}${q}  ${r.to}  ${r.status ?? 301}`);
  }
}
writeFileSync(new URL('../public/_redirects', import.meta.url), lines.join('\n') + '\n');
console.log(`redirects: ${lines.length - 1}`);

// Vercel ignores _redirects; it reads the redirects from vercel.json next to package.json.
// Vercel reads that file before the build runs, so the generated file is committed:
// after changing src/data/redirects.json, run a build (or this script) and commit vercel.json.
const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  redirects: [],
};
const vseen = new Set();
for (const r of R.redirects) {
  const [path, query] = r.from.replace(/^https?:\/\/[^/]+/, '').split('?');
  const has = query
    ? query.split('&').map((kv) => {
        const [key, value = ''] = kv.split('=');
        return { type: 'query', key, value };
      })
    : undefined;
  for (const p of new Set([path, path.toLowerCase()])) {
    if (!query && p === r.to) continue;
    const source = encodeURI(decodeURI(p)).replace(/([:()*+?])/g, '\\$1');
    const key = source + JSON.stringify(has ?? []);
    if (vseen.has(key)) continue;
    vseen.add(key);
    vercel.redirects.push({ source, ...(has && { has }), destination: r.to, statusCode: r.status ?? 301 });
  }
}
writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify(vercel, null, 2) + '\n');
console.log(`vercel.json redirects: ${vercel.redirects.length}`);
