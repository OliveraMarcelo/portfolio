# Story 1.2: Tokens del sistema de diseño en runtime

Status: ready-for-dev

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

- [ ] **Tarea 1 — Portar los tokens** (AC: #1, #5)
  - [ ] Copiar `public/ui-generated/_system/tokens.css` → `src/styles/tokens.css`, **sin editar ningún valor**
  - [ ] Importarlo en `src/main.js` como primera línea de estilos, antes de `main.scss`
  - [ ] Verificar en el navegador que `getComputedStyle(document.documentElement).getPropertyValue('--color-bg')` devuelve `#0B0D10`

- [ ] **Tarea 2 — Portar los estilos base** (AC: #3)
  - [ ] Crear `src/styles/base.scss` con las secciones "Base" y "Reduced motion" de `public/ui-generated/_system/components.css` (líneas 7–110 y el bloque `@media (prefers-reduced-motion: reduce)`)
  - [ ] Incluye: reset de `box-sizing`, `html`, `body`, el grano de `body::before`, `img/svg`, `h1–h3`, `p`, `ul/ol`, `a`, `button`, `:focus-visible`, `::selection`, `.container`, `.container-narrow`, `.skip-link`
  - [ ] **No** portar todavía las secciones de chasis, primitivas ni animación: eso es 1.4, 1.5 y la 2.7

- [ ] **Tarea 3 — Convertir los módulos SASS viejos a tokens** (AC: #2, #4)
  - [ ] Reemplazar en `src/styles/sass/modules/*.scss` cada variable SASS por su custom property equivalente (tabla en §Mapeo de variables)
  - [ ] Son ~20 sustituciones mecánicas repartidas en cuatro archivos
  - [ ] **Ojo:** `$fondo` y `$texto` son parámetros locales de mixin, no variables globales. No los toques

- [ ] **Tarea 4 — Eliminar las variables y la cascada de dark mode** (AC: #2)
  - [ ] Borrar `src/styles/sass/variables/` completa (`_colors.scss`, `_fonts.scss`, `_sizes.scss` — este último está vacío)
  - [ ] Reescribir `src/styles/sass/main.scss`: quitar los tres `@import 'variables/…'`, quitar el bloque `body { … }` con valores literales y **todo** el bloque `body.dark-mode` con su lista de `!important`
  - [ ] Lo que queda de `main.scss` son solo los cuatro `@import 'modules/…'`

- [ ] **Tarea 5 — Cablear los estilos en `main.js`** (AC: #1, #3)
  - [ ] Orden de import obligatorio: `tokens.css` → `base.scss` → `main.scss`
  - [ ] Un orden distinto hace que los estilos base pisen o sean pisados de forma impredecible

- [ ] **Tarea 6 — Verificar** (AC: #1, #2, #4, #5)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Recorrer `/`, `/projects` y `/about`: nada queda sin maquetar
  - [ ] Los tres `grep` de verificación de la sección §Comandos de verificación no devuelven nada
  - [ ] Probar los tres estados de tema forzando el atributo a mano desde la consola

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

### Debug Log References

### Completion Notes List

### File List
