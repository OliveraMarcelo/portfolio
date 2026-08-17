# Story 2.4: Menú mobile en overlay

Status: ready-for-dev

## Story

As a visitante desde el teléfono,
I want abrir la navegación y llegar a cualquier sección,
so that el sitio me sirva igual que en la computadora.

## Acceptance Criteria

**AC1 — Apertura**

**Given** un viewport de 390 px
**When** el visitante toca el botón de menú
**Then** el panel abre con `.is-open`, el velo aparece con `.is-visible`, y los ítems entran de forma escalonada (FR-03)
**And** el botón declara `aria-expanded="true"`

**AC2 — Cierre al navegar**

**Given** el menú abierto
**When** el visitante toca cualquiera de los enlaces
**Then** la navegación ocurre y el menú se cierra

**AC3 — Cierre por `Escape` y por tap fuera**

**Given** el menú abierto
**When** el visitante presiona `Escape` o toca fuera del panel
**Then** el menú se cierra y el foco vuelve al botón que lo abrió

**AC4 — El velo no se come los clics**

**Given** el menú abierto en cualquiera de las vistas
**When** se consulta con `elementFromPoint` qué elemento recibe el clic sobre un enlace del panel
**Then** el elemento devuelto es el enlace, no el velo
**And** las capas respetan el orden `velo 90 < header 100 < panel 105`

**AC5 — Foco contenido**

**Given** el menú abierto
**When** se intenta recorrer con `Tab`
**Then** el foco queda contenido dentro del panel mientras está abierto

**AC6 — Idéntico en todas las vistas**

**Given** las cuatro vistas del sitio
**When** se repite la verificación de apertura, clic y cierre en cada una
**Then** el comportamiento es idéntico en todas

## Tasks / Subtasks

- [ ] **Tarea 1 — Portar el markup y los estilos** (AC: #1, #4)
  - [ ] Sumar a `AppNav.vue` el `.mobile-menu` con su `.mobile-list` y los tres `.mobile-link`, y el botón `.icon-btn.menu-btn` con los íconos `i-menu` e `i-close`
  - [ ] Agregar el `.nav-scrim` **después** del `</header>`, no dentro
  - [ ] Portar a `chassis.scss` las secciones de menú mobile y velo de `_system/components.css` (líneas 291–348 y 481–496), **incluidas las tres reglas de `z-index`**
  - [ ] **Revertir la excepción de la historia 1.5:** `.nav` vuelve al `display: none` canónico con su media query, y el `.menu-btn` se oculta desde el breakpoint de escritorio

- [ ] **Tarea 2 — Abrir y cerrar** (AC: #1, #2, #3)
  - [ ] Estado local `abierto` en `AppNav.vue`
  - [ ] El botón alterna; `aria-expanded` refleja el estado
  - [ ] Clic en un `.mobile-link` cierra
  - [ ] Clic en el velo cierra
  - [ ] `Escape` cierra y devuelve el foco al botón
  - [ ] Cerrar también al cambiar de ruta, por si la navegación viene de otro lado

- [ ] **Tarea 3 — Bloquear el scroll del fondo** (AC: #1)
  - [ ] Con el menú abierto, `document.body.style.overflow = 'hidden'`
  - [ ] Restaurarlo al cerrar, y también en `onUnmounted` (ver §No dejes el body bloqueado)

- [ ] **Tarea 4 — Contener el foco** (AC: #5)
  - [ ] Al abrir, mover el foco al primer enlace del panel
  - [ ] `Tab` en el último elemento vuelve al primero; `Shift+Tab` en el primero va al último
  - [ ] Al cerrar, devolver el foco al botón
  - [ ] **Esto no está en el prototipo:** hay que escribirlo (ver §El foco atrapado hay que escribirlo)

- [ ] **Tarea 5 — Etiqueta accesible** (AC: #1)
  - [ ] `aria-label` del botón alterna entre `menu.open` y `menu.close`, claves que la historia 1.7 ya dejó en los locales
  - [ ] `aria-controls` apuntando al `id` del panel

- [ ] **Tarea 6 — Verificar en las cuatro vistas** (AC: #4, #6)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] En 390 px, y **en cada una de las vistas**: abrir, tocar un enlace, navegar, cerrar
  - [ ] Correr la prueba de `elementFromPoint` en cada vista
  - [ ] `Escape`, tap fuera, y recorrido con `Tab`
  - [ ] En 1280 px: el botón de menú no se ve y el `.nav` sí

## Dev Notes

Esta historia arregla, en Vue, el defecto que más caro salió en el prototipo. Vale la pena entender
por qué antes de escribir una línea.

### El defecto del velo: por qué el orden de apilamiento es un requisito, no un detalle

En el prototipo, el menú mobile se abría y se veía perfecto, pero **los enlaces no respondían al
clic**. La causa: `.nav-scrim` y `.nav-main` tenían ambos `z-index: auto`, y como el velo aparece
después en el DOM, se pintaba encima del panel e interceptaba todos los eventos de puntero.

No producía ningún error en consola. Visualmente el panel se veía arriba, porque el velo es
semitransparente. La única forma de detectarlo fue preguntarle al navegador qué elemento estaba
recibiendo el clic:

```js
document.elementFromPoint(x, y)   // devolvía el scrim, no el enlace
```

El arreglo es el apilamiento explícito, que ya está en el sistema:

```css
.nav-scrim   { z-index: 90;  }
.site-header { z-index: 100; }
.mobile-menu { z-index: 105; }
```

**Portá las tres reglas.** Si omitís una, el defecto vuelve. Y el AC4 exige la prueba con
`elementFromPoint` justamente porque mirar la pantalla no alcanza.

El segundo aprendizaje del mismo episodio: **el defecto existía en dos de las cuatro pantallas y
pasó desapercibido porque solo se revisó la Home.** De ahí el AC6.

### El velo va fuera del header

`chasis.html` pone `<div class="nav-scrim">` **después** del `</header>`, no adentro. Si lo metés
dentro del header, hereda su contexto de apilamiento y el `z-index: 90` deja de compararse contra
el del panel. El markup canónico está así por ese motivo.

### Revertir la excepción de la historia 1.5

La historia 1.5 portó `.nav` con `display: flex` en todos los anchos, porque el menú mobile no
existía todavía y esconder el nav habría dejado el sitio sin navegación. Dejó este marcador:

```scss
/* TEMPORAL — historia 1.5. La 2.4 restaura el `display: none` canónico
   y su media query cuando exista el menú mobile. */
```

**Esta es la historia que lo revierte.** Buscá el marcador y restaurá el comportamiento del
sistema: `.nav { display: none }` con la media query que lo muestra en escritorio, y el
`.menu-btn` visible solo por debajo de ese breakpoint. Al terminar, no debe quedar ningún
comentario `TEMPORAL` en `chassis.scss`.

### El foco atrapado hay que escribirlo

El prototipo cierra con `Escape` y devuelve el foco al botón, pero **no contiene el foco** mientras
el panel está abierto. Es la única parte de esta historia que no se porta: se escribe.

Sin contención, quien navega con `Tab` sale del panel hacia el contenido de la página que está
detrás del velo —contenido que visualmente está tapado y no puede clickear. Es un fallo directo de
NFR-08.

Implementación mínima, sin librerías:

```js
function onKeydown(e) {
  if (e.key === 'Escape') { cerrar(); botonRef.value?.focus(); return }
  if (e.key !== 'Tab' || !abierto.value) return
  const foco = panelRef.value.querySelectorAll('a[href], button:not([disabled])')
  if (!foco.length) return
  const primero = foco[0], ultimo = foco[foco.length - 1]
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
}
```

El mismo patrón se reusa en la historia 5.3 para el lightbox del certificado. Si te queda limpio,
vale extraerlo a un composable `useFocusTrap`; si no, duplicarlo dos veces es aceptable.

### No dejes el body bloqueado

`document.body.style.overflow = 'hidden'` es fácil de poner y fácil de olvidar. Dos escenarios
donde queda bloqueado y el visitante se encuentra con una página que no scrollea:

1. Se navega con el menú abierto por una vía que no pasa por el `click` del enlace.
2. El componente se desmonta con el menú abierto (pasa en el HMR de desarrollo).

Restauralo en el cierre **y** en `onUnmounted`. Y usá `''`, no `'auto'`, para devolver el control al
CSS en lugar de imponer un valor.

### El escalonado de los ítems

FR-03 pide entrada escalonada. Los estilos del sistema lo resuelven con un retardo por ítem; no
hace falta JavaScript. Verificá que con `prefers-reduced-motion: reduce` los tres enlaces estén
visibles de inmediato: un ítem que depende de su animación para aparecer es un ítem inalcanzable.

### El indicador no viaja al menú mobile

El estado activo en el panel se marca con `.mobile-link.is-active::before`, que ya está en el CSS
del sistema. **No lleves el `.nav-indicator` al menú mobile.**

### Guardarraíles

- ❌ **No** omitas ninguna de las tres reglas de `z-index`.
- ❌ **No** pongas el `.nav-scrim` dentro del `<header>`.
- ❌ **No** dejes el marcador `TEMPORAL` de la historia 1.5 sin revertir.
- ❌ **No** te conformes con verificar en la Home. Son las cuatro vistas.
- ❌ **No** confíes en mirar la pantalla para saber si el panel recibe los clics. Usá `elementFromPoint`.
- ❌ **No** uses `pointer-events: none` en el velo como atajo: el velo tiene que recibir el clic
  para cerrar el menú. El problema era el orden, no que fuera clickeable.
- ❌ **No** instales `focus-trap`, `a11y-dialog` ni un componente de modal de terceros.
- ❌ **No** uses `<dialog>`: cambia el contexto de apilamiento y el top layer, y no es lo que el
  sistema verificado usa.
- ❌ **No** te olvides de restaurar `body.style.overflow`.
- ❌ **No** animes `width`, `height` ni `left` del panel.

### Comandos de verificación

```bash
# Las tres reglas de apilamiento están
grep -n "z-index" src/styles/chassis.scss

# No quedan marcadores temporales
grep -rn "TEMPORAL" src/styles/
```

En el navegador, a 390 px, **en cada vista**:

```js
// Abrir el menú, después:
const link = document.querySelector('.mobile-link')
const r = link.getBoundingClientRect()
document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
// Tiene que devolver el <a class="mobile-link">, NO el .nav-scrim

// Apilamiento efectivo
['.nav-scrim', '.site-header', '.mobile-menu']
  .map(s => [s, getComputedStyle(document.querySelector(s)).zIndex])
// [['.nav-scrim','90'], ['.site-header','100'], ['.mobile-menu','105']]

// El body está bloqueado con el menú abierto, y libre al cerrarlo
document.body.style.overflow
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable, **en las cuatro vistas**: abrir,
navegar por un enlace, cerrar por `Escape`, cerrar por tap fuera; la prueba de `elementFromPoint`
devuelve el enlace; el `z-index` efectivo es 90/100/105; el foco queda contenido con `Tab`; el
`body` recupera el scroll; en 1280 px el botón no se ve y el `.nav` sí; con movimiento reducido los
tres enlaces son visibles de inmediato; consola sin errores.

### Project Structure Notes

```
src/components/layout/AppNav.vue   MODIFICADO — panel, velo, botón y comportamiento
src/styles/chassis.scss            MODIFICADO — menú mobile, velo, z-index; se revierte el TEMPORAL
src/composables/useFocusTrap.js    NUEVO (opcional) — si se extrae para reusar en la 5.3
```

### References

- Historia y criterios: [Source: epics.md#Story 2.4]
- FR-03: [Source: prd.md#7.1 Navegación y estructura]
- NFR-08/11: [Source: prd.md#8.2 Accesibilidad]
- Contrato de apilamiento del menú mobile: [Source: architecture.md#Implementation Patterns & Consistency Rules]
- El defecto del velo y su medición: [Source: ui-handoff.md#Menú mobile — corregido]
- Excepción a revertir: historia 1.5, §El nav no se puede esconder todavía
- Markup fuente: `public/ui-generated/_system/chasis.html`
- Comportamiento fuente: `public/ui-generated/_system/system.js`, sección "Menu movil"
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 291–348 y 481–496

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
