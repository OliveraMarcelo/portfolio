---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/ui-handoff.md
  - _bmad-output/planning-artifacts/ui-prompts/{home,proyectos,proyecto-detalle,sobre-mi}.md
  - src/ (código Vue actual)
  - public/ui-generated/_system/ (design system verificado)
workflowType: 'epics-and-stories'
project_name: 'portfolio'
user_name: 'Marcelo'
date: '2026-08-16'
status: 'complete'
---

# MarceCode Portfolio — Desglose de Épicas

## Overview

Este documento descompone en épicas e historias implementables el rediseño de marcecode.com,
tomando los requisitos del PRD, las decisiones del documento de arquitectura y el sistema de
movimiento y componentes de la especificación UX.

El proyecto es un **rediseño de un sitio en producción**, no un desarrollo nuevo. Eso ordena
las épicas de una forma particular: la primera entrega la fundación visual **junto con** valor
para el visitante (identidad nueva y preferencias que se recuerdan), y cada épica siguiente
suma una capacidad completa sin depender de las que vienen después.

**Una nota sobre el bilingüismo.** El PRD ubica la cobertura i18n en su fase F3, pero la
infraestructura de idioma vive en la Épica 1. El motivo es NFR-16: si las Épicas 2 a 6
escribieran texto literal en los templates para traducirlo más tarde, cada pantalla habría que
rehacerla. Cada épica entrega sus propias claves en ES y EN, y la Épica 7 verifica que la
cobertura sea total.

## Requirements Inventory

### Functional Requirements

**Navegación y estructura**

- **FR-01** — El sitio expone cuatro rutas: `/` (Home), `/projects` (Proyectos), `/projects/:slug` (detalle, nueva) y `/about` (Sobre mí).
- **FR-02** — La barra de navegación es persistente, marca la ruta activa con un indicador animado que se desplaza entre ítems, y se colapsa en un menú accesible en mobile.
- **FR-03** — En mobile, el menú abre en overlay a pantalla completa con entrada escalonada de los ítems y cierre por `Escape`, por tap fuera o por selección.
- **FR-04** — Al navegar entre rutas, la posición de scroll vuelve al tope salvo en navegación hacia atrás, donde se restaura la posición previa.

**Home**

- **FR-05** — El hero presenta, sin necesidad de scroll: nombre, rol, una línea de propuesta de valor y el stack principal.
- **FR-06** — El hero ofrece exactamente una acción primaria (Ver proyectos) y una secundaria (Descargar CV).
- **FR-07** — La entrada del hero es animada: revelado escalonado del texto y aparición diferenciada del retrato.
- **FR-08** — La Home incluye, en orden: hero → proyectos destacados (máx. 3) → stack / habilidades → resumen de trayectoria → contacto.
- **FR-09** — Existe un indicador de scroll en el hero que desaparece al primer desplazamiento.

**Proyectos**

- **FR-10** — Los datos de proyectos viven en un único módulo consumido por todas las vistas; cada proyecto tiene `slug`, título, resumen, problema, rol, stack, imagen, URL en vivo y URL de GitHub.
- **FR-11** — La grilla de proyectos es responsive real (1 columna en mobile, 2 desde tablet), sin anchos calculados por índice.
- **FR-12** — Cada card muestra captura, título, resumen de una línea y los chips del stack.
- **FR-13** — Al hacer hover, la card responde con elevación, zoom contenido de la imagen y revelado de las acciones.
- **FR-14** — Al abrir un proyecto, la transición desde la card al detalle es continua (la imagen se mantiene como elemento compartido).
- **FR-15** — El detalle de proyecto presenta imagen grande, problema, solución, rol, stack completo y enlaces a sitio en vivo y GitHub.
- **FR-16** — Los enlaces externos abren en pestaña nueva con `rel="noopener noreferrer"`.

**Sobre mí**

- **FR-17** — La trayectoria se presenta como una línea de tiempo con revelado progresivo al scroll.
- **FR-18** — Los bloques de contenido son formación, experiencia, proyectos personales y perfil personal.
- **FR-19** — El certificado de Digital House se muestra como imagen ampliable (lightbox accesible, cerrable con `Escape`).
- **FR-20** — El CV en PDF se descarga desde esta vista y desde el hero.

**Habilidades**

- **FR-21** — Las habilidades se agrupan por categoría: Frontend, Backend y Herramientas.
- **FR-22** — Cada ítem entra con animación escalonada al aparecer en viewport y responde al hover con una micro-interacción.

**Contacto**

- **FR-23** — Existe una sección de contacto con los canales reales: WhatsApp, email y LinkedIn.
- **FR-24** — Cada canal es un enlace directo, sin formulario intermedio.
- **FR-25** — El contacto es alcanzable desde cualquier punto del sitio en un solo gesto.

**Tema e idioma**

- **FR-26** — El tema inicia siguiendo `prefers-color-scheme` y puede alternarse manualmente.
- **FR-27** — La elección manual de tema persiste en `localStorage` entre sesiones.
- **FR-28** — El cambio de tema es una transición suave de color, no un salto.
- **FR-29** — El idioma alterna entre ES y EN afectando todos los textos visibles; la preferencia persiste.
- **FR-30** — El atributo `lang` del documento se actualiza al cambiar de idioma.

### NonFunctional Requirements

- **NFR-01** — LCP < 2.5 s y CLS < 0.1 en mobile con red 4G simulada.
- **NFR-02** — Las animaciones se ejecutan solo sobre `transform` y `opacity`.
- **NFR-03** — 60 fps durante el scroll en un dispositivo mobile de gama media.
- **NFR-04** — Imágenes en formato moderno, con dimensiones declaradas y carga diferida fuera del viewport inicial.
- **NFR-05** — Fuentes con `font-display: swap`; se precargan las críticas.
- **NFR-06** — WCAG 2.1 nivel AA en ambos temas.
- **NFR-07** — Toda animación se desactiva o se reduce a un fade bajo `prefers-reduced-motion: reduce`.
- **NFR-08** — Todo elemento interactivo es alcanzable por teclado y tiene `:focus-visible` visible.
- **NFR-09** — Estructura semántica con landmarks y una sola `h1` por vista.
- **NFR-10** — Toda imagen informativa tiene `alt` descriptivo; las decorativas, `alt=""`.
- **NFR-11** — Los objetivos táctiles miden al menos 44×44 px.
- **NFR-12** — Mobile-first con base de 390 px; verificado en 390, 768, 1280 y 1920.
- **NFR-13** — Dos últimas versiones estables de Chrome, Firefox, Safari y Edge.
- **NFR-14** — `svh`/`dvh` para alturas de viewport en mobile.
- **NFR-15** — Todos los valores visuales como tokens; ningún color ni espaciado hardcodeado.
- **NFR-16** — Ningún texto visible vive en el template: todo pasa por i18n.
- **NFR-17** — Un componente canónico por elemento; las variantes se resuelven con props o `data-*`.
- **NFR-18** — El proyecto compila sin advertencias de ESLint.
- **NFR-19** — Cada ruta define título y meta description propios.
- **NFR-20** — Open Graph y Twitter Card con imagen de previsualización.
- **NFR-21** — Se mantiene la funcionalidad PWA existente y el favicon actual.

### Additional Requirements

**Desde el documento de arquitectura:**

- No hay starter template. La primera historia fija la línea base de versiones verificada contra npm: `vue@3.5.41`, `vue-router@4.6.4`, `vue-i18n@11.4.8`, `sass@1.102.0`, `@vue/cli-service@5.0.9`. ESLint se mantiene en 7.
- Se rechaza `vue-router@5`: su valor depende de la integración con Vite, y el PRD prohíbe migrar el build tool.
- Se eliminan tres dependencias: `pdfjs-dist`, `@fortawesome/fontawesome-free` y `font-awesome-icons`.
- **D1** — Los tokens son custom properties CSS, no variables SASS. `src/styles/sass/variables/` se elimina.
- **D2** — `data-theme` y `lang` se estampan en `<html>` desde un script inline y bloqueante, antes del primer pintado. Claves de `localStorage`: `mc-theme` y `mc-lang`.
- **D3** — Estado global por composables singleton (`useTheme`, `useLocale`). Sin Pinia. `src/stores/langStore.js` se elimina.
- **D4** — `src/content/` es la fuente única de contenido, con los textos traducibles bajo la clave `i18n` de cada dato.
- **D5** — `/projects/:slug` resuelve el proyecto en `beforeEnter` y redirige a `/projects` si el slug no existe.
- **D6** — Transiciones de ruta con View Transitions API en `router.beforeResolve`, degradando a `<Transition>`.
- **D7** — Un único `IntersectionObserver` compartido, expuesto como directiva `v-reveal`.
- **D8** — Fuentes self-hosted en woff2. Se elimina el `<link>` a `fonts.googleapis.com`.
- **D9** — Íconos como sprite SVG inline.
- **D10** — Imágenes en WebP con `width`/`height` explícitos.
- **D11** — Metadatos SEO por ruta vía `route.meta` + guard `afterEach`.
- **D12** — El service worker avisa al usuario cuando hay versión nueva; `nginx.conf` sirve `index.html` y `service-worker.js` con `no-cache`.
- **D13** — `src/locales/{es,en}.json` para textos de interfaz; el contenido va en `src/content/`.
- **D14** — Cero orígenes de terceros en runtime.
- El design system de `public/ui-generated/_system/` es normativo: nombres de clase, tokens y markup del chasis se portan sin reinterpretar.

**Desde la especificación UX:**

- Catálogo de animaciones A1–A9, con presupuesto de un gesto protagónico por sección y ninguna entrada por encima de 900 ms.
- Quince componentes canónicos; `MainTitle`, `SubTitle`, `SectionTitle` y `ProjectTitle` colapsan en `SectionHeading`.
- Bajo movimiento reducido, todo elemento animado queda en su estado final visible.

**Brechas de contenido registradas en la validación de arquitectura:**

- No existe captura del proyecto de mensajería en tiempo real. Bloquea FR-12 y FR-15 para ese proyecto.
- Ese mismo proyecto no tiene URL en vivo ni repositorio público. Las vistas deben renderizar correctamente el caso sin ningún enlace externo.

### FR Coverage Map

| FR | Épica | Cubierto por |
|---|---|---|
| FR-01 | 2 | Historia 2.1 — rutas y metadatos (la ruta `/projects/:slug` se suma en 4.5) |
| FR-02 | 2 | Historia 2.2 — indicador animado de ruta activa |
| FR-03 | 2 | Historia 2.4 — menú mobile en overlay |
| FR-04 | 2 | Historia 2.5 — posición de scroll al navegar |
| FR-05 | 3 | Historia 3.1 — hero con nombre, rol, propuesta y stack |
| FR-06 | 3 | Historia 3.2 — acción primaria y secundaria |
| FR-07 | 3 | Historia 3.3 — entrada animada del hero (A1) |
| FR-08 | 4 | Historia 4.7 — destacados en la Home (el orden completo cierra en 6.3) |
| FR-09 | 3 | Historia 3.4 — indicador de scroll |
| FR-10 | 4 | Historia 4.1 — módulo único de contenido de proyectos |
| FR-11 | 4 | Historia 4.3 — grilla responsive |
| FR-12 | 4 | Historia 4.2 — card canónica de proyecto |
| FR-13 | 4 | Historia 4.4 — respuesta de la card al hover |
| FR-14 | 4 | Historia 4.6 — transición continua card → detalle |
| FR-15 | 4 | Historia 4.5 — vista de detalle de proyecto |
| FR-16 | 4 | Historias 4.2 y 4.5 — enlaces externos seguros |
| FR-17 | 5 | Historia 5.2 — línea de tiempo con revelado progresivo |
| FR-18 | 5 | Historias 5.1 y 5.2 — contenido de la trayectoria |
| FR-19 | 5 | Historia 5.3 — certificado ampliable en lightbox |
| FR-20 | 3 | Historia 3.2 — descarga del CV (repetida en 5.5 para Sobre mí) |
| FR-21 | 5 | Historia 5.4 — habilidades agrupadas por categoría |
| FR-22 | 5 | Historia 5.4 — entrada escalonada y micro-interacción |
| FR-23 | 6 | Historia 6.2 — sección de contacto |
| FR-24 | 6 | Historia 6.2 — enlaces directos sin formulario |
| FR-25 | 6 | Historia 6.3 — contacto alcanzable desde cualquier vista |
| FR-26 | 1 | Historia 1.6 — tema que respeta el sistema |
| FR-27 | 1 | Historia 1.6 — persistencia en `localStorage` |
| FR-28 | 1 | Historia 1.6 — transición suave de color |
| FR-29 | 1 y 7 | Historia 1.7 entrega la infraestructura; la 7.4 verifica la cobertura total |
| FR-30 | 1 | Historia 1.7 — atributo `lang` del documento |

Los 30 FRs están cubiertos. Ninguno queda sin épica.

## Epic List

### Épica 1: Fundación — identidad visual y preferencias del visitante

El visitante ve el sitio con la identidad nueva, y sus preferencias de tema e idioma se
respetan desde el primer pintado y se recuerdan entre visitas.
**FRs cubiertos:** FR-26, FR-27, FR-28, FR-29, FR-30

### Épica 2: Navegación fluida entre secciones

El visitante se mueve entre las secciones del sitio sin cortes secos, sabiendo siempre dónde
está, tanto en escritorio como en mobile.
**FRs cubiertos:** FR-01, FR-02, FR-03, FR-04

### Épica 3: Un hero que comunica en tres segundos

Quien llega entiende quién es Marcelo, qué hace y con qué stack, sin scrollear, y tiene una
acción clara para seguir.
**FRs cubiertos:** FR-05, FR-06, FR-07, FR-09, FR-20

### Épica 4: Proyectos que cuentan lo que resolvieron

El visitante evalúa el trabajo real: qué problema resolvió cada proyecto, con qué stack, en qué
rol, y llega al código o a la demo.
**FRs cubiertos:** FR-08, FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16

### Épica 5: Trayectoria y habilidades legibles de un vistazo

El visitante reconstruye la trayectoria de Marcelo y su dominio técnico sin leer párrafos densos.
**FRs cubiertos:** FR-17, FR-18, FR-19, FR-21, FR-22

### Épica 6: Contacto a un solo gesto

Desde cualquier punto del sitio, quien quiera escribir puede hacerlo sin buscar.
**FRs cubiertos:** FR-23, FR-24, FR-25

### Épica 7: Rápido, accesible y compartible

El sitio cumple sus propias promesas: carga rápido, funciona con teclado y con movimiento
reducido, se ve bien compartido, y no deja a nadie con la versión vieja.
**FRs cubiertos:** verificación de FR-29 · **NFRs:** los 21

---

## Epic 1: Fundación — identidad visual y preferencias del visitante

Entrega la base sobre la que se construye todo el rediseño —tokens, tipografía, íconos y
chasis— y con ella el primer valor tangible para el visitante: un sitio con identidad propia
que recuerda cómo quiere verlo y en qué idioma quiere leerlo.

Es la única épica que un agente no puede saltear: ninguna historia posterior puede escribir un
estilo antes de que existan los tokens.

### Story 1.1: Línea base de dependencias

As a mantenedor del portfolio,
I want el proyecto corriendo sobre versiones actuales y sin dependencias muertas,
So that el rediseño se construya sobre una base que no arrastre peso ni conflictos de versión.

**Acceptance Criteria:**

**Given** el proyecto con `vue@3.4.21`, `vue-router@4.3.0` y `vue-i18n@9.14.5` instalados
**When** se actualizan a `vue@3.5.41`, `vue-router@4.6.4` y `vue-i18n@11.4.8`
**Then** `npm run build` termina sin errores
**And** `npm install` no reporta ningún conflicto de peer dependency
**And** `vue-router` queda en la línea 4.x, no en la 5.x

**Given** las dependencias `pdfjs-dist`, `@fortawesome/fontawesome-free` y `font-awesome-icons`
**When** se desinstalan y se elimina `src/components/stories/PdfViewer.vue` junto con el import de Font Awesome en `src/main.js`
**Then** el proyecto compila
**And** ninguna petición de red apunta a `cdnjs.cloudflare.com`

**Given** el sitio corriendo con el build de producción
**When** se abre la consola del navegador
**Then** no aparece ningún error
**And** los `console.log` de `registerServiceWorker.js` quedan condicionados a `process.env.NODE_ENV !== 'production'`

### Story 1.2: Tokens del sistema de diseño en runtime

As a visitante,
I want que el sitio tenga una paleta, una tipografía y un ritmo espacial coherentes,
So that perciba una identidad propia en lugar de una plantilla genérica.

**Acceptance Criteria:**

**Given** el archivo verificado `public/ui-generated/_system/tokens.css`
**When** se porta a `src/styles/tokens.css` y se importa desde `src/main.js` antes que cualquier otro estilo
**Then** los tokens de color, tipografía, espaciado, radio, sombra, duración y curva quedan definidos en `:root`, en `[data-theme="dark"]` y en `[data-theme="light"]`
**And** ningún valor difiere del archivo original

**Given** los parciales `src/styles/sass/variables/_colors.scss`, `_fonts.scss` y `_sizes.scss`
**When** se eliminan junto con el bloque `body.dark-mode` de `main.scss` y su cascada de `!important`
**Then** el proyecto compila sin referencias a variables SASS inexistentes
**And** `grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\(" src/ --include=*.vue` no devuelve resultados

**Given** los estilos base del sistema (reset, `.container`, `.skip-link`, foco visible, grano)
**When** se portan a `src/styles/base.scss`
**Then** el bloque `@media (prefers-reduced-motion: reduce)` queda presente y global

### Story 1.3: Tipografía propia, sin orígenes externos

As a visitante con una conexión lenta,
I want que las fuentes lleguen del mismo servidor que la página,
So that el texto aparezca rápido y sin depender de un tercero.

**Acceptance Criteria:**

**Given** las familias Space Grotesk, Inter y JetBrains Mono
**When** se descargan en woff2 a `src/assets/fonts/` y se declaran en `src/styles/fonts.scss`
**Then** cada `@font-face` incluye `font-display: swap` (NFR-05)
**And** los cortes usados por el hero se declaran con `<link rel="preload" as="font" crossorigin>` en `public/index.html`

**Given** el `<link>` a `https://fonts.googleapis.com` que hoy carga Poppins
**When** se elimina de `public/index.html`
**Then** la pestaña de red del navegador no muestra ninguna petición a un host distinto del propio

**Given** el sitio cargado
**When** se inspecciona el `font-family` computado del título del hero y del cuerpo de texto
**Then** resuelve a Space Grotesk y a Inter respectivamente, no a la fuente de respaldo del sistema

### Story 1.4: Íconos como sprite SVG

As a visitante,
I want que los íconos acompañen el color del tema,
So that el sitio se vea coherente tanto en claro como en oscuro.

**Acceptance Criteria:**

**Given** el sprite verificado en `public/ui-generated/_system/sprite.html`
**When** se porta a `src/components/layout/AppSprite.vue` y se monta una sola vez en `App.vue`
**Then** los `<symbol>` quedan disponibles en el documento
**And** el contenedor del sprite no ocupa espacio visible

**Given** un componente `src/components/ui/AppIcon.vue` que recibe el nombre del ícono
**When** renderiza `<svg class="ico"><use :href="'#i-' + name"/></svg>`
**Then** el ícono hereda el color de su contenedor vía `currentColor`
**And** al alternar el tema, el ícono cambia de color sin recargar

### Story 1.5: Chasis persistente — header y pie de página

As a visitante,
I want un encabezado y un pie presentes en todas las vistas,
So that tenga siempre a mano la navegación y los datos de contacto.

**Acceptance Criteria:**

**Given** el markup del chasis verificado en `public/ui-generated/_system/chasis.html`
**When** se construyen `src/components/layout/AppNav.vue` y `AppFooter.vue` y se montan en `App.vue`
**Then** el header presenta logo, los tres enlaces de navegación y el área de acciones
**And** las clases usadas son las canónicas del sistema: `.site-header`, `.header-inner`, `.logo`, `.nav`, `.nav-list`, `.nav-link`, `.header-actions`, `.site-footer`, `.footer-inner`
**And** `NavBar.vue` y `FooterPage.vue` quedan eliminados

**Given** la estructura de `App.vue`
**When** se inspecciona el documento
**Then** existe un `<header>`, un `<main>` y un `<footer>` como landmarks
**And** el `.skip-link` es el primer elemento enfocable y lleva al contenido principal

**Given** cualquiera de las tres vistas
**When** se comparan las medidas computadas del header
**Then** la altura y la posición del logo son idénticas en todas

### Story 1.6: Tema oscuro y claro que se recuerda

As a visitante que prefiere el modo claro,
I want que el sitio se abra como yo lo quiero y lo recuerde la próxima vez,
So that no tenga que corregirlo en cada visita.

**Acceptance Criteria:**

**Given** un visitante nuevo cuyo sistema declara `prefers-color-scheme: light`
**When** carga cualquier vista del sitio
**Then** el documento se pinta en tema claro desde el primer fotograma
**And** no se percibe ningún destello de tema oscuro (FR-26)

**Given** el script inline y bloqueante en `public/index.html`, ubicado antes de toda hoja de estilo
**When** se ejecuta
**Then** lee `mc-theme` de `localStorage`, y si no existe consulta `prefers-color-scheme`
**And** estampa el resultado como `data-theme` sobre `document.documentElement`, nunca sobre `<body>`

**Given** el composable `src/composables/useTheme.js` y el componente `ThemeToggle.vue`
**When** el visitante alterna el tema
**Then** el atributo `data-theme` cambia y el valor se guarda en `localStorage` bajo la clave `mc-theme` (FR-27)
**And** el ícono del botón rota 180° mientras los colores cruzan (A7)
**And** los colores transicionan de forma suave, sin salto (FR-28)

**Given** el visitante que ya eligió tema manualmente
**When** recarga la página o vuelve en otra sesión
**Then** se respeta su elección aunque contradiga la preferencia del sistema

**Given** los tres estados posibles — sin atributo, `data-theme="dark"` y `data-theme="light"`
**When** se inspecciona el valor computado de `--color-bg` en cada uno
**Then** los tres devuelven exactamente el token correspondiente y ninguno queda sin resolver

### Story 1.7: Idioma que se recuerda y cambia toda la interfaz

As a visitante internacional,
I want leer el sitio en inglés y que lo recuerde,
So that no tenga que cambiar el idioma en cada página.

**Acceptance Criteria:**

**Given** los archivos `src/locales/es.json` y `src/locales/en.json` con las claves de interfaz del chasis
**When** se cargan desde un `src/i18n.js` reducido a la creación de la instancia
**Then** todo texto del header y del pie se resuelve por i18n
**And** ningún texto visible del chasis queda literal en el template (NFR-16)

**Given** el composable `src/composables/useLocale.js` y el componente `LangToggle.vue`
**When** el visitante alterna entre ES y EN
**Then** los textos del chasis cambian de idioma
**And** el valor se guarda en `localStorage` bajo la clave `mc-lang` (FR-29)
**And** el atributo `lang` de `<html>` se actualiza al nuevo idioma (FR-30)
**And** la posición de scroll se mantiene

**Given** el script inline de la historia 1.6
**When** se ejecuta al cargar
**Then** también lee `mc-lang` y estampa `lang` sobre `document.documentElement` antes del primer pintado
**And** usa exactamente las mismas claves que el composable

**Given** el archivo `src/stores/langStore.js`, que hoy invoca `useI18n()` fuera de un contexto de `setup()`
**When** se elimina junto con la carpeta `src/stores/`
**Then** ninguna importación del proyecto lo referencia

**Given** los dos archivos de locale
**When** se comparan sus conjuntos de claves
**Then** son idénticos: ninguna clave existe en uno y falta en el otro

---

## Epic 2: Navegación fluida entre secciones

El visitante se mueve por el sitio sin cortes: sabe en qué sección está, el cambio de vista es
continuo, y en mobile el menú abre y cierra como espera. Al terminar esta épica el sitio ya se
comporta como una aplicación, aunque el contenido de cada vista siga siendo el anterior.

### Story 2.1: Rutas con título y descripción propios

As a visitante que llega desde un buscador o comparte un enlace,
I want que cada sección tenga su propio título,
So that el enlace signifique algo fuera del sitio.

**Acceptance Criteria:**

**Given** el router con las rutas `/`, `/projects` y `/about`
**When** cada una declara `meta: { titleKey, descriptionKey }`
**Then** un guard `router.afterEach` traduce esas claves y actualiza `document.title` y la meta description (NFR-19)

**Given** el visitante navegando entre secciones
**When** cambia de ruta
**Then** el título de la pestaña del navegador cambia en consecuencia

**Given** el visitante que alterna el idioma
**When** el idioma cambia
**Then** el título del documento se retraduce sin necesidad de navegar

### Story 2.2: Indicador animado de la ruta activa

As a visitante,
I want ver con claridad en qué sección estoy,
So that no me pierda dentro del sitio.

**Acceptance Criteria:**

**Given** la barra de navegación en escritorio
**When** el visitante está en una ruta
**Then** el enlace correspondiente lleva `.is-active` y `aria-current="page"`
**And** una barra en color de acento se ubica bajo ese enlace

**Given** el visitante que navega a otra sección
**When** la ruta cambia
**Then** el indicador se desplaza y ajusta su ancho hasta el nuevo enlace, animando `transform` en `--dur-base` con `--ease-out` (A3, FR-02)

**Given** el visitante que pasa el cursor sobre otro enlace
**When** hace hover
**Then** el indicador se adelanta a ese enlace y vuelve al activo al salir

**Given** el visitante que alterna el idioma
**When** las etiquetas cambian de ancho
**Then** el indicador recalcula su posición y queda alineado con el enlace activo

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** navega entre secciones
**Then** el indicador aparece directamente en su posición final, sin desplazamiento animado

### Story 2.3: Encabezado que reacciona al scroll

As a visitante,
I want que el encabezado no me tape el contenido mientras leo,
So that pueda concentrarme en la página sin perder la navegación.

**Acceptance Criteria:**

**Given** el visitante en el tope de la página
**When** la posición de scroll es menor a 80 px
**Then** el header es transparente y mantiene su altura completa

**Given** el visitante que scrollea más allá de 80 px
**When** se supera ese umbral
**Then** el header recibe `.is-scrolled`, adopta fondo de superficie con `backdrop-filter: blur(12px)` y reduce su altura, en `--dur-base` (A4)

**Given** el visitante que vuelve al tope
**When** el scroll baja de 80 px
**Then** el header recupera su estado transparente

### Story 2.4: Menú mobile en overlay

As a visitante desde el teléfono,
I want abrir la navegación y llegar a cualquier sección,
So that el sitio me sirva igual que en la computadora.

**Acceptance Criteria:**

**Given** un viewport de 390 px
**When** el visitante toca el botón de menú
**Then** el panel abre con `.is-open`, el velo aparece con `.is-visible`, y los ítems entran de forma escalonada (FR-03)
**And** el botón declara `aria-expanded="true"`

**Given** el menú abierto
**When** el visitante toca cualquiera de los enlaces
**Then** la navegación ocurre y el menú se cierra

**Given** el menú abierto
**When** el visitante presiona `Escape` o toca fuera del panel
**Then** el menú se cierra y el foco vuelve al botón que lo abrió

**Given** el menú abierto en cualquiera de las vistas
**When** se consulta con `elementFromPoint` qué elemento recibe el clic sobre un enlace del panel
**Then** el elemento devuelto es el enlace, no el velo
**And** las capas respetan el orden `velo 90 < header 100 < panel 105`

**Given** el menú abierto
**When** se intenta recorrer con `Tab`
**Then** el foco queda contenido dentro del panel mientras está abierto

**Given** las cuatro vistas del sitio
**When** se repite la verificación de apertura, clic y cierre en cada una
**Then** el comportamiento es idéntico en todas

### Story 2.5: Posición de scroll coherente al navegar

As a visitante que vuelve atrás,
I want retomar la lista donde la había dejado,
So that no tenga que buscar de nuevo dónde estaba.

**Acceptance Criteria:**

**Given** el visitante que navega a una sección nueva
**When** la ruta cambia
**Then** la vista aparece desde el tope de la página (FR-04)

**Given** el visitante que scrolleó dentro de una sección y navegó a otra
**When** usa el botón de retroceso del navegador
**Then** la posición de scroll previa se restaura

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** el scroll se reposiciona
**Then** el salto es inmediato, sin desplazamiento suave

### Story 2.6: Transición animada entre vistas

As a visitante,
I want que el cambio de sección se sienta continuo,
So that el sitio se perciba como una aplicación y no como páginas sueltas.

**Acceptance Criteria:**

**Given** un navegador con soporte de la View Transitions API
**When** el visitante navega entre secciones
**Then** un guard `router.beforeResolve` envuelve la navegación en `document.startViewTransition`
**And** el guard se ubica en `beforeResolve` y no en `beforeEach`, de modo que el componente destino ya esté resuelto cuando se captura el fotograma

**Given** un navegador sin soporte de la API
**When** el visitante navega
**Then** la navegación ocurre normalmente
**And** un `<Transition>` alrededor de `<router-view>` produce la salida en `opacity → 0` con `translateY(-12px)` en 200 ms y la entrada en `--dur-base` con `--ease-in-out` (A6)

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** navega entre secciones
**Then** no se ejecuta ninguna transición y la vista aparece directamente (NFR-07)

**Given** cualquiera de los dos caminos — con la API o sin ella
**When** se recorre el sitio completo
**Then** la navegación funciona en ambos y ninguna vista queda en blanco

### Story 2.7: Revelado de contenido al scroll

As a visitante,
I want que las secciones aparezcan a medida que llego a ellas,
So that la lectura tenga ritmo en lugar de ser un muro de contenido.

**Acceptance Criteria:**

**Given** la directiva `src/directives/reveal.js`
**When** se registra globalmente
**Then** existe un único `IntersectionObserver` de módulo para todo el sitio, no uno por componente (NFR-03)

**Given** un elemento con `v-reveal`
**When** entra en el viewport superando el umbral del 15 %
**Then** recibe la clase `.is-visible` y pasa de `opacity: 0` y `translateY(24px)` a su estado final en `--dur-slow` con `--ease-out` (A2)
**And** el observer deja de observarlo: la animación ocurre una sola vez

**Given** un elemento con `v-reveal="{ delay: 70 }"` dentro de una grilla
**When** el grupo entra en viewport
**Then** los hermanos entran escalonados según ese retardo

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga cualquier vista
**Then** todos los elementos con `v-reveal` son visibles y legibles desde el inicio, sin depender de que ninguna animación se ejecute (NFR-07)

**Given** las clases `.reveal`, `.is-visible`, `.mask` y `.mask-in`
**When** se portan a `src/styles/animations.scss`
**Then** ninguna de ellas declara la propiedad `display`

---

## Epic 3: Un hero que comunica en tres segundos

Es la pantalla tesis del rediseño y el momento crítico del recorrido J1: un reclutador con 90
segundos tiene que saber quién es Marcelo, qué hace y con qué stack antes de scrollear.

### Story 3.1: Hero con nombre, rol, propuesta y stack

As a reclutador técnico con poco tiempo,
I want entender de inmediato quién es esta persona y qué maneja,
So that pueda decidir en segundos si sigo leyendo.

**Acceptance Criteria:**

**Given** un viewport de 390 px de ancho
**When** se carga la Home sin scrollear
**Then** son visibles el nombre "Marcelo Olivera", el rol "Frontend Developer", una línea de propuesta de valor y los chips del stack principal (FR-05)

**Given** el componente `src/components/sections/HeroSection.vue`
**When** se inspecciona su markup
**Then** el nombre es la única `h1` de la vista (NFR-09)
**And** los chips usan las clases canónicas `.chips` y `.chip`
**And** todos los textos se resuelven por i18n en ES y en EN

**Given** el retrato del hero
**When** se inspecciona la etiqueta `<img>`
**Then** declara `width` y `height` explícitos, `fetchpriority="high"` y no lleva `loading="lazy"` (NFR-04)
**And** tiene un `alt` descriptivo (NFR-10)

**Given** la altura del hero en mobile
**When** se inspecciona su CSS
**Then** usa `svh` o `dvh`, no `vh` (NFR-14)

### Story 3.2: Acción primaria y descarga del CV

As a reclutador,
I want un camino evidente para seguir y llevarme el CV,
So that no tenga que buscar cómo avanzar.

**Acceptance Criteria:**

**Given** el hero
**When** se inspeccionan sus llamadas a la acción
**Then** hay exactamente una acción primaria ("Ver proyectos") y una secundaria ("Descargar CV") (FR-06)
**And** usan el componente canónico `AppButton` con las variantes `.btn-primary` y `.btn-ghost`

**Given** el visitante que toca la acción primaria
**When** se activa
**Then** navega a `/projects`

**Given** el visitante que toca "Descargar CV"
**When** se activa
**Then** se descarga el PDF del CV desde `public/` (FR-20)
**And** el composable responsable es `src/composables/useDownloadPdf.js`, migrado desde el actual `.vue`

**Given** ambos botones
**When** se miden sus áreas táctiles
**Then** ninguna es menor a 44×44 px (NFR-11)
**And** ambos son alcanzables por teclado con foco visible (NFR-08)

**Given** el visitante que presiona un botón
**When** ocurre el `:active`
**Then** el botón responde con `scale(0.97)` en `--dur-instant` (A7)

### Story 3.3: Entrada animada del hero

As a visitante,
I want que la primera impresión tenga movimiento,
So that perciba de entrada que quien hizo el sitio sabe construir interfaces.

**Acceptance Criteria:**

**Given** la Home recién cargada
**When** se ejecuta la entrada
**Then** las líneas del título se revelan por máscara desde abajo, escalonadas cada 70 ms (A1, FR-07)
**And** el retrato aparece con fade y escala de `1.04 → 1`
**And** la duración total no supera los 900 ms

**Given** las animaciones del hero
**When** se inspeccionan las propiedades animadas
**Then** solo se animan `transform` y `opacity` (NFR-02)

**Given** el contenedor de máscara
**When** se inspecciona su CSS
**Then** `.mask` aporta `overflow: hidden` y `.mask-in` no declara `display`, de modo que no pise el `display: flex` de `.chips`

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga la Home
**Then** todo el contenido del hero es legible de inmediato, en su estado final (NFR-07)

**Given** el primer render de la página
**When** se mide el LCP
**Then** el contenido del hero no depende de que JavaScript se ejecute para ser visible (R1)

### Story 3.4: Indicador de scroll

As a visitante,
I want saber que hay más contenido abajo,
So that no me quede solo con la primera pantalla.

**Acceptance Criteria:**

**Given** la Home cargada sin scrollear
**When** termina la entrada del hero
**Then** aparece un indicador de scroll al pie del hero (FR-09)

**Given** el visitante que scrollea por primera vez
**When** la página se desplaza
**Then** el indicador desaparece con una transición de opacidad y no vuelve a aparecer

**Given** el indicador
**When** se inspecciona su markup
**Then** es decorativo y queda oculto para los lectores de pantalla

---

## Epic 4: Proyectos que cuentan lo que resolvieron

El momento crítico del recorrido J2. Hoy las cards muestran una captura y dos botones; después
de esta épica cuentan el problema resuelto, el stack y el rol, y la transición al detalle es
continua.

Esta épica resuelve además la duplicación de datos entre `HomeView` y `ProjectsView` que el PRD
señala en §2.1.

### Story 4.1: Módulo único de contenido de proyectos

As a mantenedor,
I want definir cada proyecto en un solo lugar,
So that agregar uno nuevo no me obligue a tocar tres vistas y olvidarme del inglés.

**Acceptance Criteria:**

**Given** el módulo `src/content/projects.js`
**When** se define
**Then** exporta un array ordenado donde cada proyecto tiene `slug`, `featured`, `stack`, `image`, `liveUrl`, `repoUrl` y una clave `i18n` con `title`, `summary`, `problem`, `solution` y `role` en ES y EN (FR-10)
**And** exporta una función `bySlug(slug)` que devuelve el proyecto o `null`

**Given** los tres proyectos reales del PRD
**When** se cargan en el módulo
**Then** están `tienda-jedami`, `pokemon-game` y `chat-tiempo-real`, con contenido real y sin inventar ninguno

**Given** el proyecto de mensajería en tiempo real, que no tiene sitio en vivo ni repositorio público
**When** se define
**Then** declara `liveUrl: null` y `repoUrl: null` de forma explícita, nunca cadena vacía ni `undefined`

**Given** las vistas `HomeView.vue` y `ProjectsView.vue`
**When** se revisan sus datos
**Then** ninguna define su propia lista de proyectos: ambas consumen el módulo

### Story 4.2: Card canónica de proyecto

As a visitante,
I want que cada card me diga qué es el proyecto y con qué está hecho,
So that pueda elegir cuál mirar en detalle.

**Acceptance Criteria:**

**Given** el componente `src/components/sections/ProjectCard.vue`
**When** recibe un proyecto por props
**Then** muestra la captura, el título, el resumen de una línea y los chips del stack (FR-12)
**And** el título es un enlace a la ruta de detalle usando la clase `.card-title-link`

**Given** la imagen de la card
**When** se inspecciona
**Then** declara `width` y `height`, lleva `loading="lazy"` y `decoding="async"`, y tiene `alt` descriptivo

**Given** un proyecto con `liveUrl` o `repoUrl` en `null`
**When** se renderiza la card
**Then** el botón correspondiente no se muestra y el resto del layout permanece intacto

**Given** un enlace externo de la card
**When** se inspecciona
**Then** lleva `target="_blank"` junto con `rel="noopener noreferrer"` (FR-16)

**Given** el componente
**When** se busca otro que renderice una card de proyecto
**Then** no existe ninguno: `ItemProject.vue` fue eliminado y este es el único (NFR-17)

### Story 4.3: Grilla responsive de proyectos

As a visitante desde el teléfono,
I want que las cards se vean bien en mi pantalla,
So that no tenga que hacer zoom ni scrollear en horizontal.

**Acceptance Criteria:**

**Given** un viewport de 390 px
**When** se carga `/projects`
**Then** las cards se muestran en una columna (FR-11)

**Given** un viewport de 768 px o mayor
**When** se carga `/projects`
**Then** las cards se muestran en dos columnas

**Given** el CSS de la grilla
**When** se inspecciona
**Then** usa `grid-template-columns` por breakpoint
**And** ningún ancho se calcula a partir del índice del proyecto, eliminando el patrón 60/40 que hoy se rompe en mobile (P7)

**Given** cualquiera de los cuatro anchos de verificación — 390, 768, 1280 y 1920
**When** se carga la vista
**Then** el cuerpo del documento no scrollea en horizontal

### Story 4.4: La card responde al cursor

As a visitante,
I want que la card reaccione cuando la apunto,
So that entienda que puedo entrar en ella.

**Acceptance Criteria:**

**Given** una card de proyecto en escritorio
**When** el visitante pasa el cursor por encima
**Then** la card se eleva con `translateY(-6px)`, su sombra pasa de `--shadow-md` a `--shadow-lg`, la imagen interna escala a `1.06` y las acciones se revelan, todo en `--dur-fast` con `--ease-out` (A5, FR-13)

**Given** el hover de la card
**When** se inspeccionan las propiedades animadas
**Then** solo se animan `transform`, `opacity` y `box-shadow`; no se anima `margin`, `width` ni `height` (NFR-02)

**Given** un visitante navegando por teclado
**When** el foco entra en la card
**Then** se produce la misma respuesta visual que en hover, con foco visible

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** apunta una card
**Then** las acciones se revelan sin desplazamiento ni escala

### Story 4.5: Vista de detalle de proyecto

As a desarrollador evaluando el trabajo,
I want leer qué problema resolvió el proyecto y con qué,
So that pueda juzgar la calidad de la ejecución antes de ir al código.

**Acceptance Criteria:**

**Given** la ruta `/projects/:slug` registrada en el router
**When** se define
**Then** resuelve el proyecto con `bySlug()` y lo pasa como prop a `ProjectDetailView.vue` (FR-01)
**And** un `beforeEnter` redirige a `/projects` cuando el slug no existe

**Given** un slug inexistente escrito a mano en la barra de direcciones
**When** se carga
**Then** el visitante termina en `/projects` sin ver ningún error ni pantalla vacía

**Given** la vista de detalle de un proyecto válido
**When** se renderiza
**Then** presenta imagen grande, problema, solución, rol, stack completo y los enlaces a sitio en vivo y a GitHub (FR-15)
**And** el título del proyecto es la única `h1` de la vista

**Given** el proyecto de mensajería en tiempo real, sin enlaces externos
**When** se abre su detalle
**Then** la vista se renderiza completa, sin botones de enlace y sin espacios vacíos

**Given** los enlaces externos de la vista
**When** se inspeccionan
**Then** llevan `target="_blank"` y `rel="noopener noreferrer"` (FR-16)

**Given** la ruta de detalle
**When** se navega a ella
**Then** el título del documento y la meta description reflejan el proyecto abierto (NFR-19)

### Story 4.6: Transición continua de la card al detalle

As a visitante,
I want que al abrir un proyecto la imagen me acompañe,
So that no pierda el hilo de qué proyecto abrí.

**Acceptance Criteria:**

**Given** un navegador con soporte de la View Transitions API
**When** el visitante abre un proyecto desde su card
**Then** la imagen de la card y la del detalle comparten un `view-transition-name` derivado del slug, y la transición es continua (FR-14, A6)

**Given** una vista con varias cards
**When** se inspeccionan los `view-transition-name` del documento
**Then** ninguno se repite

**Given** un navegador sin soporte de la API, o un visitante con `prefers-reduced-motion: reduce`
**When** abre un proyecto
**Then** la navegación ocurre con el fade de la historia 2.6, sin fallar (R5)

**Given** la navegación hacia atrás desde el detalle
**When** el visitante vuelve
**Then** la restauración de la posición de scroll de la historia 2.5 sigue funcionando; si entrara en conflicto con la transición, se salta la transición y se conserva el scroll

### Story 4.7: Proyectos destacados en la Home

As a reclutador que no va a recorrer todo el sitio,
I want ver los mejores proyectos ya en la portada,
So that me alcance con una pantalla para formarme una idea.

**Acceptance Criteria:**

**Given** la Home
**When** se renderiza la sección de proyectos
**Then** muestra como máximo tres proyectos, los marcados con `featured` en el módulo de contenido (FR-08)
**And** usa el mismo componente `ProjectCard` que `/projects`, sin ninguna variante duplicada

**Given** las cards de la Home y las de `/projects`
**When** se comparan sus clases y su markup
**Then** son idénticos: la diferencia se resuelve por props, no clonando el componente (NFR-17)

**Given** la sección de destacados
**When** entra en viewport
**Then** las cards se revelan de forma escalonada con `v-reveal`

**Given** la sección
**When** se busca el enlace a la vista completa
**Then** existe una llamada a la acción hacia `/projects`

---

## Epic 5: Trayectoria y habilidades legibles de un vistazo

Hoy la trayectoria es una lista de párrafos y el certificado se renderiza con un visor de PDF
de un megabyte. Después de esta épica la trayectoria se lee como una línea de tiempo y el
certificado es una imagen ampliable.

### Story 5.1: Contenido de trayectoria y habilidades en módulos

As a mantenedor,
I want la trayectoria y las habilidades como datos y no como markup,
So that actualizarlas no implique tocar el diseño.

**Acceptance Criteria:**

**Given** el módulo `src/content/timeline.js`
**When** se define
**Then** cada hito tiene tipo (`education` / `work` / `personal`), un período con `{ from, to }` donde `to: null` significa "actualidad", y textos en ES y EN

**Given** el contenido real del PRD
**When** se carga
**Then** incluye la formación (IFTS N.º 11, Digital House), la experiencia en EXO S.A. con Flutter, Riverpod, Dart y Vue.js, los proyectos personales y el perfil personal (FR-18)

**Given** el módulo `src/content/skills.js`
**When** se define
**Then** agrupa las habilidades en Frontend, Backend y Herramientas, con los ítems reales del PRD (FR-21)

**Given** ambos módulos
**When** se revisan las vistas
**Then** ningún texto de trayectoria ni de habilidades queda literal en un template

### Story 5.2: Línea de tiempo con revelado progresivo

As a visitante,
I want ver la trayectoria como una secuencia,
So that entienda el recorrido y no solo los datos sueltos.

**Acceptance Criteria:**

**Given** la vista Sobre mí
**When** se renderiza la trayectoria
**Then** se presenta como línea de tiempo con hitos ordenados, no como párrafos sueltos (FR-17)

**Given** el visitante que scrollea por la línea de tiempo
**When** avanza
**Then** la línea vertical se dibuja progresivamente con `scaleY` según el avance del scroll (A8)
**And** cada hito aparece con el revelado de la historia 2.7 al alcanzarlo

**Given** la línea de tiempo
**When** se inspeccionan las propiedades animadas
**Then** solo se animan `transform` y `opacity` (NFR-02)

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga la vista
**Then** la línea está completa y todos los hitos son legibles desde el inicio

**Given** los componentes `TimelineSection.vue` y `TimelineItem.vue`
**When** se crean
**Then** `MyStory.vue` queda eliminado

### Story 5.3: Certificado ampliable en lightbox

As a reclutador,
I want ver el certificado en grande,
So that pueda verificarlo sin descargar nada.

**Acceptance Criteria:**

**Given** la imagen del certificado, convertida a `src/assets/img/certificado.webp` desde el `image.png` actual
**When** se renderiza en la vista Sobre mí
**Then** se muestra como miniatura con dimensiones declaradas y `alt` descriptivo

**Given** el visitante que activa la miniatura
**When** se abre el lightbox
**Then** el certificado se muestra ampliado sobre un fondo atenuado (FR-19)
**And** el foco se traslada al lightbox

**Given** el lightbox abierto
**When** el visitante presiona `Escape`, toca fuera de la imagen o activa el botón de cierre
**Then** el lightbox se cierra y el foco vuelve a la miniatura que lo abrió

**Given** el lightbox abierto
**When** se recorre con `Tab`
**Then** el foco queda contenido dentro del lightbox

**Given** el proyecto completo
**When** se busca cualquier referencia a `pdfjs-dist` o a `certificado.pdf`
**Then** no existe ninguna: el visor de PDF fue eliminado y no se reintroduce

### Story 5.4: Habilidades agrupadas por categoría

As a reclutador técnico,
I want ver el stack organizado,
So that pueda comparar rápido contra lo que estoy buscando.

**Acceptance Criteria:**

**Given** la sección de habilidades
**When** se renderiza desde `src/content/skills.js`
**Then** los ítems aparecen agrupados en Frontend, Backend y Herramientas, cada grupo con su encabezado (FR-21)

**Given** el grupo que entra en viewport
**When** se dispara el revelado
**Then** los ítems entran de forma escalonada con `v-reveal` (FR-22, A2)

**Given** el visitante que apunta un ítem
**When** hace hover
**Then** el ícono responde con rotación de 6° y `scale(1.08)` usando `--ease-spring` (A7)

**Given** los componentes `SkillGrid.vue`
**When** se crea
**Then** `SkillList.vue` e `ItemSkill.vue` quedan eliminados

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga la sección
**Then** todos los ítems son visibles y el hover no produce movimiento

### Story 5.5: Resumen de trayectoria y CV en la Home

As a reclutador con 60 segundos,
I want ver la experiencia sin salir de la portada,
So that no tenga que navegar para saber dónde trabaja.

**Acceptance Criteria:**

**Given** la Home
**When** se renderiza después de la sección de habilidades
**Then** aparece un resumen de la trayectoria alimentado por `src/content/timeline.js` (FR-08)
**And** incluye un enlace a la vista Sobre mí para el detalle completo

**Given** la vista Sobre mí
**When** se renderiza
**Then** ofrece la descarga del CV en PDF usando el mismo composable que el hero (FR-20)

**Given** los encabezados de sección de las tres vistas
**When** se inspeccionan
**Then** todos usan el componente `SectionHeading` con un prop de nivel
**And** `MainTitle.vue`, `SubTitle.vue`, `SectionTitle.vue` y `ProjectTitle.vue` quedan eliminados (NFR-17)

---

## Epic 6: Contacto a un solo gesto

El recorrido J3: un cliente potencial no técnico que evalúa por impresión y necesita escribir
ya. El requisito es que nunca esté a más de un gesto del contacto, desde cualquier punto.

### Story 6.1: Canales de contacto como datos

As a mantenedor,
I want los canales de contacto definidos en un solo lugar,
So that cambiar un número no implique buscarlo por todo el código.

**Acceptance Criteria:**

**Given** el módulo `src/content/contact.js`
**When** se define
**Then** contiene los canales reales del PRD: WhatsApp (+54 11 3432-3271), email (`olivera.m.et13@gmail.com`) y LinkedIn (`in/marcelodanielolivera`)
**And** cada canal declara su etiqueta traducible, su URL y el nombre de su ícono

**Given** el proyecto completo
**When** se buscan esos datos de contacto
**Then** aparecen únicamente en este módulo, no repetidos en componentes

### Story 6.2: Sección de contacto como destino

As a cliente potencial,
I want un lugar claro donde encontrar cómo escribirle,
So that no tenga que buscar entre íconos chiquitos al pie.

**Acceptance Criteria:**

**Given** el componente `src/components/sections/ContactSection.vue`
**When** se renderiza al final de la Home
**Then** presenta los tres canales como una sección propia, con encabezado y jerarquía visual, no como una fila de íconos (FR-23)

**Given** cada canal
**When** el visitante lo activa
**Then** se abre directamente el destino correspondiente: `wa.me` para WhatsApp, `mailto:` para el email y el perfil de LinkedIn (FR-24)
**And** no existe ningún formulario intermedio

**Given** los enlaces externos de la sección
**When** se inspeccionan
**Then** llevan `rel="noopener noreferrer"` y áreas táctiles de al menos 44×44 px

**Given** la sección
**When** entra en viewport
**Then** se revela con `v-reveal`

### Story 6.3: Contacto alcanzable desde cualquier vista

As a visitante en cualquier punto del sitio,
I want poder escribir sin volver a la portada,
So that el impulso de contactar no se pierda navegando.

**Acceptance Criteria:**

**Given** cualquiera de las cuatro vistas del sitio
**When** el visitante llega al pie de página
**Then** los tres canales de contacto están disponibles como enlaces directos (FR-25)
**And** el pie los toma del mismo módulo `src/content/contact.js`

**Given** la Home
**When** se recorre de arriba abajo
**Then** el orden de las secciones es hero → proyectos destacados → habilidades → resumen de trayectoria → contacto (FR-08)

**Given** cualquier vista y cualquier posición de scroll
**When** se cuenta la distancia hasta un canal de contacto
**Then** nunca supera un gesto: o la sección de contacto o el pie de página

---

## Epic 7: Rápido, accesible y compartible

El sitio tiene que cumplir sus propias promesas. Esta épica no agrega funcionalidad: verifica
—midiendo, no suponiendo— que los 21 NFRs y las ocho métricas del PRD se alcanzan, y cierra
los frentes de assets, metadatos y actualización del PWA.

### Story 7.1: Imágenes en formato moderno

As a visitante con datos móviles,
I want que las imágenes pesen lo menos posible,
So that el sitio cargue rápido sin consumirme el plan.

**Acceptance Criteria:**

**Given** las capturas de proyectos, el retrato y el certificado
**When** se convierten a WebP en `src/assets/img/`
**Then** cada `<img>` del sitio declara `width` y `height` explícitos (NFR-04)

**Given** toda imagen fuera del viewport inicial
**When** se inspecciona
**Then** lleva `loading="lazy"` y `decoding="async"`

**Given** el retrato del hero
**When** se inspecciona
**Then** no lleva `loading="lazy"` y sí `fetchpriority="high"`

**Given** el proyecto de mensajería en tiempo real, que hoy no tiene captura propia
**When** se prepara su imagen
**Then** existe una captura real del proyecto, o se decide explícitamente cómo se presenta ese proyecto sin ella; en ningún caso queda una imagen genérica pasando por captura

**Given** el sitio cargado
**When** se mide el CLS
**Then** es menor a 0,1 (M4)

### Story 7.2: El sitio se ve bien cuando se comparte

As a visitante que comparte el enlace,
I want que se vea una previsualización decente,
So that el enlace invite a entrar.

**Acceptance Criteria:**

**Given** `public/index.html`
**When** se inspeccionan sus metadatos
**Then** declara Open Graph y Twitter Card con título, descripción e imagen (NFR-20)
**And** la URL de la imagen es absoluta (`https://marcecode.com/og-image.webp`), no relativa

**Given** la imagen de previsualización
**When** se genera en `public/og-image.webp`
**Then** representa el diseño nuevo, no el anterior

**Given** cada una de las cuatro rutas
**When** se carga
**Then** el título del documento y la meta description son propios de esa ruta y están traducidos al idioma activo (NFR-19)

### Story 7.3: Nadie se queda con la versión vieja

As a visitante que ya conocía el sitio,
I want ver el diseño nuevo sin tener que limpiar el caché,
So that no me quede una versión desactualizada.

**Acceptance Criteria:**

**Given** `src/registerServiceWorker.js`
**When** el evento `updated(registration)` se dispara
**Then** emite un evento que `App.vue` escucha para mostrar un aviso no bloqueante de versión nueva (NFR-21)

**Given** el aviso visible
**When** el visitante lo acepta
**Then** se envía `SKIP_WAITING` al service worker y la página se recarga con la versión nueva

**Given** `nginx.conf`
**When** se revisan sus cabeceras
**Then** `index.html` y `service-worker.js` se sirven con `Cache-Control: no-cache`
**And** los assets con hash conservan `expires 1y, immutable`
**And** se declara `Referrer-Policy: strict-origin-when-cross-origin`

**Given** el sitio en producción
**When** se abre la consola del navegador
**Then** no hay ninguna salida (M7)

**Given** el sitio cargado
**When** se revisa la pestaña de red
**Then** ninguna petición apunta a un host distinto de marcecode.com (D14)

### Story 7.4: Bilingüismo completo verificado

As a visitante internacional,
I want que absolutamente todo el sitio esté en inglés cuando lo elijo,
So that no me quede media página en español.

**Acceptance Criteria:**

**Given** el idioma en EN
**When** se recorren las cuatro vistas completas
**Then** ningún texto visible queda en español (FR-29, M5)
**And** eso incluye títulos de documento, `alt` de imágenes, etiquetas `aria-label` y textos de los botones

**Given** los archivos `src/locales/es.json` y `en.json`
**When** se comparan sus conjuntos de claves
**Then** son idénticos

**Given** todos los módulos de `src/content/`
**When** se revisan
**Then** cada entrada tiene su clave `i18n` completa en ES y en EN

**Given** el visitante que alterna el idioma a mitad de una vista
**When** el cambio ocurre
**Then** la posición de scroll se mantiene y el atributo `lang` del documento se actualiza (FR-30)

**Given** cualquier template del proyecto
**When** se revisa buscando texto visible literal
**Then** no queda ninguno fuera de i18n o de `src/content/` (NFR-16)

### Story 7.5: Accesible con teclado y con lector de pantalla

As a visitante que navega por teclado,
I want poder usar todo el sitio sin mouse,
So that no quede afuera de ninguna funcionalidad.

**Acceptance Criteria:**

**Given** cualquier vista
**When** se recorre completa con `Tab`
**Then** todo elemento interactivo es alcanzable y muestra un `:focus-visible` claramente visible (NFR-08)
**And** el `.skip-link` es el primer elemento enfocable

**Given** cada una de las cuatro vistas
**When** se inspecciona su estructura
**Then** hay landmarks `header`, `nav`, `main` y `footer`, y exactamente una `h1` (NFR-09)

**Given** todas las imágenes del sitio
**When** se revisan
**Then** las informativas tienen `alt` descriptivo y las decorativas `alt=""` (NFR-10)

**Given** los dos temas
**When** se auditan los pares de color de texto y fondo
**Then** ninguno queda por debajo de WCAG 2.1 AA (NFR-06, M6)

**Given** todos los objetivos táctiles
**When** se miden
**Then** ninguno es menor a 44×44 px (NFR-11)

**Given** una auditoría de Lighthouse en mobile
**When** se ejecuta
**Then** el puntaje de accesibilidad es mayor o igual a 95 (M2)

### Story 7.6: Usable y quieto con movimiento reducido

As a visitante sensible al movimiento,
I want que el sitio no se mueva,
So that pueda usarlo sin malestar.

**Acceptance Criteria:**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** recorre las cuatro vistas completas
**Then** el 100 % de las animaciones está desactivado o reducido a un fade (NFR-07, M8)

**Given** ese mismo visitante
**When** carga cualquier vista
**Then** todo el contenido es legible desde el inicio: ningún elemento depende de que una animación termine para volverse visible

**Given** ese mismo visitante
**When** navega entre vistas y abre un proyecto
**Then** no se ejecutan ni la transición de ruta ni la de elemento compartido, y la navegación funciona igual

**Given** ese mismo visitante
**When** abre el menú mobile y el lightbox
**Then** ambos abren y cierran correctamente, sin animación de entrada

### Story 7.7: Verificado en los cuatro anchos

As a visitante desde cualquier dispositivo,
I want que el sitio se vea bien en mi pantalla,
So that no importe con qué entré.

**Acceptance Criteria:**

**Given** los anchos 390, 768, 1280 y 1920 px
**When** se recorren las cuatro vistas en cada uno
**Then** ninguna produce scroll horizontal en el cuerpo del documento (NFR-12)
**And** ningún texto se solapa ni se corta

**Given** el ancho de 390 px
**When** se revisan las alturas de viewport
**Then** usan `svh` o `dvh`, y el hero no queda tapado por la barra del navegador móvil (NFR-14)

**Given** las cuatro vistas en cada uno de los tres estados de tema
**When** se comparan las medidas del chasis
**Then** la altura del header y la posición del logo son idénticas en todas

**Given** las dos últimas versiones estables de Chrome, Firefox, Safari y Edge
**When** se carga el sitio
**Then** funciona en todas, degradando las transiciones de vista donde la API no exista (NFR-13)

### Story 7.8: Rápido de verdad, medido

As a visitante,
I want que el sitio cargue rápido pese a todas las animaciones,
So that el movimiento no me cueste la espera.

**Acceptance Criteria:**

**Given** una auditoría de Lighthouse en mobile con red 4G simulada
**When** se ejecuta sobre el build de producción
**Then** el puntaje de performance es mayor o igual a 90 (M1)
**And** el LCP es menor a 2,5 s (M3, NFR-01)
**And** el CLS es menor a 0,1 (M4)

**Given** el scroll de la Home en un dispositivo mobile de gama media
**When** se graba el rendimiento
**Then** se mantienen 60 fps (NFR-03)

**Given** todas las animaciones del sitio
**When** se revisan sus propiedades
**Then** solo se animan `transform` y `opacity` (NFR-02)

**Given** el proyecto completo
**When** se ejecuta `npm run lint`
**Then** no hay advertencias (NFR-18)

**Given** el código fuente
**When** se ejecuta `grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-" src/ --include=*.vue`
**Then** no devuelve resultados: ningún componente redefine un token (NFR-15)

**Given** los componentes del proyecto
**When** se revisan
**Then** existe un único componente canónico por elemento y los trece componentes marcados para eliminación ya no están (NFR-17)
