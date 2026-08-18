/* Trayectoria (FR-17, FR-18). Misma decision que projects.js: fuente unica en
   src/content/ con los textos traducibles dentro del dato (D4, D13).

   El orden del array ES el orden de presentacion: ninguna vista reordena.

   EL PERIODO ES UN DATO, NO UN TEXTO.
     period: { from: 2023, to: null }   en curso
     period: { from: 2021, to: 2022 }   terminado
   `to: null` significa actualidad. Guardar "2023 — actualidad" como cadena
   obligaria a tener la palabra en los dos idiomas dentro del contenido, haria
   imposible ordenar por año, y la etiqueta "En curso" tendria que derivarse
   comparando cadenas. El formateo es responsabilidad de TimelineItem.

   ---------------------------------------------------------------------------
   FALTAN LOS AÑOS. El PRD no los trae y no se inventan: una fecha inventada en
   un CV es peor que una fecha ausente. Quedan en `null` con este aviso, para
   que Marcelo los complete.

   Mientras tanto `status` lleva lo que SI se sabe de cada hito —en curso,
   terminado, permanente—, que es lo que el prototipo mostraba como texto
   ("Actualidad", "En curso", "Egresado", "Siempre"). Cuando los años esten,
   `period` gana y `status` queda solo para los hitos sin fecha, como los
   personales, que genuinamente no la tienen.
   --------------------------------------------------------------------------- */

export const timeline = [
  {
    id: 'exo',
    type: 'work',
    period: { from: null, to: null }, // TODO(Marcelo): año de ingreso a EXO S.A.
    status: 'ongoing',
    stack: ['Flutter', 'Riverpod', 'Dart'],
    i18n: {
      es: {
        role: 'Frontend Developer',
        org: 'EXO S.A.',
        text: 'Formo parte del equipo de desarrollo de software. Me especializo en interfaces modernas con Flutter, Riverpod y Dart para web, mobile y aplicaciones de escritorio en Windows. Participo en el diseño de componentes, el consumo de APIs y el mantenimiento del código.',
      },
      en: {
        role: 'Frontend Developer',
        org: 'EXO S.A.',
        text: 'I am part of the software development team. I specialise in modern interfaces built with Flutter, Riverpod and Dart for web, mobile and Windows desktop applications. I take part in component design, API integration and code maintenance.',
      },
    },
  },
  {
    id: 'dashboards-vue',
    type: 'work',
    period: { from: null, to: null }, // TODO(Marcelo): año
    status: 'ongoing',
    stack: ['Vue', 'JavaScript'],
    i18n: {
      es: {
        role: 'Vue.js',
        org: 'Dashboards y herramientas internas',
        text: 'Desarrollo dashboards para visualización de datos y herramientas internas, con foco en experiencias de usuario fluidas y accesibles.',
      },
      en: {
        role: 'Vue.js',
        org: 'Dashboards and internal tools',
        text: 'I build data visualisation dashboards and internal tools, focused on smooth and accessible user experiences.',
      },
    },
  },
  {
    id: 'ifts-11',
    type: 'education',
    period: { from: null, to: null }, // TODO(Marcelo): año de inicio
    status: 'ongoing',
    stack: [],
    i18n: {
      es: {
        role: 'Desarrollo de Software',
        org: 'IFTS N.º 11',
        text: 'Estudiante de Desarrollo de Software en el Instituto de Formación Técnica Superior N.º 11, cursando el primer año. Durante este proceso adquirí conocimientos en algoritmos, estructuras de datos y programación orientada a objetos.',
      },
      en: {
        role: 'Software Development',
        org: 'IFTS No. 11',
        text: 'Software Development student at Instituto de Formación Técnica Superior No. 11, currently in the first year. Along the way I have built knowledge in algorithms, data structures and object-oriented programming.',
      },
    },
  },
  {
    id: 'digital-house',
    type: 'education',
    /* TODO(Marcelo): año de inicio. El certificado esta fechado en ABRIL DE
       2022, asi que el `to` es 2022 — se deja en null hasta que el `from` este,
       porque el componente muestra el rango o nada. */
    period: { from: null, to: null },
    status: 'completed',
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'React'],
    i18n: {
      es: {
        role: 'Full Stack Developer',
        org: 'Digital House',
        text: 'Completé el curso de Full Stack Developer, aprendiendo HTML, CSS, JavaScript, Node.js, Express, React y bases de datos relacionales y no relacionales.',
      },
      en: {
        role: 'Full Stack Developer',
        org: 'Digital House',
        text: 'I completed the Full Stack Developer programme, learning HTML, CSS, JavaScript, Node.js, Express, React and both relational and non-relational databases.',
      },
    },
  },
  {
    id: 'proyectos-personales',
    type: 'personal',
    /* Los hitos personales no tienen fecha de verdad: no es un dato faltante. */
    period: { from: null, to: null },
    status: 'always',
    stack: [],
    i18n: {
      es: {
        role: 'Proyectos personales',
        org: 'En mi tiempo libre',
        text: 'En mis tiempos libres desarrollo proyectos que me permiten explorar nuevas tecnologías y resolver problemas reales: un chat en tiempo real con WebSockets centrado en rendimiento y experiencia de usuario, y dashboards interactivos con filtros avanzados, manejo de estados y visualización dinámica de datos.',
      },
      en: {
        role: 'Personal projects',
        org: 'After hours',
        text: 'In my spare time I build projects that let me explore new technologies and solve real problems: a real-time chat over WebSockets focused on performance and user experience, and interactive dashboards with advanced filters, state handling and dynamic data visualisation.',
      },
    },
  },
  {
    id: 'autodidacta',
    type: 'personal',
    period: { from: null, to: null },
    status: 'always',
    stack: [],
    i18n: {
      es: {
        role: 'Autodidacta',
        org: 'Cursos, documentación y proyectos propios',
        text: 'Me capacito constantemente por mi cuenta a través de cursos, documentación oficial y proyectos prácticos que me permiten aplicar y afianzar lo aprendido. Esta actitud me ayuda a mantenerme actualizado en un entorno tecnológico en constante cambio.',
      },
      en: {
        role: 'Self-taught',
        org: 'Courses, documentation and personal projects',
        text: 'I keep training on my own through courses, official documentation and hands-on projects that let me apply and consolidate what I learn. That habit keeps me up to date in a technology landscape that never stops moving.',
      },
    },
  },
  {
    id: 'musica',
    type: 'personal',
    period: { from: null, to: null },
    status: 'always',
    stack: [],
    i18n: {
      es: {
        role: 'También afino guitarras',
        org: 'Más allá del código',
        text: 'Soy guitarrista y me gusta cantar. La música me ayuda a mantener el equilibrio, estimular la creatividad y conectar con otras personas desde un lugar artístico. Me enseña sobre disciplina, práctica constante y expresión personal — cosas que también hacen a un mejor desarrollador.',
      },
      en: {
        role: 'I also tune guitars',
        org: 'Beyond the code',
        text: 'I play guitar and I like to sing. Music helps me stay balanced, keeps my creativity awake and connects me with other people from an artistic place. It teaches me discipline, steady practice and personal expression — the same things that make a better developer.',
      },
    },
  },
];
