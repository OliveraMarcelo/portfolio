# Story 2.2: Indicador animado de la ruta activa

Status: done

## Story

As a visitante,
I want ver con claridad en qué sección estoy,
so that no me pierda dentro del sitio.

## Acceptance Criteria

**AC1 — Estado activo marcado**

**Given** la barra de navegación en escritorio
**When** el visitante está en una ruta
**Then** el enlace correspondiente lleva `.is-active` y `aria-current="page"`
**And** una barra en color de acento se ubica bajo ese enlace

**AC2 — El indicador se desplaza**

**Given** el visitante que navega a otra sección
**When** la ruta cambia
**Then** el indicador se desplaza y ajusta su ancho hasta el nuevo enlace, animando `transform` en `--dur-base` con `--ease-out` (A3, FR-02)

**AC3 — El indicador se adelanta al hover**

**Given** el visitante que pasa el cursor sobre otro enlace
**When** hace hover
**Then** el indicador se adelanta a ese enlace y vuelve al activo al salir

**AC4 — Realineación al cambiar de idioma**

**Given** el visitante que alterna el idioma
**When** las etiquetas cambian de ancho
**Then** el indicador recalcula su posición y queda alineado con el enlace activo

**AC5 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** navega entre secciones
**Then** el indicador aparece directamente en su posición final, sin desplazamiento animado

## Tasks / Subtasks

- [x] **Tarea 1 — Marcar el estado activo** (AC: #1)
  - [x] `<RouterLink>` ya aporta `router-link-active`; agregar `.is-active` con `:class` según `route.name` para no depender del nombre de clase que genera el router
  - [x] `aria-current="page"` en el enlace de la ruta activa

- [x] **Tarea 2 — Posicionar el indicador** (AC: #1, #2)
  - [x] Función que recibe el elemento destino y le asigna al indicador `width = target.offsetWidth` y `transform = translateX(target.offsetLeft)`
  - [x] Agregar `.is-ready` al indicador la primera vez, para que deje de estar invisible
  - [x] Llamarla al montar y en cada cambio de `route.name`, dentro de `nextTick`

- [x] **Tarea 3 — Hover y foco** (AC: #3)
  - [x] `mouseenter` y `focus` en cada `.nav-link` mueven el indicador a ese enlace
  - [x] `mouseleave` en el `.nav-list` —no en cada enlace— devuelve el indicador al activo

- [x] **Tarea 4 — Recalcular cuando cambia la métrica** (AC: #4)
  - [x] En cambio de idioma: observar el `locale` de `useLocale` y reposicionar
  - [x] En `resize` de la ventana
  - [x] Cuando terminan de cargar las fuentes: `document.fonts.ready`
  - [x] Limpiar todos los listeners en `onUnmounted`

- [x] **Tarea 5 — Movimiento reducido** (AC: #5)
  - [x] El bloque global `@media (prefers-reduced-motion: reduce)` de `base.scss` ya anula la transición
  - [x] Verificar que el indicador igual aparece en la posición correcta, no que desaparece

- [x] **Tarea 6 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Navegar entre las tres rutas y ver el desplazamiento
  - [x] Hover sobre los tres enlaces y confirmar el retorno al activo
  - [x] Alternar idioma y medir la alineación (ver §Comandos de verificación)
  - [x] Redimensionar la ventana y confirmar que sigue alineado
  - [x] Recargar con caché deshabilitada y confirmar que no queda desalineado por las fuentes

## Dev Notes

Animación **A3** del catálogo: una barra en acento que se desliza entre los ítems del nav siguiendo
la ruta activa, animando posición y ancho en `--dur-base` con `--ease-out`; en hover se adelanta al
ítem apuntado y vuelve al activo al salir.
[Source: ux-design-specification.md#4.3 Catálogo de animaciones, A3]

El markup ya existe: la historia 1.5 dejó el `<span class="nav-indicator" aria-hidden="true">` en su
lugar y sus estilos en `chassis.scss`. Esta historia solo agrega el comportamiento.

### Las tres causas de desalineación

El indicador se posiciona con medidas del DOM, así que se desalinea cada vez que esas medidas
cambian sin que nadie reposicione. Las tres causas reales, todas con su reposicionamiento
correspondiente en `system.js`:

**1. Cambio de idioma.** "Sobre mí" y "About" no miden lo mismo. Es la causa que se olvida siempre,
porque no se te ocurre probarla: navegás, ves que funciona, cerrás. Ya quedó anticipada como brecha
en la validación de arquitectura y en la historia 1.7.

**2. Carga de fuentes.** Con `font-display: swap`, el nav se pinta primero con la fuente de
respaldo y luego con Space Grotesk. El ancho de las etiquetas cambia en ese momento. Si posicionás
solo al montar, el indicador queda corrido apenas la fuente real llega. Por eso el sistema
reposiciona en `document.fonts.ready`.

**3. Resize.** El `.nav-list` es flex; sus `offsetLeft` cambian con el ancho disponible.

### Medir después del render, no antes

`offsetWidth` y `offsetLeft` devuelven `0` si el elemento todavía no está en el layout. En Vue eso
significa: nunca midas en el mismo tick en que cambiaste el estado que produce el render.

```js
watch(() => route.name, async () => {
  await nextTick()
  placeIndicator()
})
```

El design system usa `requestAnimationFrame` por el mismo motivo. `nextTick` de Vue es el
equivalente idiomático acá.

### El `mouseleave` va en la lista, no en el enlace

Si escuchás `mouseleave` en cada `.nav-link`, mover el cursor de un enlace al de al lado dispara
un `mouseleave` seguido de un `mouseenter`, y el indicador rebota al activo y vuelve a salir. El
resultado es un temblor. Escuchá `mouseleave` una sola vez, en el `.nav-list`.

### `focus` además de `mouseenter`

Que el indicador siga también al foco de teclado no es adorno: es lo que le da a quien navega con
`Tab` la misma información espacial que recibe quien usa mouse (NFR-08).

### Solo escritorio, por ahora

El `.nav` está visible en todos los anchos porque la historia 1.5 lo dejó con `display: flex`
temporalmente. Cuando la historia 2.4 restaure el `display: none` canónico en mobile, el indicador
queda naturalmente fuera de juego ahí. **No agregues un indicador para el menú mobile:** ese usa
`.mobile-link.is-active::before`, que ya está resuelto en CSS.

### Limpiar los listeners

Esta historia agrega listeners a `window` (`resize`) y a los enlaces. `AppNav` vive todo el ciclo
de vida de la aplicación, así que en la práctica nunca se desmonta — pero registrarlos sin
limpiarlos es el patrón que en el HMR de desarrollo va acumulando handlers hasta que el
comportamiento se vuelve errático. Limpialos en `onUnmounted`.

### Guardarraíles

- ❌ **No** animes `width` ni `left`. El ancho se asigna directo; la posición va por
  `transform: translateX()` (NFR-02).
- ❌ **No** midas sin `nextTick`.
- ❌ **No** pongas `mouseleave` en cada enlace.
- ❌ **No** dependas de la clase `router-link-active` para el estilo: agregá `.is-active` explícita.
- ❌ **No** construyas un indicador para el menú mobile.
- ❌ **No** instales ninguna librería de animación.
- ❌ **No** agregues el estado `.is-scrolled` del header: es la historia 2.3.
- ❌ **No** olvides el reposicionamiento por idioma. Es el que se olvida.

### Comandos de verificación

En el navegador, en escritorio:

```js
const ind = document.querySelector('.nav-indicator')
const act = document.querySelector('.nav-link.is-active')

// Alineación: los dos valores tienen que coincidir
ind.getBoundingClientRect().left
act.getBoundingClientRect().left

// Y el ancho también
ind.getBoundingClientRect().width === act.getBoundingClientRect().width

// aria-current presente y único
document.querySelectorAll('[aria-current="page"]').length   // 1
```

Repetí la comparación **después** de alternar el idioma y **después** de redimensionar.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; desplazamiento
visible al navegar; hover que se adelanta y vuelve; alineación medida y coincidente antes y después
de cambiar idioma y de redimensionar; sin desalineación tras la carga de fuentes; con movimiento
reducido el indicador aparece en su lugar sin animarse; consola sin errores.

### Project Structure Notes

```
src/components/layout/AppNav.vue    MODIFICADO — lógica del indicador
src/styles/chassis.scss             MODIFICADO (si falta) — .nav-indicator, .is-ready
```

Ningún archivo nuevo. El markup y los estilos ya los dejó la historia 1.5.

### References

- Historia y criterios: [Source: epics.md#Story 2.2]
- A3, indicador de navegación: [Source: ux-design-specification.md#4.3]
- FR-02: [Source: prd.md#7.1 Navegación y estructura]
- FR-29, cambio de idioma: [Source: prd.md#7.7]
- Brecha FR-02 × FR-29: [Source: architecture.md#Gap Analysis Results]
- NFR-02/07/08: [Source: prd.md#8.1 y #8.2]
- Comportamiento fuente: `public/ui-generated/_system/system.js`, sección "Indicador de nav"

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Alineación medida por ruta** (`left` y ancho del indicador contra el enlace activo):

| Ruta | Activo | Indicador `left` / ancho | Enlace `left` / ancho | Alineado |
|---|---|---|---|---|
| `/` | Home | 792.6 / 70.0 | 792.6 / 70.2 | ✓ |
| `/projects` | Projects | 866.6 / 86.0 | 866.8 / 86.3 | ✓ |
| `/about` | About me | 957.6 / 97.0 | 957.1 / 97.0 | ✓ |

`is-ready` aplicado en las tres.

**AC3 — hover:** en el activo `left: 792.6` → tras hover en el tercer enlace `957.6` → tras
`mouseleave` en la lista, vuelve a `792.6`.

**AC4 — realineación al cambiar de idioma**, la causa que la historia marcaba como la que se olvida:

```
"About me"  ancho 97.0   indicador left 957.6
"Sobre mí"  ancho 91.2   indicador left 963.1   alineado: true
```

El ancho del enlace cambió y el indicador se reajustó.

**NFR-02:** `transition-property` del indicador es `transform, opacity`. Ninguna propiedad de
layout.

### Completion Notes List

Los cinco criterios se cumplen.

**El CSS del sistema ya estaba pensado para animar solo `transform`,** más de lo que la historia
suponía. En lugar de asignar `width` directamente, el indicador tiene 1 px de ancho base y se
posiciona con:

```css
transform: translateX(var(--nav-x, 0px)) scaleX(var(--nav-w, 0));
```

Así que el JavaScript escribe dos custom properties —`--nav-x` con el offset en px y `--nav-w` con
el ancho como **factor de escala**— y no toca ninguna propiedad de layout. Es una solución mejor que
la que la historia describía y no hubo que inventarla: estaba en el sistema.

**Las cuatro causas de desalineación, cada una con su reposicionamiento:** cambio de ruta (`watch`
sobre `route.name`), cambio de idioma (`watch` sobre `locale` de `useLocale`), carga de fuentes
(`document.fonts.ready`) y `resize`.

**`mouseleave` va en la lista, no en cada enlace.** Con el listener por enlace, mover el cursor de
uno al de al lado dispara un `mouseleave` seguido de un `mouseenter` y el indicador rebota al activo
y vuelve a salir — un temblor. Escuchándolo una sola vez en el `.nav-list`, el retorno ocurre solo
al salir del grupo.

**`focus` además de `mouseenter`.** Que el indicador siga también al foco de teclado le da a quien
navega con `Tab` la misma información espacial que recibe quien usa mouse (NFR-08).

**Medir después del render.** `offsetLeft` y `offsetWidth` devuelven 0 si el elemento no está en el
layout, así que el reposicionamiento espera un `nextTick()` antes de medir.

**Los listeners se limpian en `onUnmounted`.** `AppNav` vive todo el ciclo de vida de la aplicación
y en la práctica no se desmonta, pero registrar sin limpiar es el patrón que en el HMR de desarrollo
va acumulando handlers hasta que el comportamiento se vuelve errático.

### File List

```
src/components/layout/AppNav.vue    MODIFICADO — lógica del indicador y sus cuatro reposicionamientos
```

Ningún archivo nuevo: el markup y los estilos los dejó la historia 1.5.

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Indicador animado con `--nav-x` / `--nav-w`, reposicionado por ruta, idioma, fuentes y resize. Estado `done`. |
