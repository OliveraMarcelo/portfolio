---
stepsCompleted: ['discovery', 'vision', 'success', 'journeys', 'scoping', 'functional', 'nonfunctional']
inputDocuments: ['código fuente src/', 'TASKS.md', 'README.md']
workflowType: 'prd'
---

# Product Requirements Document — MarceCode Portfolio (Rediseño 2026)

**Autor:** Marcelo Olivera
**Fecha:** 2026-08-07
**Versión:** 1.0
**Producto:** marcecode.com — portfolio personal de Marcelo Olivera
**Tipo de proyecto:** Rediseño completo de un sitio existente (Vue 3 SPA en producción)

---

## 1. Resumen ejecutivo

MarceCode es el portfolio personal de **Marcelo Olivera**, Frontend Developer en EXO S.A.
El sitio existe y está en producción en `marcecode.com` (Vue 3 + Vue Router + vue-i18n,
desplegado por Docker/Nginx con CI/CD a un VPS).

Su versión actual **cumple la función informativa pero no la persuasiva**: presenta la
información correcta con una ejecución visual genérica, sin identidad propia ni movimiento.
Para un desarrollador frontend, esto es un problema de credibilidad: el portfolio *es* la
demo. Un frontend que se presenta con una página estática y plana está contradiciendo su
propio pitch.

Este PRD define un **rediseño completo, moderno y animado**: una experiencia con
transiciones fluidas entre vistas, animaciones ligadas al scroll, micro-interacciones en
cada elemento accionable y una identidad visual reconocible — sin sacrificar velocidad de
carga ni accesibilidad.

**El resultado es el argumento.** Alguien que llega al sitio debe pensar "este tipo sabe
hacer interfaces" antes de leer una sola línea del CV.

---

## 2. Contexto y problema

### 2.1 Estado actual

| Dimensión | Situación hoy |
|---|---|
| Stack | Vue 3.2 (Options/Composition mixto), Vue Router 4, vue-i18n 9, SASS, PWA |
| Vistas | `/` (Home), `/projects` (Proyectos), `/about` (Sobre mí) |
| Identidad | Naranja `#FF7948` + grises, fuente Poppins — sin sistema formalizado |
| Movimiento | Un `IntersectionObserver` que agrega `.loaded`; sin transiciones de ruta |
| Dark mode | Toggle que aplica `.dark-mode` al `body`, sin persistencia ni tokens |
| i18n | ES/EN parcial: Home traducido, Proyectos y Sobre mí con texto hardcodeado |
| Contenido | Datos de proyectos duplicados entre `HomeView` y `ProjectsView` |

### 2.2 Problemas identificados

- **P1 — Sin identidad visual.** El sitio podría ser el de cualquier persona. No hay un
  gesto de diseño memorable.
- **P2 — Sin movimiento.** Nada acompaña al scroll, nada responde al cursor, las rutas
  cambian con un corte seco. Para un portfolio de frontend es la carencia más costosa.
- **P3 — Jerarquía plana.** Todo pesa lo mismo: el nombre, las skills, los proyectos.
  No hay una acción primaria clara por pantalla.
- **P4 — Los proyectos no venden.** Cards con una captura y dos botones. No se cuenta el
  problema resuelto, el stack, ni el rol.
- **P5 — Bilingüismo roto.** Cambiar a inglés deja media página en español.
- **P6 — Dark mode no confiable.** No persiste entre recargas ni respeta la preferencia
  del sistema.
- **P7 — Grid frágil.** El ancho alternado 60/40 por índice se rompe en mobile.

### 2.3 Restricciones

- Se mantiene el stack: **Vue 3 + Vue Router + vue-i18n + SASS**. No se migra a otro framework.
- Se mantiene el pipeline de deploy existente (Docker + Nginx + GitHub Actions al VPS).
- El contenido es real y ya existe: no se inventan proyectos, empleos ni certificaciones.
- Un solo autor y mantenedor: la solución debe ser sostenible por una persona.

---

## 3. Visión

> Un portfolio que se **siente** como una aplicación bien construida: entra con
> intención, responde al cursor, encadena las secciones con ritmo y deja al visitante con
> una impresión concreta — *"quiero que esta persona construya mi interfaz"*.

**Principios de producto:**

1. **La demo es el sitio.** Cada animación es evidencia de competencia técnica, no adorno.
2. **Movimiento con propósito.** Cada transición explica una relación espacial o dirige la
   atención. Si no hace ninguna de las dos cosas, se elimina.
3. **Rápido primero.** La percepción de calidad se destruye con un LCP lento. El movimiento
   no puede costar velocidad.
4. **Accesible sin excepción.** `prefers-reduced-motion` respetado, contraste AA, navegación
   por teclado completa.
5. **Contenido real, siempre.** Nada de placeholders ni proyectos inventados.

---

## 4. Usuarios y recorridos

### 4.1 Personas

**U1 — Reclutador técnico / Hiring manager** *(primario)*
Llega desde LinkedIn, tiene 60–90 segundos. Necesita responder: ¿qué stack maneja?,
¿tiene trabajo real?, ¿cómo contacto? Quiere el CV en PDF.

**U2 — Tech lead / Desarrollador senior evaluando** *(primario)*
Va a mirar el código en GitHub. Le importa la calidad de la ejecución del propio sitio:
performance, semántica, cómo están hechas las animaciones.

**U3 — Cliente potencial de freelance** *(secundario)*
No es técnico. Evalúa por impresión visual y prueba social. Necesita un canal de contacto
inmediato (WhatsApp).

### 4.2 Recorridos críticos

**J1 — Escaneo de 60 segundos (U1)**
`Hero` → percibe nombre, rol y stack en menos de 3 s → scrollea y ve 2–3 proyectos con
resultado visible → llega a experiencia (EXO S.A., Flutter/Vue) → descarga el CV.
*Momento crítico:* el hero debe comunicar rol + stack sin scroll.

**J2 — Evaluación profunda (U2)**
`Hero` → `Proyectos` → abre el detalle de un proyecto → lee problema/stack/rol →
va a GitHub y al sitio en vivo.
*Momento crítico:* la card debe contar algo más que el título; la transición al detalle
debe ser continua, no un corte.

**J3 — Contacto rápido (U3)**
Cualquier sección → CTA de contacto siempre alcanzable → WhatsApp / Email / LinkedIn.
*Momento crítico:* nunca más de un gesto de distancia del contacto.

**J4 — Cambio de idioma (U1/U2 internacional)**
Cualquier vista → toggle ES/EN → **toda** la página cambia, la posición de scroll se
mantiene, la preferencia persiste.

---

## 5. Métricas de éxito

| # | Métrica | Objetivo |
|---|---|---|
| M1 | Lighthouse Performance (mobile) | ≥ 90 |
| M2 | Lighthouse Accessibility | ≥ 95 |
| M3 | LCP (mobile, 4G simulado) | < 2.5 s |
| M4 | CLS | < 0.1 |
| M5 | Cobertura i18n | 100 % de los textos visibles en ES y EN |
| M6 | Contraste | 0 pares por debajo de WCAG 2.1 AA en light y dark |
| M7 | Errores de consola en producción | 0 |
| M8 | Animaciones bajo `prefers-reduced-motion` | 100 % desactivadas o reducidas a fade |

---

## 6. Alcance

### 6.1 Dentro del alcance (MVP del rediseño)

- Rediseño visual completo de las 3 vistas existentes + 1 vista nueva (detalle de proyecto).
- Sistema de diseño tokenizado (color, tipografía, espaciado, radios, sombras, duraciones).
- Sistema de movimiento: transiciones de ruta, scroll-reveal, micro-interacciones.
- Dark mode con tokens, persistencia en `localStorage` y respeto de `prefers-color-scheme`.
- i18n completo ES/EN, con el contenido extraído a archivos de datos.
- Fuente única de verdad para los proyectos (un módulo de datos, no duplicado por vista).
- Sección de contacto real como destino, no solo un footer con íconos.
- Responsive verificado en 390 / 768 / 1280 / 1920.

### 6.2 Fuera del alcance

- Blog o CMS.
- Backend, base de datos o formulario con envío por servidor (el contacto es por enlaces directos).
- Migración de framework, de build tool o de plataforma de hosting.
- Analytics o tracking de terceros.
- Más de dos idiomas.

---

## 7. Requisitos funcionales

### 7.1 Navegación y estructura

- **FR-01** — El sitio expone cuatro rutas: `/` (Home), `/projects` (Proyectos),
  `/projects/:slug` (detalle, **nueva**) y `/about` (Sobre mí).
- **FR-02** — La barra de navegación es persistente, marca la ruta activa con un indicador
  animado que se desplaza entre ítems, y se colapsa en un menú accesible en mobile.
- **FR-03** — En mobile, el menú abre en overlay a pantalla completa con entrada escalonada
  de los ítems y cierre por `Escape`, por tap fuera o por selección.
- **FR-04** — Al navegar entre rutas, la posición de scroll vuelve al tope salvo en
  navegación hacia atrás, donde se restaura la posición previa.

### 7.2 Home

- **FR-05** — El hero presenta, sin necesidad de scroll: nombre (Marcelo Olivera), rol
  (Frontend Developer), una línea de propuesta de valor y el stack principal.
- **FR-06** — El hero ofrece exactamente **una** acción primaria (Ver proyectos) y una
  secundaria (Descargar CV).
- **FR-07** — La entrada del hero es animada: revelado escalonado de los elementos de
  texto y aparición diferenciada del retrato.
- **FR-08** — La Home incluye, en orden: hero → proyectos destacados (máx. 3) → stack /
  habilidades → resumen de trayectoria → contacto.
- **FR-09** — Existe un indicador de scroll en el hero que desaparece al primer desplazamiento.

### 7.3 Proyectos

- **FR-10** — Los datos de proyectos viven en **un único módulo** consumido por todas las
  vistas; cada proyecto tiene: `slug`, título, resumen, descripción del problema, rol,
  stack, imagen, URL en vivo y URL de GitHub.
- **FR-11** — La grilla de proyectos es responsive real (1 columna en mobile, 2 desde
  tablet), sin anchos calculados por índice.
- **FR-12** — Cada card muestra: captura, título, resumen de una línea y los chips del stack.
- **FR-13** — Al hacer hover, la card responde con elevación, zoom contenido de la imagen y
  revelado de las acciones.
- **FR-14** — Al abrir un proyecto, la transición desde la card al detalle es continua
  (la imagen se mantiene como elemento compartido).
- **FR-15** — El detalle de proyecto presenta: imagen grande, problema, solución, rol, stack
  completo y enlaces a sitio en vivo y GitHub.
- **FR-16** — Los enlaces externos abren en pestaña nueva con `rel="noopener noreferrer"`.

Contenido real disponible al momento de este PRD:

| Slug | Proyecto | En vivo | GitHub | Stack |
|---|---|---|---|---|
| `tienda-jedami` | Tienda Jedami — e-commerce con catálogo, carrito y gestión de pedidos | jedamiapp.com | OliveraMarcelo/tienda-jedami | Vue, Node.js |
| `pokemon-game` | Pokemon Game — adivinanza de siluetas con la PokéAPI | pokemon-game-theta-gold.vercel.app | OliveraMarcelo/pokemon-game | TypeScript, Vue |
| `chat-tiempo-real` | Mensajería en tiempo real con WebSockets | — | — | WebSockets, Node.js |

### 7.4 Sobre mí

- **FR-17** — La trayectoria se presenta como una **línea de tiempo** con revelado
  progresivo al scroll, no como una lista de párrafos.
- **FR-18** — Los bloques de contenido son: formación (IFTS N.º 11 — Desarrollo de Software,
  1.º año; Digital House — Full Stack Developer), experiencia (EXO S.A. — Frontend Developer:
  Flutter, Riverpod y Dart para web, mobile y escritorio Windows; Vue.js para dashboards),
  proyectos personales, y perfil personal (autodidacta; guitarra y canto).
- **FR-19** — El certificado de Digital House se muestra como imagen ampliable (lightbox
  accesible, cerrable con `Escape`).
- **FR-20** — El CV en PDF se descarga desde esta vista y desde el hero.

### 7.5 Habilidades

- **FR-21** — Las habilidades se agrupan por categoría: Frontend (HTML, CSS, JavaScript,
  Vue, React, Flutter), Backend (Node.js, Express, SQL/NoSQL) y Herramientas (Git, Docker).
- **FR-22** — Cada ítem entra con animación escalonada al aparecer en viewport y responde
  al hover con una micro-interacción.

### 7.6 Contacto

- **FR-23** — Existe una sección de contacto con los canales reales: WhatsApp
  (+54 11 3432-3271), email (`olivera.m.et13@gmail.com`) y LinkedIn
  (`in/marcelodanielolivera`).
- **FR-24** — Cada canal es un enlace directo, sin formulario intermedio.
- **FR-25** — El contacto es alcanzable desde cualquier punto del sitio en un solo gesto.

### 7.7 Tema e idioma

- **FR-26** — El tema (claro/oscuro) inicia siguiendo `prefers-color-scheme` y puede
  alternarse manualmente.
- **FR-27** — La elección manual de tema persiste en `localStorage` entre sesiones.
- **FR-28** — El cambio de tema es una transición suave de color, no un salto.
- **FR-29** — El idioma alterna entre ES y EN afectando **todos** los textos visibles;
  la preferencia persiste en `localStorage`.
- **FR-30** — El atributo `lang` del documento se actualiza al cambiar de idioma.

---

## 8. Requisitos no funcionales

### 8.1 Performance

- **NFR-01** — LCP < 2.5 s y CLS < 0.1 en mobile con red 4G simulada.
- **NFR-02** — Las animaciones se ejecutan solo sobre `transform` y `opacity`; no se anima
  `width`, `height`, `top` ni `left`.
- **NFR-03** — El sitio mantiene 60 fps durante el scroll en un dispositivo mobile de gama media.
- **NFR-04** — Las imágenes se sirven en formato moderno, con dimensiones declaradas y
  carga diferida fuera del viewport inicial.
- **NFR-05** — Las fuentes se cargan con `font-display: swap` y se precargan las críticas.

### 8.2 Accesibilidad

- **NFR-06** — Cumplimiento de WCAG 2.1 nivel AA en ambos temas.
- **NFR-07** — Toda animación se desactiva o se reduce a un fade bajo `prefers-reduced-motion: reduce`.
- **NFR-08** — Todo elemento interactivo es alcanzable por teclado y tiene `:focus-visible` visible.
- **NFR-09** — Estructura semántica con landmarks (`header`, `nav`, `main`, `footer`) y
  una sola `h1` por vista.
- **NFR-10** — Toda imagen informativa tiene `alt` descriptivo; las decorativas, `alt=""`.
- **NFR-11** — Los objetivos táctiles miden al menos 44×44 px.

### 8.3 Compatibilidad y responsive

- **NFR-12** — Diseño mobile-first con base de 390 px; verificado en 390, 768, 1280 y 1920.
- **NFR-13** — Soporte de las dos últimas versiones estables de Chrome, Firefox, Safari y Edge.
- **NFR-14** — Uso de `svh`/`dvh` para alturas de viewport en mobile.

### 8.4 Mantenibilidad

- **NFR-15** — Todos los valores visuales se definen como tokens CSS/SASS; ningún color ni
  espaciado hardcodeado en los componentes.
- **NFR-16** — Ningún texto visible vive en el template: todo pasa por i18n.
- **NFR-17** — Un componente canónico por elemento (una sola card de proyecto, un solo botón);
  las variantes se resuelven con props o `data-*`, nunca clonando el componente.
- **NFR-18** — El proyecto compila sin advertencias de ESLint.

### 8.5 SEO y compartición

- **NFR-19** — Cada ruta define título y meta description propios.
- **NFR-20** — El sitio incluye Open Graph y Twitter Card con imagen de previsualización.
- **NFR-21** — Se mantiene la funcionalidad PWA existente (manifest y service worker) y el
  favicon actual (`</>`).

---

## 9. Riesgos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | Las animaciones degradan el LCP y hunden el score de performance | Alto | Animar solo `transform`/`opacity`; hero sin dependencia de JS para su primer render |
| R2 | Exceso de movimiento — el sitio se vuelve cansador | Medio | Presupuesto de movimiento: máximo un gesto protagónico por sección |
| R3 | Ampliar el i18n a todo el contenido multiplica el trabajo de mantenimiento | Medio | Extraer el contenido a módulos de datos con claves por idioma, no strings sueltos |
| R4 | Rediseño total en producción con un solo mantenedor | Medio | Trabajar en rama y validar con Lighthouse antes de mergear |
| R5 | Las transiciones de elemento compartido son frágiles entre rutas | Medio | Degradar a fade si la View Transition API no está disponible |

---

## 10. Fases de entrega

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **F1 — Fundaciones** | Tokens, tipografía, dark mode con persistencia, layout base | Tokens aplicados, 0 colores hardcodeados |
| **F2 — Movimiento** | Transiciones de ruta, scroll-reveal, micro-interacciones | 60 fps, `prefers-reduced-motion` respetado |
| **F3 — Contenido** | Módulo único de proyectos, detalle de proyecto, i18n completo | 100 % de cobertura ES/EN |
| **F4 — Pulido** | Accesibilidad, SEO/OG, performance, responsive | Lighthouse ≥ 90/95, 0 errores de consola |

---

## 11. Criterios de aceptación del rediseño

El rediseño se considera terminado cuando:

1. Las cuatro vistas están implementadas con el nuevo sistema visual.
2. La navegación entre rutas es animada y sin cortes secos.
3. Cada sección tiene su gesto de entrada al scroll.
4. El dark mode persiste y respeta la preferencia del sistema.
5. El sitio está 100 % traducido en ES y EN.
6. Lighthouse mobile arroja ≥ 90 en Performance y ≥ 95 en Accessibility.
7. Con `prefers-reduced-motion: reduce`, el sitio es completamente usable y quieto.
8. No hay errores en la consola del navegador en producción.

---

## 12. Documentos relacionados

- `ux-design-specification.md` — sistema de diseño, direcciones visuales, movimiento y componentes
- `ui-prompts/` — prompts de generación para Open Design
- `ui-handoff.md` — entrega de las pantallas generadas
