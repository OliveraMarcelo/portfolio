# Story 4.2: Card canónica de proyecto

Status: done

## Story

As a visitante,
I want que cada card me diga qué es el proyecto y con qué está hecho,
so that pueda elegir cuál mirar en detalle.

## Acceptance Criteria

**AC1 — Contenido de la card**

**Given** el componente `src/components/sections/ProjectCard.vue`
**When** recibe un proyecto por props
**Then** muestra la captura, el título, el resumen de una línea y los chips del stack (FR-12)
**And** el título es un enlace a la ruta de detalle usando la clase `.card-title-link`

**AC2 — La imagen no produce salto de layout**

**Given** la imagen de la card
**When** se inspecciona
**Then** declara `width` y `height`, lleva `loading="lazy"` y `decoding="async"`, y tiene `alt` descriptivo

**AC3 — El caso sin enlaces externos**

**Given** un proyecto con `liveUrl` o `repoUrl` en `null`
**When** se renderiza la card
**Then** el botón correspondiente no se muestra y el resto del layout permanece intacto

**AC4 — Enlaces externos seguros**

**Given** un enlace externo de la card
**When** se inspecciona
**Then** lleva `target="_blank"` junto con `rel="noopener noreferrer"` (FR-16)

**AC5 — Un solo componente de card**

**Given** el componente
**When** se busca otro que renderice una card de proyecto
**Then** no existe ninguno: `ItemProject.vue` fue eliminado y este es el único (NFR-17)

## Tasks / Subtasks

- [x] **Tarea 1 — Fijar el vocabulario canónico** (AC: #1, #5)
  - [x] Usar las clases de la tabla de §El vocabulario canónico de la card
  - [x] **No** uses `.card`, `.card-media`, `.card-body`, `.card-img`, `.card-summary` ni `.projects-grid`
  - [x] Portar los estilos a `src/styles/sections.scss` o a `<style>` no scoped del componente: los comparten la Home y Proyectos, y la historia 4.6 los necesita alineados con el detalle

- [x] **Tarea 2 — Construir `ProjectCard.vue`** (AC: #1)
  - [x] Prop `project` (Object, requerido): un elemento de `src/content/projects.js`
  - [x] Prop `variant`: `'featured'` | `'compact'`, default `'featured'`
  - [x] Estructura: `.project-card` → `.project-media` (con `.project-img` y `.project-media-tag`) + `.project-body` (`.project-title` con `.card-title-link`, `.project-summary`, `.chips.chips-sm`, `.project-actions`)
  - [x] Los textos salen de `project.i18n[locale]`, no de claves de i18n

- [x] **Tarea 3 — La imagen** (AC: #2)
  - [x] Resolver el asset desde `project.image` (nombre base, sin extensión ni ruta)
  - [x] `width`, `height`, `loading="lazy"`, `decoding="async"`
  - [x] `alt` descriptivo: el título del proyecto, no "imagen" ni el nombre del archivo
  - [x] `.project-media` con `aspect-ratio: 16 / 10` y la imagen con `object-fit: cover`

- [x] **Tarea 4 — Acciones y enlaces** (AC: #3, #4)
  - [x] Botones a sitio en vivo y a repositorio usando `AppButton` con `href`
  - [x] `v-if` sobre `project.liveUrl` y `project.repoUrl`
  - [x] Íconos `i-external` e `i-github` del sprite
  - [x] Verificar el layout con cero, uno y dos botones

- [x] **Tarea 5 — Eliminar el componente viejo** (AC: #5)
  - [x] Borrar `src/components/projects/ItemProject.vue`
  - [x] Verificar por `grep` que nada lo referencia

- [x] **Tarea 6 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Renderizar los tres proyectos y confirmar que el de chat se ve bien sin botones
  - [x] Confirmar que el título navega al detalle (la ruta llega en la 4.5; hasta entonces el enlace apunta a una ruta inexistente — ver §El enlace del título antes de que exista el detalle)
  - [x] Verificar `alt`, `width`, `height`, `loading` y `decoding` en las tres imágenes
  - [x] Verificar `rel="noopener noreferrer"` en los enlaces externos
  - [x] Alternar idioma y confirmar que título y resumen cambian

## Dev Notes

Esta historia define **el** componente de card del sitio. Lo consumen la Home (historia 4.7) y la vista
de Proyectos (4.3), y su imagen es el elemento compartido de la transición de la 4.6. Es la pieza más
reutilizada del rediseño después del chasis.

FR-12 corrige el problema P4 del PRD: *"Cards con una captura y dos botones. No se cuenta el problema
resuelto, el stack, ni el rol."*

### El vocabulario canónico de la card

Hay que resolver algo antes de escribir markup. **El prototipo tiene dos vocabularios distintos para la
misma card**, porque la unificación extrajo el chasis al sistema pero dejó las secciones sin unificar:

| Home usa | Proyectos usa | **Canónico** |
|---|---|---|
| `.projects-grid` | `.project-grid` | **`.project-grid`** |
| `.project-card` | `.card` | **`.project-card`** |
| `.project-media` | `.card-media` | **`.project-media`** |
| — | `.card-img` | **`.project-img`** |
| — | `.card-media-tag` | **`.project-media-tag`** |
| `.project-body` | `.card-body` | **`.project-body`** |
| `.project-title` | `.card-title` | **`.project-title`** |
| `.project-desc` | `.card-summary` | **`.project-summary`** |
| `.project-actions` | `.card-actions` | **`.project-actions`** |

El prefijo `project-` gana por dos razones concretas, no por gusto:

1. **La vista de detalle ya usa ese prefijo** (`.project-media`, `.project-img`, `.project-media-tag`,
   `.project-actions`, `.project-title`). Alinear la card con el detalle es lo que hace posible que
   compartan el `view-transition-name` de la historia 4.6 sin peleas de especificidad.
2. `.card` es genérico. En un sitio con lightbox, chips y paneles, `.card` invita a que otra cosa lo
   reutilice y aparezca un conflicto.

**Las implementaciones internas más completas están en el CSS de Proyectos** —`aspect-ratio`,
`object-fit: cover`, `flex: 1` en el body, el `.card-media-tag`— así que portá desde ahí y renombrá.

`.card-title-link` **sí se conserva** con ese nombre: ya está en `_system/components.css` y es del
sistema.

### La entrada usa `@keyframes`, no `transition` — y hay un motivo

`home/page.css` trae este comentario, que vale leer entero:

```css
/* La entrada corre como @keyframes (600ms) para dejar el `transition`
   libre para el hover (180ms). Sin fill-mode forwards: al terminar,
   el elemento vuelve a su estilo calculado y el hover funciona. */
```

Si la entrada usara `transition`, competiría con la transición del hover: la card entraría con 600 ms y
después el hover heredaría esa duración, o el hover pisaría la entrada a mitad de camino. Separarlas
—`@keyframes` para entrar, `transition` para el hover— es lo que hace que las dos se sientan bien.

Y el detalle de `backwards` en lugar de `forwards`: al terminar la animación, el elemento vuelve a su
estilo calculado, así el hover parte del estado correcto.

**Portá esa separación.** Es el tipo de decisión que se pierde al "simplificar" y produce un hover que
se siente pesado sin que se entienda por qué.

### El enlace del título antes de que exista el detalle

La ruta `/projects/:slug` se registra en la historia 4.5. Si esta historia genera un `<RouterLink :to="{
name: 'project-detail', … }">` a una ruta que no existe, Vue Router emite una advertencia en consola y
el enlace no navega.

Dos caminos válidos:

1. Implementar 4.2 y 4.5 en el mismo ciclo de trabajo.
2. Que el `to` de esta historia apunte a `/projects/${slug}` como string. Sin ruta registrada no
   navega, pero tampoco advierte por nombre inexistente, y la 4.5 lo hace funcionar sin tocar la card.

Elegí la 2 si vas historia por historia, y dejá el comentario apuntando a la 4.5.

### El caso sin enlaces no es un caso borde

`chat-tiempo-real` tiene `liveUrl: null` y `repoUrl: null`. Su card se renderiza **sin ningún botón de
acción**. Eso significa que:

- El `.project-actions` no debe dejar un hueco vacío ni un borde suelto. Si queda vacío, no lo
  renderices.
- La altura de la card cambia respecto de las otras dos. En una grilla, eso se ve. `height: 100%` en la
  `.project-card` —que el CSS de Proyectos ya trae— lo resuelve.

Probalo con los tres proyectos a la vez, no solo con uno.

### El `alt` de la imagen

`alt` descriptivo (NFR-10) significa el título del proyecto, no `"imagen"`, no `"captura"`, no
`"jedami-preview"`. El texto sale de `project.i18n[locale].title`, así que además se traduce.

La historia 7.4 va a verificar que los `alt` cambien de idioma.

### El `.project-media-tag`

Es la etiqueta chica sobre la imagen —tipografía mono, fondo semitransparente— que el CSS de Proyectos
define. Sirve para el stack principal o el año. **No es obligatoria por ningún FR.** Si la portás,
asegurate de que su texto salga del contenido y no sea literal; si no la usás, no portes su CSS.

### Guardarraíles

- ❌ **No** uses el vocabulario `.card-*`. Usá `.project-*` según la tabla.
- ❌ **No** hagas dos componentes de card. Uno, con la prop `variant` (NFR-17).
- ❌ **No** unifiques la entrada y el hover en una sola `transition`.
- ❌ **No** uses `fill-mode: forwards` en la animación de entrada.
- ❌ **No** pongas `alt="imagen"` ni el nombre del archivo.
- ❌ **No** omitas `width` y `height`: es CLS directo (M4).
- ❌ **No** le pongas `loading="lazy"` a nada del hero — pero acá **sí** va, porque las cards están
  fuera del viewport inicial.
- ❌ **No** renderices un `.project-actions` vacío.
- ❌ **No** implementes el hover: es la historia 4.4.
- ❌ **No** implementes la grilla: es la 4.3.
- ❌ **No** agregues `view-transition-name`: es la 4.6.
- ❌ **No** pongas los estilos de la card en un `<style scoped>` si los va a necesitar el detalle.

### Comandos de verificación

```bash
# Sin el vocabulario viejo
grep -rn 'class="card\b\|card-media\|card-body\|card-img\|card-summary\|projects-grid' src/

# ItemProject desapareció
grep -rn "ItemProject" src/

# Sin texto literal
grep -n ">[A-ZÁÉÍÓÚÑ][a-záéíóúñ]" src/components/sections/ProjectCard.vue
```

En el navegador, con los tres proyectos renderizados:

```js
// Atributos de todas las imágenes de card
[...document.querySelectorAll('.project-img')].map(i =>
  ({ alt: i.alt, w: i.width, h: i.height, loading: i.loading, decoding: i.decoding }))

// Todos los enlaces externos son seguros
[...document.querySelectorAll('.project-card a[target="_blank"]')]
  .every(a => a.rel.includes('noopener') && a.rel.includes('noreferrer'))   // true

// El proyecto sin enlaces no tiene botones, y la card mide igual que las otras
[...document.querySelectorAll('.project-card')].map(c =>
  [c.querySelectorAll('.btn').length, c.getBoundingClientRect().height])
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los tres proyectos
renderizados juntos, con el de chat sin botones y sin huecos; imágenes con `alt` descriptivo,
dimensiones, `lazy` y `decoding`; enlaces externos con `rel` completo; ningún componente de card
duplicado; título y resumen cambian de idioma; consola sin errores ni advertencias del router.

### Project Structure Notes

```
src/components/sections/ProjectCard.vue     NUEVO — reemplaza ItemProject.vue
src/styles/sections.scss                    MODIFICADO — estilos de la card, vocabulario project-*
src/components/projects/ItemProject.vue     ELIMINADO
```

### References

- Historia y criterios: [Source: epics.md#Story 4.2]
- FR-12, FR-16: [Source: prd.md#7.3 Proyectos]
- P4, los proyectos no venden: [Source: prd.md#2.2]
- NFR-04/10/17: [Source: prd.md#8.1, #8.2, #8.4]
- Patrón de ausencia con `null`: [Source: architecture.md#Format Patterns]
- Inventario canónico y regla de sinónimos: [Source: architecture.md#Naming Patterns]
- Estrategia de componentes, `ProjectCard`: [Source: ux-design-specification.md#5]
- Estilos fuente a portar: `public/ui-generated/proyectos/page.css` líneas 108–210
- Separación entrada/hover: `public/ui-generated/home/page.css` líneas 298–330

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2/AC5 — las tres cards, medidas:**

```
imágenes: alt "Jedami Store" / "Pokemon Game"  ·  1200×750  ·  loading=lazy  ·  decoding=async
títulos:  H2 con .card-title-link -> /projects/<slug>
chips:    stack real, el primero con .chip-lead
```

**AC3 — el proyecto sin enlaces:** `[2, 2, 0]` botones por card, y las tres miden **486 px de alto**.
El `height: 100%` de `.project-card` sostiene la altura pese a que una no tiene acciones.

**AC4 —** los cuatro enlaces externos con `rel="noopener noreferrer"`.

**AC5 —** `ItemProject.vue` eliminado; `grep` sin referencias; el vocabulario `.card-*` / `.projects-grid`
ausente de `src/`.

### El vocabulario quedó unificado en `project-*`

Nueve clases renombradas según la tabla de la historia. `.card-title-link` se conserva con su nombre
porque es del sistema.

El CSS va **global** en `sections.scss` y no en un `<style scoped>`, porque lo comparten la Home,
Proyectos y el detalle — y porque la historia 4.6 necesita que card y detalle compartan
`view-transition-name` sin peleas de especificidad.

### Dos reglas hubo que separar por contexto, y una era un defecto

`.project-media` no puede ser la misma en los dos lugares: en la card el borde inferior separa la
imagen del cuerpo, y en el detalle la imagen es una pieza suelta con borde completo y radio. Lo común
quedó global y el marco lo pone cada contexto.

Con `.project-actions` el problema era peor y **habría sido un defecto real**: el bloque
`@media (hover: hover)` de la historia 4.4 las deja en `opacity: 0.6` hasta que se apunta la card. En
el detalle no hay ninguna `.project-card` que las revele, así que los dos botones del detalle habrían
quedado **atenuados de forma permanente**. Se scopearon a `.project-card .project-actions`.

### La variante `quiet`

El prototipo usa `.btn-quiet` para "Ver en vivo" y `.link-underline` para "Ver código", pero
`.btn-quiet` **no está definida en `_system/components.css`**: solo existe su `:hover`. Con `.btn`
declarando `border: 1px solid transparent` y sin fondo, ese botón renderiza invisible en el prototipo.

Se resolvió agregando `quiet` como tercera variante de `AppButton`, con el tratamiento de
`.link-underline` —sin pastilla, subrayado que crece desde la izquierda— bajo el vocabulario `btn-*`.
Un solo componente de botón, tres variantes por prop.

### Lo que no se portó

`.project-media-tag` no la pide ningún FR y su texto en el prototipo es el **nombre del archivo de la
captura**, que no es contenido. No se portó ni su CSS.

### File List
