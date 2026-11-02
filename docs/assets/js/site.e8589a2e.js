// Mobilmeny och kontaktformulär. Allt fungerar utan JavaScript: menyn
// visas då alltid och kontaktuppgifterna finns i klartext.
(function () {
  // Fast sidhuvud: får bakgrund när man har skrollat.
  var hdr = document.querySelector('.site-header');
  var onScroll = function () { if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
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

  // Skickar via FormSubmit (fungerar på alla statiska webbhotell). Om det
  // misslyckas öppnas e-postprogrammet med meddelandet ifyllt i stället.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var get = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
    var error = form.querySelector('.form-error');
    var ok = form.querySelector('.form-ok');
    var button = form.querySelector('button[type="submit"]');
    if (!get('namn') || !get('meddelande') || !/.+@.+\..+/.test(get('epost'))) { error.hidden = false; return; }
    error.hidden = true;
    var topicLabel = select.value ? select.options[select.selectedIndex].text : 'Allmän förfrågan';
    var subject = 'Förfrågan: ' + topicLabel + (get('organisation') ? ' – ' + get('organisation') : '');
    var mailto = function () {
      var body = [get('meddelande'), '', '--', get('namn'), get('organisation'), get('epost'), get('telefon')].join('\n');
      location.href = 'mailto:' + form.getAttribute('data-mailto') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    };
    var data = new FormData(form);
    data.set('_subject', subject);
    data.set('amne', topicLabel);
    button.disabled = true; button.textContent = 'Skickar …';
    fetch(form.getAttribute('data-ajax'), { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () { form.reset(); ok.hidden = false; button.textContent = 'Skickat'; })
      .catch(function () { button.disabled = false; button.textContent = 'Skicka meddelande'; mailto(); });
  });
})();

// Reklamfilmen ovanför sidfoten: väljer liggande eller stående version efter
// skärmbredd, laddar först när den närmar sig, spelas tyst i loop medan den
// syns och pausas annars. Vid minskad rörelse startar den bara på klick.
(function () {
  var video = document.querySelector('.film-video');
  if (!video) return;
  var btn = document.querySelector('.film-toggle');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tall = window.matchMedia('(max-width: 699px)');
  var loaded = false, inView = false, userPaused = reduced, ended = false;
  var link = document.querySelector('.film-link');

  var variant = function () { return tall.matches ? 'tall' : 'wide'; };
  var setPoster = function () { video.poster = video.dataset[variant() + 'Poster']; };
  var load = function () {
    var src = video.dataset[variant()];
    if (video.getAttribute('src') === src) return;
    video.src = src; loaded = true;
  };
  var sync = function () {
    btn.classList.toggle('is-playing', !video.paused);
    btn.setAttribute('aria-label', video.paused ? 'Spela filmen' : 'Pausa filmen');
  };
  var play = function () { load(); var p = video.play(); if (p && p.catch) p.catch(function () {}); };

  setPoster();
  btn.hidden = false;
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  // Slutbilden: knappen i filmen blir klickbar. Filmen stannar på sista bilden tills sidan laddas om.
  video.addEventListener('timeupdate', function () { if (video.currentTime >= 16.6) link.hidden = false; });
  video.addEventListener('ended', function () { ended = true; link.hidden = false; btn.hidden = true; });
  btn.addEventListener('click', function () {
    if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  });
  tall.addEventListener && tall.addEventListener('change', function () {
    setPoster();
    if (loaded) { var was = !video.paused; video.removeAttribute('src'); loaded = false; load(); if (was) play(); }
  });

  if ('IntersectionObserver' in window) {
    // Ladda i förväg när filmen är nära, spela när minst hälften syns.
    new IntersectionObserver(function (e) { if (e[0].isIntersecting && !reduced) load(); }, { rootMargin: '400px' }).observe(video);
    new IntersectionObserver(function (e) {
      inView = e[0].isIntersecting;
      if (inView && !userPaused && !ended) play(); else if (!inView) video.pause();
    }, { threshold: 0.5 }).observe(video);
  }
  sync();
})();
