# Story 1.2: Tokens del sistema de diseño en runtime

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante,
I want que el sitio tenga una paleta, una tipografía y un ritmo espacial coherentes,
so that perciba una identidad propia en lugar de una plantilla genérica.

## Acceptance Criteria

**AC1 — Tokens portados sin alteración**

**Given** el archivo verificado `public/ui-generated/_system/tokens.css`
**When** se porta a `src/styles/tokens.css` y se importa desde `src/main.js` antes que cualquier otro estilo
**Then** los tokens de color, tipografía, espaciado, radio, sombra, duración y curva quedan definidos en `:root`, en `[data-theme="dark"]` y en `[data-theme="light"]`
**And** ningún valor difiere del archivo original

**AC2 — Variables SASS eliminadas, cascada `.dark-mode` desmantelada**

**Given** los parciales `src/styles/sass/variables/_colors.scss`, `_fonts.scss` y `_sizes.scss`
**When** se eliminan junto con el bloque `body.dark-mode` de `main.scss` y su cascada de `!important`
**Then** el proyecto compila sin referencias a variables SASS inexistentes
**And** `grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\(" src/ --include=*.vue` no devuelve resultados

**AC3 — Estilos base portados**

**Given** los estilos base del sistema (reset, `.container`, `.skip-link`, foco visible, grano)
**When** se portan a `src/styles/base.scss`
**Then** el bloque `@media (prefers-reduced-motion: reduce)` queda presente y global

**AC4 — Sin regresión visual en las vistas actuales**

**Given** las tres vistas actuales (`/`, `/projects`, `/about`), que todavía usan los componentes viejos
**When** se recorren después del cambio
**Then** siguen maquetadas y legibles: ningún bloque queda sin estilos
**And** los colores que usan provienen de los tokens nuevos, no de valores literales

**AC5 — Un solo lugar define cada token**

**Given** el proyecto completo
**When** se ejecuta `grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-\|^\s*--radius-\|^\s*--text-" src/ --include=*.vue`
**Then** no devuelve resultados: ningún componente redefine un token
**And** `src/styles/tokens.css` es el único archivo que los define

## Tasks / Subtasks

- [x] **Tarea 1 — Portar los tokens** (AC: #1, #5)
  - [x] Copiar `public/ui-generated/_system/tokens.css` → `src/styles/tokens.css`, **sin editar ningún valor**
  - [x] Importarlo en `src/main.js` como primera línea de estilos, antes de `main.scss`
  - [x] Verificar en el navegador que `getComputedStyle(document.documentElement).getPropertyValue('--color-bg')` devuelve `#0B0D10`

- [x] **Tarea 2 — Portar los estilos base** (AC: #3)
  - [x] Crear `src/styles/base.scss` con las secciones "Base" y "Reduced motion" de `public/ui-generated/_system/components.css` (líneas 7–110 y el bloque `@media (prefers-reduced-motion: reduce)`)
  - [x] Incluye: reset de `box-sizing`, `html`, `body`, el grano de `body::before`, `img/svg`, `h1–h3`, `p`, `ul/ol`, `a`, `button`, `:focus-visible`, `::selection`, `.container`, `.container-narrow`, `.skip-link`
  - [x] **No** portar todavía las secciones de chasis, primitivas ni animación: eso es 1.4, 1.5 y la 2.7

- [x] **Tarea 3 — Convertir los módulos SASS viejos a tokens** (AC: #2, #4)
  - [x] Reemplazar en `src/styles/sass/modules/*.scss` cada variable SASS por su custom property equivalente (tabla en §Mapeo de variables)
  - [x] Son ~20 sustituciones mecánicas repartidas en cuatro archivos
  - [x] **Ojo:** `$fondo` y `$texto` son parámetros locales de mixin, no variables globales. No los toques

- [x] **Tarea 4 — Eliminar las variables y la cascada de dark mode** (AC: #2)
  - [x] Borrar `src/styles/sass/variables/` completa (`_colors.scss`, `_fonts.scss`, `_sizes.scss` — este último está vacío)
  - [x] Reescribir `src/styles/sass/main.scss`: quitar los tres `@import 'variables/…'`, quitar el bloque `body { … }` con valores literales y **todo** el bloque `body.dark-mode` con su lista de `!important`
  - [x] Lo que queda de `main.scss` son solo los cuatro `@import 'modules/…'`

- [x] **Tarea 5 — Cablear los estilos en `main.js`** (AC: #1, #3)
  - [x] Orden de import obligatorio: `tokens.css` → `base.scss` → `main.scss`
  - [x] Un orden distinto hace que los estilos base pisen o sean pisados de forma impredecible

- [x] **Tarea 6 — Verificar** (AC: #1, #2, #4, #5)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Recorrer `/`, `/projects` y `/about`: nada queda sin maquetar
  - [x] Los tres `grep` de verificación de la sección §Comandos de verificación no devuelven nada
  - [x] Probar los tres estados de tema forzando el atributo a mano desde la consola

## Dev Notes

Esta historia es el cimiento visual de todo el rediseño. **D1 en la arquitectura: los tokens son
custom properties CSS, no variables SASS.** El motivo no es estilístico: las variables SASS se
resuelven en tiempo de compilación y no pueden cambiar de valor en el navegador. El cambio de
tema (FR-26) y la transición suave de color (FR-28) exigen valores sustituibles en runtime.
SASS conserva su rol para anidado y mixins, no para valores.
[Source: architecture.md#Frontend Architecture, D1]

### El sitio va a quedar oscuro-siempre hasta la historia 1.6 — es correcto

`tokens.css` define tres bloques: `:root` (oscuro, el default), `[data-theme="dark"]` y
`[data-theme="light"]`. **No hay `@media (prefers-color-scheme: light)`.** El tema claro se
activa exclusivamente cuando algo estampa `data-theme="light"` en `<html>`, y ese algo es el
script inline que se agrega en la historia 1.6.

Entre esta historia y la 1.6, el sitio se ve siempre oscuro incluso para quien tenga preferencia
clara. **Eso es el comportamiento esperado, no un bug.** No agregues un `@media` de
`prefers-color-scheme` a `tokens.css` para "arreglarlo": duplicarías la definición del tema y
romperías AC5.

Para verificar que los tres estados funcionan antes de que exista el toggle, forzalos desde la
consola del navegador:

```js
document.documentElement.removeAttribute('data-theme')          // default → oscuro
document.documentElement.setAttribute('data-theme', 'dark')     // oscuro explícito
document.documentElement.setAttribute('data-theme', 'light')    // claro
```

Los tres tienen que devolver un `--color-bg` resuelto y distinto de vacío.

### Por qué los módulos SASS no se borran todavía

El árbol objetivo de la arquitectura marca `src/styles/sass/` como eliminado por completo. Pero
`modules/_texts.scss`, `_buttons.scss`, `_pages.scss` y `_navbar.scss` estilan los componentes
**actuales**, que siguen vivos hasta que su épica los reemplace. Borrarlos acá dejaría las tres
vistas sin maquetar durante seis historias.

La salida es convertirlos, no borrarlos: apuntan a los tokens nuevos y mueren solos cuando su
componente se reemplaza. Son ~20 sustituciones en 653 líneas.

| Parcial | Muere en |
|---|---|
| `modules/_navbar.scss` | Historia 1.5, cuando `NavBar.vue` → `AppNav.vue` |
| `modules/_texts.scss` | Historia 5.5, cuando los cuatro componentes de título → `SectionHeading` |
| `modules/_buttons.scss` | Historia 3.2, cuando `ButtonCustom.vue` → `AppButton.vue` |
| `modules/_pages.scss` | Se va vaciando entre las épicas 3, 4 y 5; el resto se borra en la 5.5 |

**No adelantes ninguna de esas eliminaciones en esta historia.**

### Mapeo de variables

Uso real medido en `modules/*.scss` — 10 ocurrencias de `$color-terciario`, 3 de
`$color-primario`, 3 de `$color-fuente-title`, 2 de `$color-secundario`, 1 de
`$color-fuente-subtitle`, 1 de `$color-dark-text-strong`, 1 de `$primaryFont`:

| Variable SASS | Valor viejo | Reemplazo |
|---|---|---|
| `$color-terciario` | `#FF7948` | `var(--color-accent)` |
| `$color-primario` | `#fcfcfd` | `var(--color-surface)` |
| `$color-secundario` | `#000000` | `var(--color-text)` |
| `$color-fuente-title` | `#24262F` | `var(--color-text)` |
| `$color-fuente-subtitle` | `#4E525A` | `var(--color-text-muted)` |
| `$color-dark-text-strong` | `#fff` | `var(--color-text)` |
| `$color-light-bg` | `#f5f5f5` | `var(--color-bg)` |
| `$color-light-text` | `#222` | `var(--color-text)` |
| `$color-dark-bg` | `#181818` | `var(--color-bg)` |
| `$color-dark-text` | `#f5f5f5` | `var(--color-text)` |
| `$primaryFont` | `'Poppins'` | `var(--font-body)` |

Notá que las parejas claro/oscuro colapsan en el mismo token: eso es justamente el punto. Antes
hacían falta dos variables y una cascada de `!important`; ahora el token se resuelve solo según
`data-theme`.

`_sizes.scss` está vacío (0 líneas): su `@import` es un no-op y se borra sin más.

### La cascada `.dark-mode` es el problema que esta historia elimina

`main.scss` termina hoy con un bloque que lista trece selectores para forzarles el color con
`!important` en modo oscuro. Ese bloque es el síntoma exacto de no tener tokens: cada componente
nuevo obligaba a sumar una línea más. **Se borra entero.** Si después de borrarlo algún texto
queda ilegible en oscuro, la causa es un color literal en un `<style scoped>` — arreglalo ahí,
no reintroduzcas la cascada.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** edites ningún valor de `tokens.css`. Se porta literal. Fue medido y verificado en navegador.
- ❌ **No** agregues `@media (prefers-color-scheme: …)` a `tokens.css`.
- ❌ **No** portes las clases de chasis (`.site-header`, `.nav`, `.mobile-menu`), las primitivas
  (`.btn`, `.chip`) ni las utilidades de animación (`.reveal`, `.mask`). Cada una tiene su historia.
- ❌ **No** borres `src/styles/sass/modules/`.
- ❌ **No** conviertas los `@import` restantes de `main.scss` a `@use`: ese archivo desaparece
  cuando se vacíen los módulos.
- ❌ **No** toques todavía `public/index.html`: el script inline es la historia 1.6.
- ❌ **No** crees componentes nuevos.
- ❌ **No** instales ninguna dependencia.

### Comandos de verificación

```bash
# Ningún componente redefine un token
grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-\|^\s*--radius-\|^\s*--text-" src/ --include=*.vue

# Ningún color literal en componentes
grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\(" src/ --include=*.vue

# Ninguna variable SASS huérfana
grep -rn '\$color-\|\$primaryFont' src/
```

Los tres tienen que salir vacíos.

### Testing standards

Sin pruebas automatizadas (diferido por decisión de arquitectura). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. Los tres `grep` de arriba, vacíos.
3. Recorrer las tres vistas en el navegador: ninguna queda sin maquetar.
4. Forzar los tres estados de tema desde la consola y confirmar que `--color-bg` resuelve en los tres.

**No declares la historia terminada si solo compiló.** El riesgo real de esta historia es la
regresión visual, y eso solo se ve mirando.

### Project Structure Notes

```
src/styles/tokens.css                      NUEVO — copia literal de _system/tokens.css
src/styles/base.scss                       NUEVO — reset, container, skip-link, focus, grano, reduced-motion
src/styles/sass/variables/_colors.scss     ELIMINADO
src/styles/sass/variables/_fonts.scss      ELIMINADO
src/styles/sass/variables/_sizes.scss      ELIMINADO (estaba vacío)
src/styles/sass/main.scss                  MODIFICADO — solo los @import de modules/
src/styles/sass/modules/_texts.scss        MODIFICADO — variables → tokens
src/styles/sass/modules/_buttons.scss      MODIFICADO — variables → tokens
src/styles/sass/modules/_pages.scss        MODIFICADO — variables → tokens
src/styles/sass/modules/_navbar.scss       MODIFICADO — variables → tokens
src/main.js                                MODIFICADO — orden de imports de estilos
```

**Variación respecto de la estructura objetivo:** `src/styles/sass/` sigue existiendo al terminar
esta historia. Es deliberado y temporal; la tabla de §Por qué los módulos SASS no se borran
todavía dice en qué historia muere cada parcial.

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.2]
- D1, tokens en runtime: [Source: architecture.md#Frontend Architecture]
- NFR-15, cero valores hardcodeados: [Source: prd.md#8.4 Mantenibilidad]
- FR-26/27/28, tema: [Source: prd.md#7.7 Tema e idioma]
- Paleta y fundación visual: [Source: ux-design-specification.md#3 Fundación visual]
- Archivo fuente normativo: `public/ui-generated/_system/tokens.css`
- Estilos base fuente: `public/ui-generated/_system/components.css` (secciones Base y Reduced motion)

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Los cuatro `grep` de verificación** — todos vacíos salvo apariciones dentro de comentarios:

```
tokens redefinidos en .vue      vacío
colores literales en .vue       vacío
variables SASS huérfanas        vacío
cascada body.dark-mode          vacío
```

**`npm run lint`** → `DONE No lint errors found!`
**`npm run build`** → `DONE Build complete`, CSS final `app.6ba09fa2.css`

**Los tres estados de tema, medidos en navegador tras esperar la transición completa:**

| `data-theme` | `--color-bg` | fondo computado del `body` | pares por debajo de AA |
|---|---|---|---|
| sin atributo | `#0b0d10` | `rgb(11, 13, 16)` | **0** de 20 |
| `dark` | `#0b0d10` | `rgb(11, 13, 16)` | **0** de 20 |
| `light` | `#fafaf9` | `rgb(250, 250, 249)` | **0** de 20 |

**Tokens resueltos:** `--color-accent=#ff7948`, `--dur-base=320ms`, `--space-8=2rem`,
`--radius-lg=20px`, `--ease-out=cubic-bezier(0.22,1,0.36,1)`, `--color-accent-text=#ff7948`.

**Las tres vistas:** 0 elementos con texto en negro puro, sin scroll horizontal, `body` con
`background: rgb(11,13,16)`, `color: rgb(237,239,242)` y el grano de `body::before` presente como
data URI SVG.

**Puente de tema:** el toggle alterna `data-theme` entre `dark` y `light` y el fondo del `body`
cambia de `rgb(11,13,16)` a `rgb(250,250,249)`. `document.body.className` queda vacío: ya no usa
`dark-mode`.

### Completion Notes List

Los cinco criterios se cumplen. Tres cosas salieron distinto de lo que la historia anticipaba, y
las tres importan.

**1. Dos regresiones visuales reales, encontradas midiendo.**

La historia advertía: *"Si después de borrarlo algún texto queda ilegible en oscuro, la causa es un
color literal en un `<style scoped>` — arreglalo ahí, no reintroduzcas la cascada."* Pasó, dos veces,
y en los dos casos el `grep` que la historia daba **no lo detectaba**:

- **`_navbar.scss` tenía `color: black`** en los enlaces del nav. Es un color con **nombre**, no un
  hex ni un `rgba()`, así que el `grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\("` lo pasaba por alto. Y está
  en un `.scss`, que el `--include=*.vue` del AC2 tampoco cubre. La cascada `body.dark-mode` con
  `!important` lo tapaba; al eliminarla, los enlaces "Projects" y "About me" quedaron negros sobre
  fondo `#0b0d10` — invisibles. Detectado buscando elementos con `color: rgb(0, 0, 0)` computado.
- **`_navbar.scss` tenía otra cascada `body.dark-mode` completa**, con nueve selectores y
  `!important`, que la historia no mencionaba: la tarea 4 solo hablaba de la de `main.scss`.
  Eliminada.

**Recomendación para la historia 7.5:** ampliar el barrido de colores a los **con nombre**
(`black`, `white`, `red`…), no solo hex y `rgba()`. El comando que los encontró:

```bash
grep -rniE "(color|background|border)[^:]*: *(black|white|red|blue|green|gray|grey|orange)\b" \
  src/ --include=*.scss --include=*.vue --include=*.css
```

**2. El acento como texto necesitaba `--color-accent-text`, y el mapeo de la historia no lo decía.**

La tabla §Mapeo de variables mandaba `$color-terciario` → `var(--color-accent)`. Aplicado
mecánicamente a `_navbar.scss`, dejó el logo y los enlaces activos con **3.62:1 en tema claro**,
por debajo del 4.5:1 de AA. `tokens.css` ya trae `--color-accent-text` (`#A33F14` en claro) con el
comentario *"Acento legible como texto chico (>=4.5:1)"*.

Corregido: los tres usos del acento **como color de texto** en `_navbar.scss` usan
`--color-accent-text`; los que son borde o fondo siguen con `--color-accent`. Lo mismo se aplicó a
`_texts.scss` desde el principio. **El mapeo depende del uso, no solo del nombre de la variable.**

Mismo criterio en `_buttons.scss`: la tabla mandaba `$color-primario` → `var(--color-surface)`, pero
como es el color del **texto sobre el acento**, en claro daría 3.4:1. El design system ya resolvió
ese par y lo dejó documentado en `.btn-primary`: texto `#0B0D10`, que pasa 5.09:1 en claro y 7.4:1
en oscuro. Se replicó eso, incluido el `color-mix` del hover en claro.

**3. `App.vue` tuvo que entrar en el alcance, por dos motivos legítimos.**

- Tenía cuatro colores literales (`#222`, `#fff`, `#ff9800`, `rgba(0,0,0,0.12)`) en el `<style>` del
  botón flotante de tema. El AC2 pide que el `grep` sobre `.vue` salga vacío, así que había que
  tokenizarlos.
- Al eliminar la cascada `.dark-mode`, el toggle se quedó **sin CSS al que engancharse**: seguiría
  agregando una clase que ya no significa nada. Se puenteó a `data-theme` sobre `<html>`, que es el
  contrato de `tokens.css`, con un comentario `PUENTE TEMPORAL` que la historia 1.6 reemplaza.
  **No** se implementó nada del alcance de la 1.6: sin `localStorage`, sin script inline, sin
  `useTheme.js`, sin consultar `prefers-color-scheme`.

También se tokenizaron `#ccc` en `ListProjects.vue`, `#eee` en `SkillList.vue` y los estilos inline
del botón de idioma en `NavBar.vue`, que el AC2 exigía.

**Un error de medición propio, corregido:** la primera medición de contraste en tema claro reportó
18 pares por debajo de AA y un fondo de `rgb(156,157,158)`. Ese gris es un punto intermedio: medí a
los 200 ms cuando la transición del `body` es de `--dur-base` (320 ms). Con 900 ms de espera el
fondo da `rgb(250,250,249)` y los fallos reales eran 2, no 18. **Al medir color hay que esperar a
que la transición termine.**

**Fuera de alcance, anotado:** el build reporta tres warnings, los tres preexistentes y ya
asignados — un `console.warn` en `ItemProject.vue` (componente que muere en la historia 4.2; NFR-18
se verifica en la 7.8), el límite de tamaño de asset por los PNG de 611 KiB y `certificado.pdf`
(historias 7.1 y 5.3), y el límite de entrypoint con 260 KiB (historia 7.8). No se tocó ninguno,
por disciplina de alcance.

### File List

```
src/styles/tokens.css                       NUEVO — copia literal de _system/tokens.css (121 líneas)
src/styles/base.scss                        NUEVO — reset, container, skip-link, foco, grano, reduced-motion
src/main.js                                 MODIFICADO — orden tokens.css → base.scss → sass/main.scss
src/App.vue                                 MODIFICADO — tokens en el botón; puente a data-theme
src/styles/sass/main.scss                   REESCRITO — solo los @import de modules/
src/styles/sass/modules/_texts.scss         MODIFICADO — tokens, con --color-accent-text para texto
src/styles/sass/modules/_buttons.scss       REESCRITO — mixins con tokens; par de contraste del sistema
src/styles/sass/modules/_navbar.scss        MODIFICADO — tokens; se quitan `color: black` y la cascada
src/styles/sass/modules/_pages.scss         MODIFICADO — tokens
src/components/layouts/NavBar.vue           MODIFICADO — estilos inline → <style scoped> con tokens
src/components/projects/ListProjects.vue    MODIFICADO — #ccc → var(--color-border)
src/components/skills/SkillList.vue         MODIFICADO — #eee → var(--color-surface-raised)
src/styles/sass/variables/_colors.scss      ELIMINADO
src/styles/sass/variables/_fonts.scss       ELIMINADO
src/styles/sass/variables/_sizes.scss       ELIMINADO (estaba vacío)
```

**Variación respecto de la estructura objetivo, deliberada:** `src/styles/sass/` sigue existiendo
con sus cuatro parciales de módulo, según la tabla §Por qué los módulos SASS no se borran todavía.

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Tokens portados a runtime como custom properties; variables SASS y cascada `.dark-mode` eliminadas; dos regresiones de contraste encontradas y corregidas. Estado `review`. |
| 2026-08-17 | Code review: 1 hallazgo alto y 2 medios corregidos. Estado `done`. |

## Senior Developer Review (AI)

**Fecha:** 2026-08-17
**Revisor:** claude-opus-5, pasada adversarial
**Resultado:** **Changes Requested → corregido y aprobado**

**Contraste File List vs git:** los 15 archivos que declara la historia coinciden exactamente con
`git diff --name-only HEAD~1 HEAD -- src/ public/`. Sin discrepancias.

### 🔴 Alto — 1 hallazgo, corregido

**H1 — `_pages.scss` tenía cuatro colores literales, y uno dejaba el hero de la Home ilegible en
mobile.** `src/styles/sass/modules/_pages.scss:52`

El AC4 pide que *"los colores que usan provienen de los tokens nuevos, no de valores literales"*.
La tarea 3 se cumplió sobre las **variables SASS**, pero `_pages.scss` tenía además cuatro colores
que **nunca fueron variables** —siempre fueron hex literal— así que el script de sustitución no los
tocó y la historia no los mencionaba.

El grave es este, dentro de un `@media (max-width: 766px)`:

```scss
.presentation-col .subtitle,
.presentation-col .title,
.presentation-col .main-title {
    color: #222 !important;
}
```

Antes de esta historia, la cascada `body.dark-mode` lo tapaba por **especificidad**:
`body.dark-mode .subtitle` es (0,2,1) contra (0,2,0) de `.presentation-col .subtitle`, y ambas
llevaban `!important`. Al eliminar la cascada, `#222` ganó.

Medido a 390 px sobre fondo `rgb(11,13,16)`:

| Elemento | Contraste | Mínimo AA |
|---|---|---|
| `.presentation-col .subtitle` — "Hola soy Marcelo Olivera!" | **1.22:1** | 4.5:1 |
| `.presentation-col .title` — "Front Developer" | **1.22:1** | 3:1 |
| `.presentation-col .subtitle` — la bajada del hero | **1.22:1** | 4.5:1 |

O sea: **el hero entero era invisible en mobile.** Es exactamente el modo de falla que la propia
historia advertía, y se escapó de la verificación por dos motivos acumulados: la regla vive en una
media query de mobile y se midió a ancho de escritorio, y `#222` no es negro puro, así que el
detector de `color: rgb(0, 0, 0)` no lo veía.

**Corregido:** los nueve literales de `_pages.scss` pasan a tokens — `#222` → `var(--color-text)`,
`#ff9800` → `var(--color-accent)`, `#ddd` y `#ccc` → `var(--color-border)`, las cuatro sombras
`rgba(0,0,0,…)` → `var(--shadow-md)` / `var(--shadow-lg)`, y el `text-shadow` negro sobre texto
claro se elimina porque no aportaba nada.

**Verificado tras el arreglo**, con el fondo efectivo resuelto subiendo el árbol y esperando el fin
de la transición:

| Ruta | Tema | Medidos | Por debajo de AA |
|---|---|---|---|
| `/` | dark / light | 45 | **0 / 0** |
| `/projects` | dark / light | 21 | **0 / 0** |
| `/about` | dark / light | 28 | **0 / 0** |

A 390 px: 41 elementos, 0 fallos en ambos temas. El peor par en claro es el botón primario con
**5.15:1**, que confirma el 5.09:1 que el design system había medido y documentado.

### 🟡 Medio — 2 hallazgos, corregidos

**M1 — El `<style>` global de `App.vue` se emitía antes de `tokens.css`.** `src/main.js`

El AC1 pide importar los tokens *"antes que cualquier otro estilo"*. `main.js` tenía
`import App from './App.vue'` en la línea 2, antes de los imports de estilo, y `App.vue` tiene un
bloque `<style lang="scss">` **no scoped**. Webpack emite el CSS en el orden en que resuelve los
imports, así que en el bundle quedaba:

```
posición    654  App.vue (.toggle-mode-btn)
posición   1155  tokens (:root)
```

Hoy no rompe nada, porque `var()` se resuelve en tiempo de valor computado y no de parseo. Pero el
primer componente que necesite pisar una regla de `base.scss` iba a perder sin motivo aparente.

**Corregido:** `App.vue` se importa después de los tres archivos de estilo. Orden verificado en el
bundle: tokens en 0, base en 2609, módulos en 4900, `App.vue` en 13691.

**M2 — Cuatro sombras con `rgba(0,0,0,…)` sin tokenizar.** `_pages.scss:54,72,84,105`

El sistema tiene `--shadow-md` y `--shadow-lg`, que además son *theme-aware*: en claro usan
`rgba(20,23,28,…)` y en oscuro `rgba(0,0,0,…)` con otra opacidad. Una sombra negra fija al 8 % es
invisible en tema oscuro y demasiado dura en claro. **Corregido junto con H1.**

### 🟢 Bajo — 4 hallazgos, aceptados sin cambio

**L1 — `base.scss` se desvía del original al agregar `!important` a `scroll-behavior: auto`.**
El bloque fuente de `components.css` no lo lleva; funciona por orden de cascada. Se agregó porque la
historia 2.5 lo exige explícitamente y porque protege si alguien reordena los imports. Deliberado y
comentado en el archivo.

**L2 — `base.scss` incluye anulaciones de movimiento reducido para clases que todavía no existen**
(`.reveal`, `.mask-in`, `.portrait`, `.project-actions`, `.scroll-cue`, `.hero-glow`,
`.timeline-progress`, `.scroll-cue-dot`). Roza el guardarraíl de no portar utilidades de animación,
pero solo las **anula**, no las define, y traerlas ahora evita volver a editar el bloque en las
historias 2.7, 3.3 y 3.4. Comentado en el archivo.

**L3 — No hay token para "texto sobre acento".** `_buttons.scss:28` y `base.scss:68,89` cargan
`#0B0D10` literal. El propio design system lo hace en `.btn-primary` y `::selection`, así que es
consistente con la fuente. **Recomendación para la historia 3.2:** al construir `AppButton`, evaluar
agregar `--color-on-accent: #0B0D10` a `tokens.css` y usarlo en los tres lugares. No se hizo acá
porque el AC1 exige que `tokens.css` sea copia literal.

**L4 — `.lang-switcher` usa `position: absolute` y `nav` no es `position: relative`**, así que se
ancla al bloque contenedor inicial. Es el comportamiento que ya tenía con el estilo inline, así que
no es regresión. El componente muere en la historia 1.5.

### Errores de medición propios, detectados durante el review

Tres mediciones dieron falsos positivos. Valen como método para las historias 7.5 y 7.7:

1. **Medir color a mitad de transición.** La primera pasada reportó 18 pares por debajo de AA en
   tema claro y un fondo de `rgb(156,157,158)` — un gris intermedio. Medí a los 200 ms cuando el
   `body` transiciona en `--dur-base` (320 ms). **Hay que esperar a que la transición termine.**
2. **Comparar contra el fondo del `body` en lugar del fondo propio.** Reportó 5 fallos en botones
   que en realidad pasan: el texto `#0B0D10` estaba siendo comparado contra el fondo oscuro de la
   página en lugar del naranja del botón. **Hay que resolver el fondo efectivo subiendo el árbol.**
3. **Buscar un selector con las comillas puestas.** `grep 'data-theme="light"'` no encontró nada en
   el bundle y por un momento pareció que Sass había perdido el prefijo del selector anidado. El
   minificador quita las comillas: `[data-theme=light]`. El selector estaba perfecto.

Las tres se corrigieron antes de reportar. La lección común: **una medición que da un resultado
alarmante hay que verificarla antes de actuar sobre ella.**

### Action Items

- [x] [AI-Review][Alto] Tokenizar los cuatro colores literales de `_pages.scss`; `color: #222 !important` dejaba el hero a 1.22:1 en mobile [_pages.scss:52,71,85,106]
- [x] [AI-Review][Medio] Importar `App.vue` después de los estilos en `main.js` para que los tokens se emitan primero [main.js:2]
- [x] [AI-Review][Medio] Tokenizar las cuatro sombras `rgba(0,0,0,…)` con `--shadow-md`/`--shadow-lg` [_pages.scss:54,72,84,105]
- [ ] [AI-Review][Bajo] Evaluar agregar `--color-on-accent` a `tokens.css` al construir `AppButton` — **historia 3.2**
- [ ] [AI-Review][Bajo] Ampliar el barrido de contraste a colores con **nombre** (`black`, `white`…), no solo hex y `rgba()` — **historia 7.5**
