# Story 1.3: Tipografía propia, sin orígenes externos

Status: ready-for-dev

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

- [ ] **Tarea 1 — Obtener los archivos de fuente** (AC: #1)
  - [ ] Descargar las tres familias en woff2 desde su fuente oficial (ver §De dónde salen los archivos)
  - [ ] Guardarlas en `src/assets/fonts/`
  - [ ] Preferir el archivo **variable** de cada familia cuando exista: cubre todo el rango de pesos en una sola petición

- [ ] **Tarea 2 — Declarar los `@font-face`** (AC: #1)
  - [ ] Crear `src/styles/fonts.scss` con un `@font-face` por familia (o por corte, si se usan estáticas)
  - [ ] `font-display: swap` en **todos**, sin excepción
  - [ ] `font-weight: 400 700` en las declaraciones variables; el peso exacto en las estáticas
  - [ ] Importarlo en `src/main.js` **antes** de `base.scss`

- [ ] **Tarea 3 — Precargar solo lo del hero** (AC: #1)
  - [ ] Agregar en `public/index.html` los `<link rel="preload" as="font" type="font/woff2" crossorigin>` de las fuentes que pinta el hero
  - [ ] `crossorigin` es obligatorio aunque la fuente sea del mismo origen (ver §El atributo `crossorigin`)
  - [ ] **No** precargar las tres familias: precargar todo equivale a no precargar nada

- [ ] **Tarea 4 — Eliminar Google Fonts** (AC: #2)
  - [ ] Borrar de `public/index.html` la línea `<link href="https://fonts.googleapis.com/css2?family=Poppins…">`
  - [ ] Verificar por `grep` que no queda ninguna referencia a `fonts.googleapis.com` ni a `fonts.gstatic.com`
  - [ ] Verificar que no queda ninguna referencia a `Poppins` en `src/`

- [ ] **Tarea 5 — Verificar** (AC: #1, #2, #3)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Pestaña de red: ninguna petición fuera del propio origen
  - [ ] Inspeccionar el `font-family` computado de un `h1` y de un `p` (ver §Comandos de verificación)
  - [ ] Verificar que las fuentes se sirven desde `/fonts/…` con hash, no desde `/src/`

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

### Debug Log References

### Completion Notes List

### File List
