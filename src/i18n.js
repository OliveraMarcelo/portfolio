import { createI18n } from 'vue-i18n';

const messages = {
  es: {
    welcome: 'Bienvenido a mi portafolio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    contact: 'Contacto',
    home: 'Inicio',
    langBtn: 'EN',
    helloIm: 'Hola soy',
    developer: 'Developer',
    aboutMeDesc: 'Soy un apasionado desarrollador web con experiencia en front-end y back-end. Me encanta crear aplicaciones web increíbles y resolver problemas desafiantes.',
    downloadCV: 'Descargar CV',
    realtimeMessagingTitle: 'Mensajeria en tiempo real',
    realtimeMessagingDesc: 'Deseas mandar mensajes en tiempo real y chatear con tus amigos ! Entonces este proyecto te interesara!',
  onlineStoreTitle: 'Tienda Jedami',
  onlineStoreDesc: 'E-commerce con catálogo de productos, carrito de compras y gestión de pedidos. Desarrollado con Node.js y Vue.',
  pokemonGameTitle: 'Pokemon Game',
  pokemonGameDesc: '¿Quién es este Pokémon? Juego de adivinanza con siluetas usando la PokéAPI. Desarrollado con TypeScript y Vue.',
    // Chasis (historia 1.5). La 1.7 mueve todo esto a src/locales/es.json
    navAria: 'Navegación principal',
    logoAria: 'MarceCode — ir al inicio',
    skipLink: 'Saltar al contenido',
    langAria: 'Switch site language to English',
    footerMade: 'Hecho con Vue',
    footerWhatsapp: 'Escribime por WhatsApp',
    footerEmail: 'Escribime un email',
    footerLinkedin: 'Ver mi perfil de LinkedIn',
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
  },
  en: {
    welcome: 'Welcome to my portfolio',
    about: 'About me',
    projects: 'Projects',
    contact: 'Contact',
    home: 'Home',
    langBtn: 'ES',
    helloIm: 'Hello I am',
    developer: 'Developer',
    aboutMeDesc: 'I am a passionate web developer with experience in front-end and back-end. I love creating amazing web applications and solving challenging problems.',
    downloadCV: 'Download CV',
    realtimeMessagingTitle: 'Real-time Messaging',
    realtimeMessagingDesc: 'Do you want to send real-time messages and chat with your friends? Then this project will interest you!',
  onlineStoreTitle: 'Jedami Store',
  onlineStoreDesc: 'E-commerce with product catalog, shopping cart and order management. Built with Node.js and Vue.',
  pokemonGameTitle: 'Pokemon Game',
  pokemonGameDesc: 'Who is that Pokémon? Guessing game with silhouettes using the PokéAPI. Built with TypeScript and Vue.',
    // Chasis (historia 1.5). La 1.7 mueve todo esto a src/locales/en.json
    navAria: 'Main navigation',
    logoAria: 'MarceCode — go to home',
    skipLink: 'Skip to content',
    langAria: 'Cambiar el idioma del sitio a español',
    footerMade: 'Built with Vue',
    footerWhatsapp: 'Message me on WhatsApp',
    footerEmail: 'Send me an email',
    footerLinkedin: 'View my LinkedIn profile',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages
})

export default i18n;
