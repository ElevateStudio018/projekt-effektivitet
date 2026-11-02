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
