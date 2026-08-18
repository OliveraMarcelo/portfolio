# Story 7.1: Imágenes en formato moderno

Status: done

## Story

As a visitante con datos móviles,
I want que las imágenes pesen lo menos posible,
so that el sitio cargue rápido sin consumirme el plan.

## Acceptance Criteria

**AC1 — WebP con dimensiones declaradas**

**Given** las capturas de proyectos, el retrato y el certificado
**When** se convierten a WebP en `src/assets/img/`
**Then** cada `<img>` del sitio declara `width` y `height` explícitos (NFR-04)

**AC2 — Carga diferida fuera del viewport**

**Given** toda imagen fuera del viewport inicial
**When** se inspecciona
**Then** lleva `loading="lazy"` y `decoding="async"`

**AC3 — El retrato es la excepción**

**Given** el retrato del hero
**When** se inspecciona
**Then** no lleva `loading="lazy"` y sí `fetchpriority="high"`

**AC4 — La captura faltante se resuelve o se decide**

**Given** el proyecto de mensajería en tiempo real, que hoy no tiene captura propia
**When** se prepara su imagen
**Then** existe una captura real del proyecto, o se decide explícitamente cómo se presenta ese proyecto sin ella; en ningún caso queda una imagen genérica pasando por captura

**AC5 — CLS bajo control**

**Given** el sitio cargado
**When** se mide el CLS
**Then** es menor a 0,1 (M4)

## Tasks / Subtasks

- [x] **Tarea 1 — Inventariar y convertir** (AC: #1)
  - [x] Listar todas las imágenes que el sitio usa después de las Épicas 1 a 6
  - [x] Convertir a WebP en `src/assets/img/`, con calidad razonable (ver §Cómo convertir sin degradar)
  - [x] Anotar las dimensiones reales de cada archivo
  - [x] Borrar los originales sin uso de `src/assets/icons/`

- [x] **Tarea 2 — Auditar los atributos** (AC: #1, #2, #3)
  - [x] Recorrer cada `<img>` del proyecto y verificar `width`, `height`, `alt`
  - [x] `loading="lazy"` y `decoding="async"` en todo lo que no esté en el primer viewport
  - [x] El retrato del hero **sin** `lazy` y con `fetchpriority="high"`
  - [x] La imagen del detalle de proyecto **sin** `lazy`: está sobre el pliegue en esa vista

- [x] **Tarea 3 — Resolver la captura del chat** (AC: #4)
  - [x] Es una brecha de contenido, no de código (ver §La brecha que esta historia cierra)
  - [x] Camino A: Marcelo saca la captura del proyecto funcionando
  - [x] Camino B: se decide una presentación alternativa explícita para ese proyecto
  - [x] **No** uses una imagen genérica, un mockup vacío ni la imagen del certificado

- [x] **Tarea 4 — Medir el CLS** (AC: #5)
  - [x] Lighthouse en mobile sobre el build de producción, en las cuatro vistas
  - [x] Si el CLS pasa de 0,1, la causa más probable es una imagen sin dimensiones o una fuente sin métrica (ver §Si el CLS no baja)

- [x] **Tarea 5 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] El script de auditoría de imágenes no reporta faltantes
  - [x] CLS < 0,1 en las cuatro vistas
  - [x] Verificar visualmente que ninguna imagen se degradó al convertir
  - [x] Confirmar que no quedan PNG ni JPEG sin uso en `src/assets/`

## Dev Notes

**D10 en la arquitectura: imágenes en WebP con dimensiones declaradas.** Las dimensiones son la mitigación
directa de CLS; el retrato del hero es el candidato a LCP y diferir su carga hundiría NFR-01.
[Source: architecture.md#Frontend Architecture, D10]

Las historias anteriores ya aplicaron esto imagen por imagen —el retrato en la 3.1, las cards en la 4.2, el
certificado en la 5.3—. Esta historia es la **auditoría transversal**: verifica que no quedó ninguna afuera
y cierra la brecha de contenido.

### La brecha que esta historia cierra

`src/assets/icons/` tiene solo `jedami-preview.png` y `pokemon-preview.png`. **No existe captura del
proyecto de mensajería en tiempo real.**

Está registrada como **brecha crítica** en la validación de arquitectura, y `TASKS.md` §2 ya la anotaba antes
del rediseño: *"Añadir imágenes de todos los proyectos"*.

FR-12 exige captura en cada card y FR-15 en el detalle. Sin la imagen, ese proyecto no puede renderizarse
como los otros dos.

**Es trabajo de contenido y requiere a Marcelo.** Los dos caminos son legítimos:

- **A:** sacar la captura. El proyecto es un chat con WebSockets; una captura de la interfaz funcionando.
- **B:** decidir que ese proyecto se presenta distinto —sin imagen, con un tratamiento tipográfico— y
  ajustar `ProjectCard` para soportarlo con una variante.

Lo que **no** es un camino: poner un mockup genérico, un placeholder de stock o la imagen del certificado.
Eso es contenido falso en un portfolio, y el PRD es explícito: *"El contenido es real y ya existe: no se
inventan proyectos, empleos ni certificaciones"*.

Si Marcelo no está disponible, **no cierres la historia**: dejá el resto hecho y reportá esto como
pendiente. Es exactamente el tipo de cosa que no se debe resolver por cuenta propia.
[Source: architecture.md#Gap Analysis Results, brecha 1]

### Cómo convertir sin degradar

WebP con calidad 80–85 suele dar 25–35 % menos peso que un PNG optimizado, sin diferencia visible. Con
`cwebp`:

```bash
cwebp -q 82 entrada.png -o salida.webp
```

Dos cuidados concretos:

1. **Capturas de pantalla con texto.** WebP con pérdida difumina el texto chico. Si una captura tiene UI con
   texto legible, subí la calidad a 90 o usá WebP sin pérdida (`-lossless`) y compará el peso.
2. **El retrato es una foto.** Ahí la pérdida es tu amiga: 80 alcanza y pesa mucho menos.

Compará el antes y el después mirando, no solo por tamaño de archivo. Una imagen 40 % más liviana pero
visiblemente sucia es una mala compensación en un portfolio de frontend.

### El alcance es WebP, no AVIF ni `<picture>`

NFR-04 pide "formato moderno". WebP lo es y tiene soporte universal en el parque de NFR-13.

AVIF comprime mejor, pero implicaría un `<picture>` con `<source>` por formato en cada imagen, más
complejidad de markup y de build. **No está en el alcance.** Si en el futuro el presupuesto de performance
lo pide, es una decisión aparte.

Tampoco hacen falta imágenes responsivas con `srcset`: las capturas se muestran a un tamaño acotado por el
`--container-max` de 1200 px, y el retrato mide `min(320px, 72vw)`. Un solo archivo por imagen, dimensionado
para el uso más grande.

### Si el CLS no baja

Las dos causas, en orden de probabilidad:

1. **Una imagen sin `width` / `height`.** El script de verificación las encuentra.
2. **El intercambio de fuente.** Con `font-display: swap`, el texto se pinta con la fuente de respaldo y
   cambia cuando llega la real. Si las métricas difieren mucho, el texto se reacomoda y eso es CLS.

Para la segunda, la palanca disponible es `size-adjust` en el `@font-face` o las descriptoras
`ascent-override` / `descent-override`, para que el respaldo ocupe lo mismo que la fuente real. **Medí antes
de aplicarlo:** con `preload` de los cortes del hero (historia 1.3), el intercambio suele ocurrir antes del
primer pintado y no produce CLS.

Lo que **no** hay que hacer es cambiar a `font-display: block` para evitar el reacomodo: esconde el texto y
empeora el LCP, que es la métrica más importante.

### Guardarraíles

- ❌ **No** uses una imagen genérica para el proyecto sin captura.
- ❌ **No** cierres la historia con la brecha de contenido abierta: reportala.
- ❌ **No** implementes `<picture>` con AVIF.
- ❌ **No** implementes `srcset`.
- ❌ **No** le pongas `loading="lazy"` al retrato del hero ni a la imagen del detalle de proyecto.
- ❌ **No** omitas `width` ni `height` en ninguna imagen.
- ❌ **No** cambies `font-display: swap` por `block`.
- ❌ **No** dejes los PNG y JPEG originales en el repositorio si ya no se usan.
- ❌ **No** instales `image-webpack-loader` ni un pipeline de optimización en el build. La conversión es
  única y manual: son cinco imágenes.
- ❌ **No** toques los metadatos sociales: es la historia 7.2.

### Comandos de verificación

```bash
# Solo WebP en assets/img
ls -la src/assets/img/

# No quedan rásters viejos referenciados
grep -rn "\.png\|\.jpeg\|\.jpg" src/ --include=*.vue --include=*.js
```

Auditoría de todas las imágenes, en el navegador y en cada vista:

```js
[...document.querySelectorAll('img')].map(i => ({
  src: i.currentSrc.split('/').pop(),
  w: i.getAttribute('width'),
  h: i.getAttribute('height'),
  alt: i.alt,
  loading: i.loading,
  decoding: i.decoding,
  fp: i.fetchPriority,
}))
```

Ninguna fila debe tener `w` o `h` en `null`, ni `alt` vacío salvo en decorativas.

Y el CLS con Lighthouse en mobile, sobre `npm run build` servido, no sobre el dev server.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; auditoría de imágenes
sin faltantes en las cuatro vistas; CLS < 0,1 medido con Lighthouse en mobile; el retrato y la imagen del
detalle sin `lazy`; ninguna imagen visiblemente degradada; sin rásters viejos en el repositorio; la brecha
de la captura resuelta o reportada explícitamente.

### Project Structure Notes

```
src/assets/img/*.webp             NUEVO o COMPLETADO — todas las imágenes del sitio
src/assets/icons/*.png            ELIMINADOS los que quedaron sin uso
src/assets/icons/photo.jpeg       ELIMINADO
src/components/**                 MODIFICADOS — atributos que falten
```

### References

- Historia y criterios: [Source: epics.md#Story 7.1]
- D10, imágenes en WebP: [Source: architecture.md#Frontend Architecture]
- Brecha de la captura faltante: [Source: architecture.md#Gap Analysis Results, brecha 1]
- NFR-04/13: [Source: prd.md#8.1 y #8.3]
- M4, CLS: [Source: prd.md#5 Métricas de éxito]
- Contenido real siempre: [Source: prd.md#3 Visión, principio 5]
- Pendiente previo: `TASKS.md` §2

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1/AC2/AC3 — auditoría de los cinco `<img>` del proyecto:**

| Componente | clase | width/height | alt | lazy | decoding | fetchpriority |
|---|---|---|---|---|---|---|
| HeroSection | — | sí | sí | **no** | async | **high** |
| ProjectCard | `.project-img` | sí | sí | sí | async | — |
| AboutView | `.cert-img` | sí | sí | sí | async | — |
| AboutView (lightbox) | — | sí | `""` | no | async | — |
| ProjectDetailView | `.project-img` | sí | sí | **no** | async | — |

Ninguna sin `width`, `height` o `alt`. El retrato del hero y la imagen del detalle son las dos
excepciones a `lazy`, y las dos son correctas: cada una está sobre el pliegue en su vista.

**AC5 — CLS: 0.0000** en las cuatro vistas. Ver §El CLS no venía de las imágenes.

### AC4 — la captura del chat: se decidió el camino B

El proyecto de mensajería en tiempo real no tiene captura y no se le puso una prestada. **Marcelo
eligió el tratamiento tipográfico**: en el mismo encuadre 16/10 que ocupa la imagen en las otras
cards, el stack en grande —`WEBSOCKETS` sobre una regla de acento y `Node.js` debajo— con un
gradiente sutil.

Es distinto del estado anterior, que mostraba un hueco con la leyenda "Captura pendiente". Ese se
leía como un render roto; este se lee como una decisión. Y `aria-hidden`, porque las mismas
tecnologías ya están en los chips de abajo.

Cuando la captura exista, alcanza con agregarla a `src/utils/assets.js`: el `v-if` de la card y del
detalle vuelve solo a la imagen, sin tocar CSS.

### El CLS no venía de las imágenes

La medición inicial dio **0.1706**, muy por encima del 0.1 de M4, con todas las imágenes ya
dimensionadas. La causa real, capturada con un `PerformanceObserver` de `layout-shift`, fue **un
único desplazamiento** a los 2053 ms:

```
valor 0.1706   ·   .site-footer   de y=72   a y=0
```

Las cuatro vistas se cargan diferidas, así que entre el primer pintado y el montaje `<main>` está
**vacío** y el pie queda justo debajo del header, arriba de todo. Cuando la vista monta, el pie se va
al fondo. Reservando el viewport con `#main { min-height: 100svh }`, el pie arranca abajo del pliegue
y el movimiento deja de ocurrir dentro de la ventana: **CLS 0.1706 → 0**.

Ninguna de las dos causas que la historia anticipaba —una imagen sin dimensiones, el intercambio de
fuente— era la responsable. Sin el desglose por elemento, el diagnóstico habría sido el equivocado.

### Los originales sin uso

`src/assets/icons/` desapareció: `jedami-preview.png` (626 KB), `pokemon-preview.png`, `photo.jpeg` y
`logo.png` ya no los referenciaba nada. `src/assets/img/` queda con los cuatro WebP que el sitio usa.

### File List
