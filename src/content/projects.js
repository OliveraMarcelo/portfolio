/* Fuente unica de los proyectos (D4, FR-10).
   Antes de esta historia los datos vivian duplicados en HomeView y en
   ProjectsView, y la vista de detalle los habria triplicado.

   Los textos traducibles van DENTRO del dato, no como claves sueltas en
   src/locales/. La razon es el riesgo R3: con claves sueltas, sumar un
   proyecto obliga a tocar tres archivos y es facilisimo olvidarse del ingles.
   Aca un proyecto sin traduccion se ve al mirar el objeto.

   src/locales/ es para etiquetas de interfaz; src/content/ para contenido.
   Ciclos de vida distintos (D13).

   Solo lectura: ningun modulo muta este array, y el orden del array ES el
   orden de presentacion — ninguna vista reordena.

   `image` es el nombre base, no la ruta: el modulo de contenido no sabe de
   rutas de build ni de extensiones. El componente resuelve el asset. */

export const projects = [
  {
    slug: 'tienda-jedami',
    featured: true,
    stack: ['Vue', 'Node.js'],
    image: 'jedami-preview',
    liveUrl: 'https://jedamiapp.com',
    repoUrl: 'https://github.com/OliveraMarcelo/tienda-jedami',
    i18n: {
      es: {
        title: 'Tienda Jedami',
        summary: 'E-commerce con catálogo de productos, carrito de compras y gestión de pedidos.',
        problem: 'El negocio vendía por mensajería: cada pedido se armaba a mano, sin catálogo consultable ni registro de qué se había pedido.',
        solution: 'Una tienda con catálogo navegable, carrito persistente y un panel donde los pedidos quedan registrados y se siguen por estado.',
        role: 'Desarrollo completo, de la interfaz en Vue a la API en Node.js.',
      },
      en: {
        title: 'Jedami Store',
        summary: 'E-commerce with product catalog, shopping cart and order management.',
        problem: 'The business sold over messaging apps: every order was assembled by hand, with no browsable catalog and no record of what had been ordered.',
        solution: 'A store with a browsable catalog, a persistent cart, and a panel where orders are recorded and tracked by status.',
        role: 'End-to-end development, from the Vue interface to the Node.js API.',
      },
    },
  },
  {
    slug: 'pokemon-game',
    featured: true,
    stack: ['TypeScript', 'Vue'],
    image: 'pokemon-preview',
    liveUrl: 'https://pokemon-game-theta-gold.vercel.app',
    repoUrl: 'https://github.com/OliveraMarcelo/pokemon-game',
    i18n: {
      es: {
        title: 'Pokemon Game',
        summary: '¿Quién es este Pokémon? Juego de adivinanza con siluetas usando la PokéAPI.',
        problem: 'Quería un proyecto chico para practicar TypeScript sobre una API pública real, con estado de juego y no solo con listados.',
        solution: 'Un juego que pide un Pokémon al azar a la PokéAPI, lo muestra en silueta y valida la respuesta entre cuatro opciones.',
        role: 'Desarrollo completo: tipado del consumo de la API, lógica de juego e interfaz.',
      },
      en: {
        title: 'Pokemon Game',
        summary: "Who's that Pokémon? A silhouette guessing game built on the PokéAPI.",
        problem: 'I wanted a small project to practice TypeScript against a real public API, with actual game state rather than just lists.',
        solution: 'A game that pulls a random Pokémon from the PokéAPI, shows it as a silhouette, and checks the answer against four options.',
        role: 'End-to-end development: typing the API consumption, game logic and interface.',
      },
    },
  },
  {
    slug: 'chat-tiempo-real',
    featured: true,
    stack: ['WebSockets', 'Node.js'],
    /* FALTA EL ASSET: no existe src/assets/img/chat-preview.*. FR-12 la exige
       en la card y FR-15 en el detalle. Registrada como brecha critica en la
       validacion de arquitectura y anotada en TASKS.md §2 desde antes del
       redisenio. Se resuelve en la historia 7.1 y necesita que Marcelo saque
       la captura, o decida como se presenta este proyecto sin ella.
       NO apuntar a image.png: esa es la imagen del certificado y pasaria por
       captura de proyecto. */
    image: 'chat-preview',
    /* Sin demo en vivo ni repositorio publico. `null` explicito y no '' ni
       campo omitido: null dice "este proyecto no tiene sitio en vivo", que es
       informacion; undefined no distingue entre "no tiene" y "me olvide". */
    liveUrl: null,
    repoUrl: null,
    i18n: {
      es: {
        title: 'Mensajería en tiempo real',
        summary: 'Chat con entrega instantánea de mensajes sobre WebSockets.',
        problem: 'Un chat sobre HTTP obliga a preguntar por mensajes nuevos cada pocos segundos: llegan tarde y el servidor recibe pedidos que casi siempre vuelven vacíos.',
        solution: 'Una conexión WebSocket persistente por la que el servidor empuja cada mensaje en cuanto llega, sin que el cliente tenga que preguntar.',
        role: 'Desarrollo completo del servidor de mensajes en Node.js y del cliente.',
      },
      en: {
        title: 'Real-time Messaging',
        summary: 'A chat with instant message delivery over WebSockets.',
        problem: 'A chat over HTTP has to poll for new messages every few seconds: they arrive late and the server fields requests that almost always come back empty.',
        solution: 'A persistent WebSocket connection the server pushes every message through the moment it arrives, with no polling from the client.',
        role: 'End-to-end development of the Node.js message server and the client.',
      },
    },
  },
];

/* Resolucion slug -> proyecto. Ocurre exclusivamente aca: ninguna vista
   busca por su cuenta dentro del array. Devuelve null —no undefined— cuando
   no encuentra, para que el llamador distinga "no existe" de "no lo busque". */
export function bySlug(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}
