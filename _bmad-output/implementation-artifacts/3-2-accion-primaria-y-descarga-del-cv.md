# Story 3.2: Acción primaria y descarga del CV

Status: ready-for-dev

## Story

As a reclutador,
I want un camino evidente para seguir y llevarme el CV,
so that no tenga que buscar cómo avanzar.

## Acceptance Criteria

**AC1 — Exactamente una acción primaria**

**Given** el hero
**When** se inspeccionan sus llamadas a la acción
**Then** hay exactamente una acción primaria ("Ver proyectos") y una secundaria ("Descargar CV") (FR-06)
**And** usan el componente canónico `AppButton` con las variantes `.btn-primary` y `.btn-ghost`

**AC2 — La primaria navega**

**Given** el visitante que toca la acción primaria
**When** se activa
**Then** navega a `/projects`

**AC3 — El CV se descarga**

**Given** el visitante que toca "Descargar CV"
**When** se activa
**Then** se descarga el PDF del CV desde `public/` (FR-20)
**And** el composable responsable es `src/composables/useDownloadPdf.js`, migrado desde el actual `.vue`

**AC4 — Alcanzables y con área suficiente**

**Given** ambos botones
**When** se miden sus áreas táctiles
**Then** ninguna es menor a 44×44 px (NFR-11)
**And** ambos son alcanzables por teclado con foco visible (NFR-08)

**AC5 — Micro-interacción de presión**

**Given** el visitante que presiona un botón
**When** ocurre el `:active`
**Then** el botón responde con `scale(0.97)` en `--dur-instant` (A7)

## Tasks / Subtasks

- [ ] **Tarea 1 — Componente `AppButton.vue`** (AC: #1, #5)
  - [ ] Prop `variant`: `'primary'` | `'ghost'`, default `'primary'`
  - [ ] Prop `to` (opcional): si viene, renderiza un `<RouterLink>`; si no, un `<button>` (ver §Un botón que a veces es un enlace)
  - [ ] Prop `href` (opcional): para enlaces externos, con `target="_blank"` y `rel="noopener noreferrer"`
  - [ ] Clases: `.btn` más `.btn-primary` o `.btn-ghost`, ya portadas en la historia 3.1
  - [ ] Slot para el contenido, y un slot opcional para el ícono

- [ ] **Tarea 2 — Migrar el composable del CV** (AC: #3)
  - [ ] Renombrar `src/composables/useDownloadPdf.vue` a `useDownloadPdf.js` y quitarle las etiquetas `<script>`
  - [ ] Actualizar el import de `HomeView.vue`
  - [ ] Verificar que el nombre del archivo PDF siga coincidiendo con el de `public/` (ver §El nombre del PDF tiene espacios)

- [ ] **Tarea 3 — Montar las acciones en el hero** (AC: #1, #2, #3)
  - [ ] En `HeroSection.vue`, dentro de `.hero-actions`: un `AppButton` primario con `to="/projects"` y uno `ghost` que dispara la descarga
  - [ ] Etiquetas por i18n
  - [ ] Exactamente dos botones, ni uno más

- [ ] **Tarea 4 — Eliminar `ButtonCustom.vue`** (AC: #1)
  - [ ] Reemplazar todos sus usos por `AppButton`
  - [ ] Borrar `src/components/buttons/ButtonCustom.vue`
  - [ ] Borrar `src/styles/sass/modules/_buttons.scss` y su `@import` en `main.scss`
  - [ ] Verificar por `grep` que nada los referencia

- [ ] **Tarea 5 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] La primaria navega a `/projects`
  - [ ] La secundaria descarga el PDF, y el archivo abre correctamente
  - [ ] Medir las áreas táctiles de los dos botones
  - [ ] Recorrer con `Tab` y confirmar foco visible en ambos
  - [ ] Confirmar el `scale(0.97)` al presionar
  - [ ] Verificar en 390 px que los dos botones caben sin desbordar

## Dev Notes

FR-06 es explícito y es una decisión de diseño, no una sugerencia: **exactamente una** acción
primaria y **una** secundaria. El PRD identifica la jerarquía plana como el problema P3 —"todo pesa
lo mismo: el nombre, las skills, los proyectos"— y esta historia es donde se corrige en el hero.

Si agregás un tercer botón, aunque parezca útil, rompés el criterio de aceptación.

### Un botón que a veces es un enlace

Las dos acciones del hero son de naturaleza distinta: una navega, la otra ejecuta. Semánticamente,
lo que navega debe ser un `<a>` y lo que ejecuta un `<button>`. Que se vean igual es una decisión
visual; que sean el mismo elemento no.

`AppButton` resuelve esto con un componente y una prop, no con dos componentes:

```vue
<component :is="etiqueta" v-bind="atributos" :class="clases">
  <slot />
</component>
```

donde `etiqueta` es `RouterLink` si hay `to`, `'a'` si hay `href`, y `'button'` si no hay ninguno.

Esto es NFR-17 en acción: **un componente canónico por elemento, con las variantes resueltas por
props, nunca clonando el componente.** El proyecto tiene hoy cuatro componentes de título que hacen
lo mismo con estilos distintos; el botón no va a sumarse a esa lista.

### El nombre del PDF tiene espacios

El archivo en `public/` se llama literalmente `Marcelo Olivera - Curriculum Vitae.pdf`, con espacios.
El composable actual los codifica a mano en la llamada:

```js
useDownloadPdf('Marcelo%20Olivera%20-%20Curriculum%20Vitae.pdf')
```

Funciona, pero es frágil: si alguien renombra el archivo o "limpia" el `%20`, la descarga se rompe en
silencio —el navegador pide una URL que no existe y no pasa nada visible.

Al migrar el composable, dejá que él haga la codificación con `encodeURIComponent` y que quien lo
llama pase el nombre real. Y **verificá que el archivo descargado abra**, no solo que el clic no dé
error.

Nota de la historia 7.2: `TASKS.md` §5 pide actualizar el contenido del CV. Es trabajo de contenido,
ajeno a esta historia, pero conviene no publicar el rediseño con un CV desactualizado.

### `useDownloadPdf.vue` es un `.vue` que no es un componente

El archivo actual contiene solo un `<script>` que exporta una función. Vue lo procesa porque la
extensión lo manda al `vue-loader`, y funciona por casualidad. Es un composable: va en `.js`.

Es el mismo tipo de error que el `langStore.js` que la historia 1.7 eliminó — código que funciona
por accidente en lugar de por diseño.

### El área táctil de 44 px

`.btn` del sistema ya trae el `min-height` que garantiza los 44 px. Lo que hay que verificar es que
no lo pises con un `padding` menor en el `<style scoped>` del hero, y que en 390 px los dos botones
—que están en un `.hero-actions` con `flex-wrap: wrap`— no queden tan angostos que el ancho baje de
44 px.

### El `scale(0.97)` ya viene en `.btn`

A7 pide `scale(0.97)` al presionar en `--dur-instant`, y `.btn:active` del sistema ya lo declara.
No lo reimplementes en el componente. Solo verificá que se sienta al presionar y que con movimiento
reducido no ocurra.

### Guardarraíles

- ❌ **No** agregues un tercer botón al hero.
- ❌ **No** hagas dos componentes de botón. Uno, con props.
- ❌ **No** uses `<button>` para navegar ni `<a href="#">` con un `@click` que navega.
- ❌ **No** dejes `useDownloadPdf` como `.vue`.
- ❌ **No** hardcodees el `%20` en el nombre del archivo.
- ❌ **No** redefinas el `min-height` ni el `padding` de `.btn` en el scope del hero.
- ❌ **No** reimplementes el `:active`.
- ❌ **No** uses BEM (`.btn--primary`). El sistema usa `.btn-primary`.
- ❌ **No** agregues la animación de entrada del hero: es la 3.3.
- ❌ **No** agregues el indicador de scroll: es la 3.4.
- ❌ **No** implementes todavía los botones de las cards de proyecto: son las historias 4.2 y 4.5,
  que van a consumir este mismo `AppButton`.

### Comandos de verificación

```bash
# El composable ya no es .vue y nadie lo importa como tal
ls src/composables/
grep -rn "useDownloadPdf.vue" src/

# ButtonCustom desapareció
grep -rn "ButtonCustom" src/

# Sin BEM
grep -rn "btn--" src/
```

En el navegador:

```js
// Exactamente dos botones en el hero
document.querySelectorAll('.hero-actions .btn').length     // 2

// Uno primario y uno ghost
[...document.querySelectorAll('.hero-actions .btn')].map(b => b.className)

// Áreas táctiles
[...document.querySelectorAll('.hero-actions .btn')]
  .map(b => { const r = b.getBoundingClientRect(); return [r.width, r.height] })
// ambas dimensiones >= 44

// El primario es un <a>, el secundario un <button>
[...document.querySelectorAll('.hero-actions .btn')].map(b => b.tagName)
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; dos botones
exactos; la primaria navega; el PDF descargado **abre correctamente**; áreas táctiles ≥ 44×44 px en
390 px; foco visible por teclado en ambos; `scale(0.97)` perceptible al presionar; consola sin
errores.

### Project Structure Notes

```
src/components/ui/AppButton.vue          NUEVO — reemplaza ButtonCustom.vue
src/composables/useDownloadPdf.js        NUEVO — migrado desde .vue
src/composables/useDownloadPdf.vue       ELIMINADO
src/components/buttons/ButtonCustom.vue  ELIMINADO
src/styles/sass/modules/_buttons.scss    ELIMINADO
src/styles/sass/main.scss                MODIFICADO — se quita el @import de buttons
src/components/sections/HeroSection.vue   MODIFICADO — monta las dos acciones
src/views/HomeView.vue                    MODIFICADO — import del composable
src/locales/{es,en}.json                  MODIFICADO — etiquetas de los botones
```

`src/components/buttons/` queda vacía y se puede borrar.

### References

- Historia y criterios: [Source: epics.md#Story 3.2]
- FR-06, FR-20: [Source: prd.md#7.2 Home y #7.4 Sobre mí]
- P3, jerarquía plana: [Source: prd.md#2.2]
- NFR-08/11/17: [Source: prd.md#8.2 y #8.4]
- A7, micro-interacciones: [Source: ux-design-specification.md#4.3]
- Estrategia de componentes, `AppButton`: [Source: ux-design-specification.md#5]
- Primitivas fuente: `public/ui-generated/_system/components.css` líneas 350–418

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
