# Story 5.3: Certificado ampliable en lightbox

Status: done

## Story

As a reclutador,
I want ver el certificado en grande,
so that pueda verificarlo sin descargar nada.

## Acceptance Criteria

**AC1 — Miniatura correcta**

**Given** la imagen del certificado, convertida a `src/assets/img/certificado.webp` desde el `image.png` actual
**When** se renderiza en la vista Sobre mí
**Then** se muestra como miniatura con dimensiones declaradas y `alt` descriptivo

**AC2 — Apertura**

**Given** el visitante que activa la miniatura
**When** se abre el lightbox
**Then** el certificado se muestra ampliado sobre un fondo atenuado (FR-19)
**And** el foco se traslada al lightbox

**AC3 — Cierre por tres vías**

**Given** el lightbox abierto
**When** el visitante presiona `Escape`, toca fuera de la imagen o activa el botón de cierre
**Then** el lightbox se cierra y el foco vuelve a la miniatura que lo abrió

**AC4 — Foco contenido**

**Given** el lightbox abierto
**When** se recorre con `Tab`
**Then** el foco queda contenido dentro del lightbox

**AC5 — El visor de PDF no vuelve**

**Given** el proyecto completo
**When** se busca cualquier referencia a `pdfjs-dist` o a `certificado.pdf`
**Then** no existe ninguna: el visor de PDF fue eliminado y no se reintroduce

## Tasks / Subtasks

- [x] **Tarea 1 — La imagen** (AC: #1, #5)
  - [x] Convertir `src/assets/icons/image.png` a `src/assets/img/certificado.webp` (ver §La fuente es un PNG, no el PDF)
  - [x] Miniatura con `width`, `height`, `loading="lazy"`, `decoding="async"` y `alt` descriptivo
  - [x] Borrar `public/certificado.pdf` y `src/assets/icons/image.png` una vez verificado que nada los referencia

- [x] **Tarea 2 — `AppLightbox.vue`** (AC: #2, #3, #4)
  - [x] Prop `open` (Boolean) con `v-model:open`, o estado interno con eventos `open` / `close`
  - [x] Slot para el contenido, para que sirva a cualquier imagen y no solo al certificado
  - [x] Fondo atenuado que cierra al clic
  - [x] Botón de cierre con `aria-label` desde los locales y el ícono `i-close`
  - [x] Clases: `.lightbox` y las que porte de `sobre-mi/page.css`, normalizadas a kebab sin BEM

- [x] **Tarea 3 — Gestión del foco** (AC: #2, #3, #4)
  - [x] Al abrir: guardar `document.activeElement`, mover el foco al botón de cierre
  - [x] Al cerrar: devolver el foco al elemento guardado
  - [x] `Tab` contenido dentro del lightbox
  - [x] Reusar el patrón de la historia 2.4 (ver §El mismo patrón de foco que el menú mobile)

- [x] **Tarea 4 — Bloquear el scroll del fondo** (AC: #2)
  - [x] `document.body.style.overflow = 'hidden'` con el lightbox abierto
  - [x] Restaurar al cerrar **y** en `onUnmounted`

- [x] **Tarea 5 — Semántica de diálogo** (AC: #2, #4)
  - [x] `role="dialog"` y `aria-modal="true"` en el contenedor
  - [x] `aria-label` o `aria-labelledby` que lo nombre
  - [x] La miniatura es un `<button>`, no un `<div>` con `@click` (ver §La miniatura es un botón)

- [x] **Tarea 6 — Montar en la vista** (AC: #1, #2)
  - [x] `AboutView.vue` renderiza la miniatura del certificado y el `AppLightbox`
  - [x] El texto de contexto —"Certificado Full Stack Developer, Digital House"— por i18n

- [x] **Tarea 7 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Abrir con clic y con `Enter` desde el teclado
  - [x] Cerrar por las tres vías y confirmar el retorno del foco en cada una
  - [x] Recorrer con `Tab` y confirmar la contención
  - [x] Confirmar que el `body` recupera el scroll
  - [x] Verificar en 390 px que la imagen ampliada cabe
  - [x] Con movimiento reducido: abre y cierra sin animación
  - [x] Confirmar que no queda rastro de `pdfjs-dist` ni del PDF

## Dev Notes

FR-19 pide una **imagen ampliable en lightbox accesible, cerrable con `Escape`**. Hoy el sitio hace algo
distinto: renderiza un PDF en un canvas con `pdfjs-dist`, un megabyte de dependencia con el worker cargado
desde un CDN externo.

Esa dependencia ya se eliminó en la historia 1.1 (estaba comentada y muerta). Esta historia entrega el
reemplazo que FR-19 realmente describe.

### La fuente es un PNG, no el PDF

Hallazgo verificado: `MyStory.vue` renderiza hoy `src/assets/icons/image.png` con el `alt` *"Certificado
Full Stack Developer - Digital House"*. **Esa ya es la imagen del certificado.**

No hace falta rasterizar `public/certificado.pdf`. El PDF se elimina sin reemplazo, y el PNG existente se
convierte a WebP.

Está documentado como brecha menor 6 en la validación de arquitectura, precisamente para que nadie
reintroduzca un visor de PDF pensando que el PDF es la única fuente.
[Source: architecture.md#Gap Analysis Results, brecha 6]

### El mismo patrón de foco que el menú mobile

La historia 2.4 implementó exactamente esto para el panel mobile: guardar el foco previo, moverlo al
panel, contenerlo con `Tab`, devolverlo al cerrar.

Si en la 2.4 se extrajo a `src/composables/useFocusTrap.js`, **reusalo**. Si no, es el segundo uso: ahora
sí vale extraerlo, porque duplicar el patrón por tercera vez sería el momento de arrepentirse.

Lo que no hay que hacer es implementarlo distinto de como quedó en la 2.4. Dos implementaciones del mismo
comportamiento accesible es cómo se producen inconsistencias que solo aparecen en auditoría.

### La miniatura es un botón

```vue
<!-- ✅ -->
<button class="cert-thumb" @click="abrir">
  <img src="…" alt="Certificado Full Stack Developer — Digital House" width="…" height="…" />
</button>

<!-- ❌ -->
<div class="cert-thumb" @click="abrir"> … </div>
```

Un `<div>` con `@click` no es alcanzable por teclado, no responde a `Enter` ni a `Espacio`, y no se anuncia
como control. Serían tres fallos de NFR-08 en un solo elemento.

Con `<button>` todo eso funciona gratis, y el `:focus-visible` global de `base.scss` le da el indicador de
foco.

### Por qué no `<dialog>`

El elemento nativo `<dialog>` con `showModal()` da foco contenido y cierre por `Escape` sin escribir
código. Es tentador, y sin embargo:

- Promueve el diálogo al **top layer**, que es un contexto de apilamiento fuera del árbol normal. El
  contrato de `z-index` del sitio —velo 90, header 100, panel 105— deja de aplicar, y ese contrato existe
  porque su ausencia ya causó un defecto real (historia 2.4).
- El `::backdrop` se estiliza aparte y no hereda los tokens del tema de la misma forma.
- No es lo que el sistema verificado usa. `sobre-mi/page.css` define `.lightbox` como un contenedor normal.

La historia 2.4 lo prohíbe explícitamente por los mismos motivos. Mantené el criterio.

### El fondo atenuado cierra, y por eso tiene que recibir el clic

Mismo cuidado que con el `.nav-scrim`: el fondo tiene que estar **debajo** del contenido del lightbox en
el orden de apilamiento pero **encima** del resto de la página, y tiene que ser clickeable.

No uses `pointer-events: none` en el fondo: necesita el clic para cerrar. Lo que hay que garantizar es que
la imagen y el botón de cierre estén por encima, con `z-index` explícito.

Y cuidado con un detalle: si el clic se escucha en el contenedor entero, un clic **sobre la imagen**
también cierra. Escuchá el clic en el fondo y detené la propagación en el contenido, o comprobá que
`event.target` sea el fondo.

### La imagen ampliada tiene que caber en 390 px

Un certificado es horizontal y ancho. En un viewport de 390 px, `width: 90vw` lo deja ilegible pero al
menos visible; lo que no puede pasar es que desborde y produzca scroll horizontal.

`max-width: 100%` y `max-height: 90svh` con `object-fit: contain`. Verificalo en 390 px mirando: si el
certificado no se lee, es un problema de contenido —el certificado es así— no de implementación.

### `alt` en la miniatura, no en la imagen ampliada

La imagen ampliada del lightbox muestra lo mismo que la miniatura. Si las dos tienen `alt` descriptivo, un
lector de pantalla anuncia el certificado dos veces.

La miniatura lleva el `alt` descriptivo. La ampliada puede llevar `alt=""` si el diálogo ya está nombrado
por `aria-label`, o el mismo `alt` si preferís. Elegí y sé consistente; lo que no hay que hacer es dejar
la miniatura sin `alt`.

### Guardarraíles

- ❌ **No** reintroduzcas `pdfjs-dist` ni ningún visor de PDF.
- ❌ **No** rasterices `certificado.pdf`: la fuente es `image.png`.
- ❌ **No** uses `<dialog>` ni `showModal()`.
- ❌ **No** uses un `<div>` con `@click` para la miniatura.
- ❌ **No** implementes el foco distinto de como quedó en la historia 2.4.
- ❌ **No** uses `pointer-events: none` en el fondo atenuado.
- ❌ **No** dejes que un clic sobre la imagen cierre el lightbox.
- ❌ **No** te olvides de restaurar `body.style.overflow`.
- ❌ **No** instales `vue-easy-lightbox`, `photoswipe` ni ninguna librería de galería.
- ❌ **No** portes las clases BEM de `sobre-mi/page.css` (`.cert__note`, `.ph-img--cert`).
- ❌ **No** dejes la miniatura sin `alt` descriptivo.

### Comandos de verificación

```bash
# El visor de PDF no volvió
grep -rn "pdfjs\|certificado.pdf\|PdfViewer" src/ public/ package.json

# La miniatura es un botón
grep -n "cert" src/views/AboutView.vue

# Sin BEM
grep -rn 'class="[^"]*__\|class="[^"]*--' src/components/ui/AppLightbox.vue
```

En el navegador:

```js
// La miniatura es un control real
document.querySelector('.cert-thumb').tagName            // 'BUTTON'

// Con el lightbox abierto
const lb = document.querySelector('.lightbox')
lb.getAttribute('role')                                   // 'dialog'
lb.getAttribute('aria-modal')                             // 'true'
document.activeElement                                    // dentro del lightbox
document.body.style.overflow                              // 'hidden'

// Al cerrar, el foco vuelve
// …presionar Escape…
document.activeElement.classList.contains('cert-thumb')   // true
document.body.style.overflow                              // ''

// Sin scroll horizontal a 390px con el lightbox abierto
document.documentElement.scrollWidth <= window.innerWidth  // true
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; abre con clic y con
teclado; cierra por `Escape`, por clic fuera y por el botón, devolviendo el foco en las tres; `Tab`
contenido; el `body` recupera el scroll; la imagen ampliada cabe en 390 px sin scroll horizontal; con
movimiento reducido abre y cierra sin animación; sin rastro de `pdfjs-dist` ni del PDF; consola sin
errores.

### Project Structure Notes

```
src/components/ui/AppLightbox.vue      NUEVO
src/assets/img/certificado.webp        NUEVO — desde assets/icons/image.png
src/views/AboutView.vue                MODIFICADO — miniatura y lightbox
src/composables/useFocusTrap.js        NUEVO o REUSADO — según la historia 2.4
src/locales/{es,en}.json               MODIFICADO — texto del certificado, aria-label del cierre
public/certificado.pdf                 ELIMINADO
src/assets/icons/image.png             ELIMINADO
```

### References

- Historia y criterios: [Source: epics.md#Story 5.3]
- FR-19: [Source: prd.md#7.4 Sobre mí]
- NFR-04/08/10: [Source: prd.md#8.1 y #8.2]
- Brecha del certificado: [Source: architecture.md#Gap Analysis Results, brecha 6]
- Dependencias removidas: [Source: architecture.md#Dependencias removidas]
- Patrón de foco y prohibición de `<dialog>`: historia 2.4
- Estrategia de componentes, `Lightbox`: [Source: ux-design-specification.md#5]
- Estilos fuente: `public/ui-generated/sobre-mi/page.css`, sección Lightbox
- Comportamiento fuente: `public/ui-generated/sobre-mi/page.js` líneas 165–190

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 —** `image.png` (1097×796, 100 KB) → `certificado.webp` (1600×1161, **54 KB**). Miniatura con
`width`, `height`, `loading="lazy"`, `decoding="async"` y `alt` descriptivo traducido.

**AC2/AC3/AC4 — el lightbox, medido:**

```
miniatura: BUTTON   alt: "Full Stack Developer certificate — Digital House"
al abrir:  role=dialog  aria-modal=true  aria-label=<el mismo texto>
           foco en el botón de cierre: true       body.overflow: hidden
Tab:       el foco sigue dentro: true
clic sobre la imagen:  NO cierra
Escape:    cierra · foco devuelto al disparador · body.overflow restaurado
botón ✕:   cierra · foco devuelto
clic fuera: cierra · foco devuelto
```

**AC5 —** `certificado.pdf` y `image.png` eliminados; sin rastro de `pdfjs-dist`.

### La fuente era un PNG, no el PDF

`MyStory.vue` ya renderizaba `image.png` con el `alt` "Certificado Full Stack Developer - Digital
House". **Esa ya era la imagen del certificado**, así que no hizo falta rasterizar nada y el PDF se
eliminó sin reemplazo.

### Por qué no `<dialog>`

El elemento nativo daría foco contenido y cierre con `Escape` sin escribir código, y aun así:

- promueve el diálogo al **top layer**, un contexto de apilamiento fuera del árbol normal, y el contrato
  de `z-index` del sitio —velo 90 < header 100 < panel 105— dejaría de aplicar. Ese contrato existe
  porque su ausencia ya causó un defecto real en la historia 2.4;
- el `::backdrop` se estiliza aparte y no hereda los tokens del tema igual.

El lightbox va en 110, un escalón por encima del panel mobile, y el contrato sigue siendo explícito.

### El clic sobre la imagen no cierra

Escuchando el clic en toda la capa, un clic **sobre el certificado** también cerraría — justo cuando el
visitante lo está mirando. El handler compara `event.target` contra el contenedor y contra el velo.

### El foco reusa el composable de la 2.4

`useFocusTrap` es el mismo, con el disparador pasado explícito: un `.click()` programático no mueve el
foco y Safari no enfoca los `<button>` al hacer clic. Dos implementaciones del mismo comportamiento
accesible es como aparecen inconsistencias que solo salen en auditoría.

### `alt` en la miniatura, vacío en la ampliada

El diálogo ya está nombrado con ese texto por su `aria-label`; repetirlo en la imagen lo anunciaría dos
veces.

### File List
