# Home — MarceCode (portfolio de Marcelo Olivera)

## Contexto

Portfolio personal de **Marcelo Olivera**, Frontend Developer argentino que trabaja en
EXO S.A. El sitio vive en `marcecode.com`. Público primario: reclutadores técnicos y tech
leads que evalúan en 60–90 segundos, más algún cliente potencial de freelance.

Esta es la **Home**: la pantalla tesis. El sitio es la demo — cada animación es evidencia
de competencia técnica, no adorno. Alguien tiene que pensar "este tipo sabe hacer
interfaces" antes de leer una línea del CV.

Mobile-first, bilingüe ES/EN (generar en **español**), dark-first con tema claro completo.

## Dirección visual — "Estudio Nocturno"

- Dark-first: fondo casi negro `#0B0D10`, superficies apenas elevadas, separación por
  borde sutil más que por sombra.
- Tipografía display **enorme y apretada**: el nombre "MARCELO OLIVERA" es el elemento más
  grande de todo el sitio (`letter-spacing: -0.03em`, `line-height: 0.95`).
- El naranja de marca `#FF7948` se usa **con avaricia**: solo en la acción primaria, el
  indicador de nav activo y el chip destacado. Máximo un elemento en acento por pliegue.
- Grano sutil (ruido CSS/SVG al 3 % de opacidad) sobre el fondo, para que el negro no se
  vea plano. Nunca una imagen pesada.
- Halo cálido: gradiente radial naranja muy suave y desenfocado detrás del retrato. Es el
  **único** gradiente del sitio.
- Precisión, no ruido. Elegante y técnico.
- **NO debe ser:** ni terminal brutalista con verde fósforo, ni plantilla genérica de
  portfolio, ni maximalismo WebGL que cueste performance.

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
--font-display: 'Space Grotesk', sans-serif;   /* H1, H2, números grandes */
--font-body:    'Inter', sans-serif;           /* párrafos, UI, nav */
--font-mono:    'JetBrains Mono', monospace;   /* chips de stack, etiquetas técnicas */
```

**Escala fluida**
```
--text-hero: clamp(3rem, 2rem + 7vw, 7.5rem);
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
--shadow-accent: 0 12px 40px rgba(255,121,72,0.22);
```

**Movimiento**
```
--dur-instant: 100ms;  --dur-fast: 180ms;  --dur-base: 320ms;
--dur-slow: 600ms;     --dur-hero: 900ms;  --stagger: 70ms;
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## Estructura de la pantalla (en este orden)

1. **Nav** fijo, transparente al inicio. Logo `</> MarceCode` a la izquierda (el `</>` en
   mono, en acento). Ítems: Inicio · Proyectos · Sobre mí. A la derecha: toggle de tema
   (☾/☀) y toggle de idioma (ES/EN). En mobile colapsa a hamburguesa.
2. **Hero** a `100svh`. Dos columnas desde 1024 px (texto izquierda, retrato derecha),
   apilado en mobile (texto arriba, retrato abajo).
   - Antetítulo: "Hola, soy" (mono, muted, pequeño)
   - H1: **MARCELO OLIVERA** en `--text-hero`
   - Subtítulo: "Frontend Developer" en `--text-xl`, con "Frontend" en acento
   - Propuesta de valor: "Construyo interfaces que se sienten tan bien como se ven — web,
     mobile y escritorio."
   - Acciones: **[Ver proyectos]** primaria en acento · **[Descargar CV]** secundaria ghost
   - Chips de stack en mono: `Vue` `Flutter` `TypeScript` `Node.js`
   - Retrato circular/con máscara suave y halo cálido detrás
   - Indicador de scroll abajo al centro, que desaparece al primer desplazamiento
3. **Proyectos destacados** — encabezado "Proyectos ." (el punto en acento), grilla de 2
   columnas desde 768 px, 1 en mobile. Al final, enlace "Ver todos los proyectos →".
4. **Stack** — encabezado "Mis habilidades .", tres grupos: Frontend, Backend, Herramientas.
5. **Trayectoria** — encabezado "Mi camino .", tres hitos en línea de tiempo vertical con la
   línea dibujándose según el scroll. Al final, enlace "Conocer más sobre mí →".
6. **Contacto** — encabezado "Hablemos .", tres canales grandes y táctiles.
7. **Footer** — `</> MarceCode`, año 2026, y "Hecho con Vue".

## Animaciones y transiciones (parte central del encargo)

- **Entrada del hero (protagónica, al cargar):** las líneas del título se revelan por
  máscara desde abajo — `translateY(100%) → 0` dentro de un contenedor con
  `overflow: hidden` — escalonadas cada 70 ms. El retrato entra con fade y `scale(1.04) → 1`.
  El halo cálido crece en opacidad detrás. Total: 900 ms.
- **Scroll reveal:** cada sección entra con `opacity 0 → 1` + `translateY(24px) → 0` en
  600 ms con `--ease-out`, umbral del 15 %, una sola vez por elemento. Los hijos de una
  grilla se escalonan cada 70 ms.
- **Nav en scroll:** pasando los 80 px, la barra va de transparente a superficie con
  `backdrop-filter: blur(12px)` y reduce su altura, en 320 ms.
- **Indicador de nav:** una barra en acento se desliza entre los ítems (posición y ancho
  animados) siguiendo el activo; en hover se adelanta al ítem apuntado y vuelve al salir.
- **Cards de proyecto en hover:** `translateY(-6px)`, sombra de `--shadow-md` a
  `--shadow-lg`, imagen interna a `scale(1.06)`, aparición de las acciones. 180 ms.
- **Línea de tiempo:** la línea vertical se dibuja con `scaleY` según el avance del scroll,
  y cada hito aparece al alcanzarlo.
- **Micro-interacciones:** botones `scale(0.97)` al presionar; chips con elevación de 2 px y
  borde en acento al hover; íconos de skill con rotación de 6° y `scale(1.08)` usando
  `--ease-spring`; toggle de tema que rota 180° mientras los colores cruzan; enlaces de
  texto con subrayado que crece desde la izquierda (`scaleX 0 → 1`).

**Reglas de movimiento — obligatorias:**
- Animar **solo** `transform` y `opacity`. Nunca `width`, `height`, `top` ni `left`.
- Un gesto protagónico por sección; el resto es acompañamiento.
- Ninguna entrada supera los 900 ms. El contenido es legible aunque la animación no termine.
- `@media (prefers-reduced-motion: reduce)` desactiva todo y deja cada elemento en su
  **estado final visible**.

## Contenido real (usar tal cual — NADA de Lorem Ipsum)

**Proyectos destacados:**

1. **Tienda Jedami** — "E-commerce con catálogo de productos, carrito de compras y gestión
   de pedidos." Stack: `Vue` `Node.js`. En vivo: `https://jedamiapp.com` ·
   GitHub: `https://github.com/OliveraMarcelo/tienda-jedami`
2. **Pokemon Game** — "¿Quién es este Pokémon? Juego de adivinanza con siluetas usando la
   PokéAPI." Stack: `TypeScript` `Vue`. En vivo:
   `https://pokemon-game-theta-gold.vercel.app` ·
   GitHub: `https://github.com/OliveraMarcelo/pokemon-game`
3. **Mensajería en tiempo real** — "Chat en tiempo real con WebSockets, centrado en
   rendimiento y experiencia de usuario." Stack: `WebSockets` `Node.js`.

**Stack:**
- Frontend: HTML, CSS, JavaScript, Vue, React, Flutter
- Backend: Node.js, Express, SQL / NoSQL
- Herramientas: Git, Docker

**Trayectoria (3 hitos):**
- **Frontend Developer — EXO S.A.** *(actual)* — "Interfaces con Flutter, Riverpod y Dart
  para web, mobile y escritorio Windows. Dashboards de visualización de datos con Vue.js."
- **Desarrollo de Software — IFTS N.º 11** *(en curso)* — "Algoritmos, estructuras de datos
  y programación orientada a objetos."
- **Full Stack Developer — Digital House** *(egresado)* — "HTML, CSS, JavaScript, Node.js,
  Express, React y bases de datos relacionales y no relacionales."

**Contacto:**
- WhatsApp: `+54 11 3432-3271` → `https://wa.me/541134323271`
- Email: `olivera.m.et13@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/marcelodanielolivera/`

**Imágenes:** para el retrato y las capturas de proyecto, usar placeholders con el color
dominante de la paleta y un rótulo claro de qué imagen va ahí (el proyecto real ya tiene
los archivos: `photo.jpeg`, `jedami-preview.png`, `pokemon-preview.png`). No usar fotos de
stock de personas.

## Requisitos técnicos

- Mobile-first (base 390 px), verificado en 390 / 768 / 1280 / 1920.
- Alturas de viewport con `svh`/`dvh`, nunca `vh`.
- Tema claro y oscuro vía tokens CSS, con toggle funcional que persiste en `localStorage`
  y respeta `prefers-color-scheme`. Sin flash de tema al recargar.
- Accesibilidad WCAG 2.1 AA: contraste verificado en ambos temas, `:focus-visible` con
  anillo de 2 px en `--color-focus` y `outline-offset: 3px`, landmarks semánticos
  (`header`/`nav`/`main`/`footer`), una sola `h1`, `aria-label` en los botones con solo
  ícono, `aria-current="page"` en el nav activo, skip link como primer tabulable,
  objetivos táctiles de mínimo 44×44 px.
- Grilla de proyectos con `repeat(auto-fit, minmax(320px, 1fr))` — sin anchos calculados
  por índice.
- Enlaces externos con `rel="noopener noreferrer"`.
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
