// Chattassistent för projekteffektivitet.se.
//
// Helt i webbläsaren: inga cookies, ingen tredjepart och ingen AI-tjänst.
// Kunskapen (tjänster, Loopingmodellen, artiklar, kontakt) byggs in från
// sajtens innehåll vid bygget (__KB__ ersätts i src/build.mjs). Frågor
// matchas mot avsikter med nyckelord och synonymer. Assistenten kan också
// guida fram rätt tjänst och skicka en förfrågan via samma FormSubmit-
// adress som kontaktformuläret, med konversationen bifogad.
(function () {
  var KB = __KB__;
  var me = document.currentScript;
  var ROOT = me.getAttribute('data-root') || '/';
  var REL = me.getAttribute('data-rel') === '1';
  var AVATAR = me.getAttribute('data-avatar');
  var KEY = 'pe-chat-v1';

  var url = function (p) {
    if (/^(https?:|mailto:|tel:)/.test(p)) return p;
    var hash = '';
    var i = p.indexOf('#'); if (i >= 0) { hash = p.slice(i); p = p.slice(0, i); }
    var q = '';
    i = p.indexOf('?'); if (i >= 0) { q = p.slice(i); p = p.slice(0, i); }
    return REL ? ROOT + p + (p === '' || /\/$/.test(p) ? 'index.html' : '') + q + hash : ROOT + p + q + hash;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // --------------------------------------------------------- Textmatchning
  var norm = function (s) {
    return ' ' + String(s).toLowerCase()
      .replace(/[^a-zåäöéü0-9@.+ ]+/g, ' ')
      .replace(/\s+/g, ' ').trim() + ' ';
  };
  var STOP = ' och i att det som en på är av för med till den har de inte om ett var jag ni vi du kan hur vad vilka vilken vem när man ska skulle mitt min era ert er oss mig sig så också eller men från nu just lite mer ';
  var words = function (s) { return norm(s).trim().split(' ').filter(function (w) { return w.length > 2 && STOP.indexOf(' ' + w + ' ') < 0; }); };
  // Enkel stamning: tar bort vanliga svenska ändelser.
  var stem = function (w) { return w.replace(/(arna|erna|orna|ande|ende|heten|ningen|ningar|ning|erna|are|het|en|et|er|ar|or|na|a|e|s)$/, '') || w; };

  // Avsikter: nyckelfraser (delsträngar efter norm) med vikt.
  var INTENTS = [
    { id: 'greet', k: { hej: 3, hallå: 3, tjena: 3, hejsan: 3, 'god morgon': 3, tja: 2 } },
    { id: 'thanks', k: { tack: 4, 'tusen tack': 4, toppen: 2, perfekt: 2, bra: 1 } },
    { id: 'bye', k: { 'hej då': 5, hejdå: 5, adjö: 4, 'ha det': 3 } },
    { id: 'services', k: { tjänst: 3, tjänster: 4, erbjud: 4, 'vad gör ni': 5, 'vad kan ni': 4, 'hjälpa till med': 3, hjälp: 1, konsult: 2, stöd: 1 } },
    { id: 'svc:projektspecialist', k: { projektspecialist: 6, specialist: 4, projektledare: 4, 'interim': 3, avlastning: 3, bollplank: 3, 'saknar projektledare': 5, inhyrd: 2, struktur: 1, tempo: 1 } },
    { id: 'svc:projektanalys', k: { projektanalys: 6, analys: 4, genomlysning: 5, 'tappat fart': 4, stannat: 3, 'står still': 4, oberoende: 2, beslutsunderlag: 3, vägval: 3, granskning: 3, utvärdering: 3, review: 3, revision: 2 } },
    { id: 'svc:projekteffekt', k: { projekteffekt: 6, 'första hjälpen': 6, akut: 5, kris: 5, konflikt: 4, haveri: 5, brinner: 5, försenat: 3, försening: 3, fördyring: 3, 'över budget': 4, kaos: 4, risk: 2, förebygg: 3 } },
    { id: 'loop', k: { loopingmodellen: 6, looping: 5, loop: 4, loopar: 4, modell: 3, metod: 3, arbetssätt: 2, 'kontinuerlig förbättring': 5, förbättring: 2, 'business case': 4, verkningsgrad: 4 } },
    { id: 'price', k: { pris: 5, priser: 5, kostar: 5, kostnad: 4, timpris: 5, arvode: 5, budget: 2, offert: 5, 'vad tar ni': 4, dyrt: 4 } },
    { id: 'process', k: { 'hur går det till': 6, 'hur börjar': 5, 'komma igång': 5, 'första steg': 5, process: 3, upplägg: 4, start: 2, 'hur fungerar': 4, samarbete: 3 } },
    { id: 'time', k: { 'hur lång tid': 6, 'hur länge': 5, tid: 2, snabbt: 3, 'när kan': 4, tillgänglig: 4, ledig: 3, omgående: 4, direkt: 2 } },
    { id: 'about', k: { 'om er': 5, 'vilka är ni': 6, företaget: 4, bolaget: 4, 'om företaget': 5, bakgrund: 3, erfarenhet: 3, uppsala: 3, 'var finns ni': 5, 'var sitter': 4, ort: 2, distans: 3, 'hela sverige': 4, remote: 3 } },
    { id: 'per', k: { per: 4, mattsson: 6, 'per mattsson': 8, grundare: 4, ägare: 4, 'vem driver': 6, pmp: 6, certifier: 5, 'project management professional': 6 } },
    { id: 'contact', k: { 'når jag': 6, 'når er': 6, 'nå er': 6, 'nå dig': 6, 'når man': 5, kontaktuppgift: 6, kontakt: 5, kontakta: 6, ring: 5, ringa: 5, telefon: 6, nummer: 4, mejl: 5, mail: 5, 'e post': 5, epost: 5, adress: 3, nå: 2, prata: 3, boka: 5, möte: 4, samtal: 3, träffa: 4 } },
    { id: 'lead', k: { 'bli kontaktad': 8, 'kontakta mig': 8, 'ring mig': 8, 'hör av er': 8, 'skicka förfrågan': 8, förfrågan: 5, 'lämna uppgifter': 7, 'boka ett samtal': 8, 'boka möte': 7 } },
    { id: 'guide', k: { 'vilken tjänst': 7, 'vad passar': 6, rekommend: 5, 'vet inte': 4, osäker: 4, 'vad behöver': 5, behov: 3, 'hjälp mig välja': 7 } },
    { id: 'news', k: { nyhet: 5, nyheter: 6, artikel: 5, artiklar: 6, blogg: 5, läsa: 3, insikt: 4, tips: 3 } },
    { id: 'elevate', k: { elevate: 8, 'elevate studio': 8, webbyrå: 6, hemsida: 4, webbplats: 3, webbsida: 4, pjm: 5 } },
    { id: 'privacy', k: { integritet: 6, gdpr: 7, personuppgift: 6, cookie: 6, cookies: 6, spar: 3, data: 2 } },
    { id: 'bot', k: { 'är du en robot': 8, 'är du ai': 8, robot: 4, bot: 4, chatgpt: 6, 'vem är du': 6, människa: 4 } },
    { id: 'industry', k: { bransch: 6, branscher: 6, offentlig: 4, kommun: 4, region: 3, myndighet: 4, 'it projekt': 5, it: 2, bygg: 4, industri: 4, privat: 2, företag: 1 } },
  ];

  var scoreIntents = function (text) {
    var n = norm(text);
    var ws = words(text).map(stem);
    var best = [];
    INTENTS.forEach(function (it) {
      var s = 0;
      for (var k in it.k) {
        var nk = ' ' + k + ' ';
        if (n.indexOf(nk) >= 0) s += it.k[k] * 1.2;
        else if (k.indexOf(' ') < 0 && k.length > 3 && n.indexOf(' ' + k) >= 0) s += it.k[k];
        else if (k.indexOf(' ') < 0 && k.length > 4 && ws.indexOf(stem(k)) >= 0) s += it.k[k] * 0.8;
      }
      if (s > 0) best.push({ id: it.id, s: s });
    });
    best.sort(function (a, b) { return b.s - a.s; });
    return best;
  };

  // Söker i artiklar och sidtexter efter ord ur frågan.
  var searchDocs = function (text) {
    var q = words(text).map(stem).filter(function (w) { return w.length > 2; });
    if (!q.length) return [];
    return KB.docs.map(function (d) {
      var hay = norm(d.title + ' ' + d.text);
      var title = norm(d.title);
      var s = 0;
      q.forEach(function (w) { if (hay.indexOf(' ' + w) >= 0) s += 1; if (title.indexOf(' ' + w) >= 0) s += 2; });
      return { d: d, s: s / Math.sqrt(q.length) };
    }).filter(function (r) { return r.s >= 1.2; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
  };

  // ------------------------------------------------------------ Tillstånd
  var state = { open: false, log: [], flow: null, lead: {}, ctx: null };
  try { var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (saved) state = saved; state.open = false; } catch (e) { /* inget sparat */ }
  var save = function () { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privat läge */ } };

  // ------------------------------------------------------------------ UI
  var root = document.createElement('div');
  root.className = 'pe-chat';
  root.innerHTML =
    '<button class="pe-chat-launch" type="button" aria-expanded="false" aria-controls="pe-chat-panel">' +
      '<span class="pe-chat-launch-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>' +
      '<span class="pe-chat-launch-text">Frågor om ert projekt?</span>' +
    '</button>' +
    '<section class="pe-chat-panel" id="pe-chat-panel" role="dialog" aria-label="Chatt med Projekteffektivitet" hidden>' +
      '<header class="pe-chat-head">' +
        (AVATAR ? '<img class="pe-chat-avatar" src="' + AVATAR + '" alt="" width="40" height="40">' : '') +
        '<div><p class="pe-chat-title">Projekteffektivitet</p><p class="pe-chat-sub">Assistent · svarar direkt</p></div>' +
        '<button class="pe-chat-reset" type="button" title="Börja om" aria-label="Börja om"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
        '<button class="pe-chat-close" type="button" aria-label="Stäng chatten"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
      '</header>' +
      '<div class="pe-chat-log" aria-live="polite"></div>' +
      '<div class="pe-chat-chips"></div>' +
      '<form class="pe-chat-form" autocomplete="off">' +
        '<label class="visually-hidden" for="pe-chat-input">Skriv ett meddelande</label>' +
        '<input id="pe-chat-input" class="pe-chat-input" type="text" placeholder="Skriv en fråga …" maxlength="600">' +
        '<button class="pe-chat-send" type="submit" aria-label="Skicka"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '</form>' +
      '<p class="pe-chat-note">Automatisk assistent. Inget sparas förrän du själv skickar en förfrågan.</p>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.pe-chat-launch');
  var panel = root.querySelector('.pe-chat-panel');
  var log = root.querySelector('.pe-chat-log');
  var chips = root.querySelector('.pe-chat-chips');
  var form = root.querySelector('.pe-chat-form');
  var input = root.querySelector('.pe-chat-input');

  // Enkel markdown: **fet**, [text](länk), radbrytningar och punktlistor.
  var md = function (s) {
    var out = esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, t, h) { return '<a href="' + esc(url(h)) + '">' + t + '</a>'; });
    var lines = out.split('\n'); var html = ''; var inList = false;
    lines.forEach(function (l) {
      if (/^- /.test(l)) { if (!inList) { html += '<ul>'; inList = true; } html += '<li>' + l.slice(2) + '</li>'; }
      else { if (inList) { html += '</ul>'; inList = false; } if (l.trim()) html += '<p>' + l + '</p>'; }
    });
    if (inList) html += '</ul>';
    return html;
  };

  var renderMsg = function (m) {
    var el = document.createElement('div');
    el.className = 'pe-msg pe-msg--' + m.who;
    el.innerHTML = m.who === 'bot' ? md(m.text) : '<p>' + esc(m.text) + '</p>';
    log.appendChild(el);
  };
  var renderChips = function (list) {
    chips.innerHTML = '';
    (list || []).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pe-chip'; b.textContent = c;
      b.addEventListener('click', function () { userSays(c); });
      chips.appendChild(b);
    });
  };
  var scroll = function () { log.scrollTop = log.scrollHeight; };

  var typing;
  var bot = function (text, chipList, delay) {
    state.chips = chipList || [];
    var t = Math.min(1100, 280 + text.length * 6);
    if (delay === 0) t = 0;
    if (typing) typing.remove();
    typing = document.createElement('div');
    typing.className = 'pe-msg pe-msg--bot pe-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.setAttribute('aria-label', 'Skriver');
    if (t) { log.appendChild(typing); scroll(); }
    renderChips([]);
    return new Promise(function (res) {
      setTimeout(function () {
        if (typing) { typing.remove(); typing = null; }
        var m = { who: 'bot', text: text };
        state.log.push(m); renderMsg(m); renderChips(state.chips); scroll(); save(); res();
      }, t);
    });
  };

  // -------------------------------------------------------------- Svar
  var MAIN = ['Vilken tjänst passar oss?', 'Vad är Loopingmodellen?', 'Vad kostar det?', 'Bli kontaktad'];
  var svc = function (id) { return KB.services.filter(function (s) { return s.id === id; })[0]; };

  var answerService = function (s) {
    state.ctx = s.id;
    return bot('**' + s.title + '** – ' + s.summary + '\n\n' + s.body[0] + '\n\nPassar särskilt när:\n' +
      s.when.map(function (w) { return '- ' + w; }).join('\n') +
      '\n\n[Läs mer om ' + s.title.toLowerCase() + '](' + 'tjanster/' + s.id + '/)',
      ['Hur går ett uppdrag till?', 'Vad kostar det?', 'Bli kontaktad om ' + s.title.toLowerCase(), 'Andra tjänster']);
  };

  var startGuide = function () {
    state.flow = 'guide';
    return bot('Jag hjälper dig hitta rätt. Vilket av de här stämmer bäst in på ert läge just nu?',
      ['Projektet har tappat fart', 'Det har blivit akut', 'Vi saknar projektledare', 'Vi vill bli bättre på projekt generellt']);
  };
  var guideAnswer = function (text) {
    var n = norm(text);
    state.flow = null;
    var pick = /tappat|fart|stann|står still|vet inte varför|analys/.test(n) ? 'projektanalys'
      : /akut|kris|brinn|konflikt|försen|budget|haveri/.test(n) ? 'projekteffekt'
      : /saknar|projektledare|avlast|resurs|kapacitet|specialist/.test(n) ? 'projektspecialist'
      : /bättre|generellt|förmåga|organisation|verkningsgrad|arbetssätt|utveckla/.test(n) ? 'loop' : null;
    if (!pick) return null;
    if (pick === 'loop') {
      state.ctx = 'loopingmodellen';
      return bot('Då låter det som att ni vill **öka verkningsgraden** i hela projektorganisationen. Där arbetar vi med **Loopingmodellen** – förbättring i avgränsade loopar där varje loop har ett business case och en kontrollerad effekt.\n\n[Läs om Loopingmodellen](loopingmodellen/)',
        ['Hur fungerar en loop?', 'Bli kontaktad', 'Andra tjänster']);
    }
    var s = svc(pick);
    return bot('Utifrån det du beskriver rekommenderar jag **' + s.title + '**.', null, 0).then(function () { return answerService(s); });
  };

  // Förfrågan via chatten: namn → kontaktväg → kort beskrivning → bekräfta.
  var startLead = function () {
    state.flow = 'lead:name'; state.lead = {};
    return bot('Gärna! Per återkommer personligen. Vad heter du?', ['Avbryt']);
  };
  var leadStep = function (text) {
    var t = text.trim();
    if (/^avbryt$/i.test(t)) { state.flow = null; return bot('Inga problem, förfrågan är avbruten. Något annat jag kan hjälpa till med?', MAIN); }
    if (state.flow === 'lead:name') {
      state.lead.name = t.slice(0, 80); state.flow = 'lead:contact';
      return bot('Tack ' + state.lead.name.split(' ')[0] + '! Vilken e-postadress eller vilket telefonnummer når Per dig på?', ['Avbryt']);
    }
    if (state.flow === 'lead:contact') {
      var email = (t.match(/[^\s@]+@[^\s@]+\.[a-z]{2,}/i) || [])[0];
      var phone = (t.replace(/[\s-]/g, '').match(/\+?\d{7,15}/) || [])[0];
      if (!email && !phone) return bot('Det ser inte ut som en e-postadress eller ett telefonnummer. Kan du skriva det igen?', ['Avbryt']);
      state.lead.email = email || ''; state.lead.phone = phone || '';
      state.flow = 'lead:msg';
      return bot('Beskriv kort projektet och läget – vad behöver ni hjälp med?', ['Avbryt']);
    }
    if (state.flow === 'lead:msg') {
      state.lead.msg = t.slice(0, 1500); state.flow = 'lead:confirm';
      var l = state.lead;
      return bot('Stämmer det här?\n\n- **Namn:** ' + l.name + '\n- **Kontakt:** ' + [l.email, l.phone].filter(Boolean).join(', ') + '\n- **Ärende:** ' + l.msg,
        ['Skicka', 'Ändra', 'Avbryt']);
    }
    if (state.flow === 'lead:confirm') {
      if (/^ändra/i.test(t)) return startLead();
      if (!/^(skicka|ja|japp|stämmer|ok)/i.test(t)) return bot('Skriv **Skicka** för att skicka förfrågan, eller **Ändra** för att börja om.', ['Skicka', 'Ändra', 'Avbryt']);
      return sendLead();
    }
  };
  var sendLead = function () {
    var l = state.lead;
    state.flow = null;
    var data = new FormData();
    data.append('_subject', 'Förfrågan via chatten – ' + l.name);
    data.append('_template', 'table');
    data.append('_captcha', 'false');
    data.append('Namn', l.name);
    if (l.email) { data.append('email', l.email); data.append('_replyto', l.email); }
    if (l.phone) data.append('Telefon', l.phone);
    if (state.ctx) data.append('Intresse', state.ctx);
    data.append('Meddelande', l.msg);
    data.append('Sida', location.pathname);
    data.append('Konversation', state.log.slice(-14).map(function (m) { return (m.who === 'bot' ? 'Assistent: ' : 'Besökare: ') + m.text.replace(/\*\*/g, ''); }).join('\n'));
    return bot('Skickar …', null, 0).then(function () {
      return fetch(KB.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { if (j && String(j.success) === 'false') throw new Error('fs'); })
        .then(function () {
          return bot('Tack! Din förfrågan är skickad. Per återkommer till dig så snart som möjligt.', ['Läs våra nyheter', 'Vad är Loopingmodellen?']);
        })
        .catch(function () {
          var body = encodeURIComponent('Namn: ' + l.name + '\nKontakt: ' + [l.email, l.phone].filter(Boolean).join(', ') + '\n\n' + l.msg);
          return bot('Förfrågan kunde inte skickas härifrån just nu. [Öppna den som mejl i stället](mailto:' + KB.email + '?subject=' + encodeURIComponent('Förfrågan via webbplatsen') + '&body=' + body + ') eller ring **' + KB.phone + '**.', MAIN);
        });
    });
  };

  var reply = function (text) {
    if (state.flow && state.flow.indexOf('lead:') === 0) return leadStep(text);
    if (state.flow === 'guide') { var g = guideAnswer(text); if (g) return g; }

    var n = norm(text);
    // Följdfrågor om senast nämnda tjänst.
    if (/^ (andra|övriga|fler) tjänster /.test(n)) return answerIntent('services', text);
    if (/^ bli kontaktad/.test(n)) return startLead();

    var hits = scoreIntents(text);
    var top = hits[0];
    if (top && top.s >= 3) return answerIntent(top.id, text, hits);
    var docs = searchDocs(text);
    if (docs.length) {
      return bot('Det här kan vara till hjälp:\n' + docs.map(function (r) { return '- [' + r.d.title + '](' + r.d.path + ')'; }).join('\n') +
        '\n\nVill du att Per hör av sig och svarar på din fråga direkt?', ['Bli kontaktad', 'Vilken tjänst passar oss?', 'Vad gör ni?']);
    }
    if (top) return answerIntent(top.id, text, hits);
    state.misses = (state.misses || 0) + 1;
    if (state.misses >= 2) {
      state.misses = 0;
      return bot('Den frågan kan jag tyvärr inte svara bra på. Per svarar gärna själv – ring **' + KB.phone + '**, mejla [' + KB.email + '](mailto:' + KB.email + ') eller låt mig skicka din fråga vidare.', ['Bli kontaktad', 'Vad gör ni?']);
    }
    return bot('Jag är inte säker på att jag förstår. Jag kan svara på frågor om våra tjänster, Loopingmodellen, hur ett uppdrag går till och hur du når oss. Vad vill du veta?', MAIN);
  };

  var answerIntent = function (id, text, hits) {
    state.misses = 0;
    if (id.indexOf('svc:') === 0) return answerService(svc(id.slice(4)));
    switch (id) {
      case 'greet':
        return bot('Hej! Vad kan jag hjälpa dig med?', MAIN);
      case 'thanks':
        return bot('Varsågod! Hör av dig om du undrar något mer.', ['Bli kontaktad', 'Läs våra nyheter']);
      case 'bye':
        return bot('Tack för pratstunden – lycka till med projektet!', null);
      case 'services':
        return bot('Vi hjälper organisationer att få bättre effekt i sina projekt. Tre tjänster:\n' +
          KB.services.map(function (s) { return '- **' + s.title + '** – ' + s.summary; }).join('\n') +
          '\n\nOch för att höja förmågan över tid arbetar vi med **Loopingmodellen**.\n\n[Alla tjänster](tjanster/)',
          ['Projektspecialist', 'Projektanalys', 'Projekteffekt', 'Vilken tjänst passar oss?']);
      case 'guide':
        return startGuide();
      case 'loop':
        state.ctx = 'loopingmodellen';
        return bot('**Loopingmodellen** delar upp förbättringsarbetet i avgränsade loopar i stället för ett stort program. Varje loop har fyra steg:\n' +
          KB.loop.map(function (s, i) { return '- **' + (i + 1) + '. ' + s.short + '** – ' + s.text; }).join('\n') +
          '\n\nVarje varv ger ett mätbart resultat och ett beslutsunderlag för nästa – förmågan växer loop för loop.\n\n[Läs om Loopingmodellen](loopingmodellen/)',
          ['Varför loopar?', 'Bli kontaktad', 'Andra tjänster']);
      case 'price':
        return bot('Varje uppdrag prissätts utifrån omfattning och behov – en avgränsad projektanalys ser annorlunda ut än att gå in som projektledare under en längre tid. Efter ett första, kostnadsfritt samtal får ni ett tydligt förslag med upplägg och pris.',
          ['Bli kontaktad', 'Hur går ett uppdrag till?']);
      case 'process':
        return bot('Så brukar det gå till:\n- **Första samtal** – vi ringar in läget, behovet och möjliga vägval.\n- **Förslag** – ni får ett upplägg med mål, omfattning och pris.\n- **Genomförande** – vi arbetar tillsammans med er organisation, med tydlig uppföljning.\n- **Effekt** – vi följer upp mot det projektet ska förändra i verksamheten.',
          ['Bli kontaktad', 'Vad kostar det?', 'Vilken tjänst passar oss?']);
      case 'time':
        return bot('Det beror på uppdraget. En projektanalys kan ofta genomföras på några veckor, medan ett uppdrag som projektspecialist följer projektets längd. Vid akuta lägen försöker vi komma igång snabbt – hör av er så stämmer Per av tillgängligheten.',
          ['Bli kontaktad', 'Det har blivit akut']);
      case 'about':
        return bot(KB.about + '\n\n[Om oss](om-oss/)', ['Vem är Per Mattsson?', 'Vad gör ni?', 'Bli kontaktad']);
      case 'per':
        return bot('**Per Mattsson** driver Projekteffektivitet och är certifierad **Project Management Professional (PMP)** – en internationell certifiering för projektledare från Project Management Institute.\n\nDu når Per på **' + KB.phone + '** eller [' + KB.email + '](mailto:' + KB.email + ').',
          ['Bli kontaktad', 'Vad gör ni?']);
      case 'contact':
        return bot('Du når oss enklast så här:\n- **Telefon:** [' + KB.phone + '](tel:' + KB.phone.replace(/\s/g, '') + ')\n- **E-post:** [' + KB.email + '](mailto:' + KB.email + ')\n- **Formulär:** [Kontaktsidan](kontakt/)\n\nVill du hellre att Per hör av sig till dig?',
          ['Bli kontaktad']);
      case 'lead':
        return startLead();
      case 'news':
        return bot('Senaste från oss:\n' + KB.news.slice(0, 4).map(function (a) { return '- [' + a.title + '](' + a.path + ')'; }).join('\n') + '\n\n[Alla nyheter](nyheter/)',
          ['Sex tecken på att ett projekt tappat fart', 'Vad är Loopingmodellen?']);
      case 'elevate':
        return bot('**Elevate Studio** är webbyrån inom PJM Projekteffektivitet AB – samma bolag, med fokus på webbplatser. [Läs mer i nyheten](nyheter/elevate-studio-varumarke-inom-pjmp/) eller besök [elevatestudio.nu](https://elevatestudio.nu).',
          ['Vad gör Projekteffektivitet?']);
      case 'privacy':
        return bot('Webbplatsen använder inga cookies, ingen spårning och ingen statistik. Den här chatten sparar ingenting förrän du själv väljer att skicka en förfrågan. [Integritetspolicy](integritetspolicy/)', MAIN);
      case 'bot':
        return bot('Jag är en automatisk assistent som svarar utifrån innehållet på webbplatsen. För frågor om just ert projekt är det bäst att prata med Per direkt.', ['Bli kontaktad', 'Vad gör ni?']);
      case 'industry':
        return bot('Vi arbetar med projekt där styrning, människor och genomförande behöver hänga ihop – både i offentlig och privat verksamhet. Metoderna är branschoberoende; det som räknas är effekten i verksamheten. Berätta gärna om ert projekt så kan Per säga hur vi kan hjälpa till.',
          ['Bli kontaktad', 'Vilken tjänst passar oss?']);
    }
    return bot('Berätta gärna lite mer, så hjälper jag dig vidare.', MAIN);
  };

  // Snabbval som inte är frågor i sig.
  var ALIAS = {
    'vad gör ni?': 'services', 'andra tjänster': 'services', 'vad gör projekteffektivitet?': 'services',
    'vilken tjänst passar oss?': 'guide', 'hur går ett uppdrag till?': 'process', 'vem är per mattsson?': 'per',
    'läs våra nyheter': 'news', 'varför loopar?': 'loopwhy', 'hur fungerar en loop?': 'loop',
    'sex tecken på att ett projekt tappat fart': 'article:tecken-pa-att-projektet-tappat-fart',
  };

  var userSays = function (text) {
    text = String(text).trim();
    if (!text) return;
    var m = { who: 'user', text: text };
    state.log.push(m); renderMsg(m); scroll(); save();
    var a = ALIAS[text.toLowerCase()];
    if (a === 'loopwhy') return bot(KB.loopWhy + '\n\n[Läs mer](loopingmodellen/)', ['Bli kontaktad', 'Andra tjänster']);
    if (a && a.indexOf('article:') === 0) {
      var art = KB.news.filter(function (x) { return x.path.indexOf(a.slice(8)) >= 0; })[0];
      if (art) return bot('**' + art.title + '**\n\n' + art.lead + '\n\n[Läs artikeln](' + art.path + ')', ['Projektanalys', 'Bli kontaktad']);
    }
    if (a && !state.flow) return answerIntent(a, text);
    return reply(text);
  };

  // -------------------------------------------------------- Öppna/stäng
  var greeted = function () {
    if (state.log.length) { state.log.forEach(renderMsg); renderChips(state.chips); scroll(); return; }
    var page = location.pathname;
    var intro = 'Hej! Jag är Projekteffektivitets assistent. Jag kan berätta om våra tjänster, Loopingmodellen och hur ett uppdrag går till – eller skicka din fråga vidare till Per.';
    var list = MAIN;
    KB.services.forEach(function (s) { if (page.indexOf('/' + s.id + '/') >= 0) { intro += '\n\nDu läser om **' + s.title.toLowerCase() + '** – undrar du något om den?'; list = ['Hur går ett uppdrag till?', 'Vad kostar det?', 'Bli kontaktad om ' + s.title.toLowerCase()]; state.ctx = s.id; } });
    bot(intro, list, 0);
  };
  var setOpen = function (open) {
    state.open = open;
    panel.hidden = !open;
    launch.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
    if (open) {
      if (!log.childNodes.length) greeted();
      setTimeout(function () { input.focus(); }, 50);
    } else launch.focus();
  };
  launch.addEventListener('click', function () { setOpen(!state.open); });
  root.querySelector('.pe-chat-close').addEventListener('click', function () { setOpen(false); });
  root.querySelector('.pe-chat-reset').addEventListener('click', function () {
    state = { open: true, log: [], flow: null, lead: {}, ctx: null };
    log.innerHTML = ''; save(); greeted(); input.focus();
  });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value; input.value = '';
    userSays(v);
  });
  // "Bli kontaktad om projektanalys" m.fl.
  var origUser = userSays;
  userSays = function (text) {
    var mm = /^bli kontaktad om (.+)$/i.exec(String(text).trim());
    if (mm && !state.flow) {
      var m = { who: 'user', text: text };
      state.log.push(m); renderMsg(m); scroll(); save();
      return startLead();
    }
    return origUser(text);
  };
})();
