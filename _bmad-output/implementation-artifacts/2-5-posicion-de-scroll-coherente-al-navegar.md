# Story 2.5: Posición de scroll coherente al navegar

Status: done

## Story

As a visitante que vuelve atrás,
I want retomar la lista donde la había dejado,
so that no tenga que buscar de nuevo dónde estaba.

## Acceptance Criteria

**AC1 — Al tope en navegación nueva**

**Given** el visitante que navega a una sección nueva
**When** la ruta cambia
**Then** la vista aparece desde el tope de la página (FR-04)

**AC2 — Restauración en navegación hacia atrás**

**Given** el visitante que scrolleó dentro de una sección y navegó a otra
**When** usa el botón de retroceso del navegador
**Then** la posición de scroll previa se restaura

**AC3 — Sin desplazamiento suave con movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** el scroll se reposiciona
**Then** el salto es inmediato, sin desplazamiento suave

## Tasks / Subtasks

- [x] **Tarea 1 — Declarar `scrollBehavior`** (AC: #1, #2)
  - [x] En `createRouter`, agregar la función `scrollBehavior(to, from, savedPosition)`
  - [x] Si hay `savedPosition`, devolverla
  - [x] Si no, devolver `{ top: 0 }`
  - [x] Soportar además el salto a un `hash` si la ruta lo trae

- [x] **Tarea 2 — Respetar el movimiento reducido** (AC: #3)
  - [x] `base.scss` declara hoy `html { scroll-behavior: smooth }` y el bloque de movimiento reducido lo anula con `scroll-behavior: auto !important`
  - [x] Verificar que ese `!important` esté presente: sin él, el `scroll-behavior: smooth` del CSS gana y el reposicionamiento se anima igual (ver §El `scroll-behavior` del CSS manda)

- [x] **Tarea 3 — Reevaluar el header** (AC: #1)
  - [x] Después de ir al tope, el header tiene que salir de `.is-scrolled` (historia 2.3)
  - [x] Confirmarlo: scrollear bien abajo, navegar, y mirar el header

- [x] **Tarea 4 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Navegar entre las tres vistas y confirmar que cada una arranca en el tope
  - [x] Scrollear, navegar, volver atrás y confirmar la restauración
  - [x] Con `prefers-reduced-motion: reduce`, confirmar que el reposicionamiento es instantáneo
  - [x] Verificar en 390 px, donde el scroll suave se nota más

## Dev Notes

Historia chica y de comportamiento puro: no cambia nada de lo que se ve, solo dónde aparece la
página. Su valor real es en el recorrido J2, donde el visitante entra a un proyecto y vuelve a la
lista: si vuelve al tope, tiene que buscar de nuevo dónde estaba.
[Source: prd.md#4.2 Recorridos críticos, J2]

### La forma canónica

```js
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80 }
    return { top: 0 }
  },
})
```

`savedPosition` viene poblado **solo** en navegación por el historial —botón atrás o adelante—. En
una navegación nueva llega `null`. Vue Router ya distingue los dos casos; no tenés que detectarlo
vos.

El `top: 80` del caso `hash` compensa la altura del header fijo: sin él, el destino queda tapado.

### El `scroll-behavior` del CSS manda

Este es el punto que hace fallar la implementación ingenua.

`base.scss` —portado en la historia 1.2— declara `html { scroll-behavior: smooth }`. Cuando Vue
Router reposiciona el scroll, el CSS lo anima. Eso es deseable en general, pero **choca de frente
con NFR-07**: un visitante que pidió movimiento reducido no debe ver un desplazamiento animado de
media página.

La anulación vive en el bloque global de movimiento reducido:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
  }
}
```

**El `!important` es necesario.** Sin él, la regla de `html { scroll-behavior: smooth }` tiene la
misma especificidad y gana por orden. Verificá que esté; es parte del bloque que la historia 1.2
portó, pero es exactamente el tipo de línea que se pierde al copiar.

**No** intentes resolver esto en JavaScript pasando `behavior: 'auto'` en el objeto de retorno
según la media query: es más código y el CSS lo pisa igual.

### Cuidado con la interacción con la historia 2.6

La historia 2.6 va a envolver la navegación en `document.startViewTransition`. Esa API captura un
fotograma del estado actual antes de que la vista cambie, y el reposicionamiento del scroll ocurre
en ese mismo instante. El orden entre ambos no está garantizado, y el síntoma sería una transición
que arranca desde la posición de scroll vieja, o una restauración que no se aplica.

**Está registrado como brecha en la validación de arquitectura.** No es problema de esta historia
—acá `scrollBehavior` funciona solo—, pero cuando implementes la 2.6 tenés que volver a probar la
navegación hacia atrás. Si hay conflicto, la salida decidida es **saltar la transición en
navegación hacia atrás y conservar el scroll**: perder una animación es barato, perder la posición
de lectura no.
[Source: architecture.md#Gap Analysis Results, brecha 3]

### El header queda compacto en una página que está en el tope

Efecto de la historia 2.3 que se ve recién acá: si scrolleás abajo y navegás, la página va al tope
pero el header puede quedarse con `.is-scrolled`. Reproducilo a propósito. Si pasa, la causa es que
el reposicionamiento programático no disparó un evento `scroll` observable, y la salida es
reevaluar el estado del header en el cambio de ruta.

### Guardarraíles

- ❌ **No** uses `window.scrollTo` en un `onMounted` de cada vista. Es el patrón que `scrollBehavior`
  existe para evitar, y se dispersa en cuatro archivos.
- ❌ **No** detectes a mano si la navegación es hacia atrás. `savedPosition` ya lo dice.
- ❌ **No** quites `scroll-behavior: smooth` de `base.scss` para "simplificar": es parte del sistema
  y sirve a los enlaces internos.
- ❌ **No** resuelvas el movimiento reducido en JavaScript.
- ❌ **No** agregues `behavior: 'smooth'` explícito en el objeto de retorno: dejá que el CSS decida,
  así la media query lo puede anular.
- ❌ **No** implementes todavía la transición de ruta: es la 2.6.
- ❌ **No** guardes la posición de scroll en `localStorage`. El historial del navegador ya lo hace.

### Comandos de verificación

```bash
# El !important está presente
grep -n "scroll-behavior" src/styles/base.scss

# scrollBehavior declarado
grep -n "scrollBehavior\|savedPosition" src/router/index.js
```

En el navegador:

```js
// Navegación nueva: arranca en el tope
window.scrollY   // 0 después de navegar

// Restauración: scrollear, navegar, volver
window.scrollTo(0, 900)
// …navegar a otra vista, después botón atrás…
window.scrollY   // ~900

// Con reduced motion emulado, el valor efectivo
getComputedStyle(document.documentElement).scrollBehavior   // 'auto'
```

Para emular en Chrome: DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion".

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; cada
navegación nueva arranca en el tope; la navegación hacia atrás restaura la posición; con movimiento
reducido el reposicionamiento es instantáneo; el header no queda compacto en el tope; verificado en
390 px y 1280 px; consola sin errores.

### Project Structure Notes

```
src/router/index.js               MODIFICADO — scrollBehavior
src/styles/base.scss              VERIFICAR — scroll-behavior: auto !important en reduced motion
src/components/layout/AppNav.vue  MODIFICADO (si hace falta) — reevaluar .is-scrolled al navegar
```

### References

- Historia y criterios: [Source: epics.md#Story 2.5]
- FR-04: [Source: prd.md#7.1 Navegación y estructura]
- NFR-07: [Source: prd.md#8.2 Accesibilidad]
- J2, evaluación profunda: [Source: prd.md#4.2 Recorridos críticos]
- Brecha FR-04 × D6: [Source: architecture.md#Gap Analysis Results]
- Movimiento reducido obligatorio: [Source: ux-design-specification.md#4.4]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 — navegación nueva al tope:** `scrollY === 0` tras navegar, en los dos caminos.

**AC2 — restauración hacia atrás**, con una posición guardada de 590 px sobre un máximo de 1180:

| Camino | Guardado | Restaurado | |
|---|---|---|---|
| Con la View Transitions API | 590 | **590** | ✓ |
| Con la API anulada | 590 | **590** | ✓ |

**AC3 —** el bloque de movimiento reducido de `base.scss` declara
`html { scroll-behavior: auto !important }`, verificado presente.

### Un diagnóstico que empezó mal y por qué importa

La primera implementación —`return savedPosition`, sincrónica— restauraba **171 px en lugar de 590**.

La arquitectura tenía anticipada esta brecha (la número 3) y traía la salida ya decidida: *"si hay
conflicto, se salta la transición en navegación hacia atrás y se conserva el scroll"*. Estuve a punto
de aplicarla.

**Antes de hacerlo, probé el mismo caso con `document.startViewTransition` anulado: el recorte
ocurría igual, 171 px.** La View Transitions API **no era la causa**. Aplicar la salida prevista no
habría arreglado nada y habría agregado complejidad para nada — exactamente el error que el prototipo
ya había cometido al atribuir un arreglo de navegación a la regla `@view-transition` sin verificarlo.

La causa real: `savedPosition` se aplica **antes de que la vista destino tenga altura**, así que el
navegador recorta la posición al máximo scroll de un documento a medio renderizar. Y hay **dos**
retrasos distintos en ese montaje: la transición nativa cuando corre, y el `mode="out-in"` del
`<Transition>` de respaldo, que no monta la vista nueva hasta que termina la salida de la vieja. Por
eso una primera corrección con `nextTick` + dos `requestAnimationFrame` arregló el camino con API y
dejó el otro roto.

La corrección definitiva no adivina cuánto esperar: espera **la condición que importa**, que el
documento sea lo bastante alto para la posición guardada, con un techo de 40 fotogramas para no
colgarse. `scrollBehavior` acepta una promesa, así que es el lugar natural.

### File List
