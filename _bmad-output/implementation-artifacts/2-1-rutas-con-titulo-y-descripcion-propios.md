# Story 2.1: Rutas con título y descripción propios

Status: ready-for-dev

## Story

As a visitante que llega desde un buscador o comparte un enlace,
I want que cada sección tenga su propio título,
so that el enlace signifique algo fuera del sitio.

## Acceptance Criteria

**AC1 — Metadatos declarados en la ruta**

**Given** el router con las rutas `/`, `/projects` y `/about`
**When** cada una declara `meta: { titleKey, descriptionKey }`
**Then** un guard `router.afterEach` traduce esas claves y actualiza `document.title` y la meta description (NFR-19)

**AC2 — El título cambia al navegar**

**Given** el visitante navegando entre secciones
**When** cambia de ruta
**Then** el título de la pestaña del navegador cambia en consecuencia

**AC3 — El título se retraduce**

**Given** el visitante que alterna el idioma
**When** el idioma cambia
**Then** el título del documento se retraduce sin necesidad de navegar

## Tasks / Subtasks

- [ ] **Tarea 1 — Declarar los metadatos** (AC: #1)
  - [ ] En `src/router/index.js`, agregar `meta: { titleKey, descriptionKey }` a las tres rutas
  - [ ] Conservar los `component: () => import(...)` diferidos que ya existen
  - [ ] Conservar los `name` actuales: `home`, `projects`, `about`

- [ ] **Tarea 2 — Claves de metadatos en los locales** (AC: #1, #3)
  - [ ] Agregar a `src/locales/{es,en}.json` la sección `meta` con título y descripción por ruta
  - [ ] El título incluye el nombre del sitio: `Marcelo Olivera — Frontend Developer` en Home
  - [ ] La descripción, entre 120 y 160 caracteres, distinta por ruta

- [ ] **Tarea 3 — Guard `afterEach`** (AC: #1, #2)
  - [ ] `router.afterEach((to) => { … })` traduce `to.meta.titleKey` con la instancia de i18n y lo asigna a `document.title`
  - [ ] Actualiza o crea el `<meta name="description">` (ver §Actualizar la meta description)
  - [ ] Importar la instancia de i18n directamente, **no** llamar a `useI18n()`: un guard no está en un `setup()`

- [ ] **Tarea 4 — Retraducir al cambiar idioma** (AC: #3)
  - [ ] En `useLocale.setLocale`, después de cambiar el `locale`, volver a aplicar los metadatos de la ruta actual
  - [ ] Extraer la lógica de aplicación a una función reutilizable para no duplicarla entre el guard y el composable

- [ ] **Tarea 5 — Verificar** (AC: #1, #2, #3)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Navegar por las tres rutas y confirmar que el título de la pestaña cambia
  - [ ] Alternar idioma sin navegar y confirmar que el título se retraduce
  - [ ] Inspeccionar el `<meta name="description">` en cada ruta

## Dev Notes

**D11 en la arquitectura: metadatos por ruta vía `route.meta` + guard `afterEach`.** Centraliza en
una sola función lo que si no se dispersa como `onMounted` en cuatro vistas. Que los títulos pasen
por claves de i18n es lo que hace que la cobertura bilingüe alcance también al `<title>`, no solo
al contenido visible.
[Source: architecture.md#Frontend Architecture, D11]

Esta historia abre la Épica 2 porque las tres que la siguen —indicador de nav, header en scroll,
menú mobile— necesitan el router ya ordenado. No agrega nada visible en la página; su efecto se ve
en la pestaña del navegador y al compartir un enlace.

### La cuarta ruta llega en la historia 4.5

`/projects/:slug` **no** se registra acá. Necesita el módulo de contenido de la historia 4.1 para
poder resolver el slug, y la vista de detalle de la 4.5. Esta historia cubre las tres rutas que ya
existen. Registrar la cuarta ahora, apuntando a un componente inexistente, rompe el build.

### Actualizar la meta description

`public/index.html` **no tiene** hoy ningún `<meta name="description">`. El guard tiene que crear
la etiqueta la primera vez y reutilizarla después:

```js
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
```

Alternativa igual de válida: agregar el `<meta name="description" content="">` vacío a
`public/index.html` y que el guard solo lo actualice. Elegí una y sé consistente.

### Por qué `afterEach` y no `beforeEach`

`beforeEach` corre antes de que la navegación se confirme. Si otro guard la cancela, ya habrías
cambiado el título por una página a la que el visitante nunca llegó. `afterEach` corre con la
navegación resuelta.

Notá que en la historia 2.6 se agrega un `beforeResolve` para las transiciones de vista. Son
guards distintos con propósitos distintos y conviven sin conflicto.

### El guard no puede usar `useI18n()`

Un guard del router no se ejecuta dentro del `setup()` de un componente, así que `useI18n()` es
inválido ahí. Importá la instancia:

```js
import i18n from '@/i18n'
const t = i18n.global.t
```

Es el mismo criterio que la historia 1.7 aplicó en `useLocale.js`, y la razón por la que ese
composable importa la instancia en lugar de usar el hook.

### Los metadatos también son i18n

Cuando la historia 7.4 verifique cobertura bilingüe total, va a mirar el `document.title` y los
`aria-label`, no solo el texto visible. Por eso el título vive en los locales desde el principio.

### Guardarraíles

- ❌ **No** registres `/projects/:slug`: es la historia 4.5.
- ❌ **No** instales `vue-meta`, `@unhead/vue` ni ninguna librería de metadatos. Tres rutas se
  resuelven con un guard de siete líneas.
- ❌ **No** llames a `useI18n()` dentro del guard.
- ❌ **No** uses `beforeEach` para los metadatos.
- ❌ **No** agregues todavía Open Graph ni Twitter Card: es la historia 7.2, y son estáticos en
  `public/index.html`.
- ❌ **No** toques `scrollBehavior`: es la historia 2.5.
- ❌ **No** agregues transiciones de ruta: es la 2.6.
- ❌ **No** quites la carga diferida por ruta. Cada vista es su propio chunk.

### Comandos de verificación

```bash
grep -n "meta:\|titleKey\|afterEach" src/router/index.js
```

En el navegador, en cada ruta:

```js
document.title
document.querySelector('meta[name="description"]').content
```

Y alternando idioma sin navegar: el `document.title` tiene que cambiar.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; título y
descripción propios y correctos en las tres rutas; retraducción al alternar idioma sin navegar;
consola sin errores.

### Project Structure Notes

```
src/router/index.js          MODIFICADO — meta por ruta + guard afterEach
src/locales/es.json          MODIFICADO — sección meta
src/locales/en.json          MODIFICADO — sección meta
src/composables/useLocale.js MODIFICADO — reaplica metadatos al cambiar idioma
public/index.html            MODIFICADO (opcional) — <meta name="description"> vacío
```

### References

- Historia y criterios: [Source: epics.md#Story 2.1]
- D11, metadatos por ruta: [Source: architecture.md#Frontend Architecture]
- Capa de router como preocupación transversal: [Source: architecture.md#Cross-Cutting Concerns Identified]
- FR-01: [Source: prd.md#7.1 Navegación y estructura]
- NFR-19: [Source: prd.md#8.5 SEO y compartición]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
