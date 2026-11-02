import { html, esc, formatDate, arrow } from '../lib/html.mjs';
import { site, services, home, principles, loop, about, contact, privacy } from '../content/site.mjs';
import { loopDiagram } from './diagram.mjs';
import { layout } from './layout.mjs';

// ------------------------------------------------------------- Partials

const img = (ctx, file, alt, attrs = '') =>
  `<img src="${ctx.asset('img/' + file)}" alt="${esc(alt)}" ${attrs}>`;

const textLink = (href, label) => html`<a class="text-link" href="${href}">${label}${arrow}</a>`;

const sectionHead = ({ label, title, lead, num }) => html`
<header class="section-head">
  ${label ? html`<p class="section-label"${num ? ` data-num="${num}"` : ''}>${label}</p>` : ''}
  <h2>${title}</h2>
  ${lead ? html`<p class="section-lead">${lead}</p>` : ''}
</header>`;

const breadcrumbs = (ctx, trail) => html`
<nav class="breadcrumbs" aria-label="Brödsmulor">
  <ol>
    <li><a href="${ctx.link('')}">Start</a></li>
    ${trail.map(([label, path], i) =>
      i === trail.length - 1
        ? html`<li><span aria-current="page">${label}</span></li>`
        : html`<li><a href="${ctx.link(path)}">${label}</a></li>`
    )}
  </ol>
</nav>`;

// Bakgrundsfoto till sidhuvudet. Döljs i base.css och visas av stilar som vill ha det (Landskap).
const headMedia = (ctx, file) =>
  file ? html`<figure class="page-head-media" aria-hidden="true">${img(ctx, file, '', 'width="1923" height="600" fetchpriority="high"')}</figure>` : '';

const pageHead = (ctx, { trail, title, lead, label, extra = '', image }) => html`
<section class="page-head${image ? ' has-media' : ''}">
  ${headMedia(ctx, image)}
  <div class="wrap page-head-inner">
    ${breadcrumbs(ctx, trail)}
    ${label ? html`<p class="page-label">${label}</p>` : ''}
    <h1>${title}</h1>
    ${lead ? html`<p class="page-lead">${lead}</p>` : ''}
    ${extra}
  </div>
</section>`;

const personCard = (ctx, { heading = false } = {}) => html`
<div class="person-card">
  ${img(ctx, site.person.image, 'Porträtt av ' + site.person.name, 'class="person-img" width="520" height="357" loading="lazy"')}
  <div class="person-body">
    ${heading ? html`<h2 class="person-name">${site.person.name}</h2>` : html`<p class="person-name">${site.person.name}</p>`}
    <p class="person-title">${site.person.title}</p>
    <dl class="person-contact">
      <div><dt>Telefon</dt><dd><a href="${site.phoneHref}">${site.phone}</a></dd></div>
      <div><dt>E-post</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
    </dl>
  </div>
</div>`;

// Stilar med footerFilm visar filmen (med samma text och knapp) ovanför sidfoten i stället.
const ctaBlock = (ctx) => ctx.theme.footerFilm && ctx.page.path === '' ? '' : html`
<section class="section cta-section" id="kontakt" aria-labelledby="cta-title">
  <div class="wrap cta-grid cta-grid--solo">
    <div class="cta-text">
      <h2 id="cta-title">${home.ctaTitle}</h2>
      <p>${home.ctaText}</p>
      <p class="cta-actions"><a class="button" href="${ctx.link('kontakt/')}">Kontakta oss</a></p>
    </div>
  </div>
</section>`;

export const newsCard = (ctx, a, { headingLevel = 3, withImage = true } = {}) => html`
<article class="news-card">
  <a class="news-card-link" href="${ctx.link('nyheter/' + a.slug + '/')}">
    ${withImage && (a.cardImage || a.image) ? html`<figure class="news-card-img">${img(ctx, a.cardImage || a.image, '', 'loading="lazy" width="800" height="533"')}</figure>` : ''}
    <div class="news-card-body">
      <p class="news-meta"><span class="news-cat">${a.category}</span> <time datetime="${a.date}">${formatDate(a.date)}</time></p>
      <h${headingLevel} class="news-title">${a.title}</h${headingLevel}>
      <p class="news-lead">${a.lead}</p>
    </div>
  </a>
</article>`;

const heroActions = (ctx) => html`
<p class="hero-actions">
  <a class="button" href="${ctx.link('kontakt/')}">Boka ett första samtal</a>
  <a class="button button--ghost" href="${ctx.link('tjanster/')}">Våra tjänster</a>
</p>`;

// ------------------------------------------------------------ Hero-varianter

const heroes = {
  photo: (ctx) => html`
<section class="hero hero--photo">
  ${img(ctx, ctx.theme.heroImage, '', 'class="hero-media" width="1923" height="600" fetchpriority="high"')}
  <div class="wrap hero-inner">
    <p class="hero-kicker">${site.name}</p>
    <h1 class="hero-title">${home.heroTitle}</h1>
    <p class="hero-lead">${home.heroLead}</p>
    ${heroActions(ctx)}
  </div>
</section>`,

  type: (ctx) => html`
<section class="hero hero--type">
  <div class="wrap hero-grid">
    <p class="hero-kicker">${site.name} · ${site.city}</p>
    <h1 class="hero-title">${home.heroTitle}</h1>
    <div class="hero-aside">
      <p class="hero-lead">${home.heroLead}</p>
      ${heroActions(ctx)}
    </div>
  </div>
  <figure class="hero-strip">${img(ctx, ctx.theme.heroImage, '', 'width="1923" height="600"')}</figure>
</section>`,

  split: (ctx) => html`
<section class="hero hero--split">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <p class="hero-kicker">${site.name}</p>
      <h1 class="hero-title">${home.heroTitle}</h1>
      <p class="hero-lead">${home.heroLead}</p>
      ${heroActions(ctx)}
    </div>
    <figure class="hero-figure">${img(ctx, ctx.theme.heroImage, '', 'width="1923" height="600" fetchpriority="high"')}</figure>
  </div>
</section>`,

  editorial: (ctx) => html`
<section class="hero hero--editorial">
  <div class="wrap ed-grid">
    <div class="ed-lead">
      <p class="hero-kicker">Projektledning och verksamhetseffekt</p>
      <h1 class="hero-title">${home.heroTitle}</h1>
      <p class="hero-lead">${home.heroLead}</p>
      <figure class="ed-figure">
        ${img(ctx, ctx.theme.heroImage, 'En slingrande väg genom skogslandskap', 'width="1923" height="600" fetchpriority="high"')}
        <figcaption>${site.tagline}</figcaption>
      </figure>
      ${heroActions(ctx)}
    </div>
    <aside class="ed-aside" aria-labelledby="ed-latest">
      <h2 id="ed-latest">Senast publicerat</h2>
      <ol class="ed-list">
        ${ctx.articles.slice(0, 4).map(
          (a) => html`<li><p class="news-meta"><span class="news-cat">${a.category}</span> <time datetime="${a.date}">${formatDate(a.date)}</time></p>
          <a href="${ctx.link('nyheter/' + a.slug + '/')}">${a.title}</a></li>`
        )}
      </ol>
      ${textLink(ctx.link('nyheter/'), 'Alla nyheter')}
    </aside>
  </div>
</section>`,

  diagram: (ctx) => html`
<section class="hero hero--diagram">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <p class="hero-kicker">${site.name} · ${site.city}</p>
      <h1 class="hero-title">${home.heroTitle}</h1>
      <p class="hero-lead">${home.heroLead}</p>
      ${heroActions(ctx)}
    </div>
    <figure class="hero-diagram">
      ${loopDiagram({ steps: loop.steps })}
      <figcaption>Fig. 1 – Loopingmodellen: besluta, genomföra, kontrollera, slutföra.</figcaption>
    </figure>
  </div>
</section>`,

  cover: (ctx) => html`
<section class="hero hero--cover">
  <div class="cover-inner">
    <p class="hero-kicker">${site.legalName} · ${site.city} · ${site.year}</p>
    <h1 class="hero-title">${home.heroTitle}</h1>
    <p class="hero-lead">${home.heroLead}</p>
    ${heroActions(ctx)}
    <nav class="cover-index" aria-label="Innehåll på sidan">
      <h2>Innehåll</h2>
      <ol>
        <li><a href="#utgangslagen">Utgångslägen</a></li>
        <li><a href="#tjanster">Tjänster</a></li>
        <li><a href="#loopingmodellen">Loopingmodellen</a></li>
        <li><a href="#nyheter">Nyheter</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
      </ol>
    </nav>
  </div>
  <figure class="cover-figure">${img(ctx, ctx.theme.heroImage, '', 'width="1923" height="600" fetchpriority="high"')}</figure>
</section>`,

  banner: (ctx) => html`
<section class="hero hero--banner">
  <div class="wrap hero-center">
    <p class="hero-kicker">${site.legalName} · ${site.city}</p>
    <h1 class="hero-title">${home.heroTitle}</h1>
    <p class="hero-lead">${home.heroLead}</p>
    ${heroActions(ctx)}
  </div>
  <figure class="hero-banner">${img(ctx, ctx.theme.heroImage, '', 'width="1923" height="600" fetchpriority="high"')}</figure>
</section>`,
};

// --------------------------------------------------------------- Startsidan

export function homePage(ctx) {
  const body = html`
${heroes[ctx.theme.hero](ctx)}

<section class="section situations-section" id="utgangslagen">
  <div class="wrap">
    ${sectionHead({ label: 'Tre utgångslägen', title: home.situationsTitle, lead: home.situationsLead, num: 1 })}
    <ol class="situations">
      ${home.situations.map(
        (s, i) => html`<li class="situation">
        <p class="situation-kicker"><span class="situation-num">${String(i + 1).padStart(2, '0')}</span> ${s.kicker}</p>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        ${textLink(ctx.link(s.path), s.link)}
      </li>`
      )}
    </ol>
  </div>
</section>

<section class="section services-section" id="tjanster">
  <div class="wrap">
    ${sectionHead({ label: 'Tjänster', title: home.servicesTitle, lead: home.servicesLead, num: 2 })}
    <ul class="service-list">
      ${services.map(
        (s) => html`<li class="service-item">
        <a class="service-link" href="${ctx.link('tjanster/' + s.id + '/')}">
          <figure class="service-img">${img(ctx, s.image, '', 'loading="lazy" width="800" height="533"')}</figure>
          <span class="service-num">${s.number}</span>
          <span class="service-title">${s.title}</span>
          <span class="service-summary">${s.summary}</span>
          <span class="service-more">Läs mer${arrow}</span>
        </a>
      </li>`
      )}
    </ul>
  </div>
</section>

<section class="section loop-section" id="loopingmodellen">
  <div class="wrap">
    ${sectionHead({ label: 'Loopingmodellen', title: home.loopTitle, lead: home.loopLead, num: 4 })}
    <div class="loop-grid">
      <figure class="loop-figure">${loopDiagram({ steps: loop.steps, compact: true })}</figure>
      <ol class="loop-steps">
        ${loop.steps.map(
          (s) => html`<li class="loop-step">
          <p class="step-head"><span class="step-num">${s.n}</span> <span class="step-short">${s.short}</span></p>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </li>`
        )}
      </ol>
    </div>
    <p class="section-more">${textLink(ctx.link('loopingmodellen/'), 'Fördjupa dig i modellen')}</p>
  </div>
</section>

<section class="section news-section" id="nyheter">
  <div class="wrap">
    <div class="news-head">
      ${sectionHead({ label: 'Nyheter', title: 'Nyheter och insikter', num: 6 })}
      ${textLink(ctx.link('nyheter/'), 'Alla nyheter')}
    </div>
    <div class="news-grid">
      ${ctx.articles.slice(0, 3).map((a) => newsCard(ctx, a))}
    </div>
  </div>
</section>

${ctaBlock(ctx)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.legalName,
    url: site.url,
    description: site.metaDescription,
    telephone: site.phone,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'SE' },
    logo: site.url + '/assets/logo/logo.svg',
  };
  return layout(ctx, { title: home.title, body, bodyClass: 'page-home', jsonLd });
}

// ---------------------------------------------------------------- Tjänster

export function servicesPage(ctx) {
  const body = html`
${pageHead(ctx, {
  trail: [['Tjänster', 'tjanster/']],
  label: 'Tjänster',
  image: 'road_001.jpg',
  title: 'Rätt insats när projektet behöver den',
  lead: 'Projektspecialist, projektanalys och projekteffekt – tre sätt att skapa nya perspektiv, handlingskraft och framdrift.',
})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      label: 'Tre tjänsteområden',
      title: 'Från första hjälpen till förebyggande stöd',
      lead: 'Insatsen formas efter projektets situation. Vi kan bidra när läget redan är kritiskt eller arbeta förebyggande innan problemen hunnit växa.',
    })}
    <div class="service-rows">
      ${services.map(
        (s) => html`<article class="service-row" id="${s.id}">
        <figure class="service-row-img">${img(ctx, s.image, s.imageAlt, 'loading="lazy" width="800" height="533"')}</figure>
        <div class="service-row-body">
          <p class="service-num">${s.number} / 0${services.length}</p>
          <h2>${s.title}</h2>
          <p class="lead">${s.summary}</p>
          <h3 class="minor-heading">Passar när</h3>
          <ul class="checklist">${s.when.map((w) => html`<li>${w}</li>`)}</ul>
          ${textLink(ctx.link('tjanster/' + s.id + '/'), 'Läs mer om ' + s.title.toLowerCase())}
        </div>
      </article>`
      )}
    </div>
  </div>
</section>

${ctaBlock(ctx)}`;
  return layout(ctx, {
    title: 'Tjänster',
    description: 'Projektspecialist, projektanalys och projekteffekt – tre sätt att skapa nya perspektiv, handlingskraft och framdrift i projekt.',
    body,
    bodyClass: 'page-services',
  });
}

export function servicePage(ctx, s) {
  const others = services.filter((o) => o.id !== s.id);
  const body = html`
${pageHead(ctx, {
  trail: [['Tjänster', 'tjanster/'], [s.title, 'tjanster/' + s.id + '/']],
  image: s.headImage,
  label: 'Tjänst ' + s.number,
  title: s.title,
  lead: s.summary,
})}

<section class="section article-section">
  <div class="wrap article-grid">
    <div class="prose">
      <figure class="prose-figure">${img(ctx, s.image, s.imageAlt, 'width="800" height="533"')}</figure>
      ${s.body.map((p) => html`<p>${p}</p>`)}
    </div>
    <aside class="article-aside">
      <div class="aside-box">
        <h2 class="minor-heading">Passar när</h2>
        <ul class="checklist">${s.when.map((w) => html`<li>${w}</li>`)}</ul>
      </div>
      <div class="aside-box aside-contact">
        <h2 class="minor-heading">Prata med oss</h2>
        <p>Ring eller skriv till oss för ett första samtal om ert projekt.</p>
        <p><a href="${site.phoneHref}">${site.phone}</a></p>
        <p><a class="button" href="${ctx.link('kontakt/', '?amne=' + s.id)}">Kontakta oss</a></p>
      </div>
    </aside>
  </div>
</section>

<section class="section related-section">
  <div class="wrap">
    ${sectionHead({ label: 'Tjänster', title: 'Andra tjänster' })}
    <ul class="service-list service-list--two">
      ${others.map(
        (o) => html`<li class="service-item">
        <a class="service-link" href="${ctx.link('tjanster/' + o.id + '/')}">
          <figure class="service-img">${img(ctx, o.image, '', 'loading="lazy" width="800" height="533"')}</figure>
          <span class="service-num">${o.number}</span>
          <span class="service-title">${o.title}</span>
          <span class="service-summary">${o.summary}</span>
          <span class="service-more">Läs mer${arrow}</span>
        </a>
      </li>`
      )}
    </ul>
  </div>
</section>

${ctaBlock(ctx)}`;
  return layout(ctx, { title: s.title, description: s.summary, body, bodyClass: 'page-service' });
}

// ---------------------------------------------------------- Loopingmodellen

export function loopPage(ctx) {
  const article = ctx.articles.find((a) => a.slug === 'loopingmodellen-i-praktiken');
  const body = html`
${pageHead(ctx, { trail: [[loop.title, 'loopingmodellen/']], label: loop.title, title: loop.heading, lead: loop.lead, image: 'road_002.jpg' })}

<section class="section loop-section loop-section--page">
  <div class="wrap">
    <figure class="loop-figure loop-figure--large">${loopDiagram({ steps: loop.steps })}</figure>
    <ol class="loop-steps loop-steps--row">
      ${loop.steps.map(
        (s) => html`<li class="loop-step">
        <p class="step-head"><span class="step-num">${s.n}</span> <span class="step-short">${s.short}</span></p>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </li>`
      )}
    </ol>
  </div>
</section>

<section class="section article-section">
  <div class="wrap article-grid">
    <div class="prose">
      <h2>${loop.principleTitle}</h2>
      ${loop.principle.map((p) => html`<p>${p}</p>`)}
      <h2>${loop.whyTitle}</h2>
      ${loop.why.map((p) => html`<p>${p}</p>`)}
    </div>
    <aside class="article-aside">
      ${article ? html`<div class="aside-box"><h2 class="minor-heading">Läs vidare</h2>${newsCard(ctx, article, { withImage: false })}</div>` : ''}
    </aside>
  </div>
</section>

${ctaBlock(ctx)}`;
  return layout(ctx, { title: loop.title, description: loop.lead, body, bodyClass: 'page-loop' });
}

// ------------------------------------------------------------------ Om oss

export function aboutPage(ctx) {
  const body = html`
${pageHead(ctx, { trail: [[about.title, 'om-oss/']], label: about.title, title: about.heading, lead: about.lead, image: 'road_003.jpg' })}

<section class="section article-section">
  <div class="wrap article-grid">
    <div class="prose">
      ${about.body.map((p) => html`<p>${p}</p>`)}
    </div>
    <aside class="article-aside">
      <div class="aside-box">
        <h2 class="minor-heading">Fakta</h2>
        <dl class="facts">
          <div><dt>Företag</dt><dd>${site.legalName}</dd></div>
          <div><dt>Ort</dt><dd>${site.city}</dd></div>
          <div><dt>Tjänster</dt><dd>${services.map((s) => s.title).join(', ')}</dd></div>
          <div><dt>Metod</dt><dd>Loopingmodellen</dd></div>
        </dl>
      </div>
    </aside>
  </div>
</section>

<section class="section principles-section">
  <div class="wrap">
    ${sectionHead({ label: 'Principer', title: home.principlesTitle })}
    <ul class="principles">
      ${principles.map((p) => html`<li class="principle"><h3>${p.title}</h3><p>${p.text}</p></li>`)}
    </ul>
  </div>
</section>

<section class="section person-section">
  <div class="wrap person-grid">
    ${personCard(ctx, { heading: true })}
    <div class="prose">
      ${about.personBody.map((p) => html`<p>${p}</p>`)}
      <p>${textLink(ctx.link('kontakt/'), 'Kontakta Per')}</p>
    </div>
  </div>
</section>`;
  return layout(ctx, { title: about.title, description: about.lead, body, bodyClass: 'page-about' });
}

// ----------------------------------------------------------------- Nyheter

export function newsIndexPage(ctx) {
  const [first, ...rest] = ctx.articles;
  const body = html`
${pageHead(ctx, {
  trail: [['Nyheter', 'nyheter/']],
  label: 'Nyheter',
  image: 'road_003.jpg',
  title: 'Nyheter och insikter',
  lead: 'Erfarenheter och perspektiv på projekt som ger effekt – och på det som får dem att stanna av.',
})}

<section class="section news-index">
  <div class="wrap">
    <div class="news-featured">${newsCard(ctx, first, { headingLevel: 2 })}</div>
    <div class="news-grid news-grid--index">
      ${rest.map((a) => newsCard(ctx, a, { headingLevel: 2 }))}
    </div>
  </div>
</section>`;
  return layout(ctx, { title: 'Nyheter', description: 'Nyheter och insikter från Projekteffektivitet.', body, bodyClass: 'page-news' });
}

export function articlePage(ctx, a) {
  const more = ctx.articles.filter((o) => o.slug !== a.slug).slice(0, 3);
  const body = html`
<article class="article">
  <section class="page-head article-head has-media">
    ${headMedia(ctx, a.headImage)}
    <div class="wrap page-head-inner">
      ${breadcrumbs(ctx, [['Nyheter', 'nyheter/'], [a.title, 'nyheter/' + a.slug + '/']])}
      <p class="news-meta"><span class="news-cat">${a.category}</span> <time datetime="${a.date}">${formatDate(a.date)}</time> <span class="read-time">${a.minutes} min läsning</span></p>
      <h1>${a.title}</h1>
      <p class="page-lead">${a.lead}</p>
      <p class="byline">Av ${site.person.name}</p>
    </div>
  </section>
  <div class="section article-section">
    <div class="wrap article-grid">
      <div class="prose">
        ${a.image ? html`<figure class="prose-figure${a.image === a.headImage ? ' is-head-image' : ''}">${img(ctx, a.image, a.imageAlt || '', 'width="1200" height="600"')}</figure>` : ''}
        ${a.html(ctx.link)}
      </div>
      <aside class="article-aside">
        <div class="aside-box">
          <h2 class="minor-heading">Skribent</h2>
          <p><strong>${site.person.name}</strong><br>${site.person.title}</p>
        </div>
      </aside>
    </div>
  </div>
</article>

<section class="section news-section">
  <div class="wrap">
    <div class="news-head">
      ${sectionHead({ label: 'Nyheter', title: 'Fler artiklar' })}
      ${textLink(ctx.link('nyheter/'), 'Alla nyheter')}
    </div>
    <div class="news-grid">${more.map((m) => newsCard(ctx, m))}</div>
  </div>
</section>`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.lead,
    datePublished: a.date,
    author: { '@type': 'Person', name: site.person.name },
    publisher: { '@type': 'Organization', name: site.legalName },
  };
  return layout(ctx, { title: a.title, description: a.lead, body, bodyClass: 'page-article', jsonLd });
}

// ----------------------------------------------------------------- Kontakt

export function contactPage(ctx) {
  const body = html`
${pageHead(ctx, { trail: [['Kontakt', 'kontakt/']], label: 'Kontakta oss', title: contact.heading, lead: contact.lead, image: 'road_003.jpg' })}

<section class="section contact-section">
  <div class="wrap contact-grid">
    <div class="contact-direct">
      <h2>${contact.directTitle}</h2>
      ${contact.directText.map((p) => html`<p>${p}</p>`)}
      ${personCard(ctx)}
      <dl class="facts">
        <div><dt>Företag</dt><dd>${site.legalName}</dd></div>
        <div><dt>Ort</dt><dd>${site.city}</dd></div>
        <div><dt>Webb</dt><dd>${site.web}</dd></div>
      </dl>
    </div>
    <form class="contact-form" action="https://formsubmit.co/${site.email}" method="POST" data-ajax="https://formsubmit.co/ajax/${site.email}" data-mailto="${site.email}" novalidate>
      <h2>Skriv till oss</h2>
      <p class="form-note">Meddelandet skickas direkt till oss. Vi svarar så snart vi kan.</p>
      <input type="hidden" name="_subject" value="Förfrågan via projekteffektivitet.se"><input type="hidden" name="_template" value="table"><input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field"><label for="f-name">Namn</label><input id="f-name" name="namn" autocomplete="name" required></div>
      <div class="field"><label for="f-org">Organisation</label><input id="f-org" name="organisation" autocomplete="organization"></div>
      <div class="field-row">
        <div class="field"><label for="f-email">E-post</label><input id="f-email" name="epost" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-phone">Telefon</label><input id="f-phone" name="telefon" type="tel" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="f-topic">Ämne</label>
        <select id="f-topic" name="amne">
          ${contact.topics.map(([v, l]) => html`<option value="${v}">${l}</option>`)}
        </select>
      </div>
      <div class="field"><label for="f-msg">Beskriv kort projektet och läget</label><textarea id="f-msg" name="meddelande" rows="6" required></textarea></div>
      <p class="form-error" role="alert" hidden>Fyll i namn, e-post och meddelande.</p>
      <p class="form-ok" role="status" hidden>Tack! Ditt meddelande är skickat – vi hör av oss.</p>
      <p><button class="button" type="submit">Skicka meddelande</button></p>
    </form>
  </div>
</section>`;
  return layout(ctx, { title: 'Kontakt', description: contact.lead, body, bodyClass: 'page-contact' });
}

// ------------------------------------------------------- Integritetspolicy

export function privacyPage(ctx) {
  const body = html`
${pageHead(ctx, { trail: [[privacy.title, 'integritetspolicy/']], title: privacy.heading, lead: privacy.lead, image: 'road_001.jpg' })}
<section class="section article-section">
  <div class="wrap article-grid">
    <div class="prose">
      ${privacy.sections.map(([h, p]) => html`<h2>${h}</h2><p>${p}</p>`)}
    </div>
  </div>
</section>`;
  return layout(ctx, { title: privacy.title, description: privacy.lead, body, bodyClass: 'page-privacy' });
}

// --------------------------------------------------------------------- 404

export function notFoundPage(ctx) {
  const body = html`
<section class="page-head page-head--404 has-media">
  ${headMedia(ctx, 'road_002.jpg')}
  <div class="wrap page-head-inner">
    <p class="page-label">404</p>
    <h1>Sidan kunde inte hittas</h1>
    <p class="page-lead">Länken kan vara gammal eller felstavad.</p>
    <ul class="link-list">
      <li><a href="${ctx.link('')}">Till startsidan</a></li>
      <li><a href="${ctx.link('tjanster/')}">Tjänster</a></li>
      <li><a href="${ctx.link('nyheter/')}">Nyheter</a></li>
      <li><a href="${ctx.link('kontakt/')}">Kontakt</a></li>
    </ul>
  </div>
</section>`;
  return layout(ctx, { title: 'Sidan kunde inte hittas', body, bodyClass: 'page-404' });
}
