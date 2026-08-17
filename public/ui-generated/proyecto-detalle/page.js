/* ============================================================
   proyecto-detalle — page.js
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
      'head.lede': 'E-commerce con catálogo, carrito y gestión de pedidos.',
      'action.live': 'Ver en vivo',
      'action.code': 'Ver código',
      'facts.role': 'Rol',
      'facts.roleValue': 'Desarrollador full stack',
      'facts.year': 'Año',
      'facts.status': 'Estado',
      'facts.statusValue': 'En producción',
      'ch1.title': 'El problema',
      'ch1.body': 'Un comercio necesitaba vender online sin depender de una plataforma de terceros: catálogo propio, control del stock y gestión de los pedidos desde un mismo lugar.',
      'ch2.title': 'La solución',
      'ch2.body': 'Una aplicación web con catálogo de productos, carrito de compras y panel de gestión de pedidos. El frontend se construyó con Vue, consumiendo una API propia en Node.js y Express sobre una base de datos relacional. Las vistas se armaron con componentes reutilizables y rutas protegidas para la parte de administración.',
      'ch3.title': 'Mi rol',
      'ch3.body': 'Diseñé e implementé la interfaz completa, definí la estructura de componentes y el manejo de estado, y construí la API que la alimenta. También me ocupé del despliegue y de que el sitio funcione bien en mobile, que es por donde entra la mayoría de los clientes.',
      'stack.title': 'Stack completo',
      'stack.g1': 'Interfaz',
      'stack.g2': 'Servidor y datos',
      'stack.vue': 'interfaz y manejo de estado del carrito',
      'stack.js': 'lógica de la aplicación',
      'stack.sass': 'estilos con variables y componentes',
      'stack.node': 'API de productos y pedidos',
      'stack.mysql': 'persistencia de catálogo, stock y pedidos',
      'next.kicker': 'Siguiente proyecto',
      'footer.made': 'Hecho con Vue',
      'a11y.skip': 'Saltar al contenido',
      'a11y.logo': 'MarceCode — ir al inicio',
      'a11y.nav': 'Navegación principal',
      'a11y.crumbs': 'Migas de navegación',
      'a11y.stack': 'Stack de Tienda Jedami',
      'a11y.facts': 'Ficha rápida del proyecto',
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
      'head.lede': 'E-commerce with catalog, cart and order management.',
      'action.live': 'View live',
      'action.code': 'View code',
      'facts.role': 'Role',
      'facts.roleValue': 'Full stack developer',
      'facts.year': 'Year',
      'facts.status': 'Status',
      'facts.statusValue': 'In production',
      'ch1.title': 'The problem',
      'ch1.body': 'A shop needed to sell online without depending on a third-party platform: its own catalog, stock control and order management, all from the same place.',
      'ch2.title': 'The solution',
      'ch2.body': 'A web application with a product catalog, shopping cart and an order management panel. The frontend was built with Vue, consuming a custom API in Node.js and Express on top of a relational database. The views were assembled from reusable components, with protected routes for the admin side.',
      'ch3.title': 'My role',
      'ch3.body': 'I designed and implemented the entire interface, defined the component structure and state handling, and built the API behind it. I also handled deployment and made sure the site works well on mobile, which is where most customers come from.',
      'stack.title': 'Full stack',
      'stack.g1': 'Interface',
      'stack.g2': 'Server and data',
      'stack.vue': 'interface and cart state handling',
      'stack.js': 'application logic',
      'stack.sass': 'styles with variables and components',
      'stack.node': 'products and orders API',
      'stack.mysql': 'catalog, stock and order persistence',
      'next.kicker': 'Next project',
      'footer.made': 'Built with Vue',
      'a11y.skip': 'Skip to content',
      'a11y.logo': 'MarceCode — go to home',
      'a11y.nav': 'Main navigation',
      'a11y.crumbs': 'Breadcrumb',
      'a11y.stack': 'Tienda Jedami stack',
      'a11y.facts': 'Project quick facts',
      'a11y.menuOpen': 'Open menu',
      'a11y.menuClose': 'Close menu',
      'a11y.themeToLight': 'Switch to light theme',
      'a11y.themeToDark': 'Switch to dark theme',
      'a11y.langSwitch': 'Cambiar a español'
    }
  });

  /* ---------- Progreso de lectura (propio de esta pantalla) - */

  var progressBar = document.getElementById('read-progress-bar');
  var ticking = false;

  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateProgress(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
})();
