/* ============================================================
   proyectos — page.js
   Solo los textos y el comportamiento PROPIOS de esta pantalla.
   El chasis (tema, idioma, header, indicador, menu, reveal) lo
   aporta ../_system/system.js. No reimplementar nada de eso aca.
   ============================================================ */

(function () {
  'use strict';

  MC.registrarTextos({
    es: {
      'nav.home': 'Inicio',
      'nav.projects': 'Proyectos',
      'nav.about': 'Sobre mí',
      'head.title': 'Mis Proyectos',
      'head.lede': 'Aplicaciones que construí resolviendo problemas reales. Cada una está en producción o con el código abierto.',
      'p1.summary': 'E-commerce con catálogo de productos, carrito de compras y gestión de pedidos.',
      'p2.summary': '¿Quién es este Pokémon? Juego de adivinanza con siluetas usando la PokéAPI.',
      'p3.summary': 'Chat en tiempo real con WebSockets, centrado en rendimiento y experiencia de usuario.',
      'p3.note': 'Sin demo pública',
      'action.live': 'Ver en vivo',
      'action.code': 'Ver código',
      'contact.title': '¿Tenés un proyecto en mente?',
      'contact.lede': 'Escribime por el canal que te quede más cómodo. Respondo dentro del día.',
      'footer.made': 'Hecho con Vue',
      'a11y.skip': 'Saltar al contenido',
      'a11y.logo': 'MarceCode — ir al inicio',
      'a11y.nav': 'Navegación principal',
      'a11y.grid': 'Catálogo de proyectos',
      'a11y.stack1': 'Stack de Tienda Jedami',
      'a11y.stack2': 'Stack de Pokemon Game',
      'a11y.stack3': 'Stack de Mensajería en tiempo real',
      'a11y.menuOpen': 'Abrir menú',
      'a11y.menuClose': 'Cerrar menú',
      'a11y.themeToLight': 'Cambiar a tema claro',
      'a11y.themeToDark': 'Cambiar a tema oscuro',
      'a11y.langSwitch': 'Switch to English'
    },
    en: {
      'nav.home': 'Home',
      'nav.projects': 'Projects',
      'nav.about': 'About me',
      'head.title': 'My Projects',
      'head.lede': 'Apps I built to solve real problems. Each one is either in production or open source.',
      'p1.summary': 'E-commerce with product catalog, shopping cart and order management.',
      'p2.summary': "Who's that Pokémon? Silhouette guessing game built on the PokéAPI.",
      'p3.summary': 'Real-time chat over WebSockets, focused on performance and user experience.',
      'p3.note': 'No public demo',
      'action.live': 'View live',
      'action.code': 'View code',
      'contact.title': 'Got a project in mind?',
      'contact.lede': 'Reach out through whichever channel suits you. I reply within the day.',
      'footer.made': 'Built with Vue',
      'a11y.skip': 'Skip to content',
      'a11y.logo': 'MarceCode — go to home',
      'a11y.nav': 'Main navigation',
      'a11y.grid': 'Project catalog',
      'a11y.stack1': 'Tienda Jedami stack',
      'a11y.stack2': 'Pokemon Game stack',
      'a11y.stack3': 'Real-time messaging stack',
      'a11y.menuOpen': 'Open menu',
      'a11y.menuClose': 'Close menu',
      'a11y.themeToLight': 'Switch to light theme',
      'a11y.themeToDark': 'Switch to dark theme',
      'a11y.langSwitch': 'Cambiar a español'
    }
  });

  /* Esta pantalla no tiene comportamiento propio: todo su
     interactivo (tema, idioma, nav, menu, reveal) lo aporta
     el sistema. Antes estaba duplicado aca. */
})();
