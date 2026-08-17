# Story 1.5: Chasis persistente — header y pie de página

Status: ready-for-dev

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

- [ ] **Tarea 1 — Portar los estilos del chasis** (AC: #1, #3)
  - [ ] Crear `src/styles/chassis.scss` con las secciones "Header / nav" y "Footer" de `_system/components.css` (líneas 153–350 y 419–443)
  - [ ] Incluye `.site-header`, `.header-inner`, `.logo`, `.logo-mark`, `.nav`, `.nav-list`, `.nav-link`, `.nav-indicator`, `.header-actions`, `.icon-btn`, `.lang-btn`, `.site-footer`, `.footer-inner`, `.logo-sm`, `.footer-meta`, `.footer-sep`
  - [ ] **Excepción temporal:** `.nav` se porta con `display: flex`, no con el `display: none` del original (ver §El nav no se puede esconder todavía)
  - [ ] **No** portes `.mobile-menu`, `.mobile-list`, `.mobile-link`, `.nav-scrim` ni `.menu-btn`: son la historia 2.4
  - [ ] Importarlo en `src/main.js` después de `base.scss`

- [ ] **Tarea 2 — Construir `AppNav.vue`** (AC: #1, #4)
  - [ ] Markup portado de `chasis.html`: `.site-header` → `.header-inner` → logo + `.nav` + `.header-actions`
  - [ ] El logo es `<span class="logo-mark" aria-hidden="true">&lt;/&gt;</span><span class="logo-word">MarceCode</span>`, envuelto en un `<RouterLink to="/">` con `aria-label`
  - [ ] Los tres enlaces son `<RouterLink class="nav-link">` a `/`, `/projects` y `/about`
  - [ ] Las etiquetas salen de `t('home')`, `t('projects')` y `t('about')`, que ya existen en `src/i18n.js`
  - [ ] `.header-actions` contiene por ahora **solo** el botón de idioma, con el markup canónico `.lang-btn` (ver §El área de acciones se llena por partes)
  - [ ] Incluir el `<span class="nav-indicator">` en el markup, sin lógica: la 2.2 lo anima

- [ ] **Tarea 3 — Construir `AppFooter.vue`** (AC: #1, #4)
  - [ ] Markup portado de `chasis.html`: `.site-footer` → `.container.footer-inner` → logo chico + `.footer-meta`
  - [ ] **Además**, conservar los tres canales de contacto que hoy están en `FooterPage.vue`, ahora con los íconos del sprite (`i-linkedin`, `i-mail`, `i-whatsapp`) vía `AppIcon`
  - [ ] Cada enlace externo con `target="_blank"` y `rel="noopener noreferrer"`, y `aria-label` propio
  - [ ] Área táctil de cada canal ≥ 44×44 px

- [ ] **Tarea 4 — Reestructurar `App.vue`** (AC: #1, #2)
  - [ ] Template en este orden: `<AppSprite />` → `.skip-link` → `<AppNav />` → `<main id="main">` con `<RouterView />` → `<AppFooter />`
  - [ ] El `.skip-link` va **antes** del header, para ser el primer elemento enfocable
  - [ ] `<main>` lleva `id="main"`, que es el destino del skip link
  - [ ] **No toques** el botón flotante de tema que hoy vive en `App.vue`: lo reemplaza la historia 1.6

- [ ] **Tarea 5 — Eliminar los componentes viejos** (AC: #1)
  - [ ] Borrar `src/components/layouts/NavBar.vue` y `src/components/layouts/FooterPage.vue`
  - [ ] Borrar `src/styles/sass/modules/_navbar.scss` y su `@import` en `main.scss`
  - [ ] Borrar los PNG que quedan sin uso: `src/assets/icons/{linkedin,gmail,whatsapp}.png`
  - [ ] Verificar por `grep` que nada los referencia

- [ ] **Tarea 6 — Verificar** (AC: #1, #2, #3, #4)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Recorrer las tres vistas en 390 px y en 1280 px
  - [ ] Medir el chasis en las tres vistas (ver §Comandos de verificación)
  - [ ] Probar el skip link con `Tab` desde la carga de la página
  - [ ] Alternar idioma y confirmar que las etiquetas del nav cambian

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

### Debug Log References

### Completion Notes List

### File List
