# Story 2.2: Indicador animado de la ruta activa

Status: ready-for-dev

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

- [ ] **Tarea 1 — Marcar el estado activo** (AC: #1)
  - [ ] `<RouterLink>` ya aporta `router-link-active`; agregar `.is-active` con `:class` según `route.name` para no depender del nombre de clase que genera el router
  - [ ] `aria-current="page"` en el enlace de la ruta activa

- [ ] **Tarea 2 — Posicionar el indicador** (AC: #1, #2)
  - [ ] Función que recibe el elemento destino y le asigna al indicador `width = target.offsetWidth` y `transform = translateX(target.offsetLeft)`
  - [ ] Agregar `.is-ready` al indicador la primera vez, para que deje de estar invisible
  - [ ] Llamarla al montar y en cada cambio de `route.name`, dentro de `nextTick`

- [ ] **Tarea 3 — Hover y foco** (AC: #3)
  - [ ] `mouseenter` y `focus` en cada `.nav-link` mueven el indicador a ese enlace
  - [ ] `mouseleave` en el `.nav-list` —no en cada enlace— devuelve el indicador al activo

- [ ] **Tarea 4 — Recalcular cuando cambia la métrica** (AC: #4)
  - [ ] En cambio de idioma: observar el `locale` de `useLocale` y reposicionar
  - [ ] En `resize` de la ventana
  - [ ] Cuando terminan de cargar las fuentes: `document.fonts.ready`
  - [ ] Limpiar todos los listeners en `onUnmounted`

- [ ] **Tarea 5 — Movimiento reducido** (AC: #5)
  - [ ] El bloque global `@media (prefers-reduced-motion: reduce)` de `base.scss` ya anula la transición
  - [ ] Verificar que el indicador igual aparece en la posición correcta, no que desaparece

- [ ] **Tarea 6 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Navegar entre las tres rutas y ver el desplazamiento
  - [ ] Hover sobre los tres enlaces y confirmar el retorno al activo
  - [ ] Alternar idioma y medir la alineación (ver §Comandos de verificación)
  - [ ] Redimensionar la ventana y confirmar que sigue alineado
  - [ ] Recargar con caché deshabilitada y confirmar que no queda desalineado por las fuentes

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

### Debug Log References

### Completion Notes List

### File List
