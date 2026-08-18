# Story 6.1: Canales de contacto como datos

Status: done

## Story

As a mantenedor,
I want los canales de contacto definidos en un solo lugar,
so that cambiar un número no implique buscarlo por todo el código.

## Acceptance Criteria

**AC1 — Forma del módulo**

**Given** el módulo `src/content/contact.js`
**When** se define
**Then** contiene los canales reales del PRD: WhatsApp (+54 11 3432-3271), email (`olivera.m.et13@gmail.com`) y LinkedIn (`in/marcelodanielolivera`)
**And** cada canal declara su etiqueta traducible, su URL y el nombre de su ícono

**AC2 — Un solo lugar**

**Given** el proyecto completo
**When** se buscan esos datos de contacto
**Then** aparecen únicamente en este módulo, no repetidos en componentes

## Tasks / Subtasks

- [x] **Tarea 1 — Crear el módulo** (AC: #1)
  - [x] `src/content/contact.js` exportando un array ordenado de canales
  - [x] Campos por canal: `id`, `href`, `icon`, `value` (lo que se muestra) y `i18n` con la etiqueta por idioma
  - [x] Los íconos son `i-whatsapp`, `i-mail` e `i-linkedin`, ya en el sprite desde la historia 1.4
  - [x] El orden del array **es** el orden de presentación

- [x] **Tarea 2 — Construir los `href` correctamente** (AC: #1)
  - [x] WhatsApp: `https://wa.me/541134323271` — solo dígitos, sin `+`, sin espacios ni guiones
  - [x] Email: `mailto:olivera.m.et13@gmail.com`
  - [x] LinkedIn: `https://www.linkedin.com/in/marcelodanielolivera/`
  - [x] Declarar por canal si es externo, para que el componente decida el `target` (ver §`mailto:` no es un enlace externo)

- [x] **Tarea 3 — Barrer los duplicados** (AC: #2)
  - [x] Buscar y eliminar los valores literales que quedaron en componentes
  - [x] `AppFooter.vue` los tiene literales desde la historia 1.5: apuntarlos a este módulo
  - [x] Verificar por `grep` que no quedan en ningún otro lado

- [x] **Tarea 4 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Los tres canales aparecen una sola vez en el código
  - [x] Abrir los tres destinos y confirmar que funcionan
  - [x] Paridad ES/EN en las etiquetas

## Dev Notes

Cuarto y último módulo de `src/content/`, después de `projects.js` (historia 4.1), `timeline.js` y
`skills.js` (5.1). Misma decisión: **D4, fuente única de contenido, con los textos traducibles dentro del
dato.**

Esta historia no cambia nada visible. Habilita las historias 6.2 y 6.3.

### Los datos ya están duplicados, y esta historia lo cierra

Los canales de contacto viven hoy en dos lugares:

1. `src/components/layouts/FooterPage.vue` los tiene literales — pero ese componente se eliminó en la
   historia 1.5.
2. `src/components/layout/AppFooter.vue`, su reemplazo, **también los tiene literales**. La historia 1.5 lo
   hizo a propósito: conservar los contactos en el pie evitaba una regresión contra FR-25, y ese componente
   se construyó antes de que existiera `src/content/`.

Esta es la historia que cierra ese préstamo. La 1.5 dejó dicho: *"En la historia 6.3 esos enlaces pasan a
leerse de `src/content/contact.js`; por ahora los valores van literales en el componente"*. El módulo se
crea acá; el cableado del pie es la 6.3.

### `mailto:` no es un enlace externo

Detalle que produce comportamiento raro si se pasa por alto.

- `https://wa.me/…` y LinkedIn abren un sitio: van con `target="_blank"` y `rel="noopener noreferrer"`
  (FR-16).
- `mailto:` **no abre una pestaña**: entrega el enlace al cliente de correo del sistema. Con
  `target="_blank"`, algunos navegadores abren una pestaña en blanco que queda ahí, huérfana. Se ve como un
  error del sitio.

Por eso conviene un campo explícito en el dato:

```js
{ id: 'email', href: 'mailto:olivera.m.et13@gmail.com', external: false, icon: 'mail', … }
{ id: 'whatsapp', href: 'https://wa.me/541134323271', external: true, icon: 'whatsapp', … }
```

Y que el componente derive el `target` y el `rel` de ese campo, en lugar de que cada uso lo decida. Así la
regla se aplica una vez.

### El número de WhatsApp va sin formato

El PRD lo escribe como **+54 11 3432-3271**, que es el formato legible para mostrar. Pero `wa.me` acepta
solo dígitos con el código de país y sin el `+`:

```
https://wa.me/541134323271
```

Son dos representaciones del mismo dato. Guardá las dos:

- `href` con el formato de la URL.
- `value` con el formato legible, para mostrarlo si el diseño lo pide.

Lo que **no** hay que hacer es derivar una de la otra con un `replace` en el componente: es lógica en el
lugar equivocado y se rompe con el primer número que tenga otro formato.

### Las etiquetas se traducen, los valores no

- **Se traduce:** "Escribime por WhatsApp" / "Message me on WhatsApp".
- **No se traduce:** el número, el email, la URL de LinkedIn.

Misma frontera de siempre: las etiquetas de interfaz podrían ir a los locales, pero como son específicas de
cada canal y viajan con él, van en la clave `i18n` del dato. Un canal nuevo trae su etiqueta en los dos
idiomas o se ve que falta.

### El email es un dato personal expuesto a propósito

Es un portfolio: la dirección está publicada para que la usen. Un `mailto:` en texto plano es cosechable por
bots, y eso es un costo conocido y aceptado — el PRD elige enlaces directos sin formulario (FR-24) y excluye
el backend del alcance.

**No** implementes ofuscación con JavaScript: rompe el enlace para quien tenga JS deshabilitado, complica el
markup, y los cosechadores actuales ejecutan JS igual. No compra nada real.

### Guardarraíles

- ❌ **No** repitas los valores de contacto en ningún componente.
- ❌ **No** guardes el número de WhatsApp con `+`, espacios ni guiones en el `href`.
- ❌ **No** derives el `href` del valor legible con un `replace`.
- ❌ **No** le pongas `target="_blank"` al `mailto:`.
- ❌ **No** traduzcas el número, el email ni la URL.
- ❌ **No** implementes ofuscación del email.
- ❌ **No** agregues canales que no estén en el PRD §7.6 (nada de Twitter, Instagram ni un formulario).
- ❌ **No** construyas todavía `ContactSection`: es la historia 6.2.
- ❌ **No** cablees el pie: es la 6.3.
- ❌ **No** pongas rutas de asset en el módulo. El `icon` es el nombre del símbolo del sprite.

### Comandos de verificación

```bash
# Los datos aparecen una sola vez, en el módulo
grep -rn "3432\|olivera.m.et13\|marcelodanielolivera\|wa.me" src/
# la única aparición debe ser src/content/contact.js

# El href de WhatsApp no tiene formato
grep -n "wa.me" src/content/contact.js
```

En Node o en el navegador:

```js
import { contact } from '@/content/contact'

contact.length                                    // 3
contact.map(c => [c.id, c.href, c.external])

// Paridad de idiomas
contact.every(c => c.i18n.es.label && c.i18n.en.label)     // true

// El email no es externo
contact.find(c => c.id === 'email').external               // false

// Los íconos existen en el sprite
contact.every(c => !!document.querySelector(`#i-${c.icon}`))   // true
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; los tres valores
aparecen una sola vez en todo el código; los tres destinos abren correctamente —WhatsApp en pestaña nueva,
el email en el cliente de correo sin pestaña huérfana, LinkedIn en pestaña nueva—; paridad ES/EN en las
etiquetas; los tres íconos resuelven en el sprite; consola sin errores.

### Project Structure Notes

```
src/content/contact.js                  NUEVO — cuarto y último módulo de contenido
src/components/layout/AppFooter.vue      MODIFICADO — apunta al módulo en lugar de los literales
```

Con esta historia `src/content/` queda completo: `projects.js`, `timeline.js`, `skills.js`, `contact.js`.

### References

- Historia y criterios: [Source: epics.md#Story 6.1]
- D4, fuente única de contenido: [Source: architecture.md#Data Architecture]
- Patrón de formatos internos: [Source: architecture.md#Format Patterns]
- Enlaces externos seguros: [Source: architecture.md#API & Communication Patterns]
- FR-23, FR-24, FR-16: [Source: prd.md#7.6 Contacto y #7.3]
- Alcance sin backend ni formulario: [Source: prd.md#6.2 Fuera del alcance]
- Préstamo de la historia 1.5: historia 1.5, §El pie conserva los contactos
- Estrategia de componentes, `ContactSection`: [Source: ux-design-specification.md#5]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2 — el módulo y su unicidad:**

```
canales: whatsapp · email · linkedin        paridad ES/EN en label y aria: sí
grep de wa.me / olivera.m.et13 / marcelodanielolivera fuera de contact.js: sin resultados
```

Los tres valores aparecían literales en `AppFooter.vue` desde la historia 1.5, que los dejó ahí a
propósito para no perder FR-25 antes de que existiera `src/content/`. Este módulo cierra ese préstamo;
el cableado del pie es la 6.3.

### El número de WhatsApp se guarda dos veces, y está bien

`href: 'https://wa.me/541134323271'` y `value: '+54 11 3432-3271'`. `wa.me` acepta solo dígitos con
código de país y sin `+`; el otro es el formato legible. **Derivar uno del otro con un `replace` sería
lógica en el lugar equivocado**, y se rompe con el primer número que tenga otro formato.

### `mailto:` lleva `external: false`

No es un descuido: `mailto:` no abre un sitio, entrega el enlace al cliente de correo. Con
`target="_blank"` algunos navegadores dejan una pestaña en blanco huérfana, que el visitante lee como un
error del sitio.

El campo está en el dato para que **el componente derive** `target` y `rel` en lugar de decidirlos por
canal — así la regla se aplica una vez y no se puede olvidar en el próximo canal.

### El email está expuesto a propósito

Es un portfolio: la dirección está publicada para que la usen. Un `mailto:` en texto plano es cosechable
por bots y ese costo se acepta —el PRD elige enlaces directos sin formulario (FR-24) y excluye el
backend—. **No se ofusca con JavaScript:** rompe el enlace para quien tenga JS deshabilitado, complica el
markup, y los cosechadores actuales ejecutan JS igual. No compra nada real.

### File List
