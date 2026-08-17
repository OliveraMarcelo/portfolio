# Story 4.5: Vista de detalle de proyecto

Status: ready-for-dev

## Story

As a desarrollador evaluando el trabajo,
I want leer qué problema resolvió el proyecto y con qué,
so that pueda juzgar la calidad de la ejecución antes de ir al código.

## Acceptance Criteria

**AC1 — La ruta resuelve el proyecto**

**Given** la ruta `/projects/:slug` registrada en el router
**When** se define
**Then** resuelve el proyecto con `bySlug()` y lo pasa como prop a `ProjectDetailView.vue` (FR-01)
**And** un `beforeEnter` redirige a `/projects` cuando el slug no existe

**AC2 — Slug inválido sin pantalla rota**

**Given** un slug inexistente escrito a mano en la barra de direcciones
**When** se carga
**Then** el visitante termina en `/projects` sin ver ningún error ni pantalla vacía

**AC3 — Contenido del detalle**

**Given** la vista de detalle de un proyecto válido
**When** se renderiza
**Then** presenta imagen grande, problema, solución, rol, stack completo y los enlaces a sitio en vivo y a GitHub (FR-15)
**And** el título del proyecto es la única `h1` de la vista

**AC4 — El proyecto sin enlaces externos**

**Given** el proyecto de mensajería en tiempo real, sin enlaces externos
**When** se abre su detalle
**Then** la vista se renderiza completa, sin botones de enlace y sin espacios vacíos

**AC5 — Enlaces seguros**

**Given** los enlaces externos de la vista
**When** se inspeccionan
**Then** llevan `target="_blank"` y `rel="noopener noreferrer"` (FR-16)

**AC6 — Metadatos propios**

**Given** la ruta de detalle
**When** se navega a ella
**Then** el título del documento y la meta description reflejan el proyecto abierto (NFR-19)

## Tasks / Subtasks

- [ ] **Tarea 1 — Registrar la ruta** (AC: #1, #2)
  - [ ] En `src/router/index.js`, la cuarta ruta con `name: 'project-detail'`
  - [ ] `props: (route) => ({ project: bySlug(route.params.slug) })`
  - [ ] `beforeEnter: (to) => (bySlug(to.params.slug) ? true : { name: 'projects' })`
  - [ ] `component: () => import('../views/ProjectDetailView.vue')` — diferido, como las otras tres

- [ ] **Tarea 2 — Metadatos dinámicos** (AC: #6)
  - [ ] El guard `afterEach` de la historia 2.1 usa claves fijas; esta ruta necesita el título del proyecto
  - [ ] Resolver con una `meta.title` como función, o con un caso especial en el guard (ver §Metadatos que dependen del dato)

- [ ] **Tarea 3 — Construir `ProjectDetailView.vue`** (AC: #3, #4)
  - [ ] Prop `project` (Object, requerido) — la vista **no** lee `route.params` (ver §La vista es pura)
  - [ ] Estructura portada de `proyecto-detalle/index.html`: `.project-head` (con `.project-title` y `.project-lede`), `.project-media` con `.project-img`, la ficha de datos, los bloques de lectura y el stack completo
  - [ ] El título del proyecto es la `h1`
  - [ ] Todos los textos salen de `project.i18n[locale]`; las etiquetas —"Problema", "Rol"— de los locales

- [ ] **Tarea 4 — Acciones** (AC: #4, #5)
  - [ ] `AppButton` con `href` para sitio en vivo y repositorio, con `v-if` sobre cada URL
  - [ ] Íconos `i-external` e `i-github`
  - [ ] Verificar el layout con cero botones

- [ ] **Tarea 5 — La imagen grande** (AC: #3)
  - [ ] Mismo asset que la card, en tamaño grande
  - [ ] `width`, `height`, `alt` descriptivo
  - [ ] **Sin** `loading="lazy"`: en esta vista es el elemento sobre el pliegue y candidato a LCP
  - [ ] Usar las clases `.project-media` y `.project-img`, alineadas con la card por la historia 4.2

- [ ] **Tarea 6 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Abrir los tres proyectos y confirmar que los seis campos se ven
  - [ ] Escribir un slug inválido en la barra de direcciones y confirmar la redirección
  - [ ] Confirmar que el detalle del chat se ve completo sin botones
  - [ ] Confirmar una sola `h1` y los metadatos por proyecto
  - [ ] Alternar idioma dentro del detalle

## Dev Notes

Es la vista **nueva** del rediseño y el momento crítico del recorrido J2: el tech lead que llegó desde
una card quiere leer el problema, la solución y el rol antes de ir a GitHub.
[Source: prd.md#4.2 Recorridos críticos, J2]

### La vista es pura

**D5 en la arquitectura:** el proyecto se resuelve en el router y se pasa como prop.

```js
{
  path: '/projects/:slug',
  name: 'project-detail',
  component: () => import('../views/ProjectDetailView.vue'),
  props: (route) => ({ project: bySlug(route.params.slug) }),
  beforeEnter: (to) => (bySlug(to.params.slug) ? true : { name: 'projects' }),
}
```

Dos consecuencias, y las dos son el punto:

1. **El slug inexistente se resuelve antes de montar la vista**, así que `ProjectDetailView` nunca
   necesita un estado de "no encontrado" ni una rama de render vacía. No escribas un `v-if="project"`:
   si la vista se montó, el proyecto existe.
2. **La vista no lee `route.params`.** Recibe el objeto y lo renderiza. Eso la deja pura y renderizable
   sin router — lo que además hace trivial verificarla con cualquier proyecto.

La resolución `slug → proyecto` ocurre **exclusivamente** acá. Ninguna vista busca por su cuenta dentro
del array.
[Source: architecture.md#Frontend Architecture, D5]

### Metadatos que dependen del dato

El guard de la historia 2.1 traduce una clave fija por ruta. Esta ruta necesita el título del proyecto,
que depende del parámetro.

Dos formas, las dos válidas:

1. **`meta.title` como función:** `meta: { title: (route) => bySlug(route.params.slug)?.i18n[locale].title }`.
   El guard detecta si es función y la invoca. Generaliza bien.
2. **Un caso en el guard:** si `to.name === 'project-detail'`, armar el título desde el proyecto.
   Más directo, menos elegante.

Con una sola ruta dinámica, la 2 alcanza. Si elegís la 1, dejá el guard preparado para ambos casos.

El título debe incluir el nombre del proyecto y el del sitio, y traducirse: la historia 7.4 va a
verificar el `document.title` en los dos idiomas.

### El detalle sin enlaces externos

`chat-tiempo-real` tiene `liveUrl: null` y `repoUrl: null`. FR-15 describe un detalle **con** enlaces a
sitio y GitHub; para este proyecto no hay ninguno.

Está registrado como **brecha crítica** en la validación de arquitectura, con esta resolución: el módulo
admite `null` desde su definición y la vista tiene que renderizar bien el caso. Es criterio de
aceptación (AC4), no un descubrimiento en tiempo de implementación.

Concretamente: si no hay ninguna URL, no rendericés el contenedor de acciones. Un bloque vacío con
padding y borde se ve como un error.
[Source: architecture.md#Gap Analysis Results, brecha 2]

### Extras del prototipo que están fuera de alcance

`proyecto-detalle/page.css` trae tres cosas que **ningún FR pide**:

| Extra del prototipo | Estado |
|---|---|
| `.read-progress` — barra de progreso de lectura | **Fuera de alcance** |
| `.crumbs` — migas de pan | **Fuera de alcance** |
| `.next` — card de "siguiente proyecto" | **Fuera de alcance** |

Los tres son razonables y algunos ayudarían a J2. Pero no están en el PRD, y sumarlos acá es ampliar el
alcance por cuenta propia. **No los portes.** Si Marcelo los quiere, es una decisión de alcance que se
toma explícitamente y suma historias, no algo que se cuela en la implementación.

Lo mismo aplica a `.fact-strip` / `.facts`: portalos **solo** en la medida en que sirvan para mostrar
rol y stack, que sí son FR-15. No agregues datos que el contenido no tiene.

### La imagen del detalle es el LCP de esta vista

Al revés que en la card, acá la imagen está sobre el pliegue. `loading="lazy"` la diferiría y hundiría el
LCP de la vista. Sin `lazy`, con `width` y `height` declarados.

Y usá las clases `.project-media` / `.project-img`, las mismas que la card: es lo que va a permitir que
la historia 4.6 les ponga un `view-transition-name` compartido sin peleas de especificidad. Esa fue la
razón de elegir el prefijo `project-` en la historia 4.2.

### El vocabulario del detalle

Estas clases del prototipo **sí** se portan, y ya usan el prefijo correcto: `.project-head`,
`.project-title`, `.project-lede`, `.project-media`, `.project-media-wrap`, `.project-img`,
`.project-actions`, `.chapters`, `.chapter`, `.chapter-title`, `.chapter-body`, `.stack-groups`,
`.stack-group-title`, `.stack-list`, `.stack-name`.

Van al `<style scoped>` de la vista, **salvo** `.project-media` y `.project-img`, que comparte con la
card y por eso viven en `sections.scss`.

### Guardarraíles

- ❌ **No** leas `route.params` dentro de la vista.
- ❌ **No** escribas un estado de "proyecto no encontrado". El `beforeEnter` lo previene.
- ❌ **No** portes la barra de progreso de lectura, las migas ni la card de siguiente proyecto.
- ❌ **No** le pongas `loading="lazy"` a la imagen del detalle.
- ❌ **No** pongas `.project-media` ni `.project-img` en un `<style scoped>`.
- ❌ **No** dejes un contenedor de acciones vacío cuando no hay URLs.
- ❌ **No** inventes contenido para llenar los bloques. Si falta un dato, marcalo con un comentario.
- ❌ **No** agregues `view-transition-name`: es la historia 4.6.
- ❌ **No** dejes más de una `h1`.
- ❌ **No** hagas que la ruta sea eager. Diferida, como las otras tres.

### Comandos de verificación

```bash
# La vista no toca el router
grep -n "useRoute\|route.params" src/views/ProjectDetailView.vue    # sin resultados

# La resolución ocurre solo en el router
grep -rn "bySlug" src/                                              # router e importaciones, no vistas

# Los extras no se portaron
grep -rn "read-progress\|crumb\|next-card" src/
```

En el navegador:

```js
// Los tres proyectos abren
['tienda-jedami','pokemon-game','chat-tiempo-real'].forEach(s => console.log(s))
// …navegar a cada /projects/<slug>…

// Slug inválido redirige
location.href = '/projects/no-existe'    // termina en /projects

// Una sola h1, metadatos propios
document.querySelectorAll('h1').length   // 1
document.title

// La imagen no es lazy
document.querySelector('.project-img').loading    // 'eager' o vacío

// El detalle del chat no tiene botones ni contenedor vacío
document.querySelectorAll('.project-actions .btn').length
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los tres detalles
abren con sus seis campos; el slug inválido redirige sin error; el detalle del chat se ve completo sin
botones; una sola `h1`; metadatos propios por proyecto y traducidos; enlaces externos con `rel`
completo; la imagen sin `lazy`; consola sin errores ni advertencias del router.

### Project Structure Notes

```
src/views/ProjectDetailView.vue    NUEVO — la cuarta vista
src/router/index.js                MODIFICADO — cuarta ruta + beforeEnter + metadatos dinámicos
src/styles/sections.scss           MODIFICADO — .project-media y .project-img compartidas
src/locales/{es,en}.json           MODIFICADO — etiquetas de los bloques del detalle
```

Con esta historia el sitio pasa a tener las cuatro rutas que FR-01 pide.

### References

- Historia y criterios: [Source: epics.md#Story 4.5]
- D5, resolución en el router: [Source: architecture.md#Frontend Architecture]
- Brecha del proyecto sin enlaces: [Source: architecture.md#Gap Analysis Results]
- Fronteras de datos: [Source: architecture.md#Architectural Boundaries]
- FR-01, FR-15, FR-16: [Source: prd.md#7.1 y #7.3]
- J2, evaluación profunda: [Source: prd.md#4.2]
- NFR-09/19: [Source: prd.md#8.2 y #8.5]
- Pantalla P3, detalle de proyecto: [Source: ux-design-specification.md#6]
- Prompt de generación: [Source: ui-prompts/proyecto-detalle.md]
- Markup y estilos fuente: `public/ui-generated/proyecto-detalle/index.html` y `page.css`

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
