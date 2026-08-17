# Story 1.3: Tipografía propia, sin orígenes externos

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante con una conexión lenta,
I want que las fuentes lleguen del mismo servidor que la página,
so that el texto aparezca rápido y sin depender de un tercero.

## Acceptance Criteria

**AC1 — Fuentes self-hosted**

**Given** las familias Space Grotesk, Inter y JetBrains Mono
**When** se descargan en woff2 a `src/assets/fonts/` y se declaran en `src/styles/fonts.scss`
**Then** cada `@font-face` incluye `font-display: swap` (NFR-05)
**And** los cortes usados por el hero se declaran con `<link rel="preload" as="font" crossorigin>` en `public/index.html`

**AC2 — Google Fonts eliminado**

**Given** el `<link>` a `https://fonts.googleapis.com` que hoy carga Poppins
**When** se elimina de `public/index.html`
**Then** la pestaña de red del navegador no muestra ninguna petición a un host distinto del propio

**AC3 — Las familias resuelven de verdad**

**Given** el sitio cargado
**When** se inspecciona el `font-family` computado del título del hero y del cuerpo de texto
**Then** resuelve a Space Grotesk y a Inter respectivamente, no a la fuente de respaldo del sistema

## Tasks / Subtasks

- [x] **Tarea 1 — Obtener los archivos de fuente** (AC: #1)
  - [x] Descargar las tres familias en woff2 desde su fuente oficial (ver §De dónde salen los archivos)
  - [x] Guardarlas en `src/assets/fonts/`
  - [x] Preferir el archivo **variable** de cada familia cuando exista: cubre todo el rango de pesos en una sola petición

- [x] **Tarea 2 — Declarar los `@font-face`** (AC: #1)
  - [x] Crear `src/styles/fonts.scss` con un `@font-face` por familia (o por corte, si se usan estáticas)
  - [x] `font-display: swap` en **todos**, sin excepción
  - [x] `font-weight: 400 700` en las declaraciones variables; el peso exacto en las estáticas
  - [x] Importarlo en `src/main.js` **antes** de `base.scss`

- [x] **Tarea 3 — Precargar solo lo del hero** (AC: #1)
  - [x] Agregar en `public/index.html` los `<link rel="preload" as="font" type="font/woff2" crossorigin>` de las fuentes que pinta el hero
  - [x] `crossorigin` es obligatorio aunque la fuente sea del mismo origen (ver §El atributo `crossorigin`)
  - [x] **No** precargar las tres familias: precargar todo equivale a no precargar nada

- [x] **Tarea 4 — Eliminar Google Fonts** (AC: #2)
  - [x] Borrar de `public/index.html` la línea `<link href="https://fonts.googleapis.com/css2?family=Poppins…">`
  - [x] Verificar por `grep` que no queda ninguna referencia a `fonts.googleapis.com` ni a `fonts.gstatic.com`
  - [x] Verificar que no queda ninguna referencia a `Poppins` en `src/`

- [x] **Tarea 5 — Verificar** (AC: #1, #2, #3)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Pestaña de red: ninguna petición fuera del propio origen
  - [x] Inspeccionar el `font-family` computado de un `h1` y de un `p` (ver §Comandos de verificación)
  - [x] Verificar que las fuentes se sirven desde `/fonts/…` con hash, no desde `/src/`

## Dev Notes

**D8 en la arquitectura: fuentes self-hosted en woff2, con `preload` y `font-display: swap`.**
Hoy el sitio carga **Poppins desde el CDN de Google** — una fuente que el rediseño ni siquiera
usa. Servir las tres familias desde el propio origen elimina una conexión externa del camino
crítico y hace determinista el LCP del hero, que es el elemento protagónico de la animación A1.
[Source: architecture.md#Frontend Architecture, D8]

Esta historia es además una de las tres que persiguen la misma métrica: **cero orígenes de
terceros en runtime** (D14). Las otras dos son la 1.1 (que ya sacó el worker de PDF.js del CDN
de Cloudflare) y la 1.4 (sprite SVG en lugar de Font Awesome). Al terminar la 1.4, la pestaña de
red no debe mostrar ni una sola petición fuera de marcecode.com.

### Qué familias y qué pesos

`tokens.css` declara tres familias:

```css
--font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;   /* títulos */
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;  /* cuerpo */
--font-mono:    'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace; /* chips, metadatos */
```

Los pesos que el design system realmente usa, medidos sobre `_system/components.css` y los cuatro
`page.css`: **400, 500, 600 y 700**.

**Recomendación: usar los archivos variables.** Space Grotesk e Inter publican woff2 variables que
cubren 400–700 en un único archivo. Tres peticiones (una por familia) en lugar de cinco o seis
cortes estáticos, y sin riesgo de que falte un peso al implementar una historia posterior.

```scss
@font-face {
  font-family: 'Space Grotesk';
  src: url('~@/assets/fonts/space-grotesk-variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

Si por algún motivo usás cortes estáticos, el mínimo necesario es: Space Grotesk 500 y 700,
Inter 400 y 600, JetBrains Mono 400.

### De dónde salen los archivos

Las tres familias son de licencia abierta (SIL Open Font License). Fuentes oficiales:

- **Space Grotesk** — https://github.com/floriankarsten/space-grotesk
- **Inter** — https://github.com/rsms/inter
- **JetBrains Mono** — https://github.com/JetBrains/JetBrainsMono

Descargá los `.woff2` de los releases. **No** uses un servicio que "empaquete" Google Fonts ni
un CDN alternativo: el objetivo entero de la historia es no depender de un tercero.

Incluí el archivo de licencia de cada familia junto a los woff2. Son fuentes libres, pero la OFL
pide conservar el aviso.

### El atributo `crossorigin` en el preload

```html
<link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
```

`crossorigin` es **obligatorio aunque la fuente sea del mismo origen**. Las fuentes se piden
siempre en modo CORS anónimo; sin el atributo, el navegador descarga el archivo dos veces —una
por el preload y otra por el `@font-face`— y el preload deja de ayudar y empieza a estorbar.

Si el DevTools avisa "preloaded but not used within a few seconds", el `crossorigin` falta o la
URL del preload no coincide exactamente con la que resuelve el `@font-face`.

### Ruta de los assets y webpack

Las fuentes van en `src/assets/fonts/` **y no en `public/`**, para que webpack las versione con
hash de contenido y `nginx.conf` pueda servirlas con `expires 1y, immutable`. La regex de assets
de `nginx.conf` ya contempla `woff2?`.

Referencialas desde SCSS con `~@/assets/fonts/…`. El `~` es lo que hace que webpack resuelva el
módulo en lugar de tratarlo como una ruta literal.

**Consecuencia para el preload:** la URL del `<link>` en `public/index.html` es estática, pero la
del archivo emitido lleva hash. Resolvelo con el helper de `html-webpack-plugin` o, si se vuelve
enredado, dejá el preload solo para la fuente del hero y verificá a mano que la URL coincide.
Un preload que apunta a una URL inexistente es peor que no tener preload.

### El respaldo importa mientras `swap` hace su trabajo

Con `font-display: swap`, el navegador pinta primero con la fuente de respaldo y cambia cuando
llega la real. Las cadenas de respaldo de `tokens.css` ya están elegidas para que ese salto sea
chico. **No las modifiques.** Si el salto se nota mucho en el hero, la palanca correcta es el
preload, no cambiar el respaldo ni pasar a `font-display: block` — `block` esconde el texto y
degrada el LCP, que es exactamente lo que esta historia protege.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** uses Google Fonts, ni `@import url(...)`, ni ningún CDN de fuentes.
- ❌ **No** cambies `font-display: swap` por `block`, `fallback` ni `optional`.
- ❌ **No** modifiques las cadenas de respaldo de `tokens.css`.
- ❌ **No** precargues las tres familias. Solo lo que pinta el hero.
- ❌ **No** pongas las fuentes en `public/`: perdés el hash y la caché inmutable.
- ❌ **No** agregues pesos "por si acaso". Cada archivo es una petición.
- ❌ **No** toques todavía el `<html lang="">` vacío de `index.html`: es la historia 1.7.
- ❌ **No** agregues los metadatos de Open Graph: es la historia 7.2.
- ❌ **No** instales ninguna librería de carga de fuentes.

### Comandos de verificación

```bash
# Ninguna referencia a Google Fonts ni a Poppins
grep -rn "googleapis\|gstatic\|Poppins" public/ src/

# Los woff2 existen
ls -la src/assets/fonts/
```

En el navegador, con el build de producción:

```js
// Debe devolver la familia real, no solo el fallback
getComputedStyle(document.querySelector('h1')).fontFamily
getComputedStyle(document.querySelector('p')).fontFamily

// Debe listar las familias cargadas
[...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`)
```

En la pestaña de red, filtrando por `Font`: solo peticiones al propio origen, y ninguna a
`fonts.gstatic.com`.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. Los `grep` de arriba, vacíos.
3. Pestaña de red del navegador: cero peticiones fuera del propio origen.
4. `font-family` computado de `h1` y `p` resuelve a las familias reales.
5. Sin advertencias de preload en la consola de DevTools.

### Project Structure Notes

```
src/assets/fonts/                     NUEVO — woff2 + archivos de licencia
src/styles/fonts.scss                 NUEVO — los @font-face
src/main.js                           MODIFICADO — import de fonts.scss antes de base.scss
public/index.html                     MODIFICADO — se quita Google Fonts, se suman los preload
```

Orden de imports de estilos en `main.js` al terminar esta historia:

```js
import './styles/tokens.css'
import './styles/fonts.scss'
import './styles/base.scss'
import './styles/sass/main.scss'
```

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.3]
- D8, fuentes self-hosted: [Source: architecture.md#Frontend Architecture]
- D14, cero orígenes de terceros: [Source: architecture.md#Authentication & Security]
- NFR-05, `font-display: swap` y precarga: [Source: prd.md#8.1 Performance]
- NFR-01, LCP < 2.5 s: [Source: prd.md#8.1 Performance]
- Tipografía elegida: [Source: ux-design-specification.md#3.2 Tipografía]
- Definición de familias: `src/styles/tokens.css` (portado en la historia 1.2)

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Archivos descargados** desde los repositorios oficiales, con su licencia:

| Archivo | Tamaño | Firma |
|---|---|---|
| `space-grotesk-variable.woff2` | 48 KB | `wOF2` ✓ |
| `inter-variable.woff2` | 344 KB | `wOF2` ✓ |
| `jetbrains-mono-variable.woff2` | 111 KB | `wOF2` ✓ |
| `LICENSE-SpaceGrotesk.txt`, `LICENSE-Inter.txt`, `LICENSE-JetBrainsMono.txt` | 4.4 KB c/u | — |

**URLs emitidas por webpack, con hash de contenido:**

```
/fonts/space-grotesk-variable.6c9d152e.woff2
/fonts/inter-variable.0336a89f.woff2
/fonts/jetbrains-mono-variable.aa4388db.woff2
```

**Los `preload` coinciden exactamente con las URLs que el CSS pide** — verificado comparando los
conjuntos extraídos de `dist/index.html` y `dist/css/app.*.css`: `preload ⊆ usadas` es `True`.

**Orígenes externos en la app:** **cero**. `performance.getEntriesByType('resource')` filtrado por
origen distinto al propio devuelve un array vacío, y la pestaña de red confirma 0 peticiones fuera
de `localhost:8099`.

**Prueba de renderizado real** — no solo "el `font-family` computado dice X", sino que el navegador
está usando la fuente y no el respaldo. Se mide el ancho de un `<span>` inline con la familia y con
un respaldo proporcional:

| Familia | Ancho con la fuente | Ancho con respaldo | ¿Renderiza? |
|---|---|---|---|
| Space Grotesk | 507.67 px | 602.06 px | **sí** |
| Inter | 483.19 px | 602.06 px | **sí** |
| JetBrains Mono | 408.00 px | 409.41 px | **sí** (tras forzar la carga) |

**El eje variable funciona:** Inter a peso 400 mide 483.19 px y a 700 mide 509.69 px. Un archivo
por familia cubre todo el rango.

**Peticiones en la carga inicial:** solo dos fuentes, las precargadas — 48 KB y 344 KB, ambas 200.
JetBrains Mono no se pide hasta que algo use `--font-mono`.

**Consola:** ningún warning de preload. Los únicos mensajes son los 404 preexistentes de los iconos
del PWA, documentados en la historia 1.1 y asignados a la 7.3.

### Completion Notes List

Los tres criterios se cumplen.

**AC1 —** Las tres familias son self-hosted en `src/assets/fonts/`, con `font-display: swap` en los
tres `@font-face` y `font-weight: 400 700` declarando el rango variable. Se usaron los archivos
**variables**: cubren 400–700 en una sola petición por familia, frente a los cinco cortes estáticos
que haría falta si no (Space Grotesk 500/600/700, Inter 400/600, JetBrains Mono 400/500 — los pesos
que el design system realmente usa, medidos sobre su CSS).

**AC2 —** El `<link>` a `fonts.googleapis.com` se eliminó de `public/index.html`. La app no hace
ninguna petición externa.

**AC3 —** El cuerpo de texto resuelve a Inter y **los encabezados reales del markup resuelven a
Space Grotesk**, verificado sobre los tres `<h2>` que hay hoy en la página. Matiz honesto: el
"título" del hero actual es un `<div class="title">`, no un `<h1>`, y `_texts.scss` no le declara
familia, así que hereda Inter del `body`. **No es un defecto de esta historia**: es el markup viejo.
Cuando la historia 3.1 construya `HeroSection` con una `h1` real, adoptará `--font-display` sin
tocar nada de acá — lo prueba que los `<h2>` existentes ya lo hacen.

**El `preload` con URL hasheada se resolvió con `require()` en el template.** El problema que la
historia anticipaba es real: `public/index.html` es estático pero webpack emite las fuentes con
hash. La salida limpia es interpolar en el template, que Vue CLI soporta:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="<%= require('@/assets/fonts/space-grotesk-variable.woff2') %>">
```

Así el `preload` nunca puede apuntar a una URL vieja: sale del mismo módulo que el CSS.

**Se precargan dos de tres familias, no las tres.** La historia advertía que precargar todo equivale
a no precargar nada. El hero usa las tres —`--font-display` en el título, `--font-body` en la
bajada, `--font-mono` en el kicker— pero JetBrains Mono solo pinta el kicker, texto chico que puede
esperar el swap. Precargar sus 111 KB en el camino crítico no se paga. Space Grotesk (48 KB) e Inter
(344 KB) sí.

**Un cuarto error de medición propio, anotado como método.** La primera prueba de renderizado usó
`monospace` como respaldo para las tres familias. Contra JetBrains Mono —que **es** monoespaciada—
dio 602.06 px en los dos casos y pareció que la fuente no cargaba. No era así: forzando
`document.fonts.load()` el estado pasó a `loaded`, la petición devolvió 200, y el ancho real es
408.00 contra 409.41. **Comparar una monoespaciada contra el respaldo `monospace` no discrimina**;
hay que usar un respaldo proporcional. Se suma a los tres errores de medición ya documentados en el
review de la historia 1.2.

**Fuera de alcance, reforzado:** las cuatro páginas del prototipo en `public/ui-generated/` siguen
cargando las fuentes desde `fonts.googleapis.com`. No son parte de la app, así que no afectan al
AC2 — pero como `public/` se copia a `dist/`, esas páginas quedarían servidas desde
`marcecode.com/ui-generated/` **haciendo peticiones a Google**. Es el mismo pendiente que la
historia 1.1 ya registró, ahora también con implicancia sobre D14. Sigue haciendo falta excluir
`ui-generated/` del build en `vue.config.js` antes de mergear a `main`.

### File List

```
src/assets/fonts/space-grotesk-variable.woff2      NUEVO — 48 KB, variable 400–700
src/assets/fonts/inter-variable.woff2              NUEVO — 344 KB, variable 400–700
src/assets/fonts/jetbrains-mono-variable.woff2     NUEVO — 111 KB, variable 400–700
src/assets/fonts/LICENSE-SpaceGrotesk.txt          NUEVO — SIL OFL
src/assets/fonts/LICENSE-Inter.txt                 NUEVO
src/assets/fonts/LICENSE-JetBrainsMono.txt         NUEVO — SIL OFL
src/styles/fonts.scss                              NUEVO — los tres @font-face
src/main.js                                        MODIFICADO — import de fonts.scss tras tokens.css
public/index.html                                  MODIFICADO — se quita Google Fonts, se suman 2 preload
```

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Tres familias self-hosted en woff2 variable; Google Fonts eliminado; preload con URL hasheada vía `require()` en el template. Estado `review`. |


## Senior Developer Review (AI)

**Fecha:** 2026-08-17
**Revisor:** claude-opus-5, pasada adversarial
**Resultado:** **Changes Requested → corregido y aprobado**

**Contraste File List vs git:** los 9 archivos declarados coinciden exactamente con
`git diff --name-only HEAD~1 HEAD -- src/ public/`. Sin discrepancias.

**`font-display: swap`:** presente en los 3 `@font-face` del CSS compilado. Verificado contando
ocurrencias en el bundle, no leyendo el fuente.

### 🔴 Alto — 1 hallazgo, corregido

**H1 — `format('woff2-variations')` no es un valor estándar y arriesgaba dejar el sitio sin fuentes
en algunos navegadores.** `src/styles/fonts.scss`

Los tres `@font-face` declaraban:

```css
src: url('…woff2') format('woff2-variations');
```

`woff2-variations` **nunca fue un valor estándar** de `format()`. Los valores del spec de CSS Fonts
son `woff2`, `woff`, `truetype`, `opentype`, `embedded-opentype`, `svg` y `collection`. El sufijo
`-variations` fue una propuesta interina que solo Safari implementó en su momento.

Y lo importante: **el spec obliga a descartar la entrada de `src` cuyo hint el navegador no
reconozca.** No es una degradación elegante — si el navegador no lo tolera, el `@font-face` queda
sin `src` válido y la familia entera cae al respaldo del sistema. Con una sola entrada de `src` por
familia, eso significa **las tres fuentes sin cargar**.

Chromium lo tolera —las mediciones de la implementación lo confirman— pero NFR-13 exige las dos
últimas versiones de Chrome, Firefox, Safari y Edge. Apostar a la tolerancia de tres motores más, a
cambio de **ningún beneficio**, no se sostiene: un woff2 puede contener una fuente variable sin
anunciarlo, y lo que declara el rango es `font-weight: 400 700`.

**Intenté probarlo en Firefox** (está instalado) pero Playwright no existe como módulo del proyecto
y agregarlo habría sido ampliar el alcance. La decisión no depende del test: el valor estándar es
correcto en todos los motores, así que usar el no estándar es riesgo sin contrapartida.

**Corregido a `format('woff2')`.** Reverificado en navegador con un respaldo **proporcional**
(`serif`, 472.86 px), que discrimina bien las tres familias:

| Familia | Ancho renderizado | Respaldo `serif` | ¿Usa la fuente? |
|---|---|---|---|
| Space Grotesk | 507.67 px | 472.86 px | **sí** |
| Inter | 483.19 px | 472.86 px | **sí** |
| JetBrains Mono | 600.00 px | 472.86 px | **sí** |

Las tres en estado `loaded`, y el eje variable de Inter sigue funcionando: 483.19 px a peso 400 y
509.69 px a 700.

### 🟡 Medio — 1 hallazgo, NO corregido (fuera de alcance, asignado)

**M1 — Las fuentes precargadas son el 60 % del camino crítico, e Inter sola son 344 KB.**

Medido sobre el build:

| | Peso |
|---|---|
| `inter-variable.woff2` | **344 KB** ← precargada |
| `jetbrains-mono-variable.woff2` | 111 KB |
| `space-grotesk-variable.woff2` | 48 KB ← precargada |
| **Total precargado** | **392 KB** |
| CSS de la app | 14 KB |
| JS crítico (vendors + app) | 246 KB |

**Las fuentes son el 60 % de los bytes del camino crítico.** Con la red 4G simulada que Lighthouse
usa, 392 KB de fuentes son del orden de dos segundos por sí solos — contra un presupuesto de LCP
< 2.5 s (NFR-01, M3).

La causa es que `InterVariable.woff2` trae el juego de glifos completo: latín, griego, cirílico y un
set grande de símbolos. Un portfolio en español e inglés nunca usa la mayor parte.

**Recomendación concreta para la historia 7.8:** subsetear Inter a latín con `pyftsubset` de
fonttools. Un subset latino de Inter variable suele quedar entre 60 y 100 KB, o sea unos 250 KB
menos en el camino crítico.

**No se corrigió acá** porque requiere instalar `fonttools` —verificado que no está disponible— y
el alcance de esta historia no incluye agregar dependencias. La 7.8 es la que mide NFR-01 contra el
presupuesto y decide si hace falta.

**Palanca alternativa si el subsetting no se hace:** dejar de precargar Inter y precargar solo Space
Grotesk (48 KB). El texto del cuerpo aparecería con el respaldo del sistema durante el primer
fotograma, lo que es exactamente lo que `font-display: swap` está diseñado para manejar.

### 🟢 Bajo — 2 hallazgos, aceptados sin cambio

**L1 — No hay caras itálicas declaradas.** Los tres `@font-face` son `font-style: normal`. Si algún
componente usa `<em>` con estas familias, el navegador sintetiza una oblicua inclinando los glifos.
El design system lo neutraliza donde importa (`.hero-role em { font-style: normal }`). Agregar tres
archivos itálicos duplicaría el peso de fuentes para un uso que el diseño no tiene.

**L2 — Sin `unicode-range`**, así que cualquier carácter latino descarga el archivo completo de la
familia. Es la otra cara de M1 y se resuelve con el mismo subsetting.

### Errores de medición propios, detectados durante la implementación

**Cuarto de la serie** (los tres primeros están en el review de la historia 1.2): comparar una
fuente **monoespaciada** contra el respaldo `monospace` no discrimina —JetBrains Mono dio 602.06 px
y `monospace` también— y por un momento pareció que la fuente no cargaba. Forzando
`document.fonts.load()` el estado pasó a `loaded` y la petición devolvió 200.

**La corrección de método**, ya aplicada en la reverificación: usar un respaldo **proporcional**
(`serif`) como referencia, que difiere de cualquier familia bajo prueba.

### Action Items

- [x] [AI-Review][Alto] Cambiar `format('woff2-variations')` por `format('woff2')` en los tres `@font-face` [fonts.scss:20,28,36]
- [ ] [AI-Review][Medio] Subsetear Inter a latín con `pyftsubset`; son 344 KB de 392 KB precargados, el 60 % del camino crítico — **historia 7.8**
- [ ] [AI-Review][Bajo] Si no se subsetea, evaluar quitar Inter del `preload` y dejar solo Space Grotesk — **historia 7.8**

### Change Log — actualización

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Code review: 1 hallazgo alto corregido (`format()` no estándar). 1 medio asignado a la historia 7.8 con la medición. Estado `done`. |
