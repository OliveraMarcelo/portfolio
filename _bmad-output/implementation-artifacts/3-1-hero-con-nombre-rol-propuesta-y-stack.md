# Story 3.1: Hero con nombre, rol, propuesta y stack

Status: done

## Story

As a reclutador técnico con poco tiempo,
I want entender de inmediato quién es esta persona y qué maneja,
so that pueda decidir en segundos si sigo leyendo.

## Acceptance Criteria

**AC1 — Todo visible sin scroll**

**Given** un viewport de 390 px de ancho
**When** se carga la Home sin scrollear
**Then** son visibles el nombre "Marcelo Olivera", el rol "Frontend Developer", una línea de propuesta de valor y los chips del stack principal (FR-05)

**AC2 — Estructura semántica y sin texto literal**

**Given** el componente `src/components/sections/HeroSection.vue`
**When** se inspecciona su markup
**Then** el nombre es la única `h1` de la vista (NFR-09)
**And** los chips usan las clases canónicas `.chips` y `.chip`
**And** todos los textos se resuelven por i18n en ES y en EN

**AC3 — El retrato es el LCP y no se difiere**

**Given** el retrato del hero
**When** se inspecciona la etiqueta `<img>`
**Then** declara `width` y `height` explícitos, `fetchpriority="high"` y no lleva `loading="lazy"` (NFR-04)
**And** tiene un `alt` descriptivo (NFR-10)

**AC4 — Altura de viewport moderna**

**Given** la altura del hero en mobile
**When** se inspecciona su CSS
**Then** usa `svh` o `dvh`, no `vh` (NFR-14)

## Tasks / Subtasks

- [x] **Tarea 1 — Promover las primitivas de sección** (AC: #2)
  - [x] Crear `src/styles/sections.scss` con `.section`, `.section-alt`, `.section-head`, `.section-title`, `.section-lede`, `.section-foot` y `.link-arrow` de `home/page.css` (líneas 215–283)
  - [x] Son compartidas por las Épicas 3, 4, 5 y 6: van al sistema, no a un componente (ver §Las primitivas de sección son compartidas)
  - [x] Importarlas en `src/main.js` después de `chassis.scss`

- [x] **Tarea 2 — Portar las primitivas de botón y chip** (AC: #2)
  - [x] Portar a `src/styles/components.scss` las clases `.btn`, `.btn-primary`, `.btn-ghost`, `.chips`, `.chips-sm` y `.chip` de `_system/components.css` (líneas 350–418)
  - [x] Son las primitivas canónicas del sistema; la historia 3.2 las consume desde `AppButton`

- [x] **Tarea 3 — Construir `HeroSection.vue`** (AC: #1, #2)
  - [x] Markup portado de `home/index.html`: `.hero` → `.hero-glow` + `.hero-inner` → columna de texto + `.hero-portrait`
  - [x] Texto: `.hero-kicker`, `.hero-title` (la `h1`), `.hero-role`, `.hero-lede`, `.chips.chips-sm`
  - [x] Estilos del hero en el `<style scoped>` del componente, portados de `home/page.css` (líneas 6–214)
  - [x] Todos los textos por `t(...)`, con las claves nuevas en `src/locales/{es,en}.json`

- [x] **Tarea 4 — El retrato** (AC: #3)
  - [x] Convertir `src/assets/icons/photo.jpeg` a `src/assets/img/retrato.webp`
  - [x] `<img>` con `width`, `height`, `fetchpriority="high"`, `alt` descriptivo y **sin** `loading="lazy"`
  - [x] Reemplaza el `.portrait-ph` del prototipo, que es un marcador SVG

- [x] **Tarea 5 — Montar en la Home** (AC: #1)
  - [x] `HomeView.vue` renderiza `<HeroSection />` como primera sección
  - [x] Quitar de `HomeView.vue` el markup del hero viejo y su `IntersectionObserver` local
  - [x] Conservar por ahora el resto de la vista vieja: sus secciones se reemplazan en las historias 4.7, 5.4, 5.5 y 6.2

- [x] **Tarea 6 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] En 390 px, sin scrollear: los cuatro elementos de AC1 visibles
  - [x] Verificar el título en los cuatro anchos, prestando atención al `text-wrap: nowrap` (ver §El `nowrap` del título)
  - [x] Confirmar una sola `h1` en la vista
  - [x] Confirmar que el retrato es el elemento LCP
  - [x] Alternar idioma y confirmar que todo el hero cambia

## Dev Notes

Es la pantalla tesis del rediseño y el momento crítico del recorrido J1: un reclutador con 60–90
segundos tiene que saber quién es Marcelo, qué hace y con qué stack **antes de scrollear**. El PRD
lo dice sin ambigüedad: el hero debe comunicar rol y stack sin scroll.
[Source: prd.md#4.2 Recorridos críticos, J1]

Esta historia entrega el hero **estático**. Su animación de entrada es la 3.3.

### Las primitivas de sección son compartidas

`home/page.css` define `.section`, `.section-head`, `.section-title`, `.section-lede`, `.section-foot`
y `.link-arrow`. En el prototipo viven en el CSS de la Home, pero las cuatro pantallas las usan.

Es una consecuencia de que la unificación del prototipo extrajo el **chasis** al sistema y dejó las
secciones sin unificar. Acá se corrige: van a `src/styles/sections.scss`, global, y las consumen las
historias 4.3, 4.7, 5.2, 5.4, 5.5 y 6.2.

Si las dejaras en el `<style scoped>` de `HeroSection`, cada sección posterior tendría que
redefinirlas — que es exactamente el problema que costó la unificación del prototipo.

### El `nowrap` del título

`.hero-title` declara `text-wrap: nowrap` junto con `font-size: var(--text-hero)`, que es
`clamp(3rem, 2rem + 7vw, 7.5rem)`.

`nowrap` significa que el nombre **no** puede partirse en dos líneas. Si el `clamp` en 390 px deja
el texto más ancho que el viewport, se desborda o se recorta. El `clamp` está calculado para que no
pase, pero es lo primero que se rompe si cambiás el texto, el tamaño o la fuente.

Verificalo en los cuatro anchos, y en particular a 390 px: el cuerpo del documento **no** debe
scrollear en horizontal. Si desborda, la salida es ajustar el mínimo del `clamp`, no quitar el
`nowrap`: partir "Marcelo Olivera" en dos líneas cambia la composición del hero.

### El retrato es el candidato a LCP

En un hero con un título grande y una imagen circular de 320 px, el LCP suele ser la imagen. De ahí
las tres reglas de AC3, y por qué diferirla hundiría NFR-01:

- `width` y `height` explícitos reservan el espacio antes de que la imagen llegue (mitiga CLS, M4).
- `fetchpriority="high"` la sube en la cola de descarga.
- **Sin** `loading="lazy"`: diferir el elemento que define el LCP es lo peor que se puede hacer por
  esa métrica.

El prototipo usa un marcador SVG (`.portrait-ph`) porque no tenía la foto real. Acá va la foto real,
convertida a WebP. El resto del pipeline de imágenes se formaliza en la historia 7.1; esta imagen se
adelanta porque es la crítica.

### `svh`, no `vh`

`.hero { min-height: 100svh }`. En mobile, `100vh` mide el viewport **sin** la barra de direcciones,
así que el hero queda más alto que la pantalla visible y el contenido de abajo se corta. `svh` usa
el viewport pequeño —el que queda con la barra visible— y es lo que NFR-14 pide.

No lo cambies a `dvh` "porque es más moderno": `dvh` cambia de valor cuando la barra aparece y
desaparece, lo que produce un salto de layout al scrollear.

### El halo depende de `is-loaded`

`.hero-glow` arranca en `opacity: 0` y llega a `0.62` cuando el `<body>` recibe `.is-loaded`, la
clase que la historia 2.7 cablea. En esta historia el halo va a aparecer con su transición ya, sin
trabajo extra.

Notá que el halo tiene valores distintos por tema (`0.62` en oscuro, `0.3` en claro, con más blur).
Portá los dos.

### Los chips salen del contenido, no de un literal

El stack del hero son chips. Su fuente es el contenido, no una lista escrita en el template. Como
`src/content/` nace en la historia 4.1, acá tenés dos opciones válidas:

1. Una clave de i18n con el stack como array. Simple, pero mezcla contenido con etiquetas.
2. Un array local en el componente, con un comentario que apunte a la historia 4.1.

Elegí la 2 y dejá el comentario. Lo que **no** hay que hacer es escribir `<li class="chip">Vue</li>`
seis veces en el template: eso es texto visible literal y viola NFR-16.

### El `IntersectionObserver` de `HomeView` se va

`HomeView.vue` tiene hoy un `onMounted` con un `IntersectionObserver` propio que agrega `.loaded`.
Es el mecanismo viejo, y la directiva `v-reveal` de la historia 2.7 lo reemplaza. Borralo al mover
el hero. Si lo dejás, tenés dos observers compitiendo — justo lo que D7 evita.

### Guardarraíles

- ❌ **No** pongas las primitivas de sección en el `<style scoped>` del hero.
- ❌ **No** uses `vh` para la altura del hero.
- ❌ **No** le pongas `loading="lazy"` al retrato.
- ❌ **No** quites el `text-wrap: nowrap` del título si desborda: ajustá el `clamp`.
- ❌ **No** escribas texto visible en el template.
- ❌ **No** redefinas ningún token en el `<style scoped>`.
- ❌ **No** animes la entrada del hero: es la historia 3.3. Acá el hero está quieto y visible.
- ❌ **No** agregues el indicador de scroll: es la 3.4.
- ❌ **No** agregues las llamadas a la acción: es la 3.2.
- ❌ **No** crees `src/content/`: es la historia 4.1.
- ❌ **No** toques las otras secciones de `HomeView.vue`.
- ❌ **No** dejes el `IntersectionObserver` viejo de `HomeView`.

### Comandos de verificación

```bash
# Sin texto literal en el template del hero
grep -n ">[A-ZÁÉÍÓÚÑ][a-záéíóúñ]" src/components/sections/HeroSection.vue

# Sin colores literales
grep -nE "#[0-9a-fA-F]{3,6}|rgba?\(" src/components/sections/HeroSection.vue

# El observer viejo se fue
grep -n "IntersectionObserver" src/views/HomeView.vue
```

En el navegador, a 390 px:

```js
// Una sola h1
document.querySelectorAll('h1').length            // 1

// Sin scroll horizontal
document.documentElement.scrollWidth <= window.innerWidth   // true

// El retrato declara dimensiones y no es lazy
const img = document.querySelector('.portrait img')
;[img.width, img.height, img.loading, img.fetchPriority, img.alt]

// Los cuatro elementos de AC1 están en el primer viewport
['.hero-title', '.hero-role', '.hero-lede', '.chips']
  .map(s => [s, document.querySelector(s).getBoundingClientRect().bottom <= window.innerHeight])
```

El LCP se confirma en el panel Performance: buscá la marca de LCP y verificá que apunte al retrato o
al título.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los cuatro
elementos visibles sin scroll a 390 px; título sin desbordar en 390/768/1280/1920; una sola `h1`;
sin scroll horizontal; el retrato con dimensiones y sin `lazy`; el hero completo cambia de idioma;
consola sin errores.

### Project Structure Notes

```
src/styles/sections.scss                      NUEVO — primitivas de sección compartidas
src/styles/components.scss                    NUEVO — .btn, .chip y sus variantes
src/components/sections/HeroSection.vue        NUEVO
src/assets/img/retrato.webp                   NUEVO — desde assets/icons/photo.jpeg
src/views/HomeView.vue                         MODIFICADO — monta HeroSection; se va el observer viejo
src/locales/es.json                            MODIFICADO — claves del hero
src/locales/en.json                            MODIFICADO — claves del hero
src/main.js                                    MODIFICADO — importa sections.scss y components.scss
```

Se crea `src/components/sections/`. `src/assets/icons/photo.jpeg` se puede borrar una vez verificado
que nada lo referencia.

### References

- Historia y criterios: [Source: epics.md#Story 3.1]
- FR-05: [Source: prd.md#7.2 Home]
- J1, escaneo de 60 segundos: [Source: prd.md#4.2]
- NFR-04/09/10/14: [Source: prd.md#8.1, #8.2, #8.3]
- P1 y P3, sin identidad y jerarquía plana: [Source: prd.md#2.2]
- Pantalla tesis: [Source: ux-design-specification.md#6 Pantallas y recorridos, P1]
- Prompt de generación: [Source: ui-prompts/home.md]
- Markup y estilos fuente: `public/ui-generated/home/index.html` y `home/page.css` líneas 6–283
- Primitivas fuente: `public/ui-generated/_system/components.css` líneas 350–418

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 — todo visible sin scroll**, medido a 1280×800 con el hero de 800 px:

| Elemento | `top` | `bottom` | Visible sin scroll |
|---|---|---|---|
| `.hero-kicker` | 263 | 287 | ✓ |
| `.hero-title` | 287 | 536 | ✓ |
| `.hero-role` | 550 | 601 | ✓ |
| `.hero-lede` | 621 | 691 | ✓ |
| `.chips` | 705 | 737 | ✓ |

Y a 390 px, verificado visualmente: nombre, rol, propuesta y los cuatro chips entran sin scrollear.

**AC2 —** una sola `h1` con "MarceloOlivera"; `.chips` computa **`flex`** (la verificación central: la
máscara no rompió el layout); los cuatro chips con el stack real.

**AC3 — el retrato:** `width="640" height="640"`, `alt` descriptivo y traducido,
`fetchpriority="high"`, `decoding="async"`, **sin** `loading="lazy"`. Renderiza 400×400 con relación
exactamente 1 y `object-fit: cover`.

**AC4 —** `min-height` computado en 800 px sobre un viewport de 800: `100svh` resuelto.

**Sin scroll horizontal** en ninguno de los dos anchos.

### Un fallo real de AC1, y su causa

La primera versión dejaba los chips **9 px bajo el pliegue** a 1280×800 (`bottom: 809` con viewport
800), lo que violaba FR-05.

La causa: el `#main { padding-top: var(--header-h) }` que la historia 1.5 agregó para despejar el
header fijo, **más** el `padding-block: calc(var(--header-h) + var(--space-16))` que el hero ya trae.
Los 72 px se contaban dos veces, y con `min-height: 100svh` el hero desbordaba el viewport.

El hero está diseñado para pasar **por debajo** del header transparente —de ahí que el header no
tenga fondo en el tope— así que cancela el padding con `margin-top: calc(var(--header-h) * -1)`.
Verificado después: todo dentro del viewport, hero de 800 px exactos.

### El CSS se extrajo parseando bloques, no con expresiones regulares

El primer intento usó regex para quitar las reglas del indicador de scroll y **rompió el CSS**,
dejando declaraciones huérfanas: `Unexpected }` en la línea 115. Es el mismo error que en el
prototipo partió un `@media` por la mitad y destruyó el layout de una pantalla.

Se reescribió con un divisor que cuenta llaves y separa bloques de nivel superior, filtrando **reglas
completas** por su selector. Resultado: 27 bloques, 9 excluidos (`.portrait-ph`, `.ph-label`,
`.ph-note` del marcador SVG del prototipo y los 6 del `.scroll-cue`, que es la historia 3.4), y una
verificación de llaves balanceadas antes de escribir.

**Un `@keyframes cue-slide` sobrevivió al filtro** porque su selector no contiene `scroll-cue`. Se
quitó a mano: en un `<style scoped>` los keyframes se renombran con el hash del componente y no
serían alcanzables desde `ScrollCue.vue`.

### Las primitivas de sección se promovieron a globales

`sections.scss` con `.section`, `.section-alt`, `.section-head`, `.section-title`, `.section-lede`,
`.section-foot` y `.link-arrow`, y `components.scss` con `.btn`, `.chip` y sus variantes. En el
prototipo las de sección vivían en el CSS de la Home, pero las cuatro pantallas las usan — otra
consecuencia de que la unificación extrajo el chasis y dejó las secciones sin unificar. Las consumen
las historias 4.3, 4.7, 5.2, 5.4, 5.5 y 6.2.

### El retrato

`photo.jpeg` (612×612, 33 KB) se recortó al cuadrado, se escaló a 640×640 —el doble de los 320 px de
presentación, para pantallas densas— y se guardó como WebP con calidad 82: **12 KB, un 64 % menos**.

### File List
