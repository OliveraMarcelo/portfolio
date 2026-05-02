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
  // Agrega aquí más textos según los que encuentres en la app
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
  // Add more translations as needed
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages
})

export default i18n;
