---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-08-16'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/ui-handoff.md
  - _bmad-output/planning-artifacts/ui-prompts/home.md
  - _bmad-output/planning-artifacts/ui-prompts/proyectos.md
  - _bmad-output/planning-artifacts/ui-prompts/proyecto-detalle.md
  - _bmad-output/planning-artifacts/ui-prompts/sobre-mi.md
  - src/ (código Vue actual)
workflowType: 'architecture'
project_name: 'portfolio'
user_name: 'Marcelo'
date: '2026-08-15'
---

# Architecture Decision Document

_Este documento se construye de forma colaborativa, paso a paso. Las secciones se van
agregando a medida que trabajamos cada decisión arquitectónica._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 30 FRs en 7 grupos (navegación, home, proyectos, sobre mí,
habilidades, contacto, tema e idioma). Arquitectónicamente se reducen a tres ejes:
(a) una ruta nueva `/projects/:slug` alimentada por un módulo único de datos que reemplaza
la duplicación actual entre `HomeView` y `ProjectsView`; (b) un sistema de movimiento
normativo de 9 animaciones que cruza las 4 vistas; (c) dos preferencias persistidas
(tema, idioma) que deben aplicarse antes del primer pintado para evitar flash.

**Non-Functional Requirements:** 21 NFRs. Los que fuerzan decisiones son NFR-01/03
(LCP < 2.5 s, 60 fps — chocan de frente con `pdfjs-dist` y con dos paquetes de íconos de
fuente), NFR-02 (solo `transform`/`opacity`), NFR-15 (cero valores hardcodeados → tokens
como custom properties en runtime, no variables SASS), NFR-17 (un componente canónico por
elemento → consolidar los cuatro componentes de título en uno) y NFR-07 (reduced-motion
obligatorio).

**Scale & Complexity:**

- Primary domain: frontend web (SPA estática, sin backend)
- Complexity level: baja en datos e integraciones, media-alta en presentación
- Componentes arquitectónicos estimados: 15 canónicos + 4 vistas + 5 módulos transversales
  (tema, idioma, movimiento, router-meta, contenido)
- Un solo autor y mantenedor

### Technical Constraints & Dependencies

- Stack fijado por el PRD §2.3 y §6.2: Vue 3 + Vue Router + vue-i18n + SASS. No se migra
  framework, build tool ni hosting.
- **Build tool real: Vue CLI 5 (webpack)**, no Vite. Toda decisión de carga de estilos,
  assets y service worker pasa por `@vue/cli-plugin-*`.
- Pipeline de deploy existente (Docker + Nginx + GitHub Actions al VPS) se mantiene.
- Sitio en producción en marcecode.com: el rediseño se trabaja en rama (R4).
- Design system ya construido y verificado en `public/ui-generated/_system/`
  (`tokens.css`, `components.css`, `system.js`) — es el insumo, no se rediseña.
- Deuda a remover, no a migrar: `pdfjs-dist` con worker desde CDN,
  `@fortawesome/fontawesome-free`, `font-awesome-icons`, `langStore.js` (invoca `useI18n()`
  fuera de un contexto de setup) y el toggle de tema sin persistencia de `App.vue`.
- Contenido real y cerrado: 3 proyectos, 2 formaciones, 1 experiencia. No se inventa contenido.

**Hallazgos del código actual que los documentos de planificación no registraban:**

| Hallazgo | Implicación arquitectónica |
|---|---|
| Vue CLI 5 / webpack, no Vite | El PRD prohíbe migrar el build tool → webpack se queda |
| `pdfjs-dist` (~1 MB) para un certificado, worker desde CDN externo | Ataca NFR-01/M1 y rompe el PWA offline; FR-19 pide imagen ampliable → la dependencia se elimina |
| Dos paquetes de íconos (`@fortawesome/fontawesome-free` + `font-awesome-icons`) | El design system usa sprite SVG inline → ambos salen (NFR-05) |
| `langStore.js` llama a `useI18n()` fuera de un setup | El store de idioma está roto por construcción; es reescritura, no refactor |
| Tema como `ref(false)` local en `App.vue`, sin persistencia | Confirma P6; FR-26/27/28 no tienen base sobre la cual construir |
| `i18n.js` son 51 líneas y termina en `// Agrega aquí más textos` | FR-29 (100 % de cobertura) es el ítem de mayor volumen del rediseño |
| El design system generado es CSS plano; el proyecto es SASS | Los tokens deben ser custom properties en runtime; SASS queda para anidado y mixins |
| `vue@3.2.13`, `vue-router@4.0.3` | Decisión pendiente: subir versión menor antes de tocar transiciones |

### Cross-Cutting Concerns Identified

1. **Tematización** — tokens en runtime, persistencia, `prefers-color-scheme`, aplicación
   previa al primer pintado (FR-26→28).
2. **Internacionalización** — cobertura total ES/EN con el contenido extraído a módulos de
   datos con clave por idioma (FR-29, R3, NFR-16).
3. **Sistema de movimiento** — catálogo A1–A9, presupuesto de un gesto protagónico por
   sección, degradación completa bajo `prefers-reduced-motion` (NFR-07).
4. **Capa de router** — scroll behavior (FR-04), metadatos SEO por ruta (NFR-19),
   transiciones de vista con degradación a fade (A6/FR-14/R5), atributo `lang` (FR-30).
5. **Pipeline de assets** — formato moderno, dimensiones declaradas, carga diferida (NFR-04).
6. **Caché del service worker** — un rediseño total invalida el caché existente (NFR-21).
7. **Accesibilidad** — AA en ambos temas, foco visible, targets táctiles, landmarks
   semánticos (NFR-06→11).

---

## Starter Template Evaluation

### Primary Technology Domain

Frontend web — SPA estática sin backend. Proyecto brownfield en producción.

### Starter Options Considered

Ninguno aplica. El PRD §6.2 excluye del alcance la migración de framework, de build tool y
de plataforma de hosting. Los starters vigentes del ecosistema Vue (`create-vue`, Nuxt,
VitePress) implican todos migrar a Vite, lo que contradice esa restricción y descartaría el
pipeline Docker/Nginx/GitHub Actions ya operativo.

### Selected Starter: ninguno — se continúa sobre la base existente

**Rationale for Selection:**
El proyecto ya está inicializado sobre Vue CLI 5 (webpack) con PWA, router, i18n y deploy
funcionando. El rediseño es de presentación, no de fundación. Sustituir la base costaría
rehacer el pipeline sin ganar ninguno de los objetivos del PRD.

En lugar de un starter, la primera historia de implementación fija la **línea base de
versiones**, verificada contra el registro de npm:

```bash
npm i vue@3.5.41 vue-router@4.6.4 vue-i18n@11.4.8
npm i -D sass@1.102.0 @vue/cli-service@5.0.9
npm rm pdfjs-dist @fortawesome/fontawesome-free font-awesome-icons
```

### Architectural Decisions Provided by the Existing Base

**Language & Runtime:** JavaScript con `<script setup>` (sin TypeScript). Build sobre Node 24
(`node:24-alpine` en el Dockerfile).

**Styling Solution:** SASS vía `sass-loader`. El rediseño reasigna su rol: los valores
visuales pasan a ser custom properties CSS en runtime (requisito para el cambio de tema,
NFR-15 / FR-26), y SASS queda para anidado, mixins y organización de parciales.

**Build Tooling:** Vue CLI 5 (webpack) con `@vue/cli-plugin-babel`, `@vue/cli-plugin-pwa`
(Workbox) y `@vue/cli-plugin-eslint`.

**Testing Framework:** Jest 27 vía `@vue/cli-plugin-unit-jest`, configurado pero sin ninguna
prueba escrita. Las métricas del PRD (M1–M8) son de auditoría en navegador, no de test unitario.

**Code Organization:** `src/{views,components,composables,stores,router,styles,assets}`.
El rediseño agrega `src/content/` (módulos de datos por idioma) y absorbe `stores/` en
`composables/`.

**Development Experience:** `npm run serve` / `build` / `lint` / `test:unit`.

### Decisiones de versión

| Paquete | Instalado | npm latest | Decisión | Motivo |
|---|---|---|---|---|
| `vue` | 3.4.21 | 3.5.41 | ⬆️ 3.5.41 | Requerido como peer por vue-router 4.6 |
| `vue-router` | 4.3.0 | 5.2.0 | ⬆️ 4.6.4 | Se rechaza la 5 (ver abajo) |
| `vue-i18n` | 9.14.5 | 11.4.8 | ⬆️ 11.4.8 | Peer `vue ^3.0.0`; engine Node ≥22 ya satisfecho; `legacy: false` ya configurado |
| `sass` | 1.96.0 | 1.102.0 | ⬆️ 1.102.0 | Sin ruptura |
| `@vue/cli-service` | 5.0.8 | 5.0.9 | ⬆️ 5.0.9 | Último parche de la línea |
| `eslint` | 7.32.0 | 10.8.1 | ⏸️ sin cambio | La 9+ exige flat config y rompe `@vue/cli-plugin-eslint@5` y `eslint-plugin-vue@8` |

**Rechazo explícito de `vue-router@5`:** aunque es la versión `latest`, declara
`vite: ^7 || ^8` como peer dependency (opcional). Todo su valor diferencial — routing basado
en archivos, `unplugin`, rutas tipadas — depende de la integración con Vite. Bajo Vue CLI /
webpack expone la misma API manual que la 4 con el costo de un salto de versión mayor.

### Dependencias removidas

| Paquete | Motivo |
|---|---|
| `pdfjs-dist` | ~1 MB para renderizar un certificado en canvas, con el worker cargado desde un CDN externo. Ataca NFR-01 / NFR-04 y rompe el funcionamiento offline del PWA. FR-19 especifica una imagen ampliable en lightbox, no un visor de PDF |
| `@fortawesome/fontawesome-free` | Reemplazado por el sprite SVG inline del design system generado (NFR-05) |
| `font-awesome-icons` | Segundo paquete de íconos redundante, sin uso justificado |

### Riesgo aceptado

Vue CLI está en modo mantenimiento y la recomendación oficial del ecosistema es Vite;
`5.0.9` es el final de esa línea. Es una consecuencia directa de la restricción del PRD
§2.3 / §6.2 y se registra como deuda técnica conocida, a reevaluar fuera del alcance de
este rediseño.

**Note:** La actualización de la línea base de versiones y la remoción de dependencias debe
ser la primera historia de implementación.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (bloquean la implementación):** D1–D6
**Important Decisions (dan forma a la arquitectura):** D7–D14
**Deferred Decisions (fuera del alcance de este rediseño):** ver §Diferidas

### Data Architecture

No hay base de datos, backend ni capa de red. El "modelo de datos" es un conjunto de
módulos ES estáticos que webpack incluye en el bundle.

**D4 — Fuente única de contenido en `src/content/`** *(crítica — FR-10, R3, NFR-16)*

`src/content/projects.js` exporta un array ordenado de proyectos. Cada proyecto lleva sus
campos invariantes en la raíz y los textos traducibles bajo `i18n`, con una clave por idioma:

```js
export const projects = [
  {
    slug: 'tienda-jedami',          // clave primaria, kebab-case, estable
    featured: true,                  // gobierna la selección de la Home (FR-08)
    stack: ['Vue', 'Node.js'],       // chips; no se traduce
    image: 'jedami-preview',         // nombre base; el pipeline resuelve .webp
    liveUrl: 'https://jedamiapp.com',
    repoUrl: 'https://github.com/OliveraMarcelo/tienda-jedami',
    i18n: {
      es: { title, summary, problem, solution, role },
      en: { title, summary, problem, solution, role },
    },
  },
]
export const bySlug = (slug) => projects.find((p) => p.slug === slug) ?? null
```

Los mismos módulos existen para `skills.js`, `timeline.js` y `contact.js`.

**Rationale:** la duplicación de datos de proyectos entre `HomeView` y `ProjectsView` es hoy
un defecto real; la vista de detalle nueva la triplicaría. Poner el texto traducible *dentro*
del dato — y no como claves sueltas en el catálogo de i18n — evita el modo de falla de R3,
donde agregar un proyecto obliga a tocar tres archivos y es fácil olvidar el inglés.

**Validación:** no hay validación en runtime. El contenido es estático, cerrado y del autor.
La única guarda necesaria es la resolución de `slug` en el router (D5).

**Caching:** HTTP vía nginx (`expires 1y, immutable` sobre assets con hash) más el service
worker de Workbox. Sin caché en memoria a nivel de aplicación: no hay nada que revalidar.

### Authentication & Security

No hay autenticación, autorización, sesiones ni datos de usuario. El sitio es estático y
público. Las decisiones de seguridad son de superficie:

**D14 — Cero orígenes de terceros en runtime** *(importante)*

Estado actual a corregir: `public/index.html` carga Poppins desde `fonts.googleapis.com` y
`PdfViewer.vue` carga el worker de PDF.js desde `cdnjs.cloudflare.com`. Ambos se eliminan.
Después del rediseño, el documento no debe emitir ninguna petición a un host externo.

**Rationale:** cada origen externo agrega una negociación TLS al camino crítico (NFR-01),
rompe el funcionamiento offline del PWA (NFR-21), y el PRD §6.2 ya excluye analytics y
tracking de terceros. Sin terceros, además, una CSP restrictiva se vuelve trivial de escribir.

**Enlaces externos:** `target="_blank"` siempre acompañado de `rel="noopener noreferrer"` (FR-16).

**Cabeceras:** `nginx.conf` ya envía `X-Frame-Options`, `X-Content-Type-Options`,
`Strict-Transport-Security` y `server_tokens off`. Se agrega `Referrer-Policy` y, una vez
eliminados los terceros, una `Content-Security-Policy` de solo-mismo-origen.

### API & Communication Patterns

No hay API. La "comunicación" del sistema son contratos internos entre módulos:

| Contrato | Forma | Consumidores |
|---|---|---|
| Estado de tema | Composable `useTheme()` → `{ theme, toggleTheme }` | `ThemeToggle`, `App.vue`, script inline |
| Estado de idioma | Composable `useLocale()` → `{ locale, setLocale, toggleLocale }` | `LangToggle`, `App.vue`, router |
| Contenido | Import estático desde `src/content/*` | Vistas y componentes |
| Metadatos de ruta | `route.meta.{titleKey, descriptionKey}` | Guard `afterEach` del router |
| Revelado al scroll | Directiva `v-reveal` | Cualquier sección |

**Manejo de errores:** el único fallo posible es un `slug` inexistente en `/projects/:slug`.
Se resuelve en el router (D5), no con un estado de error en la vista. No hay estados de
carga: no hay datos asíncronos.

### Frontend Architecture

**D1 — Tokens como custom properties CSS, no como variables SASS** *(crítica — NFR-15, FR-26/28)*

`src/styles/tokens.css` es la única definición de valores visuales, portado literalmente de
`public/ui-generated/_system/tokens.css`. Se importa antes que cualquier otro estilo.
`src/styles/sass/variables/_colors.scss`, `_fonts.scss` y `_sizes.scss` se eliminan.

**Rationale:** las variables SASS se resuelven en tiempo de compilación y no pueden cambiar
de valor en el navegador. El cambio de tema (FR-26) y la transición suave de color (FR-28)
exigen que los valores sean sustituibles en runtime. SASS conserva su rol para anidado,
mixins y organización de parciales, no para valores.

**D2 — `data-theme` en `<html>`, aplicado antes del primer pintado** *(crítica — FR-26/27)*

Un script inline y bloqueante en `public/index.html`, antes de cualquier hoja de estilo,
resuelve la preferencia y estampa el atributo:

```html
<script>
  (function () {
    var t = localStorage.getItem('mc-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    var l = localStorage.getItem('mc-lang') || 'es';
    document.documentElement.setAttribute('lang', l);
  })();
</script>
```

**Rationale:** si el tema se aplicara al montar la aplicación Vue, todo visitante con
preferencia clara vería un destello oscuro. Ese flash cuenta como cambio de layout percibido
y es exactamente lo que NFR-01/M4 buscan evitar. El atributo va en `<html>`, no en `<body>`
como hoy, porque `tokens.css` define los temas sobre `[data-theme]` a nivel de raíz.
El mismo script corrige `<html lang="">`, que hoy está vacío (FR-30, NFR-09).

**D3 — Estado global por composables singleton, sin Pinia** *(crítica)*

`src/composables/useTheme.js` y `useLocale.js` exponen un `ref` de módulo compartido más las
funciones que lo mutan y lo persisten en `localStorage`. `src/stores/langStore.js` se elimina.

**Rationale:** el estado global del sitio son exactamente dos valores enumerados. Pinia
aportaría devtools, módulos y SSR-safety — ninguno de los tres tiene uso acá — a cambio de
una dependencia más en el bundle crítico. El `langStore.js` actual además invoca `useI18n()`
fuera de un contexto de `setup()`, así que no es un refactor sino una reescritura.

**D5 — `/projects/:slug` con resolución de slug en el router** *(crítica — FR-01, FR-15)*

```js
{
  path: '/projects/:slug',
  name: 'project-detail',
  component: () => import('../views/ProjectDetailView.vue'),
  props: (route) => ({ project: bySlug(route.params.slug) }),
  beforeEnter: (to) => (bySlug(to.params.slug) ? true : { name: 'projects' }),
}
```

**Rationale:** el slug inexistente se resuelve antes de montar la vista, así que
`ProjectDetailView` nunca necesita un estado de "no encontrado" ni una rama de render vacía.
Resolver el proyecto como prop en lugar de leer `route.params` dentro del componente lo deja
puro y renderizable sin router.

**D6 — Transiciones de ruta: View Transitions API con degradación a `<Transition>`** *(crítica — FR-14, A6, R5)*

Un guard `router.beforeResolve` envuelve la navegación en `document.startViewTransition`
cuando existe; si no existe, o si el usuario pidió movimiento reducido, la navegación procede
normal y `<Transition>` alrededor de `<router-view>` aporta el fade descrito en A6.
La imagen de la card y la del detalle comparten `view-transition-name` derivado del slug.

**Rationale:** es la única forma de cumplir FR-14 (transición continua de elemento
compartido) sin una librería de animación. R5 ya anticipaba la fragilidad; la degradación
explícita es la mitigación. Ambos caminos deben producir una navegación funcional —
verificado como requisito, no como suposición.

**D7 — Un único `IntersectionObserver` compartido, expuesto como directiva `v-reveal`** *(importante — A2, NFR-03)*

`src/directives/reveal.js` crea un observer de módulo, único para todo el sitio. Cada elemento
con `v-reveal` se registra al montar, recibe `.is-visible` al cruzar el umbral del 15 % y se
desregistra inmediatamente. El escalonado se pasa como argumento: `v-reveal="{ delay: 70 }"`.

**Rationale:** el patrón alternativo — un observer por componente — multiplica los callbacks
de layout durante el scroll y es el camino más corto a perder los 60 fps de NFR-03. Una
directiva mantiene las vistas declarativas y evita el `onMounted` repetido en cada sección.
Las clases `.reveal` / `.is-visible` ya existen en el design system y se portan tal cual.

**D8 — Fuentes self-hosted en woff2, con `preload` y `font-display: swap`** *(importante — NFR-05, D14)*

Space Grotesk, Inter y JetBrains Mono se descargan y se sirven desde `src/assets/fonts/`.
Se precargan únicamente los cortes usados por el hero. Se elimina el `<link>` a
`fonts.googleapis.com` de `public/index.html`.

**Rationale:** hoy el sitio carga Poppins desde el CDN de Google — una fuente que el rediseño
ni siquiera usa. Servir las tres familias desde el propio origen elimina una conexión externa
del camino crítico y hace determinista el LCP del hero, que es el elemento de A1.

**D9 — Íconos como sprite SVG inline** *(importante — NFR-05)*

El contenido de `public/ui-generated/_system/sprite.html` pasa a un componente
`AppSprite.vue` montado una sola vez en `App.vue`; los íconos se referencian con
`<svg class="ico"><use href="#i-nombre"/></svg>`. Se eliminan los dos paquetes de Font Awesome.

**Rationale:** hereda el vocabulario exacto del design system ya verificado, colorea por
`currentColor` — indispensable para que los íconos sigan el tema — y elimina una fuente de
íconos completa del payload.

**D10 — Imágenes en WebP con dimensiones declaradas** *(importante — NFR-04, M4)*

Toda captura de proyecto y el retrato se convierten a `.webp` y se sirven con `width` y
`height` explícitos. `loading="lazy"` y `decoding="async"` en todo lo que no esté en el
viewport inicial; el retrato del hero se carga con `fetchpriority="high"` y sin `lazy`.

**Rationale:** las dimensiones declaradas son la mitigación directa de CLS (M4 < 0.1);
el retrato del hero es el candidato a LCP y diferir su carga hundiría NFR-01.

**D11 — Metadatos por ruta vía `route.meta` + guard `afterEach`** *(importante — NFR-19, NFR-20, FR-30)*

Cada ruta declara `meta: { titleKey, descriptionKey }`. Un `router.afterEach` traduce esas
claves con la instancia de i18n y actualiza `document.title` y la meta description. Open Graph
y Twitter Card se declaran estáticos en `public/index.html` con la imagen de previsualización.

**Rationale:** centraliza en una sola función lo que si no se dispersa como `onMounted` en
cuatro vistas. Que los títulos pasen por claves de i18n es lo que hace que FR-29 alcance
también al `<title>`, no solo al contenido visible.

**D12 — Actualización del service worker con aviso al usuario** *(importante — NFR-21, M7)*

`registerServiceWorker.js` deja de limitarse a `console.log`. En `updated(registration)`
emite un evento que `App.vue` escucha para mostrar un aviso no bloqueante de "hay una versión
nueva"; al aceptarlo se envía `SKIP_WAITING` y se recarga. Todos los `console.log` restantes
quedan condicionados a `NODE_ENV !== 'production'`.

**Rationale:** un rediseño total invalida el caché de todos los visitantes recurrentes; con el
comportamiento actual verían el diseño viejo hasta cerrar todas las pestañas. Además, los
`console.log` incondicionales de hoy contradicen literalmente M7 (cero salida en consola en
producción). Requiere sumar `Cache-Control: no-cache` sobre `index.html` y `service-worker.js`
en `nginx.conf`, que hoy no lo declara.

**D13 — Locales en archivos separados, con el contenido fuera del catálogo** *(importante — FR-29, NFR-16)*

`src/locales/es.json` y `src/locales/en.json` contienen exclusivamente los textos de interfaz
(navegación, botones, encabezados de sección, etiquetas). Los textos de contenido — proyectos,
trayectoria, habilidades — viven en `src/content/*` bajo la clave `i18n` del propio dato (D4).
`src/i18n.js` queda reducido a la creación de la instancia.

**Rationale:** son dos ciclos de vida distintos. Las etiquetas de interfaz cambian cuando
cambia el diseño; el contenido cambia cuando Marcelo suma un proyecto. Mezclarlos en un solo
catálogo de 51 líneas es exactamente el estado actual, y es la razón por la que hoy la
cobertura está incompleta.

**Bundle:** se conservan los `import()` diferidos por ruta que ya tiene el router. Si el
presupuesto de NFR-01 quedara ajustado, la palanca disponible es precompilar los mensajes de
i18n con `@intlify/unplugin-vue-i18n` y aliasar `vue-i18n` a su build de runtime, lo que saca
el compilador de mensajes del bundle. Se mide antes de aplicarlo.

### Infrastructure & Deployment

Sin cambios estructurales: Docker multi-stage (`node:24-alpine` → `nginx:alpine`),
`docker-compose.prod.yml`, GitHub Actions al VPS, TLS por Let's Encrypt sobre marcecode.com.

Ajustes puntuales de `nginx.conf`, todos derivados de decisiones anteriores:

- `Cache-Control: no-cache` explícito para `index.html` y `service-worker.js` (D12).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Content-Security-Policy` de solo-mismo-origen, viable una vez eliminados los terceros (D14).
- Se agrega `woff2` al bloque de assets con `expires 1y, immutable` — ya está contemplado en
  la expresión regular actual (D8).

**Monitoreo:** ninguno. El PRD §6.2 excluye analytics y tracking de terceros. La verificación
de las métricas M1–M8 es una auditoría manual con Lighthouse antes de mergear (R4).

### Decisiones diferidas

| Diferida | Motivo |
|---|---|
| A9 — contador animado del stack | La UX spec ya la marca como opcional y sujeta al presupuesto de movimiento |
| Pruebas unitarias | Jest está configurado pero las métricas del PRD son de auditoría en navegador; escribirlas no acerca ningún criterio de aceptación |
| Lighthouse CI en el pipeline | Valioso, pero fuera del alcance declarado; la verificación es manual por rama (R4) |
| Migración a TypeScript | No la pide ningún FR/NFR y multiplicaría la superficie del rediseño |
| Migración a Vite | Excluida explícitamente por el PRD §6.2 |

### Decision Impact Analysis

**Secuencia de implementación** — el orden está forzado por las dependencias, no por preferencia:

1. **D-base** — línea de versiones y remoción de dependencias (step-03). Todo lo demás compila sobre esto.
2. **D1** — tokens en runtime. Ningún componente puede estilizarse antes.
3. **D2** — `data-theme` + `lang` antes del primer pintado. Requiere D1.
4. **D3** — composables de tema e idioma. Requiere D2 (comparten la clave de `localStorage`).
5. **D8, D9** — fuentes y sprite. Requieren D1 (los tokens nombran las familias).
6. **D4, D13** — contenido y locales. Independientes de lo visual; se pueden trabajar en paralelo.
7. **D5** — ruta de detalle. Requiere D4.
8. **D7** — directiva de revelado. Requiere D1 (las clases `.reveal` viven en el sistema).
9. **D6** — transiciones de ruta. Requiere D5 y D7.
10. **D10, D11, D12, D14** — assets, metadatos, service worker y limpieza de terceros. Fase de pulido.

**Dependencias cruzadas:**

- **D1 → todo.** Los tokens son el cimiento; cualquier componente escrito antes habría que reescribirlo.
- **D2 ↔ D3.** El script inline y el composable leen y escriben las mismas claves
  (`mc-theme`, `mc-lang`). Divergir en el nombre produce un flash silencioso en cada carga.
- **D4 → D5 → D6.** El elemento compartido de la transición se identifica por el slug, que
  nace en el módulo de contenido.
- **D6 ↔ D7.** Ambos deben respetar `prefers-reduced-motion` desde el mismo origen de verdad,
  o el sitio queda a medio quieto (NFR-07).
- **D8 + D9 + D14.** Las tres eliminan orígenes externos; sirven a la misma métrica y se
  verifican juntas mirando la pestaña de red: cero peticiones fuera del propio dominio.
- **D12 → nginx.** El aviso de actualización no funciona si `index.html` se sirve cacheado.

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Puntos de conflicto identificados:** 12 áreas donde dos agentes distintos tomarían
decisiones diferentes sobre el mismo elemento.

Este proyecto tiene evidencia empírica del costo de no fijar estas reglas. Durante la
generación de las cuatro pantallas del prototipo, sin un vocabulario canónico previo,
el mismo panel del menú mobile terminó llamándose `mobile-menu`, `nav-main` y `nav__menu`
según la pantalla; los botones alternaban entre `btn-primary` y `btn--primary`; y hubo
tres clases distintas para el mismo ícono. El resultado medible: 4019 líneas de CSS con
los tokens redefinidos cuatro veces y solo 131 líneas idénticas entre las cuatro pantallas.
Cada defecto del chasis hubo que arreglarlo cuatro veces. Las reglas que siguen existen
para que eso no se repita en el código Vue.

### Naming Patterns

**Convenciones de código:**

| Elemento | Regla | Ejemplo correcto | Anti-patrón |
|---|---|---|---|
| Componente (archivo y etiqueta) | `PascalCase`, sustantivo, prefijo `App` solo para los del chasis | `ProjectCard.vue`, `AppNav.vue` | `project-card.vue`, `Card.vue` |
| Vista | `PascalCase` terminado en `View` | `ProjectDetailView.vue` | `ProjectDetail.vue` |
| Composable | `use` + sustantivo, `camelCase` | `useTheme.js`, `useLocale.js` | `themeStore.js`, `UseTheme.js` |
| Módulo de contenido | sustantivo plural, `camelCase` | `projects.js`, `timeline.js` | `projectData.js`, `Projects.js` |
| Prop | `camelCase` en el script, `kebab-case` en el template | `:live-url="p.liveUrl"` | `:liveURL`, `:live_url` |
| Evento emitido | `kebab-case`, verbo en pasado | `@theme-changed`, `@lightbox-closed` | `@onThemeChange`, `@ThemeChanged` |
| Clase CSS | `kebab-case` plano, sin BEM | `.project-card`, `.card-title` | `.project__card`, `.projectCard`, `.card--title` |
| Modificador de estado | prefijo `is-` o `has-` | `.is-open`, `.is-visible`, `.is-scrolled` | `.open`, `.active`, `.visible` |
| Variante de componente | sufijo con guion simple | `.btn-primary`, `.btn-ghost` | `.btn--primary`, `.btnPrimary` |
| Token CSS | `--categoría-nombre` | `--color-text-muted`, `--dur-slow` | `--textMuted`, `--colorTextMuted` |
| Clave de i18n | `camelCase` anidado por dominio | `nav.projects`, `hero.ctaPrimary` | `NAV_PROJECTS`, `nav-projects` |
| Slug de proyecto | `kebab-case`, estable, nunca se renombra | `tienda-jedami` | `TiendaJedami`, `tienda_jedami` |
| Clave de `localStorage` | prefijo `mc-` | `mc-theme`, `mc-lang` | `theme`, `darkMode` |

**Regla de oro sobre el vocabulario de clases:** el design system verificado en
`public/ui-generated/_system/components.css` es normativo. Toda clase que ya exista ahí se
porta **con el mismo nombre**. Nadie inventa un sinónimo. El inventario canónico:

```
Chasis     .site-header .header-inner .logo .logo-mark .nav .nav-list .nav-link
           .nav-indicator .header-actions .icon-btn .theme-btn .lang-btn .menu-btn
           .mobile-menu .mobile-list .mobile-link .nav-scrim .site-footer .footer-inner
Primitivas .btn .btn-primary .btn-ghost .chip .chips .chips-sm .ico .ico-lg .container
           .container-narrow .skip-link .card-title-link
Estados    .is-open .is-visible .is-active .is-scrolled .is-ready .is-loaded .is-scrolled
Animación  .reveal .mask .mask-in
```

**Convenciones de base de datos y de API:** no aplican — el proyecto no tiene ninguna de las dos.

### Structure Patterns

- **Componentes organizados por rol, no por vista.** `components/layout/`,
  `components/ui/`, `components/sections/`. Un componente usado por dos vistas nunca se
  duplica: se sube a `ui/`.
- **Un archivo, un componente.** Sin componentes anónimos definidos dentro de otro `.vue`.
- **Los estilos de componente van en el `<style scoped>` del `.vue`**, salvo los del design
  system, que viven en `src/styles/` y son globales. Un componente nunca redefine un token.
- **Composables en `src/composables/`, uno por archivo, con export nombrado.** `src/stores/`
  desaparece.
- **Assets referenciados desde `src/assets/`** para que webpack los versione con hash.
  `public/` queda solo para lo que debe existir con nombre fijo: `index.html`, favicons,
  `robots.txt`, el CV en PDF y el manifest.
- **Tests co-ubicados** en `tests/unit/` si alguna vez se escriben (diferido).

### Format Patterns

**Formatos de datos internos:**

- Campos en `camelCase` en todos los módulos de `src/content/` (`liveUrl`, no `live_url`).
- Los arrays son la forma canónica de toda colección ordenada; el orden del array **es** el
  orden de presentación. Ninguna vista reordena por su cuenta.
- Ausencia de valor: `null` explícito, nunca `undefined` ni cadena vacía. Un proyecto sin
  demo en vivo declara `liveUrl: null`, y el template decide si renderiza el botón.
- Sin fechas en formato libre: la trayectoria usa `{ from: 2023, to: null }` con `null` = "actualidad".

**Sin formatos de API, de respuesta ni de error:** no hay red.

### Communication Patterns

**Estado:**

- El estado global vive **solo** en `useTheme` y `useLocale`. Cualquier otro dato compartido
  entre componentes se pasa por props hacia abajo y por eventos hacia arriba.
- Los `ref` de módulo de los composables son de **solo lectura para el consumidor**: se muta
  únicamente a través de las funciones que el propio composable expone (`setTheme`, `toggleLocale`).
  Ningún componente escribe `theme.value = ...` directamente.
- Prohibido el bus de eventos global y prohibido `provide/inject` para estado mutable.
  Con cuatro vistas, la trazabilidad vale más que el ahorro de una prop.

**Persistencia:**

- Toda escritura a `localStorage` pasa por el composable dueño de esa clave. El script inline
  de `public/index.html` es el único otro lugar autorizado a **leer** esas claves, y debe usar
  literalmente los mismos nombres (`mc-theme`, `mc-lang`).

**DOM:**

- Los atributos `data-theme` y `lang` se estampan siempre sobre `document.documentElement`,
  nunca sobre `<body>`. El código actual usa `body.classList` y es lo que se está reemplazando.

### Process Patterns

**Manejo de errores:** la única condición de error del sistema es un `slug` inexistente, y se
resuelve en el `beforeEnter` del router (D5). Ningún componente implementa estado de error.
Los errores de carga de imagen se degradan visualmente con `background: var(--color-surface)`
en el contenedor, sin JavaScript.

**Estados de carga:** no existen. No hay datos asíncronos. Ningún componente debe implementar
un spinner, un skeleton ni una bandera `isLoading`. Si un agente siente la necesidad de uno,
es señal de que introdujo una asincronía que no corresponde.

**Movimiento — reglas no negociables:**

1. Solo se anima `transform` y `opacity`. Nunca `width`, `height`, `top`, `left` ni `margin` (NFR-02).
2. Todo elemento animado debe ser legible en su estado final aunque la animación no se ejecute.
   El estado inicial oculto se aplica solo dentro de `@media (prefers-reduced-motion: no-preference)`.
3. Ninguna clase de utilidad de animación declara `display`. Es la causa raíz de un defecto ya
   sufrido: `.mask-in { display: block }` pisó `.chips { display: flex }` por igual especificidad
   y orden posterior, y apiló los chips del hero a ancho completo.
4. Un gesto protagónico por sección. El resto acompaña.
5. Ninguna entrada supera los 900 ms.

**Consola:** cero salida en producción. Todo `console.*` va envuelto en
`if (process.env.NODE_ENV !== 'production')` (M7).

**Accesibilidad — verificaciones obligatorias por componente interactivo:**

- Alcanzable por teclado y con `:focus-visible` visible (NFR-08).
- Área táctil ≥ 44×44 px (NFR-11).
- Si abre una capa (menú mobile, lightbox): cierra con `Escape`, atrapa el foco mientras está
  abierta y lo devuelve al disparador al cerrar.
- `aria-expanded` en todo disparador de panel; `aria-current="page"` en el enlace de la ruta activa.

### Enforcement Guidelines

**Todo agente que implemente en este proyecto DEBE:**

1. **Consultar el inventario de clases canónicas antes de escribir una clase nueva.** Si el
   elemento ya tiene nombre en el design system, se usa ese nombre. Un sinónimo nuevo es un defecto.
2. **Construir el componente antes que la pantalla.** Ninguna vista define markup que
   pertenezca a un componente reutilizable. Este es el principio que ya se violó una vez en
   este proyecto y costó una unificación completa.
3. **No redefinir ningún token.** `tokens.css` es la única definición. Un `--color-*` en un
   `<style scoped>` es un defecto, no una excepción local.
4. **No hardcodear valores visuales.** Ningún color, espaciado, radio, duración ni curva
   literal en un componente (NFR-15).
5. **No hardcodear texto visible.** Todo string que ve el usuario sale de i18n o de
   `src/content/` (NFR-16).
6. **Verificar en el navegador, no solo compilando.** Antes de dar por cerrada una historia:
   consola sin errores, los tres estados de tema (sin atributo, `dark`, `light`), navegación
   clickeable de verdad, y comportamiento en 390 / 768 / 1280.
7. **Verificar en las cuatro vistas, no en una.** El defecto del z-index del velo del menú
   mobile existía en dos de las cuatro pantallas y pasó desapercibido porque solo se revisó la Home.

**Cómo se verifica el cumplimiento:**

| Regla | Verificación |
|---|---|
| Cero tokens redefinidos | `grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-" src/ --include=*.vue` debe salir vacío |
| Cero colores hardcodeados | `grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\(" src/ --include=*.vue` debe salir vacío |
| Cero texto en template | Revisión manual: ningún nodo de texto literal fuera de `{{ t(...) }}` o de un binding a `content` |
| Cero orígenes externos | Pestaña de red del navegador: ninguna petición fuera de marcecode.com |
| Cero salida en consola | Consola limpia en el build de producción |
| Un solo componente por elemento | `find src/components -name "*.vue"` no debe contener dos archivos que rendericen la misma cosa |

### Pattern Examples

**Correcto — un componente que consume el sistema:**

```vue
<template>
  <article class="project-card reveal" v-reveal>
    <img class="project-image" :src="image" :alt="title" width="800" height="500" loading="lazy" />
    <h3 class="card-title">
      <RouterLink class="card-title-link" :to="{ name: 'project-detail', params: { slug } }">
        {{ title }}
      </RouterLink>
    </h3>
    <p class="card-summary">{{ summary }}</p>
    <ul class="chips chips-sm">
      <li v-for="tech in stack" :key="tech" class="chip">{{ tech }}</li>
    </ul>
  </article>
</template>
```

Usa clases del inventario canónico, no redefine tokens, el texto llega por props desde el
módulo de contenido, la imagen declara dimensiones, y el título enlaza al detalle.

**Anti-patrones — cada uno corresponde a un defecto realmente ocurrido en este proyecto:**

```vue
<!-- ❌ Sinónimo de una clase que ya existe -->
<nav class="nav__menu">          <!-- el canónico es .mobile-menu -->

<!-- ❌ Token redefinido en un scope local -->
<style scoped>
  .hero { --color-accent: #FF7948; }
</style>

<!-- ❌ Valor visual hardcodeado -->
<style scoped>
  .card { border-radius: 12px; transition: all 320ms; }
</style>

<!-- ❌ Texto visible en el template -->
<h2>Proyectos destacados</h2>

<!-- ❌ Utilidad de animación que declara display -->
<style>
  .mask-in { display: block; opacity: 0; }
</style>

<!-- ❌ Animar una propiedad que dispara layout -->
<style scoped>
  .card:hover { margin-top: -6px; }   /* debe ser transform: translateY(-6px) */
</style>

<!-- ❌ Escribir el estado global por fuera de su composable -->
<script setup>
  const { theme } = useTheme()
  theme.value = 'dark'               /* debe ser setTheme('dark') */
</script>
```

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
portfolio/
├── Dockerfile                          # sin cambios (node:24-alpine → nginx:alpine)
├── docker-compose.prod.yml             # sin cambios
├── nginx.conf                          # MODIFICADO — no-cache de index.html/SW, CSP, Referrer-Policy
├── Makefile                            # sin cambios
├── package.json                        # MODIFICADO — línea base de versiones, 3 dependencias removidas
├── vue.config.js                       # MODIFICADO — title del HTML y, si hace falta, alias de vue-i18n
├── babel.config.js  jest.config.js  jsconfig.json  .eslintrc.js  .browserslistrc
├── .github/workflows/deploy.yml        # sin cambios
├── _bmad-output/planning-artifacts/    # prd.md · ux-design-specification.md · ui-handoff.md
│   │                                   # architecture.md · epics.md · ui-prompts/
├── public/
│   ├── index.html                      # MODIFICADO — script inline de tema/idioma, OG/Twitter,
│   │                                   #   meta description; se ELIMINA el <link> a Google Fonts
│   ├── favicon.svg  favicon.ico  robots.txt
│   ├── Marcelo Olivera - Curriculum Vitae.pdf
│   ├── og-image.webp                   # NUEVO — imagen de previsualización (NFR-20)
│   └── certificado.pdf                 # ELIMINADO → reemplazado por src/assets/img/certificado.webp
├── src/
│   ├── main.js                         # MODIFICADO — importa tokens.css; sin Font Awesome
│   ├── App.vue                         # REESCRITO — chasis: AppSprite + AppNav + router-view
│   │                                   #   + AppFooter + aviso de actualización del SW
│   ├── registerServiceWorker.js        # MODIFICADO — evento de update, logs solo en dev
│   ├── i18n.js                         # REDUCIDO — solo createI18n; los mensajes salen a locales/
│   │
│   ├── styles/
│   │   ├── tokens.css                  # NUEVO — portado de _system/tokens.css. Única definición
│   │   ├── base.scss                   # NUEVO — reset, tipografía base, .container, .skip-link,
│   │   │                               #   grano, focus-visible, @media prefers-reduced-motion
│   │   ├── animations.scss             # NUEVO — .reveal/.is-visible, .mask/.mask-in, keyframes
│   │   ├── fonts.scss                  # NUEVO — @font-face de las tres familias, font-display: swap
│   │   ├── main.scss                   # REESCRITO — solo imports; sin el bloque .dark-mode !important
│   │   └── sass/                       # ELIMINADO por completo (variables/ y modules/)
│   │
│   ├── content/                        # NUEVO — fuente única de contenido (D4)
│   │   ├── projects.js                 # 3 proyectos + bySlug() + featured
│   │   ├── skills.js                   # frontend / backend / tools
│   │   ├── timeline.js                 # formación · experiencia · personal
│   │   └── contact.js                  # WhatsApp · email · LinkedIn · GitHub
│   │
│   ├── locales/                        # NUEVO — solo textos de interfaz (D13)
│   │   ├── es.json
│   │   └── en.json
│   │
│   ├── composables/
│   │   ├── useTheme.js                 # NUEVO — ref de módulo + persistencia mc-theme
│   │   ├── useLocale.js                # NUEVO — reemplaza stores/langStore.js
│   │   ├── useReducedMotion.js         # NUEVO — origen único de verdad para NFR-07
│   │   └── useDownloadPdf.js           # MIGRADO desde .vue a .js
│   │
│   ├── directives/
│   │   └── reveal.js                   # NUEVO — IntersectionObserver único compartido (D7)
│   │
│   ├── router/
│   │   └── index.js                    # REESCRITO — 4 rutas, meta SEO, scrollBehavior,
│   │                                   #   beforeEnter de slug, guard de View Transitions
│   │
│   ├── views/
│   │   ├── HomeView.vue                # REESCRITO
│   │   ├── ProjectsView.vue            # REESCRITO
│   │   ├── ProjectDetailView.vue       # NUEVO — /projects/:slug
│   │   └── AboutView.vue               # REESCRITO
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppNav.vue              # nav + indicador animado + menú mobile + velo
│   │   │   ├── AppFooter.vue           # reemplaza FooterPage.vue
│   │   │   └── AppSprite.vue           # sprite SVG inline, montado una vez
│   │   ├── ui/
│   │   │   ├── AppButton.vue           # reemplaza ButtonCustom.vue — primary/secondary/ghost
│   │   │   ├── SectionHeading.vue      # reemplaza MainTitle/SubTitle/SectionTitle/ProjectTitle
│   │   │   ├── StackChip.vue
│   │   │   ├── AppIcon.vue             # <svg class="ico"><use href="#i-…"/></svg>
│   │   │   ├── ThemeToggle.vue
│   │   │   ├── LangToggle.vue
│   │   │   ├── AppLightbox.vue         # certificado ampliable, cierre con Escape (FR-19)
│   │   │   └── ScrollCue.vue           # indicador del hero (FR-09)
│   │   └── sections/
│   │       ├── HeroSection.vue         # entrada A1
│   │       ├── ProjectCard.vue         # reemplaza ItemProject.vue — featured/compact
│   │       ├── ProjectGrid.vue         # reemplaza ListProjects.vue
│   │       ├── SkillGrid.vue           # reemplaza SkillList.vue + ItemSkill.vue
│   │       ├── TimelineSection.vue     # reemplaza MyStory.vue — animación A8
│   │       ├── TimelineItem.vue
│   │       └── ContactSection.vue      # NUEVO (FR-23→25)
│   │
│   └── assets/
│       ├── fonts/                      # NUEVO — woff2 self-hosted (D8)
│       │   ├── space-grotesk-{500,700}.woff2
│       │   ├── inter-{400,600}.woff2
│       │   └── jetbrains-mono-400.woff2
│       └── img/                        # .png/.jpeg actuales convertidos a .webp (D10)
│           ├── jedami-preview.webp  pokemon-preview.webp  chat-preview.webp
│           ├── retrato.webp            # desde photo.jpeg — candidato a LCP
│           └── certificado.webp        # desde certificado.pdf
├── tests/unit/                         # example.spec.js — sin cambios (diferido)
└── docs/                               # vacío
```

**Componentes eliminados:** `ButtonCustom.vue`, `FooterPage.vue`, `NavBar.vue`,
`ItemProject.vue`, `ListProjects.vue`, `ItemSkill.vue`, `SkillList.vue`, `MyStory.vue`,
`PdfViewer.vue`, `MainTitle.vue`, `ProjectTitle.vue`, `SectionTitle.vue`, `SubTitle.vue`,
`stores/langStore.js`, y todo `styles/sass/`. Trece componentes se consolidan en quince
canónicos con responsabilidades disjuntas; los cuatro de título colapsan en uno solo.

### Architectural Boundaries

**Fronteras de API:** ninguna. El sistema no expone ni consume endpoints. Las únicas URLs
externas son enlaces de navegación del usuario (GitHub, sitios en vivo, WhatsApp, LinkedIn),
que salen del documento y no vuelven.

**Fronteras de componentes:**

```
App.vue  ─┬─ AppSprite      (sin props — solo aporta los <symbol> al documento)
          ├─ AppNav         (lee useTheme + useLocale + useRoute; no recibe props)
          ├─ RouterView     (las vistas reciben datos por import estático o por props de ruta)
          └─ AppFooter      (lee useLocale)

Vista  ──►  Sección  ──►  Primitiva de ui/
       props            props
       ◄── evento       ◄── evento
```

Regla: los componentes de `ui/` son **puros** — no importan de `content/`, no leen el router
y no tocan composables de estado global salvo `ThemeToggle` y `LangToggle`, cuya única razón
de existir es ese estado. Los de `sections/` reciben sus datos por props. Solo las vistas
importan de `src/content/`.

**Fronteras de estado:** dos y solo dos valores globales — `theme` y `locale` — cada uno con
un dueño único (`useTheme`, `useLocale`) que es el único autorizado a mutarlo y a persistirlo.
Todo lo demás es estado local de componente.

**Fronteras de datos:** `src/content/*` es de solo lectura en runtime. Ningún módulo lo muta.
La resolución `slug → proyecto` ocurre exclusivamente en `router/index.js` vía `bySlug()`;
ninguna vista busca por su cuenta dentro del array.

**Frontera de estilos:** `src/styles/` es global y normativo; `<style scoped>` de componente
es local y **consume** tokens sin definirlos. Cruzar esa frontera en sentido inverso —
un componente que define un token — es un defecto.

### Requirements to Structure Mapping

| Grupo de FRs | Vive en |
|---|---|
| FR-01→04 · Navegación y estructura | `router/index.js`, `components/layout/AppNav.vue`, `App.vue` |
| FR-05→09 · Home | `views/HomeView.vue`, `components/sections/HeroSection.vue`, `components/ui/ScrollCue.vue` |
| FR-10→16 · Proyectos | `content/projects.js`, `views/ProjectsView.vue`, `views/ProjectDetailView.vue`, `components/sections/{ProjectCard,ProjectGrid}.vue` |
| FR-17→20 · Sobre mí | `content/timeline.js`, `views/AboutView.vue`, `components/sections/{TimelineSection,TimelineItem}.vue`, `components/ui/AppLightbox.vue` |
| FR-21→22 · Habilidades | `content/skills.js`, `components/sections/SkillGrid.vue` |
| FR-23→25 · Contacto | `content/contact.js`, `components/sections/ContactSection.vue`, `AppFooter.vue` |
| FR-26→28 · Tema | `styles/tokens.css`, `public/index.html` (script inline), `composables/useTheme.js`, `components/ui/ThemeToggle.vue` |
| FR-29→30 · Idioma | `locales/{es,en}.json`, `content/*` (clave `i18n`), `composables/useLocale.js`, `components/ui/LangToggle.vue` |

| Preocupación transversal | Vive en |
|---|---|
| Tokens y sistema visual (NFR-15) | `styles/tokens.css` + `styles/base.scss` |
| Movimiento (A1–A9, NFR-02/07) | `styles/animations.scss`, `directives/reveal.js`, `composables/useReducedMotion.js`, guard de transiciones en `router/index.js` |
| SEO y compartición (NFR-19/20) | `route.meta` + guard `afterEach` en `router/index.js`; OG estático en `public/index.html` |
| Accesibilidad (NFR-06→11) | `styles/base.scss` (focus-visible, skip-link), y por componente en `AppNav`, `AppLightbox` |
| PWA y caché (NFR-21) | `registerServiceWorker.js`, aviso en `App.vue`, cabeceras en `nginx.conf` |
| Performance de assets (NFR-04/05) | `assets/fonts/`, `assets/img/`, `styles/fonts.scss`, preloads en `public/index.html` |

### Integration Points

**Comunicación interna:** import estático de módulos ES para el contenido; props y eventos
entre componentes; dos composables singleton para el estado global; `route.meta` para los
metadatos de página. No hay bus de eventos, ni `provide/inject` mutable, ni store centralizado.

**Integraciones externas:** ninguna en runtime, por decisión (D14). En tiempo de build, npm es
la única dependencia externa. Los enlaces salientes — GitHub, jedamiapp.com, la demo de
Pokémon, `wa.me`, `mailto:`, LinkedIn — son navegación del usuario, no integración del sistema.

**Flujo de datos:**

```
src/content/*.js  ──import──►  View  ──props──►  Section  ──props──►  ui/
                                                                        │
localStorage ◄──► useTheme / useLocale ──► [data-theme] / [lang] en <html>
                          │                            │
                          └────► ThemeToggle           └────► tokens.css resuelve el tema
                                 LangToggle                   i18n resuelve los textos

IntersectionObserver (directivas/reveal.js) ──► .is-visible en los elementos observados
router.beforeResolve ──► document.startViewTransition ──► navegación
router.afterEach     ──► document.title + meta description
```

Es un flujo de una sola dirección, sin ciclos: el contenido baja, los eventos suben, y las
dos preferencias globales se proyectan sobre el elemento raíz del documento.

### File Organization Patterns

**Configuración:** toda en la raíz, sin `config/`. `vue.config.js` para el build,
`.eslintrc.js` para lint, `nginx.conf` y `Dockerfile` para el runtime de producción.
No hay archivos `.env`: el sitio no tiene secretos ni configuración por entorno más allá de
`NODE_ENV`, que Vue CLI ya provee.

**Código fuente:** organizado por rol (`layout` / `ui` / `sections`), no por vista, para que
la reutilización sea el camino de menor resistencia. Un componente que dos vistas necesitan
vive en `ui/` o en `sections/` desde el primer uso, nunca duplicado.

**Tests:** `tests/unit/` permanece con la configuración de Jest intacta. Escribir pruebas está
diferido; no se borra la infraestructura para no cerrar la puerta.

**Assets:** todo lo que webpack deba versionar con hash va en `src/assets/`. `public/` queda
reservado para los archivos que necesitan una URL estable y predecible: `index.html`, los
favicons, `robots.txt`, el CV en PDF, la imagen de Open Graph y el manifest del PWA.

### Development Workflow Integration

**Desarrollo:** `npm run serve` sobre el dev server de webpack con HMR. El script inline de
tema funciona igual en desarrollo porque vive en la plantilla `public/index.html` que
`html-webpack-plugin` procesa en ambos modos.

**Build:** `npm run build` emite a `dist/` con hash de contenido en JS, CSS y assets;
`@vue/cli-plugin-pwa` genera `service-worker.js` y el manifest. Los `import()` por ruta
producen un chunk por vista, así que la Home no carga el código del detalle de proyecto.

**Deploy:** el Dockerfile copia `dist/` a `/usr/share/nginx/html`. La estructura no cambia;
lo único que se ajusta es `nginx.conf`, para que los assets con hash sigan siendo inmutables
por un año mientras `index.html` y `service-worker.js` pasan a servirse con `no-cache` (D12).

---

## Architecture Validation Results

### Coherence Validation

**Compatibilidad de decisiones:**

Las versiones fueron verificadas contra el registro de npm y encajan sin conflicto:
`vue-router@4.6.4` exige `vue ^3.5.0`, satisfecho por `vue@3.5.41`; `vue-i18n@11.4.8` exige
`vue ^3.0.0` y Node ≥ 22, satisfecho por el `node:24-alpine` del Dockerfile y por el
`legacy: false` que `i18n.js` ya declara. No hay dependencia que arrastre a otra fuera de rango.

Dos puntos de fricción reales, resueltos por diseño y no por suposición:

- **D6 (View Transitions) × carga diferida por ruta.** Si la transición arrancara antes de
  resolver el componente destino, el fotograma capturado sería una vista vacía. Por eso el
  guard va en `router.beforeResolve` y no en `beforeEach`: `beforeResolve` corre después de
  que los componentes asíncronos ya están resueltos.
- **D2 (script inline) × D3 (composables).** Ambos leen y escriben `mc-theme` y `mc-lang`.
  Es un acoplamiento deliberado y está declarado como dependencia cruzada; el modo de falla
  si divergen —un destello silencioso en cada carga— quedó documentado.

Ninguna decisión contradice a otra. La restricción más fuerte del PRD —no migrar el build
tool— se respeta en todas: ninguna decisión depende de una capacidad exclusiva de Vite.

**Consistencia de patrones:** el vocabulario de clases proviene de un design system ya
verificado en navegador, no de una convención inventada en el papel. Las reglas de nomenclatura
(`kebab-case` plano, estados con `is-`, variantes con guion simple) coinciden con lo que ese
sistema ya usa, así que portar el CSS no exige renombrar nada.

**Alineación estructural:** la organización por rol (`layout` / `ui` / `sections`) sostiene la
regla NFR-17 de un componente canónico por elemento: no existe una carpeta por vista donde
alojar un duplicado. La frontera de estilos —tokens globales, `scoped` que solo consume— se
puede verificar con un `grep`, lo que la vuelve exigible y no meramente aspiracional.

### Requirements Coverage Validation

**Requisitos funcionales — 30 de 30 con soporte arquitectónico:**

| FR | Cubierto por |
|---|---|
| FR-01 | `router/index.js` — 4 rutas, `/projects/:slug` con `props` y `beforeEnter` (D5) |
| FR-02 | `AppNav.vue` — indicador A3; recalcula en cambio de ruta **y** de idioma |
| FR-03 | `AppNav.vue` — `.mobile-menu` + `.nav-scrim`, z-index 90 < 100 < 105 ya resuelto en el sistema |
| FR-04 | `scrollBehavior` con `savedPosition` |
| FR-05→07 | `HeroSection.vue` + `.mask`/`.mask-in` de `animations.scss` |
| FR-08 | `HomeView.vue` consumiendo `projects.filter(p => p.featured)` |
| FR-09 | `ScrollCue.vue` |
| FR-10 | `content/projects.js` (D4) |
| FR-11 | `ProjectGrid.vue` con `grid-template-columns` por breakpoint, sin anchos por índice |
| FR-12→13 | `ProjectCard.vue` |
| FR-14 | `view-transition-name` derivado del slug + degradación a fade (D6) |
| FR-15 | `ProjectDetailView.vue` |
| FR-16 | Regla de patrón: `target="_blank"` siempre con `rel="noopener noreferrer"` |
| FR-17 | `TimelineSection.vue` + animación A8 |
| FR-18 | `content/timeline.js` |
| FR-19 | `AppLightbox.vue` sobre `assets/img/certificado.webp` |
| FR-20 | `composables/useDownloadPdf.js` desde `HeroSection` y `AboutView` |
| FR-21→22 | `content/skills.js` + `SkillGrid.vue` con `v-reveal` escalonado |
| FR-23→24 | `content/contact.js` + `ContactSection.vue` |
| FR-25 | `ContactSection` en Home + los canales en `AppFooter`, presente en las cuatro vistas |
| FR-26→28 | `tokens.css` + script inline (D2) + `useTheme` (D3) |
| FR-29 | `locales/{es,en}.json` + clave `i18n` en `content/*` (D13) |
| FR-30 | Script inline al cargar + `useLocale` al alternar |

**Requisitos no funcionales — 21 de 21 con soporte arquitectónico:**

| NFR | Cubierto por |
|---|---|
| NFR-01 | D8 (fuentes propias), D10 (WebP, retrato sin `lazy`), D14 (cero terceros), chunks por ruta |
| NFR-02 | Regla de patrón no negociable; verificable por revisión de `<style>` |
| NFR-03 | D7 — un solo `IntersectionObserver` para todo el sitio |
| NFR-04 | D10 |
| NFR-05 | D8 — `font-display: swap` + `preload` de los cortes del hero |
| NFR-06 | `tokens.css` ya trae `--color-accent-text` diferenciado para texto chico en tema claro |
| NFR-07 | `useReducedMotion` como origen único + bloque `@media` en `animations.scss` + salto de la transición de ruta |
| NFR-08 | `:focus-visible` en `base.scss`; regla de patrón por componente interactivo |
| NFR-09 | `App.vue` con `header`/`main`/`footer`; una `h1` por vista vía `SectionHeading` con prop de nivel |
| NFR-10 | Regla de patrón; los `alt` salen del contenido traducido |
| NFR-11 | Regla de patrón: 44×44 px mínimo |
| NFR-12 | Verificación obligatoria en 390 / 768 / 1280 antes de cerrar historia |
| NFR-13 | `.browserslistrc` existente + Babel; View Transitions degrada donde no exista |
| NFR-14 | `svh`/`dvh` en `base.scss` |
| NFR-15 | D1 + verificación por `grep` |
| NFR-16 | D13 + verificación por revisión de templates |
| NFR-17 | Organización por rol + inventario canónico de clases |
| NFR-18 | ESLint se mantiene en la versión que el plugin de Vue CLI soporta |
| NFR-19 | D11 — `route.meta` + guard `afterEach` |
| NFR-20 | OG y Twitter Card estáticos en `public/index.html` + `public/og-image.webp` |
| NFR-21 | D12 — el PWA se conserva; se corrige el ciclo de actualización |

### Implementation Readiness Validation

**Completitud de decisiones:** las 14 decisiones están documentadas con su fundamento, sus
versiones verificadas y su secuencia de implementación. Las diferidas están explícitamente
listadas con el motivo, así que ningún agente las va a tomar por olvido.

**Completitud de estructura:** el árbol es concreto —archivo por archivo, con la marca de
NUEVO / MODIFICADO / REESCRITO / ELIMINADO— y no un esqueleto genérico. Los trece componentes
que desaparecen están nombrados uno por uno.

**Completitud de patrones:** doce puntos de conflicto cubiertos, cada anti-patrón anclado a un
defecto que este proyecto ya sufrió, y seis reglas con un comando de verificación asociado.

### Gap Analysis Results

**Brechas críticas — bloquean requisitos concretos:**

1. **No existe captura del proyecto de chat en tiempo real.** `src/assets/icons/` solo tiene
   `jedami-preview.png` y `pokemon-preview.png`. FR-12 exige captura en cada card y FR-15 la
   exige en el detalle. Es una brecha de contenido, no de código, y `TASKS.md` §2 ya la
   registraba desde antes de este rediseño. Sin la imagen, ese proyecto no puede renderizarse
   como los otros dos.
2. **El proyecto de chat no tiene ni URL en vivo ni repositorio** (el PRD lo consigna con
   guiones en ambas columnas). FR-15 describe un detalle con enlaces a sitio y GitHub; para
   este proyecto no hay ninguno. La arquitectura lo absorbe con `liveUrl: null` y
   `repoUrl: null`, y `ProjectCard` / `ProjectDetailView` deben renderizar correctamente el
   caso sin ningún enlace externo. Debe ser un criterio de aceptación explícito, no un
   descubrimiento en tiempo de implementación.

**Brechas importantes — no bloquean, pero cuestan si se descubren tarde:**

3. **FR-04 × D6.** La restauración de la posición de scroll en navegación hacia atrás y
   `startViewTransition` compiten por el mismo instante: el fotograma se captura antes de que
   el scroll se restaure. Debe verificarse explícitamente al implementar D6, y si hay conflicto,
   la salida es saltar la transición en navegación hacia atrás.
4. **FR-02 × FR-29.** El indicador animado del nav se posiciona según el ancho de las
   etiquetas, y esas etiquetas cambian de ancho al cambiar de idioma. Recalcular solo en cambio
   de ruta lo deja desalineado tras alternar ES/EN. Ya quedó incorporado en la fila de FR-02,
   pero es el tipo de detalle que se pierde si no está escrito.
5. **La cobertura i18n (M5) no tiene verificación automática.** La forma barata es un script
   que compare los conjuntos de claves de `es.json` y `en.json` y falle si difieren.
   No está en el alcance declarado; se anota como palanca disponible.
6. **`certificado.pdf` no necesita rasterizarse.** `src/assets/icons/image.png` ya es la imagen
   del certificado que `MyStory.vue` renderiza hoy. Es la fuente de `certificado.webp`, y el
   PDF de `public/` se elimina sin reemplazo. Se documenta para que nadie reintroduzca un
   visor de PDF.

**Brechas menores:**

7. La imagen de Open Graph requiere URL absoluta (`https://marcecode.com/og-image.webp`);
   una ruta relativa no funciona al compartir.
8. `TASKS.md` §5 pide actualizar el contenido del CV. Es trabajo de contenido, ajeno a la
   arquitectura, pero conviene que viaje junto al rediseño para no publicar un CV desactualizado.
9. `docs/` está vacío. Si se quiere, es el lugar natural para el `ui-handoff.md`.

### Validation Issues Addressed

Las brechas 1 y 2 se resuelven convirtiéndolas en criterios de aceptación explícitos de las
historias de proyectos, no ocultándolas: el módulo de contenido admite `liveUrl: null` /
`repoUrl: null` desde su definición, y la falta de captura queda como tarea de contenido
previa a cerrar la fase F3. Las brechas 3 y 4 quedan como verificaciones obligatorias dentro
de las historias correspondientes. Las brechas 5 a 9 se registran sin acción, por estar fuera
del alcance declarado o por ser trabajo de contenido.

### Architecture Completeness Checklist

**Análisis de requisitos**

- [x] Contexto del proyecto analizado sobre los documentos **y sobre el código real**
- [x] Escala y complejidad evaluadas
- [x] Restricciones técnicas identificadas, incluidas las que los documentos no registraban
- [x] Siete preocupaciones transversales mapeadas

**Decisiones arquitectónicas**

- [x] 14 decisiones documentadas, con versiones verificadas contra npm
- [x] Stack completamente especificado
- [x] Patrones de integración definidos
- [x] Performance abordada por decisión, no por buena intención

**Patrones de implementación**

- [x] Convenciones de nomenclatura establecidas, ancladas al design system verificado
- [x] Patrones de estructura definidos
- [x] Patrones de comunicación especificados
- [x] Patrones de proceso documentados (errores, movimiento, consola, accesibilidad)

**Estructura del proyecto**

- [x] Árbol completo, archivo por archivo, con el estado de cada uno
- [x] Fronteras de componentes, estado, datos y estilos establecidas
- [x] Puntos de integración mapeados
- [x] Los 30 FRs y los 21 NFRs mapeados a ubicaciones concretas

### Architecture Readiness Assessment

**Estado general:** LISTA PARA IMPLEMENTACIÓN, con dos brechas de contenido registradas.

**Nivel de confianza:** alto. Sostenido por tres cosas: el stack está fijado por restricción y
no por elección, así que hay poco margen de deriva; el design system ya fue construido y
medido en navegador, así que el objetivo visual es verificable y no interpretativo; y los
patrones de consistencia derivan de defectos que este proyecto ya sufrió, no de un checklist
genérico.

**Fortalezas:**

- Superficie técnica chica —sin backend, sin auth, sin red— con el riesgo concentrado en dos
  ejes bien identificados: movimiento y cobertura i18n.
- Un design system previo y verificado como insumo, no como aspiración.
- Cada decisión con un fundamento anclado en un FR/NFR concreto.
- Deuda técnica identificada por nombre y con destino: eliminar, no migrar.

**Áreas para el futuro:** migración a Vite, TypeScript, pruebas unitarias, Lighthouse CI en el
pipeline, y verificación automatizada de la paridad de claves i18n.

### Implementation Handoff

**Guía para los agentes de implementación:**

- Este documento es la fuente de verdad de toda decisión técnica. Ante una duda arquitectónica,
  se consulta acá antes de improvisar.
- El design system de `public/ui-generated/_system/` es normativo para nombres de clase,
  tokens y markup del chasis. No se reinterpreta.
- Se construye el componente antes que la pantalla. Sin excepción.
- Se verifica en el navegador, en las cuatro vistas y en los tres estados de tema, antes de dar
  por cerrada cualquier historia.

**Primera prioridad de implementación:**

```bash
npm i vue@3.5.41 vue-router@4.6.4 vue-i18n@11.4.8
npm i -D sass@1.102.0 @vue/cli-service@5.0.9
npm rm pdfjs-dist @fortawesome/fontawesome-free font-awesome-icons
```

Seguido de D1 (tokens en runtime) y D2 (`data-theme` y `lang` antes del primer pintado).
Nada más puede empezar antes de esos dos.
