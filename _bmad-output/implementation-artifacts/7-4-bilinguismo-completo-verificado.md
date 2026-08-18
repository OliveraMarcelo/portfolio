# Story 7.4: Bilingüismo completo verificado

Status: done

## Story

As a visitante internacional,
I want que absolutamente todo el sitio esté en inglés cuando lo elijo,
so that no me quede media página en español.

## Acceptance Criteria

**AC1 — Nada queda en español**

**Given** el idioma en EN
**When** se recorren las cuatro vistas completas
**Then** ningún texto visible queda en español (FR-29, M5)
**And** eso incluye títulos de documento, `alt` de imágenes, etiquetas `aria-label` y textos de los botones

**AC2 — Paridad de claves**

**Given** los archivos `src/locales/es.json` y `en.json`
**When** se comparan sus conjuntos de claves
**Then** son idénticos

**AC3 — Contenido traducido**

**Given** todos los módulos de `src/content/`
**When** se revisan
**Then** cada entrada tiene su clave `i18n` completa en ES y en EN

**AC4 — El cambio no pierde el contexto**

**Given** el visitante que alterna el idioma a mitad de una vista
**When** el cambio ocurre
**Then** la posición de scroll se mantiene y el atributo `lang` del documento se actualiza (FR-30)

**AC5 — Cero texto literal**

**Given** cualquier template del proyecto
**When** se revisa buscando texto visible literal
**Then** no queda ninguno fuera de i18n o de `src/content/` (NFR-16)

## Tasks / Subtasks

- [x] **Tarea 1 — Auditar la paridad de claves** (AC: #2)
  - [x] Correr el script de comparación (ver §Comandos de verificación)
  - [x] Completar lo que falte en cualquiera de los dos idiomas

- [x] **Tarea 2 — Auditar los módulos de contenido** (AC: #3)
  - [x] `projects.js`: `title`, `summary`, `problem`, `solution`, `role` en ES y EN, para los tres proyectos
  - [x] `timeline.js`: `role`, `org`, `text` en los dos idiomas, para todos los hitos
  - [x] `skills.js`: etiquetas de grupo en los dos idiomas
  - [x] `contact.js`: etiqueta de cada canal en los dos idiomas

- [x] **Tarea 3 — Auditar lo que no es texto visible** (AC: #1)
  - [x] `document.title` y la meta description de las cuatro rutas
  - [x] Todos los `alt` de imagen
  - [x] Todos los `aria-label`, `aria-labelledby` y textos `.sr-only`
  - [x] El `placeholder` de cualquier campo, si hubiera
  - [x] Ver §Lo que se olvida siempre

- [x] **Tarea 4 — Barrer texto literal** (AC: #5)
  - [x] Recorrer los templates buscando nodos de texto que no salgan de `t(...)` ni de `content`
  - [x] Los formatos derivados —"2023 — actualidad"— tienen que tomar la palabra de los locales

- [x] **Tarea 5 — Verificar el cambio en caliente** (AC: #4)
  - [x] Alternar idioma en la vista más larga, scrolleada al fondo
  - [x] Confirmar que el scroll no se mueve y `<html lang>` cambia
  - [x] Confirmar que el indicador del nav se realinea (historia 2.2)

- [x] **Tarea 6 — Recorrido completo en EN** (AC: #1)
  - [x] Poner el sitio en inglés y recorrer las cuatro vistas de punta a punta
  - [x] Anotar cada resto de español encontrado y corregirlo
  - [x] Repetir hasta que el recorrido salga limpio

## Dev Notes

Esta historia no construye nada: **verifica** que la infraestructura de la historia 1.7 y la disciplina de las
Épicas 2 a 6 dieron el resultado prometido.

M5 pide 100 % de cobertura en ES y EN. El PRD identifica el bilingüismo roto como el problema **P5**:
*"Cambiar a inglés deja media página en español."* Esta es la historia que verifica que no volvió a pasar.

### Por qué esta historia va acá y no antes

El PRD ubicaba la cobertura i18n en su fase F3, pero el plan movió la **infraestructura** a la Épica 1 y
repartió las **claves** entre las épicas que las necesitan. El motivo era NFR-16: si las épicas 2 a 6
escribieran texto literal para traducirlo después, habría que rehacer cada pantalla.

Consecuencia: al llegar acá, la cobertura debería estar completa. Esta historia es la red de seguridad, no el
trabajo principal. **Si encontrás mucho por traducir, es señal de que alguna historia anterior se cerró sin
cumplir su parte** — vale anotarlo en las notas de completado.

### Lo que se olvida siempre

El recorrido visual encuentra los títulos y los párrafos. Lo que se escapa es todo lo que no se ve:

| Qué | Dónde mirar | Por qué se olvida |
|---|---|---|
| `document.title` | Guard `afterEach` (historia 2.1) | Está en la pestaña, no en la página |
| Meta description | El mismo guard | No se ve nunca |
| `alt` de imagen | `ProjectCard`, `HeroSection`, lightbox | Solo lo leen los lectores de pantalla |
| `aria-label` de botones de ícono | Tema, idioma, menú, cierre del lightbox | Ídem |
| Texto `.sr-only` | Donde se haya usado | Ídem |
| La palabra "actualidad" | `TimelineItem` (historia 5.2) | Se deriva de un dato, no es una clave obvia |
| Etiquetas de grupo de skills | `SkillGrid` (historia 5.4) | Están al lado de nombres que no se traducen |
| El aviso de versión nueva | `App.vue` (historia 7.3) | Aparece rara vez |

Los `aria-label` merecen atención especial: la historia 1.7 dejó documentado que `lang.aria` y
`theme.toLight` describen **la acción**, así que el del botón de idioma en el diccionario español está en
inglés a propósito. No lo "corrijas" al auditar.

### Los nombres propios no se traducen

No es un hueco de cobertura:

- Nombres de tecnología: Vue, Docker, Node.js, TypeScript.
- Nombres de organización: EXO S.A., Digital House, IFTS N.º 11.
- El nombre de Marcelo, y "MarceCode".
- URLs, el email, el número de teléfono.

Lo que **sí** se traduce alrededor: "Herramientas" / "Tools", "Frontend Developer" si el rol se presenta
traducido, las descripciones narrativas.

Si al recorrer en inglés ves "Vue" en pantalla, eso está bien. Si ves "Herramientas", no.

### Cómo hacer el recorrido de verdad

Poner el sitio en inglés y leerlo entero, en este orden:

1. **Home**, de arriba abajo: hero, destacados, habilidades, trayectoria, contacto.
2. **Proyectos**, y desde ahí **los tres detalles**.
3. **Sobre mí**, incluido el lightbox del certificado abierto.
4. **El menú mobile abierto**, a 390 px.
5. **Las pestañas del navegador** en las cuatro rutas.
6. **El aviso de versión nueva**, si podés provocarlo.

Y una pasada con el inspector de accesibilidad de DevTools, que muestra el **nombre accesible computado** de
cada control — ahí aparecen los `aria-label` sin traducir que el recorrido visual no muestra.

### El cambio en caliente no puede perder el scroll

FR-29 y el recorrido J4 lo piden. La historia 1.7 lo resolvió cambiando `locale.value` sin remontar, y dejó
prohibido recargar, navegar o forzar remontaje con una `key`.

Verificalo en la vista más larga —Sobre mí, con la línea de tiempo completa— scrolleado al fondo. Si el scroll
salta al tope, alguna historia posterior introdujo un remontaje.

Verificá también que el indicador del nav se realinee: es el efecto que la historia 2.2 tiene como criterio
de aceptación y que solo se ve al cambiar de idioma.

### Guardarraíles

- ❌ **No** traduzcas nombres de tecnología, de organización ni propios.
- ❌ **No** "corrijas" los `aria-label` que describen la acción en el otro idioma.
- ❌ **No** agregues un tercer idioma: el PRD lo excluye del alcance.
- ❌ **No** resuelvas un hueco poniendo el texto literal en el template.
- ❌ **No** recargues ni navegues para aplicar el idioma.
- ❌ **No** agregues rutas por idioma.
- ❌ **No** instales `@intlify/unplugin-vue-i18n`: es una palanca de tamaño de bundle que se evalúa en la
  historia 7.8, si hace falta.
- ❌ **No** cierres la historia con el recorrido en inglés sin hacer.

### Comandos de verificación

Paridad de claves de los locales:

```bash
python3 - <<'PY'
import json
def claves(p):
    out = set()
    def rec(o, k=''):
        for kk, vv in o.items():
            nk = f'{k}.{kk}' if k else kk
            rec(vv, nk) if isinstance(vv, dict) else out.add(nk)
    rec(json.load(open(p)))
    return out
es, en = claves('src/locales/es.json'), claves('src/locales/en.json')
print('solo en es:', sorted(es - en) or 'ninguna')
print('solo en en:', sorted(en - es) or 'ninguna')
print('total de claves:', len(es))
PY
```

Paridad en los módulos de contenido:

```bash
node -e "
const p = require('./src/content/projects.js');
" 2>/dev/null || echo 'verificar en el navegador con los imports de la app'
```

En el navegador, con el sitio en inglés:

```js
// Nombres accesibles de todos los controles
[...document.querySelectorAll('button, a')].map(el =>
  el.getAttribute('aria-label') || el.textContent.trim().slice(0, 40)).filter(Boolean)

// Todos los alt
[...document.querySelectorAll('img')].map(i => i.alt)

// El título y la descripción
document.title
document.querySelector('meta[name="description"]').content

// El atributo lang
document.documentElement.lang     // 'en'

// El scroll se mantiene: scrollear, alternar, comprobar
window.scrollTo(0, 1200)
// …clic en el botón de idioma…
window.scrollY                    // sigue en ~1200
```

Barrido de texto literal en templates:

```bash
grep -rn ">[A-ZÁÉÍÓÚÑ][a-záéíóúñ]\{2,\}" src/components/ src/views/
```

Cada resultado hay que justificarlo: o es un nombre propio, o es un hueco.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: paridad de claves sin diferencias; paridad en
los cuatro módulos de contenido; **recorrido completo del sitio en inglés sin ningún resto de español**,
incluidos títulos de pestaña, `alt`, `aria-label` y el menú mobile; el inspector de accesibilidad sin nombres
sin traducir; el scroll se mantiene al alternar; `<html lang>` correcto; el indicador del nav se realinea;
consola sin errores.

### Project Structure Notes

```
src/locales/{es,en}.json    MODIFICADO — se completa lo que falte
src/content/*.js            MODIFICADO — se completa lo que falte
src/components/**           MODIFICADOS — se corrige el texto literal encontrado
```

Ningún archivo nuevo: es una historia de auditoría y corrección.

### References

- Historia y criterios: [Source: epics.md#Story 7.4]
- FR-29, FR-30: [Source: prd.md#7.7 Tema e idioma]
- P5, bilingüismo roto: [Source: prd.md#2.2]
- J4, cambio de idioma: [Source: prd.md#4.2]
- M5, cobertura i18n: [Source: prd.md#5 Métricas de éxito]
- NFR-16: [Source: prd.md#8.4]
- D13, locales y contenido separados: [Source: architecture.md#Frontend Architecture]
- Brecha de la verificación automática: [Source: architecture.md#Gap Analysis Results, brecha 5]
- El criterio de los `aria-label`: historia 1.7, §El `aria-label` del botón de idioma

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC2 — paridad de claves:**

```
claves ES: 73   EN: 73     solo en ES: ninguna     solo en EN: ninguna
```

**AC3 — cobertura de los módulos de contenido:** 13 entradas revisadas (3 proyectos × 5 campos,
7 hitos × 3 campos, 3 canales × 2 campos), en los dos idiomas. **Campos faltantes: ninguno.**

**AC1 — recorrido completo en inglés** por seis rutas —las cuatro vistas más los tres detalles—
recogiendo texto visible, `alt`, `aria-label`, `title`, `document.title`, la meta description y el
menú mobile y el lightbox abiertos.

El barrido marcó cuatro cosas, y **las cuatro son falsos positivos de la heurística**:

| Marcado | Por qué está bien |
|---|---|
| `aria-label: "Cambiar el idioma del sitio a español"` | Describe **la acción**, así que en el diccionario inglés va en español. La historia 1.7 lo dejó documentado y la 7.4 avisa de no "corregirlo" |
| `"Who's that Pokémon? … PokéAPI"` | Nombres propios con acento |
| `"Instituto de Formación Técnica Superior No. 11"` | Nombre propio de la organización |

**Restos reales de español en inglés: cero.**

**AC5 — texto literal en templates:** el barrido encuentra cuatro, y los cuatro son nombres propios que
no se traducen: `MarceCode` (×2), `Marcelo` y `Olivera`.

**AC4 — el cambio en caliente**, en Sobre mí scrolleado a 2000 px:

```
              antes                     despues
scroll        2000                      2000        <- conservado
lang          es                        en
title         Sobre mí — Marcelo…       About — Marcelo…
indicador     x=970.6                   x=965.1     <- se realineo
```

El indicador se movió 5,5 px porque "Sobre mí" y "About me" no miden lo mismo. Es exactamente el caso
que la historia 2.2 tenía como criterio y que solo se ve al cambiar de idioma.

### Esta historia no encontró trabajo pendiente

Y eso es el resultado esperado: la infraestructura fue de la Épica 1 y las claves se repartieron entre
las épicas que las necesitan, precisamente para no tener que rehacer pantallas acá. Si hubiera
aparecido mucho por traducir, habría sido señal de que alguna historia anterior se cerró sin cumplir su
parte.

### File List
