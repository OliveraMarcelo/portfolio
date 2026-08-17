# Sobre mí — MarceCode (portfolio de Marcelo Olivera)

## Contexto

Portfolio personal de **Marcelo Olivera**, Frontend Developer argentino que trabaja en
EXO S.A. El sitio vive en `marcecode.com`. Público primario: reclutadores técnicos que
quieren confirmar que hay trayectoria real detrás del portfolio.

Esta es la pantalla **Sobre mí** (`/about`). Hoy es una lista de párrafos con emojis; tiene
que convertirse en una **línea de tiempo** que se lee de un vistazo y se completa a medida
que se scrollea. Es la pantalla que decide si el visitante cree que esto es una profesión
o un hobby.

Mobile-first, en **español**, dark-first con tema claro completo.

## Dirección visual — "Estudio Nocturno"

- Dark-first: fondo casi negro `#0B0D10`, superficies apenas elevadas, separación por
  borde sutil más que por sombra.
- Tipografía display grande y apretada (`letter-spacing: -0.03em`, `line-height: 0.95`).
- El naranja de marca `#FF7948` se usa **con avaricia**: el punto de cada hito de la línea
  de tiempo, la acción primaria, el chip destacado. Máximo un elemento en acento por pliegue.
- Grano sutil (ruido CSS/SVG al 3 % de opacidad) sobre el fondo.
- Esta pantalla es **narrativa**: más aire, medida de texto acotada, ritmo tranquilo.
- **NO debe ser:** ni un CV plano, ni una lista de párrafos con emojis sueltos.

## Design tokens (usar EXACTAMENTE estos)

**Tema oscuro (por defecto)**
```
--color-bg:             #0B0D10;
--color-surface:        #12151A;
--color-surface-raised: #1A1F26;
--color-border:         #262C35;
--color-text:           #EDEFF2;
--color-text-muted:     #98A1AE;
--color-accent:         #FF7948;
--color-accent-hover:   #FF8F66;
--color-accent-soft:    rgba(255, 121, 72, 0.12);
--color-focus:          #4CC9F0;
```

**Tema claro**
```
--color-bg:             #FAFAF9;
--color-surface:        #FFFFFF;
--color-surface-raised: #F4F4F2;
--color-border:         #E2E2DF;
--color-text:           #14171C;
--color-text-muted:     #5A6270;
--color-accent:         #E2551F;
--color-accent-hover:   #C84615;
--color-accent-soft:    rgba(226, 85, 31, 0.10);
--color-focus:          #0B7EA3;
```

**Tipografía**
```
--font-display: 'Space Grotesk', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'JetBrains Mono', monospace;   /* fechas, etiquetas, chips */
```

**Escala fluida**
```
--text-3xl:  clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
--text-2xl:  clamp(2rem, 1.6rem + 2vw, 3rem);
--text-xl:   clamp(1.5rem, 1.3rem + 1vw, 2rem);
--text-lg:   clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem);
--text-base: clamp(1rem, 0.96rem + 0.2vw, 1.0625rem);
--text-sm:   clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem);
```

**Espaciado / radios / contenedor**
```
--space-4: 1rem;  --space-8: 2rem;  --space-16: 4rem;  --space-24: 6rem;  --space-32: 8rem;
--radius-sm: 6px;  --radius-md: 12px;  --radius-lg: 20px;  --radius-full: 999px;
--container-max: 1200px;
--gutter: clamp(1.25rem, 4vw, 3rem);
--shadow-md: 0 8px 24px rgba(0,0,0,0.28);
--shadow-lg: 0 24px 64px rgba(0,0,0,0.36);
```

**Movimiento**
```
--dur-instant: 100ms;  --dur-fast: 180ms;  --dur-base: 320ms;
--dur-slow: 600ms;     --stagger: 70ms;
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Estructura de la pantalla (en este orden)

1. **Nav** fijo (mismo componente que el resto del sitio): logo `</> MarceCode`, ítems
   Inicio · Proyectos · Sobre mí con **Sobre mí activo**, toggle de tema y de idioma.
2. **Encabezado**: H1 "Sobre mí ." (el punto en acento) + bajada:
   "Desarrollar sitios web hermosos y funcionales es lo que amo hacer, y por eso doy lo
   mejor de mí en cada nuevo desafío."
   A la derecha (o debajo en mobile), retrato con máscara suave.
   Acción: **[Descargar CV]** primaria en acento.
3. **Línea de tiempo** — eje vertical con un punto en acento por hito. En desktop, los
   hitos alternan lado; en mobile, todos a la derecha del eje. Cada hito tiene: etiqueta de
   período en mono, título del puesto o formación, institución, y un párrafo.
4. **Certificado** — bloque con la imagen del certificado de Digital House, ampliable en un
   lightbox accesible (cierre con `Escape`, foco atrapado, retorno al disparador).
5. **Más allá del código** — bloque breve sobre música, con tratamiento visual distinto
   (superficie elevada) para que corte el ritmo de la línea de tiempo.
6. **Contacto** — "Hablemos ." con los tres canales.
7. **Footer** — `</> MarceCode`, año 2026, y "Hecho con Vue".

## Animaciones y transiciones (parte central del encargo)

- **Entrada del encabezado:** el H1 se revela por máscara desde abajo —
  `translateY(100%) → 0` dentro de un contenedor con `overflow: hidden` — y la bajada lo
  sigue 70 ms después. El retrato entra con fade y `scale(1.04) → 1`.
- **Línea de tiempo (gesto protagónico):** la línea vertical se dibuja progresivamente con
  `scaleY` según el avance del scroll (`transform-origin: top`). Cada punto de hito hace un
  pop con `--ease-spring` al ser alcanzado, y su contenido entra con
  `opacity 0 → 1` + `translateX(±24px) → 0` según el lado.
- **Scroll reveal:** el resto de los bloques entra con `opacity 0 → 1` +
  `translateY(24px) → 0` en 600 ms con `--ease-out`, umbral del 15 %, una sola vez.
- **Nav en scroll:** pasando los 80 px, la barra va de transparente a superficie con
  `backdrop-filter: blur(12px)` y reduce su altura, en 320 ms.
- **Certificado en hover:** `scale(1.02)` y aparición de un ícono de lupa. Al abrir el
  lightbox, la imagen escala desde su posición con fondo que va oscureciendo.
- **Micro-interacciones:** botones `scale(0.97)` al presionar; chips con elevación de 2 px
  y borde en acento al hover; enlaces de texto con subrayado que crece desde la izquierda.

**Reglas de movimiento — obligatorias:**
- Animar **solo** `transform` y `opacity`. Nunca `width`, `height`, `top` ni `left`.
- Un gesto protagónico por sección; el resto es acompañamiento.
- Ninguna entrada supera los 900 ms. El contenido es legible aunque la animación no termine.
- `@media (prefers-reduced-motion: reduce)` desactiva todo y deja cada elemento en su
  **estado final visible**.

## Contenido real (usar tal cual — NADA de Lorem Ipsum)

**Hitos de la línea de tiempo, del más reciente al más antiguo:**

1. **Actualidad — Frontend Developer · EXO S.A.**
   "Formo parte del equipo de desarrollo de software. Me especializo en interfaces modernas
   con Flutter, Riverpod y Dart para web, mobile y aplicaciones de escritorio en Windows.
   Participo en el diseño de componentes, el consumo de APIs y el mantenimiento del código."
   Chips: `Flutter` `Riverpod` `Dart`

2. **Actualidad — Vue.js · Dashboards y herramientas internas**
   "Desarrollo dashboards para visualización de datos y herramientas internas, con foco en
   experiencias de usuario fluidas y accesibles."
   Chips: `Vue` `JavaScript`

3. **En curso — Desarrollo de Software · IFTS N.º 11**
   "Estudiante de Desarrollo de Software en el Instituto de Formación Técnica Superior
   N.º 11, cursando el primer año. Durante este proceso adquirí conocimientos en algoritmos,
   estructuras de datos y programación orientada a objetos."

4. **Egresado — Full Stack Developer · Digital House**
   "Completé el curso de Full Stack Developer, aprendiendo HTML, CSS, JavaScript, Node.js,
   Express, React y bases de datos relacionales y no relacionales."
   Chips: `Node.js` `Express` `React` `SQL`

5. **Siempre — Autodidacta**
   "Me capacito constantemente por mi cuenta a través de cursos, documentación oficial y
   proyectos prácticos que me permiten aplicar y afianzar lo aprendido. Esta actitud me
   ayuda a mantenerme actualizado en un entorno tecnológico en constante cambio."

**Proyectos personales (bloque breve dentro de la línea de tiempo o al pie de ella):**
"En mis tiempos libres desarrollo proyectos que me permiten explorar nuevas tecnologías y
resolver problemas reales: un chat en tiempo real con WebSockets centrado en rendimiento y
experiencia de usuario, y dashboards interactivos con filtros avanzados, manejo de estados
y visualización dinámica de datos."

**Más allá del código:**
"Soy guitarrista y me gusta cantar. La música me ayuda a mantener el equilibrio, estimular
la creatividad y conectar con otras personas desde un lugar artístico. Me enseña sobre
disciplina, práctica constante y expresión personal — cosas que también hacen a un mejor
desarrollador."

**Certificado:** "Certificado Full Stack Developer — Digital House"

**Contacto:**
- WhatsApp: `+54 11 3432-3271` → `https://wa.me/541134323271`
- Email: `olivera.m.et13@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/marcelodanielolivera/`

**CV:** archivo `Marcelo Olivera - Curriculum Vitae.pdf`

**Imágenes:** usar placeholders con el color dominante de la paleta y un rótulo claro de
qué imagen va ahí (el proyecto real ya tiene `photo.jpeg` para el retrato e `image.png`
para el certificado). No usar fotos de stock de personas.

## Requisitos técnicos

- Mobile-first (base 390 px), verificado en 390 / 768 / 1280 / 1920.
- Alturas de viewport con `svh`/`dvh`, nunca `vh`.
- Tema claro y oscuro vía tokens CSS, con toggle funcional que persiste en `localStorage`
  y respeta `prefers-color-scheme`. Sin flash de tema al recargar.
- Accesibilidad WCAG 2.1 AA: contraste verificado en ambos temas, `:focus-visible` con
  anillo de 2 px en `--color-focus` y `outline-offset: 3px`, landmarks semánticos, una sola
  `h1`, jerarquía de encabezados sin saltos, `aria-label` en botones con solo ícono,
  `aria-current="page"` en el nav activo, skip link como primer tabulable, objetivos
  táctiles de mínimo 44×44 px.
- El lightbox del certificado debe atrapar el foco, cerrarse con `Escape` y devolver el
  foco al elemento que lo abrió.
- La línea de tiempo debe usar una lista semántica (`ol`/`li`), no `div` sueltos.
- Medida de texto máxima de `68ch` en los párrafos.
- Imágenes con `width`/`height` declarados y `loading="lazy"` fuera del viewport inicial.
- Enlaces externos con `rel="noopener noreferrer"` y `target="_blank"`.
- HTML/CSS/JS estándar, en un `index.html` autocontenido o con archivos hermanos.
- Sin errores de consola.

## Contrato técnico de salida (obligatorio)

Esta pantalla es parte de un sitio de cuatro pantallas que se generan por separado pero
tienen que resultar **un solo sistema**. Estas convenciones no son negociables.

**Archivos** — exactamente estos tres nombres, siempre:

- `index.html` — el entry file SIEMPRE se llama así, sin importar el nombre de la pantalla
- `styles.css` — todo el CSS acá, nada de `<style>` inline en el HTML
- `main.js` — todo el JS acá

**Contrato de tema** — los tres casos tienen que funcionar:

- `:root` sin atributo → tema oscuro (el default de esta dirección visual)
- `<html data-theme="dark">` → fuerza oscuro. **Declarar la regla `[data-theme="dark"]`
  explícitamente aunque oscuro ya sea el default**: si no existe, forzar el tema desde
  fuera no hace nada y el diseño no se puede revisar en oscuro.
- `<html data-theme="light">` → fuerza claro

El tema inicial se resuelve **antes del primer paint** (script inline en el `<head>`),
respeta `prefers-color-scheme` cuando no hay preferencia guardada, y persiste la elección
manual en `localStorage`.

**Contrato de animación** — nombres de clase canónicos, sin variantes propias:

- Elemento que entra al scroll: clase `reveal`; el observer le agrega `is-visible`
- Elemento que entra por máscara: contenedor `mask` (con `overflow: hidden`) + hijo `mask-in`
- **Ninguna clase utilitaria de animación (`reveal`, `mask-in`) debe declarar `display`.**
  Pisa por cascada el layout del elemento que envuelve — a un `ul.chips` lo saca de `flex`
  y los chips se apilan a ancho completo. Si hace falta `display: block` para que el
  `transform` funcione, usar un selector que no colisione (`span.mask-in`, `h1.mask-in`).

**Hook de verificación** — agregar en `styles.css` una regla que, con
`<html data-qa="show-all">`, deje todo elemento animado en su estado final visible
(`opacity: 1; transform: none`). Es el mismo estado que produce `prefers-reduced-motion`,
expuesto para poder inspeccionar el diseño sin correr las animaciones.

**Artefactos de tu propia verificación** — si sacás capturas para revisar tu trabajo,
guardalas en un subdirectorio `.qa/`. No las dejes en la raíz del proyecto: la raíz es el
entregable y se copia tal cual al repo.

**Contrato de navegación** — el prototipo tiene que ser **clickeable de punta a punta**.
Cada pantalla vive en su propio directorio hermano, así que los enlaces entre pantallas son
relativos con `../`:

| Destino | href exacto |
|---|---|
| Inicio | `../home/index.html` |
| Proyectos | `../proyectos/index.html` |
| Detalle de proyecto | `../proyecto-detalle/index.html` |
| Sobre mí | `../sobre-mi/index.html` |
| La pantalla actual (logo, ítem activo) | `index.html` |
| CV en PDF | `../../Marcelo%20Olivera%20-%20Curriculum%20Vitae.pdf` |

- **Prohibido** `href="/"` o `href="/proyectos"`: no resuelven servido desde un subdirectorio.
- **Prohibido** inventar nombres (`projects.html`, `inicio.html`, `about.html`).
- Nunca dejar un enlace a un archivo que no se generó.
- La card de **Tienda Jedami** lleva al detalle: su título es el enlace.
- Declarar `@view-transition { navigation: auto; }` en `styles.css`; si falta en una de las
  dos pantallas involucradas, el navegador descarta la transición.

**Contrato de apilamiento del menú mobile** — el menú tiene que ser **usable**, no solo
verse. Declarar `z-index` **explícito** en las tres capas, nunca dejarlas en `auto`:

```css
.scrim  { z-index: 90; }   /* el velo que oscurece la pagina */
.header { z-index: 100; }
.panel  { z-index: 105; }  /* el panel del menu va SOBRE el scrim */
```

Con las tres en `auto` gana la que aparece después en el DOM: si el scrim va después del
panel, se pinta encima y **se come todos los clicks** — el menú se ve bien y no navega.
El panel necesita **fondo opaco**, el `<body>` queda en `overflow: hidden` mientras está
abierto, y el menú cierra de tres formas: botón, `Escape` y clic en el scrim.

**Consistencia entre pantallas** — el nav y el footer son los mismos componentes en las
cuatro pantallas: mismo markup, mismas clases, misma altura, logo en la misma posición.
Lo único que cambia es cuál ítem está activo. No inventar una variante propia para esta
pantalla.
