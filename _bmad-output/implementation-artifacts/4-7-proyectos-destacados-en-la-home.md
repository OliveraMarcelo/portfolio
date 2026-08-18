# Story 4.7: Proyectos destacados en la Home

Status: done

## Story

As a reclutador que no va a recorrer todo el sitio,
I want ver los mejores proyectos ya en la portada,
so that me alcance con una pantalla para formarme una idea.

## Acceptance Criteria

**AC1 — Máximo tres, los marcados**

**Given** la Home
**When** se renderiza la sección de proyectos
**Then** muestra como máximo tres proyectos, los marcados con `featured` en el módulo de contenido (FR-08)
**And** usa el mismo componente `ProjectCard` que `/projects`, sin ninguna variante duplicada

**AC2 — Markup idéntico al de la vista de Proyectos**

**Given** las cards de la Home y las de `/projects`
**When** se comparan sus clases y su markup
**Then** son idénticos: la diferencia se resuelve por props, no clonando el componente (NFR-17)

**AC3 — Revelado escalonado**

**Given** la sección de destacados
**When** entra en viewport
**Then** las cards se revelan de forma escalonada con `v-reveal`

**AC4 — Camino a la vista completa**

**Given** la sección
**When** se busca el enlace a la vista completa
**Then** existe una llamada a la acción hacia `/projects`

## Tasks / Subtasks

- [x] **Tarea 1 — Sección de destacados en la Home** (AC: #1, #4)
  - [x] En `HomeView.vue`, una `<section class="section">` con `.section-head` (título y bajada), la grilla, y `.section-foot` con el enlace
  - [x] `<ProjectGrid :items="destacados" />` donde `destacados = projects.filter(p => p.featured).slice(0, 3)`
  - [x] El enlace usa `.link-arrow` con el ícono `i-arrow`, primitiva promovida en la historia 3.1
  - [x] Títulos y etiquetas por i18n

- [x] **Tarea 2 — El `slice` es una garantía, no una redundancia** (AC: #1)
  - [x] `.slice(0, 3)` incluso si hoy hay exactamente tres proyectos (ver §Por qué el `slice` va igual)

- [x] **Tarea 3 — Revelado escalonado** (AC: #3)
  - [x] `v-reveal` en cada card, con un retardo creciente
  - [x] Resolverlo con la custom property `--d` que el CSS de la card ya consume (ver §El escalonado usa `--d`)
  - [x] Con movimiento reducido, las tres visibles de inmediato

- [x] **Tarea 4 — Limpiar el markup viejo** (AC: #2)
  - [x] Eliminar de `HomeView.vue` cualquier resto de la sección de proyectos anterior
  - [x] Confirmar que no queda ningún array local de proyectos
  - [x] Borrar de `_pages.scss` las reglas de la sección de proyectos de la Home que queden muertas

- [x] **Tarea 5 — Verificar la identidad del markup** (AC: #2)
  - [x] Comparar la firma del DOM de una card en la Home contra la misma card en `/projects` (ver §Comandos de verificación)
  - [x] Tienen que coincidir exactamente

- [x] **Tarea 6 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] La Home muestra tres cards, con el mismo aspecto que en `/projects`
  - [x] El revelado escalonado se ve
  - [x] El enlace lleva a `/projects`
  - [x] Verificar en 390 px y 1280 px
  - [x] Confirmar que la transición al detalle funciona **también desde la Home** (historia 4.6)
  - [x] Con movimiento reducido, las tres cards visibles de entrada

## Dev Notes

Con esta historia se cierra la Épica 4 y la Home gana su segunda sección. FR-08 define el orden completo
—hero → destacados → habilidades → trayectoria → contacto— y acá se agrega la segunda; las tres restantes
llegan en las historias 5.4, 5.5 y 6.2.

Sirve directo al recorrido J1: el reclutador con 60 segundos ve dos o tres proyectos con resultado
visible sin salir de la portada.

### Por qué el `slice` va igual

Hoy `projects.filter(p => p.featured)` devuelve exactamente tres, así que el `.slice(0, 3)` parece
redundante. No lo es.

FR-08 dice "máximo 3". El día que Marcelo agregue un cuarto proyecto y lo marque `featured` sin pensarlo,
la Home mostraría cuatro y el criterio de aceptación quedaría violado sin que nadie toque el código de la
vista. El `slice` convierte el requisito en una garantía estructural en lugar de una convención sobre el
contenido.

Es barato y hace imposible el error. Ponelo.

### El markup tiene que ser idéntico, y eso se mide

AC2 es el criterio más importante de esta historia, y viene directo de un problema real de este proyecto.

Cuando las cuatro pantallas del prototipo se generaron sin un vocabulario común, la Home y Proyectos
terminaron con **dos implementaciones distintas de la misma card** —`.project-card` contra `.card`— y
4019 líneas de CSS con solo 131 líneas idénticas entre las cuatro. Cada defecto del chasis había que
arreglarlo cuatro veces.

La historia 4.2 resolvió el vocabulario. Esta historia verifica que la solución **se sostenga**: que la
Home consuma el mismo componente y no una copia adaptada.

La forma de verificarlo no es leer el código, es medir la firma del DOM de las dos cards y comparar. Si
difieren, alguien clonó.

### El escalonado usa `--d`

El CSS de la card, portado en la historia 4.2, consume una custom property para el retardo de su
animación de entrada:

```css
.project-card.is-visible {
  animation: card-in var(--dur-slow) var(--ease-out) var(--d, 0ms) backwards;
}
```

Así que el escalonado se resuelve pasando `--d` desde el template:

```vue
<ProjectCard
  v-for="(p, i) in destacados"
  :key="p.slug"
  :project="p"
  v-reveal
  :style="{ '--d': `${i * 70}ms` }"
/>
```

`70ms` es el token `--stagger`. Usá el token, no el literal, si el CSS lo permite.

**No** resuelvas el escalonado con `setTimeout` ni con clases numeradas. Y no lo resuelvas dentro de
`ProjectGrid`: la grilla no decide presentación, solo dispone.

### `ProjectGrid` sirve a las dos vistas sin cambios

La historia 4.3 dejó `ProjectGrid` recibiendo `items` y sin filtrar. Esta historia es la prueba de que
esa frontera estaba bien puesta: la Home pasa tres, Proyectos pasa todos, y la grilla no necesita saber
la diferencia.

Si al implementar sentís que hace falta agregarle una prop de modo a `ProjectGrid`, es señal de que
estás poniendo en la grilla una decisión que le corresponde a la vista.

### La misma grilla, el mismo `min()`

La historia 4.3 usa `grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr))`, que es la
versión correcta. El CSS de la Home en el prototipo usa la versión con parche —`minmax(320px, 1fr)` más
una media query a 420 px—.

**Usá la de la 4.3 en las dos vistas.** Un solo vocabulario y una sola implementación.

### La sección alterna el fondo

`.section-alt` da fondo de superficie y bordes arriba y abajo. En la Home, alternar `.section` y
`.section-alt` entre secciones consecutivas es lo que separa visualmente los bloques sin necesidad de
divisores.

Notá que `home/page.css` trae `.section-alt .project-card { background: var(--color-bg) }`: cuando la
sección tiene fondo de superficie, la card usa el fondo base para seguir contrastando. Portá esa regla, va
en `sections.scss`.

### Verificá la transición desde la Home, no solo desde Proyectos

La historia 4.6 puso el `view-transition-name` en `ProjectCard`, así que la transición al detalle funciona
desde cualquier lugar donde esa card se use. Pero eso es la teoría: probalo abriendo un proyecto **desde
la Home**.

Es el mismo tipo de verificación que AC6 de la historia 2.4 pide para el menú mobile, y por la misma
razón: lo que funciona en una vista no está verificado en las demás.

### Guardarraíles

- ❌ **No** crees un componente de card para la Home. Es el mismo `ProjectCard`.
- ❌ **No** le agregues props de modo a `ProjectGrid`.
- ❌ **No** filtres dentro de la grilla ni dentro de la card.
- ❌ **No** omitas el `.slice(0, 3)`.
- ❌ **No** uses la versión con parche de la grilla. Usá la de la historia 4.3 en las dos vistas.
- ❌ **No** resuelvas el escalonado con `setTimeout` ni con clases numeradas.
- ❌ **No** dupliques los estilos de la card en el `<style scoped>` de `HomeView`.
- ❌ **No** dejes ningún array local de proyectos en la vista.
- ❌ **No** toques las otras secciones de la Home: son las historias 5.4, 5.5 y 6.2.
- ❌ **No** des la historia por terminada sin abrir un detalle desde la Home.

### Comandos de verificación

```bash
# Ningún array local de proyectos
grep -n "\[\s*{\s*slug" src/views/HomeView.vue

# Un solo componente de card
find src/components -name "*Card*.vue"

# Sin estilos de card duplicados en la vista
grep -n "project-card\|project-media" src/views/HomeView.vue
```

En el navegador — **la prueba central de AC2**, comparando la Home contra `/projects`:

```js
// Firma del DOM de la primera card: correla en las dos vistas y compará el resultado
const firma = (el) => [...el.querySelectorAll('*')]
  .map(n => `${n.tagName}.${n.className}`).join('|')
firma(document.querySelector('.project-card'))
```

```js
// Tres cards en la Home, no más
document.querySelectorAll('.project-card').length      // 3

// El escalonado tiene retardos distintos
[...document.querySelectorAll('.project-card')].map(c => getComputedStyle(c).animationDelay)

// El enlace a la vista completa existe
document.querySelector('.section-foot a').getAttribute('href')
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; tres cards en la
Home; **la firma del DOM de la card coincide entre la Home y `/projects`**; el escalonado se ve y tiene
retardos distintos; el enlace lleva a `/projects`; la transición al detalle funciona **desde la Home**;
verificado en 390 px y 1280 px; con movimiento reducido las tres visibles de entrada; consola sin errores.

### Project Structure Notes

```
src/views/HomeView.vue                 MODIFICADO — sección de destacados
src/styles/sections.scss               MODIFICADO — .section-alt .project-card
src/locales/{es,en}.json               MODIFICADO — título, bajada y enlace de la sección
src/styles/sass/modules/_pages.scss    MODIFICADO — se borran reglas muertas
```

Ningún componente nuevo: es la demostración de que los de las historias 4.2 y 4.3 se reutilizan tal cual.

### References

- Historia y criterios: [Source: epics.md#Story 4.7]
- FR-08: [Source: prd.md#7.2 Home]
- J1, escaneo de 60 segundos: [Source: prd.md#4.2]
- NFR-17, un componente canónico: [Source: prd.md#8.4]
- Regla de construir el componente antes que la pantalla: [Source: architecture.md#Enforcement Guidelines]
- Divergencia medida del prototipo: [Source: ui-handoff.md#Design system compartido]
- A2, scroll reveal escalonado: [Source: ux-design-specification.md#4.3]
- Estilos fuente: `public/ui-generated/home/page.css` líneas 284–297 y 316

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 —** tres cards en la Home, filtradas por `featured` y con `.slice(0, 3)`.

**AC2 — la firma del DOM**, comparando una card de la Home contra la misma card en `/projects`: de las
17 líneas de la firma difieren **dos**, y las dos son esperadas:

```
home: ARTICLE.is-featured.project-card.reveal | proyectos: ARTICLE.is-featured.is-visible.project-card.reveal
home: H3.project-title                        | proyectos: H2.project-title
```

`is-visible` es estado de revelado en tiempo de ejecución, no markup. El nivel de encabezado sale de la
prop `headingLevel` y **tiene que** diferir: en la Home la card cuelga del `h2` de "Proyectos" y en
`/projects` del `h1` de la vista (NFR-09). Ninguna clase difiere. Nadie clonó el componente.

**AC3 —** los retardos medidos en las tres cards: `""`, `70ms`, `140ms`.

**AC4 —** `.section-foot` con un `.link-arrow` a `/projects`.

### El `slice` es una garantía, no una redundancia

Hoy `featured` devuelve exactamente tres, así que `.slice(0, 3)` parece sobrar. FR-08 dice "máximo 3":
el día que se marque un cuarto proyecto sin pensarlo, la Home mostraría cuatro y el criterio quedaría
violado sin que nadie toque esta vista. Convierte el requisito en una garantía estructural en lugar de
una convención sobre el contenido.

### `ProjectGrid` sirvió a las dos vistas sin un solo cambio

La Home le pasa tres y Proyectos el catálogo completo. No hizo falta agregarle ninguna prop de modo,
que era la señal de que la frontera estaba mal puesta.

### Una advertencia sobre las capturas de página completa

La primera captura `fullPage` de `/projects` mostraba el indicador del nav bajo "Inicio" estando en
Proyectos, y los capítulos del detalle en blanco. Ninguna de las dos cosas era real: `fullPage`
redimensiona el viewport para que entre la página entera, y eso **redispara el reposicionamiento del
indicador y deja fuera de vista lo que el `IntersectionObserver` todavía no reveló**. Medido en el DOM,
`aria-current` estaba en el enlace correcto y los capítulos pasan de `opacity 0` a `1` al scrollear.

Las capturas de página completa sirven para mirar composición, no para verificar estado.

### File List
