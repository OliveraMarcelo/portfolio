# Story 2.3: Encabezado que reacciona al scroll

Status: ready-for-dev

## Story

As a visitante,
I want que el encabezado no me tape el contenido mientras leo,
so that pueda concentrarme en la página sin perder la navegación.

## Acceptance Criteria

**AC1 — Transparente en el tope**

**Given** el visitante en el tope de la página
**When** la posición de scroll es menor a 80 px
**Then** el header es transparente y mantiene su altura completa

**AC2 — Superficie al scrollear**

**Given** el visitante que scrollea más allá de 80 px
**When** se supera ese umbral
**Then** el header recibe `.is-scrolled`, adopta fondo de superficie con `backdrop-filter: blur(12px)` y reduce su altura, en `--dur-base` (A4)

**AC3 — Vuelve a su estado inicial**

**Given** el visitante que vuelve al tope
**When** el scroll baja de 80 px
**Then** el header recupera su estado transparente

## Tasks / Subtasks

- [ ] **Tarea 1 — Estilos del estado** (AC: #1, #2)
  - [ ] Verificar que `chassis.scss` ya trae `.site-header.is-scrolled` y `.site-header.is-scrolled .header-inner` de `_system/components.css` (líneas 166–186); portarlos si faltan
  - [ ] La transición de la altura la resuelve el `padding-block` del `.header-inner`, no un `height` animado

- [ ] **Tarea 2 — Alternar la clase** (AC: #1, #2, #3)
  - [ ] En `AppNav.vue`, un listener de `scroll` sobre `window` que alterna `.is-scrolled` según `window.scrollY > 80`
  - [ ] Registrar con `{ passive: true }` (ver §El listener tiene que ser pasivo)
  - [ ] Evaluar el estado también al montar: si el visitante entra con la página ya scrolleada, el header tiene que arrancar correcto
  - [ ] Quitar el listener en `onUnmounted`

- [ ] **Tarea 3 — Reevaluar al navegar** (AC: #3)
  - [ ] Después de navegar, la historia 2.5 va a llevar el scroll al tope; asegurate de que el estado del header se reevalúe entonces
  - [ ] Alcanza con reaccionar al evento de scroll que produce ese reposicionamiento; si no se dispara, reevaluar en el cambio de ruta

- [ ] **Tarea 4 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Scrollear hacia abajo y hacia arriba cruzando el umbral, en las tres vistas
  - [ ] Recargar con la página ya scrolleada y confirmar que el header arranca en el estado correcto
  - [ ] Verificar en 390 px que el header reducido no tapa contenido
  - [ ] Comprobar el fondo real donde `backdrop-filter` no está soportado (ver §El respaldo del blur)

## Dev Notes

Animación **A4** del catálogo: al superar los 80 px de scroll, la barra pasa de transparente a
superficie con `backdrop-filter: blur(12px)` y reduce su altura, en `--dur-base`.
[Source: ux-design-specification.md#4.3, A4]

Es la historia más chica de la épica. Su valor es que el header deje de ser un bloque opaco fijo y
empiece a comportarse: liviano cuando hay lugar, sólido cuando estorba.

### El listener tiene que ser pasivo

```js
window.addEventListener('scroll', onScroll, { passive: true })
```

Sin `{ passive: true }`, el navegador tiene que esperar a que tu handler termine antes de saber si
llamaste a `preventDefault()`, y eso bloquea el scroll. Es la causa más común de scroll con tirones
en mobile, y acá pega directo contra NFR-03 (60 fps).

### No hace falta throttle, pero sí cuidado con lo que hace el handler

El handler solo lee `window.scrollY` y llama a `classList.toggle`. `classList.toggle` con un segundo
argumento booleano es idempotente: si la clase ya está en el estado pedido, no toca el DOM. Así que
no hay trabajo redundante y no necesitás `requestAnimationFrame` ni throttle.

Lo que **no** podés hacer es leer una medida que fuerce layout —`offsetHeight`, `getBoundingClientRect`,
`offsetTop`— dentro del handler de scroll. Eso sí produce *layout thrashing* y mata los fps.

### El respaldo del blur

`backdrop-filter` no está en el 100 % del parque de navegadores del alcance (NFR-13). Donde no
existe, el header queda con el fondo que declare la regla base. Verificá que ese fondo sea opaco lo
suficiente para que el texto de abajo no se lea a través: un header semitransparente sin blur es
ilegible.

Si hace falta, la salida es un `@supports not (backdrop-filter: blur(1px))` que suba la opacidad
del fondo. **No** desactives el estado entero.

### La altura se anima con padding, no con height

`_system/components.css` reduce la altura del header cambiando el `padding-block` del
`.header-inner`. Es una propiedad de layout, así que técnicamente contradice NFR-02 — pero es el
markup del sistema y está medido. La alternativa —animar `transform: scaleY()`— deformaría el texto.

Portalo tal cual. Lo que **no** hay que hacer es "mejorarlo" agregando `transition: all` o animando
`height`, que es peor.

### Un detalle que se nota recién en la 2.5

Cuando la historia 2.5 haga que la navegación vuelva al tope, el header tiene que salir del estado
`.is-scrolled`. Si el reposicionamiento del scroll no dispara un evento `scroll` observable, el
header queda compacto en una página que está en el tope. Probalo: scrolleá bien abajo, navegá a
otra sección, y mirá el header.

### Guardarraíles

- ❌ **No** registres el listener sin `{ passive: true }`.
- ❌ **No** leas medidas del DOM dentro del handler de scroll.
- ❌ **No** uses `transition: all`.
- ❌ **No** animes `height`.
- ❌ **No** cambies el umbral de 80 px. Está en el sistema verificado.
- ❌ **No** hagas el header `position: sticky` si el sistema lo declara `fixed`, ni al revés.
- ❌ **No** instales una librería de scroll.
- ❌ **No** agregues un comportamiento de "esconder al bajar, mostrar al subir". No lo pide ningún
  FR y el catálogo de movimiento describe A4, no eso.
- ❌ **No** toques el indicador de navegación: es la historia 2.2.

### Comandos de verificación

```js
// En el tope
window.scrollY                                                    // 0
document.querySelector('.site-header').classList.contains('is-scrolled')   // false

// Después de scrollear
window.scrollTo(0, 200)
document.querySelector('.site-header').classList.contains('is-scrolled')   // true

// La altura cambió
document.querySelector('.site-header').getBoundingClientRect().height

// El listener es pasivo: revisalo en DevTools → Elements → Event Listeners
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; el estado
alterna en ambos sentidos cruzando el umbral, en las tres vistas; el estado inicial es correcto al
recargar con la página scrolleada; el texto de abajo no se lee a través del header; sin tirones al
scrollear en mobile; consola sin errores.

### Project Structure Notes

```
src/components/layout/AppNav.vue   MODIFICADO — listener de scroll
src/styles/chassis.scss            MODIFICADO (si falta) — .is-scrolled
```

### References

- Historia y criterios: [Source: epics.md#Story 2.3]
- A4, nav en scroll: [Source: ux-design-specification.md#4.3]
- FR-02, barra persistente: [Source: prd.md#7.1]
- NFR-02/03/13: [Source: prd.md#8.1 y #8.3]
- Comportamiento fuente: `public/ui-generated/_system/system.js`, sección "Header en scroll"
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 166–186

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
