#!/usr/bin/env node
// Bygger webbplatsen.
//
//   node src/build.mjs                       Förhandsvisning av alla tio stilar i docs/
//   node src/build.mjs --single              Förhandsvisning av endast vald stil i preview/
//   node src/build.mjs --site                Produktionsbygge av vald stil till dist/
//   node src/build.mjs --theme karna --out dist   Produktionsbygge av valfri stil
//
// Förhandsvisningen använder relativa länkar (fungerar från disk och på
// GitHub Pages), noindex och en stilväljare. Produktionsbygget använder
// absoluta länkar, canonical-URL:er, sitemap.xml och robots.txt.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes } from './themes.mjs';
import { services, site } from './content/site.mjs';
import { parseFrontMatter, markdown, plainText } from './lib/md.mjs';
import { readingTime } from './lib/html.mjs';
import * as P from './templates/pages.mjs';
import { galleryPage } from './templates/gallery.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..');

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : undefined;
};
// --site och --single bygger den valda stilen (chosen: true i themes.mjs) om --theme saknas.
const single = args.includes('--single');
const onlyTheme = arg('theme') || (args.includes('--site') || single ? themes.find((t) => t.chosen)?.id : undefined);
const preview = !onlyTheme;            // alla stilar, med stilväljare
const relative = preview || single;    // relativa länkar + noindex
const OUT = path.resolve(ROOT, arg('out') || (preview ? 'docs' : single ? 'preview' : 'dist'));

if (onlyTheme && !themes.some((t) => t.id === onlyTheme)) {
  console.error(`Okänd stil "${onlyTheme}". Välj bland: ${themes.map((t) => t.id).join(', ')}`);
  process.exit(1);
}

// ------------------------------------------------------------- Artiklar
const articles = fs
  .readdirSync(path.join(SRC, 'content/nyheter'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(SRC, 'content/nyheter', f), 'utf8'));
    return {
      ...data,
      slug: f.replace(/\.md$/, ''),
      headImage: data.headImage || (/^road_/.test(data.image || '') ? data.image : 'road_002.jpg'),
      minutes: readingTime(plainText(body)),
      html: (link) => markdown(body, (p) => link(p)),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

// ---------------------------------------------------------------- Sidor
const pages = [
  ['', P.homePage],
  ['tjanster/', P.servicesPage],
  ...services.map((s) => ['tjanster/' + s.id + '/', (ctx) => P.servicePage(ctx, s)]),
  ['loopingmodellen/', P.loopPage],
  ['om-oss/', P.aboutPage],
  ['nyheter/', P.newsIndexPage],
  ...articles.map((a) => ['nyheter/' + a.slug + '/', (ctx) => P.articlePage(ctx, a), { type: 'article', ogImage: a.image }]),
  ['kontakt/', P.contactPage],
  ['integritetspolicy/', P.privacyPage],
  ['404.html', P.notFoundPage],
];

function makeContext(theme, pagePath, meta = {}) {
  const depth = pagePath.endsWith('/') ? pagePath.split('/').length - 1 : 0;
  const up = '../'.repeat(depth);
  const file = pagePath === '404.html' ? '404.html' : pagePath + 'index.html';
  return {
    theme,
    themes,
    preview,
    switcher: preview,
    noindex: relative,
    articles,
    page: { path: pagePath === '404.html' ? '404' : pagePath, ...meta },
    link: (to, query = '') => (relative ? up + to + 'index.html' + query : '/' + to + query),
    asset: (f) => (preview ? up + '../assets/' + f : single ? up + 'assets/' + f : '/assets/' + f),
    themeLink: (id) => up + '../' + id + '/' + file,
    galleryLink: up + '../index.html',
  };
}

// ---------------------------------------------------------------- Filer
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const copyDir = (from, to) => fs.cpSync(from, to, { recursive: true });

// Töm utkatalogen men behåll galleriets skärmdumpar (skapas av tools/screenshots.mjs).
if (fs.existsSync(OUT)) {
  for (const f of fs.readdirSync(OUT)) if (f !== 'screenshots') fs.rmSync(path.join(OUT, f), { recursive: true, force: true });
}
const ASSETS = path.join(OUT, 'assets');
copyDir(path.join(SRC, 'assets/img'), path.join(ASSETS, 'img'));
copyDir(path.join(SRC, 'assets/logo'), path.join(ASSETS, 'logo'));
copyDir(path.join(SRC, 'assets/fonts'), path.join(ASSETS, 'fonts'));
copyDir(path.join(SRC, 'scripts'), path.join(ASSETS, 'js'));
for (const f of ['fonts.css', 'base.css']) write(path.join(ASSETS, 'css', f), fs.readFileSync(path.join(SRC, 'styles', f)));
const themeList = preview ? themes : themes.filter((t) => t.id === onlyTheme);
for (const t of themeList) {
  const css = path.join(SRC, 'styles/themes', t.id + '.css');
  write(path.join(ASSETS, 'css/themes', t.id + '.css'), fs.readFileSync(css));
}

let count = 0;
for (const theme of themeList) {
  const base = preview ? path.join(OUT, theme.id) : OUT;
  for (const [p, render, meta] of pages) {
    const ctx = makeContext(theme, p, meta);
    const file = p === '404.html' ? path.join(base, '404.html') : path.join(base, p, 'index.html');
    write(file, render(ctx));
    count++;
  }
}

if (preview) {
  const hasShots = fs.existsSync(path.join(OUT, 'screenshots', themes[0].id + '-desktop.jpg'));
  write(path.join(OUT, 'index.html'), galleryPage({ themes, articles, hasShots }));
  write(path.join(OUT, '.nojekyll'), '');
} else if (single) {
  write(path.join(OUT, '.nojekyll'), '');
} else {
  const urls = pages.filter(([p]) => p !== '404.html').map(([p]) => `  <url><loc>${site.url}/${p}</loc></url>`);
  write(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  write(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
}

console.log(`Byggde ${count} sidor (${themeList.length} stil${themeList.length > 1 ? 'ar' : ''}) till ${path.relative(ROOT, OUT)}/`);
