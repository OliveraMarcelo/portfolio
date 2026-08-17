/* ============================================================
   sobre-mi — page.js
   Solo los textos y el comportamiento PROPIOS de esta pantalla:
   reveals de la linea de tiempo, progreso del eje, lightbox del
   certificado y placeholders de imagen.
   El chasis (tema, idioma, header, indicador, menu) lo aporta
   ../_system/system.js.

   Nota: en esta pantalla el español vive en el HTML; solo se
   registra el override en inglés.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  MC.registrarTextos({ en: {
    'skip': 'Skip to content',
    'nav.label': 'Main navigation',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',

    'hero.kicker': 'Frontend Developer · Buenos Aires, Argentina',
    'hero.title': 'About me',
    'hero.lead': 'Building beautiful, functional websites is what I love doing, and that is why I give my best on every new challenge.',
    'hero.cv': 'Download CV',
    'hero.talk': 'Get in touch',

    'tl.kicker': 'Track record',
    'tl.title': 'How I got here',

    'tl.1.period': 'Present',
    'tl.1.role': 'Frontend Developer',
    'tl.1.org': 'EXO S.A.',
    'tl.1.text': 'I am part of the software development team. I specialise in modern interfaces built with Flutter, Riverpod and Dart for web, mobile and Windows desktop applications. I take part in component design, API integration and code maintenance.',

    'tl.2.period': 'Present',
    'tl.2.role': 'Vue.js',
    'tl.2.org': 'Dashboards and internal tools',
    'tl.2.text': 'I build data visualisation dashboards and internal tools, focused on smooth and accessible user experiences.',

    'tl.3.period': 'In progress',
    'tl.3.role': 'Software Development',
    'tl.3.org': 'IFTS No. 11',
    'tl.3.text': 'Software Development student at Instituto de Formación Técnica Superior No. 11, currently in the first year. Along the way I have built knowledge in algorithms, data structures and object-oriented programming.',

    'tl.4.period': 'Graduated',
    'tl.4.role': 'Full Stack Developer',
    'tl.4.org': 'Digital House',
    'tl.4.text': 'I completed the Full Stack Developer programme, learning HTML, CSS, JavaScript, Node.js, Express, React and both relational and non-relational databases.',

    'tl.5.period': 'Always',
    'tl.5.role': 'Self-taught',
    'tl.5.org': 'Courses, documentation and personal projects',
    'tl.5.text': 'I keep training on my own through courses, official documentation and hands-on projects that let me apply and consolidate what I learn. That habit keeps me up to date in a technology landscape that never stops moving.',

    'side.kicker': 'After hours',
    'side.title': 'Personal projects',
    'side.text': 'In my spare time I build projects that let me explore new technologies and solve real problems: a real-time chat over WebSockets focused on performance and user experience, and interactive dashboards with advanced filters, state handling and dynamic data visualisation.',

    'cert.kicker': 'Certification',
    'cert.title': 'Full Stack Developer certificate — Digital House',
    'cert.note': 'The full programme: web fundamentals, JavaScript, back-end with Node.js and Express, React and databases. Open the image to see it in detail.',
    'cert.caption': 'Digital House · Full Stack Developer',
    'cert.zoom': 'Open the Digital House certificate',
    'cert.close': 'Close',

    'music.kicker': 'Beyond the code',
    'music.title': 'I also tune guitars',
    'music.text': 'I play guitar and I like to sing. Music helps me stay balanced, keeps my creativity awake and connects me with other people from an artistic place. It teaches me discipline, steady practice and personal expression — the same things that make a better developer.',

    'contact.title': "Let's talk",
    'contact.lead': 'Got a project, an open role or just a technical question? Reach out through whichever channel suits you best.',
    'contact.wa': 'WhatsApp',
    'contact.mail': 'Email',
    'contact.li': 'LinkedIn',

    'footer.made': 'Built with Vue'
  } });

/* -------------------------------------------------------------------------
     4. Reveals al scroll
     ------------------------------------------------------------------------- */

  /* Un `.mask-in` arranca desplazado 105% fuera del recorte de su `.mask`, así
     que su rectángulo de intersección es cero y un IntersectionObserver nunca
     lo dispararía: se observa el contenedor y se marca al hijo. */
  var pending = [];

  Array.prototype.forEach.call(document.querySelectorAll('.reveal, .mask-in'), function (el) {
    var host = el.classList.contains('mask-in') ? (el.closest('.mask') || el) : el;
    var entry = null;
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].host === host) { entry = pending[i]; break; }
    }
    if (!entry) { entry = { host: host, targets: [] }; pending.push(entry); }
    entry.targets.push(el);
  });

  function markVisible(entry) {
    entry.targets.forEach(function (el) {
      el.classList.add('is-visible');
      var item = el.closest('.timeline__item');
      if (item) item.classList.add('is-visible');
    });
  }

  function sweepReveals() {
    if (!pending.length) return;
    var vh = window.innerHeight;
    var rest = [];
    for (var i = 0; i < pending.length; i++) {
      var rect = pending[i].host.getBoundingClientRect();
      // Umbral: 15 % del alto del elemento dentro del viewport.
      var trigger = vh - Math.min(rect.height * 0.15, vh * 0.2);
      if (rect.top <= trigger) markVisible(pending[i]);
      else rest.push(pending[i]);
    }
    pending = rest;
  }

  /* -------------------------------------------------------------------------
     5. Línea de tiempo — la línea se dibuja con el avance del scroll
     ------------------------------------------------------------------------- */

  var timeline = document.getElementById('timeline');

  function updateProgress() {
    if (!timeline || reduceMotion.matches) return;
    var rect = timeline.getBoundingClientRect();
    if (!rect.height) return;
    var anchor = window.innerHeight * 0.62;
    var progress = (anchor - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
  }

  /* -------------------------------------------------------------------------
     6. Un solo bucle de scroll: nav, reveals y progreso
     ------------------------------------------------------------------------- */

  var ticking = false;

  function onFrame() {
    ticking = false;
    setNavState();
    sweepReveals();
    updateProgress();
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onFrame);
  }

  /* -------------------------------------------------------------------------
     7. Lightbox del certificado
     ------------------------------------------------------------------------- */

  var dialog = document.getElementById('cert-dialog');
  var certOpen = document.getElementById('cert-open');
  var certClose = document.getElementById('cert-close');
  var lastFocused = null;

  if (dialog && certOpen && typeof dialog.showModal === 'function') {
    certOpen.addEventListener('click', function () {
      var active = document.activeElement;
      lastFocused = (active && active !== document.body) ? active : certOpen;
      dialog.showModal();
      if (certClose) certClose.focus();
    });

    if (certClose) {
      certClose.addEventListener('click', function () { dialog.close(); });
    }

    // Clic en el fondo cierra.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', function () {
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    });
  } else if (certOpen) {
    certOpen.hidden = true;
  }

  /* -------------------------------------------------------------------------
     8. Placeholders — si la imagen real no existe, queda el rótulo
     ------------------------------------------------------------------------- */

  Array.prototype.forEach.call(document.querySelectorAll('.ph-img img'), function (img) {
    var fail = function () { img.hidden = true; };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- Arranque de lo propio ----------------------- */

  if (reduceMotion.matches) {
    pending.forEach(markVisible);
    pending = [];
    if (timeline) timeline.style.setProperty('--timeline-progress', '1');
  }

  var ticking2 = false;
  function requestUpdate2() {
    if (ticking2) return;
    ticking2 = true;
    window.requestAnimationFrame(function () {
      ticking2 = false;
      sweepReveals();
      updateProgress();
    });
  }
  window.addEventListener('scroll', requestUpdate2, { passive: true });
  window.addEventListener('resize', requestUpdate2);
  requestUpdate2();
})();
