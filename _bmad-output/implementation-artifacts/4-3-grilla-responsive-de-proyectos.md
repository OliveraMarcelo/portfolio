# Story 4.3: Grilla responsive de proyectos

Status: ready-for-dev

## Story

As a visitante desde el teléfono,
I want que las cards se vean bien en mi pantalla,
so that no tenga que hacer zoom ni scrollear en horizontal.

## Acceptance Criteria

**AC1 — Una columna en mobile**

**Given** un viewport de 390 px
**When** se carga `/projects`
**Then** las cards se muestran en una columna (FR-11)

**AC2 — Dos columnas desde tablet**

**Given** un viewport de 768 px o mayor
**When** se carga `/projects`
**Then** las cards se muestran en dos columnas

**AC3 — Sin anchos por índice**

**Given** el CSS de la grilla
**When** se inspecciona
**Then** usa `grid-template-columns` por breakpoint
**And** ningún ancho se calcula a partir del índice del proyecto, eliminando el patrón 60/40 que hoy se rompe en mobile (P7)

**AC4 — Sin scroll horizontal en ningún ancho**

**Given** cualquiera de los cuatro anchos de verificación — 390, 768, 1280 y 1920
**When** se carga la vista
**Then** el cuerpo del documento no scrollea en horizontal

## Tasks / Subtasks

- [ ] **Tarea 1 — Componente `ProjectGrid.vue`** (AC: #1, #2, #3)
  - [ ] Prop `items` (Array, requerido): los proyectos a mostrar
  - [ ] Renderiza un `.project-grid` con un `ProjectCard` por elemento, con `:key="p.slug"`
  - [ ] Sin lógica de selección adentro: quién filtra es la vista (ver §La grilla no decide qué mostrar)

- [ ] **Tarea 2 — El CSS de la grilla** (AC: #1, #2, #3, #4)
  - [ ] Portar `.project-grid` de `proyectos/page.css` (líneas 111–116) a `src/styles/sections.scss`
  - [ ] `grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr))`
  - [ ] El `min(320px, 100%)` es lo que evita el desborde en pantallas angostas (ver §El `min()` no es opcional)
  - [ ] `gap: clamp(1.25rem, 2.5vw, 2rem)`

- [ ] **Tarea 3 — Reescribir `ProjectsView.vue`** (AC: #1, #2)
  - [ ] Encabezado de vista con `SectionHeading` —o con las primitivas `.section-head` de la historia 3.1— y la `h1` de la vista
  - [ ] `<ProjectGrid :items="projects" />` consumiendo el módulo de la historia 4.1
  - [ ] Textos por i18n
  - [ ] Eliminar el markup viejo y su `IntersectionObserver` local si lo tiene

- [ ] **Tarea 4 — Eliminar el componente viejo** (AC: #3)
  - [ ] Borrar `src/components/projects/ListProjects.vue`
  - [ ] Verificar por `grep` que nada lo referencia
  - [ ] Borrar de `src/styles/sass/modules/_pages.scss` las reglas de la vista de proyectos que queden muertas

- [ ] **Tarea 5 — Verificar los cuatro anchos** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] 390 px: una columna, sin scroll horizontal
  - [ ] 768 px: dos columnas
  - [ ] 1280 px y 1920 px: sin scroll horizontal, la grilla no se estira más allá del contenedor
  - [ ] Verificar en los tres estados de tema
  - [ ] Confirmar que las tres cards tienen la misma altura pese a que una no tiene botones

## Dev Notes

Esta historia corrige el problema **P7** del PRD: *"El ancho alternado 60/40 por índice se rompe en
mobile."* Es un defecto concreto del código actual, donde el ancho de cada proyecto se calcula según su
posición en la lista.

FR-11 lo dice sin rodeos: grilla responsive real, **sin anchos calculados por índice**.

### El `min()` no es opcional

```css
grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
```

La versión ingenua sería `minmax(320px, 1fr)`. El problema: en un viewport de 320 px con `padding-inline`
del contenedor, el espacio disponible es menor a 320 px. `minmax` con un mínimo fijo **no baja de ese
mínimo**, así que la columna mide 320 px en un contenedor de 280 px y el contenido desborda —
exactamente el scroll horizontal que AC4 prohíbe.

`min(320px, 100%)` dice "320 px, salvo que no haya tanto lugar, y entonces todo el ancho disponible".
Con eso la grilla nunca desborda.

Notá que el CSS de la Home usa `minmax(320px, 1fr)` con una media query extra a 420 px para forzar una
columna. Funciona, pero es la solución con parche. **Portá la versión de Proyectos, que es la correcta**,
y usá la misma en la Home cuando llegues a la historia 4.7.

### `auto-fit` ya da los dos breakpoints

Con `auto-fit` y un mínimo de 320 px:

- A 390 px de viewport, con el `--gutter` del contenedor, entra una sola columna.
- A 768 px entran dos.
- A 1280 px podrían entrar tres, pero `--container-max: 1200px` limita el ancho total, así que
  quedan dos anchas o tres según el `gap`.

AC1 y AC2 se cumplen sin escribir ninguna media query. Si al medir no se cumplen, ajustá el mínimo del
`minmax`, no agregues breakpoints manuales.

Comprobalo midiendo, no asumiendo: la cantidad de columnas efectiva se lee con
`getComputedStyle(grid).gridTemplateColumns`, que devuelve los anchos resueltos.

### La grilla no decide qué mostrar

`ProjectGrid` recibe `items` y los renderiza. **No** filtra, no ordena, no corta a tres.

Quién decide es la vista:

- `ProjectsView` pasa `projects` completo.
- `HomeView` pasa `projects.filter(p => p.featured)` (historia 4.7).

Esto es la frontera de componentes de la arquitectura: solo las vistas importan de `src/content/`; las
secciones reciben sus datos por props. Si la grilla importara el contenido y filtrara, tendrías que
agregarle una prop de modo para cada caso nuevo.
[Source: architecture.md#Architectural Boundaries]

### Las tres cards tienen que medir igual

`chat-tiempo-real` no tiene botones de acción, así que su contenido es más corto. En una grilla de dos
columnas, dos cards de distinta altura se ven mal.

`height: 100%` en `.project-card` —que el CSS de Proyectos trae— hace que la card ocupe toda la celda,
y el `flex: 1` en `.project-body` empuja las acciones al pie. Con las dos reglas, las alturas se igualan
solas.

Verificalo con los tres proyectos juntos, que es el único caso donde se nota.

### El encabezado de vista

`proyectos/page.css` define `.view-head` y `.view-title` para el encabezado de la vista. La Home usa
`.section-head` y `.section-title`, promovidas al sistema en la historia 3.1.

Son lo mismo con dos nombres — otra divergencia del prototipo. **Usá las primitivas de sección** que ya
están en `src/styles/sections.scss` y no portes `.view-head` / `.view-title`. Un solo vocabulario.

La `h1` de esta vista es el título de la sección, y tiene que ser la única (NFR-09).

### Guardarraíles

- ❌ **No** calcules anchos a partir del índice. Es el defecto P7.
- ❌ **No** uses `minmax(320px, 1fr)` sin el `min()`.
- ❌ **No** agregues media queries manuales si `auto-fit` alcanza.
- ❌ **No** portes `.view-head` ni `.view-title`: usá `.section-head` y `.section-title`.
- ❌ **No** hagas que `ProjectGrid` importe de `src/content/` ni filtre.
- ❌ **No** uses flexbox con anchos porcentuales. Es grid.
- ❌ **No** implementes el hover de la card: es la historia 4.4.
- ❌ **No** agregues el revelado escalonado todavía: llega con la 4.7, donde se usa `v-reveal`.
- ❌ **No** toques la Home: es la 4.7.
- ❌ **No** dejes más de una `h1` en la vista.

### Comandos de verificación

```bash
# Sin cálculo por índice
grep -rn "index % 2\|nth-child\|:nth-of-type" src/components/sections/ src/views/ProjectsView.vue

# ListProjects desapareció
grep -rn "ListProjects" src/

# Sin el vocabulario duplicado del encabezado
grep -rn "view-head\|view-title" src/
```

En el navegador, en cada ancho:

```js
const g = document.querySelector('.project-grid')

// Columnas efectivas: contá los valores devueltos
getComputedStyle(g).gridTemplateColumns
// 390px → un solo valor;  768px → dos valores

// Sin scroll horizontal
document.documentElement.scrollWidth <= window.innerWidth    // true

// Alturas iguales
[...document.querySelectorAll('.project-card')].map(c => c.getBoundingClientRect().height)
// los tres valores tienen que coincidir

// Una sola h1
document.querySelectorAll('h1').length     // 1
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; una columna a
390 px y dos a 768 px, medidas con `gridTemplateColumns`; sin scroll horizontal en 390/768/1280/1920;
las tres cards con la misma altura; una sola `h1`; verificado en los tres estados de tema; consola sin
errores.

### Project Structure Notes

```
src/components/sections/ProjectGrid.vue      NUEVO — reemplaza ListProjects.vue
src/views/ProjectsView.vue                    REESCRITO
src/styles/sections.scss                      MODIFICADO — .project-grid
src/components/projects/ListProjects.vue      ELIMINADO
src/styles/sass/modules/_pages.scss           MODIFICADO — se borran reglas muertas de la vista
```

`src/components/projects/` queda vacía tras esta historia y la 4.2, y se puede borrar.

### References

- Historia y criterios: [Source: epics.md#Story 4.3]
- FR-11: [Source: prd.md#7.3 Proyectos]
- P7, grid frágil: [Source: prd.md#2.2]
- NFR-09/12: [Source: prd.md#8.2 y #8.3]
- Fronteras de componentes: [Source: architecture.md#Architectural Boundaries]
- Responsive: [Source: ux-design-specification.md#8 Responsive]
- Estilos fuente: `public/ui-generated/proyectos/page.css` líneas 108–120
- Prompt de generación: [Source: ui-prompts/proyectos.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
