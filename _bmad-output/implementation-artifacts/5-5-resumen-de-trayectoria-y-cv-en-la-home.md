# Story 5.5: Resumen de trayectoria y CV en la Home

Status: ready-for-dev

## Story

As a reclutador con 60 segundos,
I want ver la experiencia sin salir de la portada,
so that no tenga que navegar para saber dónde trabaja.

## Acceptance Criteria

**AC1 — Resumen en la Home**

**Given** la Home
**When** se renderiza después de la sección de habilidades
**Then** aparece un resumen de la trayectoria alimentado por `src/content/timeline.js` (FR-08)
**And** incluye un enlace a la vista Sobre mí para el detalle completo

**AC2 — El CV se descarga desde Sobre mí**

**Given** la vista Sobre mí
**When** se renderiza
**Then** ofrece la descarga del CV en PDF usando el mismo composable que el hero (FR-20)

**AC3 — Un solo componente de encabezado**

**Given** los encabezados de sección de las tres vistas
**When** se inspeccionan
**Then** todos usan el componente `SectionHeading` con un prop de nivel
**And** `MainTitle.vue`, `SubTitle.vue`, `SectionTitle.vue` y `ProjectTitle.vue` quedan eliminados (NFR-17)

## Tasks / Subtasks

- [ ] **Tarea 1 — Componente `SectionHeading.vue`** (AC: #3)
  - [ ] Prop `level`: `1` | `2` | `3`, default `2` — determina si renderiza `h1`, `h2` o `h3`
  - [ ] Prop `title` (String) y slot opcional para la bajada
  - [ ] Clases `.section-head`, `.section-title` y `.section-lede`, promovidas en la historia 3.1
  - [ ] Soportar el `.dot` en acento que el CSS del sistema estiliza (ver §El punto en acento)

- [ ] **Tarea 2 — Reemplazar los cuatro componentes de título** (AC: #3)
  - [ ] Sustituir todos los usos de `MainTitle`, `SubTitle`, `SectionTitle` y `ProjectTitle` por `SectionHeading`
  - [ ] Borrar los cuatro archivos
  - [ ] Borrar `src/styles/sass/modules/_texts.scss` y su `@import` en `main.scss`
  - [ ] Verificar por `grep` que nada los referencia

- [ ] **Tarea 3 — Resumen de trayectoria en la Home** (AC: #1)
  - [ ] Sección después de habilidades, con `SectionHeading` y los hitos de tipo `work` de `timeline.js`
  - [ ] Reutilizar `TimelineItem` de la historia 5.2, sin duplicar markup (ver §Reutilizar `TimelineItem`, no clonarlo)
  - [ ] `.section-foot` con un `.link-arrow` hacia `/about`
  - [ ] `v-reveal` en la sección

- [ ] **Tarea 4 — CV en Sobre mí** (AC: #2)
  - [ ] `AppButton` que dispara `useDownloadPdf`, el mismo composable que el hero usa desde la historia 3.2
  - [ ] Etiqueta por i18n
  - [ ] Verificar que el archivo descargado abre

- [ ] **Tarea 5 — Limpiar lo que queda** (AC: #3)
  - [ ] Revisar `src/styles/sass/modules/_pages.scss`: con la Home y Sobre mí reescritas, la mayor parte quedó muerta
  - [ ] Borrar lo que no se usa; si queda vacío, borrar el archivo y su `@import`
  - [ ] Si `main.scss` queda sin ningún `@import`, borrar `src/styles/sass/` completa (ver §El final de `styles/sass/`)

- [ ] **Tarea 6 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] La Home muestra el resumen y el enlace lleva a `/about`
  - [ ] El CV se descarga desde las dos vistas y el archivo abre
  - [ ] Una sola `h1` por vista, en las cuatro
  - [ ] Comparar la firma del DOM de un `TimelineItem` en la Home contra Sobre mí
  - [ ] Verificar en 390 px y 1280 px en los tres estados de tema

## Dev Notes

Esta historia cierra la Épica 5 y completa la cuarta sección de la Home. Sirve directo a J1: el reclutador
ve dónde trabaja Marcelo sin navegar.

Además hace la consolidación que la UX spec identifica como causa principal del problema P3: *"`MainTitle`,
`SubTitle`, `SectionTitle` y `ProjectTitle` se unifican en `SectionHeading` con un prop de nivel. Hoy son
cuatro componentes que hacen lo mismo con estilos distintos, y son la causa principal de la jerarquía
plana."*
[Source: ux-design-specification.md#5 Estrategia de componentes]

### Cuatro componentes que hacen lo mismo

`src/components/texts/` tiene hoy `MainTitle.vue`, `SubTitle.vue`, `SectionTitle.vue` y
`ProjectTitle.vue`. Los cuatro renderizan un título con estilos distintos.

El resultado práctico es que no hay jerarquía tipográfica: cada vista elige el componente que "se ve
bien" en lugar del que corresponde al nivel semántico. De ahí que todo pese lo mismo.

`SectionHeading` con un prop de nivel resuelve las dos cosas: un solo lugar donde vive el estilo, y el
nivel del encabezado explícito en el llamado. Es NFR-17 aplicado al caso más flagrante del proyecto.

**Cuidado con el nivel semántico:** cada vista tiene exactamente una `h1` (NFR-09). En la Home la `h1` es
el nombre en el hero, así que **todas** las secciones de la Home usan `level="2"`. En Proyectos y en Sobre
mí la `h1` es el título de la vista.

### El punto en acento

`home/page.css` trae `.section-title .dot { color: var(--color-accent) }`. Es el punto final del título en
color de acento — un gesto chico y repetido que forma parte de la identidad.

Soportalo en `SectionHeading`: o con un slot que permita `<span class="dot">.</span>`, o con una prop
booleana. Lo que no hay que hacer es escribir el punto a mano en cada llamado, ni omitirlo.

Notá que `sobre-mi/page.css` también define `.dot`. Es la misma clase; ya está unificada.

### Reutilizar `TimelineItem`, no clonarlo

El resumen de la Home muestra hitos de trayectoria. La historia 5.2 ya construyó `TimelineItem` para eso.

**Usalo.** La Home le pasa solo los hitos de tipo `work`; Sobre mí le pasa todos. La diferencia se resuelve
filtrando en la vista, igual que `ProjectGrid` en la historia 4.7 y `SkillGrid` en la 5.4.

Es el tercer caso del mismo patrón en esta épica y la anterior. Si a esta altura el instinto sigue siendo
crear un `TimelineSummary.vue` aparte, vale la pena releer la regla: **se construye el componente antes que
la pantalla, y la pantalla lo consume.**

Si el resumen necesita una presentación más compacta, eso es una `variant` en `TimelineItem`, no un
componente nuevo.

### El final de `styles/sass/`

La historia 1.2 tomó una decisión explícita: no borrar `src/styles/sass/modules/` todavía, porque estilaba
los componentes viejos, y convertirlos a tokens en su lugar. Dejó esta tabla:

| Parcial | Muere en |
|---|---|
| `_navbar.scss` | Historia 1.5 ✅ |
| `_buttons.scss` | Historia 3.2 ✅ |
| `_texts.scss` | **Historia 5.5 — esta** |
| `_pages.scss` | **Historia 5.5 — esta** |

Con esta historia, `src/styles/sass/` **desaparece del proyecto**, y el árbol objetivo de la arquitectura
queda cumplido.

Antes de borrar `_pages.scss`, revisá qué queda vivo: la Home, Proyectos y Sobre mí ya se reescribieron,
así que debería estar casi todo muerto. Si algo sigue en uso, muévelo al `<style scoped>` del componente que
lo necesita o a `sections.scss` si es compartido. **No** dejes el archivo "por si acaso": CSS muerto es
CSS que alguien va a modificar por error.

Cuando `main.scss` quede sin `@import`, borralo y quitá su import de `src/main.js`.

### El CV en dos lugares, un solo composable

FR-20 pide el CV desde el hero y desde Sobre mí. Los dos usan `useDownloadPdf` de la historia 3.2 — no
dupliques la lógica de descarga ni el nombre del archivo literal en dos lados.

Si el nombre del archivo aparece en dos llamados, es candidato a constante en el composable.

Y verificá que el PDF descargado **abra**, no solo que el clic no falle. La historia 3.2 ya lo advierte: el
nombre tiene espacios y la codificación es frágil.

### Guardarraíles

- ❌ **No** dejes ninguno de los cuatro componentes de título.
- ❌ **No** crees un componente nuevo para el resumen de trayectoria.
- ❌ **No** dupliques el markup de `TimelineItem`.
- ❌ **No** uses `level="1"` en las secciones de la Home: la `h1` es el hero.
- ❌ **No** escribas el punto en acento a mano en cada título.
- ❌ **No** dejes `_pages.scss` "por si acaso".
- ❌ **No** dupliques la lógica de descarga del CV.
- ❌ **No** filtres los hitos dentro de `TimelineItem` ni de `TimelineSection`.
- ❌ **No** agregues la sección de contacto: es la historia 6.2, y es la última de la Home.
- ❌ **No** dejes más de una `h1` por vista.

### Comandos de verificación

```bash
# Los cuatro componentes de título desaparecieron
grep -rn "MainTitle\|SubTitle\|SectionTitle\|ProjectTitle" src/

# styles/sass/ ya no existe
ls src/styles/
grep -n "sass/main" src/main.js

# Un solo componente de encabezado
find src/components -iname "*title*.vue" -o -iname "*heading*.vue"
```

En el navegador, en cada una de las cuatro vistas:

```js
// Una sola h1 por vista
document.querySelectorAll('h1').length            // 1

// Los niveles de encabezado son coherentes
[...document.querySelectorAll('h1, h2, h3')].map(h => [h.tagName, h.textContent.trim().slice(0, 30)])

// Firma del DOM de un hito: correr en Home y en Sobre mí y comparar
[...document.querySelector('.milestone').querySelectorAll('*')]
  .map(n => `${n.tagName}.${n.className}`).join('|')
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; el resumen aparece en
la Home con el enlace a `/about`; el CV **se descarga y abre** desde las dos vistas; una sola `h1` por
vista en las cuatro; jerarquía de encabezados coherente; **la firma del DOM del hito coincide entre Home y
Sobre mí**; `src/styles/sass/` eliminada sin regresión visual; verificado en 390 px y 1280 px en los tres
temas; consola sin errores.

### Project Structure Notes

```
src/components/ui/SectionHeading.vue         NUEVO — reemplaza los cuatro de título
src/views/HomeView.vue                        MODIFICADO — resumen de trayectoria
src/views/AboutView.vue                       MODIFICADO — descarga del CV
src/components/texts/MainTitle.vue            ELIMINADO
src/components/texts/SubTitle.vue             ELIMINADO
src/components/texts/SectionTitle.vue         ELIMINADO
src/components/texts/ProjectTitle.vue         ELIMINADO
src/styles/sass/modules/_texts.scss           ELIMINADO
src/styles/sass/modules/_pages.scss           ELIMINADO
src/styles/sass/main.scss                     ELIMINADO
src/styles/sass/                              ELIMINADO
src/main.js                                   MODIFICADO — se quita el import de sass/main.scss
src/locales/{es,en}.json                      MODIFICADO — títulos de sección, etiqueta del CV
```

`src/components/texts/` queda vacía y se puede borrar. Con esta historia el árbol de estilos coincide con
el objetivo de la arquitectura: `tokens.css`, `fonts.scss`, `base.scss`, `animations.scss`, `chassis.scss`,
`sections.scss`, `components.scss`.

### References

- Historia y criterios: [Source: epics.md#Story 5.5]
- FR-08, FR-20: [Source: prd.md#7.2 y #7.4]
- P3, jerarquía plana: [Source: prd.md#2.2]
- NFR-09/17: [Source: prd.md#8.2 y #8.4]
- Consolidación de los cuatro títulos: [Source: ux-design-specification.md#5]
- Tabla de muerte de los parciales SASS: historia 1.2, §Por qué los módulos SASS no se borran todavía
- Árbol objetivo: [Source: architecture.md#Project Structure & Boundaries]
- Regla de construir el componente antes que la pantalla: [Source: architecture.md#Enforcement Guidelines]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
