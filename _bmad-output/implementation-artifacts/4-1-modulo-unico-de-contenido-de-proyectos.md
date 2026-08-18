# Story 4.1: Módulo único de contenido de proyectos

Status: done

## Story

As a mantenedor,
I want definir cada proyecto en un solo lugar,
so that agregar uno nuevo no me obligue a tocar tres vistas y olvidarme del inglés.

## Acceptance Criteria

**AC1 — Forma del módulo**

**Given** el módulo `src/content/projects.js`
**When** se define
**Then** exporta un array ordenado donde cada proyecto tiene `slug`, `featured`, `stack`, `image`, `liveUrl`, `repoUrl` y una clave `i18n` con `title`, `summary`, `problem`, `solution` y `role` en ES y EN (FR-10)
**And** exporta una función `bySlug(slug)` que devuelve el proyecto o `null`

**AC2 — Contenido real, sin inventar**

**Given** los tres proyectos reales del PRD
**When** se cargan en el módulo
**Then** están `tienda-jedami`, `pokemon-game` y `chat-tiempo-real`, con contenido real y sin inventar ninguno

**AC3 — Ausencia explícita**

**Given** el proyecto de mensajería en tiempo real, que no tiene sitio en vivo ni repositorio público
**When** se define
**Then** declara `liveUrl: null` y `repoUrl: null` de forma explícita, nunca cadena vacía ni `undefined`

**AC4 — Ninguna vista duplica los datos**

**Given** las vistas `HomeView.vue` y `ProjectsView.vue`
**When** se revisan sus datos
**Then** ninguna define su propia lista de proyectos: ambas consumen el módulo

## Tasks / Subtasks

- [x] **Tarea 1 — Crear el módulo** (AC: #1)
  - [x] `src/content/projects.js` con el array `projects` y la función `bySlug`
  - [x] Campos en `camelCase` (`liveUrl`, no `live_url`)
  - [x] El orden del array **es** el orden de presentación: ninguna vista reordena
  - [x] `bySlug` devuelve `null` cuando no encuentra, no `undefined`

- [x] **Tarea 2 — Cargar los tres proyectos** (AC: #2, #3)
  - [x] Datos reales de la tabla del PRD §7.3 (ver §Los tres proyectos)
  - [x] `featured: true` en los que van a la Home (máximo 3, así que los tres califican)
  - [x] `liveUrl: null` y `repoUrl: null` en `chat-tiempo-real`

- [x] **Tarea 3 — Migrar los textos desde i18n** (AC: #1, #4)
  - [x] Mover a la clave `i18n` de cada proyecto los textos que hoy están en `src/i18n.js`: `onlineStoreTitle`, `onlineStoreDesc`, `pokemonGameTitle`, `pokemonGameDesc`, `realtimeMessagingTitle`, `realtimeMessagingDesc`
  - [x] Escribir además `problem`, `solution` y `role` de cada proyecto, en ES y EN (los necesita la historia 4.5)
  - [x] Borrar esas claves de `src/i18n.js` y de los locales

- [x] **Tarea 4 — Consumir desde las vistas** (AC: #4)
  - [x] `ProjectsView.vue` importa `projects` y lo recorre
  - [x] `HomeView.vue` importa `projects` y filtra por `featured`
  - [x] Eliminar de ambas cualquier array local de proyectos

- [x] **Tarea 5 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] `bySlug` con un slug válido y con uno inválido (ver §Comandos de verificación)
  - [x] Confirmar paridad ES/EN en los tres proyectos
  - [x] Confirmar que las dos vistas siguen mostrando los tres proyectos

## Dev Notes

**D4 en la arquitectura: fuente única de contenido en `src/content/`.** La duplicación de datos de
proyectos entre `HomeView` y `ProjectsView` es un defecto real que el PRD señala en §2.1; la vista de
detalle nueva la triplicaría.
[Source: architecture.md#Data Architecture, D4]

Esta historia no cambia nada visible. Es la que hace posibles las seis que siguen.

### Los textos traducibles van *dentro* del dato

La decisión clave, y la que se hace por el riesgo R3:

```js
{
  slug: 'tienda-jedami',
  featured: true,
  stack: ['Vue', 'Node.js'],
  image: 'jedami-preview',
  liveUrl: 'https://jedamiapp.com',
  repoUrl: 'https://github.com/OliveraMarcelo/tienda-jedami',
  i18n: {
    es: { title: '…', summary: '…', problem: '…', solution: '…', role: '…' },
    en: { title: '…', summary: '…', problem: '…', solution: '…', role: '…' },
  },
}
```

La alternativa —claves sueltas en el catálogo de i18n— es lo que hay hoy, y produce exactamente el
modo de falla que R3 describe: agregar un proyecto obliga a tocar tres archivos y es facilísimo
olvidarse del inglés. Con el texto dentro del dato, un proyecto sin traducción **se ve** al mirar el
objeto.

Esta es la razón por la que la historia 1.7 dejó los textos de contenido fuera de los locales:
`src/locales/` es para etiquetas de interfaz, `src/content/` para contenido. Ciclos de vida distintos.
[Source: architecture.md#Frontend Architecture, D13]

### Los tres proyectos

Del PRD §7.3, que es la fuente autorizada. **No inventes proyectos, ni descripciones, ni stacks.**

| slug | Proyecto | liveUrl | repoUrl | stack |
|---|---|---|---|---|
| `tienda-jedami` | Tienda Jedami — e-commerce con catálogo, carrito y gestión de pedidos | `https://jedamiapp.com` | `OliveraMarcelo/tienda-jedami` | Vue, Node.js |
| `pokemon-game` | Pokemon Game — adivinanza de siluetas con la PokéAPI | `https://pokemon-game-theta-gold.vercel.app` | `OliveraMarcelo/pokemon-game` | TypeScript, Vue |
| `chat-tiempo-real` | Mensajería en tiempo real con WebSockets | `null` | `null` | WebSockets, Node.js |

Los textos de `title` y `summary` de los tres ya existen en `src/i18n.js` en ambos idiomas: reusalos,
no los reescribas.

Los de `problem`, `solution` y `role` **no existen** y hay que escribirlos. Es contenido real sobre
proyectos reales; escribilos con lo que se sabe de cada uno y **marcá con un comentario** cualquier
campo donde te falte información, para que Marcelo lo complete. No inventes un rol ni un problema
resuelto que no puedas sostener.

### `null` explícito, y por qué importa

`chat-tiempo-real` no tiene demo en vivo ni repositorio público. El PRD lo consigna con guiones en
ambas columnas.

`liveUrl: null` es distinto de `liveUrl: ''` y de omitir el campo:

- `null` dice "este proyecto no tiene sitio en vivo". Es información.
- `''` es una URL vacía: `v-if="p.liveUrl"` la trata como falsy, pero un `<a :href="p.liveUrl">` genera
  un enlace roto si alguien se olvida del `v-if`.
- Omitirlo hace que `p.liveUrl` sea `undefined`, y ahí no distinguís entre "no tiene" y "me olvidé de
  cargarlo".

El patrón de la arquitectura es explícito: ausencia de valor es `null`, nunca `undefined` ni cadena
vacía. Las historias 4.2 y 4.5 tienen criterios de aceptación para renderizar bien ese caso.
[Source: architecture.md#Format Patterns]

### `image` es el nombre base, no la ruta

`image: 'jedami-preview'` y no `'@/assets/img/jedami-preview.webp'`. El módulo de contenido no debería
saber de rutas de build ni de extensiones; el componente resuelve el asset.

Esto además deja preparada la historia 7.1, donde el pipeline de imágenes se formaliza, sin tener que
volver a tocar el contenido.

**Ojo con esto:** en webpack, `require()` o `import` con una ruta dinámica construida en runtime no
funciona igual que con un literal. Resolvelo con `require(\`@/assets/img/${nombre}.webp\`)` dentro del
componente —webpack genera un contexto para el directorio— o con un mapa explícito de nombre a import.
La segunda es más verbosa pero no tiene magia.

### La brecha de contenido que esta historia expone

`src/assets/icons/` tiene solo `jedami-preview.png` y `pokemon-preview.png`. **No existe captura del
proyecto de chat.** FR-12 la exige en la card y FR-15 en el detalle.

Está registrada como brecha crítica en la validación de arquitectura, y `TASKS.md` §2 ya la anotaba
desde antes del rediseño. En esta historia:

- Poné `image: 'chat-preview'` de todos modos.
- Dejá un comentario visible en el módulo señalando que el asset falta.
- **No** apuntes a `image.png`, que es la imagen del certificado: pasaría por captura de proyecto y
  sería contenido falso.

La resolución es la historia 7.1, y requiere que Marcelo saque la captura o decida cómo se presenta ese
proyecto sin ella.
[Source: architecture.md#Gap Analysis Results, brecha 1]

### Solo lectura

`src/content/*` es de solo lectura en runtime. Ningún módulo lo muta, y la resolución `slug → proyecto`
ocurre **exclusivamente** en el router vía `bySlug()` (historia 4.5). Ninguna vista busca por su cuenta
dentro del array.

### Guardarraíles

- ❌ **No** inventes proyectos, descripciones, stacks ni URLs.
- ❌ **No** uses `''` ni omitas campos para representar ausencia. `null` explícito.
- ❌ **No** dejes los textos de proyecto en el catálogo de i18n.
- ❌ **No** pongas rutas de asset en el módulo de contenido.
- ❌ **No** apuntes la imagen del chat a `image.png` ni a ningún placeholder que pase por captura real.
- ❌ **No** reordenes el array en las vistas. El orden del array es el orden de presentación.
- ❌ **No** mutes el módulo.
- ❌ **No** crees todavía `ProjectCard.vue`: es la historia 4.2.
- ❌ **No** registres la ruta `/projects/:slug`: es la 4.5.
- ❌ **No** agregues campos que ningún FR pida.

### Comandos de verificación

```bash
# Los textos de proyecto ya no están en los locales ni en i18n.js
grep -rn "onlineStore\|pokemonGame\|realtimeMessaging" src/

# Ninguna vista define su propia lista
grep -n "projects\s*=\s*\[\|const proyectos" src/views/
```

En el navegador o en Node:

```js
import { projects, bySlug } from '@/content/projects'

projects.length                      // 3
bySlug('tienda-jedami')?.slug        // 'tienda-jedami'
bySlug('no-existe')                  // null  (exactamente null, no undefined)
projects.filter(p => p.featured).length   // <= 3

// Paridad de idiomas en los cinco campos
projects.every(p =>
  ['title','summary','problem','solution','role']
    .every(k => p.i18n.es[k] && p.i18n.en[k])
)                                    // true

// Ausencia explícita
bySlug('chat-tiempo-real').liveUrl   // null
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; `bySlug` devuelve
el proyecto o `null`; paridad ES/EN en los cinco campos de los tres proyectos; las dos vistas siguen
mostrando los tres proyectos; ninguna vista con lista propia; consola sin errores.

### Project Structure Notes

```
src/content/projects.js        NUEVO — fuente única de proyectos
src/i18n.js                    MODIFICADO — se quitan los textos de proyecto
src/locales/{es,en}.json       MODIFICADO — se quitan los textos de proyecto
src/views/ProjectsView.vue     MODIFICADO — consume el módulo
src/views/HomeView.vue         MODIFICADO — consume el módulo, filtra por featured
```

Se crea `src/content/`. Los módulos `skills.js`, `timeline.js` y `contact.js` llegan en las historias
5.1 y 6.1.

### References

- Historia y criterios: [Source: epics.md#Story 4.1]
- D4, fuente única de contenido: [Source: architecture.md#Data Architecture]
- D13, contenido fuera del catálogo: [Source: architecture.md#Frontend Architecture]
- Patrón de ausencia con `null`: [Source: architecture.md#Format Patterns]
- Brecha de la captura faltante: [Source: architecture.md#Gap Analysis Results]
- FR-10: [Source: prd.md#7.3 Proyectos]
- Contenido real de los tres proyectos: [Source: prd.md#7.3, tabla]
- R3, mantenimiento del i18n: [Source: prd.md#9 Riesgos]
- Duplicación actual: [Source: prd.md#2.1 Estado actual]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2/AC3 — el módulo, medido en Node:**

```
total: 3                       slugs: tienda-jedami, pokemon-game, chat-tiempo-real
bySlug('tienda-jedami').slug   -> 'tienda-jedami'
bySlug('no-existe')            -> null      (=== null, no undefined)
featured                       -> 3
paridad ES/EN en los 5 campos  -> true
chat-tiempo-real.liveUrl       -> null      .repoUrl -> null
```

**AC4 —** ninguna vista define su propia lista, verificado por `grep`. Y las claves
`onlineStore*`, `pokemonGame*`, `realtimeMessaging*` ya no existen en `src/`.

En el navegador, `/projects` pasó de mostrar **2 proyectos a mostrar 3**: el de mensajería no estaba en
ninguna de las dos listas locales. Al alternar idioma los tres títulos cambian
(`Tienda Jedami → Jedami Store`, `Mensajería en tiempo real → Real-time Messaging`).

### Los tres campos que no existían

`title` y `summary` se reusaron de los locales. `problem`, `solution` y `role` **no existían** y se
escribieron para los tres proyectos en los dos idiomas, con lo que se sabe de cada uno y sin inventar
un rol ni un problema que no se pueda sostener.

### El resolvedor de imágenes es un mapa, no un `require` dinámico

`project.image` es un nombre base (`'jedami-preview'`), y `src/utils/assets.js` lo traduce al asset.
Se eligió el mapa explícito sobre `require(\`@/assets/img/${nombre}.webp\`)` por una razón concreta:
webpack resuelve el require dinámico **generando un contexto con todo el directorio**, lo que mete en
el bundle imágenes que nadie usa y falla en tiempo de ejecución —no de compilación— cuando el archivo
no existe. Con un mapa, el que falta se ve leyendo el archivo.

Y falta uno: `chat-preview`. `imagenDeProyecto()` devuelve `null` y quien la consume renderiza el caso
sin imagen. No apunta a `image.png` —que es la captura del certificado— porque pasaría por captura de
proyecto y sería contenido falso.

### Las capturas se convirtieron a WebP

| Origen | Destino | |
|---|---|---|
| `jedami-preview.png` 611 KB | `jedami-preview.webp` 40 KB | **−93 %** |
| `pokemon-preview.png` 30 KB | `pokemon-preview.webp` 8 KB | **−73 %** |

Recortadas a 16/10 —la relación que la card declara— y escaladas a 1200×750, el doble de los ~600 px
que ocupan en la grilla de dos columnas.

### File List
