# UI Design Handoff — MarceCode Portfolio (Rediseño 2026)

**Fecha:** 2026-08-08
**Agente:** Luna — UI Designer (danflow)
**Motor:** Open Design (open-design.ai), agente interno `claude`
**Dirección visual:** D1 "Estudio Nocturno" (dark-first, acento naranja de marca)
**Skill usado:** `gpt-taste` (Elite UX/UI & Advanced GSAP Motion Engineer)
**Documentos fuente:** `prd.md`, `ux-design-specification.md`
**Iteración:** v2 — regeneración completa con el **contrato técnico de salida** incorporado
al workflow (§3.1b) tras la primera pasada

---

## Pantallas generadas

| # | Pantalla | Proyecto OD | Archivos | Copia en el repo |
|---|----------|-------------|----------|------------------|
| P1 | Home | `portfolio-home-v2` | `index.html` · `styles.css` · `main.js` | `public/ui-generated/home/` |
| P2 | Proyectos | `portfolio-proyectos-v2` | `index.html` · `styles.css` · `main.js` + 2 imágenes | `public/ui-generated/proyectos/` |
| P3 | Detalle de proyecto | `portfolio-detalle-v3` | `index.html` · `styles.css` · `main.js` + 1 imagen | `public/ui-generated/proyecto-detalle/` |
| P4 | Sobre mí | `portfolio-sobre-mi-v2` | `index.html` · `styles.css` · `main.js` + 2 imágenes | `public/ui-generated/sobre-mi/` |

Las cuatro pantallas comparten ahora **la misma estructura de archivos y las mismas
convenciones de clases**. En la v1 cada una inventaba la suya (`proyectos.html`,
`sobre-mi.html`, `proyecto-tienda-jedami.html`; unas autocontenidas y otras con CSS
separado) — eso es lo que resolvió el contrato.

Capturas de referencia (tema oscuro, con el hook de QA activo): `ui-screenshots/`.

**previewUrl:** el daemon toma un puerto efímero en cada arranque. Regenerarlas con:

```
bash _bmad/danflow/workflows/create-ui-from-ux/scripts/od.sh preview portfolio-home-v2
```

---

## Verificación — resultados medidos

El checklist del workflow (§4.2b integridad, §4.3b navegador) corrido sobre las cuatro:

| Chequeo | P1 Home | P2 Proyectos | P3 Detalle | P4 Sobre mí |
|---|:--:|:--:|:--:|:--:|
| Los 3 archivos existen y cierran bien (llaves balanceadas) | ✅ | ✅ | ✅ | ✅ |
| `data-theme="dark"` → `--color-bg: #0B0D10` | ✅ | ✅ | ✅ | ✅ |
| `data-theme="light"` → `--color-bg: #FAFAF9` | ✅ | ✅ | ✅ | ✅ |
| Sin atributo → oscuro (default de la dirección) | ✅ | ✅ | ✅ | ✅ |
| Hook `data-qa="show-all"` revela todo | ✅ | ✅ | ✅ | ✅ ¹ |
| `.chips` sigue siendo `flex` (sin colisión de cascada) | ✅ | ✅ | ✅ | ✅ |
| Sin scroll horizontal a 1280 px | ✅ | ✅ | ✅ | ✅ |
| Consola sin errores propios del diseño | ✅ | ✅ | ✅ | ✅ ² |

¹ Queda 1 elemento en `opacity: 0`: `.cert__zoom`, la lupa que aparece al pasar el cursor
sobre el certificado. Es un estado de hover, no una animación de entrada — correcto que el
hook no lo revele.

² Sobre mí referenciaba `photo.jpeg` e `image.png`, que existen en `src/assets/icons/` pero
no en el proyecto de Open Design, y daban 404 en la preview. Se copiaron las imágenes reales
a los proyectos OD (también las de P2 y P3) y se rehizo el `pull`. Las previews ahora cargan
las imágenes de verdad, no placeholders.

### Navegación del prototipo — corregida

Las cuatro pantallas se generaron por separado y **cada una inventó su propio esquema de
URLs**, así que el prototipo no se podía recorrer:

| Pantalla | Enlaces que tenía | Problema |
|---|---|---|
| Home | `projects.html`, `about.html` | archivos que no existen |
| Proyectos | `inicio.html`, `sobre-mi.html` | archivos que no existen |
| Detalle | `inicio.html`, `proyectos.html`, `pokemon-game.html` | archivos que no existen |
| Sobre mí | `/`, `/proyectos`, `/sobre-mi` | rutas absolutas que no resuelven |

Correcciones aplicadas sobre la copia del repo (`public/ui-generated/`), que es donde los
enlaces relativos entre directorios tienen sentido — en el proyecto de Open Design cada
pantalla vive sola:

1. **Nav de las 4 pantallas** → rutas relativas (`../proyectos/index.html`, etc.). 22
   enlaces reescritos en total, incluidos los del menú mobile.
2. **Cards → detalle** (FR-14): el título de *Tienda Jedami* es ahora un enlace al detalle,
   en Home y en Proyectos, con estilo que hereda color y se subraya en hover/foco.
3. **CV**: apuntaba a `cv-marcelo-olivera.pdf` (inexistente); ahora a
   `../../Marcelo%20Olivera%20-%20Curriculum%20Vitae.pdf`, el archivo real de `public/`.
4. **`pokemon-game.html`** (pantalla que no se generó) → apunta a Proyectos, para no dejar
   un enlace muerto.
5. **`@view-transition { navigation: auto; }`** agregado a Home y Sobre mí: faltaba en esas
   dos, y una transición entre documentos se saltea si solo una de las dos pantallas la
   declara.

**Verificación:** servido por HTTP, **todos** los enlaces internos de las cuatro pantallas
responden 200 (incluido el CV). Recorrido con clicks reales
Home → Proyectos → Detalle → Sobre mí, más el menú mobile a 390 px (abre con
`aria-expanded`, sus enlaces navegan). Ninguna pantalla conserva rutas absolutas ni nombres
de archivo inventados, y las cuatro mantienen `aria-current="page"`.

Para recorrer el prototipo:

```bash
cd public && python3 -m http.server 8899
# abrir http://127.0.0.1:8899/ui-generated/home/index.html
```

### Design system compartido — corregido el incumplimiento de fondo

Las cuatro pantallas se habían generado por separado, cada una con su propia copia del
chasis. Eso **incumplía el principio central del agente** (*design-system-first: UNA fuente
de verdad de componentes*) y es la causa raíz de los bugs que fueron apareciendo: cada uno
hubo que arreglarlo una vez por pantalla.

**Divergencia medida antes de unificar:**

| Componente | Clases que había |
|---|---|
| Panel del menú | `mobile-menu` · `nav-main` · `nav__menu` |
| Botón primario | `btn-primary` y `btn--primary` |
| Icono | `ico` · `ic` · `icon` |
| Card de proyecto | `project-card` y `card` |

4.019 líneas de CSS, tokens redefinidos en las cuatro, y solo **131 líneas idénticas entre
todas**: no era duplicación prolija, era divergencia.

**Estructura resultante:**

```
public/ui-generated/
├── _system/                 ← UNA fuente de verdad
│   ├── tokens.css           (121)  color, tipografía, espaciado, movimiento
│   ├── components.css       (517)  base + chasis + primitivas + utilidades
│   ├── system.js                   tema, idioma, header, indicador, menú, reveal
│   ├── chasis.html                 header + footer canónicos
│   └── sprite.html                 símbolos SVG compartidos
├── home/              index.html + page.css (649) + page.js
├── proyectos/         index.html + page.css (364) + page.js
├── proyecto-detalle/  index.html + page.css (548) + page.js
└── sobre-mi/          index.html + page.css (661) + page.js
```

| Métrica | Antes | Después |
|---|---|---|
| CSS total | 4.019 líneas | 2.860 (638 sistema + 2.222 páginas) |
| Tokens `--color-bg` | en 4 archivos | en 1 |
| Clases por componente | hasta 3 nombres | 1 |
| JS del chasis | 4 implementaciones | 1 (`system.js`) |

**Consistencia demostrada (medida, no supuesta):** el hash de la firma del header es
idéntico en las cuatro (`1841270529`), el logo cae en `left: 79px` en las cuatro, el header
mide 81 px en las cuatro, cero clases de las convenciones viejas, `.chips` computa `flex`,
y los tres estados de tema devuelven el token exacto. Menú móvil: abre, sus enlaces reciben
el clic y cierra con `Escape` en las cuatro. Capturas de cada pantalla comparadas contra las
de antes: ninguna se ve peor.

**Cómo lo consume una pantalla:**

```html
<link rel="stylesheet" href="../_system/tokens.css">
<link rel="stylesheet" href="../_system/components.css">
<link rel="stylesheet" href="page.css">
<script src="../_system/system.js"></script>
<script src="page.js"></script>
```

El `page.js` solo registra sus textos (`MC.registrarTextos({es, en})`) y su comportamiento
propio: la timeline en Home y Sobre mí, la barra de progreso en Detalle. Proyectos quedó sin
JS propio — todo lo suyo era chasis duplicado.

### Las previews de Open Design también navegan — y por qué divergen del repo

Las correcciones de navegación se habían aplicado **solo en `public/ui-generated/`**. Las
**previewUrl del daemon** seguían con los enlaces originales: desde la preview de Proyectos,
`inicio.html` y `sobre-mi.html` daban **404**. De ahí el "Inicio y Sobre mí no andan".

El prototipo vive en dos contextos con estructuras de URL distintas, y **no existe un href
que sirva en los dos**:

| Contexto | Estructura | href entre pantallas |
|---|---|---|
| Repo (`public/ui-generated/`) | directorios hermanos | `../sobre-mi/index.html` |
| Preview del daemon | proyectos separados de Open Design | `../../portfolio-sobre-mi-v2/raw/index.html` |

Se arreglaron **ambos**, cada uno con la ruta que le corresponde. También se copió el CV a
los proyectos de Open Design, y se replicaron ahí el fix de `z-index` del menú y el
`@view-transition`.

> ⚠ **Consecuencia a tener presente:** las dos copias ahora **divergen a propósito en los
> `href`**. Si se vuelve a correr `od.sh pull` sobre estas pantallas, el repo recibirá las
> rutas del daemon (`../../portfolio-*/raw/…`) y la navegación del repo se rompe. Si hace
> falta re-hacer el pull, reaplicar después el mapeo de rutas del repo.

**Verificación en las previews:** todos los enlaces internos responden 200 (incluido el CV),
circuito recorrido con clicks reales (Proyectos → Inicio → Sobre mí → Inicio), y el menú
mobile de las 4 abre con sus 3 enlaces clickeables.

**Preview del prototipo del repo:**

```bash
cd public && python3 -m http.server 8899
# http://127.0.0.1:8899/ui-generated/home/index.html
```

**Preview del daemon** (el puerto cambia en cada arranque):

```bash
bash _bmad/danflow/workflows/create-ui-from-ux/scripts/od.sh preview portfolio-home-v2
```

### Menú mobile — corregido

El menú hamburguesa abría pero **no se podía navegar** en Proyectos y Detalle de proyecto.

**Causa:** el panel del menú (`.nav-main`) y el velo (`.nav-scrim`) tenían ambos
`z-index: auto`. Como el scrim aparece después en el DOM, se pintaba **encima** del panel e
interceptaba todos los clicks. Medido con `document.elementFromPoint()` sobre el centro de
cada enlace: devolvía `.nav-scrim` en los tres. El menú se veía bien y era inusable.

Home y Sobre mí no tenían el problema porque no usan scrim — por eso verificar solo la Home
en la ronda anterior lo dejó pasar.

**Fix** (aplicado a `proyectos/styles.css` y `proyecto-detalle/styles.css`):

```css
.nav-scrim { z-index: 90; }
.nav-main  { z-index: 105; }   /* header = 100 */
```

**Verificación en las 4 pantallas a 390 px:** el botón es visible, abre
(`aria-expanded="true"`), los 3 enlaces reciben el clic (ninguno tapado, medido con
`elementFromPoint`), y el menú cierra con `Escape`. Navegación real confirmada desde el
menú: Proyectos → Sobre mí.

### Fix quirúrgico aplicado

En `home/styles.css`, los valores de contacto usaban `font-size` hasta 19 px y con
`overflow-wrap: anywhere` el email se partía en dos líneas a mitad de palabra
(`olivera.m.et13@gmail.co` / `m`). Bajado el máximo del `clamp` a 17 px. Medido con
`Range.getClientRects()`: los tres valores (teléfono, email, LinkedIn) ocupan **1 línea**.

---

## Tokens aplicados

Paleta de la UX spec sin desviaciones, con la corrección de contraste que el agente
introdujo y documentó en el CSS:

| Token | Oscuro | Claro |
|---|---|---|
| `--color-bg` | `#0B0D10` | `#FAFAF9` |
| `--color-surface` | `#12151A` | `#FFFFFF` |
| `--color-border` | `#262C35` | `#E2E2DF` |
| `--color-text` | `#EDEFF2` | `#14171C` |
| `--color-text-muted` | `#98A1AE` | `#5A6270` |
| `--color-accent` | `#FF7948` | `#E2551F` |
| `--color-focus` | `#4CC9F0` | `#0B7EA3` |

**Corrección de contraste (aceptada):** `#E2551F` sobre `#FAFAF9` da 3.6:1 — alcanza para
texto grande pero no para texto pequeño. El agente agregó `--color-accent-text`, que en
tema claro baja a `#C84615` (4.65:1) para los usos de acento en texto chico. Los ratios los
reportó el agente; conviene confirmarlos con una herramienta independiente.

Tipografías: Space Grotesk (display) · Inter (body) · JetBrains Mono (chips y etiquetas).

---

## Animaciones implementadas

| Pantalla | Gesto protagónico | Acompañamiento |
|---|---|---|
| Home | Revelado del hero por máscara, escalonado a 70 ms | Nav con blur al scroll, indicador deslizante, cards con lift + zoom, timeline dibujada por scroll |
| Proyectos | Entrada escalonada de la grilla | Encabezado por máscara, cards con lift, `view-transition-name` por card |
| Detalle | Barra de progreso de lectura (`scaleX`) | Encabezado por máscara, reveals por bloque, imagen como elemento compartido con la card |
| Sobre mí | Timeline dibujada con `scaleY` según scroll, con pop de cada hito | Reveals por bloque, certificado con lupa y lightbox accesible |

Clases canónicas en las cuatro: `.reveal` → `.is-visible`, `.mask` + `.mask-in`.
Todo se anima sobre `transform` y `opacity`. Las cuatro incluyen el bloque
`@media (prefers-reduced-motion: reduce)` que deja cada elemento en su estado final visible.

---

## Qué cambió respecto de la v1

| Aspecto | v1 | v2 |
|---|---|---|
| Nombres de entry | 4 nombres distintos | `index.html` en las 4 |
| Estructura | 2 autocontenidas, 2 con archivos separados | Las 4 con los 3 archivos |
| Clases de animación | `is-visible` / `is-revealed` / `is-in` | `.reveal` → `.is-visible` en las 4 |
| Forzar tema oscuro | No funcionaba en Home | Funciona en las 4 |
| Verificar el estado revelado | Hacks distintos por pantalla | Un hook: `data-qa="show-all"` |
| Bug de cascada en chips | Apareció (corregido a mano) | No apareció |
| Imágenes | Placeholders | Imágenes reales del repo |
| Home — proyectos | 2 + 1 en dos filas | 3 en una fila |
| Secciones | Solo título | Título + bajada con carácter |

---

## Notas de implementación para el desarrollador

Los archivos son la **referencia visual**, no el código final. Para llevarlos a Vue 3:

1. **Tokens primero.** Trasladar las variables CSS a `src/styles/sass/variables/` y borrar
   los valores hardcodeados de los componentes (Fase F1 del PRD).
2. **Componentes canónicos.** Unificar `MainTitle`, `SubTitle`, `SectionTitle` y
   `ProjectTitle` en un `SectionHeading` con prop de nivel; `ButtonCustom` → `AppButton`
   con variantes `primary` / `secondary` / `ghost`.
3. **Datos de proyectos.** Extraer a un módulo único (hoy duplicados entre `HomeView.vue` y
   `ProjectsView.vue`) con `slug`, problema, rol y stack — el detalle los necesita.
4. **Ruta nueva.** Agregar `/projects/:slug` al router.
5. **Movimiento.** El `IntersectionObserver` de los reveals se puede extraer a un
   composable `useScrollReveal()` y reutilizar en todas las vistas.
6. **Transiciones de ruta.** Envolver `<router-view>` en `<Transition>` y usar
   `view-transition-name` donde el navegador lo soporte, con degradación a fade.
7. **i18n.** El markup generado trae atributos `data-i18n`: sirven de inventario de claves
   para completar la cobertura ES/EN.
8. **Mantener el hook de QA.** `data-qa="show-all"` es útil para tests visuales en CI:
   permite capturar el estado final sin depender del scroll.

---

## Próximos pasos sugeridos

- Falta la captura del proyecto de chat (`chat-preview.png`) — es el único placeholder que
  queda, porque la imagen no existe en el repo.
- Medir Lighthouse sobre la implementación en Vue y contrastar con M1–M4 del PRD.
- Verificar contraste AA con herramienta independiente, en ambos temas.
- Decidir si el sitio adopta las cuatro pantallas de una o va por fases (F1–F4 del PRD).

---

## Documentos relacionados

- `prd.md` — requisitos del producto
- `ux-design-specification.md` — sistema de diseño y movimiento
- `ui-prompts/` — prompts usados (incluyen el contrato técnico de salida)
- `ui-screenshots/` — capturas de referencia
- `_bmad/danflow/workflows/create-ui-from-ux/workflow.md` — el workflow, con las lecciones
  de esta corrida ya incorporadas
