# Story 1.5: Chasis persistente — header y pie de página

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante,
I want un encabezado y un pie presentes en todas las vistas,
so that tenga siempre a mano la navegación y los datos de contacto.

## Acceptance Criteria

**AC1 — Chasis canónico montado**

**Given** el markup del chasis verificado en `public/ui-generated/_system/chasis.html`
**When** se construyen `src/components/layout/AppNav.vue` y `AppFooter.vue` y se montan en `App.vue`
**Then** el header presenta logo, los tres enlaces de navegación y el área de acciones
**And** las clases usadas son las canónicas del sistema: `.site-header`, `.header-inner`, `.logo`, `.nav`, `.nav-list`, `.nav-link`, `.header-actions`, `.site-footer`, `.footer-inner`
**And** `NavBar.vue` y `FooterPage.vue` quedan eliminados

**AC2 — Landmarks semánticos**

**Given** la estructura de `App.vue`
**When** se inspecciona el documento
**Then** existe un `<header>`, un `<main>` y un `<footer>` como landmarks
**And** el `.skip-link` es el primer elemento enfocable y lleva al contenido principal

**AC3 — Chasis idéntico en todas las vistas**

**Given** cualquiera de las tres vistas
**When** se comparan las medidas computadas del header
**Then** la altura y la posición del logo son idénticas en todas

**AC4 — Sin regresión funcional**

**Given** el sitio después del cambio
**When** se recorren las tres vistas en 390 px y en 1280 px
**Then** los tres enlaces de navegación son visibles y clickeables en ambos anchos
**And** el botón de idioma sigue funcionando igual que antes
**And** los tres canales de contacto siguen alcanzables desde el pie en todas las vistas

## Tasks / Subtasks

- [x] **Tarea 1 — Portar los estilos del chasis** (AC: #1, #3)
  - [x] Crear `src/styles/chassis.scss` con las secciones "Header / nav" y "Footer" de `_system/components.css` (líneas 153–350 y 419–443)
  - [x] Incluye `.site-header`, `.header-inner`, `.logo`, `.logo-mark`, `.nav`, `.nav-list`, `.nav-link`, `.nav-indicator`, `.header-actions`, `.icon-btn`, `.lang-btn`, `.site-footer`, `.footer-inner`, `.logo-sm`, `.footer-meta`, `.footer-sep`
  - [x] **Excepción temporal:** `.nav` se porta con `display: flex`, no con el `display: none` del original (ver §El nav no se puede esconder todavía)
  - [x] **No** portes `.mobile-menu`, `.mobile-list`, `.mobile-link`, `.nav-scrim` ni `.menu-btn`: son la historia 2.4
  - [x] Importarlo en `src/main.js` después de `base.scss`

- [x] **Tarea 2 — Construir `AppNav.vue`** (AC: #1, #4)
  - [x] Markup portado de `chasis.html`: `.site-header` → `.header-inner` → logo + `.nav` + `.header-actions`
  - [x] El logo es `<span class="logo-mark" aria-hidden="true">&lt;/&gt;</span><span class="logo-word">MarceCode</span>`, envuelto en un `<RouterLink to="/">` con `aria-label`
  - [x] Los tres enlaces son `<RouterLink class="nav-link">` a `/`, `/projects` y `/about`
  - [x] Las etiquetas salen de `t('home')`, `t('projects')` y `t('about')`, que ya existen en `src/i18n.js`
  - [x] `.header-actions` contiene por ahora **solo** el botón de idioma, con el markup canónico `.lang-btn` (ver §El área de acciones se llena por partes)
  - [x] Incluir el `<span class="nav-indicator">` en el markup, sin lógica: la 2.2 lo anima

- [x] **Tarea 3 — Construir `AppFooter.vue`** (AC: #1, #4)
  - [x] Markup portado de `chasis.html`: `.site-footer` → `.container.footer-inner` → logo chico + `.footer-meta`
  - [x] **Además**, conservar los tres canales de contacto que hoy están en `FooterPage.vue`, ahora con los íconos del sprite (`i-linkedin`, `i-mail`, `i-whatsapp`) vía `AppIcon`
  - [x] Cada enlace externo con `target="_blank"` y `rel="noopener noreferrer"`, y `aria-label` propio
  - [x] Área táctil de cada canal ≥ 44×44 px

- [x] **Tarea 4 — Reestructurar `App.vue`** (AC: #1, #2)
  - [x] Template en este orden: `<AppSprite />` → `.skip-link` → `<AppNav />` → `<main id="main">` con `<RouterView />` → `<AppFooter />`
  - [x] El `.skip-link` va **antes** del header, para ser el primer elemento enfocable
  - [x] `<main>` lleva `id="main"`, que es el destino del skip link
  - [x] **No toques** el botón flotante de tema que hoy vive en `App.vue`: lo reemplaza la historia 1.6

- [x] **Tarea 5 — Eliminar los componentes viejos** (AC: #1)
  - [x] Borrar `src/components/layouts/NavBar.vue` y `src/components/layouts/FooterPage.vue`
  - [x] Borrar `src/styles/sass/modules/_navbar.scss` y su `@import` en `main.scss`
  - [x] Borrar los PNG que quedan sin uso: `src/assets/icons/{linkedin,gmail,whatsapp}.png`
  - [x] Verificar por `grep` que nada los referencia

- [x] **Tarea 6 — Verificar** (AC: #1, #2, #3, #4)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Recorrer las tres vistas en 390 px y en 1280 px
  - [x] Medir el chasis en las tres vistas (ver §Comandos de verificación)
  - [x] Probar el skip link con `Tab` desde la carga de la página
  - [x] Alternar idioma y confirmar que las etiquetas del nav cambian

## Dev Notes

Esta historia reemplaza el chasis viejo por el canónico. Es la primera vez que aparece markup del
design system dentro de componentes Vue, así que fija el patrón para todas las historias que
siguen: **el markup se porta, no se reinterpreta.**

El design system de `public/ui-generated/_system/` es normativo para nombres de clase, tokens y
markup del chasis. Ese sistema nació justamente de arreglar el problema contrario: cuatro
pantallas generadas sin vocabulario común terminaron con tres nombres distintos para el mismo
panel de menú y 4019 líneas de CSS con los tokens redefinidos cuatro veces.
[Source: architecture.md#Implementation Patterns & Consistency Rules]

### El nav no se puede esconder todavía

`_system/components.css` declara `.nav { position: relative; display: none; }` y lo muestra
recién a partir del breakpoint de escritorio, porque en mobile la navegación vive en el
`.mobile-menu`. **Pero el menú mobile es la historia 2.4.**

Si portás ese `display: none` ahora, el sitio se queda sin navegación en mobile durante cuatro
historias. Por eso esta historia porta `.nav` con `display: flex` y sin la media query.

Dejá el marcador exacto en el CSS para que la 2.4 sepa qué revertir:

```scss
/* TEMPORAL — historia 1.5. La 2.4 restaura el `display: none` canónico
   y su media query cuando exista el menú mobile. */
.nav { position: relative; display: flex; }
```

Es la **única** desviación autorizada respecto del sistema en esta historia. Cualquier otra
diferencia es un defecto.

### El área de acciones se llena por partes

`chasis.html` muestra `.header-actions` con tres controles. Solo uno corresponde a esta historia:

| Control | Markup canónico | Historia |
|---|---|---|
| Botón de tema | `.icon-btn.theme-btn` con `i-moon` + `i-sun` | **1.6** |
| Botón de idioma | `.lang-btn` con `ES / EN` | **1.5 — esta** |
| Botón de menú | `.icon-btn.menu-btn` con `i-menu` + `i-close` | **2.4** |

**No agregues los otros dos.** Un botón que no hace nada es peor que un botón ausente: parece
funcionalidad rota.

Para el de idioma, portá el markup canónico y cableálo al comportamiento **actual** —el mismo
`locale.value = locale.value === 'es' ? 'en' : 'es'` que hoy vive en `NavBar.vue`— sin
persistencia. La persistencia y el composable `useLocale` son la historia 1.7. Lo que se gana
acá es sacar los estilos inline que ese botón tiene hoy.

### El pie conserva los contactos, y eso es a propósito

El `chasis.html` canónico tiene un pie mínimo: logo chico y `2026 · Hecho con Vue`. Pero el
`FooterPage.vue` actual expone LinkedIn, email y WhatsApp en todas las vistas.

Portar el pie canónico tal cual dejaría al sitio sin contacto en las vistas de Proyectos y Sobre
mí hasta la historia 6.3 — una regresión contra FR-25 durante toda la mitad del rediseño.

La salida es sumar los tres canales al pie canónico usando los íconos del sprite. Se gana además
eliminar tres PNG. En la historia 6.3 esos enlaces pasan a leerse de `src/content/contact.js`;
por ahora los valores van literales en el componente, igual que hoy:

```
LinkedIn   https://www.linkedin.com/in/marcelodanielolivera/
Email      mailto:olivera.m.et13@gmail.com
WhatsApp   https://wa.me/541134323271
```

### El indicador va en el markup, sin lógica

Incluí `<span class="nav-indicator" aria-hidden="true"></span>` dentro del `.nav`. Sus estilos
lo dejan invisible hasta que reciba `.is-ready`, cosa que hace la historia 2.2. Ponerlo ahora
evita tocar el markup del chasis dos veces.

### Orden del template de `App.vue`

```
AppSprite        ← invisible, aporta los <symbol>
.skip-link       ← primer elemento enfocable (NFR-08)
AppNav           ← <header>
main#main        ← <RouterView />, destino del skip link (NFR-09)
AppFooter        ← <footer>
[botón de tema flotante — se va en la 1.6]
```

El `.skip-link` **antes** del header no es cosmético: si va después, el visitante que navega por
teclado tiene que atravesar todo el nav antes de encontrar el atajo, que es exactamente lo que el
atajo existe para evitar.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** inventes nombres de clase. Si el elemento ya tiene nombre en `_system/components.css`,
  se usa ese. Un sinónimo nuevo es un defecto.
- ❌ **No** uses BEM (`.nav__link`, `.btn--primary`). El sistema usa `kebab-case` plano.
- ❌ **No** redefinas ningún token en el `<style scoped>` de estos componentes.
- ❌ **No** agregues el botón de tema ni el de menú.
- ❌ **No** portes `.mobile-menu`, `.nav-scrim` ni `.menu-btn`.
- ❌ **No** animes el indicador de navegación.
- ❌ **No** agregues el estado `.is-scrolled` del header: es la historia 2.3.
- ❌ **No** toques `src/router/index.js`: los metadatos de ruta son la 2.1.
- ❌ **No** crees `src/locales/`: es la 1.7. Usá las claves que ya están en `src/i18n.js`.
- ❌ **No** borres `src/styles/sass/modules/_texts.scss`, `_buttons.scss` ni `_pages.scss`: sus
  componentes siguen vivos. Solo `_navbar.scss` muere acá.

### Comandos de verificación

```bash
# Nada referencia los componentes eliminados
grep -rn "NavBar\|FooterPage\|linkedin.png\|gmail.png\|whatsapp.png" src/

# Sin BEM ni sinónimos
grep -rn 'class="[^"]*__\|class="[^"]*--' src/components/layout/
```

En el navegador, en cada una de las tres vistas:

```js
// El chasis mide igual en todas — anotá y compará los tres valores
document.querySelector('.site-header').getBoundingClientRect().height
document.querySelector('.logo').getBoundingClientRect().left

// Landmarks presentes
['header','nav','main','footer'].map(t => [t, !!document.querySelector(t)])

// El skip link es el primer enfocable
document.querySelector('a, button').className   // debe ser 'skip-link'
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. Las tres vistas recorridas en 390 px y en 1280 px, con los tres enlaces clickeables en ambos.
3. Altura del header y posición del logo idénticas en las tres vistas.
4. `Tab` desde la carga revela el skip link, y activarlo lleva el foco a `<main>`.
5. Alternar idioma cambia las etiquetas del nav.
6. Los tres canales del pie abren su destino.
7. Consola sin errores.

**Verificá en las tres vistas, no en una.** El defecto del z-index del velo del menú mobile en el
prototipo existía en dos de cuatro pantallas y pasó desapercibido porque solo se revisó la Home.

### Project Structure Notes

```
src/components/layout/AppNav.vue        NUEVO — reemplaza NavBar.vue
src/components/layout/AppFooter.vue     NUEVO — reemplaza FooterPage.vue
src/styles/chassis.scss                 NUEVO — header y footer del design system
src/App.vue                             MODIFICADO — nueva estructura de landmarks
src/main.js                             MODIFICADO — import de chassis.scss
src/components/layouts/NavBar.vue       ELIMINADO
src/components/layouts/FooterPage.vue   ELIMINADO
src/styles/sass/modules/_navbar.scss    ELIMINADO
src/styles/sass/main.scss               MODIFICADO — se quita el @import de navbar
src/assets/icons/linkedin.png           ELIMINADO
src/assets/icons/gmail.png              ELIMINADO
src/assets/icons/whatsapp.png           ELIMINADO
```

`src/components/layouts/` (plural) queda vacía y se puede borrar. La carpeta nueva es
`src/components/layout/` (singular), según el árbol de la arquitectura.

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.5]
- Árbol objetivo y fronteras de componentes: [Source: architecture.md#Project Structure & Boundaries]
- Inventario canónico de clases: [Source: architecture.md#Naming Patterns]
- FR-25, contacto alcanzable: [Source: prd.md#7.6 Contacto]
- NFR-08/09/11, foco, landmarks y área táctil: [Source: prd.md#8.2 Accesibilidad]
- Estrategia de componentes: [Source: ux-design-specification.md#5 Estrategia de componentes]
- Markup fuente normativo: `public/ui-generated/_system/chasis.html`
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 153–350 y 419–443

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Clases canónicas presentes en el documento:** `.site-header` 1, `.header-inner` 1, `.logo` 2,
`.logo-mark` 2, `.nav` 1, `.nav-list` 1, `.nav-link` 3, `.nav-indicator` 1, `.header-actions` 1,
`.lang-btn` 1, `.site-footer` 1, `.footer-inner` 1.

**AC2 — landmarks y skip link:**

```
header 1   nav 1   main 1   footer 1
primer elemento enfocable → .skip-link, href="#main", destino existe
```

**AC3 — el chasis mide igual en las tres vistas:**

| Ruta | Altura del header | `left` del logo | Enlace activo |
|---|---|---|---|
| `/` | 81 px | 81 px | Inicio |
| `/projects` | 81 px | 81 px | Proyectos |
| `/about` | 81 px | 81 px | Sobre mí |

**AC4 — el pie, con los tres canales:**

| Canal | Protocolo | `target` | `rel` | Área |
|---|---|---|---|---|
| WhatsApp | `https:` | `_blank` | `noopener noreferrer` | 44×44 |
| Email | `mailto:` | *(vacío)* | *(vacío)* | 44×44 |
| LinkedIn | `https:` | `_blank` | `noopener noreferrer` | 44×44 |

**`aria-current="page"` — exactamente uno por ruta**, y sobre el enlace correcto:

```
/          → 1   ["Inicio"]
/projects  → 1   ["Proyectos"]
/about     → 1   ["Sobre mí"]
logos sin aria-current: true
```

**A 390 px** (viewport de cliente 375 px): logo, nav y botón de idioma los tres dentro del
viewport, ningún elemento del header desborda, los cuatro controles reciben el clic verificado con
`elementFromPoint`, sin scroll horizontal, y las áreas táctiles del header miden 44–45 px.

**El logo navega en modo SPA:** clic en el logo desde `/about` deja `location.pathname === '/'` sin
recarga.

**`z-index` del header:** 100, según el contrato de apilamiento.

**Build y lint:** limpios (queda el warning preexistente de `ItemProject.vue`).

### Completion Notes List

Los cuatro criterios se cumplen. La historia destapó **tres problemas que no estaban previstos**, y
los tres se encontraron midiendo.

**1. Tres elementos anunciaban "página actual" al mismo tiempo.**

En la Home hay **tres** `RouterLink to="/"`: el logo del header, el enlace "Inicio" del nav y el
logo del pie. Vue Router le agrega `aria-current="page"` automáticamente a todo enlace
*exact-active*, así que los tres lo llevaban. Un lector de pantalla anunciaría la página actual tres
veces, y la verificación de la historia 2.2 —que espera exactamente uno— habría fallado.

Los logos no son ítems de navegación, así que no deben anunciarlo. Se resolvió con el modo `custom`
de `RouterLink`, que es la forma documentada de optar por fuera de sus atributos automáticos:

```vue
<RouterLink v-slot="{ href, navigate }" to="/" custom>
  <a class="logo" :href="href" :aria-label="t('logoAria')" @click="navigate">…</a>
</RouterLink>
```

Verificado después: un solo `aria-current="page"` por ruta, los logos sin el atributo, y el logo
sigue navegando sin recargar.

**2. La excepción temporal del `.nav` empujó el botón de idioma fuera de la pantalla.**

La historia autorizaba mostrar el nav en todos los anchos para no perder la navegación en mobile
hasta la 2.4. Lo que no anticipaba es la consecuencia: con el nav ocupando 236 px de una fila de
375 px, más el logo, **el botón de idioma quedaba en `left: 406px` con un viewport de 390 px** — o
sea, invisible e inalcanzable.

Es un intercambio de un problema por otro: navegación visible, idioma inaccesible. La salida fue
dejar que el header envuelva por debajo de 768 px, con el nav en una segunda fila centrada. Todo
queda dentro del viewport y clickeable.

**3. Al envolver, el header tapaba 25 px del contenido.**

El header es `position: fixed` y pasó de 72 a 129 px de alto, pero `#main` despejaba solo
`var(--header-h)` (72 px). Medido: el primer contenido arrancaba en `top: 104` con el header
terminando en 129.

Y acá apareció **la fragilidad que el review de la historia 1.2 había anticipado**: el primer
intento puso la corrección en `chassis.scss` y **no aplicó**, porque la regla `#main` vivía en el
`<style>` de `App.vue`, que se emite *después* de los archivos de estilo y ganaba por orden de
cascada con la misma especificidad.

La corrección de fondo es que la regla estaba en el lugar equivocado: el despeje del header depende
de `--header-h`, que es del chasis. Se movió `#main { padding-top: var(--header-h) }` de `App.vue` a
`chassis.scss`, y ahí la media query de la excepción puede pisarla sin depender del orden de
imports. Verificado: `padding-top` computado 128 px, contenido con 31 px de aire.

**Las tres desviaciones del sistema están marcadas `TEMPORAL` en `chassis.scss`** con la instrucción
exacta de qué revertir, y la historia 2.4 las elimina juntas:

| Desviación | Motivo |
|---|---|
| `.nav { display: block }` sin la media query de 768 px | El menú mobile no existe todavía |
| `@media (max-width: 767px)` que envuelve el header | Consecuencia de la anterior |
| `#main { padding-top: calc(var(--header-h) + 3.5rem) }` en mobile | Consecuencia del envoltorio |

**Exclusiones respetadas.** `chassis.scss` **no** incluye `.theme-btn` (historia 1.6) ni `.menu-btn`,
`.mobile-menu`, `.mobile-list`, `.mobile-link` o `.nav-scrim` (historia 2.4). El filtrado se hizo por
regla, no por rango de líneas — que es el error que en el prototipo destruyó el layout de una
pantalla al partir un `@media` por la mitad. Verificado que no queda ninguna regla de esas clases.

**El breakpoint estaba escondido.** La media query que muestra el nav en escritorio
(`@media (min-width: 768px)`) no está en la sección de header del sistema sino **dentro de la del
menú mobile**, así que la primera extracción por marcadores la dejó afuera. Quedó documentada en el
comentario `TEMPORAL` para que la 2.4 la restaure completa.

**El pie conserva los contactos, con una mejora.** El `FooterPage.vue` original usaba tres PNG de
30×30 px como área clickeable, por debajo del mínimo de 44 px de NFR-11. Los reemplazan íconos del
sprite dentro de `.icon-btn`, que mide 44×44. Los tres PNG se borraron. El `mailto:` va **sin**
`target="_blank"` a propósito: no abre una pestaña, y con el atributo quedaría una en blanco
huérfana.

**Claves de i18n:** se agregaron a `src/i18n.js` las ocho claves de accesibilidad del chasis
(`navAria`, `logoAria`, `skipLink`, `langAria`, `footerMade` y las tres etiquetas de canal), con los
textos del diccionario verificado de `_system/system.js`. Van **planas**, siguiendo el estilo actual
del archivo, porque la historia 1.7 es la que migra todo a `src/locales/{es,en}.json` con estructura
anidada — y su tarea 1 dice explícitamente "migrar las claves de interfaz que hoy están embebidas en
`src/i18n.js`".

### File List

```
src/components/layout/AppNav.vue           NUEVO — reemplaza NavBar.vue
src/components/layout/AppFooter.vue        NUEVO — reemplaza FooterPage.vue
src/styles/chassis.scss                    NUEVO — header y pie del sistema, con 3 bloques TEMPORAL
src/App.vue                                MODIFICADO — landmarks, skip link; se le quita la regla #main
src/main.js                                MODIFICADO — import de chassis.scss
src/i18n.js                                MODIFICADO — 8 claves de accesibilidad del chasis
src/styles/sass/main.scss                  MODIFICADO — se quita el @import de navbar
src/components/layouts/NavBar.vue          ELIMINADO
src/components/layouts/FooterPage.vue      ELIMINADO
src/components/layouts/                    ELIMINADA (quedó vacía)
src/styles/sass/modules/_navbar.scss       ELIMINADO
src/assets/icons/linkedin.png              ELIMINADO
src/assets/icons/gmail.png                 ELIMINADO
src/assets/icons/whatsapp.png              ELIMINADO
```

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Chasis canónico: `AppNav` y `AppFooter` con las clases del sistema, landmarks y skip link. Tres problemas no previstos encontrados midiendo y corregidos. Estado `done`. |
