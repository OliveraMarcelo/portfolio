# Story 1.1: Línea base de dependencias

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mantenedor del portfolio,
I want el proyecto corriendo sobre versiones actuales y sin dependencias muertas,
so that el rediseño se construya sobre una base que no arrastre peso ni conflictos de versión.

## Acceptance Criteria

**AC1 — Versiones de runtime actualizadas**

**Given** el proyecto con `vue@3.4.21`, `vue-router@4.3.0` y `vue-i18n@9.14.5` instalados
**When** se actualizan a `vue@3.5.41`, `vue-router@4.6.4` y `vue-i18n@11.4.8`
**Then** `npm run build` termina sin errores
**And** `npm install` no reporta ningún conflicto de peer dependency
**And** `vue-router` queda en la línea 4.x, no en la 5.x

**AC2 — Dependencias muertas eliminadas**

**Given** las dependencias `pdfjs-dist`, `@fortawesome/fontawesome-free` y `font-awesome-icons`
**When** se desinstalan y se elimina `src/components/stories/PdfViewer.vue` junto con el import de Font Awesome en `src/main.js`
**Then** el proyecto compila
**And** ninguna petición de red apunta a `cdnjs.cloudflare.com`

**AC3 — Sin regresión visual del logo**

**Given** que `src/components/layouts/NavBar.vue` usa `<i class="fas fa-code">` para el ícono del logo
**When** se elimina Font Awesome
**Then** ese ícono se reemplaza por el marcador canónico del design system: `<span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>`
**And** el logo sigue visible y legible, sin depender de ninguna fuente de íconos

**AC4 — Consola limpia en producción**

**Given** el sitio corriendo con el build de producción
**When** se abre la consola del navegador
**Then** no aparece ningún error
**And** los `console.log` de `registerServiceWorker.js` quedan condicionados a `process.env.NODE_ENV !== 'production'`

**AC5 — Sin regresión funcional**

**Given** el sitio después de todos los cambios
**When** se recorren las tres vistas actuales (`/`, `/projects`, `/about`)
**Then** todas cargan y se ven igual que antes de esta historia
**And** el cambio de idioma sigue funcionando
**And** el toggle de tema actual sigue funcionando

## Tasks / Subtasks

- [x] **Tarea 0 — Trabajar en rama** (AC: todos)
  - [x] Verificar la rama actual. Si es `main`, crear una rama de rediseño antes de tocar nada
  - [x] El sitio está **en producción** en marcecode.com y el push a `main` dispara el deploy

- [x] **Tarea 1 — Actualizar dependencias de runtime** (AC: #1)
  - [x] `npm i vue@3.5.41 vue-router@4.6.4 vue-i18n@11.4.8`
  - [x] Verificar que `npm ls` no reporte `UNMET PEER DEPENDENCY`
  - [x] Confirmar que `package.json` quedó con esas versiones y que el `package-lock.json` se actualizó

- [x] **Tarea 2 — Actualizar dependencias de desarrollo** (AC: #1)
  - [x] `npm i -D sass@1.102.0 @vue/cli-service@5.0.9`
  - [x] **NO** tocar `eslint`: se queda en `^7.32.0` (ver §Guardarraíles)
  - [x] Verificar que el rango de `sass` sea `^1.102.0` y no permita saltar a 2.0

- [x] **Tarea 3 — Eliminar `pdfjs-dist` y el visor de PDF** (AC: #2)
  - [x] `npm rm pdfjs-dist`
  - [x] Borrar `src/components/stories/PdfViewer.vue`
  - [x] Limpiar en `src/components/stories/MyStory.vue` el import comentado de la línea 30 y el uso comentado de la línea 11
  - [x] Verificar por `grep` que no queda ninguna referencia a `pdfjs` ni a `cdnjs.cloudflare.com`

- [x] **Tarea 4 — Eliminar Font Awesome sin romper el logo** (AC: #2, #3)
  - [x] Reemplazar en `src/components/layouts/NavBar.vue` línea 5 el `<i class="fas fa-code"></i>` por `<span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>` — es el marcador de logo canónico del design system, no un SVG inventado
  - [x] Eliminar de `src/main.js` la línea `import '@fortawesome/fontawesome-free/css/all.css'`
  - [x] `npm rm @fortawesome/fontawesome-free font-awesome-icons`
  - [x] Verificar visualmente que el logo del header sigue igual

- [x] **Tarea 5 — Silenciar la consola en producción** (AC: #4)
  - [x] En `src/registerServiceWorker.js`, envolver cada `console.log` en `if (process.env.NODE_ENV !== 'production')`
  - [x] Dejar el `console.error` del handler `error()` tal cual: un fallo real de registro debe seguir siendo visible

- [x] **Tarea 6 — Verificar** (AC: #1, #2, #4, #5)
  - [x] `npm run build` sin errores
  - [x] `npm run lint` sin advertencias
  - [x] `npm run serve` y recorrer `/`, `/projects` y `/about`
  - [x] Consola del navegador sin errores
  - [x] Pestaña de red: ninguna petición a `cdnjs.cloudflare.com`
  - [x] Toggle de idioma y toggle de tema siguen funcionando
  - [x] `npm ci` funciona en limpio — es lo que corre el Dockerfile (ver §El lockfile no es opcional)

## Dev Notes

Esta es la primera historia del rediseño y es **puramente de fundación**: no cambia nada de lo
que ve el visitante. Su valor es dejar la base sobre la que se construye todo lo demás. Toda
historia posterior asume estas versiones.

### Estado real del código, verificado

Estos hechos fueron comprobados sobre el árbol actual, no inferidos de los documentos:

| Hecho | Consecuencia para esta historia |
|---|---|
| `PdfViewer.vue` está **comentado** en `MyStory.vue` (líneas 11 y 30) | `pdfjs-dist` es una dependencia muerta: nada la importa en runtime. Eliminarla es riesgo cero |
| `font-awesome-icons` no aparece importado en ningún archivo | Segunda dependencia muerta. Eliminarla es riesgo cero |
| `@fortawesome/fontawesome-free` **sí se usa**: `src/main.js:6` importa el CSS y `NavBar.vue:5` usa `<i class="fas fa-code">` | Es el **único** uso en todo el proyecto. Eliminarlo sin reemplazar ese ícono deja el logo roto → por eso la tarea 4 lo sustituye en el mismo commit |
| Instalado hoy: `vue@3.4.21`, `vue-router@4.3.0`, `vue-i18n@9.14.5`, `sass@1.96.0`, `@vue/cli-service@5.0.8` | El `package.json` declara rangos más viejos (`vue ^3.2.13`); el lockfile ya resolvió por encima. Actualizar el rango además del lockfile |
| `src/i18n.js` ya declara `legacy: false` | El salto de vue-i18n 9 → 11 no requiere migración de API |
| El Dockerfile buildea con `node:24-alpine` | Satisface el `engine: node >= 22` de vue-i18n 11 |
| `src/composables/useDownloadPdf.vue` es un `.vue` que solo contiene `<script>` | Está mal, pero **no se toca acá**: se migra a `.js` en la historia 3.2 |

### Por qué `vue` tiene que subir a 3.5

No es una actualización opcional. `vue-router@4.6.4` declara `peerDependencies: { vue: "^3.5.0" }`.
Con `vue@3.4.21` instalado, npm reportaría conflicto de peer. Las dos versiones suben juntas o
no sube ninguna.

### Por qué se rechaza `vue-router@5`

`5.2.0` es la versión `latest` en npm, así que un agente que "actualice a lo último" la va a
instalar. **No hay que hacerlo.** Declara `vite: "^7.3.0 || ^8.0.0"` como peer dependency
(opcional, así que no falla la instalación), y todo su valor diferencial —routing basado en
archivos, el `unplugin`, rutas tipadas— depende de la integración con Vite. Este proyecto usa
Vue CLI / webpack, donde la 5 expone la misma API manual que la 4 a cambio de un salto mayor.
[Source: architecture.md#Starter Template Evaluation]

### Por qué ESLint se queda en 7

`eslint@10.8.1` es la `latest`, pero ESLint 9+ exige flat config (`eslint.config.js`), que rompe
`@vue/cli-plugin-eslint@5` y `eslint-plugin-vue@8`. NFR-18 solo pide compilar sin advertencias.
Abrir ese frente en un rediseño visual no compra nada.
[Source: architecture.md#Decisiones de versión]

### Techo de `sass`, verificado

- **`@import` está deprecado** desde Dart Sass 1.80. `src/styles/sass/main.scss` tiene siete.
  Ya emiten advertencia de deprecación hoy con 1.96, y seguirán con 1.102. **No las arregles en
  esta historia:** toda esa carpeta se elimina en la historia 1.2, y el `main.scss` nuevo va a
  usar `@use`. Si las advertencias molestan mientras tanto, es ruido conocido y temporal.
- **La API JS legacy de Sass se remueve en Dart Sass 2.0.** `sass-loader@12.6.0` —la versión que
  Vue CLI 5 fija— usa esa API legacy. Por eso el rango de `sass` debe quedar en `^1.102.0`: el
  caret no salta a 2.0. Nunca fijes `sass` en `*`, `latest` ni `^2`.

### vue-i18n 9 → 11: qué cambia y qué no

Verificado contra la documentación oficial de migración:

- **v10** habilitó la compilación JIT de mensajes por defecto. Funciona sin configuración con el
  build `esm-bundler`, que es el que webpack resuelve por defecto.
- **v11** deprecó el modo Legacy API, la directiva `v-t`, y eliminó `tc` / `$tc`.
- **Este proyecto no usa nada de eso:** `createI18n({ legacy: false })` con `useI18n()` es
  exactamente el camino al que vue-i18n está migrando. La actualización es transparente.
- Los feature flags de bundler (`__VUE_I18N_LEGACY_API__`, `__INTLIFY_DROP_MESSAGE_COMPILER__`)
  son palancas **opcionales** de tamaño de bundle. No definirlos no produce advertencia ni error.
  **No los configures en esta historia.**

### El lockfile no es opcional

El `Dockerfile` de producción hace:

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
```

`npm ci` **falla el build entero** si `package-lock.json` y `package.json` no están sincronizados.
Consecuencias directas para esta historia:

- El `package-lock.json` regenerado tiene que commitearse junto con el `package.json`. No es un
  archivo ignorable.
- Antes de dar la historia por terminada, correr `npm ci` en limpio. Si funciona local con
  `npm install` pero falla con `npm ci`, el deploy va a romper y no te vas a enterar hasta el push.
- No editar `package.json` a mano sin regenerar el lockfile.

### Si el build falla después de actualizar

No improvises workarounds. El orden de diagnóstico:

1. Leer el error completo. Un conflicto de peer dependency dice exactamente qué paquete lo pide.
2. Verificar que **las tres** dependencias de runtime subieron juntas. `vue-router@4.6.4` con
   `vue@3.4.x` falla por peer; es el error más probable.
3. `rm -rf node_modules package-lock.json && npm install` para descartar un lockfile a medio migrar.
4. Si aun así falla, **revertir la actualización y reportar** — no bajes `vue-router` a una versión
   intermedia ni fuerces con `--legacy-peer-deps`. Enmascarar un conflicto de peer acá se paga en
   la historia 2.6, donde el router es el que maneja las transiciones de vista.

### Punto a vigilar: `transpileDependencies: true`

`vue.config.js` tiene `transpileDependencies: true`, lo que corre Babel sobre `node_modules`.
Funciona hoy con vue-i18n 9. Si el build se vuelve notablemente más lento o aparece un error de
sintaxis proveniente de un archivo dentro de `node_modules`, ese flag es el sospechoso.
**No lo cambies en esta historia** — anotalo y reportalo.

### Guardarraíles — qué NO hacer en esta historia

Esta historia tiene una tentación fuerte de expandirse. Todo lo siguiente está explícitamente
fuera de alcance:

- ❌ **No** actualizar ESLint, ni migrar a flat config.
- ❌ **No** instalar `vue-router@5`.
- ❌ **No** migrar a Vite ni tocar `vue.config.js`.
- ❌ **No** instalar Pinia ni ninguna librería de estado.
- ❌ **No** instalar librerías de animación (GSAP, Motion One, Framer). El sistema de movimiento
  es CSS y una directiva propia.
- ❌ **No** empezar a crear tokens, componentes ni estilos: eso es la historia 1.2 en adelante.
- ❌ **No** convertir los `@import` de SASS a `@use`: esa carpeta se borra en la 1.2.
- ❌ **No** tocar `useDownloadPdf.vue`: se migra en la 3.2.
- ❌ **No** borrar `certificado.pdf` de `public/`: se elimina en la historia 5.3, cuando exista
  su reemplazo.
- ❌ **No** agregar ninguna dependencia nueva. Esta historia solo resta.

### Testing standards

No hay pruebas automatizadas en este proyecto y **no se escriben en esta historia**. Jest está
configurado (`jest.config.js`, `tests/unit/example.spec.js`) pero sin cobertura; escribir tests
está diferido por decisión de arquitectura.

La verificación es manual y observable:

1. `npm run build` termina sin errores.
2. `npm run lint` no emite advertencias (NFR-18).
3. `npm run serve` y recorrer las tres vistas actuales.
4. Consola del navegador sin errores.
5. Pestaña de red sin peticiones a `cdnjs.cloudflare.com`.

**No declares la historia terminada si solo compiló.** Hay que abrirla en el navegador.

### Project Structure Notes

Archivos que esta historia toca:

```
package.json                              MODIFICADO — versiones y remociones
package-lock.json                         MODIFICADO — regenerado por npm
src/main.js                               MODIFICADO — se quita el import de Font Awesome
src/components/layouts/NavBar.vue          MODIFICADO — <i class="fas fa-code"> → SVG inline
src/components/stories/MyStory.vue         MODIFICADO — se limpian las líneas comentadas 11 y 30
src/components/stories/PdfViewer.vue       ELIMINADO
src/registerServiceWorker.js               MODIFICADO — console.log condicionados
```

Ningún otro archivo debe aparecer en el diff. **El `package-lock.json` sí va en el commit**: el
Dockerfile corre `npm ci` y falla si está desincronizado.

**Variación respecto de la estructura objetivo:** `NavBar.vue` va a ser reemplazado por
`src/components/layout/AppNav.vue` en la historia 1.5. El SVG inline que se agrega acá es
deliberadamente provisorio — su única razón de existir es que el logo no se rompa entre esta
historia y la 1.4, donde el sprite SVG toma su lugar. No inviertas tiempo en hacerlo elegante.

### References

- Historia y criterios de aceptación: [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- Decisión de versiones y rechazo de vue-router 5: [Source: _bmad-output/planning-artifacts/architecture.md#Decisiones de versión]
- Dependencias removidas y su motivo: [Source: _bmad-output/planning-artifacts/architecture.md#Dependencias removidas]
- D12, consola limpia en producción: [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- D14, cero orígenes de terceros: [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]
- Restricción de stack: [Source: _bmad-output/planning-artifacts/prd.md#2.3 Restricciones]
- NFR-18, compilar sin advertencias: [Source: _bmad-output/planning-artifacts/prd.md#8.4 Mantenibilidad]
- M7, cero errores de consola: [Source: _bmad-output/planning-artifacts/prd.md#5 Métricas de éxito]
- Deprecación de `@import` en Dart Sass: https://sass-lang.com/documentation/breaking-changes/import/
- Remoción de la API JS legacy en Dart Sass 2.0: https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
- Breaking changes de vue-i18n v11: https://vue-i18n.intlify.dev/guide/migration/breaking11.html
- Feature flags de vue-i18n: https://vue-i18n.intlify.dev/guide/advanced/optimization.html

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**Versiones instaladas, verificadas tras `npm ci`:**

```
vue 3.5.41
vue-router 4.6.4
vue-i18n 11.4.8
sass 1.102.0
@vue/cli-service 5.0.9
eslint 7.32.0   (sin cambio, deliberado)
```

**`npm ls vue vue-router vue-i18n`** — sin `UNMET PEER DEPENDENCY`. Los tres paquetes resuelven
`vue@3.5.41 deduped`.

**Dependencias tras la limpieza** — de 8 a 5:

```json
{ "core-js": "^3.8.3", "register-service-worker": "^1.7.2",
  "vue": "^3.5.41", "vue-i18n": "^11.4.8", "vue-router": "^4.6.4" }
```

**`npm run lint`** → `DONE No lint errors found!`

**`npm run build`** → `DONE Build complete` en 5898 ms, hash `89f7123492b3fc0d`.

**`npm ci` en limpio** → correcto. `pdfjs-dist`, `@fortawesome/fontawesome-free` y
`font-awesome-icons` confirmados ausentes de `node_modules/` después de la reinstalación.

**Verificación en navegador** sobre el build de producción servido en el puerto 8099:

```
consola: 0 errores, 1 warning (preexistente, ver notas)
peticiones a cdnjs.cloudflare.com: ninguna
logo: "</> MarceCode", .logo-mark visible con aria-hidden="true"
elementos <i class*="fa">: 0
vistas: / (2748 car.), /projects (550), /about (2306) — las tres cargan
toggle de idioma: "Inicio" → "Home", el botón alterna EN → ES
toggle de tema: body "" → "dark-mode"
```

### Completion Notes List

Los cinco criterios de aceptación se cumplen, verificados midiendo y mirando, no solo compilando.

**AC1 —** Las tres dependencias de runtime subieron juntas en un solo comando, que es lo que evita
el conflicto de peer que la historia anticipaba: `vue-router@4.6.4` exige `vue ^3.5.0`, y con
`vue@3.4.21` instalado npm habría fallado. `vue-router` quedó en `^4.6.4`, no en la 5.

**AC2 —** `pdfjs-dist` resultó ser exactamente la dependencia muerta que la historia describía:
`PdfViewer.vue` estaba comentado en `MyStory.vue` en las líneas 11 y 30, así que nada la importaba
en runtime. Se eliminó el paquete, el componente y las dos líneas comentadas. `font-awesome-icons`
tampoco aparecía importado en ningún archivo. Cero peticiones a `cdnjs.cloudflare.com`.

**AC3 —** `@fortawesome/fontawesome-free` sí estaba en uso, en un único lugar: `NavBar.vue:5`. Se
reemplazó por el marcador canónico del design system, `<span class="logo-mark">&lt;/&gt;</span>`.
El logo renderiza `</> MarceCode` en color de acento y no quedó ningún `<i class*="fa">` en el
proyecto.

**AC4 —** Cero errores en consola. Los seis `console.log` de `registerServiceWorker.js` pasan por
un helper `log()` condicionado a `NODE_ENV !== 'production'`. El `console.error` del handler
`error()` se dejó incondicional a propósito: un fallo real de registro del service worker no es
ruido y tiene que verse.

**AC5 —** Sin regresión funcional. Las tres vistas cargan con contenido, el toggle de idioma
cambia el nav de "Inicio" a "Home" y el de tema aplica `dark-mode` al `body`.

**Dos hallazgos ajenos a esta historia, que conviene no perder:**

1. **El manifest del PWA referencia iconos que no existen.** La consola emite un warning:
   `Error while trying to use the following icon from the Manifest: /img/icons/android-chrome-192x192.png`.
   `@vue/cli-plugin-pwa` genera un manifest con cuatro iconos que nunca se crearon en
   `public/img/icons/`. Verificado como **preexistente** —`public/img/` no existe desde el primer
   commit— y por lo tanto fuera del alcance de esta historia, cuyo AC4 pide cero *errores*.
   Pero M7 pide **cero salida** en consola, así que **la historia 7.3 tiene que resolverlo**: o se
   agregan los iconos, o se ajusta la configuración del plugin PWA.

2. **`public/ui-generated/` se está copiando a `dist/`.** El build lo confirma: aparecen
   `dist/ui-generated/_system/system.js`, `dist/ui-generated/home/page.css` y el resto. Como vive
   dentro de `public/`, el prototipo quedaría publicado en `marcecode.com/ui-generated/` en el
   próximo deploy. **Hay que excluirlo del build en `vue.config.js` antes de mergear a `main`.**
   No se resolvió acá porque `vue.config.js` está explícitamente fuera del alcance de esta
   historia, y las 41 historias referencian esas rutas como fuente normativa, así que mover los
   archivos no es opción.

**Deuda que la historia dejó deliberadamente en pie:** Google Fonts sigue cargando Poppins desde
`fonts.googleapis.com` (historia 1.3), los siete `@import` de SASS siguen emitiendo advertencias
de deprecación (historia 1.2), y `useDownloadPdf.vue` sigue siendo un `.vue` (historia 3.2).
Ninguna se tocó, según los guardarraíles.

### File List

```
package.json                              MODIFICADO — versiones y 3 dependencias removidas
package-lock.json                         MODIFICADO — regenerado (crítico: el Dockerfile usa npm ci)
src/main.js                               MODIFICADO — se quita el import de Font Awesome
src/components/layouts/NavBar.vue          MODIFICADO — <i class="fas fa-code"> → .logo-mark
src/components/stories/MyStory.vue         MODIFICADO — se limpian las líneas comentadas 11 y 30
src/components/stories/PdfViewer.vue       ELIMINADO
src/registerServiceWorker.js               MODIFICADO — console.log condicionados a desarrollo
```

Siete archivos, exactamente los que la sección §Project Structure Notes anticipaba. Ningún otro
archivo aparece en el diff.

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Línea base de dependencias fijada; 3 dependencias muertas o reemplazadas eliminadas; consola silenciada en producción. Historia completa, estado `review`. |
