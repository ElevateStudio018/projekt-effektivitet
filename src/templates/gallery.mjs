import { html, esc } from '../lib/html.mjs';
import { site } from '../content/site.mjs';

// Översiktssida för förhandsvisningen: alla tio stilar sida vid sida.
export function galleryPage({ themes, articles, hasShots }) {
  return html`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Designstilar – ${site.name}</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" href="assets/logo/favicon.png">
<link rel="stylesheet" href="assets/css/fonts.css">
<style>
  :root { --ink:#14202b; --muted:#5a6773; --rule:#d9dee3; --bg:#f4f5f6; --navy:#144069; --orange:#F37021; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.55 'Inter', system-ui, sans-serif; }
  a { color: var(--navy); }
  .wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); }
  header.top { background:#fff; border-bottom:1px solid var(--rule); }
  header.top .wrap { display:flex; align-items:center; justify-content:space-between; gap:24px; padding-top:20px; padding-bottom:20px; }
  header.top img { height:44px; width:auto; }
  header.top p { margin:0; color:var(--muted); font-size:14px; text-align:right; }
  .intro { padding: 56px 0 24px; max-width: 760px; }
  .intro h1 { font: 600 clamp(2rem,4vw,2.75rem)/1.1 'Inter Tight', 'Inter', sans-serif; letter-spacing:-0.02em; margin:0 0 16px; }
  .intro p { color: var(--muted); margin: 0 0 12px; }
  .notes { display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; margin: 8px 0 48px; }
  .note { background:#fff; border:1px solid var(--rule); padding:16px 18px; font-size:14px; }
  .note strong { display:block; margin-bottom:4px; }
  .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr)); gap: 28px; padding-bottom: 80px; }
  .card { background:#fff; border:1px solid var(--rule); display:flex; flex-direction:column; }
  .shot { display:block; aspect-ratio: 16/10; overflow:hidden; border-bottom:1px solid var(--rule); background:#e9ecef; position:relative; }
  .shot img { width:100%; height:100%; object-fit:cover; object-position: top; display:block; }
  .shot .mob { position:absolute; right:12px; bottom:12px; width:22%; height:auto; aspect-ratio: 9/19; object-fit:cover; object-position:top; border:3px solid #14202b; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,.25); }
  .body { padding: 20px 22px 22px; display:flex; flex-direction:column; gap:10px; flex:1; }
  .num { font-size:13px; color:var(--muted); font-variant-numeric: tabular-nums; }
  .card h2 { margin:0; font: 600 1.5rem/1.15 'Inter Tight','Inter',sans-serif; letter-spacing:-0.01em; }
  .card p { margin:0; color: var(--muted); font-size: 15px; }
  .meta { font-size:13px; color:var(--ink); }
  .swatches { display:flex; gap:6px; }
  .swatches span { width:28px; height:28px; border:1px solid rgba(0,0,0,.12); }
  .actions { margin-top:auto; padding-top:8px; display:flex; gap:16px; flex-wrap:wrap; font-size:14px; }
  .actions a { font-weight:600; }
  .actions a.primary { background: var(--navy); color:#fff; padding:9px 14px; text-decoration:none; }
  footer { border-top:1px solid var(--rule); background:#fff; padding:24px 0; font-size:14px; color:var(--muted); }
</style>
</head>
<body>
<header class="top">
  <div class="wrap">
    <img src="assets/logo/logo.svg" alt="${site.name}" width="574" height="206">
    <p>Förhandsvisning – ny webbplats<br>Tio designstilar, samma innehåll</p>
  </div>
</header>
<main class="wrap">
  <section class="intro">
    <h1>Tio designstilar för projekteffektivitet.se</h1>
    <p>Varje stil är en komplett webbplats med samma innehåll: startsida, tre tjänstesidor, Loopingmodellen, Om oss, nyheter med ${articles.length} artiklar, kontakt, integritetspolicy och 404-sida.</p>
    <p>Byt stil på vilken sida som helst med väljaren nere till vänster – du hamnar på samma sida i den andra stilen.</p>
  </section>
  <div class="notes">
    <div class="note"><strong>Innehåll</strong>Texter från nuvarande sajt är oförändrade. Nya texter (tjänstesidor, Om oss, artiklar, integritetspolicy) är utkast att granska.</div>
    <div class="note"><strong>Typsnitt</strong>Alla typsnitt är självhostade (SIL Open Font License) – inga anrop till Google eller andra tredje parter.</div>
    <div class="note"><strong>Teknik</strong>Statisk HTML och CSS utan ramverk. Ingen cookie-banner behövs: sajten har inga cookies eller spårning.</div>
  </div>
  <div class="grid">
    ${themes.map(
      (t, i) => html`<article class="card">
      <a class="shot" href="${t.id}/index.html" aria-label="Öppna stilen ${t.name}">
        ${hasShots ? html`<img src="screenshots/${t.id}-desktop.jpg" alt="" loading="lazy" width="1440" height="900"><img class="mob" src="screenshots/${t.id}-mobile.jpg" alt="" loading="lazy">` : ''}
      </a>
      <div class="body">
        <span class="num">Stil ${i + 1} av ${themes.length}</span>
        <h2>${t.name}</h2>
        <p>${esc(t.summary)}</p>
        <p class="meta">Typsnitt: ${t.fonts.join(' + ')}</p>
        <div class="swatches" aria-label="Färgpalett">${t.palette.map((c) => html`<span style="background:${c}" title="${c}"></span>`)}</div>
        <div class="actions">
          <a class="primary" href="${t.id}/index.html">Öppna ${t.name}</a>
          <a href="${t.id}/tjanster/projektanalys/index.html">Tjänstesida</a>
          <a href="${t.id}/nyheter/index.html">Nyheter</a>
        </div>
      </div>
    </article>`
    )}
  </div>
</main>
<footer><div class="wrap">© ${site.year} ${site.legalName} · Förhandsvisning, ej indexerad</div></footer>
</body>
</html>
`;
}
