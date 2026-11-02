#!/usr/bin/env node
// Skärmdumpar av startsidan i varje stil till docs/screenshots/ (används av
// galleriet). Med --full <katalog> tas även helsidesbilder av alla huvudsidor.
//   node tools/screenshots.mjs
//   node tools/screenshots.mjs --full /tmp/granskning [stil]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes } from '../src/themes.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const args = process.argv.slice(2);
const fullDir = args.includes('--full') ? args[args.indexOf('--full') + 1] : null;
const only = fullDir ? args[args.indexOf('--full') + 2] : args[0];
const HIDE = '.style-switcher{display:none!important}.is-preview{padding-bottom:0!important}';

const browser = await chromium.launch();
// Ladda även lazy-bilder innan helsidesbilden tas.
const loadAllImages = (page) =>
  page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    return Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
const shoot = async (file, out, { width, height, full = false }) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.addStyleTag({ content: HIDE });
  if (full) await loadAllImages(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: out, fullPage: full, type: 'jpeg', quality: full ? 72 : 80 });
  await page.close();
};

fs.mkdirSync(path.join(DOCS, 'screenshots'), { recursive: true });
for (const t of themes.filter((t) => !only || t.id === only)) {
  const home = path.join(DOCS, t.id, 'index.html');
  if (!fullDir) {
    await shoot(home, path.join(DOCS, 'screenshots', `${t.id}-desktop.jpg`), { width: 1440, height: 900 });
    await shoot(home, path.join(DOCS, 'screenshots', `${t.id}-mobile.jpg`), { width: 390, height: 820 });
  } else {
    fs.mkdirSync(fullDir, { recursive: true });
    const pages = ['', 'tjanster/', 'tjanster/projektanalys/', 'loopingmodellen/', 'om-oss/', 'nyheter/', 'nyheter/tecken-pa-att-projektet-tappat-fart/', 'kontakt/'];
    for (const p of pages) {
      const slug = (p.replace(/\/$/, '').replace(/\//g, '_') || 'home');
      await shoot(path.join(DOCS, t.id, p, 'index.html'), path.join(fullDir, `${t.id}-${slug}-desktop.jpg`), { width: 1440, height: 900, full: true });
      if (p === '' || p === 'tjanster/projektanalys/') await shoot(path.join(DOCS, t.id, p, 'index.html'), path.join(fullDir, `${t.id}-${slug}-mobile.jpg`), { width: 390, height: 820, full: true });
    }
  }
  console.log('Klar:', t.name);
}
await browser.close();
