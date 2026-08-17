/* ============================================================
   home — page.js
   Solo los textos y el comportamiento PROPIOS de esta pantalla.
   El chasis (tema, idioma, header, indicador, menu, reveal) lo
   aporta ../_system/system.js. No reimplementar nada de eso aca.
   ============================================================ */

(function () {
  'use strict';

  MC.registrarTextos({
    es: {
      'doc.title': 'Marcelo Olivera — Frontend Developer',
      'skip': 'Saltar al contenido',
      'nav.aria': 'Navegación principal',
      'nav.home': 'Inicio',
      'nav.projects': 'Proyectos',
      'nav.about': 'Sobre mí',
      'theme.toLight': 'Cambiar a tema claro',
      'theme.toDark': 'Cambiar a tema oscuro',
      'lang.aria': 'Switch site language to English',
      'menu.open': 'Abrir menú',
      'menu.close': 'Cerrar menú',

      'hero.kicker': 'Hola, soy',
      'hero.roleAccent': 'Frontend',
      'hero.roleRest': 'Developer',
      'hero.lede': 'Construyo interfaces que se sienten tan bien como se ven — web, mobile y escritorio.',
      'hero.ctaProjects': 'Ver proyectos',
      'hero.ctaCv': 'Descargar CV',
      'hero.stackAria': 'Stack principal',
      'hero.portraitAria': 'Retrato de Marcelo Olivera (pendiente: photo.jpeg)',
      'hero.portraitNote': 'retrato — pendiente',
      'hero.scroll': 'desplazá',

      'projects.title': 'Proyectos',
      'projects.lede': 'Tres cosas que están corriendo, no ejercicios de curso.',
      'projects.live': 'En vivo',
      'projects.all': 'Ver todos los proyectos',
      'projects.jedami.desc': 'E-commerce con catálogo de productos, carrito de compras y gestión de pedidos.',
      'projects.jedami.imgAria': 'Captura de Tienda Jedami (pendiente: jedami-preview.png)',
      'projects.jedami.stackAria': 'Stack de Tienda Jedami',
      'projects.pokemon.desc': '¿Quién es este Pokémon? Juego de adivinanza con siluetas usando la PokéAPI.',
      'projects.pokemon.imgAria': 'Captura de Pokemon Game (pendiente: pokemon-preview.png)',
      'projects.pokemon.stackAria': 'Stack de Pokemon Game',
      'projects.chat.title': 'Mensajería en tiempo real',
      'projects.chat.desc': 'Chat en tiempo real con WebSockets, centrado en rendimiento y experiencia de usuario.',
      'projects.chat.imgAria': 'Vista previa pendiente de Mensajería en tiempo real',
      'projects.chat.stackAria': 'Stack de Mensajería en tiempo real',
      'projects.chat.status': 'En desarrollo — sin enlace público todavía',

      'stack.title': 'Mis habilidades',
      'stack.lede': 'Lo que uso todos los días, y lo que uso cuando hace falta.',
      'stack.tools': 'Herramientas',

      'path.title': 'Mi camino',
      'path.now': 'actual',
      'path.ongoing': 'en curso',
      'path.graduate': 'egresado',
      'path.exo': 'Interfaces con Flutter, Riverpod y Dart para web, mobile y escritorio Windows. Dashboards de visualización de datos con Vue.js.',
      'path.ifts': 'Algoritmos, estructuras de datos y programación orientada a objetos.',
      'path.dh': 'HTML, CSS, JavaScript, Node.js, Express, React y bases de datos relacionales y no relacionales.',
      'path.more': 'Conocer más sobre mí',

      'contact.title': 'Hablemos',
      'contact.lede': 'Respondo rápido. WhatsApp es el camino más corto.',

      'footer.made': 'Hecho con Vue'
    },
    en: {
      'doc.title': 'Marcelo Olivera — Frontend Developer',
      'skip': 'Skip to content',
      'nav.aria': 'Main navigation',
      'nav.home': 'Home',
      'nav.projects': 'Projects',
      'nav.about': 'About',
      'theme.toLight': 'Switch to light theme',
      'theme.toDark': 'Switch to dark theme',
      'lang.aria': 'Cambiar el idioma del sitio a español / switch to Spanish',
      'menu.open': 'Open menu',
      'menu.close': 'Close menu',

      'hero.kicker': "Hi, I'm",
      'hero.roleAccent': 'Frontend',
      'hero.roleRest': 'Developer',
      'hero.lede': 'I build interfaces that feel as good as they look — web, mobile and desktop.',
      'hero.ctaProjects': 'View projects',
      'hero.ctaCv': 'Download CV',
      'hero.stackAria': 'Core stack',
      'hero.portraitAria': 'Portrait of Marcelo Olivera (pending: photo.jpeg)',
      'hero.portraitNote': 'portrait — pending',
      'hero.scroll': 'scroll',

      'projects.title': 'Projects',
      'projects.lede': 'Three things that are running, not course exercises.',
      'projects.live': 'Live',
      'projects.all': 'View all projects',
      'projects.jedami.desc': 'E-commerce with a product catalogue, shopping cart and order management.',
      'projects.jedami.imgAria': 'Screenshot of Tienda Jedami (pending: jedami-preview.png)',
      'projects.jedami.stackAria': 'Tienda Jedami stack',
      'projects.pokemon.desc': "Who's that Pokémon? Silhouette guessing game built on the PokéAPI.",
      'projects.pokemon.imgAria': 'Screenshot of Pokemon Game (pending: pokemon-preview.png)',
      'projects.pokemon.stackAria': 'Pokemon Game stack',
      'projects.chat.title': 'Real-time messaging',
      'projects.chat.desc': 'Real-time chat over WebSockets, focused on performance and user experience.',
      'projects.chat.imgAria': 'Preview pending for Real-time messaging',
      'projects.chat.stackAria': 'Real-time messaging stack',
      'projects.chat.status': 'In progress — no public link yet',

      'stack.title': 'My skills',
      'stack.lede': 'What I use every day, and what I reach for when needed.',
      'stack.tools': 'Tools',

      'path.title': 'My path',
      'path.now': 'current',
      'path.ongoing': 'ongoing',
      'path.graduate': 'graduate',
      'path.exo': 'Interfaces with Flutter, Riverpod and Dart for web, mobile and Windows desktop. Data visualization dashboards with Vue.js.',
      'path.ifts': 'Algorithms, data structures and object-oriented programming.',
      'path.dh': 'HTML, CSS, JavaScript, Node.js, Express, React, and relational and non-relational databases.',
      'path.more': 'More about me',

      'contact.title': "Let's talk",
      'contact.lede': 'I reply fast. WhatsApp is the shortest path.',

      'footer.made': 'Made with Vue'
    }
  });

  /* ---------- Linea de tiempo (propio de esta pantalla) ---- */

  var timeline = document.getElementById('timeline');
  var timelineProgress = document.getElementById('timeline-progress');

  function updateTimeline() {
    if (!timeline || !timelineProgress) return;
    var box = timeline.getBoundingClientRect();
    var anchor = window.innerHeight * 0.72;
    var progress = (anchor - box.top) / box.height;
    progress = Math.max(0, Math.min(1, progress));
    timelineProgress.style.setProperty('--p', progress.toFixed(3));
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateTimeline(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && timelineProgress) {
    timelineProgress.style.setProperty('--p', '1');
  }
})();
