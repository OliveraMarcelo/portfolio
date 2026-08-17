# Story 1.4: Íconos como sprite SVG

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante,
I want que los íconos acompañen el color del tema,
so that el sitio se vea coherente tanto en claro como en oscuro.

## Acceptance Criteria

**AC1 — Sprite montado una sola vez**

**Given** el sprite verificado en `public/ui-generated/_system/sprite.html`
**When** se porta a `src/components/layout/AppSprite.vue` y se monta una sola vez en `App.vue`
**Then** los `<symbol>` quedan disponibles en el documento
**And** el contenedor del sprite no ocupa espacio visible

**AC2 — Componente de ícono que hereda color**

**Given** un componente `src/components/ui/AppIcon.vue` que recibe el nombre del ícono
**When** renderiza `<svg class="ico"><use :href="'#i-' + name"/></svg>`
**Then** el ícono hereda el color de su contenedor vía `currentColor`
**And** al alternar el tema, el ícono cambia de color sin recargar

## Tasks / Subtasks

- [x] **Tarea 1 — Portar el sprite** (AC: #1)
  - [x] Crear `src/components/layout/AppSprite.vue` con el contenido literal de `public/ui-generated/_system/sprite.html`
  - [x] Conservar los once `<symbol>` con sus IDs exactos (ver §Inventario de íconos)
  - [x] Conservar `class="sprite"`, `aria-hidden="true"` y `focusable="false"` en el `<svg>` raíz
  - [x] Montarlo como **primer** hijo del template de `App.vue`, fuera de `<main>`

- [x] **Tarea 2 — Portar los estilos de ícono** (AC: #2)
  - [x] Agregar a `src/styles/base.scss` las reglas `.sprite`, `.ico` e `.ico-lg` de `_system/components.css` (líneas 80–92)
  - [x] `.ico` debe quedar con `fill: none; stroke: currentColor; stroke-width: 1.7` — los símbolos son de trazo, no de relleno

- [x] **Tarea 3 — Crear `AppIcon.vue`** (AC: #2)
  - [x] Prop `name` (String, requerido): el nombre **sin** el prefijo `i-`
  - [x] Prop `size` (String, opcional): `'lg'` agrega la clase `.ico-lg`
  - [x] Renderiza `<svg class="ico" aria-hidden="true"><use :href="'#i-' + name" /></svg>`
  - [x] Validar el prop `name` contra la lista de IDs disponibles y avisar en desarrollo si no existe

- [x] **Tarea 4 — Verificar** (AC: #1, #2)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Renderizar los once íconos en alguna vista de forma temporal y confirmar que **todos** se ven
  - [x] Alternar `data-theme` desde la consola y confirmar que el color del ícono cambia sin recargar
  - [x] Confirmar que el `<svg class="sprite">` no ocupa alto ni ancho en el layout
  - [x] Quitar el render temporal antes de cerrar la historia

## Dev Notes

**D9 en la arquitectura: íconos como sprite SVG inline.** Hereda el vocabulario exacto del design
system ya verificado, colorea por `currentColor` —indispensable para que los íconos sigan el
tema— y elimina una fuente de íconos completa del payload.
[Source: architecture.md#Frontend Architecture, D9]

Con esta historia se cierra el frente de **cero orígenes de terceros** (D14) que abrieron la 1.1
(worker de PDF.js) y la 1.3 (Google Fonts). Al terminarla, la pestaña de red no debe mostrar
ninguna petición fuera de marcecode.com.

### El prefijo de los IDs es `i-`, no `ico-`

Es el error más fácil de cometer acá y produce íconos invisibles sin ningún error en consola.

- **`ico`** es la **clase CSS** del `<svg>` que consume el símbolo: `<svg class="ico">`
- **`i-`** es el **prefijo del ID** de cada `<symbol>`: `<use href="#i-moon">`

Verificado contra `public/ui-generated/_system/sprite.html`. Si un `<use>` apunta a un ID
inexistente, el navegador renderiza un SVG vacío en silencio — sin error, sin warning. Por eso
la tarea 3 pide validar el prop en desarrollo.

### Inventario de íconos

Los once símbolos disponibles, con su uso previsto:

| ID | Uso | Historia que lo consume |
|---|---|---|
| `i-moon` | Toggle de tema, estado oscuro | 1.6 |
| `i-sun` | Toggle de tema, estado claro | 1.6 |
| `i-menu` | Botón de menú mobile, cerrado | 2.4 |
| `i-close` | Botón de menú mobile, abierto | 2.4 |
| `i-arrow` | Llamadas a la acción, enlaces "ver más" | 3.2, 4.7 |
| `i-external` | Enlaces a sitio en vivo | 4.2, 4.5 |
| `i-github` | Enlaces a repositorio | 4.2, 4.5 |
| `i-whatsapp` | Canal de contacto | 6.2 |
| `i-mail` | Canal de contacto | 6.2 |
| `i-linkedin` | Canal de contacto | 6.2 |
| `i-code` | Disponible; el logo usa el marcador de texto `</>` | — |

**No agregues íconos nuevos en esta historia.** Si una historia posterior necesita uno, se suma
ahí, al sprite, con el mismo estilo de trazo.

### El logo no usa un ícono

El chasis canónico resuelve el logo con texto, no con SVG:

```html
<span class="logo-mark" aria-hidden="true">&lt;/&gt;</span><span class="logo-word">MarceCode</span>
```

Es lo mismo que ya quedó en `NavBar.vue` en la historia 1.1 y lo mismo que el favicon actual.
**No lo reemplaces por `i-code`.**

### Por qué un sprite inline y no archivos sueltos

Alternativas descartadas, para que no se reabra la discusión:

- **Un `.svg` externo con `<use href="sprite.svg#i-moon">`** — una petición extra y, en algunos
  navegadores, `currentColor` no cruza el límite del documento externo. Rompe el requisito central.
- **SVG por componente** — once componentes en lugar de uno, y el markup se repite en cada uso.
- **Fuente de íconos** — es exactamente lo que la historia 1.1 acaba de eliminar.

### Accesibilidad

Los íconos de este sitio son **siempre decorativos**: acompañan un texto o viven dentro de un
botón que ya tiene `aria-label`. Por eso:

- `aria-hidden="true"` en todos los `<svg class="ico">`, sin excepción.
- El `<svg class="sprite">` contenedor lleva además `focusable="false"`, que evita que Internet
  Explorer y algunos lectores lo metan en el orden de tabulación.
- **Nunca** un ícono como único contenido accesible de un control. Si un botón solo muestra un
  ícono —el de tema, el de menú— el nombre accesible lo aporta su `aria-label`, y eso se resuelve
  en las historias 1.6 y 2.4.

### El sprite tiene que ser invisible pero renderizado

`.sprite { position: absolute; width: 0; height: 0; overflow: hidden; }`

**No** uses `display: none` ni `visibility: hidden` en el contenedor: algunos navegadores dejan
de resolver las referencias `<use>` a símbolos dentro de un subárbol oculto de esa manera. La
regla del design system está escrita así a propósito. Portala tal cual.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** cambies los IDs de los símbolos ni les agregues el prefijo `ico-`.
- ❌ **No** edites los `path` de los símbolos ni sus `viewBox`.
- ❌ **No** agregues `fill` ni `stroke` a los símbolos: el color lo pone `.ico` con `currentColor`.
- ❌ **No** agregues íconos que no estén en el sprite verificado.
- ❌ **No** instales `vue-svg-loader`, `svg-sprite-loader` ni ninguna librería de íconos.
- ❌ **No** uses `display: none` para ocultar el sprite.
- ❌ **No** construyas todavía el `ThemeToggle` ni el `menu-btn`: son las historias 1.6 y 2.4.
  Esta historia solo entrega el sprite y el componente que lo consume.
- ❌ **No** toques `NavBar.vue`: se reemplaza entero en la 1.5.
- ❌ **No** te olvides de quitar el render temporal de verificación.

### Comandos de verificación

```bash
# Los once símbolos están presentes
grep -o 'id="i-[a-z]*"' src/components/layout/AppSprite.vue | sort

# Ningún <use> apunta al prefijo equivocado
grep -rn '#ico-' src/
```

En el navegador:

```js
// Los once IDs resuelven
[...document.querySelectorAll('symbol')].map(s => s.id)

// El sprite no ocupa espacio
document.querySelector('.sprite').getBoundingClientRect()   // width y height en 0

// El ícono sigue el tema
const ico = document.querySelector('.ico')
getComputedStyle(ico).stroke                                 // anotá el valor
document.documentElement.setAttribute('data-theme', 'light')
getComputedStyle(ico).stroke                                 // tiene que haber cambiado
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. Los once íconos renderizan visiblemente en una prueba temporal.
3. El color del trazo cambia al alternar `data-theme`, sin recargar.
4. El contenedor del sprite mide 0×0.
5. Consola sin errores.

**Un ícono que no se ve no da error.** Es el modo de falla característico de esta historia: hay
que mirarlos, uno por uno.

### Project Structure Notes

```
src/components/layout/AppSprite.vue     NUEVO — sprite portado literal
src/components/ui/AppIcon.vue           NUEVO — consume el sprite por nombre
src/styles/base.scss                    MODIFICADO — se suman .sprite, .ico, .ico-lg
src/App.vue                             MODIFICADO — monta <AppSprite /> una sola vez
```

Se crean por primera vez los directorios `src/components/layout/` y `src/components/ui/`. La
organización es **por rol, no por vista** (NFR-17): un componente que dos vistas necesitan vive
en `ui/` desde el primer uso, nunca duplicado.

Las carpetas viejas `src/components/{layouts,buttons,texts,projects,skills,stories}/` siguen
existiendo con los componentes actuales y se van vaciando en sus épicas. Notá que la nueva es
`layout/` en singular, frente a la vieja `layouts/`.

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.4]
- D9, sprite SVG inline: [Source: architecture.md#Frontend Architecture]
- D14, cero orígenes de terceros: [Source: architecture.md#Authentication & Security]
- NFR-05, payload de fuentes e íconos: [Source: prd.md#8.1 Performance]
- NFR-17, un componente canónico por elemento: [Source: prd.md#8.4 Mantenibilidad]
- Archivo fuente normativo: `public/ui-generated/_system/sprite.html`
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 80–92

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Los once símbolos en el documento**, con los IDs exactos del sprite verificado:

```
i-moon  i-sun  i-menu  i-close  i-arrow  i-external
i-github  i-whatsapp  i-mail  i-linkedin  i-code
```

**Los once íconos renderizados y medidos** (render temporal de QA, quitado al cerrar):

| Comprobación | Resultado |
|---|---|
| `<use>` que resuelven a un símbolo existente | **11 de 11** |
| Símbolos con geometría real (hijos > 0) | **11 de 11** |
| Íconos visibles (20×20 px) | **11 de 11** |
| `stroke` computado | `rgb(237,239,242)` = `--color-text` |
| `fill` computado | `none` |
| `stroke-width` | `1.7px` |

**El sprite no ocupa espacio y no está oculto por `display`:**

```
.sprite getBoundingClientRect() → { ancho: 0, alto: 0 }
.sprite display computado        → block   (no `none`, a propósito)
```

**Los íconos siguen el tema**, que es la razón de ser del sprite frente a un PNG:

| Tema | `stroke` del ícono |
|---|---|
| `dark` | `rgb(237, 239, 242)` |
| `light` | `rgb(20, 23, 28)` |

**Accesibilidad:** el `.sprite` lleva `aria-hidden="true"` y `focusable="false"`; los once `.ico`
llevan `aria-hidden="true"` y ninguno es enfocable.

**Build:** `DONE Build complete`. `npm run lint` sin errores; queda el único warning preexistente
(`no-console` en `ItemProject.vue`, componente que muere en la historia 4.2).

### Completion Notes List

Los dos criterios se cumplen. La historia salió con **dos bloqueos de compilación** que valen
documentar porque van a reaparecer en cada componente nuevo del rediseño.

**Bloqueo 1 — `defineProps()` no puede referenciar una constante local de `<script setup>`.**

El validador del prop `name` comparaba contra un array `NOMBRES` declarado en el mismo
`<script setup>`. El build falló con un mensaje inútil de `thread-loader`:

```
Syntax Error: Thread Loader (Worker 6)
Cannot read properties of null (reading 'content')
```

Ese mensaje no dice nada. Lo que lo destrabó fue compilar el SFC a mano con el compilador de Vue,
que sí da la causa exacta:

```
[@vue/compiler-sfc] `defineProps()` in <script setup> cannot reference locally
declared variables because it will be hoisted outside of the setup() function.
```

`defineProps()` se iza fuera de `setup()`, así que su `validator` no ve nada declarado dentro.
**Solución:** la constante va en un `<script>` normal —ámbito de módulo— junto al `<script setup>`.
Es lo que el propio compilador recomienda.

**El comando que sirvió para diagnosticarlo**, y que conviene reusar cuando `thread-loader` tire un
error opaco:

```bash
node -e "
const { parse, compileScript } = require('@vue/compiler-sfc');
const { descriptor } = parse(require('fs').readFileSync('RUTA.vue','utf8'), { filename: 'RUTA.vue' });
try { compileScript(descriptor, { id: 'x' }); console.log('OK'); }
catch (e) { console.log(e.message); }
"
```

**Bloqueo 2 — ESLint no conocía las macros de `<script setup>`.**

Con el SFC ya compilando, ESLint falló con `'defineProps' is not defined  no-undef`. Los cinco
componentes viejos del proyecto lo sortean importando la macro:

```js
import { defineProps } from 'vue';   // patrón deprecado
```

Escribir los componentes nuevos con el patrón deprecado, para después deshacerlo, no tiene sentido:
la Épica 1 sola crea cuatro componentes más y el rediseño completo unos quince. Se agregó a
`.eslintrc.js` el entorno que `eslint-plugin-vue` 8+ provee justamente para esto:

```js
env: { node: true, 'vue/setup-compiler-macros': true }
```

Declara `defineProps`, `defineEmits`, `defineExpose` y `withDefaults` como globales. Es una línea,
no toca la versión de ESLint ni el formato de configuración —los dos guardarraíles de la historia
1.1— y desbloquea todos los componentes que vienen.

**Sobre el prefijo `i-`:** la historia insistía en que es `i-` y no `ico-` porque un `<use>` a un ID
inexistente renderiza un SVG vacío **sin ningún error en consola**. El validador del prop convierte
ese fallo silencioso en un aviso: el nombre se compara contra la lista real de los once símbolos.

**El sprite se porta literal, incluido el `display`.** El contenedor usa
`position: absolute; width: 0; height: 0; overflow: hidden` y **no** `display: none`, porque algunos
navegadores dejan de resolver las referencias `<use>` a símbolos dentro de un subárbol oculto de esa
forma. Verificado que el `display` computado es `block` y que la caja mide 0×0.

**Los dos paquetes de Font Awesome ya estaban eliminados** en la historia 1.1, así que esta historia
no tuvo que quitar nada: solo aportar el reemplazo. Con esto se cierra el frente de **cero orígenes
de terceros** que abrieron la 1.1 (worker de PDF.js) y la 1.3 (Google Fonts) — la app no hace
ninguna petición externa.

### File List

```
src/components/layout/AppSprite.vue    NUEVO — sprite portado literal, 11 <symbol>
src/components/ui/AppIcon.vue          NUEVO — consume el sprite por nombre, con validación
src/styles/base.scss                   MODIFICADO — se suman .sprite, .ico, .ico-lg
src/App.vue                            MODIFICADO — monta <AppSprite /> como primer nodo
.eslintrc.js                           MODIFICADO — env vue/setup-compiler-macros
```

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Sprite SVG inline con los once símbolos del sistema y componente `AppIcon` con validación de nombre. Íconos que siguen el tema por `currentColor`. Estado `done`. |
