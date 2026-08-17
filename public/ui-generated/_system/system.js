/* ============================================================
   MarceCode — DESIGN SYSTEM · system.js
   UNA fuente de verdad del comportamiento del chasis:
   tema, idioma, header en scroll, indicador de nav, menu movil
   y scroll reveal. Ninguna pantalla reimplementa esto.

   Las paginas agregan SUS textos con:
       MC.registrarTextos({ es: {...}, en: {...} });
   y su comportamiento propio en su page.js.
   ============================================================ */

window.MC = (function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Estado que sobrevive a la navegacion -------- */
  /* Abierto con file://, cada documento es un origen distinto y
     localStorage NO se comparte: al pasar de una pantalla a otra se
     perdian el tema y el idioma. Se propagan por query string, que si
     viaja. Servido por HTTP, localStorage sigue siendo la fuente y esto
     no molesta. */

  var params = new URLSearchParams(location.search);

  function leerPreferencia(clave, valores) {
    var deURL = params.get(clave);
    if (deURL && valores.indexOf(deURL) !== -1) return deURL;
    try {
      var g = localStorage.getItem('mc-' + clave);
      if (g && valores.indexOf(g) !== -1) return g;
    } catch (e) { /* noop */ }
    return null;
  }

  function propagarEstado() {
    var qs = new URLSearchParams();
    qs.set('theme', temaActual());
    qs.set('lang', idiomaActual());
    var sufijo = '?' + qs.toString();
    var enlaces = document.querySelectorAll('a[href]');
    for (var i = 0; i < enlaces.length; i++) {
      var a = enlaces[i];
      var href = a.getAttribute('href');
      if (!href) continue;
      // solo enlaces internos a otra pantalla del prototipo
      if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
      if (!/\.html(\?|$)/.test(href)) continue;
      a.setAttribute('href', href.split('?')[0] + sufijo);
    }
  }

  /* ---------- Diccionario del chasis ---------------------- */
  /* Solo claves compartidas. Cada pantalla registra las suyas. */

  var I18N = {
    es: {
      'nav.aria': 'Navegación principal',
      'nav.home': 'Inicio',
      'nav.projects': 'Proyectos',
      'nav.about': 'Sobre mí',
      'theme.toLight': 'Cambiar a tema claro',
      'theme.toDark': 'Cambiar a tema oscuro',
      'lang.aria': 'Switch site language to English',
      'menu.open': 'Abrir menú',
      'menu.close': 'Cerrar menú',
      'a11y.logo': 'MarceCode — ir al inicio',
      'a11y.skip': 'Saltar al contenido',
      'footer.made': 'Hecho con Vue'
    },
    en: {
      'nav.aria': 'Main navigation',
      'nav.home': 'Home',
      'nav.projects': 'Projects',
      'nav.about': 'About',
      'theme.toLight': 'Switch to light theme',
      'theme.toDark': 'Switch to dark theme',
      'lang.aria': 'Cambiar el idioma del sitio a español',
      'menu.open': 'Open menu',
      'menu.close': 'Close menu',
      'a11y.logo': 'MarceCode — go to home',
      'a11y.skip': 'Skip to content',
      'footer.made': 'Built with Vue'
    }
  };

  function registrarTextos(dict) {
    ['es', 'en'].forEach(function (lang) {
      if (!dict[lang]) return;
      Object.keys(dict[lang]).forEach(function (k) { I18N[lang][k] = dict[lang][k]; });
    });
    aplicarIdioma(idiomaActual());
  }

  /* ---------- Tema ---------------------------------------- */
  /* Contrato: sin atributo = oscuro; [data-theme="dark"] y
     [data-theme="light"] fuerzan, y ambos existen en el CSS. */

  var themeBtn = document.getElementById('theme-toggle');
  var systemScheme = window.matchMedia('(prefers-color-scheme: light)');

  function temaActual() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncThemeLabel() {
    if (!themeBtn) return;
    var key = temaActual() === 'light' ? 'theme.toDark' : 'theme.toLight';
    themeBtn.setAttribute('data-i18n-aria', key);
    themeBtn.setAttribute('aria-label', I18N[idiomaActual()][key]);
  }

  function setTema(tema, persistir) {
    root.setAttribute('data-theme', tema);
    if (persistir) {
      try { localStorage.setItem('mc-theme', tema); } catch (e) { /* noop */ }
    }
    syncThemeLabel();
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setTema(temaActual() === 'light' ? 'dark' : 'light', true);
    });
  }

  var onSchemeChange = function (e) {
    var guardado = null;
    try { guardado = localStorage.getItem('mc-theme'); } catch (err) { /* noop */ }
    if (!guardado) setTema(e.matches ? 'light' : 'dark', false);
  };
  if (typeof systemScheme.addEventListener === 'function') {
    systemScheme.addEventListener('change', onSchemeChange);
  }

  /* ---------- Idioma ------------------------------------- */

  var langBtn = document.getElementById('lang-toggle');

  function idiomaActual() {
    return root.getAttribute('lang') === 'en' ? 'en' : 'es';
  }

  function aplicarIdioma(lang) {
    var dict = I18N[lang];
    root.setAttribute('lang', lang);
    if (dict['doc.title']) document.title = dict['doc.title'];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n-aria')];
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });

    if (langBtn) {
      var actual = langBtn.querySelector('.lang-current');
      var otro = langBtn.querySelector('.lang-other');
      if (actual) actual.textContent = lang.toUpperCase();
      if (otro) otro.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    syncThemeLabel();
    syncMenuLabel();
    requestAnimationFrame(placeIndicator);
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = idiomaActual() === 'es' ? 'en' : 'es';
      try { localStorage.setItem('mc-lang', next); } catch (e) { /* noop */ }
      aplicarIdioma(next);
    });
  }

  /* ---------- Header en scroll --------------------------- */

  var header = document.querySelector('.site-header');

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 80);
  }

  /* ---------- Indicador de nav --------------------------- */

  var indicator = document.querySelector('.nav-indicator');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list .nav-link'));
  var activeLink = document.querySelector('.nav-list .nav-link.is-active') || navLinks[0];

  function moveIndicator(target) {
    if (!indicator || !target) return;
    indicator.style.width = target.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + target.offsetLeft + 'px)';
    indicator.classList.add('is-ready');
  }
  function placeIndicator() { moveIndicator(activeLink); }

  navLinks.forEach(function (link) {
    link.addEventListener('mouseenter', function () { moveIndicator(link); });
    link.addEventListener('focus', function () { moveIndicator(link); });
  });
  var navList = document.querySelector('.nav-list');
  if (navList) navList.addEventListener('mouseleave', placeIndicator);

  /* ---------- Menu movil --------------------------------- */
  /* El apilamiento vive en components.css: scrim 90 < header 100
     < panel 105. Sin eso el scrim se come los clicks. */

  var menuBtn = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var scrim = document.querySelector('.nav-scrim');

  function syncMenuLabel() {
    if (!menuBtn) return;
    var abierto = menuBtn.getAttribute('aria-expanded') === 'true';
    var key = abierto ? 'menu.close' : 'menu.open';
    menuBtn.setAttribute('data-i18n-aria', key);
    menuBtn.setAttribute('aria-label', I18N[idiomaActual()][key]);
  }

  function setMenu(abierto) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute('aria-expanded', String(abierto));
    mobileMenu.classList.toggle('is-open', abierto);
    if (scrim) scrim.classList.toggle('is-visible', abierto);
    body.style.overflow = abierto ? 'hidden' : '';
    syncMenuLabel();
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- Transiciones entre documentos -------------- */
  /* Solo bajo http/https: con file:// cada documento tiene origen opaco,
     la transicion cross-document no es valida y la navegacion se rompe.
     Servido por HTTP, el prototipo navega con transicion; abierto como
     archivo, navega normal. */

  if (location.protocol === 'http:' || location.protocol === 'https:') {
    var vt = document.createElement('style');
    vt.textContent = '@view-transition { navigation: auto; }';
    document.head.appendChild(vt);
  }

  /* ---------- Scroll reveal ------------------------------ */

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Arranque ----------------------------------- */

  // El tema puede venir en la URL (unico canal que sobrevive en file://).
  var temaPreferido = leerPreferencia('theme', ['dark', 'light']);
  if (temaPreferido) setTema(temaPreferido, false);

  aplicarIdioma(leerPreferencia('lang', ['es', 'en']) === 'en' ? 'en' : 'es');

  // Los enlaces internos llevan el estado actual, y se refrescan cada vez
  // que el usuario cambia tema o idioma.
  propagarEstado();
  if (themeBtn) themeBtn.addEventListener('click', propagarEstado);
  if (langBtn) langBtn.addEventListener('click', propagarEstado);

  syncThemeLabel();
  syncMenuLabel();
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  window.addEventListener('resize', placeIndicator);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { body.classList.add('is-loaded'); });
  });

  placeIndicator();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(placeIndicator).catch(function () { /* noop */ });
  }
  window.addEventListener('load', placeIndicator);

  if (reduceMotion.matches) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  return {
    registrarTextos: registrarTextos,
    aplicarIdioma: aplicarIdioma,
    idiomaActual: idiomaActual,
    temaActual: temaActual,
    cerrarMenu: function () { setMenu(false); }
  };
})();
