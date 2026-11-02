#!/usr/bin/env node
// Kvalitetskontroll av förhandsvisningen i docs/:
//  - trasiga interna länkar och bilder
//  - horisontell scroll (sidan bredare än skärmen) på mobil och desktop
//  - JavaScript-fel
// Kräver Playwright:  npm i -D playwright && npx playwright install chromium
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, process.env.CHECK_DIR || 'docs');
const only = process.argv[2];

const htmlFiles = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'assets' && f !== 'screenshots') walk(p); }
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
})(DOCS);

// 1. Länkar och resurser (statisk kontroll)
let broken = 0;
for (const file of htmlFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
    const target = path.resolve(path.dirname(file), u.split(/[?#]/)[0]);
    if (!fs.existsSync(target)) { broken++; console.log(`TRASIG  ${path.relative(DOCS, file)} -> ${u}`); }
  }
}
console.log(`Länkkontroll: ${htmlFiles.length} sidor, ${broken} trasiga länkar/resurser`);

// 2. Rendering
const browser = await chromium.launch();
let problems = 0;
const targets = htmlFiles.filter((f) => !only || path.relative(DOCS, f).startsWith(only + path.sep));
for (const width of [360, 390, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const file of targets) {
    errors.length = 0;
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    if (width === 1440) {
      await page.evaluate(() => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
        return Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
      });
    }
    const res = await page.evaluate(() => {
      const de = document.documentElement;
      const over = de.scrollWidth - de.clientWidth;
      const culprits = [];
      if (over > 0) {
        for (const el of document.querySelectorAll('main *, header *, footer *')) {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') culprits.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.') + ' ' + Math.round(r.right));
          if (culprits.length > 4) break;
        }
      }
      const badImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
      return { over, culprits, badImgs };
    });
    const rel = path.relative(DOCS, file);
    if (res.over > 0) { problems++; console.log(`SCROLL  ${width}px ${rel} +${res.over}px  ${res.culprits.join(' | ')}`); }
    if (res.badImgs.length) { problems++; console.log(`BILD    ${rel} ${res.badImgs.join(', ')}`); }
    if (errors.length) { problems++; console.log(`JS-FEL  ${rel} ${errors.join('; ')}`); }
  }
  await page.close();
}
await browser.close();
console.log(`Renderingskontroll: ${problems} problem`);
process.exit(broken + problems ? 1 : 0);
