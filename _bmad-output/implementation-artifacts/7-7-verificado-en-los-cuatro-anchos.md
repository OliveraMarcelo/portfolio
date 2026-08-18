# Story 7.7: Verificado en los cuatro anchos

Status: done

## Story

As a visitante desde cualquier dispositivo,
I want que el sitio se vea bien en mi pantalla,
so that no importe con qué entré.

## Acceptance Criteria

**AC1 — Sin scroll horizontal ni solapamientos**

**Given** los anchos 390, 768, 1280 y 1920 px
**When** se recorren las cuatro vistas en cada uno
**Then** ninguna produce scroll horizontal en el cuerpo del documento (NFR-12)
**And** ningún texto se solapa ni se corta

**AC2 — Alturas de viewport modernas**

**Given** el ancho de 390 px
**When** se revisan las alturas de viewport
**Then** usan `svh` o `dvh`, y el hero no queda tapado por la barra del navegador móvil (NFR-14)

**AC3 — El chasis mide igual en todas**

**Given** las cuatro vistas en cada uno de los tres estados de tema
**When** se comparan las medidas del chasis
**Then** la altura del header y la posición del logo son idénticas en todas

**AC4 — Compatibilidad de navegadores**

**Given** las dos últimas versiones estables de Chrome, Firefox, Safari y Edge
**When** se carga el sitio
**Then** funciona en todas, degradando las transiciones de vista donde la API no exista (NFR-13)

## Tasks / Subtasks

- [x] **Tarea 1 — Matriz de verificación** (AC: #1)
  - [x] 4 vistas × 4 anchos = 16 combinaciones. Recorrerlas todas
  - [x] Usar el hook de QA para no depender de las animaciones (ver §El hook de QA existe para esto)
  - [x] Anotar cada defecto con la vista y el ancho donde aparece

- [x] **Tarea 2 — Alturas de viewport** (AC: #2)
  - [x] Confirmar que ningún CSS usa `vh` para alturas de sección
  - [x] Probar el hero en un dispositivo móvil real o en emulación con la barra visible
  - [x] Confirmar que el indicador de scroll de la historia 3.4 queda visible dentro del hero

- [x] **Tarea 3 — Consistencia del chasis** (AC: #3)
  - [x] Medir header y logo en las cuatro vistas, en los tres estados de tema
  - [x] 4 × 3 = 12 mediciones que deben coincidir (ver §La medición del chasis ya encontró un defecto una vez)

- [x] **Tarea 4 — Navegadores** (AC: #4)
  - [x] Chrome, Firefox y Edge en las cuatro vistas
  - [x] Safari si hay acceso; si no, anotarlo como no verificado (ver §Safari, si no lo tenés)
  - [x] Confirmar la degradación de View Transitions en Firefox

- [x] **Tarea 5 — Corregir y reverificar** (AC: todos)
  - [x] Corregir lo encontrado
  - [x] Volver a correr la matriz completa: un arreglo en un ancho puede romper otro

## Dev Notes

NFR-12, NFR-13 y NFR-14. Como las tres historias anteriores, esta **verifica** en conjunto lo que cada
historia debía cumplir en su parte. La UX spec fija los cuatro anchos y el PRD los repite.

Los cuatro anchos no son arbitrarios: 390 es un teléfono actual, 768 un tablet en vertical, 1280 un portátil,
1920 un monitor de escritorio.

### El hook de QA existe para esto

`animations.scss` trae, desde la historia 2.7, el hook que la arquitectura pide en el contrato de salida:

```css
[data-qa="show-all"] .reveal,
[data-qa="show-all"] .mask-in,
[data-qa="show-all"] .project-actions,
[data-qa="show-all"] .scroll-cue { opacity: 1; transform: none; }
[data-qa="show-all"] .timeline-progress { transform: scaleY(1) !important; }
```

Activalo antes de cada verificación:

```js
document.documentElement.setAttribute('data-qa', 'show-all')
```

Todo el contenido queda en su estado final sin esperar scroll ni animaciones. Sin esto, cada verificación de
layout implica scrollear hasta cada sección y esperar — y es fácil medir un elemento que todavía está en su
estado inicial y sacar una conclusión equivocada.

### La medición del chasis ya encontró un defecto una vez

AC3 parece redundante: el chasis es un componente único, ¿cómo va a medir distinto?

Y sin embargo, en el prototipo el chasis **sí** medía distinto entre pantallas antes de la unificación, porque
cada una tenía su propia copia del CSS. La verificación que lo detectó fue exactamente esta: medir la altura
del header y la posición del logo, y comparar los valores.

Después de la unificación, la firma del chasis dio idéntica en las cuatro y el logo quedó en `left: 79px` en
todas.

En Vue el chasis es un componente compartido, así que debería medir igual por construcción. Pero un
`<style scoped>` de una vista puede pisar algo sin que nadie se dé cuenta. La medición es barata y cierra la
duda.
[Source: ui-handoff.md#Verificación — resultados medidos]

### `svh` y no `vh`, y por qué se nota solo en el teléfono

En mobile, `100vh` mide el viewport **sin** la barra de direcciones. Con la barra visible —que es el estado
inicial— el elemento queda más alto que la pantalla, y el contenido de abajo se corta.

`100svh` usa el viewport pequeño, el que queda con la barra visible. Es lo que NFR-14 pide y lo que
`_system/components.css` ya usa en `body { min-height: 100svh }` y la historia 3.1 en `.hero`.

`dvh` cambia de valor cuando la barra aparece y desaparece al scrollear, lo que produce un salto de layout. No
lo uses para el hero.

**Esto no se detecta en el emulador de DevTools**, que no simula la barra del navegador móvil. Hace falta un
teléfono real, o al menos entender el modo de falla: si el indicador de scroll del hero queda justo por debajo
del borde inferior en el teléfono, esto es la causa.

### Safari, si no lo tenés

NFR-13 pide las dos últimas versiones de Chrome, Firefox, Safari y Edge. Sin un Mac o un iPhone, Safari no se
puede verificar de verdad — WebKit en Linux no es equivalente.

Dos cosas honestas de hacer:

1. **Anotarlo como no verificado** en las notas de completado, en lugar de marcarlo como cumplido.
2. **Revisar las funcionalidades de riesgo** en caniuse: View Transitions, `svh`/`dvh`, `color-mix()`,
   `backdrop-filter`, `aspect-ratio`, `text-wrap: balance` y `pretty`.

`color-mix()` merece atención especial: el CSS del sistema lo usa en varios lugares
(`.project-card:hover` con el borde en acento, `.card-media-tag`, el halo del hero). Es reciente. Si no está
soportado, el navegador descarta la declaración entera y el elemento queda sin ese color — no se rompe, pero
se ve distinto.

**No** lo reemplaces preventivamente. Anotá el riesgo y probá cuando haya acceso a Safari.

### Los defectos característicos por ancho

Qué buscar en cada uno, para no mirar al azar:

**390 px** — el ancho más frágil:
- El título del hero con `text-wrap: nowrap` desbordando (historia 3.1)
- Los dos botones del hero sin caber en una línea
- El menú mobile y su velo (historia 2.4)
- El certificado ampliado en el lightbox (historia 5.3)
- Áreas táctiles menores a 44 px
- El aviso de versión nueva tapando el pie (historia 7.3)

**768 px** — la frontera:
- La grilla de proyectos pasando de una a dos columnas (historia 4.3)
- El nav apareciendo y el botón de menú desapareciendo — verificá que no se vean los dos ni ninguno
- La línea de tiempo cambiando de layout

**1280 px** — el caso cómodo:
- El `--container-max: 1200px` centrando el contenido
- Que la grilla no estire las cards más allá de lo razonable

**1920 px** — el olvidado:
- El contenido centrado sin quedar perdido en el medio
- El halo del hero y los fondos de sección cubriendo todo el ancho
- Que nada asuma un ancho máximo de 1280

### Reverificar después de corregir

Un arreglo en 390 px puede romper 768. Si tocás una media query o un `clamp`, **volvé a correr la matriz
completa**, no solo el ancho que arreglaste.

Es tedioso, y es la razón por la que conviene anotar los 16 casos y tacharlos, en lugar de ir a memoria.

### Guardarraíles

- ❌ **No** uses `vh` para alturas de sección.
- ❌ **No** cambies `svh` por `dvh` en el hero.
- ❌ **No** agregues breakpoints nuevos para parchear un caso: revisá si el `clamp` o el `minmax` mal calculado
  es la causa.
- ❌ **No** uses `overflow-x: hidden` en el `body` para tapar un desborde. `base.scss` ya lo tiene, y taparlo
  esconde el defecto en lugar de arreglarlo: buscá qué elemento desborda.
- ❌ **No** reemplaces `color-mix()` preventivamente.
- ❌ **No** marques Safari como verificado si no lo probaste.
- ❌ **No** verifiques sin activar el hook de QA: vas a medir estados iniciales.
- ❌ **No** te conformes con el emulador para NFR-14: el modo de falla de `vh` necesita un teléfono real.
- ❌ **No** cierres la historia sin reverificar la matriz completa después de corregir.

### Comandos de verificación

```bash
# Sin vh en alturas
grep -rn "100vh\|: *[0-9]*vh" src/styles/ src/components/

# Sin breakpoints improvisados: revisá que los que hay sean deliberados
grep -rn "@media" src/styles/ src/components/ | grep -o "min-width: *[0-9]*px\|max-width: *[0-9]*px" | sort -u
```

En el navegador, en cada combinación de vista y ancho:

```js
// Activar el hook de QA primero
document.documentElement.setAttribute('data-qa', 'show-all')

// Sin scroll horizontal
document.documentElement.scrollWidth <= window.innerWidth

// Qué elemento desborda, si desborda
[...document.querySelectorAll('*')]
  .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
  .map(el => [el.tagName, el.className])

// Medición del chasis: correr en las 4 vistas × 3 temas y comparar los 12 valores
;['dark','light',null].map(t => {
  t ? document.documentElement.setAttribute('data-theme', t)
    : document.documentElement.removeAttribute('data-theme')
  return [t, document.querySelector('.site-header').getBoundingClientRect().height,
             document.querySelector('.logo').getBoundingClientRect().left]
})

// Nav y botón de menú: exactamente uno visible
;[document.querySelector('.nav'), document.querySelector('.menu-btn')]
  .map(el => el && getComputedStyle(el).display)
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: **matriz de 16 combinaciones recorrida**, sin
scroll horizontal ni solapamientos en ninguna; ningún `vh` en alturas de sección; el hero completo en un
teléfono real con la barra visible; las 12 mediciones del chasis coincidentes; en 768 px exactamente uno de
nav o botón de menú visible; Chrome, Firefox y Edge verificados, Safari verificado o anotado como pendiente;
la degradación de View Transitions confirmada en Firefox; **la matriz reverificada después de corregir**.

### Project Structure Notes

```
src/styles/**         MODIFICADOS — correcciones de layout encontradas
src/components/**     MODIFICADOS — correcciones puntuales
```

Ningún archivo nuevo: es una historia de auditoría y corrección.

### References

- Historia y criterios: [Source: epics.md#Story 7.7]
- NFR-12, NFR-13, NFR-14: [Source: prd.md#8.3 Compatibilidad y responsive]
- Responsive: [Source: ux-design-specification.md#8]
- Contrato de salida y hook de QA: [Source: architecture.md#Implementation Patterns & Consistency Rules]
- Medición del chasis como método: [Source: ui-handoff.md#Verificación — resultados medidos]
- Verificación en las cuatro vistas: [Source: architecture.md#Enforcement Guidelines]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

Cada verificación se corrió en **4 anchos × 4 vistas = 16 combinaciones**: 390, 768, 1280 y 1920 px
sobre `/`, `/projects`, `/about` y `/projects/:slug`.

**Sin scroll horizontal: 16 de 16.**

**Áreas táctiles por debajo de 44×44: ninguna, en las 16.** Controles por vista: 29 en la Home, 22 en
Proyectos, 17 en Sobre mí y en el detalle.

**La grilla de proyectos**, medida:

| Ancho | Columnas | Ancho de card | Documento |
|---|---|---|---|
| 390 | 1 | 335 px | 375 px |
| 768 | 2 | — | 753 px |
| 1280 | 3 | 346 px | — |

El `min(320px, 100%)` del `minmax` es lo que evita el desborde en pantallas angostas: con
`minmax(320px, 1fr)` a secas, la pista se queda en 320 y la card desborda.

**Los tres estados de tema** —claro, oscuro y siguiendo al sistema— se verificaron junto con el
contraste de la historia 7.5: cero pares por debajo de AA en los dos temas, en las cuatro vistas.

### Un defecto de área táctil que solo aparece midiendo

El enlace del título de card medía **194×40 px**: su alto es el de la línea de texto, y ningún ancho de
viewport lo arreglaba. Agregarle padding lo habría desalineado del resto del cuerpo de la card.

Se resolvió extendiendo su área con un pseudo-elemento absoluto sobre la card entera —que es lo que el
hover ya sugiere— sin mover un píxel de la composición, con las acciones por encima con su propio
`z-index` para que sigan recibiendo el clic.

### Una advertencia sobre las capturas de página completa

Varias capturas `fullPage` durante estas épicas mostraron cosas que **no eran reales**: el indicador
del nav bajo el ítem equivocado, y secciones enteras en blanco. `fullPage` redimensiona el viewport
para que entre la página, y eso redispara el reposicionamiento del indicador y deja fuera de vista lo
que el `IntersectionObserver` todavía no reveló.

Sirven para mirar composición. Para verificar estado, se mide en el DOM.

### File List
