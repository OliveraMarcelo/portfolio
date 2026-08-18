# Story 6.3: Contacto alcanzable desde cualquier vista

Status: done

## Story

As a visitante en cualquier punto del sitio,
I want poder escribir sin volver a la portada,
so that el impulso de contactar no se pierda navegando.

## Acceptance Criteria

**AC1 — Los canales en el pie de las cuatro vistas**

**Given** cualquiera de las cuatro vistas del sitio
**When** el visitante llega al pie de página
**Then** los tres canales de contacto están disponibles como enlaces directos (FR-25)
**And** el pie los toma del mismo módulo `src/content/contact.js`

**AC2 — Orden completo de la Home**

**Given** la Home
**When** se recorre de arriba abajo
**Then** el orden de las secciones es hero → proyectos destacados → habilidades → resumen de trayectoria → contacto (FR-08)

**AC3 — Nunca más de un gesto**

**Given** cualquier vista y cualquier posición de scroll
**When** se cuenta la distancia hasta un canal de contacto
**Then** nunca supera un gesto: o la sección de contacto o el pie de página

## Tasks / Subtasks

- [x] **Tarea 1 — Cablear el pie al módulo** (AC: #1)
  - [x] En `AppFooter.vue`, reemplazar los valores literales que la historia 1.5 dejó por un `v-for` sobre `src/content/contact.js`
  - [x] Reutilizar la misma derivación de `target` y `rel` desde el campo `external` que la historia 6.2 (ver §El pie y la sección comparten la regla, no el markup)
  - [x] Íconos del sprite vía `AppIcon`
  - [x] Área táctil ≥ 44×44 px en cada enlace del pie

- [x] **Tarea 2 — Verificar el orden de la Home** (AC: #2)
  - [x] Recorrer la Home y confirmar las cinco secciones en el orden de FR-08
  - [x] Confirmar la alternancia de `.section` / `.section-alt` entre secciones consecutivas
  - [x] Confirmar que ninguna sección quedó duplicada al haberse construido en épicas distintas

- [x] **Tarea 3 — Auditar la distancia al contacto** (AC: #3)
  - [x] En cada una de las cuatro vistas, y con la página en el tope y en el fondo, confirmar que hay un canal a un gesto
  - [x] Documentar el resultado (ver §Qué significa "un gesto")

- [x] **Tarea 4 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Los tres canales del pie funcionan en las cuatro vistas
  - [x] El orden de la Home es el de FR-08
  - [x] Medir las áreas táctiles del pie
  - [x] Recorrer el pie con `Tab` en las cuatro vistas
  - [x] Verificar en 390 px y 1280 px, en los tres estados de tema
  - [x] Alternar idioma y confirmar que las etiquetas del pie cambian

## Dev Notes

Última historia de la Épica 6. Cierra dos cosas: el préstamo que la historia 1.5 tomó al dejar los contactos
literales en el pie, y la verificación formal del orden de secciones de la Home, que se construyó a lo largo
de cuatro épicas.

### Qué significa "un gesto"

FR-25 dice que el contacto es alcanzable desde cualquier punto del sitio en **un solo gesto**. Conviene
definirlo antes de auditarlo, porque si no queda como una afirmación que nadie puede verificar.

Un gesto = una acción del visitante que lo pone frente a un canal de contacto. Concretamente:

| Situación | Gesto | ¿Cumple? |
|---|---|---|
| Home, en el tope | Scrollear al pie de la Home → sección de contacto | ✅ |
| Home, a mitad | Ídem | ✅ |
| Proyectos, cualquier posición | Scrollear al pie → canales del pie | ✅ |
| Detalle de proyecto | Scrollear al pie → canales del pie | ✅ |
| Sobre mí | Scrollear al pie → canales del pie | ✅ |

Lo que hace que esto se cumpla es que **el pie está en las cuatro vistas** con los tres canales. El scroll
al pie cuenta como un gesto; tener que navegar a otra vista primero, no.

La sección de contacto de la historia 6.2 existe en la Home porque ahí es un destino con jerarquía propia,
no un reemplazo del pie.

### El pie y la sección comparten la regla, no el markup

Son dos presentaciones distintas del mismo dato:

- **`ContactSection`** (historia 6.2): destino, con encabezado, cards grandes, jerarquía visual.
- **`AppFooter`**: compacto, íconos con etiqueta accesible, al pie de todas las vistas.

**No** intentes usar `ContactSection` dentro del pie: la presentación es genuinamente distinta y forzarla
con una `variant` produciría un componente con dos layouts que no comparten casi nada.

Lo que **sí** hay que compartir es la **regla** de `target` / `rel` derivada del campo `external`. Si el pie
la reimplementa, el `mailto:` va a abrir una pestaña en blanco en el pie y no en la sección, o al revés.

Si la derivación quedó en más de un lugar, extraela: una función chica en el módulo de contenido, o un
componente `ContactLink` que las dos presentaciones envuelvan. Con dos usos, una función alcanza.

### El área táctil del pie es lo que hoy falla

El `FooterPage.vue` original usaba PNG de **30×30 px** como área clickeable. NFR-11 pide 44×44 px mínimo.

La historia 1.5 ya reemplazó esos PNG por íconos del sprite, pero el tamaño del área depende del padding
del enlace, no del ícono. Medilo: un `<a>` que contiene un `.ico` de 20 px sin padding mide 20 px.

Es el tipo de incumplimiento que Lighthouse marca en la historia 7.5 y que es mucho más barato arreglar acá.

### Verificar el orden de la Home es más que mirarla

La Home se construyó en cuatro épicas distintas: hero en la 3, destacados en la 4, habilidades y trayectoria
en la 5, contacto en la 6. Cada una agregó su sección sin ver las demás.

Dos cosas que pueden haber salido mal y que solo se ven ahora:

1. **Una sección duplicada.** Si la historia 5.4 agregó habilidades a la Home y la 5.5 también tocó la vista,
   puede haber quedado una repetida.
2. **La alternancia de fondo rota.** `.section` y `.section-alt` deberían alternar. Si dos consecutivas
   quedaron con la misma clase, se ven como un solo bloque largo y se pierde la separación.

Verificalo listando las clases de las secciones en orden, no leyendo el template.

### Con esto la Épica 6 cierra el alcance funcional

Al terminar esta historia, los 30 FRs del PRD están implementados. Lo que queda es la Épica 7, que **no
agrega funcionalidad**: verifica —midiendo, no suponiendo— que los 21 NFRs y las ocho métricas se alcanzan, y
cierra los frentes de assets, metadatos y actualización del PWA.

### Guardarraíles

- ❌ **No** uses `ContactSection` dentro del pie.
- ❌ **No** reimplementes la derivación de `target` / `rel` en el pie.
- ❌ **No** dejes valores de contacto literales en `AppFooter.vue`.
- ❌ **No** dejes áreas táctiles menores a 44×44 px en el pie.
- ❌ **No** agregues un botón flotante de contacto ni un widget de chat. Ningún FR lo pide y contradice el
  presupuesto de movimiento y D14.
- ❌ **No** quites la sección de contacto de la Home pensando que el pie alcanza: FR-23 pide la sección.
- ❌ **No** agregues los canales a `AppNav`: el pie y la sección son suficientes para FR-25.
- ❌ **No** escribas `aria-label` literales.
- ❌ **No** empieces a optimizar performance ni accesibilidad: es la Épica 7.

### Comandos de verificación

```bash
# Sin literales en el pie
grep -n "3432\|olivera.m.et13\|marcelodanielolivera\|wa.me" src/components/layout/AppFooter.vue

# La derivación de target/rel está en un solo lugar
grep -rn "noopener" src/
```

En el navegador, **en cada una de las cuatro vistas**:

```js
// Los tres canales están en el pie
document.querySelectorAll('.site-footer a[href]').length

// Áreas táctiles del pie
[...document.querySelectorAll('.site-footer a')]
  .map(a => { const r = a.getBoundingClientRect(); return [r.width, r.height] })
// todas >= 44 en las dos dimensiones

// target y rel correctos
[...document.querySelectorAll('.site-footer a')].map(a => [a.protocol, a.target, a.rel])
```

En la Home:

```js
// Orden y alternancia de secciones
[...document.querySelectorAll('main > section')].map(s => s.className)
// cinco secciones, en el orden de FR-08, alternando .section / .section-alt
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los tres canales del pie
funcionan **en las cuatro vistas**; áreas táctiles del pie ≥ 44×44 px; el orden de las cinco secciones de la
Home coincide con FR-08 y la alternancia de fondo es correcta; sin secciones duplicadas; el pie recorrido con
`Tab` en las cuatro vistas; las etiquetas del pie cambian de idioma; verificado en 390 px y 1280 px en los
tres temas; consola sin errores.

### Project Structure Notes

```
src/components/layout/AppFooter.vue    MODIFICADO — consume src/content/contact.js
src/views/HomeView.vue                  VERIFICAR — orden y alternancia de las cinco secciones
src/content/contact.js                  MODIFICADO (si se extrae la derivación de target/rel)
```

Ningún archivo nuevo. Con esta historia los 30 FRs quedan implementados.

### References

- Historia y criterios: [Source: epics.md#Story 6.3]
- FR-25, FR-23: [Source: prd.md#7.6 Contacto]
- FR-08, orden de la Home: [Source: prd.md#7.2]
- J3, contacto rápido: [Source: prd.md#4.2]
- NFR-11, área táctil: [Source: prd.md#8.2]
- D14, cero terceros: [Source: architecture.md#Authentication & Security]
- Préstamo de la historia 1.5: historia 1.5, §El pie conserva los contactos

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 — el pie en las cuatro vistas**, medido en cada una:

| Vista | Canales | Áreas | `mailto:` sin `target` | Externos con `rel` |
|---|---|---|---|---|
| `/` | 3 | 44×44 ×3 | ✓ | ✓ |
| `/projects` | 3 | 44×44 ×3 | ✓ | ✓ |
| `/about` | 3 | 44×44 ×3 | ✓ | ✓ |
| `/projects/pokemon-game` | 3 | 44×44 ×3 | ✓ | ✓ |

Las áreas de 44×44 vienen del `.icon-btn` del chasis, no del tamaño del ícono: el `.ico` mide 20 px y un
`<a>` sin padding mediría 20. El `FooterPage.vue` original usaba PNG de **30×30**, por debajo de NFR-11.

Y las etiquetas accesibles cambian de idioma:

```
EN: Message me on WhatsApp · Send me an email · See my LinkedIn profile
ES: Escribime por WhatsApp · Escribime un email · Ver mi perfil de LinkedIn
```

**AC2 — el orden de la Home, listado del DOM y no leído del template:**

```
(hero)        —
proyectos     section
stack         section section-alt
trayectoria   section
contacto      section section-alt
```

Es exactamente el orden de FR-08, sin secciones duplicadas —la Home se construyó en cuatro épicas
distintas, cada una sin ver a las otras— y con la alternancia de fondo intacta: ninguna pareja
consecutiva comparte clase.

**AC3 — la auditoría de "un gesto":** en las cuatro vistas y en cualquier posición de scroll, el canal
más cercano está a un scroll al pie. Lo que lo garantiza es que el pie con los tres canales está en las
cuatro vistas; la sección de contacto de la Home no lo reemplaza, es un destino con jerarquía propia
(FR-23).

### El pie y la sección comparten la regla, no el markup

Son dos presentaciones genuinamente distintas del mismo dato: la sección es un destino con encabezado y
cards de 104 px; el pie es compacto, tres íconos de 44 px. Forzar `ContactSection` dentro del pie con
una `variant` daría un componente con dos layouts que no comparten casi nada.

Lo que **sí** se comparte es `atributosDeEnlace(canal)`, exportada desde `contact.js`. Si el pie
derivara `target` y `rel` por su cuenta, el `mailto:` terminaría abriendo una pestaña en blanco en un
lugar y no en el otro — y ese es justo el tipo de inconsistencia que solo aparece cuando alguien la
prueba.

### Con esta historia cierra el alcance funcional

Los 30 FRs del PRD están implementados. Lo que queda es la Épica 7, que no agrega funcionalidad:
verifica midiendo que los 21 NFRs y las ocho métricas se alcanzan.

### File List
