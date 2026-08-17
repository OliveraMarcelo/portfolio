# Story 6.2: Sección de contacto como destino

Status: ready-for-dev

## Story

As a cliente potencial,
I want un lugar claro donde encontrar cómo escribirle,
so that no tenga que buscar entre íconos chiquitos al pie.

## Acceptance Criteria

**AC1 — Sección propia, no una fila de íconos**

**Given** el componente `src/components/sections/ContactSection.vue`
**When** se renderiza al final de la Home
**Then** presenta los tres canales como una sección propia, con encabezado y jerarquía visual, no como una fila de íconos (FR-23)

**AC2 — Enlaces directos**

**Given** cada canal
**When** el visitante lo activa
**Then** se abre directamente el destino correspondiente: `wa.me` para WhatsApp, `mailto:` para el email y el perfil de LinkedIn (FR-24)
**And** no existe ningún formulario intermedio

**AC3 — Enlaces seguros y alcanzables**

**Given** los enlaces externos de la sección
**When** se inspeccionan
**Then** llevan `rel="noopener noreferrer"` y áreas táctiles de al menos 44×44 px

**AC4 — Revelado al scroll**

**Given** la sección
**When** entra en viewport
**Then** se revela con `v-reveal`

## Tasks / Subtasks

- [ ] **Tarea 1 — Construir `ContactSection.vue`** (AC: #1)
  - [ ] Prop `channels` (Array): los canales de `src/content/contact.js`
  - [ ] Estructura: `.section` → `SectionHeading` → `.contact-list` → un `.contact-card` por canal
  - [ ] Cada card con `.contact-label`, `.contact-value` y `.contact-arrow`
  - [ ] Estilos portados de `home/page.css` (sección 10, líneas 586 en adelante)

- [ ] **Tarea 2 — Los enlaces** (AC: #2, #3)
  - [ ] Cada card es un `<a>` completo, no un contenedor con un enlace chico adentro (ver §La card entera es el enlace)
  - [ ] `target` y `rel` derivados del campo `external` del módulo, no decididos en el template
  - [ ] Ícono del sprite vía `AppIcon`, con el nombre que trae el dato
  - [ ] Área táctil ≥ 44×44 px en cada card

- [ ] **Tarea 3 — Revelado** (AC: #4)
  - [ ] `v-reveal` en la sección, con escalonado en las cards
  - [ ] Mismo mecanismo de custom property que las historias 3.3, 4.7 y 5.4
  - [ ] Con movimiento reducido, visibles de inmediato

- [ ] **Tarea 4 — Montar en la Home** (AC: #1)
  - [ ] `HomeView.vue` renderiza `<ContactSection :channels="contact" />` como **última** sección
  - [ ] Con esto queda completo el orden de FR-08

- [ ] **Tarea 5 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Los tres canales abren su destino correcto
  - [ ] Confirmar que el `mailto:` no deja una pestaña en blanco
  - [ ] Medir las áreas táctiles de las tres cards
  - [ ] Recorrer con `Tab` y confirmar foco visible en las tres
  - [ ] Verificar en 390 px y 1280 px, en los tres estados de tema
  - [ ] Con movimiento reducido: visibles y quietas

## Dev Notes

FR-23 es explícito en lo que **no** quiere: *"Existe una sección de contacto con los canales reales"*, y el
PRD la lista dentro del alcance como *"Sección de contacto real como destino, no solo un footer con
íconos"*.

El sitio actual tiene exactamente eso que se está reemplazando: tres PNG de 30×30 px en el pie. Un objetivo
táctil de 30 px además incumple NFR-11.

Esta historia sirve al recorrido J3: el cliente potencial no técnico, que evalúa por impresión visual y
necesita un canal inmediato.
[Source: prd.md#4.2 Recorridos críticos, J3]

### La card entera es el enlace

```vue
<!-- ✅ toda la card es clickeable -->
<a class="contact-card" :href="c.href" …>
  <span class="contact-label">{{ … }}</span>
  <span class="contact-value">{{ c.value }}</span>
  <AppIcon class="contact-arrow" :name="c.icon" />
</a>

<!-- ❌ el objetivo es apenas el texto -->
<div class="contact-card">
  <span class="contact-label">…</span>
  <a :href="c.href">{{ c.value }}</a>
</div>
```

Con la segunda forma, el visitante ve una card grande que invita al clic y descubre que solo funciona sobre
el texto. Además el objetivo táctil pasa a ser la altura de una línea, muy por debajo de los 44 px.

Un `<a>` puede contener elementos de bloque en HTML5, así que envolver la card entera es válido y es lo
correcto.

### `target` y `rel` salen del dato

La historia 6.1 dejó un campo `external` por canal, precisamente para esto:

```vue
:target="c.external ? '_blank' : null"
:rel="c.external ? 'noopener noreferrer' : null"
```

El `mailto:` tiene `external: false` porque no abre un sitio: entrega el enlace al cliente de correo. Con
`target="_blank"` quedaría una pestaña en blanco huérfana, que se ve como un error del sitio.

Derivarlo del dato en lugar de escribirlo por canal es lo que hace que la regla se aplique una vez y no se
pueda olvidar en el próximo canal.

### Sin formulario, y eso es una decisión de alcance

FR-24 pide enlaces directos **sin formulario intermedio**, y el PRD §6.2 excluye del alcance el backend, la
base de datos y cualquier envío por servidor.

Un formulario de contacto sin backend necesita un servicio de terceros —Formspree, Netlify Forms,
EmailJS— y eso contradice D14 (cero orígenes de terceros en runtime) además del alcance.

Si en algún momento parece que "un formulario quedaría más profesional", es una conversación de alcance con
Marcelo, no una decisión de implementación.

### Última sección de la Home

Con esta historia el orden de FR-08 queda completo:

| # | Sección | Historia |
|---|---|---|
| 1 | Hero | 3.1 – 3.4 |
| 2 | Proyectos destacados | 4.7 |
| 3 | Stack / habilidades | 5.4 |
| 4 | Resumen de trayectoria | 5.5 |
| 5 | **Contacto** | **6.2 — esta** |

Verificá el orden completo recorriendo la Home de arriba abajo. La historia 6.3 lo tiene como criterio de
aceptación formal.

### Alternar el fondo

Las secciones alternan `.section` y `.section-alt` para separarse sin divisores. La de contacto es la
última, y viene después del resumen de trayectoria: elegí la clase que dé contraste con la anterior.

No es una decisión libre: mirá qué clase quedó en la sección de arriba y usá la otra.

### Los `aria-label` importan acá

Un enlace cuyo texto visible es solo el valor —"+54 11 3432-3271"— se anuncia como ese número, sin decir
qué hace. Con la etiqueta traducible del dato dentro de la card, el nombre accesible sale completo.

Si el diseño esconde la etiqueta y muestra solo el valor, entonces sí hace falta un `aria-label` explícito
con la etiqueta. La utilidad `.sr-only` que la historia 5.2 promovió a `base.scss` sirve para eso.

La historia 7.4 va a verificar que los `aria-label` cambien de idioma, así que no los escribas literales.

### Guardarraíles

- ❌ **No** hagas que solo el texto sea clickeable.
- ❌ **No** le pongas `target="_blank"` al `mailto:`.
- ❌ **No** decidas `target` ni `rel` en el template: derivalos del campo `external`.
- ❌ **No** implementes un formulario de contacto.
- ❌ **No** instales EmailJS, Formspree ni ningún servicio de envío.
- ❌ **No** repitas los valores de contacto en el componente: vienen por props.
- ❌ **No** dejes áreas táctiles menores a 44×44 px.
- ❌ **No** escribas `aria-label` literales.
- ❌ **No** agregues canales que no estén en el módulo.
- ❌ **No** inventes una cuarta forma de escalonar.
- ❌ **No** cablees el pie: es la historia 6.3.

### Comandos de verificación

```bash
# Sin valores literales en el componente
grep -n "3432\|olivera.m.et13\|marcelodanielolivera\|wa.me" src/components/sections/ContactSection.vue

# Sin aria-label literales
grep -n 'aria-label="[A-ZÁÉÍÓÚÑ]' src/components/sections/ContactSection.vue
```

En el navegador:

```js
// Las tres cards son enlaces completos
[...document.querySelectorAll('.contact-card')].map(c => c.tagName)      // ['A','A','A']

// Áreas táctiles
[...document.querySelectorAll('.contact-card')]
  .map(c => { const r = c.getBoundingClientRect(); return [r.width, r.height] })
// todas con height >= 44

// target y rel correctos por canal
[...document.querySelectorAll('.contact-card')].map(a => [a.protocol, a.target, a.rel])
// mailto: → target vacío;  https: → '_blank' con noopener noreferrer

// Orden completo de la Home
[...document.querySelectorAll('main > section')].map(s => s.className)
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los tres canales abren
su destino; **el `mailto:` no deja pestaña en blanco**; las tres cards son enlaces completos con área
≥ 44×44 px; foco visible por teclado en las tres; el orden de secciones de la Home coincide con FR-08;
verificado en 390 px y 1280 px en los tres temas; con movimiento reducido visibles y quietas; consola sin
errores.

### Project Structure Notes

```
src/components/sections/ContactSection.vue   NUEVO
src/views/HomeView.vue                        MODIFICADO — última sección
src/styles/sections.scss                      MODIFICADO — .contact-list, .contact-card y derivados
src/locales/{es,en}.json                      MODIFICADO — título y bajada de la sección
```

### References

- Historia y criterios: [Source: epics.md#Story 6.2]
- FR-23, FR-24: [Source: prd.md#7.6 Contacto]
- FR-08, orden de la Home: [Source: prd.md#7.2]
- FR-16: [Source: prd.md#7.3]
- Alcance dentro y fuera: [Source: prd.md#6.1 y #6.2]
- J3, contacto rápido: [Source: prd.md#4.2]
- NFR-08/11/16: [Source: prd.md#8.2 y #8.4]
- D14, cero terceros: [Source: architecture.md#Authentication & Security]
- Estilos fuente: `public/ui-generated/home/page.css`, sección 10 Contacto

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
