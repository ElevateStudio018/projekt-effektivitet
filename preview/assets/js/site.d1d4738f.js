// Mobilmeny och kontaktformulär. Allt fungerar utan JavaScript: menyn
// visas då alltid och kontaktuppgifterna finns i klartext.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      header.classList.toggle('nav-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  var form = document.querySelector('.contact-form');
  if (!form) return;

  // Förval av ämne via ?amne=projektanalys (samma parameter som gamla sajten).
  var topic = new URLSearchParams(location.search).get('amne');
  var select = form.querySelector('[name="amne"]');
  if (topic && select && select.querySelector('option[value="' + topic + '"]')) select.value = topic;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var get = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
    var error = form.querySelector('.form-error');
    if (!get('namn') || !get('meddelande')) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    var topicLabel = select.value ? select.options[select.selectedIndex].text : '';
    var subject = 'Förfrågan' + (topicLabel ? ': ' + topicLabel : '') + (get('organisation') ? ' – ' + get('organisation') : '');
    var lines = [
      get('meddelande'),
      '',
      '--',
      get('namn'),
      get('organisation'),
      get('epost'),
      get('telefon'),
    ].filter(function (l, i) { return i < 3 || l; });
    location.href = 'mailto:' + form.getAttribute('data-mailto') +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();

// Exempelchatt i startsidans hero. Spelar upp tre korta samtal i loop,
// pausar när den inte syns och visar ett stillastående samtal för den som
// valt minskad rörelse.
(function () {
  var root = document.querySelector('.hero-chat');
  if (!root) return;
  var data = JSON.parse(root.querySelector('.hc-data').textContent);
  var log = root.querySelector('.hc-log');
  var chipsBox = root.querySelector('.hc-chips');
  var field = root.querySelector('.hc-field');
  var typed = root.querySelector('.hc-typed');
  var send = root.querySelector('.hc-send');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wide = window.matchMedia('(min-width: 1100px)');

  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(root);
  }
  var active = function () { return visible && !document.hidden && wide.matches; };
  // Väntar ms millisekunder av "aktiv" tid – står still när chatten inte syns.
  var sleep = function (ms) {
    return new Promise(function (res) {
      var left = ms;
      (function step() {
        if (left <= 0) return res();
        setTimeout(function () { if (active()) left -= 100; step(); }, 100);
      })();
    });
  };

  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  var avatar = function () {
    var a = el('span', 'hc-avatar'); var i = el('img'); i.src = data.avatar; i.alt = ''; a.appendChild(i); return a;
  };
  var row = function (who, content) {
    var r = el('div', 'hc-row ' + who);
    if (who === 'bot') r.appendChild(avatar());
    r.appendChild(content);
    return r;
  };
  var add = function (node, instant) {
    var item = el('div', 'hc-item'); item.appendChild(node); log.appendChild(item);
    if (instant) { item.style.height = 'auto'; item.classList.add('is-in'); return item; }
    var h = item.scrollHeight;
    requestAnimationFrame(function () { item.style.height = h + 'px'; item.classList.add('is-in'); });
    setTimeout(function () { item.style.height = 'auto'; }, 500);
    return item;
  };
  var remove = function (item) {
    item.style.height = item.scrollHeight + 'px';
    requestAnimationFrame(function () { item.style.height = '0px'; item.classList.remove('is-in'); });
    setTimeout(function () { item.remove(); }, 450);
  };
  var bubble = function (text, list) {
    var b = el('p', 'hc-bubble', text);
    if (list) { var ul = el('ul'); list.forEach(function (t) { ul.appendChild(el('li', '', t)); }); b.appendChild(ul); }
    return b;
  };
  var dots = function () { var d = el('span', 'hc-bubble hc-dots'); d.innerHTML = '<i></i><i></i><i></i>'; return d; };
  var cta = function () {
    var c = el('span', 'hc-cta', data.cta);
    c.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 16 16"><path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>');
    return c;
  };

  // Stillastående version
  if (reduced) {
    var s0 = data.scenarios[0];
    add(row('bot', bubble(data.greeting)), true);
    add(row('me', bubble(data.chips[s0.chip])), true);
    add(row('bot', bubble(s0.answer, s0.list)), true);
    add(row('me', bubble(data.question)), true);
    add(row('bot', bubble(data.reply)), true);
    add(cta(), true);
    return;
  }

  async function play(sc) {
    add(row('bot', bubble(data.greeting)));
    await sleep(900);
    chipsBox.innerHTML = '';
    var chips = data.chips.map(function (t) { var c = el('span', 'hc-chip', t); chipsBox.appendChild(c); return c; });
    chipsBox.classList.add('is-in');
    for (var i = 0; i < chips.length; i++) { await sleep(220); chips[i].classList.add('is-in'); }
    await sleep(1300);
    chips[sc.chip].classList.add('is-pressed');
    await sleep(500);
    chipsBox.classList.remove('is-in');
    add(row('me', bubble(data.chips[sc.chip])));
    await sleep(500);
    var typing = add(row('bot', dots()));
    await sleep(1200);
    remove(typing);
    add(row('bot', bubble(sc.answer, sc.list)));
    await sleep(2800);
    field.classList.add('is-typing');
    for (var k = 1; k <= data.question.length; k++) { typed.textContent = data.question.slice(0, k); await sleep(70); }
    await sleep(400);
    send.classList.add('is-pressed');
    await sleep(250);
    send.classList.remove('is-pressed');
    field.classList.remove('is-typing'); typed.textContent = '';
    add(row('me', bubble(data.question)));
    await sleep(400);
    typing = add(row('bot', dots()));
    await sleep(1100);
    remove(typing);
    add(row('bot', bubble(data.reply)));
    await sleep(700);
    add(cta());
    await sleep(5000);
    log.classList.add('is-clearing');
    await sleep(500);
    log.innerHTML = '';
    log.classList.remove('is-clearing');
    await sleep(300);
  }

  (async function loop() {
    var n = 0;
    await sleep(600);
    for (;;) { await play(data.scenarios[n % data.scenarios.length]); n++; }
  })();
})();
