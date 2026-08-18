# Story 4.6: Transición continua de la card al detalle

Status: done

## Story

As a visitante,
I want que al abrir un proyecto la imagen me acompañe,
so that no pierda el hilo de qué proyecto abrí.

## Acceptance Criteria

**AC1 — Elemento compartido**

**Given** un navegador con soporte de la View Transitions API
**When** el visitante abre un proyecto desde su card
**Then** la imagen de la card y la del detalle comparten un `view-transition-name` derivado del slug, y la transición es continua (FR-14, A6)

**AC2 — Nombres únicos por documento**

**Given** una vista con varias cards
**When** se inspeccionan los `view-transition-name` del documento
**Then** ninguno se repite

**AC3 — Degradación**

**Given** un navegador sin soporte de la API, o un visitante con `prefers-reduced-motion: reduce`
**When** abre un proyecto
**Then** la navegación ocurre con el fade de la historia 2.6, sin fallar (R5)

**AC4 — El scroll sigue funcionando**

**Given** la navegación hacia atrás desde el detalle
**When** el visitante vuelve
**Then** la restauración de la posición de scroll de la historia 2.5 sigue funcionando; si entrara en conflicto con la transición, se salta la transición y se conserva el scroll

## Tasks / Subtasks

- [x] **Tarea 1 — Nombrar la imagen de la card** (AC: #1, #2)
  - [x] En `ProjectCard.vue`, aplicar al `.project-img` un `view-transition-name` derivado del slug
  - [x] Formato: `proyecto-<slug>`, con el slug ya en `kebab-case` (ver §El nombre tiene que ser un identificador CSS válido)
  - [x] Aplicarlo con un `:style` enlazado, no con una clase

- [x] **Tarea 2 — Nombrar la imagen del detalle** (AC: #1)
  - [x] En `ProjectDetailView.vue`, el mismo `view-transition-name` para el mismo slug
  - [x] Las dos imágenes usan las clases `.project-media` / `.project-img`, ya alineadas por la historia 4.2

- [x] **Tarea 3 — Solo un nombre activo por documento** (AC: #2)
  - [x] En la vista de Proyectos hay tres cards y por lo tanto tres nombres distintos: eso es correcto
  - [x] El nombre no puede repetirse **dentro** de un documento; revisar el caso de la Home, que muestra las mismas cards (ver §El caso de la Home y el detalle a la vez)

- [x] **Tarea 4 — Respetar el movimiento reducido** (AC: #3)
  - [x] Si `useReducedMotion` indica preferencia reducida, **no** aplicar el `view-transition-name`
  - [x] El guard de la historia 2.6 ya salta la transición; esto evita además el costo de los snapshots

- [x] **Tarea 5 — Reverificar el scroll** (AC: #4)
  - [x] Scrollear abajo en Proyectos, abrir un detalle, volver atrás
  - [x] Si la posición no se restaura, saltar la transición en navegación hacia atrás
  - [x] Es la brecha 3 de la validación de arquitectura y esta es la historia donde se resuelve

- [x] **Tarea 6 — Verificar los dos caminos** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Con la API: abrir los tres proyectos desde Proyectos y desde la Home
  - [x] Sin la API: repetir todo el recorrido y confirmar que navega igual
  - [x] Con movimiento reducido: navegación sin transición y sin errores
  - [x] Confirmar que no hay nombres repetidos
  - [x] Verificar la navegación hacia atrás con y sin transición

## Dev Notes

**FR-14** es el requisito más frágil del rediseño, y el PRD ya lo sabía: R5 dice *"Las transiciones de
elemento compartido son frágiles entre rutas"*, con la mitigación *"degradar a fade si la View Transition
API no está disponible"*.

Esta historia se apoya enteramente en la infraestructura de la historia 2.6: el guard `beforeResolve`, el
composable `useReducedMotion` y el `<Transition>` de respaldo ya existen. Acá solo se nombran los
elementos compartidos.

### El nombre tiene que ser un identificador CSS válido

`view-transition-name` acepta un `<custom-ident>`, no una cadena arbitraria. Reglas:

- No puede empezar con un dígito.
- No puede tener espacios ni comillas.
- `none` y `auto` son palabras reservadas.

Los slugs del proyecto son `kebab-case` y ninguno empieza con dígito, así que `proyecto-tienda-jedami`
funciona. El prefijo `proyecto-` está por dos motivos: evita colisionar con cualquier otro nombre del
sitio y garantiza que nunca arranque con un dígito, aunque un slug futuro sí lo haga.

```vue
<img class="project-img" :style="{ viewTransitionName: `proyecto-${project.slug}` }" … />
```

Notá el `camelCase` en el objeto de estilo: Vue lo convierte a `view-transition-name`.

### El caso de la Home y el detalle a la vez

`view-transition-name` tiene que ser **único dentro de cada documento**. Si dos elementos del mismo
documento comparten el nombre, el navegador descarta la transición entera — sin error visible, solo deja
de funcionar.

Con la estructura de este sitio no hay colisión: la Home y Proyectos son documentos distintos y cada uno
tiene una card por proyecto. Pero hay que confirmarlo, porque un proyecto podría aparecer dos veces en la
misma vista si en el futuro se agrega una sección de "relacionados".

La verificación es el comando de AC2: contar nombres y compararlos con el conjunto de nombres únicos.

### La imagen del detalle es más grande, y eso es lo que se anima

La transición de elemento compartido funciona porque el navegador toma un snapshot del elemento en el
documento de salida y otro en el de entrada, y anima entre las dos geometrías. La imagen de la card es
chica y recortada a `16 / 10`; la del detalle es grande. Esa diferencia **es** la animación.

Para que se vea bien, las dos imágenes deberían tener el mismo `object-fit`. Si la card usa
`object-fit: cover` y el detalle `contain`, la transición muestra un salto de encuadre a mitad de camino.
Alinealos.

### La degradación no se prueba sola

Repetimos la lección de la historia 2.6 porque acá vuelve a aplicar: durante el prototipo se atribuyó un
arreglo de navegación a la regla `@view-transition` sin verificarlo, y al probar **con y sin** la regla la
navegación funcionaba en los dos casos. No era la causa.

En esta historia, "la transición se ve linda" no dice nada sobre el camino sin API. Probá los dos.

Anular la API para probar:

```js
document.startViewTransition = undefined
```

Y recordá: si el guard capturó la función al crear el router en lugar de chequear su existencia en cada
navegación, este método no prueba nada. Eso ya está como guardarraíl en la 2.6.

### El conflicto con el scroll: esta es la historia donde se decide

`startViewTransition` captura el snapshot en el mismo instante en que `scrollBehavior` reposiciona el
scroll. El orden no está garantizado. El síntoma sería una transición que arranca desde la posición
vieja, o una restauración que no se aplica al volver atrás.

Está registrado como brecha importante en la arquitectura, con la salida ya decidida: **si hay conflicto,
se salta la transición en navegación hacia atrás y se conserva el scroll.** Perder una animación es
barato; perder la posición de lectura le arruina el recorrido J2 al visitante, que es justamente a quien
esta épica sirve.

Reproducilo a propósito: scrolleá bien abajo en `/projects`, abrí el tercer proyecto, volvé atrás. Si no
volvés al mismo lugar, aplicá la salida.
[Source: architecture.md#Gap Analysis Results, brecha 3]

### Con movimiento reducido, ni siquiera pongas el nombre

El guard de la 2.6 ya evita `startViewTransition` cuando hay preferencia reducida, así que técnicamente
el `view-transition-name` sería inocuo. Pero un elemento nombrado se promueve a su propia capa de
composición, y eso tiene costo aunque no se anime.

Condicioná el `:style` a `!reducedMotion` y te ahorrás el costo.

### Guardarraíles

- ❌ **No** uses un `view-transition-name` que pueda repetirse en un documento.
- ❌ **No** uses un nombre que empiece con dígito, tenga espacios o sea `none` / `auto`.
- ❌ **No** apliques el nombre con una clase CSS fija: tiene que variar por slug.
- ❌ **No** apliques el nombre con movimiento reducido.
- ❌ **No** uses distinto `object-fit` en la card y en el detalle.
- ❌ **No** instales ninguna librería de transiciones.
- ❌ **No** reimplementes el guard `beforeResolve`: ya está en la historia 2.6.
- ❌ **No** des la historia por terminada habiendo probado un solo camino.
- ❌ **No** sacrifiques la restauración de scroll para conservar la animación.
- ❌ **No** agregues `view-transition-name` a otros elementos —título, chips— "para que quede mejor". A6
  describe la imagen como elemento compartido, y cada nombre extra es una capa de composición más.

### Comandos de verificación

```bash
grep -rn "viewTransitionName\|view-transition-name" src/
```

En el navegador, en `/projects`:

```js
// Nombres presentes y únicos
const nombres = [...document.querySelectorAll('[style*="view-transition-name"]')]
  .map(el => getComputedStyle(el).viewTransitionName)
nombres
nombres.length === new Set(nombres).size          // true

// El mismo nombre existe en el detalle del mismo proyecto
// …navegar a /projects/tienda-jedami y repetir…

// Mismo object-fit en las dos
getComputedStyle(document.querySelector('.project-img')).objectFit

// Camino de degradación
document.startViewTransition = undefined
// …abrir un proyecto: tiene que navegar igual…
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; la transición se ve
continua al abrir los tres proyectos, desde Proyectos y desde la Home; **el recorrido completo funciona
también sin la API**; con movimiento reducido navega sin transición y sin nombres aplicados; nombres
únicos verificados por medición; la navegación hacia atrás restaura el scroll; consola sin errores.

### Project Structure Notes

```
src/components/sections/ProjectCard.vue    MODIFICADO — view-transition-name por slug
src/views/ProjectDetailView.vue            MODIFICADO — el mismo nombre
src/router/index.js                        MODIFICADO (si hace falta) — saltar transición al volver atrás
src/styles/sections.scss                   VERIFICAR — mismo object-fit en card y detalle
```

Ningún archivo nuevo. Toda la infraestructura la dejó la historia 2.6.

### References

- Historia y criterios: [Source: epics.md#Story 4.6]
- D6, View Transitions con degradación: [Source: architecture.md#Frontend Architecture]
- Brecha FR-04 × D6: [Source: architecture.md#Gap Analysis Results]
- FR-14: [Source: prd.md#7.3 Proyectos]
- R5, fragilidad del elemento compartido: [Source: prd.md#9 Riesgos]
- NFR-07: [Source: prd.md#8.2]
- A6, transición entre rutas: [Source: ux-design-specification.md#4.3]
- Lección sobre verificar la causa: [Source: ui-handoff.md]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2 — los nombres en `/projects`:**

```
proyecto-tienda-jedami · proyecto-pokemon-game
únicos: true      identificadores CSS válidos: true      API disponible: true
object-fit de la card: cover   (igual que el detalle, o la transición saltaría de encuadre)
```

Son dos y no tres porque el proyecto de chat no tiene captura: sin imagen no hay elemento que compartir.

**AC1 desde la Home:** al abrir un proyecto desde la Home, `document.startViewTransition` **se invoca**
(instrumentado), la navegación llega a `/projects/tienda-jedami`, el detalle monta con
`view-transition-name: proyecto-tienda-jedami` y la consola queda sin errores. La transición funciona
desde donde sea que se use la card, que es la consecuencia de haber puesto el nombre en el componente.

**AC3 — degradación**, con `document.startViewTransition = undefined`:

```
navega: /projects -> /projects/tienda-jedami -> vuelve a /projects
scroll: 700 -> 700        errores: []
```

### AC4: la brecha 3 no se materializó, y verificarlo evitó trabajo

La arquitectura registraba como brecha importante el conflicto entre `startViewTransition` y la
restauración de scroll, **con la salida ya decidida**: saltar la transición en navegación hacia atrás.

Se reprodujo el escenario exacto a propósito —scrollear abajo en `/projects`, abrir el tercer proyecto,
volver atrás— y la restauración es exacta:

```
antes: 700    en el detalle: 0    al volver: 700    diferencia: 0
```

La espera por altura de documento que la historia 2.5 dejó en `scrollBehavior` ya cubre este caso. **La
salida pre-decidida habría agregado una rama al guard sin arreglar nada.** Es la segunda vez en este
rediseño que verificar la causa antes de aplicar el remedio evita complejidad: la primera fue el
propio arreglo de scroll de la 2.5.

### Una medición mía que era falsa

Un primer intento dio `antes: 657 → al volver: 770` y parecía el defecto. No lo era: el `scrollTo` se
había ejecutado inmediatamente después de un cambio de viewport de 1280 a 390 px, con el layout todavía
sin asentar — el máximo scroll medía 857 en ese instante y 1114 una vez estabilizado. **Medir durante un
reflow devuelve números que no describen nada.** Repetido con el layout asentado, la diferencia es 0.

### La timing va con `*`

El prototipo declara la duración por nombre
(`::view-transition-group(project-img-tienda-jedami)`), lo que obliga a escribir una regla por
proyecto. Con `*` la toma todo el grupo y sumar un proyecto no pide tocar el CSS.

### Con movimiento reducido no se aplica el nombre

El guard de la 2.6 ya evita `startViewTransition`, así que el nombre sería inocuo — pero un elemento
nombrado se promueve a su propia capa de composición, y eso cuesta aunque no se anime.

### File List
