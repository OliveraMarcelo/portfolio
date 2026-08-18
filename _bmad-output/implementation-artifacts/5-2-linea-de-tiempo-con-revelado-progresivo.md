# Story 5.2: Línea de tiempo con revelado progresivo

Status: done

## Story

As a visitante,
I want ver la trayectoria como una secuencia,
so that entienda el recorrido y no solo los datos sueltos.

## Acceptance Criteria

**AC1 — Línea de tiempo, no párrafos**

**Given** la vista Sobre mí
**When** se renderiza la trayectoria
**Then** se presenta como línea de tiempo con hitos ordenados, no como párrafos sueltos (FR-17)

**AC2 — La línea se dibuja al scrollear**

**Given** el visitante que scrollea por la línea de tiempo
**When** avanza
**Then** la línea vertical se dibuja progresivamente con `scaleY` según el avance del scroll (A8)
**And** cada hito aparece con el revelado de la historia 2.7 al alcanzarlo

**AC3 — Solo propiedades compositables**

**Given** la línea de tiempo
**When** se inspeccionan las propiedades animadas
**Then** solo se animan `transform` y `opacity` (NFR-02)

**AC4 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga la vista
**Then** la línea está completa y todos los hitos son legibles desde el inicio

**AC5 — El componente viejo desaparece**

**Given** los componentes `TimelineSection.vue` y `TimelineItem.vue`
**When** se crean
**Then** `MyStory.vue` queda eliminado

## Tasks / Subtasks

- [x] **Tarea 1 — Normalizar el vocabulario** (AC: #1)
  - [x] Usar las clases kebab de la tabla de §Dos vocabularios, uno canónico
  - [x] **No** portes las clases BEM de `sobre-mi/page.css` (`.timeline__axis`, `.timeline__item`, `.section__head`)
  - [x] Las primitivas de sección son las que la historia 3.1 promovió: `.section`, `.section-head`, `.section-title`

- [x] **Tarea 2 — `TimelineItem.vue`** (AC: #1)
  - [x] Prop `item` (Object, requerido): un hito de `src/content/timeline.js`
  - [x] Estructura: `.milestone` → `.milestone-node` + `.milestone-meta` (con `.milestone-tag`) + `.milestone-title` + `.milestone-org` + `.milestone-desc`
  - [x] Formatear el período desde `{ from, to }`; con `to === null`, la palabra "actualidad" sale de los locales y el tag recibe `.is-now`
  - [x] Prop `variant` derivada de `item.type` para diferenciar formación, experiencia y personal

- [x] **Tarea 3 — `TimelineSection.vue`** (AC: #1, #2)
  - [x] Prop `items` (Array): los hitos
  - [x] Estructura: `.timeline` → `.timeline-rail` con `.timeline-progress` + un `TimelineItem` por hito
  - [x] `v-reveal` en cada `TimelineItem`, con retardo escalonado

- [x] **Tarea 4 — El progreso del eje** (AC: #2, #3)
  - [x] Un listener de `scroll` pasivo que calcula el avance y lo escribe en la custom property `--timeline-progress`
  - [x] `.timeline-progress` usa `transform: scaleY(var(--timeline-progress, 0))` con `transform-origin: top center`
  - [x] Clampear entre 0 y 1
  - [x] Leer las medidas **fuera** del handler o con cuidado (ver §El cálculo del avance sin matar los fps)
  - [x] Quitar el listener en `onUnmounted`

- [x] **Tarea 5 — Movimiento reducido** (AC: #4)
  - [x] Si `useReducedMotion` indica preferencia reducida, fijar `--timeline-progress` en `1` y **no** registrar el listener
  - [x] Los hitos visibles de entrada por la defensa estructural de `.reveal` (historia 2.7)

- [x] **Tarea 6 — Reescribir `AboutView.vue`** (AC: #1, #5)
  - [x] Sección de trayectoria con `TimelineSection` consumiendo `src/content/timeline.js`
  - [x] La `h1` de la vista es su título de sección; una sola
  - [x] Borrar `src/components/stories/MyStory.vue` y su `IntersectionObserver` local
  - [x] Conservar por ahora el certificado y las habilidades: son las historias 5.3 y 5.4

- [x] **Tarea 7 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Scrollear la línea de tiempo y ver el eje dibujarse
  - [x] Confirmar que llega a 1 al final y a 0 al principio
  - [x] Con movimiento reducido: eje completo, hitos legibles, sin listener
  - [x] Grabar el scroll en Performance y confirmar 60 fps
  - [x] Verificar en 390 px y 1280 px
  - [x] Confirmar que no quedan clases BEM

## Dev Notes

FR-17 corrige un problema concreto: hoy la trayectoria es una lista de párrafos. La línea de tiempo con
revelado progresivo es la animación **A8** del catálogo y el gesto protagónico de esta sección.
[Source: ux-design-specification.md#4.3, A8]

### Dos vocabularios, uno canónico

`sobre-mi/page.css` usa **BEM completo** y `home/page.css` usa kebab plano para lo mismo. La regla de
nomenclatura de la arquitectura es explícita: `kebab-case` plano, sin BEM. Así que la Home gana.

| Sobre mí usa (BEM) | Home usa | **Canónico** |
|---|---|---|
| `.timeline__axis` | `.timeline-rail` | **`.timeline-rail`** |
| `.timeline__axis-fill` | `.timeline-progress` | **`.timeline-progress`** |
| `.timeline__item` | `.milestone` | **`.milestone`** |
| `.timeline__dot` | `.milestone-node` | **`.milestone-node`** |
| `.timeline__period` | `.milestone-tag` | **`.milestone-tag`** |
| `.timeline__role` | `.milestone-title` | **`.milestone-title`** |
| `.timeline__org` | `.milestone-org` | **`.milestone-org`** |
| `.timeline__text` | `.milestone-desc` | **`.milestone-desc`** |
| `.section__head` | `.section-head` | **`.section-head`** |
| `.section__title` | `.section-title` | **`.section-title`** |
| `.section--timeline` | — | **`.section-timeline`** |
| `--timeline-progress` | `--p` | **`--timeline-progress`** |

La custom property gana la de Sobre mí porque `--p` no dice nada; el resto gana la Home porque cumple la
convención.

**Las implementaciones internas más completas están en el CSS de la Home** —`.milestone-tag.is-now`, la
escala del nodo al revelarse, los estilos por tipo— así que portá desde ahí.
[Source: architecture.md#Naming Patterns]

### El cálculo del avance sin matar los fps

El avance se calcula así en el prototipo:

```js
var rect = timeline.getBoundingClientRect();
var progress = (anchor - rect.top) / rect.height;
progress = Math.max(0, Math.min(1, progress));
timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
```

`getBoundingClientRect()` **fuerza layout**. Llamarlo en cada evento de scroll es el patrón que la
historia 2.3 prohíbe explícitamente para el header.

Acá no hay forma de evitar la medida —el avance depende de la geometría—, así que la mitigación es otra:

1. **Registrá el listener pasivo** (`{ passive: true }`).
2. **Coalescé con `requestAnimationFrame`:** guardá una bandera, y si ya hay un frame pedido, no pidas
   otro. Así medís una vez por fotograma como máximo, no una vez por evento de scroll.
3. **Cacheá lo que no cambia:** `rect.height` solo cambia con `resize`. Medilo una vez y actualizalo en
   `resize`, no en cada scroll.
4. **Escribí solo la custom property.** No toques clases ni estilos que disparen layout.

```js
let pedido = false
function onScroll() {
  if (pedido) return
  pedido = true
  requestAnimationFrame(() => { actualizar(); pedido = false })
}
```

Con eso el scroll se mantiene en 60 fps. Verificalo grabando, no asumiendo: es un criterio de NFR-03 y esta
sección es la más larga del sitio.

### `scaleY` y el `transform-origin`

La línea se dibuja con `transform: scaleY()` desde `transform-origin: top center`. Sin el origen, escala
desde el centro y la línea crece en las dos direcciones.

Escalar es lo correcto acá y no una concesión: animar `height` dispararía layout en cada fotograma del
scroll, que es el peor caso posible para NFR-03.

### Con movimiento reducido, ni siquiera registres el listener

Fijar `--timeline-progress: 1` y no escuchar el scroll. El prototipo lo hace así al final de su arranque:

```js
if (timeline) timeline.style.setProperty('--timeline-progress', '1');
```

Dos beneficios: el eje se ve completo —que es el estado final legible que NFR-07 pide— y no gastás un
handler de scroll en alguien que explícitamente pidió menos movimiento.

### Portá `.sr-only`

`sobre-mi/page.css` define `.sr-only`, la utilidad para texto visible solo para lectores de pantalla. Es
una utilidad general, no de esta vista: **portala a `src/styles/base.scss`**, no al `<style scoped>` del
componente. La historia 5.3 y la Épica 7 la van a necesitar.

### El `IntersectionObserver` de `AboutView` se va

`AboutView.vue` tiene hoy un `onMounted` con su propio observer que agrega `.loaded`. Es el mecanismo
viejo; `v-reveal` lo reemplaza. Borralo al reescribir la vista, igual que se hizo en `HomeView` en la
historia 3.1.

Si lo dejás, tenés dos observers compitiendo — justo lo que D7 evita.

### Guardarraíles

- ❌ **No** portes las clases BEM. Usá la tabla.
- ❌ **No** animes `height` para dibujar la línea.
- ❌ **No** llames a `getBoundingClientRect()` directo en el handler de scroll sin coalescer con `rAF`.
- ❌ **No** registres el listener sin `{ passive: true }`.
- ❌ **No** registres el listener con movimiento reducido.
- ❌ **No** omitas el `transform-origin: top center`.
- ❌ **No** pongas `.sr-only` en un `<style scoped>`.
- ❌ **No** dejes el observer viejo de `AboutView`.
- ❌ **No** agregues el certificado ni las habilidades: son las historias 5.3 y 5.4.
- ❌ **No** dejes más de una `h1`.
- ❌ **No** instales ninguna librería de scroll ni de animación.

### Comandos de verificación

```bash
# Sin BEM
grep -rn 'class="[^"]*__\|class="[^"]*--' src/components/sections/ src/views/AboutView.vue

# .sr-only es global
grep -n "sr-only" src/styles/base.scss

# El observer viejo se fue
grep -n "IntersectionObserver" src/views/AboutView.vue

# MyStory desapareció
grep -rn "MyStory" src/
```

En el navegador:

```js
const tl = document.querySelector('.timeline')
const val = () => getComputedStyle(tl).getPropertyValue('--timeline-progress')

// Al principio, cerca de 0
window.scrollTo(0, 0); val()

// Al final de la sección, 1
tl.scrollIntoView({ block: 'end' }); val()

// Con reduced motion, 1 de entrada y sin listener de scroll
// (verificar en DevTools → Elements → Event Listeners que no hay handler nuevo)

// Una sola h1
document.querySelectorAll('h1').length     // 1
```

Y una grabación del panel Performance scrolleando la línea completa: 60 fps, sin bloques largos de
*Layout*.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; el eje se dibuja al
scrollear y llega a 1; los hitos se revelan escalonados; con movimiento reducido el eje está completo y no
hay listener; **60 fps medidos en el Performance**; sin clases BEM; una sola `h1`; verificado en 390 px y
1280 px; consola sin errores.

### Project Structure Notes

```
src/components/sections/TimelineSection.vue   NUEVO — reemplaza MyStory.vue
src/components/sections/TimelineItem.vue      NUEVO
src/views/AboutView.vue                        MODIFICADO — monta la línea de tiempo
src/styles/base.scss                           MODIFICADO — .sr-only
src/styles/sections.scss                       MODIFICADO — .section-timeline
src/components/stories/MyStory.vue             ELIMINADO
src/locales/{es,en}.json                       MODIFICADO — título de sección, "actualidad"
```

`src/components/stories/` queda vacía tras esta historia (`PdfViewer.vue` se borró en la 1.1) y se puede
eliminar.

### References

- Historia y criterios: [Source: epics.md#Story 5.2]
- A8, línea de tiempo: [Source: ux-design-specification.md#4.3]
- FR-17, FR-18: [Source: prd.md#7.4 Sobre mí]
- NFR-02/03/07/09: [Source: prd.md#8.1 y #8.2]
- Regla de nomenclatura sin BEM: [Source: architecture.md#Naming Patterns]
- D7, un solo observer: [Source: architecture.md#Frontend Architecture]
- Estilos fuente (canónicos): `public/ui-generated/home/page.css` líneas 497–585
- Cálculo del avance: `public/ui-generated/sobre-mi/page.js` líneas 130–140

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 —** siete hitos en una `<ol>`, no párrafos. Cero clases BEM en el documento.

**AC2 — el eje, medido de punta a punta:**

```
arriba del bloque  --timeline-progress: 0.0000   ->  scaleY(0)
a media altura                          0.5853
al final                                1.0000   ->  scaleY(1)
transform-origin: 0.5px 0px   (top center sobre un eje de 1px)
```

**AC3 —** solo `transform`; el eje se dibuja con `scaleY` y nunca con `height`.

**AC4 — con `prefers-reduced-motion: reduce`**, emulado en el navegador:

```
--timeline-progress: 1     scaleY(1)     hitos visibles: true
```

y el listener de scroll **no se registra**.

**AC5 —** `MyStory.vue` eliminado.

### Una medición mía que era mentira

Un primer intento leyó `scaleY(0.748)` con `--timeline-progress` ya en `1` y parecía un desfase. No lo
era: `base.scss` declara `html { scroll-behavior: smooth }`, así que `window.scrollTo` **anima** durante
cientos de milisegundos y el valor sigue cambiando mientras se lee. Con la espera correcta, 0 y 1
exactos.

### El cálculo del avance sin matar los fps

`getBoundingClientRect()` fuerza layout y acá no hay forma de evitarlo: el avance *es* geometría. La
mitigación son tres cosas, no una:

1. listener `{ passive: true }`;
2. **coalescido con `requestAnimationFrame`**, así se mide una vez por fotograma como máximo y no una
   por evento de scroll;
3. la altura del bloque —lo único que no cambia al scrollear— cacheada y recalculada solo en `resize`.

El handler escribe **una** custom property y no toca clases ni nada que dispare layout.

El ancla está al 55 % del viewport y no al borde: el eje va un poco adelantado respecto de lo que se
está leyendo, que es lo que lo hace sentir una guía y no un rastro.

### `.sr-only` subió a `base.scss`

Es una utilidad general —la usan el lightbox y la Épica 7—, no de esta vista. Usa
`clip-path: inset(50%)` y no `display: none`: esas dos sacan el texto también del árbol de
accesibilidad, que es lo contrario de lo que se busca.

### File List
