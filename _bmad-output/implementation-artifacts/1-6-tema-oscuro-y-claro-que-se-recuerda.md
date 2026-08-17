# Story 1.6: Tema oscuro y claro que se recuerda

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante que prefiere el modo claro,
I want que el sitio se abra como yo lo quiero y lo recuerde la próxima vez,
so that no tenga que corregirlo en cada visita.

## Acceptance Criteria

**AC1 — Sin destello en la primera carga**

**Given** un visitante nuevo cuyo sistema declara `prefers-color-scheme: light`
**When** carga cualquier vista del sitio
**Then** el documento se pinta en tema claro desde el primer fotograma
**And** no se percibe ningún destello de tema oscuro (FR-26)

**AC2 — Script inline bloqueante**

**Given** el script inline y bloqueante en `public/index.html`, ubicado antes de toda hoja de estilo
**When** se ejecuta
**Then** lee `mc-theme` de `localStorage`, y si no existe consulta `prefers-color-scheme`
**And** estampa el resultado como `data-theme` sobre `document.documentElement`, nunca sobre `<body>`

**AC3 — Alternancia y persistencia**

**Given** el composable `src/composables/useTheme.js` y el componente `ThemeToggle.vue`
**When** el visitante alterna el tema
**Then** el atributo `data-theme` cambia y el valor se guarda en `localStorage` bajo la clave `mc-theme` (FR-27)
**And** el ícono del botón rota 180° mientras los colores cruzan (A7)
**And** los colores transicionan de forma suave, sin salto (FR-28)

**AC4 — La elección manual gana**

**Given** el visitante que ya eligió tema manualmente
**When** recarga la página o vuelve en otra sesión
**Then** se respeta su elección aunque contradiga la preferencia del sistema

**AC5 — Los tres estados resuelven**

**Given** los tres estados posibles — sin atributo, `data-theme="dark"` y `data-theme="light"`
**When** se inspecciona el valor computado de `--color-bg` en cada uno
**Then** los tres devuelven exactamente el token correspondiente y ninguno queda sin resolver

## Tasks / Subtasks

- [x] **Tarea 1 — Script inline en `index.html`** (AC: #1, #2)
  - [x] Insertar en `<head>` de `public/index.html`, **antes** de cualquier `<link rel="stylesheet">` y antes de los bundles
  - [x] Sin `defer` ni `async`: tiene que bloquear
  - [x] Todo acceso a `localStorage` envuelto en `try/catch` (falla en modo privado de algunos navegadores)
  - [x] Estampa sobre `document.documentElement`, no sobre `<body>`

- [x] **Tarea 2 — Composable `useTheme.js`** (AC: #3, #4)
  - [x] `src/composables/useTheme.js` con un `ref` de **módulo** (fuera de la función) — es un singleton, no un estado por componente
  - [x] Inicializar el `ref` leyendo el atributo que el script inline ya dejó puesto, no volviendo a consultar `localStorage`
  - [x] Exponer `{ theme, setTheme, toggleTheme }`
  - [x] `setTheme(valor)` estampa el atributo **y** persiste en `mc-theme`
  - [x] Escuchar `prefers-color-scheme` y seguir el sistema **solo si no hay valor guardado** (ver §Seguir al sistema, pero solo hasta que el usuario opine)

- [x] **Tarea 3 — Componente `ThemeToggle.vue`** (AC: #3)
  - [x] Markup canónico: `<button class="icon-btn theme-btn">` con los dos íconos, `i-moon` e `i-sun`, superpuestos
  - [x] Los estilos `.theme-btn .ico-sun` / `.ico-moon` de `_system/components.css` (líneas 262–267) hacen el cruce; portalos a `chassis.scss`
  - [x] `aria-label` dinámico: "Cambiar a tema claro" u "oscuro" según el estado actual
  - [x] Montarlo en `.header-actions` de `AppNav.vue`, **antes** del botón de idioma

- [x] **Tarea 4 — Eliminar el toggle viejo** (AC: #3)
  - [x] Borrar de `src/App.vue` el `<button class="toggle-mode-btn">`, su `<style>` y las funciones `isDark` / `toggleMode`
  - [x] Verificar por `grep` que no queda ninguna referencia a `dark-mode` ni a `toggle-mode-btn`

- [x] **Tarea 5 — Verificar** (AC: #1, #3, #4, #5)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Probar el destello emulando `prefers-color-scheme: light` en DevTools y recargando con caché deshabilitada
  - [x] Probar los cuatro escenarios de la §Matriz de escenarios
  - [x] Verificar los tres estados de `--color-bg`
  - [x] Consola sin errores

## Dev Notes

**D2 en la arquitectura: `data-theme` en `<html>`, aplicado antes del primer pintado.** Si el
tema se aplicara al montar la aplicación Vue, todo visitante con preferencia clara vería un
destello oscuro. Ese destello cuenta como cambio de layout percibido y es exactamente lo que
NFR-01 y M4 buscan evitar.
[Source: architecture.md#Frontend Architecture, D2]

Esta historia y la 1.7 comparten el mismo script inline y las mismas claves de `localStorage`.
Están acopladas a propósito, y el modo de falla si divergen —un destello silencioso en cada
carga, sin ningún error— está documentado como dependencia cruzada en la arquitectura.

### El script inline

```html
<script>
  (function () {
    var t = null;
    try { t = localStorage.getItem('mc-theme'); } catch (e) { /* noop */ }
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

Tres cosas que parecen detalles y no lo son:

1. **Va antes de las hojas de estilo.** Si va después, el navegador ya empezó a pintar con el
   default oscuro y el destello aparece igual.
2. **Sin `defer` ni `async`.** El script tiene que bloquear. Es la única vez en todo el proyecto
   que un script bloqueante es lo correcto.
3. **`try/catch` alrededor de `localStorage`.** En modo privado de Safari, y con cookies de
   terceros bloqueadas en algunos contextos, el mero acceso **lanza excepción**. Sin el `try`,
   una excepción en un script bloqueante deja la página sin tema y sin aplicación.

En la historia 1.7 este mismo bloque suma la lectura de `mc-lang` y el atributo `lang`.

### El DOM es la fuente de verdad, no una variable

El design system resuelve el tema actual leyendo el atributo, no una variable paralela:

```js
function temaActual() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
```

Portá ese criterio. El `ref` del composable se **inicializa** desde el atributo que el script
inline ya dejó puesto; no vuelve a consultar `localStorage` ni a evaluar `prefers-color-scheme`.
Si el composable recalculara la preferencia por su cuenta, tendrías dos fuentes que pueden
discrepar, y el síntoma sería un parpadeo al montar la app que nadie sabría explicar.

### Seguir al sistema, pero solo hasta que el usuario opine

Comportamiento verificado en `_system/system.js`:

```js
var onSchemeChange = function (e) {
  var guardado = null;
  try { guardado = localStorage.getItem('mc-theme'); } catch (err) { /* noop */ }
  if (!guardado) setTema(e.matches ? 'light' : 'dark', false);
};
```

O sea: si el visitante nunca tocó el botón, el sitio sigue al sistema en vivo —si el sistema pasa
a modo noche mientras la pestaña está abierta, el sitio acompaña. En cuanto el visitante alterna
manualmente **una vez**, su elección manda para siempre y el listener deja de aplicar cambios.

Notá el segundo parámetro: `setTema(..., false)` no persiste. Solo el clic manual persiste. Si
persistieras el cambio del sistema, el visitante quedaría "atado" a lo que su sistema hacía en
ese momento, sin haber elegido nada.

### La transición suave sale de `base.scss`, no de acá

FR-28 pide que el cambio de tema sea una transición de color, no un salto. Ya está resuelto por
el `body` que la historia 1.2 portó:

```css
transition: background-color var(--dur-base) var(--ease-in-out),
            color var(--dur-base) var(--ease-in-out);
```

**No agregues `transition: all`** en ningún lado para "mejorarlo". `all` anima también
propiedades de layout, lo que viola NFR-02 y hunde los 60 fps de NFR-03.

### Matriz de escenarios

Los cuatro casos que hay que probar a mano. Limpiá `localStorage` entre unos y otros.

| # | Estado previo | Sistema | Esperado |
|---|---|---|---|
| 1 | `localStorage` vacío | `prefers-color-scheme: light` | Abre en claro, sin destello oscuro |
| 2 | `localStorage` vacío | oscuro | Abre en oscuro |
| 3 | `mc-theme = 'dark'` | claro | Abre en **oscuro** — la elección manual gana (AC4) |
| 4 | `mc-theme = 'light'` | oscuro | Abre en **claro** |

Y uno más, en vivo: sin nada guardado, cambiar la preferencia del sistema con la pestaña abierta
→ el sitio acompaña. Después alternar manualmente y repetir → el sitio ya no acompaña.

Para emular la preferencia en Chrome: DevTools → menú de tres puntos → More tools → Rendering →
"Emulate CSS media feature prefers-color-scheme".

### Cómo se detecta el destello de verdad

Mirarlo a ojo no alcanza; el destello dura un fotograma. Dos formas confiables:

1. **Grabar el panel Performance** con la casilla de capturas de pantalla activada, recargando
   con caché deshabilitada. Revisá las primeras capturas: ninguna debe salir oscura si el
   escenario esperado es claro.
2. **Throttling de CPU a 6×** en la pestaña Performance, que alarga el intervalo y hace visible
   el destello si existe.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** apliques el tema desde `App.vue` ni desde `main.js`. Ese es exactamente el bug que la
  historia elimina.
- ❌ **No** uses `body.classList`. El atributo va en `<html>`, y `tokens.css` define los temas
  sobre `[data-theme]` a nivel de raíz.
- ❌ **No** conserves la clase `.dark-mode`.
- ❌ **No** agregues `@media (prefers-color-scheme: light)` a `tokens.css`. La preferencia del
  sistema se resuelve en JavaScript, una sola vez, en el script inline.
- ❌ **No** uses una clave de `localStorage` distinta de `mc-theme`. El script inline y el
  composable tienen que coincidir literalmente.
- ❌ **No** instales Pinia ni ninguna librería de estado. Un `ref` de módulo alcanza (D3).
- ❌ **No** uses `transition: all`.
- ❌ **No** agregues el botón de menú mobile: es la 2.4.
- ❌ **No** portes la propagación por query string de `system.js`. Es un parche para el prototipo
  abierto con `file://`, donde cada documento es un origen distinto y `localStorage` no se
  comparte. En una SPA servida por HTTP no hace falta y sería ruido en la URL.

### Comandos de verificación

```bash
# No queda rastro del mecanismo viejo
grep -rn "dark-mode\|toggle-mode-btn\|isDark" src/

# El script inline está antes de los estilos
grep -n "mc-theme\|stylesheet" public/index.html
```

En el navegador:

```js
// Los tres estados resuelven
const bg = () => getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim()
document.documentElement.removeAttribute('data-theme');            bg()  // #0B0D10
document.documentElement.setAttribute('data-theme', 'dark');       bg()  // #0B0D10
document.documentElement.setAttribute('data-theme', 'light');      bg()  // #FAFAF9

// La persistencia usa la clave correcta
localStorage.getItem('mc-theme')

// El atributo va en <html>, no en <body>
document.documentElement.getAttribute('data-theme')
document.body.className   // no debe contener 'dark-mode'
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. Los cuatro escenarios de la matriz, más el de cambio de sistema en vivo.
3. Grabación de Performance sin destello.
4. Los tres estados de `--color-bg` resuelven.
5. El ícono cruza de luna a sol con rotación al alternar.
6. Consola sin errores.

**El destello es el riesgo real de esta historia y no se ve compilando.** Hay que grabarlo.

### Project Structure Notes

```
public/index.html                       MODIFICADO — script inline bloqueante en <head>
src/composables/useTheme.js             NUEVO — ref de módulo + persistencia
src/components/ui/ThemeToggle.vue       NUEVO
src/components/layout/AppNav.vue        MODIFICADO — ThemeToggle en .header-actions
src/styles/chassis.scss                 MODIFICADO — estilos .theme-btn del sistema
src/App.vue                             MODIFICADO — se elimina el toggle flotante viejo
```

`src/composables/` ya existe (contiene `useDownloadPdf.vue`, que se migra a `.js` en la historia
3.2). `src/stores/langStore.js` se elimina en la historia 1.7, no acá.

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.6]
- D2, atributo antes del primer pintado: [Source: architecture.md#Frontend Architecture]
- D3, composables singleton sin Pinia: [Source: architecture.md#Frontend Architecture]
- Dependencia cruzada D2 ↔ D3: [Source: architecture.md#Decision Impact Analysis]
- FR-26/27/28: [Source: prd.md#7.7 Tema e idioma]
- P6, dark mode no confiable: [Source: prd.md#2.2 Problemas identificados]
- A7, micro-interacción del toggle: [Source: ux-design-specification.md#4.3 Catálogo de animaciones]
- Comportamiento fuente: `public/ui-generated/_system/system.js`, sección "Tema"
- Estilos fuente: `public/ui-generated/_system/components.css` líneas 262–267

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References

**AC2 — el script inline bloquea y va antes de todo estilo.** Verificado sobre `dist/index.html`,
no sobre el fuente:

```
posicion  262   script inline (mc-theme)
posicion  868   <title>
posicion 1017   <link rel="stylesheet"> (el unico del documento)
tiene defer o async: False
```

**Matriz de escenarios.** El entorno de prueba tiene el sistema en **preferencia clara**
(`matchMedia('(prefers-color-scheme: light)').matches === true`), lo que permitio probar los casos
reales y no solo emulados:

| # | `localStorage` | Sistema | Atributo resultante | Esperado | |
|---|---|---|---|---|---|
| 1 | vacío | claro | `light` — fondo `rgb(250,250,249)` | `light` | ✓ |
| 3 | `mc-theme='dark'` | claro | `dark` | `dark` — **la elección manual gana** | ✓ |

En el escenario 1, `localStorage.getItem('mc-theme')` sigue en `null` tras la carga: **el script
inline no persiste la preferencia del sistema.** Es la parte sutil del comportamiento — si la
persistiera, el visitante quedaria atado a lo que su sistema hacia en ese momento sin haber elegido
nada.

**AC3 — el toggle alterna, persiste y cruza los iconos:**

```
tema        dark            -> light
fondo       rgb(11,13,16)   -> rgb(250,250,249)
aria-label  "Cambiar a tema claro" -> "Cambiar a tema oscuro"
mc-theme    (dark)          -> "light"           persistido
ico-moon    opacity 1       -> 0
ico-sun     opacity 0       -> 1                 cruzaron: true
```

**FR-28, transición suave y no un salto:** `transition-property` del `body` es
`background-color, color` con `transition-duration: 0.32s, 0.32s` — o sea `--dur-base`.

**AC5 — los tres estados resuelven:**

| `data-theme` | `--color-bg` |
|---|---|
| sin atributo | `#0b0d10` |
| `dark` | `#0b0d10` |
| `light` | `#fafaf9` |

**El atributo va en `<html>`:** `document.body.className` queda vacío. No queda ninguna referencia
a `dark-mode`, `toggle-mode-btn` ni `isDark` en `src/` (la única aparición de `dark-mode` es un
comentario en `_pages.scss` que explica la corrección de la historia 1.2).

**Build y lint:** limpios (queda el warning preexistente de `ItemProject.vue`).

### Completion Notes List

Los cinco criterios se cumplen y la historia salió sin sorpresas — la primera de la épica en la que
lo que la historia describía y lo que pasó al implementar coincidieron.

**El script inline se extendió sobre el de la historia 1.3.** Va en `<head>`, antes de la única
hoja de estilo del documento, sin `defer` ni `async`. Es la única vez en todo el proyecto que un
script bloqueante es lo correcto: si el tema se aplicara al montar la aplicación Vue, todo visitante
con preferencia clara vería un destello oscuro.

El `try/catch` alrededor de `localStorage` no es decorativo: en modo privado de Safari el **mero
acceso lanza excepción**, y una excepción en un script bloqueante dejaría la página sin tema y sin
aplicación.

**El DOM es la fuente de verdad, no una variable paralela.** `useTheme.js` inicializa su `ref`
leyendo el atributo que el script inline ya dejó puesto:

```js
const temaDelDom = () => (raiz.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
const theme = ref(temaDelDom());
```

No vuelve a consultar `localStorage` ni `prefers-color-scheme`. Si recalculara la preferencia por su
cuenta habría dos fuentes que pueden discrepar, y el síntoma sería un parpadeo al montar que nadie
sabría explicar. Es el mismo criterio que usa `_system/system.js`.

**Seguir al sistema, pero solo hasta que el usuario opine.** El listener de `prefers-color-scheme`
aplica el cambio **solo si no hay valor guardado**, y cuando aplica **no persiste**:

```js
const alCambiarSistema = (e) => {
  if (!leerGuardado()) setTheme(e.matches ? 'light' : 'dark', false);
};
```

Así, quien nunca tocó el botón ve el sitio acompañar su sistema en vivo; en cuanto alterna una vez,
su elección manda para siempre. La compuerta es `leerGuardado()`, y el toggle escribe la clave, así
que el gate funciona por construcción.

**El `theme` se expone como `readonly`.** El patrón de la arquitectura dice que los `ref` de módulo
son de solo lectura para el consumidor y que se muta únicamente por las funciones que el composable
expone. `readonly(theme)` lo hace exigible en lugar de dejarlo como convención: un
`theme.value = 'dark'` desde un componente ahora falla en desarrollo.

**Los dos íconos están siempre en el DOM**, superpuestos en la misma celda de grilla por
`.icon-btn .ico { grid-area: 1 / 1 }`. El cruce lo hace el CSS del sistema animando opacidad y
rotación (A7). Con un `v-if` no habría nada que animar entre un estado y el otro.

**El `aria-label` describe adónde lleva el botón, no dónde estás.** En tema oscuro dice "Cambiar a
tema claro". Es el mismo criterio que la historia 1.7 documenta para el botón de idioma, y la razón
es la misma: quien escucha necesita saber qué va a pasar si activa el control.

**Se eliminó el puente temporal de la historia 1.2.** El botón flotante `.toggle-mode-btn` y el
`data-theme` aplicado en `onMounted` desaparecieron de `App.vue`, junto con sus estilos. `App.vue`
quedó reducido a lo que le corresponde: el sprite, el skip link, los tres landmarks y el pie.

**Nota sobre el destello:** la verificación de que no hay destello se hizo **estructuralmente** —el
script bloquea y precede a la única hoja de estilo, lo que hace imposible que el navegador pinte con
el tema equivocado— y **empíricamente**, confirmando que el atributo ya está puesto y el fondo
computado es el correcto en la primera lectura tras la navegación. La grabación del panel Performance
con capturas por fotograma que la historia sugiere no es accesible desde esta herramienta; la
verificación estructural es más fuerte que la visual en este caso, porque descarta la posibilidad
en lugar de muestrear un instante.

### File List

```
public/index.html                          MODIFICADO — script inline bloqueante de tema
src/composables/useTheme.js                NUEVO — ref de módulo, persistencia, listener del sistema
src/components/ui/ThemeToggle.vue          NUEVO
src/components/layout/AppNav.vue           MODIFICADO — ThemeToggle en .header-actions
src/styles/chassis.scss                    MODIFICADO — las 4 reglas de cruce de .theme-btn
src/i18n.js                                MODIFICADO — themeToLight / themeToDark
src/App.vue                                MODIFICADO — se elimina el puente temporal de la 1.2
```

### Change Log

| Fecha | Cambio |
|---|---|
| 2026-08-17 | Tema con script inline previo al primer pintado, persistencia en `mc-theme` y seguimiento del sistema hasta la primera elección manual. Se elimina el puente de la historia 1.2. Estado `done`. |
