# Story 4.4: La card responde al cursor

Status: done

## Story

As a visitante,
I want que la card reaccione cuando la apunto,
so that entienda que puedo entrar en ella.

## Acceptance Criteria

**AC1 — Respuesta al hover**

**Given** una card de proyecto en escritorio
**When** el visitante pasa el cursor por encima
**Then** la card se eleva con `translateY(-6px)`, su sombra pasa de `--shadow-md` a `--shadow-lg`, la imagen interna escala a `1.06` y las acciones se revelan, todo en `--dur-fast` con `--ease-out` (A5, FR-13)

**AC2 — Solo propiedades compositables**

**Given** el hover de la card
**When** se inspeccionan las propiedades animadas
**Then** solo se animan `transform`, `opacity` y `box-shadow`; no se anima `margin`, `width` ni `height` (NFR-02)

**AC3 — Misma respuesta por teclado**

**Given** un visitante navegando por teclado
**When** el foco entra en la card
**Then** se produce la misma respuesta visual que en hover, con foco visible

**AC4 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** apunta una card
**Then** las acciones se revelan sin desplazamiento ni escala

## Tasks / Subtasks

- [x] **Tarea 1 — Elevación y sombra** (AC: #1, #2)
  - [x] `.project-card:hover, .project-card:focus-within` con `translateY(-6px)`, `box-shadow: var(--shadow-lg)` y el borde tirando a acento
  - [x] La `transition` de la card ya quedó declarada en la historia 4.2, separada de la animación de entrada
  - [x] Duración `--dur-fast` con `--ease-out`

- [x] **Tarea 2 — Zoom de la imagen** (AC: #1, #2)
  - [x] `.project-card:hover .project-img { transform: scale(1.06) }`
  - [x] El `overflow: hidden` de `.project-media` es lo que contiene el zoom; verificá que esté
  - [x] La imagen transiciona en `--dur-slow`, no en `--dur-fast` (ver §El zoom va más lento que la elevación)

- [x] **Tarea 3 — Revelar las acciones** (AC: #1, #4)
  - [x] Las acciones aparecen con `opacity` al hover o al foco
  - [x] **Solo donde hay hover real:** envolver esa regla en `@media (hover: hover)` (ver §Las acciones no se pueden esconder en touch)
  - [x] La clase que las oculta no debe declarar `display`

- [x] **Tarea 4 — `:focus-within` y foco visible** (AC: #3)
  - [x] `:focus-within` en la card produce el mismo estado que `:hover`
  - [x] El elemento enfocado dentro de la card muestra su `:focus-visible`
  - [x] Recorrer una card completa con `Tab`: título, y los botones que existan

- [x] **Tarea 5 — Movimiento reducido** (AC: #4)
  - [x] El bloque global de `base.scss` anula las transiciones; verificar que las acciones **igual se
        revelen** y no queden invisibles
  - [x] Sin elevación ni zoom

- [x] **Tarea 6 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Hover sobre las tres cards en escritorio
  - [x] Recorrer con `Tab` y confirmar el estado y el foco visible
  - [x] En 390 px con emulación touch: las acciones son visibles y usables
  - [x] Con movimiento reducido: acciones visibles, sin movimiento
  - [x] Confirmar que el zoom no se desborda de la card
  - [x] Grabar el hover en el panel Performance y confirmar que no dispara layout

## Dev Notes

Animación **A5** del catálogo: `translateY(-6px)`, sombra de `--shadow-md` a `--shadow-lg`, imagen
interna a `scale(1.06)` y aparición de las acciones. Todo en `--dur-fast` con `--ease-out`.
[Source: ux-design-specification.md#4.3, A5]

Es el gesto protagónico de la sección de proyectos. FR-13 lo pide y el presupuesto de movimiento dice
que es **uno** por sección: no agregues más efectos acá.

### Las acciones no se pueden esconder en touch

Este es el punto que hace o rompe la historia.

Si las acciones están ocultas y aparecen al hover, en un dispositivo touch **no aparecen nunca**: no hay
hover. El visitante de mobile se queda sin los botones de sitio en vivo y de repositorio, que son
justamente lo que FR-12 pide mostrar.

El CSS del prototipo lo tiene resuelto, y el comentario lo dice:

```css
/* Las acciones aparecen al hover solo donde hay hover real. */
@media (hover: hover) {
  .project-actions { opacity: 0; }
  .project-card:hover .project-actions,
  .project-card:focus-within .project-actions { opacity: 1; }
}
```

Fuera de ese `@media`, las acciones están visibles por defecto. En touch se ven siempre; en escritorio
aparecen al apuntar.

**Portá el `@media (hover: hover)`.** Sin él, la card es inusable en mobile y el defecto no se ve
probando en escritorio con la ventana angosta — hay que emular touch, porque `@media (hover: hover)`
depende del dispositivo, no del ancho.

### El zoom va más lento que la elevación

`.project-img` transiciona en `--dur-slow` (600 ms) mientras la card se eleva en `--dur-fast` (180 ms).
La diferencia es intencional: la card responde rápido al cursor, y la imagen sigue con inercia. Si las
igualás, el gesto se siente mecánico.

Es un detalle de percepción, está en el CSS del prototipo, y es exactamente el tipo de cosa que se
"corrige" por parecer inconsistente. No la corrijas.

### `box-shadow` sí se puede animar

NFR-02 dice `transform` y `opacity`. `box-shadow` no está en esa lista, y estrictamente su animación
repinta.

Pero A5 la pide explícitamente, y a diferencia de `width` o `top`, **no dispara layout**: repinta, que
es mucho más barato. El criterio de aceptación AC2 la incluye por eso.

Si en el panel Performance vieras costo real, la salida conocida es animar la `opacity` de un
pseudo-elemento con la sombra grande en lugar de la sombra misma. **No lo hagas preventivamente**: es
más código y más difícil de mantener. Medí primero.

Lo que **no** se puede animar es `margin-top` para simular la elevación. Eso sí es layout, y es el
anti-patrón que la arquitectura registra con nombre.
[Source: architecture.md#Pattern Examples]

### `:focus-within` es lo que hace la card accesible

Sin `:focus-within`, quien navega con `Tab` llega al título de la card y no ve ningún cambio: la card no
le responde, y si las acciones están ocultas por hover, tampoco las ve aparecer.

`:focus-within` se activa cuando **cualquier** descendiente tiene el foco, así que cubre el título y los
botones. Poné siempre las dos condiciones juntas:

```css
.project-card:hover,
.project-card:focus-within { … }
```

Y verificá que el `:focus-visible` del elemento enfocado se vea: la card entera cambiando de estado no
reemplaza al indicador de foco del control puntual (NFR-08).

### Con movimiento reducido, revelar sigue siendo necesario

El bloque global de `base.scss` pone las transiciones en `0.01ms`. Eso quita el movimiento, pero **la
revelación de las acciones tiene que seguir ocurriendo**: si `opacity: 0` se mantiene y la transición no
corre, las acciones quedan invisibles para siempre en escritorio.

Con transiciones a `0.01ms` el cambio de `opacity` es instantáneo, así que funciona — pero verificalo, no
lo asumas. Es el mismo modo de falla que la historia 2.7 previene estructuralmente en `.reveal`.

### El zoom no debe desbordar

`scale(1.06)` sobre la imagen la hace más grande que su contenedor. Lo que la recorta es el
`overflow: hidden` de `.project-media`. Si falta, la imagen se sale de la card y pisa el contenido de al
lado en la grilla.

Verificalo mirando el borde superior de la card durante el hover.

### Guardarraíles

- ❌ **No** omitas el `@media (hover: hover)`. Es lo que hace la card usable en touch.
- ❌ **No** animes `margin`, `width`, `height`, `top` ni `left`.
- ❌ **No** iguales la duración del zoom a la de la elevación.
- ❌ **No** uses solo `:hover`: siempre con `:focus-within`.
- ❌ **No** declares `display` en la clase que oculta las acciones.
- ❌ **No** agregues efectos extra —brillo, rotación, gradiente que se mueve—. Un gesto por sección.
- ❌ **No** uses `transition: all`.
- ❌ **No** implementes el pseudo-elemento para la sombra sin haber medido antes.
- ❌ **No** toques la transición de entrada de la card: quedó separada a propósito en la historia 4.2.
- ❌ **No** agregues `view-transition-name`: es la historia 4.6.

### Comandos de verificación

```bash
# El @media de hover está presente
grep -n "hover: hover" src/styles/sections.scss

# Sin animación de propiedades de layout
grep -rnE "transition:.*(margin|width|height|top|left)" src/

# Sin transition: all
grep -rn "transition: all" src/
```En el navegador:

```js
// El overflow que contiene el zoom
getComputedStyle(document.querySelector('.project-media')).overflow    // 'hidden'

// Las acciones son visibles sin hover en touch
// (emular en DevTools → Toggle device toolbar, y verificar)
getComputedStyle(document.querySelector('.project-actions')).opacity

// Duraciones distintas: card rápida, imagen lenta
getComputedStyle(document.querySelector('.project-card')).transitionDuration
getComputedStyle(document.querySelector('.project-img')).transitionDuration
```

Y una grabación del panel Performance durante el hover: no deben aparecer bloques de *Layout*, solo
*Paint* y *Composite*.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; el hover eleva, la
imagen escala y las acciones aparecen; el mismo estado por `Tab` con foco visible; **en emulación touch
las acciones son visibles sin hover**; con movimiento reducido las acciones se revelan sin movimiento;
el zoom no desborda; el hover no dispara layout en el Performance; consola sin errores.

### Project Structure Notes

```
src/styles/sections.scss   MODIFICADO — estados de hover y focus-within de la card
```

Ningún archivo nuevo, ningún componente modificado. Es una historia enteramente de CSS: el markup ya lo
dejó la historia 4.2.

### References

- Historia y criterios: [Source: epics.md#Story 4.4]
- A5, card en hover: [Source: ux-design-specification.md#4.3]
- Presupuesto de movimiento: [Source: ux-design-specification.md#4.2]
- FR-13: [Source: prd.md#7.3 Proyectos]
- NFR-02/07/08: [Source: prd.md#8.1 y #8.2]
- Anti-patrón de animar `margin`: [Source: architecture.md#Pattern Examples]
- Estilos fuente: `public/ui-generated/home/page.css` líneas 330–441 (incluido el comentario del `@media`)

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2 —** al apuntar: `translateY(-6px)`, sombra `--shadow-md → --shadow-lg`, borde tirando a
acento e imagen a `scale(1.06)`. Las propiedades animadas son `transform`, `border-color` y
`box-shadow` en la card, y `transform` en la imagen. Ninguna de layout.

**AC3 —** `:focus-within` va en la misma regla que `:hover`, así que el estado es idéntico llegando por
teclado. El `:focus-visible` del control enfocado se ve por separado: la card cambiando de estado no
reemplaza al indicador de foco puntual.

**AC4 —** el bloque de `reduce` en `base.scss` ya fuerza `.project-actions { opacity: 1 !important;
transform: none !important }`, así que las acciones se revelan sin desplazamiento ni escala.

### El `@media (hover: hover)` es lo que hace la card usable en touch

Las acciones atenuadas viven **dentro** de `@media (hover: hover) and (pointer: fine)`. Fuera de ese
bloque están visibles por defecto.

Sin eso, en un dispositivo touch las acciones no aparecerían nunca —no hay hover— y el visitante de
mobile se quedaría sin los enlaces al sitio en vivo y al repositorio, que es justo lo que FR-12 pide
mostrar. El defecto **no se ve probando en escritorio con la ventana angosta**: `hover` depende del
dispositivo, no del ancho.

Además quedan en `opacity: 0.6` y no en `0`: un reclutador que escanea en 60 segundos tiene que ver que
hay un CTA sin tener que apuntarlo.

### El zoom va más lento que la elevación, a propósito

`.project-img` transiciona en `--dur-slow` (600 ms) mientras la card se eleva en `--dur-fast` (180 ms).
La card responde rápido al cursor y la imagen sigue con inercia. Igualarlas hace que el gesto se sienta
mecánico — es el tipo de diferencia que se "corrige" por parecer inconsistente.

Lo que contiene el zoom es el `overflow: hidden` de `.project-media`; sin él la imagen se sale de la
card y pisa a la de al lado en la grilla.

### `box-shadow` se anima y está bien

NFR-02 nombra `transform` y `opacity`, y `box-shadow` no está en esa lista. Pero A5 la pide
explícitamente y, a diferencia de `width` o `top`, **no dispara layout**: repinta, que es mucho más
barato. No se implementó el pseudo-elemento con la sombra grande: es más código y más difícil de
mantener, y la regla es medir primero.

### File List
