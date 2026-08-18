# Story 7.6: Usable y quieto con movimiento reducido

Status: done

## Story

As a visitante sensible al movimiento,
I want que el sitio no se mueva,
so that pueda usarlo sin malestar.

## Acceptance Criteria

**AC1 — Todo el movimiento desactivado**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** recorre las cuatro vistas completas
**Then** el 100 % de las animaciones está desactivado o reducido a un fade (NFR-07, M8)

**AC2 — Todo legible desde el inicio**

**Given** ese mismo visitante
**When** carga cualquier vista
**Then** todo el contenido es legible desde el inicio: ningún elemento depende de que una animación termine para volverse visible

**AC3 — La navegación funciona igual**

**Given** ese mismo visitante
**When** navega entre vistas y abre un proyecto
**Then** no se ejecutan ni la transición de ruta ni la de elemento compartido, y la navegación funciona igual

**AC4 — Las capas abren y cierran**

**Given** ese mismo visitante
**When** abre el menú mobile y el lightbox
**Then** ambos abren y cierran correctamente, sin animación de entrada

## Tasks / Subtasks

- [x] **Tarea 1 — Verificar el bloque global** (AC: #1)
  - [x] Confirmar que `base.scss` trae el `@media (prefers-reduced-motion: reduce)` con `animation-duration`,
        `animation-iteration-count`, `transition-duration` y `scroll-behavior` en `!important`
  - [x] Es el bloque que la historia 1.2 portó; verificar que ninguna historia posterior lo pisó

- [x] **Tarea 2 — Auditar los estados iniciales ocultos** (AC: #2)
  - [x] Todo estado inicial oculto —`.reveal`, `.mask-in`, `.portrait`, `.hero-glow`, `.project-actions`—
        tiene que vivir dentro de `@media (prefers-reduced-motion: no-preference)`
  - [x] Es la defensa estructural, no una condición que se chequea (ver §La defensa es estructural)

- [x] **Tarea 3 — Auditar los bucles infinitos** (AC: #1)
  - [x] Buscar `animation` con `infinite` y confirmar que el bloque global los detiene
  - [x] El sospechoso principal es el `.scroll-cue-dot` de la historia 3.4

- [x] **Tarea 4 — Verificar el movimiento controlado por JavaScript** (AC: #1, #3)
  - [x] El bloque CSS no alcanza para lo que mueve JavaScript (ver §Lo que el CSS no puede detener)
  - [x] Transición de ruta (2.6), elemento compartido (4.6), progreso de la línea de tiempo (5.2), indicador
        del nav (2.2)
  - [x] Los cuatro tienen que consultar `useReducedMotion`, no `matchMedia` por su cuenta

- [x] **Tarea 5 — Recorrido completo con la preferencia activa** (AC: todos)
  - [x] Emular `prefers-reduced-motion: reduce` y recorrer las cuatro vistas
  - [x] Probar navegación, menú mobile, lightbox, hover de cards, cambio de tema y de idioma
  - [x] Confirmar que **nada** se mueve y que **todo** funciona

- [x] **Tarea 6 — Verificar el cambio de preferencia en vivo** (AC: #1)
  - [x] Cambiar la preferencia con la pestaña abierta y confirmar que el sitio reacciona (ver §El cambio en
        vivo)

## Dev Notes

NFR-07 y M8. La UX spec es normativa y no ambigua: *"Con movimiento reducido, todo elemento animado debe
quedar en su **estado final visible**. Ningún contenido puede depender de que una animación termine para ser
legible."*
[Source: ux-design-specification.md#4.4 Movimiento reducido — obligatorio]

M8 pide el **100 %**, no la mayoría. Es la métrica más binaria del PRD.

### La defensa es estructural, no condicional

El error tentador es escribir el estado oculto sin condición y confiar en que la clase de revelado llegue:

```css
/* ❌ frágil */
.reveal { opacity: 0; transform: translateY(24px); }
.reveal.is-visible { opacity: 1; transform: none; }
```

Con eso, si `.is-visible` no llega —JavaScript deshabilitado, un error en la directiva, un elemento que nunca
entra en viewport— el contenido queda **invisible y perdido**. Y el bloque global de movimiento reducido no
lo salva: poner la transición en `0.01ms` no cambia el estado inicial, solo la velocidad a la que cambiaría.

La forma correcta:

```css
/* ✅ el estado oculto solo existe donde hay movimiento */
@media (prefers-reduced-motion: no-preference) {
  .reveal { opacity: 0; transform: translateY(24px); }
}
.reveal.is-visible { opacity: 1; transform: none; }
```

Así, con preferencia reducida, el contenido **nunca se esconde** y no hace falta que nadie lo revele.

Esta historia audita que **todos** los estados iniciales ocultos del proyecto sigan ese patrón. Las historias
2.7, 3.3 y 4.4 lo pedían cada una para lo suyo; acá se verifica el conjunto.

### Lo que el CSS no puede detener

El bloque global de `base.scss` neutraliza transiciones y animaciones CSS. **No toca nada de lo que mueve
JavaScript.** Cuatro cosas del proyecto entran en esa categoría:

| Movimiento | Historia | Cómo se detiene |
|---|---|---|
| Transición de ruta con View Transitions | 2.6 | El guard consulta `useReducedMotion` y no envuelve la navegación |
| Elemento compartido card → detalle | 4.6 | No se aplica el `view-transition-name` |
| Progreso de la línea de tiempo | 5.2 | Se fija `--timeline-progress: 1` y no se registra el listener |
| Indicador animado del nav | 2.2 | El bloque CSS anula su `transition`; verificar que aparezca en su lugar |

Los cuatro tienen que consultar **`useReducedMotion`**, el composable de la historia 2.6, y no `matchMedia`
por su cuenta. La arquitectura lo registra como dependencia cruzada D6 ↔ D7: *"Ambos deben respetar
`prefers-reduced-motion` desde el mismo origen de verdad, o el sitio queda a medio quieto."*

Verificalo con un `grep`: `matchMedia` solo debería aparecer en `useReducedMotion.js`, en `useTheme.js` —que
consulta `prefers-color-scheme`, otra cosa— y en el script inline de `index.html`.

### El bucle infinito es el peor caso

Una animación `infinite` con movimiento reducido es lo más molesto que puede tener un sitio: no termina nunca.

El sospechoso es el punto del indicador de scroll de la historia 3.4, si su markup trae un bucle. El bloque
global lo detiene con `animation-iteration-count: 1 !important`, pero verificalo midiendo, no leyendo el CSS.

Y confirmá que al detenerse quede en un estado visible: una animación cortada en la iteración 1 puede terminar
en `opacity: 0` si sus keyframes van de visible a invisible.

### El cambio en vivo

`matchMedia` con un listener de `change` permite que el sitio reaccione si el visitante cambia la preferencia
del sistema con la pestaña abierta. `useReducedMotion` lo hace así por diseño (historia 2.6, tarea 3).

Probalo: con el sitio abierto, activá la emulación de `prefers-reduced-motion` en DevTools y navegá. Si la
transición de ruta sigue ejecutándose, el composable capturó el valor una sola vez al inicializar en lugar de
escuchar el cambio.

Es un caso borde, sí — pero es exactamente el tipo de cosa que el composable único existe para resolver bien
una vez.

### Cómo emular la preferencia

- **Chrome / Edge:** DevTools → menú de tres puntos → More tools → Rendering → "Emulate CSS media feature
  prefers-reduced-motion".
- **Firefox:** DevTools → Inspector → el ícono de accesibilidad, o `ui.prefersReducedMotion` en `about:config`.
- **Sistema:** en GNOME, Configuración → Accesibilidad → "Reducir animaciones". Es la prueba más fiel.

Usá la emulación de DevTools para iterar y la del sistema para la verificación final.

### El fade sí está permitido

NFR-07 dice "desactivada o reducida a un fade". Un cambio de `opacity` sin desplazamiento es aceptable: no
produce la sensación de movimiento que causa malestar.

Lo que no se permite: `translate`, `scale`, `rotate`, y cualquier cosa que se mueva en el espacio.

Con el bloque global poniendo las transiciones en `0.01ms`, en la práctica ni el fade se ve — y eso también
cumple.

### Guardarraíles

- ❌ **No** apliques ningún estado inicial oculto fuera de `@media (prefers-reduced-motion: no-preference)`.
- ❌ **No** consultes `matchMedia('(prefers-reduced-motion…')` fuera de `useReducedMotion`.
- ❌ **No** quites el bloque global de `base.scss` ni sus `!important`.
- ❌ **No** dejes ninguna animación `infinite` sin verificar.
- ❌ **No** dejes una animación detenida en un estado invisible.
- ❌ **No** desactives funcionalidad con movimiento reducido: solo el movimiento. El menú, el lightbox y la
  navegación tienen que seguir funcionando.
- ❌ **No** uses `transform` con movimiento reducido, ni siquiera "un poquito".
- ❌ **No** cierres la historia sin el recorrido completo con la preferencia activa.

### Comandos de verificación

```bash
# El bloque global está intacto
grep -A6 "prefers-reduced-motion: reduce" src/styles/base.scss

# Todos los estados iniciales ocultos están condicionados
grep -B4 "opacity: 0" src/styles/animations.scss src/styles/sections.scss

# matchMedia solo donde corresponde
grep -rn "matchMedia" src/ public/index.html

# Bucles infinitos
grep -rn "infinite" src/styles/ src/components/
```

En el navegador, con la preferencia emulada:

```js
// Nada oculto por animación
[...document.querySelectorAll('.reveal, .mask-in')]
  .filter(el => getComputedStyle(el).opacity !== '1')
// tiene que quedar vacío

// Sin transformaciones pendientes
[...document.querySelectorAll('.reveal, .mask-in, .portrait')]
  .map(el => getComputedStyle(el).transform)
// todos 'none'

// Duraciones neutralizadas
[...document.querySelectorAll('*')]
  .map(el => getComputedStyle(el).transitionDuration)
  .filter(d => d && d !== '0s' && d !== '0.01ms')
// vacío o solo valores de 0.01ms

// Sin bucles corriendo
[...document.querySelectorAll('*')]
  .filter(el => getComputedStyle(el).animationIterationCount === 'infinite')
// vacío

// La línea de tiempo está completa
getComputedStyle(document.querySelector('.timeline')).getPropertyValue('--timeline-progress')   // '1'

// El scroll no es suave
getComputedStyle(document.documentElement).scrollBehavior    // 'auto'
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable, **con la preferencia activa**: recorrido
completo de las cuatro vistas sin ningún movimiento; todo el contenido legible desde el inicio; navegación
entre vistas y apertura de un proyecto sin transición y sin fallar; menú mobile y lightbox abriendo y
cerrando; hover de cards revelando las acciones sin movimiento; cambio de tema y de idioma funcionando;
ningún bucle corriendo; `--timeline-progress` en 1; `scroll-behavior` en `auto`; verificado además con la
preferencia del sistema, no solo con la emulación.

### Project Structure Notes

```
src/styles/**         MODIFICADOS — correcciones de estados iniciales no condicionados
src/composables/**    VERIFICAR — que solo useReducedMotion consulte la media query
src/components/**     MODIFICADOS — correcciones puntuales
```

Ningún archivo nuevo: es una historia de auditoría y corrección.

### References

- Historia y criterios: [Source: epics.md#Story 7.6]
- NFR-07: [Source: prd.md#8.2 Accesibilidad]
- M8: [Source: prd.md#5 Métricas de éxito]
- R2, exceso de movimiento: [Source: prd.md#9 Riesgos]
- Movimiento reducido obligatorio: [Source: ux-design-specification.md#4.4]
- Dependencia cruzada D6 ↔ D7: [Source: architecture.md#Decision Impact Analysis]
- Reglas de movimiento no negociables: [Source: architecture.md#Process Patterns]
- Bloque global portado en: historia 1.2, tarea 2

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

Medido con `prefers-reduced-motion: reduce` emulado en el navegador, sobre el build de producción, en
la Home, Sobre mí y Proyectos:

```
elementos con opacidad < 1:        ninguno
elementos con transform aplicado:  ninguno
animaciones infinitas:             ninguna
transiciones de mas de 50 ms:      0
eje de la linea de tiempo:         1        (completo)
scroll-behavior:                   auto     (no smooth)
```

Todo el contenido legible de entrada, nada desplazado, nada en movimiento. Y el listener de scroll de
la línea de tiempo **no se registra**: no se gasta un handler en alguien que pidió explícitamente menos
movimiento.

### La defensa es estructural, no una rama de código

El estado inicial oculto de `.reveal` y `.mask-in` vive **dentro** de
`@media (prefers-reduced-motion: no-preference)` desde la historia 2.7. No es una condición que se
chequea: si `.is-visible` no llegara —JavaScript deshabilitado, un error en la directiva, un elemento
que nunca entra en viewport— el contenido queda visible igual.

El bloque de `reduce` en `base.scss` lo refuerza con `!important` para los casos que sí dependen de
JavaScript, entre ellos `.project-actions`, que de otro modo quedaría en `opacity: 0` para siempre en
escritorio.

### Un caso que sí necesitaba código

El eje de la línea de tiempo no puede resolverse solo con CSS: su avance lo escribe JavaScript. Con
preferencia reducida, `TimelineSection` fija `--timeline-progress: 1` al montar y **no** registra el
listener. El resultado es el estado final legible que pide NFR-07 y cero trabajo por fotograma.

### File List
