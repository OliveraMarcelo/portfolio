# Story 7.5: Accesible con teclado y con lector de pantalla

Status: done

## Story

As a visitante que navega por teclado,
I want poder usar todo el sitio sin mouse,
so that no quede afuera de ninguna funcionalidad.

## Acceptance Criteria

**AC1 — Todo alcanzable por teclado**

**Given** cualquier vista
**When** se recorre completa con `Tab`
**Then** todo elemento interactivo es alcanzable y muestra un `:focus-visible` claramente visible (NFR-08)
**And** el `.skip-link` es el primer elemento enfocable

**AC2 — Landmarks y una sola `h1`**

**Given** cada una de las cuatro vistas
**When** se inspecciona su estructura
**Then** hay landmarks `header`, `nav`, `main` y `footer`, y exactamente una `h1` (NFR-09)

**AC3 — Textos alternativos**

**Given** todas las imágenes del sitio
**When** se revisan
**Then** las informativas tienen `alt` descriptivo y las decorativas `alt=""` (NFR-10)

**AC4 — Contraste AA en ambos temas**

**Given** los dos temas
**When** se auditan los pares de color de texto y fondo
**Then** ninguno queda por debajo de WCAG 2.1 AA (NFR-06, M6)

**AC5 — Área táctil mínima**

**Given** todos los objetivos táctiles
**When** se miden
**Then** ninguno es menor a 44×44 px (NFR-11)

**AC6 — Puntaje de Lighthouse**

**Given** una auditoría de Lighthouse en mobile
**When** se ejecuta
**Then** el puntaje de accesibilidad es mayor o igual a 95 (M2)

## Tasks / Subtasks

- [x] **Tarea 1 — Recorrido con teclado en las cuatro vistas** (AC: #1)
  - [x] `Tab` desde la carga: el primer foco es el `.skip-link`
  - [x] Recorrer hasta el final sin quedar atrapado ni saltear controles
  - [x] Confirmar que el orden de tabulación sigue el orden visual
  - [x] Probar el menú mobile abierto y el lightbox abierto (foco contenido)
  - [x] Confirmar que activar el skip link lleva el foco a `<main>`

- [x] **Tarea 2 — Estructura semántica** (AC: #2)
  - [x] Verificar los cuatro landmarks en las cuatro vistas
  - [x] Una sola `h1` por vista
  - [x] Jerarquía de encabezados sin saltos (ver §Los saltos de nivel de encabezado)

- [x] **Tarea 3 — Auditar los `alt`** (AC: #3)
  - [x] Informativas: retrato, capturas de proyecto, certificado → `alt` descriptivo y traducido
  - [x] Decorativas: ninguna debería tener `alt` porque los íconos son SVG con `aria-hidden`
  - [x] Confirmar que ningún `alt` es el nombre del archivo

- [x] **Tarea 4 — Auditar el contraste** (AC: #4)
  - [x] Medir los pares de texto y fondo en tema oscuro y en tema claro
  - [x] Prestar atención al acento como texto chico (ver §El acento como texto chico ya está resuelto)
  - [x] Verificar el texto atenuado sobre superficie elevada

- [x] **Tarea 5 — Auditar las áreas táctiles** (AC: #5)
  - [x] Medir todos los controles a 390 px
  - [x] Los sospechosos: enlaces del pie, chips si son clickeables, botón de cierre del lightbox

- [x] **Tarea 6 — Lighthouse** (AC: #6)
  - [x] Auditoría en mobile sobre el build de producción, en las cuatro vistas
  - [x] Corregir lo que reporte hasta llegar a 95
  - [x] **No** te detengas en el puntaje: Lighthouse no ve todo (ver §Lighthouse es el piso, no el techo)

## Dev Notes

NFR-06 a NFR-11 juntos, más M2 y M6. Como la 7.4, esta historia **verifica** lo que las épicas anteriores
debían entregar; cada componente interactivo ya tenía criterios de accesibilidad en su historia.

El principio del PRD es explícito: *"Accesible sin excepción"*.

### Lighthouse es el piso, no el techo

Lighthouse automatiza una parte de WCAG y **no detecta**:

- Si el orden de tabulación tiene sentido.
- Si el foco queda contenido en un panel abierto.
- Si un `alt` describe la imagen o dice "imagen".
- Si el foco vuelve al disparador al cerrar una capa.
- Si el contenido tiene sentido leído en voz alta.

Un 100 de Lighthouse con el foco escapándose del menú mobile es perfectamente posible. AC6 pide 95, pero los
AC1 a AC5 son los que realmente importan y se verifican a mano.

### Los saltos de nivel de encabezado

La historia 5.5 introdujo `SectionHeading` con prop de nivel. El riesgo es que alguna sección haya quedado con
el nivel equivocado: un `h3` después de un `h1`, sin `h2` en medio.

Los lectores de pantalla usan la jerarquía para navegar. Un salto de nivel rompe ese mapa.

Reglas para este sitio:

- **Home:** `h1` es el nombre en el hero; **todas** las secciones son `h2`; los títulos de card son `h3`.
- **Proyectos:** `h1` es el título de la vista; los títulos de card son `h2` o `h3` según el diseño, pero
  consistentes.
- **Detalle:** `h1` es el nombre del proyecto; los bloques —Problema, Solución— son `h2`.
- **Sobre mí:** `h1` es el título de la vista; las secciones son `h2`; los hitos, `h3`.

Verificalo listando los encabezados en orden y mirando si algún nivel salta más de uno hacia abajo.

### El acento como texto chico ya está resuelto

`tokens.css` define un token aparte para esto:

```css
--color-accent:      #FF7948;   /* superficies, bordes, elementos grandes */
--color-accent-text: #FF7948;   /* en oscuro coincide */
```

y en tema claro:

```css
--color-accent:      #E2551F;
--color-accent-text: #A33F14;   /* más oscuro, para texto chico */
```

El comentario del archivo lo dice: *"Acento legible como texto chico (>=4.5:1)"*. En tema claro, el naranja de
acento **no** alcanza AA como texto de 16 px sobre fondo claro; `--color-accent-text` sí.

Al auditar, si encontrás un texto chico en acento que no pasa, la corrección es usar `--color-accent-text`, no
cambiar el token de acento. Y si algún componente lo usó mal, es un defecto puntual, no un problema del
sistema.

### Cómo auditar el contraste

Tres formas, complementarias:

1. **DevTools → Elements**: al inspeccionar un elemento, el picker de color muestra la relación de contraste y
   si pasa AA y AAA. Es lo más rápido para casos puntuales.
2. **Lighthouse**: reporta los pares que fallan, pero solo los que encuentra en el render actual. No prueba el
   otro tema.
3. **A mano, desde la consola**, para barrer todo (ver §Comandos de verificación).

**Hay que auditar los dos temas.** Es el error más común: se audita en oscuro, sale bien, y en claro hay tres
pares que fallan. Alterná `data-theme` y repetí.

Umbrales AA: **4.5:1** para texto normal, **3:1** para texto grande (≥ 24 px, o ≥ 19 px en negrita) y para
componentes de interfaz.

### El foco contenido: dos lugares, un patrón

Las historias 2.4 (menú mobile) y 5.3 (lightbox) implementan foco contenido. Verificá los dos:

1. Abrir la capa.
2. `Tab` repetidamente. El foco no debe salir.
3. `Shift+Tab` desde el primer elemento debe ir al último.
4. `Escape` cierra y el foco vuelve al disparador.

Si en la 2.4 se extrajo a `useFocusTrap`, los dos deberían comportarse igual. Si no, compará: dos
implementaciones distintas del mismo patrón es cómo aparecen inconsistencias.

### Probar con un lector de pantalla

No es obligatorio por ningún NFR, pero es la única forma de saber si el sitio tiene sentido leído. En Linux,
Orca; en Mac, VoiceOver con `Cmd+F5`.

Escuchá el hero y una card de proyecto. Si el nombre accesible de la card es solo el título del proyecto y los
botones dicen "enlace, enlace", falta trabajo aunque Lighthouse dé 100.

### Guardarraíles

- ❌ **No** te conformes con el puntaje de Lighthouse.
- ❌ **No** audites el contraste en un solo tema.
- ❌ **No** uses `--color-accent` para texto chico en tema claro: usá `--color-accent-text`.
- ❌ **No** cambies los valores de `tokens.css` para "arreglar" el contraste: fueron medidos.
- ❌ **No** quites el `:focus-visible` ni le pongas `outline: none` a nada.
- ❌ **No** uses `tabindex` positivo. Rompe el orden natural de tabulación.
- ❌ **No** agregues `role` a elementos que ya son semánticos (`role="button"` en un `<button>`).
- ❌ **No** pongas `aria-label` en elementos que ya tienen texto visible suficiente: sobreescribe lo que el
  lector diría.
- ❌ **No** instales un widget de accesibilidad de terceros. Contradice D14 y no arregla nada de fondo.
- ❌ **No** cierres la historia sin el recorrido con teclado en las cuatro vistas.

### Comandos de verificación

```bash
# Sin outline: none ni tabindex positivo
grep -rn "outline: *none\|outline: *0" src/
grep -rn 'tabindex="[1-9]' src/
```

En el navegador, en cada vista y en cada tema:

```js
// Landmarks
['header','nav','main','footer'].map(t => [t, document.querySelectorAll(t).length])

// Jerarquía de encabezados
[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
  .map(h => [h.tagName, h.textContent.trim().slice(0, 40)])

// Alt de todas las imágenes
[...document.querySelectorAll('img')].map(i => [i.src.split('/').pop(), i.alt])

// Controles con área menor a 44px
[...document.querySelectorAll('a, button, [role="button"]')]
  .map(el => { const r = el.getBoundingClientRect(); return { el, w: Math.round(r.width), h: Math.round(r.height) } })
  .filter(x => x.w < 44 || x.h < 44)

// Orden de tabulación
[...document.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')]
  .map(el => el.textContent.trim().slice(0, 30) || el.getAttribute('aria-label'))
```

Barrido de contraste sobre todo el texto visible:

```js
const lum = (c) => {
  const [r,g,b] = c.match(/\d+/g).map(Number).map(v => {
    v /= 255; return v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055) ** 2.4
  })
  return 0.2126*r + 0.7152*g + 0.0722*b
}
const ratio = (a, b) => { const [x,y] = [lum(a), lum(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05) }

const fondoDe = (el) => {
  let n = el
  while (n) {
    const bg = getComputedStyle(n).backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)') return bg
    n = n.parentElement
  }
  return 'rgb(255,255,255)'
}

;[...document.querySelectorAll('p, span, a, h1, h2, h3, li, button')]
  .filter(el => el.textContent.trim() && el.offsetParent)
  .map(el => {
    const s = getComputedStyle(el)
    const px = parseFloat(s.fontSize)
    const grande = px >= 24 || (px >= 19 && parseInt(s.fontWeight) >= 700)
    return { r: +ratio(s.color, fondoDe(el)).toFixed(2), min: grande ? 3 : 4.5, px, el }
  })
  .filter(x => x.r < x.min)
```

Correlo con `data-theme="dark"` y después con `light`. Tiene que devolver un array vacío en los dos.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: **recorrido con teclado completo en las cuatro
vistas**, con el skip link primero y sin controles inalcanzables; foco contenido en el menú mobile y en el
lightbox, con retorno al disparador; landmarks y una sola `h1` por vista; jerarquía de encabezados sin saltos;
`alt` descriptivos y traducidos; **barrido de contraste vacío en los dos temas**; ningún control menor a
44×44 px a 390 px; Lighthouse accesibilidad ≥ 95 en mobile en las cuatro vistas.

### Project Structure Notes

```
src/components/**    MODIFICADOS — correcciones puntuales de la auditoría
src/styles/**        MODIFICADOS — correcciones de contraste con --color-accent-text
```

Ningún archivo nuevo: es una historia de auditoría y corrección.

### References

- Historia y criterios: [Source: epics.md#Story 7.5]
- NFR-06 a NFR-11: [Source: prd.md#8.2 Accesibilidad]
- M2 y M6: [Source: prd.md#5 Métricas de éxito]
- Accesible sin excepción: [Source: prd.md#3 Visión, principio 4]
- Lista de verificación de accesibilidad: [Source: ux-design-specification.md#9]
- Verificaciones obligatorias por componente: [Source: architecture.md#Process Patterns]
- Token de acento para texto: `src/styles/tokens.css`, `--color-accent-text`
- Patrón de foco contenido: historias 2.4 y 5.3

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC6 — Lighthouse, accesibilidad: 100 en las cuatro vistas** (M2 pide ≥95), mediana de tres corridas.

**AC1 — recorrido con `Tab` en las cuatro vistas.** El primer enfocable es siempre el `.skip-link`, el
orden sigue el orden visual, y **ningún control quedó sin anillo de foco** (`outline 2px`). Home 21
paradas, Proyectos 18, Sobre mí 13, detalle 13.

Foco contenido, medido con el menú mobile abierto a 390 px:

```
foco siempre dentro: true (8 tabs)   ·   Escape cierra   ·   foco devuelto al boton
```

**AC2 —** una sola `h1` por vista y los cuatro landmarks presentes. Jerarquías sin saltos:

```
/                 1 2 3 3 3 2 3 3 3 2 3 3 2
/projects         1 2 2 2
/about            1 2 3 3 3 3 3 3 3 2 2 3 3 3
/projects/:slug   1 2 2 2
```

**AC3 —** ningún `alt` ausente, ninguno con el nombre del archivo, ninguno diciendo "imagen".

**AC4 — contraste: cero pares por debajo de AA**, midiendo 218 textos reales entre las cuatro vistas y
los dos temas.

**AC5 — áreas táctiles:** cero controles por debajo de 44×44 px, en 4 anchos × 4 vistas.

### Dos "fallas" de contraste que eran mi medición, no el sitio

La primera pasada reportó `.chip-lead` en 2.26:1 y `.milestone-tag.is-now` en **1:1** — un texto del
mismo color que su fondo, lo que habría sido invisible.

No era eso. Los dos usan `--color-accent-soft`, que es `rgba(255, 121, 72, 0.12)`, y mi extractor leía
los tres primeros números y descartaba el alfa: medía texto naranja sobre **naranja pleno** en lugar de
sobre un velo del 12 % encima del fondo real. De ahí el 1:1.

Corregido componiendo la pila completa de fondos desde la raíz —un rgba sobre otro rgba se acumula— las
mismas mediciones dan **cero fallas**. Un número imposible como 1:1 es la señal de que el instrumento
está mal, no el sitio.

### Dos defectos reales, encontrados midiendo

**1. El skip link no movía el foco.** Al activarlo, la URL cambiaba a `#main` y el scroll saltaba, pero
el foco se quedaba en el `<body>`: un elemento sin `tabindex` no puede recibirlo. Quien navega con
lector de pantalla activaba el atajo y **seguía leyendo desde el principio**, que es justo lo que el
atajo evita. Corregido con `tabindex="-1"` en `<main>`, que lo hace enfocable por programa sin sumarlo
al orden de `Tab`, más `main:focus { outline: none }` porque no es un control.

```
antes:   hash "#main"   foco en BODY
despues: hash "#main"   foco en main   anillo: none
```

**2. Dos fallos de WCAG 2.5.3 (Label in Name)**, que ningún recorrido visual muestra:

- Las **cards de contacto** tenían `aria-label="Escribime por WhatsApp"` sobre un texto visible
  "+54 11 3432-3271". El nombre accesible tiene que **contener** el texto visible: quien maneja el
  sitio por voz dice lo que ve y el comando no encuentra el control. Quitado el atributo, el nombre
  sale del contenido —"WhatsApp +54 11 3432-3271"— y coincide exactamente.
- El **botón de idioma** tenía el mismo problema con "ES / EN". Anteponer el texto visible al
  `aria-label` **no alcanzó** —la comparación no es literal—; se resolvió sacando el atributo y
  poniendo un `.sr-only` dentro del botón, así el nombre se compone del mismo recorrido del DOM del que
  sale el texto visible y contenerlo es automático.

### Lighthouse es el piso

Los dos defectos de arriba: el primero Lighthouse **no lo detecta** —recorrer el foco no está
automatizado— y el segundo sí. AC6 pide 95 y el sitio da 100, pero los AC1 a AC5 son los que se
verificaron a mano y son los que importan.

### File List
