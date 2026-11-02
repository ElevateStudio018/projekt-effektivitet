import { html, esc } from '../lib/html.mjs';
import { site, nav, services } from '../content/site.mjs';

const FONT_FILES = {
  Inter: 'inter.woff2',
  'Inter Tight': 'inter-tight.woff2',
  Newsreader: 'newsreader.woff2',
  'Public Sans': 'public-sans.woff2',
  Manrope: 'manrope.woff2',
  'Source Serif 4': 'source-serif-4.woff2',
  Archivo: 'archivo.woff2',
  'EB Garamond': 'eb-garamond.woff2',
  Fraunces: 'fraunces.woff2',
  'IBM Plex Sans': 'ibm-plex-sans-400.woff2',
  'IBM Plex Mono': 'ibm-plex-mono-400.woff2',
};

function header(ctx) {
  const { theme, page } = ctx;
  const isHome = page.path === '';
  const logo = theme.header === 'overlay' && isHome ? 'logo-light.svg' : theme.logo;
  const current = (p) => (page.path === p || (p !== '' && page.path.startsWith(p)) ? ' aria-current="page"' : '');
  return html`
<header class="site-header" data-variant="${theme.header}">
  ${theme.header === 'masthead'
    ? html`<div class="masthead-top"><div class="wrap masthead-top-inner"><span>${site.city}</span><span>${site.tagline}</span><a href="${site.phoneHref}">${site.phone}</a></div></div>`
    : ''}
  <div class="wrap header-inner">
    <a class="brand" href="${ctx.link('')}" aria-label="${site.name} – startsida">
      <img class="brand-logo" src="${ctx.asset('logo/' + logo)}" alt="${site.name}" width="574" height="206">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-label">Meny</span><span class="nav-toggle-icon" aria-hidden="true"></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Huvudmeny">
      <ul>
        ${nav.map(
          (n) => html`<li${n.path === 'kontakt/' ? ' class="nav-cta"' : ''}><a href="${ctx.link(n.path)}"${current(n.path)}>${n.label}</a></li>`
        )}
      </ul>
    </nav>
    <div class="header-meta">
      <p>${site.legalName}<br>${site.city}</p>
      <p><a href="${site.phoneHref}">${site.phone}</a><br><a href="mailto:${site.email}">E-post</a></p>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { theme } = ctx;
  return html`
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <img class="footer-logo" src="${ctx.asset('logo/' + theme.footerLogo)}" alt="${site.name}" width="574" height="206" loading="lazy">
      <p>${site.description}</p>
    </div>
    <nav class="footer-col" aria-label="Tjänster">
      <h2>Tjänster</h2>
      <ul>
        ${services.map((s) => html`<li><a href="${ctx.link('tjanster/' + s.id + '/')}">${s.title}</a></li>`)}
        <li><a href="${ctx.link('loopingmodellen/')}">Loopingmodellen</a></li>
      </ul>
    </nav>
    <nav class="footer-col" aria-label="Företaget">
      <h2>Företaget</h2>
      <ul>
        <li><a href="${ctx.link('om-oss/')}">Om oss</a></li>
        <li><a href="${ctx.link('nyheter/')}">Nyheter</a></li>
        <li><a href="${ctx.link('kontakt/')}">Kontakt</a></li>
        <li><a href="${ctx.link('integritetspolicy/')}">Integritetspolicy</a></li>
      </ul>
    </nav>
    <div class="footer-col">
      <h2>Kontakt</h2>
      <address>
        ${site.legalName}<br>${site.city}<br>
        <a href="${site.phoneHref}">${site.phone}</a><br>
        <a href="mailto:${site.email}">${site.email}</a>
      </address>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© ${site.year} ${site.legalName}</span>
    <span>${site.tagline}</span>
  </div>
</footer>`;
}

function styleSwitcher(ctx) {
  if (!ctx.preview) return '';
  const { themes, theme } = ctx;
  const i = themes.findIndex((t) => t.id === theme.id);
  const prev = themes[(i + themes.length - 1) % themes.length];
  const next = themes[(i + 1) % themes.length];
  return html`
<div class="style-switcher" role="region" aria-label="Förhandsvisning av designstil">
  <a class="ss-step" href="${ctx.themeLink(prev.id)}" title="Föregående: ${prev.name}" aria-label="Föregående stil: ${prev.name}">‹</a>
  <label class="ss-label"><span>Stil ${i + 1}/${themes.length}</span>
    <select onchange="location.href=this.value">
      ${themes.map((t, n) => html`<option value="${ctx.themeLink(t.id)}"${t.id === theme.id ? ' selected' : ''}>${n + 1}. ${t.name}</option>`)}
    </select>
  </label>
  <a class="ss-step" href="${ctx.themeLink(next.id)}" title="Nästa: ${next.name}" aria-label="Nästa stil: ${next.name}">›</a>
  <a class="ss-all" href="${ctx.galleryLink}">Alla stilar</a>
</div>`;
}

export function layout(ctx, { title, description, body, bodyClass = '', jsonLd = null }) {
  const { theme, page } = ctx;
  const fullTitle = page.path === '' ? title : `${title} – ${site.name}`;
  const desc = description || site.metaDescription;
  const preload = [...new Set(theme.fonts)].map((f) => FONT_FILES[f]).filter(Boolean);
  const canonical = ctx.preview ? '' : site.url + '/' + page.path;
  return html`<!doctype html>
<html lang="sv" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${theme.palette[0]}">
${ctx.preview ? '<meta name="robots" content="noindex">' : html`<link rel="canonical" href="${canonical}">`}
<meta property="og:locale" content="sv_SE">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${site.url}/assets/img/${page.ogImage || 'road_002.jpg'}">
<link rel="icon" type="image/png" href="${ctx.asset('logo/favicon.png')}">
${preload.map((f) => html`<link rel="preload" href="${ctx.asset('fonts/' + f)}" as="font" type="font/woff2" crossorigin>`)}
<link rel="stylesheet" href="${ctx.asset('css/fonts.css')}">
<link rel="stylesheet" href="${ctx.asset('css/base.css')}">
<link rel="stylesheet" href="${ctx.asset('css/themes/' + theme.id + '.css')}">
<script>document.documentElement.classList.replace('no-js','js')</script>
${jsonLd ? html`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body class="theme-${theme.id} ${bodyClass}${ctx.preview ? ' is-preview' : ''}" data-header="${theme.header}" data-hero="${theme.hero}">
<a class="skip-link" href="#main">Hoppa till innehållet</a>
<div class="page-frame">
${header(ctx)}
<main id="main">
${body}
</main>
${footer(ctx)}
</div>
${styleSwitcher(ctx)}
<script src="${ctx.asset('js/site.js')}" defer></script>
</body>
</html>
`;
}
