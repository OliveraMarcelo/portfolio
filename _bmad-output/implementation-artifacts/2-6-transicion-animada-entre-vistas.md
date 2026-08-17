# Story 2.6: Transición animada entre vistas

Status: ready-for-dev

## Story

As a visitante,
I want que el cambio de sección se sienta continuo,
so that el sitio se perciba como una aplicación y no como páginas sueltas.

## Acceptance Criteria

**AC1 — View Transitions donde estén disponibles**

**Given** un navegador con soporte de la View Transitions API
**When** el visitante navega entre secciones
**Then** un guard `router.beforeResolve` envuelve la navegación en `document.startViewTransition`
**And** el guard se ubica en `beforeResolve` y no en `beforeEach`, de modo que el componente destino ya esté resuelto cuando se captura el fotograma

**AC2 — Degradación a fade**

**Given** un navegador sin soporte de la API
**When** el visitante navega
**Then** la navegación ocurre normalmente
**And** un `<Transition>` alrededor de `<router-view>` produce la salida en `opacity → 0` con `translateY(-12px)` en 200 ms y la entrada en `--dur-base` con `--ease-in-out` (A6)

**AC3 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** navega entre secciones
**Then** no se ejecuta ninguna transición y la vista aparece directamente (NFR-07)

**AC4 — Los dos caminos funcionan**

**Given** cualquiera de los dos caminos — con la API o sin ella
**When** se recorre el sitio completo
**Then** la navegación funciona en ambos y ninguna vista queda en blanco

## Tasks / Subtasks

- [ ] **Tarea 1 — Fade con `<Transition>`** (AC: #2)
  - [ ] Envolver el `<RouterView />` de `App.vue` en un `<Transition name="view" mode="out-in">`
  - [ ] Definir en `src/styles/animations.scss` las clases `.view-enter-from`, `.view-enter-active`, `.view-leave-to`, `.view-leave-active`
  - [ ] Salida: `opacity → 0` con `translateY(-12px)` en 200 ms. Entrada: `opacity 0 → 1` con `translateY(16px) → 0` en `--dur-base` con `--ease-in-out`
  - [ ] Solo `transform` y `opacity` (NFR-02)

- [ ] **Tarea 2 — Guard de View Transitions** (AC: #1, #3)
  - [ ] `router.beforeResolve` que envuelve la resolución en `document.startViewTransition` cuando la API existe **y** el visitante no pidió movimiento reducido
  - [ ] Si falta cualquiera de las dos condiciones, dejar pasar la navegación sin envolver
  - [ ] Consultar el movimiento reducido a través de `useReducedMotion` (ver §Un solo origen de verdad para el movimiento reducido)

- [ ] **Tarea 3 — Composable `useReducedMotion`** (AC: #3)
  - [ ] `src/composables/useReducedMotion.js` con un `ref` de módulo alimentado por `matchMedia('(prefers-reduced-motion: reduce)')`
  - [ ] Escuchar el evento `change` para que reaccione si el visitante cambia la preferencia en vivo
  - [ ] Es el **único** origen de verdad de esa preferencia en todo el proyecto

- [ ] **Tarea 4 — Evitar la doble animación** (AC: #1, #2)
  - [ ] Cuando la View Transition corre, el `<Transition>` de Vue **no** debe animar también (ver §Las dos transiciones no pueden correr juntas)

- [ ] **Tarea 5 — Reverificar el scroll** (AC: #4)
  - [ ] Volver a probar la navegación hacia atrás de la historia 2.5 con la transición activa
  - [ ] Si la restauración de scroll se rompe, saltar la transición en navegación hacia atrás y conservar el scroll

- [ ] **Tarea 6 — Verificar los dos caminos** (AC: #4)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Recorrer el sitio completo **con** la API disponible
  - [ ] Recorrer el sitio completo **sin** la API, forzando el camino de degradación (ver §Cómo probar el camino sin la API)
  - [ ] Con `prefers-reduced-motion: reduce`, confirmar que no hay transición y que la navegación funciona
  - [ ] Confirmar que ninguna vista queda en blanco en ningún camino

## Dev Notes

**D6 en la arquitectura: View Transitions API con degradación a `<Transition>`.** Es la única forma
de cumplir FR-14 —la transición continua de elemento compartido de la historia 4.6— sin una librería
de animación. R5 ya anticipaba la fragilidad; la degradación explícita es la mitigación.
[Source: architecture.md#Frontend Architecture, D6]

Esta historia entrega la transición **genérica** entre vistas. La de elemento compartido
—card → detalle— es la historia 4.6 y se apoya en lo que se construya acá.

### Una lección de este proyecto: verificá la causa antes de atribuirla

Durante el prototipo se dio por resuelto un problema de navegación atribuyéndolo a la falta de la
regla `@view-transition`. Al probarlo **con y sin** la regla, la navegación funcionaba en los dos
casos: no era la causa. La causa real era otra.

Moraleja aplicada a esta historia: **los dos caminos —con API y sin API— se prueban por separado.**
No asumas que porque la transición se ve linda, el camino de degradación también funciona.
[Source: ui-handoff.md]

### Por qué `beforeResolve` y no `beforeEach`

El router carga los componentes de forma diferida (`() => import(...)`). Si envolvés la navegación
en `startViewTransition` desde `beforeEach`, la API captura el fotograma del estado nuevo **antes**
de que el componente destino esté resuelto: el resultado es una transición hacia una vista vacía.

`beforeResolve` corre después de que todos los componentes asíncronos están resueltos. Es el único
punto correcto.
[Source: architecture.md#Coherence Validation]

### Un solo origen de verdad para el movimiento reducido

`useReducedMotion` se crea en esta historia y lo consumen después la 2.7 (revelado al scroll), la
3.3 (entrada del hero), la 4.4 (hover de card), la 4.6 (elemento compartido), la 5.2 (línea de
tiempo) y la 7.6 (verificación).

Si cada una consultara `matchMedia` por su cuenta, terminarías con seis lecturas que pueden
discrepar —especialmente si el visitante cambia la preferencia con la pestaña abierta— y el sitio
quedaría a medio quieto. La arquitectura lo registra como dependencia cruzada D6 ↔ D7.

### Las dos transiciones no pueden correr juntas

Si la View Transition está corriendo **y** el `<Transition>` de Vue también anima, el resultado es
un fade doble: la vista se desvanece dos veces y se ve mal.

El criterio: **la View Transition, cuando existe, reemplaza al `<Transition>`, no lo acompaña.**
Formas de lograrlo, de más simple a menos:

1. Poner una bandera mientras la View Transition está activa y usarla para desactivar el `name` del
   `<Transition>` (`:name="usarVT ? '' : 'view'"`). Un `<Transition>` sin nombre no anima.
2. Que las clases del `<Transition>` vivan dentro de un `@supports not (view-transition-name: none)`.

La primera es más explícita y no depende de que `@supports` detecte bien la API. Elegí una y
documentala en el código.

### Cómo probar el camino sin la API

No alcanza con "confiar" en que degrada. Tres formas, de mejor a peor:

1. **Un navegador sin soporte.** Firefox es la opción práctica al momento de escribir esta historia.
   Es la prueba más fiel.
2. **Anular la API temporalmente** desde la consola, antes de navegar:
   ```js
   document.startViewTransition = undefined
   ```
   Sirve si tu guard chequea la existencia de la función en cada navegación y no una sola vez al
   crear el router. **Si tu implementación la captura al arrancar, este método no prueba nada** —y
   eso ya te dice algo sobre cómo escribir el chequeo.
3. **Emular movimiento reducido**, que fuerza el mismo camino. Prueba el fallback pero no distingue
   entre "sin API" y "sin movimiento".

Usá la 1 y la 2.

### `mode="out-in"`

Sin `mode="out-in"`, Vue monta la vista nueva mientras la vieja todavía está saliendo, y las dos
coexisten un instante. Con posicionamiento normal eso empuja el layout y produce un salto. A6
describe salida y luego entrada, así que `out-in` es lo correcto.

Costo: la transición total es la suma de ambas (200 ms + 320 ms). Está dentro del presupuesto de
movimiento —ninguna entrada supera los 900 ms.

### La brecha del scroll

`startViewTransition` captura el fotograma en el mismo instante en que `scrollBehavior` reposiciona.
El orden no está garantizado. Reproducí a propósito: scrolleá abajo en Proyectos, navegá a Sobre mí,
volvé atrás. Si la posición no se restaura, la salida decidida es saltar la transición en
navegación hacia atrás.
[Source: architecture.md#Gap Analysis Results, brecha 3]

### Guardarraíles

- ❌ **No** uses `beforeEach` para envolver la navegación.
- ❌ **No** consultes `matchMedia` directo: usá `useReducedMotion`.
- ❌ **No** dejes que las dos transiciones animen a la vez.
- ❌ **No** instales GSAP, Motion One, `@vueuse/motion` ni ninguna librería de animación. La
  arquitectura resuelve todo el movimiento con CSS y una directiva propia.
- ❌ **No** animes propiedades de layout.
- ❌ **No** captures `document.startViewTransition` en una constante al crear el router: chequeá su
  existencia en cada navegación, así el camino de degradación es probable.
- ❌ **No** agregues `view-transition-name` a la imagen de las cards: es la historia 4.6.
- ❌ **No** des la historia por terminada habiendo probado un solo camino.
- ❌ **No** atribuyas un arreglo a una causa que no verificaste.

### Comandos de verificación

```bash
grep -n "beforeResolve\|startViewTransition" src/router/index.js
grep -rn "matchMedia" src/   # solo debe aparecer en useReducedMotion.js y en el script inline
```

En el navegador:

```js
// ¿Hay soporte?
'startViewTransition' in document

// Camino de degradación: anular y navegar
document.startViewTransition = undefined
// …navegar… la navegación tiene que funcionar y verse el fade

// El composable refleja la preferencia
// (emular reduced motion en DevTools → Rendering y recargar)
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; sitio completo
recorrido **con** la API y **sin** ella; con movimiento reducido no hay transición y la navegación
funciona; ninguna vista queda en blanco en ningún camino; sin fade doble; la navegación hacia atrás
sigue restaurando el scroll; consola sin errores.

### Project Structure Notes

```
src/composables/useReducedMotion.js   NUEVO — origen único de verdad
src/router/index.js                   MODIFICADO — guard beforeResolve
src/App.vue                           MODIFICADO — <Transition> alrededor de <RouterView>
src/styles/animations.scss            NUEVO o MODIFICADO — clases de la transición de vista
```

`animations.scss` puede nacer acá o en la historia 2.7, según cuál se implemente primero. Si nace
acá, la 2.7 le suma `.reveal`, `.mask` y `.mask-in`.

### References

- Historia y criterios: [Source: epics.md#Story 2.6]
- D6, View Transitions con degradación: [Source: architecture.md#Frontend Architecture]
- Dependencia cruzada D6 ↔ D7: [Source: architecture.md#Decision Impact Analysis]
- Por qué `beforeResolve`: [Source: architecture.md#Coherence Validation]
- A6, transición entre rutas: [Source: ux-design-specification.md#4.3]
- FR-14 y R5: [Source: prd.md#7.3 y #9 Riesgos]
- NFR-02/07: [Source: prd.md#8.1 y #8.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
