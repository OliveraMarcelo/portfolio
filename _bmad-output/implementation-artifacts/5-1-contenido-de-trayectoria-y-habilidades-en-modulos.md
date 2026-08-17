# Story 5.1: Contenido de trayectoria y habilidades en módulos

Status: ready-for-dev

## Story

As a mantenedor,
I want la trayectoria y las habilidades como datos y no como markup,
so that actualizarlas no implique tocar el diseño.

## Acceptance Criteria

**AC1 — Forma de `timeline.js`**

**Given** el módulo `src/content/timeline.js`
**When** se define
**Then** cada hito tiene tipo (`education` / `work` / `personal`), un período con `{ from, to }` donde `to: null` significa "actualidad", y textos en ES y EN

**AC2 — Contenido real de la trayectoria**

**Given** el contenido real del PRD
**When** se carga
**Then** incluye la formación (IFTS N.º 11, Digital House), la experiencia en EXO S.A. con Flutter, Riverpod, Dart y Vue.js, los proyectos personales y el perfil personal (FR-18)

**AC3 — Forma de `skills.js`**

**Given** el módulo `src/content/skills.js`
**When** se define
**Then** agrupa las habilidades en Frontend, Backend y Herramientas, con los ítems reales del PRD (FR-21)

**AC4 — Sin texto de contenido en los templates**

**Given** ambos módulos
**When** se revisan las vistas
**Then** ningún texto de trayectoria ni de habilidades queda literal en un template

## Tasks / Subtasks

- [ ] **Tarea 1 — Crear `timeline.js`** (AC: #1, #2)
  - [ ] Array ordenado cronológicamente; el orden del array **es** el orden de presentación
  - [ ] Campos por hito: `id`, `type`, `period: { from, to }`, e `i18n` con `role`, `org` y `text` por idioma
  - [ ] `to: null` en el hito en curso; nunca la cadena `"actualidad"` ni `"presente"` (ver §El período es un dato, no un texto)
  - [ ] Contenido real de la tabla de §Los hitos reales

- [ ] **Tarea 2 — Crear `skills.js`** (AC: #3)
  - [ ] Tres grupos: `frontend`, `backend`, `tools`
  - [ ] Cada grupo con su etiqueta traducible y su lista de ítems
  - [ ] Cada ítem con `name` y el nombre del ícono del sprite si existe (ver §Los íconos de habilidad y el sprite)

- [ ] **Tarea 3 — Etiquetas de grupo en los locales** (AC: #3, #4)
  - [ ] "Frontend", "Backend" y "Herramientas" / "Tools" van a `src/locales/{es,en}.json`
  - [ ] Los nombres de las tecnologías —Vue, Docker, SQL— **no** se traducen y van en el módulo

- [ ] **Tarea 4 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Paridad ES/EN en todos los hitos (ver §Comandos de verificación)
  - [ ] Confirmar que ningún hito usa texto para el período
  - [ ] Confirmar que el contenido coincide con el PRD y no hay nada inventado

## Dev Notes

Misma decisión que la historia 4.1, aplicada a la trayectoria y las habilidades: **D4, fuente única de
contenido en `src/content/`, con los textos traducibles dentro del dato.**

Esta historia no cambia nada visible. Habilita las historias 5.2, 5.4 y 5.5.

### Los hitos reales

Del PRD §7.4, que es la fuente autorizada. **No inventes fechas, cargos ni tecnologías.**

| tipo | organización | rol / título | notas del PRD |
|---|---|---|---|
| `education` | IFTS N.º 11 | Desarrollo de Software | 1.º año |
| `education` | Digital House | Full Stack Developer | tiene certificado (historia 5.3) |
| `work` | EXO S.A. | Frontend Developer | Flutter, Riverpod y Dart para web, mobile y escritorio Windows; Vue.js para dashboards |
| `personal` | — | Proyectos personales | los tres proyectos de `projects.js` |
| `personal` | — | Perfil personal | autodidacta; guitarra y canto |

**Los años no están en el PRD.** No los inventes: dejá `from` y `to` con un comentario `TODO` visible
para que Marcelo los complete, o consultale antes de cerrar la historia. Una fecha inventada en un CV es
peor que una fecha ausente.

El prototipo tiene textos para estos hitos en `sobre-mi/page.js` (claves `tl.1.*`, `tl.2.*`, `tl.3.*`,
`side.*`). Son un buen punto de partida en ambos idiomas — revisalos contra el PRD antes de adoptarlos y
corregí lo que no coincida.

### El período es un dato, no un texto

```js
period: { from: 2023, to: null }     // ✅ en curso
period: { from: 2021, to: 2022 }     // ✅ terminado
period: { from: 2023, to: 'actual' } // ❌
```

El patrón de la arquitectura es explícito: sin fechas en formato libre, y `to: null` significa
"actualidad".
[Source: architecture.md#Format Patterns]

Tres razones concretas:

1. **Se traduce solo.** "2023 — actualidad" y "2023 — present" son dos formatos de presentación del mismo
   dato. Si guardás el texto, necesitás la palabra en los dos idiomas dentro del contenido.
2. **Se puede ordenar.** Un array de hitos con años numéricos se ordena; uno con cadenas, no.
3. **La etiqueta "En curso"** que el CSS del prototipo estiliza con `.milestone-tag.is-now` se deriva de
   `to === null`. Si el dato fuera texto, habría que compararlo contra una cadena.

El formateo —"2023 — actualidad"— es responsabilidad del componente `TimelineItem` (historia 5.2), con la
palabra saliendo de los locales.

### Los íconos de habilidad y el sprite

El sprite de la historia 1.4 tiene once símbolos, y **ninguno es de una tecnología**: no hay ícono de Vue,
de Docker ni de Node.

`src/assets/icons/` tiene PNG de tecnologías (`vue.png`, `react.png`, `flutter.png`, `js.png`, `html-5.png`,
`css-3.png`), que es lo que el sitio usa hoy.

Tres caminos, y hay que elegir uno explícitamente:

1. **Sin íconos.** Los grupos con tipografía y listas. El CSS del prototipo (`.skill .ico`) espera un ícono
   y su hover lo rota, así que perderías esa micro-interacción de A7.
2. **Sumar los íconos de tecnología al sprite** como SVG de trazo, en el estilo del resto. Es el camino
   coherente con D9 y D14, pero significa conseguir u dibujar seis u ocho símbolos.
3. **Seguir usando los PNG.** Contradice D9 y no siguen el color del tema, que es todo el punto del sprite.

**Recomendación: la 2**, sumando los símbolos al sprite en la historia 5.4 cuando se implemente la grilla.
En esta historia, dejá en `skills.js` un campo `icon` con el nombre previsto (`'vue'`, `'docker'`) y un
comentario apuntando a la decisión. Así el dato queda listo y la decisión visual se toma con la grilla
delante.

**No** uses los PNG. Y no dejes el campo sin definir: eso obliga a la historia 5.4 a rediseñar el dato.

### Las habilidades reales

Del PRD §7.5:

- **Frontend:** HTML, CSS, JavaScript, Vue, React, Flutter
- **Backend:** Node.js, Express, SQL/NoSQL
- **Herramientas:** Git, Docker

Nada más. No agregues tecnologías porque "seguro también sabe".

### Los nombres de tecnología no se traducen

"Vue" es "Vue" en los dos idiomas. Solo las **etiquetas de grupo** —"Herramientas" / "Tools"— y los textos
narrativos de los hitos se traducen.

Por eso los nombres van en el módulo y las etiquetas en los locales: es la misma frontera que la historia
1.7 estableció, aplicada acá.

### Guardarraíles

- ❌ **No** inventes fechas, cargos, organizaciones ni tecnologías.
- ❌ **No** guardes el período como texto.
- ❌ **No** uses `''` ni omitas campos para representar ausencia. `null` explícito.
- ❌ **No** traduzcas los nombres de las tecnologías.
- ❌ **No** pongas rutas de asset en el módulo.
- ❌ **No** uses los PNG de `assets/icons/`.
- ❌ **No** dejes el campo `icon` sin definir.
- ❌ **No** reordenes los hitos en la vista. El orden del array manda.
- ❌ **No** construyas todavía `TimelineSection` ni `SkillGrid`: son las historias 5.2 y 5.4.
- ❌ **No** toques el certificado: es la 5.3.
- ❌ **No** mutes los módulos.

### Comandos de verificación

```bash
# Sin texto de trayectoria ni habilidades en los templates
grep -rn "EXO\|Digital House\|IFTS\|Riverpod" src/views/ src/components/

# Sin períodos como texto
grep -n "actual\|presente\|present\|hoy" src/content/timeline.js
```

En Node o en el navegador:

```js
import { timeline } from '@/content/timeline'
import { skills } from '@/content/skills'

// Paridad de idiomas en todos los hitos
timeline.every(h => ['role','org','text'].every(k =>
  (h.i18n.es[k] ?? null) !== undefined && (h.i18n.en[k] ?? null) !== undefined))

// Los períodos son numéricos o null
timeline.map(h => [h.period.from, h.period.to])

// Tres grupos con los ítems del PRD
Object.keys(skills)                     // ['frontend','backend','tools']
skills.frontend.items.length            // 6
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; paridad ES/EN en
todos los hitos; períodos numéricos o `null`; contenido coincidente con el PRD; ningún texto de contenido
en los templates; consola sin errores.

### Project Structure Notes

```
src/content/timeline.js      NUEVO
src/content/skills.js        NUEVO
src/locales/{es,en}.json     MODIFICADO — etiquetas de grupo y la palabra "actualidad"
```

`src/content/` ya existe desde la historia 4.1. Falta `contact.js`, que llega en la 6.1.

### References

- Historia y criterios: [Source: epics.md#Story 5.1]
- D4, fuente única de contenido: [Source: architecture.md#Data Architecture]
- Patrón de fechas y ausencia: [Source: architecture.md#Format Patterns]
- D9, sprite SVG: [Source: architecture.md#Frontend Architecture]
- FR-18, FR-21: [Source: prd.md#7.4 y #7.5]
- NFR-16: [Source: prd.md#8.4]
- Textos de referencia del prototipo: `public/ui-generated/sobre-mi/page.js`, diccionario

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
