# Story 1.7: Idioma que se recuerda y cambia toda la interfaz

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitante internacional,
I want leer el sitio en inglés y que lo recuerde,
so that no tenga que cambiar el idioma en cada página.

## Acceptance Criteria

**AC1 — Locales en archivos propios**

**Given** los archivos `src/locales/es.json` y `src/locales/en.json` con las claves de interfaz del chasis
**When** se cargan desde un `src/i18n.js` reducido a la creación de la instancia
**Then** todo texto del header y del pie se resuelve por i18n
**And** ningún texto visible del chasis queda literal en el template (NFR-16)

**AC2 — Alternancia, persistencia y atributo `lang`**

**Given** el composable `src/composables/useLocale.js` y el componente `LangToggle.vue`
**When** el visitante alterna entre ES y EN
**Then** los textos del chasis cambian de idioma
**And** el valor se guarda en `localStorage` bajo la clave `mc-lang` (FR-29)
**And** el atributo `lang` de `<html>` se actualiza al nuevo idioma (FR-30)
**And** la posición de scroll se mantiene

**AC3 — Idioma antes del primer pintado**

**Given** el script inline de la historia 1.6
**When** se ejecuta al cargar
**Then** también lee `mc-lang` y estampa `lang` sobre `document.documentElement` antes del primer pintado
**And** usa exactamente las mismas claves que el composable

**AC4 — El store roto desaparece**

**Given** el archivo `src/stores/langStore.js`, que hoy invoca `useI18n()` fuera de un contexto de `setup()`
**When** se elimina junto con la carpeta `src/stores/`
**Then** ninguna importación del proyecto lo referencia

**AC5 — Paridad de claves**

**Given** los dos archivos de locale
**When** se comparan sus conjuntos de claves
**Then** son idénticos: ninguna clave existe en uno y falta en el otro

## Tasks / Subtasks

- [ ] **Tarea 1 — Extraer los locales** (AC: #1, #5)
  - [ ] Crear `src/locales/es.json` y `src/locales/en.json`
  - [ ] Migrar las claves de interfaz que hoy están embebidas en `src/i18n.js`
  - [ ] Sumar las claves del chasis que faltan (ver §Claves del chasis)
  - [ ] Estructura anidada por dominio: `nav.home`, `a11y.skip`, `footer.made` — no claves planas con puntos literales
  - [ ] **No** migres todavía los textos de contenido (proyectos, trayectoria): van a `src/content/` en sus épicas

- [ ] **Tarea 2 — Reducir `i18n.js`** (AC: #1)
  - [ ] `src/i18n.js` queda solo con el import de los dos JSON y el `createI18n`
  - [ ] Conservar `legacy: false`, `locale`, `fallbackLocale: 'en'`
  - [ ] El `locale` inicial se lee del atributo `lang` que el script inline ya dejó puesto
  - [ ] Borrar el comentario `// Agrega aquí más textos según los que encuentres en la app`

- [ ] **Tarea 3 — Extender el script inline** (AC: #3)
  - [ ] Sumar al bloque de la historia 1.6 la lectura de `mc-lang` y el `setAttribute('lang', …)`
  - [ ] Default `'es'` si no hay valor guardado ni valor válido
  - [ ] Mismo `try/catch`, misma convención de claves `mc-`

- [ ] **Tarea 4 — Composable `useLocale.js`** (AC: #2, #4)
  - [ ] `src/composables/useLocale.js` con la misma forma que `useTheme`: `ref` de módulo, no estado por componente
  - [ ] Exponer `{ locale, setLocale, toggleLocale }`
  - [ ] `setLocale(valor)` actualiza el `locale` de vue-i18n, estampa `lang` en `<html>` y persiste en `mc-lang`
  - [ ] **No** llames a `useI18n()` dentro del composable: usá la instancia de i18n importada directamente (ver §Por qué el store actual está roto)

- [ ] **Tarea 5 — Componente `LangToggle.vue`** (AC: #2)
  - [ ] Markup canónico `<button class="lang-btn">` con `.lang-current`, `.lang-sep` y `.lang-other`
  - [ ] `.lang-current` muestra el idioma activo; `.lang-other`, el otro
  - [ ] `aria-label` en el **idioma de destino**, no en el activo (ver §El `aria-label` del botón de idioma)
  - [ ] Reemplaza el botón de idioma provisorio que la historia 1.5 dejó en `AppNav.vue`

- [ ] **Tarea 6 — Eliminar el store roto** (AC: #4)
  - [ ] Borrar `src/stores/langStore.js` y la carpeta `src/stores/`
  - [ ] Verificar por `grep` que nada lo importa

- [ ] **Tarea 7 — Verificar** (AC: #1, #2, #3, #5)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Script de paridad de claves (§Comandos de verificación) sin diferencias
  - [ ] Alternar idioma a mitad de una vista larga y confirmar que el scroll no salta
  - [ ] Recargar tras alternar y confirmar que el idioma persiste
  - [ ] Confirmar que `<html lang>` cambia y que ya no está vacío

## Dev Notes

**D13 en la arquitectura: locales en archivos separados, con el contenido fuera del catálogo.**
Los textos de interfaz y los de contenido tienen ciclos de vida distintos: las etiquetas cambian
cuando cambia el diseño, el contenido cambia cuando Marcelo suma un proyecto. Mezclarlos en un
solo catálogo es exactamente el estado actual —51 líneas que terminan en un `// Agrega aquí más
textos`— y es la razón por la que hoy la cobertura está incompleta.
[Source: architecture.md#Frontend Architecture, D13]

Esta historia cierra la Épica 1. Al terminarla, el chasis está completo, tematizado y bilingüe, y
la infraestructura para que **cada épica siguiente entregue sus claves en ES y EN sobre la
marcha** queda instalada. Es la decisión que aparta este plan del PRD, que ubicaba la cobertura
i18n en su fase F3: si las épicas 2 a 6 escribieran texto literal para traducirlo después, habría
que rehacer cada pantalla.

### Por qué el store actual está roto

`src/stores/langStore.js` hace esto:

```js
const state = reactive({ locale: 'es' });

export function useLangStore() {
  const { locale } = useI18n();   // ← acá está el problema
  ...
}
```

`useI18n()` es una función de composición: **solo puede invocarse dentro del `setup()` de un
componente**. Llamarla desde una función exportada que puede invocarse en cualquier contexto es
un error de diseño que funciona por accidente cuando se la llama desde un `setup()` y explota
cuando no. Además mantiene un `state.locale` paralelo al `locale` de vue-i18n: dos fuentes de
verdad para el mismo dato.

No es un refactor, es una reescritura. `useLocale.js` debe importar la instancia de i18n
directamente:

```js
import i18n from '@/i18n'
// ...
i18n.global.locale.value = valor
```

Así el composable funciona desde cualquier lado —incluido un guard del router, que es lo que la
historia 2.1 va a necesitar para retraducir el título del documento.

### El atributo `lang` estaba vacío

`public/index.html` tiene hoy `<html lang="">`. Un `lang` vacío es peor que ausente: los lectores
de pantalla no pueden elegir la voz ni la pronunciación, y es un fallo directo de auditoría de
accesibilidad. Esta historia lo llena en dos momentos:

1. **Antes del primer pintado**, desde el script inline (mismo bloque que el tema).
2. **Al alternar**, desde `useLocale`.

Dejá el atributo literal del template como `<html lang="es">` de todos modos, para que el
documento sea válido incluso si el script inline fallara.

### El script inline queda así

Extendiendo el de la historia 1.6:

```html
<script>
  (function () {
    var d = document.documentElement;
    var t = null, l = null;
    try {
      t = localStorage.getItem('mc-theme');
      l = localStorage.getItem('mc-lang');
    } catch (e) { /* noop */ }

    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (l !== 'es' && l !== 'en') l = 'es';

    d.setAttribute('data-theme', t);
    d.setAttribute('lang', l);
  })();
</script>
```

Las claves `mc-theme` y `mc-lang` tienen que ser **literalmente** las mismas acá y en los dos
composables. Si divergen, el síntoma es un destello en cada carga sin ningún error en consola.

### Claves del chasis

El diccionario del chasis, verificado en `_system/system.js`. Estas son las claves mínimas que
los dos locales deben tener al terminar la historia:

| Clave | ES | EN |
|---|---|---|
| `nav.home` | Inicio | Home |
| `nav.projects` | Proyectos | Projects |
| `nav.about` | Sobre mí | About |
| `nav.aria` | Navegación principal | Main navigation |
| `theme.toLight` | Cambiar a tema claro | Switch to light theme |
| `theme.toDark` | Cambiar a tema oscuro | Switch to dark theme |
| `lang.aria` | Switch site language to English | Cambiar el idioma del sitio a español |
| `menu.open` | Abrir menú | Open menu |
| `menu.close` | Cerrar menú | Close menu |
| `a11y.logo` | MarceCode — ir al inicio | MarceCode — go to home |
| `a11y.skip` | Saltar al contenido | Skip to content |
| `footer.made` | Hecho con Vue | Built with Vue |

`menu.open` y `menu.close` se agregan ahora aunque el botón de menú llegue en la historia 2.4:
tener las claves listas evita volver a tocar los locales.

Migrá además las claves de interfaz que ya existen en `src/i18n.js` (`downloadCV`, `contact`,
etc.). Las de contenido —`onlineStoreTitle`, `pokemonGameDesc`, `realtimeMessagingDesc`— **no**:
esas se van a `src/content/projects.js` en la historia 4.1. Podés dejarlas donde están hasta
entonces o moverlas a una sección temporal de los locales; lo que no hay que hacer es
consolidarlas como si fueran definitivas.

### El `aria-label` del botón de idioma

Notá la aparente inversión en la tabla: la clave `lang.aria` en el diccionario **español** dice
"Switch site language to English". No es un error de traducción.

El botón anuncia **la acción**, y la acción lleva al otro idioma. Un visitante anglófono que llega
al sitio en español necesita que su lector de pantalla le diga, en inglés, que ese botón cambia a
inglés. Si el `aria-label` estuviera en español, quien no lee español no entiende para qué sirve
el control que le permitiría entender el resto.

Mismo criterio para `theme.toLight` / `theme.toDark`: la etiqueta describe adónde te lleva el
botón, no dónde estás.

### El scroll no se puede perder

FR-29 y el recorrido J4 piden que al alternar idioma la posición de scroll se mantenga. Con
vue-i18n cambiando `locale.value` en caliente, Vue re-renderiza los textos **sin desmontar los
componentes**, así que el scroll se conserva solo.

Se rompe si hacés cualquiera de estas cosas — y por eso están prohibidas:

- Recargar la página (`location.reload()`) para aplicar el idioma.
- Poner el idioma en la URL y navegar.
- Forzar el remontaje con una `key` en `<RouterView>`.

Probalo en la vista más larga que tengas, scrolleando bien abajo antes de alternar.

### Un efecto que aparece recién en la 2.2

Al cambiar de idioma, las etiquetas del nav cambian de ancho: "Sobre mí" y "About" no miden lo
mismo. El indicador animado de la ruta activa se posiciona según ese ancho, así que tiene que
recalcularse en el cambio de idioma y no solo en el cambio de ruta. En el design system esto se
ve como `requestAnimationFrame(placeIndicator)` dentro de `aplicarIdioma`.

**No implementes el indicador acá** — es la historia 2.2. Se menciona para que, cuando llegue, el
recálculo por idioma no aparezca como sorpresa.

### Guardarraíles — qué NO hacer en esta historia

- ❌ **No** llames a `useI18n()` fuera de un `setup()`. Es el bug que esta historia elimina.
- ❌ **No** mantengas un `state.locale` paralelo al `locale` de vue-i18n.
- ❌ **No** recargues la página ni navegues para aplicar el idioma.
- ❌ **No** pongas el idioma en la URL. No hay rutas por idioma en el alcance.
- ❌ **No** uses una clave distinta de `mc-lang`.
- ❌ **No** instales Pinia (D3), `vue-i18n-routing` ni `@intlify/unplugin-vue-i18n`. Este último
  es una palanca de tamaño de bundle que la arquitectura deja para medir en la Épica 7, no acá.
- ❌ **No** actives el modo legacy de vue-i18n. `legacy: false` se queda.
- ❌ **No** migres los textos de proyectos ni de trayectoria a los locales: van a `src/content/`.
- ❌ **No** agregues un tercer idioma. El PRD lo excluye explícitamente del alcance.
- ❌ **No** implementes el indicador animado del nav.

### Comandos de verificación

Paridad de claves entre los dos locales:

```bash
python3 - <<'PY'
import json
def claves(p, pre=''):
    d = json.load(open(p))
    out = set()
    def rec(o, k):
        for kk, vv in o.items():
            nk = f'{k}.{kk}' if k else kk
            rec(vv, nk) if isinstance(vv, dict) else out.add(nk)
    rec(d, pre)
    return out
es, en = claves('src/locales/es.json'), claves('src/locales/en.json')
print('solo en es:', sorted(es - en) or 'ninguna')
print('solo en en:', sorted(en - es) or 'ninguna')
print('total:', len(es))
PY
```

```bash
# El store roto no existe ni se referencia
grep -rn "langStore\|useLangStore" src/

# useI18n solo dentro de componentes
grep -rn "useI18n" src/
```

En el navegador:

```js
document.documentElement.lang              // 'es' o 'en', nunca ''
localStorage.getItem('mc-lang')

// Alternar y confirmar que el scroll no se movió
window.scrollTo(0, 800)
// …clic en el botón de idioma…
window.scrollY                             // sigue en 800
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable:

1. `npm run build` sin errores; `npm run lint` sin advertencias.
2. El script de paridad no reporta diferencias.
3. Alternar idioma cambia todos los textos del chasis, en las tres vistas.
4. El scroll se mantiene al alternar en una vista larga.
5. Recargar tras alternar conserva el idioma.
6. `<html lang>` refleja el idioma activo y nunca queda vacío.
7. Consola sin errores.

### Project Structure Notes

```
src/locales/es.json                     NUEVO
src/locales/en.json                     NUEVO
src/i18n.js                             MODIFICADO — reducido a createI18n
src/composables/useLocale.js            NUEVO — reemplaza stores/langStore.js
src/components/ui/LangToggle.vue        NUEVO
src/components/layout/AppNav.vue        MODIFICADO — LangToggle reemplaza el botón provisorio
public/index.html                       MODIFICADO — el script inline suma lang; <html lang="es">
src/stores/langStore.js                 ELIMINADO
src/stores/                             ELIMINADO
```

Con esta historia `src/stores/` desaparece del proyecto: la arquitectura absorbe esa carpeta en
`src/composables/` (D3).

### References

- Historia y criterios de aceptación: [Source: epics.md#Story 1.7]
- D13, locales separados del contenido: [Source: architecture.md#Frontend Architecture]
- D3, composables singleton sin Pinia: [Source: architecture.md#Frontend Architecture]
- D2, atributo antes del primer pintado: [Source: architecture.md#Frontend Architecture]
- FR-29/30: [Source: prd.md#7.7 Tema e idioma]
- P5, bilingüismo roto: [Source: prd.md#2.2 Problemas identificados]
- J4, recorrido de cambio de idioma: [Source: prd.md#4.2 Recorridos críticos]
- R3, mantenimiento del i18n: [Source: prd.md#9 Riesgos]
- NFR-09/16: [Source: prd.md#8.2 y #8.4]
- Diccionario fuente: `public/ui-generated/_system/system.js`, constante `I18N`

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
