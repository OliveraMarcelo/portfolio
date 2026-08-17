# Story 2.7: Revelado de contenido al scroll

Status: ready-for-dev

## Story

As a visitante,
I want que las secciones aparezcan a medida que llego a ellas,
so that la lectura tenga ritmo en lugar de ser un muro de contenido.

## Acceptance Criteria

**AC1 — Un solo observer para todo el sitio**

**Given** la directiva `src/directives/reveal.js`
**When** se registra globalmente
**Then** existe un único `IntersectionObserver` de módulo para todo el sitio, no uno por componente (NFR-03)

**AC2 — Revelado una sola vez**

**Given** un elemento con `v-reveal`
**When** entra en el viewport superando el umbral del 15 %
**Then** recibe la clase `.is-visible` y pasa de `opacity: 0` y `translateY(24px)` a su estado final en `--dur-slow` con `--ease-out` (A2)
**And** el observer deja de observarlo: la animación ocurre una sola vez

**AC3 — Escalonado**

**Given** un elemento con `v-reveal="{ delay: 70 }"` dentro de una grilla
**When** el grupo entra en viewport
**Then** los hermanos entran escalonados según ese retardo

**AC4 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga cualquier vista
**Then** todos los elementos con `v-reveal` son visibles y legibles desde el inicio, sin depender de que ninguna animación se ejecute (NFR-07)

**AC5 — Las utilidades no declaran `display`**

**Given** las clases `.reveal`, `.is-visible`, `.mask` y `.mask-in`
**When** se portan a `src/styles/animations.scss`
**Then** ninguna de ellas declara la propiedad `display`

## Tasks / Subtasks

- [ ] **Tarea 1 — Portar las utilidades de animación** (AC: #2, #5)
  - [ ] Portar a `src/styles/animations.scss` las clases `.reveal`, `.reveal.is-visible`, `.mask`, `.mask-in` y `.is-loaded .mask-in` de `_system/components.css` (líneas 112–151)
  - [ ] Portar el hook de QA `[data-qa="show-all"]` del mismo bloque
  - [ ] Revisar que ninguna declare `display` (ver §La regla que costó el layout del hero)
  - [ ] Importar en `src/main.js` después de `base.scss`

- [ ] **Tarea 2 — La directiva** (AC: #1, #2, #3)
  - [ ] `src/directives/reveal.js` con un `IntersectionObserver` a nivel de **módulo**, creado una sola vez
  - [ ] Umbral `0.15` y `rootMargin: '0px 0px -5% 0px'`
  - [ ] En `mounted`: agregar `.reveal` al elemento y registrarlo en el observer
  - [ ] Al intersectar: agregar `.is-visible` y `observer.unobserve(el)`
  - [ ] En `unmounted`: `unobserve` por si el elemento se va antes de aparecer
  - [ ] Registrarla globalmente en `src/main.js` con `app.directive('reveal', reveal)`

- [ ] **Tarea 3 — Escalonado por argumento** (AC: #3)
  - [ ] `v-reveal="{ delay: 70 }"` aplica `transition-delay` al elemento, o define una custom property que el CSS consuma
  - [ ] Sin valor, el retardo es 0

- [ ] **Tarea 4 — Respaldo y movimiento reducido** (AC: #4)
  - [ ] Si `IntersectionObserver` no existe, agregar `.is-visible` a todo de inmediato
  - [ ] Si `useReducedMotion` indica preferencia reducida, agregar `.is-visible` de inmediato y **no** observar
  - [ ] El estado inicial oculto tiene que estar dentro de `@media (prefers-reduced-motion: no-preference)` (ver §El estado oculto va condicionado)

- [ ] **Tarea 5 — Marcar `is-loaded`** (AC: #2)
  - [ ] En `App.vue`, agregar `.is-loaded` al `<body>` dentro de un doble `requestAnimationFrame` tras el montaje
  - [ ] Es lo que dispara las animaciones de máscara `.mask-in` que la historia 3.3 va a usar

- [ ] **Tarea 6 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Aplicar `v-reveal` de forma temporal a algunos bloques de las vistas actuales y ver el revelado
  - [ ] Confirmar que hay **un** observer, no varios (ver §Comandos de verificación)
  - [ ] Con `prefers-reduced-motion: reduce`, confirmar que todo es legible de entrada
  - [ ] Grabar el scroll en el panel Performance y confirmar que no cae de 60 fps
  - [ ] Quitar los `v-reveal` temporales antes de cerrar

## Dev Notes

**D7 en la arquitectura: un único `IntersectionObserver` compartido, expuesto como directiva
`v-reveal`.** El patrón alternativo —un observer por componente— multiplica los callbacks de layout
durante el scroll y es el camino más corto a perder los 60 fps de NFR-03. Una directiva mantiene las
vistas declarativas y evita el `onMounted` repetido en cada sección.
[Source: architecture.md#Frontend Architecture, D7]

Esta historia cierra la Épica 2 y entrega la infraestructura de movimiento que consumen **todas** las
épicas siguientes: 3.3 (hero), 4.7 (destacados), 5.2 (línea de tiempo), 5.4 (habilidades) y 6.2
(contacto). Es la última pieza que se construye antes de empezar a armar contenido.

### La regla que costó el layout del hero

En el prototipo, la clase `.mask-in` declaraba `display: block`. Como `.chips` declara
`display: flex` con la misma especificidad y `.mask-in` venía después en el archivo, ganaba: **los
chips del stack del hero se apilaron a ancho completo** en lugar de quedar en fila.

No era un error de nadie en particular: era una utilidad de animación metiéndose en una decisión de
layout. El arreglo puntual fue `.chips.mask-in { display: flex }`, pero la regla general —y la que
hay que respetar acá— es más simple:

> **Ninguna clase de utilidad de animación declara `display`.**

Está escrita como comentario en el propio `components.css` (`/* Ninguna de estas clases declara
display. */`) y es un criterio de aceptación de esta historia. Cuando portes el bloque, revisá cada
regla.
[Source: architecture.md#Process Patterns]

### El estado oculto va condicionado

`.reveal` arranca con `opacity: 0` y `translateY(24px)`. Si esa regla se aplica sin condición y por
cualquier motivo la clase `.is-visible` no llega —sin JavaScript, un error en la directiva, un
elemento que nunca entra en viewport— el contenido queda **invisible y perdido**.

NFR-07 lo pide explícito: bajo movimiento reducido, todo elemento animado debe quedar en su estado
final visible. La forma robusta es que el estado oculto solo exista cuando hay movimiento:

```css
@media (prefers-reduced-motion: no-preference) {
  .reveal { opacity: 0; transform: translateY(24px); }
}
.reveal.is-visible { opacity: 1; transform: none; }
```

Así, con movimiento reducido, el contenido nunca se esconde — no hace falta que nadie lo revele.
Es una defensa estructural, no una condición que se chequea.

### El `rootMargin` negativo

`rootMargin: '0px 0px -5% 0px'` recorta el 5 % inferior del viewport, así que el elemento se revela
cuando está un poco más adentro y no justo al asomar el borde. Es un detalle de percepción y está
medido en el sistema. Portalo tal cual.

### `unobserve` no es opcional

Sin `observer.unobserve(el)` después de revelar, el observer sigue notificando ese elemento en cada
cruce del umbral durante todo el scroll. Con veinte elementos revelados, eso son veinte callbacks
inútiles por cada movimiento del scroll. Es exactamente el costo que D7 existe para evitar.

Y `unobserve` también en `unmounted`: si una vista se desmonta con elementos aún no revelados, el
observer se queda con referencias a nodos que ya no están en el documento.

### `is-loaded` y el doble `requestAnimationFrame`

El sistema marca el `<body>` con `.is-loaded` así:

```js
requestAnimationFrame(function () {
  requestAnimationFrame(function () { body.classList.add('is-loaded'); });
});
```

El doble `rAF` no es superstición: garantiza que el navegador ya pintó al menos un fotograma con el
estado inicial. Si agregás la clase en el mismo tick del montaje, el navegador puede no registrar el
cambio como una transición y la animación no se ve — simplemente aparece.

`.is-loaded .mask-in` es lo que la historia 3.3 usa para la entrada del hero. Se cablea acá para que
la infraestructura de movimiento quede completa.

### El hook de QA

`[data-qa="show-all"]` fuerza el estado final visible de todo lo animado. Sirve para tomar capturas
y para verificar layout sin esperar animaciones. Portalo: la Épica 7 lo va a usar para las
verificaciones de responsive.

### El presupuesto de movimiento

La UX spec es normativa acá: **un gesto protagónico por sección**, el resto es acompañamiento, y
ninguna entrada supera los 900 ms. `v-reveal` es el gesto de acompañamiento por defecto. No lo uses
en cada elemento de una sección: usalo en el bloque, y dejá que el escalonado haga el resto.
[Source: ux-design-specification.md#4.2 Presupuesto de movimiento]

### Guardarraíles

- ❌ **No** crees un observer por componente ni por vista.
- ❌ **No** declares `display` en ninguna clase de animación.
- ❌ **No** apliques el estado oculto sin el `@media (prefers-reduced-motion: no-preference)`.
- ❌ **No** omitas el `unobserve`.
- ❌ **No** uses un listener de `scroll` para detectar visibilidad. `IntersectionObserver` existe
  exactamente para esto y no bloquea el hilo principal.
- ❌ **No** instales `@vueuse/core` para usar `useIntersectionObserver`. Son quince líneas propias.
- ❌ **No** animes propiedades de layout.
- ❌ **No** apliques `v-reveal` a elementos del hero que tienen que ser visibles sin scroll: el hero
  usa `.mask-in`, que es la historia 3.3.
- ❌ **No** te olvides de quitar los `v-reveal` temporales de verificación.

### Comandos de verificación

```bash
# Ninguna utilidad de animación declara display
grep -n "display" src/styles/animations.scss

# El observer se crea una sola vez, a nivel de módulo
grep -n "new IntersectionObserver" src/directives/reveal.js   # una sola aparición
grep -rn "new IntersectionObserver" src/                       # solo en reveal.js
```

En el navegador:

```js
// El estado oculto no se aplica con movimiento reducido
// (emular en DevTools → Rendering, recargar, y verificar)
getComputedStyle(document.querySelector('.reveal')).opacity   // '1'

// .chips sigue siendo flex incluso con .mask-in
getComputedStyle(document.querySelector('.chips')).display    // 'flex'

// El body recibió is-loaded
document.body.classList.contains('is-loaded')

// El hook de QA fuerza el estado final
document.documentElement.setAttribute('data-qa', 'show-all')
```

Y una grabación del panel Performance scrolleando la vista más larga: sin caídas por debajo de
60 fps, sin bloques largos de *Recalculate Style*.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; el revelado se
ve y ocurre una sola vez; un único observer en todo el proyecto; con movimiento reducido todo es
legible de entrada; `.chips` computa `flex`; `data-qa="show-all"` fuerza el estado final; scroll a
60 fps medido; consola sin errores.

### Project Structure Notes

```
src/directives/reveal.js       NUEVO — observer único + directiva
src/styles/animations.scss     NUEVO o MODIFICADO — .reveal, .mask, .mask-in, hook de QA
src/main.js                    MODIFICADO — registra la directiva; importa animations.scss
src/App.vue                    MODIFICADO — marca .is-loaded en doble rAF
```

Se crea por primera vez `src/directives/`. Si `animations.scss` ya nació en la historia 2.6 con las
clases de transición de vista, esta historia le suma las de revelado y máscara.

### References

- Historia y criterios: [Source: epics.md#Story 2.7]
- D7, observer único y directiva: [Source: architecture.md#Frontend Architecture]
- Regla de que las utilidades no declaran `display`: [Source: architecture.md#Process Patterns]
- El defecto de `.mask-in` sobre `.chips`: [Source: ui-handoff.md]
- A2, scroll reveal: [Source: ux-design-specification.md#4.3]
- Presupuesto de movimiento: [Source: ux-design-specification.md#4.2]
- Movimiento reducido obligatorio: [Source: ux-design-specification.md#4.4]
- NFR-02/03/07: [Source: prd.md#8.1 y #8.2]
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 112–151
- Comportamiento fuente: `public/ui-generated/_system/system.js`, sección "Scroll reveal"

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
