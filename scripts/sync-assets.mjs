// Copies the AI asset pipeline output (design-assets/final) into public/assets
// and writes a manifest the <Asset> component reads (src/generated/assets.json).
import { readdirSync, readFileSync, copyFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..');
const src = join(site, '..', 'design-assets', 'final');
const out = join(site, 'public', 'assets');
mkdirSync(out, { recursive: true });
mkdirSync(join(site, 'src', 'generated'), { recursive: true });

// The Git repository holds only this folder: there public/assets and the manifest are committed,
// and design-assets/ is absent. Keep them as they are instead of writing an empty manifest.
if (!existsSync(src)) {
  console.log('assets: design-assets/final not found, keeping committed public/assets');
  process.exit(0);
}

const manifest = {};
if (existsSync(src)) {
  for (const f of readdirSync(src)) {
    if (!f.endsWith('.json')) continue;
    const r = JSON.parse(readFileSync(join(src, f), 'utf8'));
    const variants = (r.variants || [])
      .filter((v) => existsSync(join(site, '..', v.file)))
      .map((v) => {
        const base = v.file.split('/').pop();
        copyFileSync(join(site, '..', v.file), join(out, base));
        return { src: `/assets/${base}`, w: v.width, h: v.height };
      })
      .sort((a, b) => a.w - b.w);
    if (variants.length) manifest[r.name] = variants;
  }
}
writeFileSync(join(site, 'src', 'generated', 'assets.json'), JSON.stringify(manifest, null, 1));
console.log(`assets: ${Object.keys(manifest).length} → public/assets`);
