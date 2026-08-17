# Story 3.4: Indicador de scroll

Status: done

## Story

As a visitante,
I want saber que hay más contenido abajo,
so that no me quede solo con la primera pantalla.

## Acceptance Criteria

**AC1 — Aparece tras la entrada**

**Given** la Home cargada sin scrollear
**When** termina la entrada del hero
**Then** aparece un indicador de scroll al pie del hero (FR-09)

**AC2 — Desaparece y no vuelve**

**Given** el visitante que scrollea por primera vez
**When** la página se desplaza
**Then** el indicador desaparece con una transición de opacidad y no vuelve a aparecer

**AC3 — Decorativo para lectores de pantalla**

**Given** el indicador
**When** se inspecciona su markup
**Then** es decorativo y queda oculto para los lectores de pantalla

## Tasks / Subtasks

- [x] **Tarea 1 — Componente `ScrollCue.vue`** (AC: #1, #3)
  - [x] Markup portado de `home/index.html`: `.scroll-cue` con `.scroll-cue-text`, `.scroll-cue-track` y `.scroll-cue-dot`
  - [x] Estilos portados de `home/page.css` (sección del hero, clases `.scroll-cue*`)
  - [x] `aria-hidden="true"` en el contenedor
  - [x] El texto —si lo hay— sale de i18n, no literal

- [x] **Tarea 2 — Desaparecer al primer scroll** (AC: #2)
  - [x] Estado local `visible`, inicialmente `true`
  - [x] Un listener de `scroll` con `{ passive: true }` y `{ once: true }` que lo pone en `false`
  - [x] `{ once: true }` es lo que garantiza que no vuelva (ver §`once` en lugar de una bandera)
  - [x] Evaluar al montar: si la página ya está scrolleada, el indicador no debe aparecer

- [x] **Tarea 3 — Transición de salida** (AC: #2)
  - [x] Solo `opacity` y, si suma, `transform` (NFR-02)
  - [x] Mantener el elemento en el layout mientras se desvanece, o usar `<Transition>` para desmontarlo al terminar
  - [x] Con movimiento reducido, desaparece sin transición

- [x] **Tarea 4 — Montar en el hero** (AC: #1)
  - [x] `<ScrollCue />` al pie de `HeroSection.vue`, dentro del `.hero`
  - [x] Su aparición se encadena con la entrada de la historia 3.3: retardo posterior al último elemento

- [x] **Tarea 5 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Recargar, ver aparecer el indicador, scrollear, ver desaparecer
  - [x] Scrollear de vuelta al tope y confirmar que **no** reaparece
  - [x] Recargar con la página ya scrolleada y confirmar que no aparece
  - [x] Confirmar que no se anuncia por lector de pantalla ni recibe foco
  - [x] Verificar en 390 px que no tapa contenido ni desborda la altura del hero

## Dev Notes

La historia más chica de la Épica 3. Su función es de affordance: el hero ocupa `100svh`, así que sin
un indicador el visitante puede no darse cuenta de que hay más abajo — especialmente en mobile, donde
no hay barra de scroll visible.

### `once` en lugar de una bandera

El requisito "y no vuelve a aparecer" se puede implementar de dos formas:

```js
// Frágil: hay que acordarse de la guarda
window.addEventListener('scroll', () => { if (visible.value) visible.value = false }, { passive: true })

// Correcto: el navegador garantiza que corre una sola vez y se desregistra solo
window.addEventListener('scroll', () => { visible.value = false }, { passive: true, once: true })
```

`{ once: true }` remueve el listener automáticamente después de la primera ejecución. No hace falta
guarda, no hace falta `removeEventListener`, y no hay forma de que el indicador reaparezca por error.

Igual conviene un `onUnmounted` con `removeEventListener` por si el componente se desmonta antes de
que el visitante scrollee.

### El caso de la página ya scrolleada

Si el visitante recarga con la página a mitad de camino —o llega con un `#hash`— el navegador restaura
la posición **antes** de que el componente monte. El indicador aparecería en una página que ya está
scrolleada, que es justo lo contrario de lo que comunica.

Evaluá `window.scrollY > 0` al montar y arrancá en `false` si corresponde.

### Decorativo de verdad

El indicador no aporta información que no esté disponible de otra forma: quien usa un lector de
pantalla ya sabe que la página sigue, porque el lector le lee la estructura completa. Anunciar
"scrollea para ver más" sería ruido.

Por eso `aria-hidden="true"` en el contenedor, y **nada enfocable adentro**. Si lo hicieras un botón
que scrollea, dejaría de ser decorativo y necesitaría nombre accesible, foco visible y área de 44 px.
FR-09 pide un indicador, no un control.

### Si su animación es un bucle, tiene que parar

Los indicadores de scroll suelen tener un punto que sube y baja en loop. Si el markup del prototipo
lo trae, dos cuidados:

1. **Con movimiento reducido, el bucle no debe correr.** Una animación infinita es lo más molesto para
   quien pidió movimiento reducido. El bloque global de `base.scss` lo neutraliza con
   `animation-iteration-count: 1 !important`, pero verificalo.
2. **Cuando el indicador desaparece, la animación tiene que dejar de consumir fotogramas.** Si el
   elemento solo baja a `opacity: 0` pero sigue animándose, el navegador sigue trabajando. Desmontarlo
   con `<Transition>` es más limpio que dejarlo invisible.

### El encadenamiento con la entrada del hero

FR-09 dice que el indicador está en el hero; A1 define la entrada del hero. Lo natural es que el
indicador entre **al final** de la secuencia, después de que el título, el rol, la bajada y los
botones ya aparecieron.

Usá el mismo mecanismo de `--i` que la historia 3.3, con el índice más alto. Y recordá el presupuesto:
el gesto completo no pasa de 900 ms.

### Guardarraíles

- ❌ **No** lo hagas enfocable ni clickeable.
- ❌ **No** lo anuncies a lectores de pantalla.
- ❌ **No** uses una bandera cuando `{ once: true }` resuelve el requisito.
- ❌ **No** registres el listener sin `{ passive: true }`.
- ❌ **No** lo dejes aparecer si la página ya está scrolleada.
- ❌ **No** animes propiedades de layout.
- ❌ **No** dejes un bucle de animación corriendo tras la desaparición.
- ❌ **No** dejes un bucle corriendo con movimiento reducido.
- ❌ **No** hagas que reaparezca al volver al tope. FR-09 dice que desaparece al primer desplazamiento.
- ❌ **No** uses `v-reveal`: el indicador está en el primer viewport.

### Comandos de verificación

```js
// Presente y decorativo
const cue = document.querySelector('.scroll-cue')
cue.getAttribute('aria-hidden')                              // 'true'
cue.querySelectorAll('a, button, [tabindex]').length         // 0

// Desaparece al scrollear
window.scrollTo(0, 100)
// …esperar la transición…
getComputedStyle(cue).opacity   // '0', o el elemento ya no está en el DOM

// Y no vuelve
window.scrollTo(0, 0)
// sigue en 0 / sigue ausente

// Con reduced motion, sin bucles infinitos
getComputedStyle(document.querySelector('.scroll-cue-dot')).animationIterationCount   // '1'
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; aparece al
terminar la entrada; desaparece al primer scroll y no reaparece; no aparece si la página se carga ya
scrolleada; no es enfocable ni anunciado; sin bucles con movimiento reducido; en 390 px no tapa
contenido; consola sin errores.

### Project Structure Notes

```
src/components/ui/ScrollCue.vue           NUEVO
src/components/sections/HeroSection.vue    MODIFICADO — monta ScrollCue al pie del hero
src/locales/{es,en}.json                   MODIFICADO (si el indicador tiene texto)
```

Con esta historia la Épica 3 queda cerrada: el hero está completo, animado y con su affordance.

### References

- Historia y criterios: [Source: epics.md#Story 3.4]
- FR-09: [Source: prd.md#7.2 Home]
- NFR-02/07/08: [Source: prd.md#8.1 y #8.2]
- A1, entrada del hero: [Source: ux-design-specification.md#4.3]
- Movimiento reducido obligatorio: [Source: ux-design-specification.md#4.4]
- Estrategia de componentes, `ScrollCue`: [Source: ux-design-specification.md#5]
- Markup y estilos fuente: `public/ui-generated/home/index.html` y `home/page.css`, clases `.scroll-cue*`

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC3 — el indicador:**

```
presente: true      aria-hidden: "true"      enfocables dentro: 0      opacity: 1
```

**AC2 — desaparece y no vuelve:**

```
tras window.scrollTo(0, 150)  -> el elemento ya no existe en el DOM
tras volver a scrollTo(0, 0)  -> sigue sin existir
```

### `{ once: true }` en lugar de una bandera

El requisito "y no vuelve a aparecer" se implementó con `{ passive: true, once: true }`: el navegador
desregistra el listener tras la primera ejecución, así que no hay guarda que olvidar ni forma de que
el indicador reaparezca por error.

### Se desmonta, no se esconde

El `<Transition>` lo saca del DOM al terminar la salida, en lugar de dejarlo en `opacity: 0`. El punto
del indicador tiene una animación en bucle (`@keyframes cue-slide`), y un elemento invisible que
sigue animándose consume fotogramas sin que nadie lo vea.

### El caso de la página ya scrolleada

Si el visitante recarga a mitad de camino, el navegador restaura la posición **antes** de que el
componente monte, y el indicador aparecería en una página ya desplazada. `onMounted` chequea
`window.scrollY > 0` y arranca oculto.

### El keyframe vino de la historia 3.1

`@keyframes cue-slide` había quedado en el `<style scoped>` de `HeroSection` al extraer el CSS. Se
movió acá: en un `<style scoped>` los keyframes se renombran con el hash del componente, así que
declarado en el hero no sería alcanzable desde este.

### File List
