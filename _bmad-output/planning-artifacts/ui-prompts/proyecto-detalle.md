# Detalle de proyecto — MarceCode (portfolio de Marcelo Olivera)

## Contexto

Portfolio personal de **Marcelo Olivera**, Frontend Developer argentino que trabaja en
EXO S.A. El sitio vive en `marcecode.com`. Público primario: tech leads y desarrolladores
senior que evalúan la calidad real del trabajo antes de mirar el código en GitHub.

Esta es la vista **Detalle de proyecto** (`/projects/:slug`). Es una pantalla **nueva**: hoy
las cards no llevan a ningún lado. Su trabajo es contar el problema resuelto, el rol y el
stack — no repetir el resumen de la card. Generar la instancia del proyecto
**Tienda Jedami** como caso concreto; la estructura debe servir para cualquier proyecto.

Mobile-first, en **español**, dark-first con tema claro completo.

## Dirección visual — "Estudio Nocturno"

- Dark-first: fondo casi negro `#0B0D10`, superficies apenas elevadas, separación por
  borde sutil más que por sombra.
- Tipografía display grande y apretada (`letter-spacing: -0.03em`, `line-height: 0.95`).
- El naranja de marca `#FF7948` se usa **con avaricia**: solo en la acción primaria y el
  chip destacado. Máximo un elemento en acento por pliegue.
- Grano sutil (ruido CSS/SVG al 3 % de opacidad) sobre el fondo.
- Esta pantalla es **de lectura**: más aire, medida de texto acotada, ritmo tranquilo.
- **NO debe ser:** ni terminal brutalista, ni un muro de texto sin jerarquía.

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
--font-mono:    'JetBrains Mono', monospace;
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
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

## Estructura de la pantalla (en este orden)

1. **Nav** fijo (mismo componente que el resto del sitio): logo `</> MarceCode`, ítems
   Inicio · Proyectos · Sobre mí con **Proyectos activo**, toggle de tema y de idioma.
2. **Migas de navegación**: `Proyectos / Tienda Jedami`, con "Proyectos" como enlace de
   vuelta.
3. **Encabezado del proyecto**:
   - H1: "Tienda Jedami"
   - Bajada de una línea: "E-commerce con catálogo, carrito y gestión de pedidos."
   - Chips del stack en mono
   - Acciones: **[Ver en vivo ↗]** primaria en acento · **[Ver código ↗]** secundaria ghost
4. **Imagen grande** del proyecto, ancho contenido, `--radius-lg`, con un borde sutil.
   Es el elemento compartido con la card de la grilla.
5. **Ficha rápida** — franja de tres datos en mono: `Rol` · `Año` · `Estado`.
6. **Bloques de lectura**, cada uno con su encabezado (medida máxima de `68ch`):
   - **El problema** — qué necesidad resolvía
   - **La solución** — cómo se resolvió, decisiones técnicas
   - **Mi rol** — qué hizo Marcelo concretamente
7. **Stack completo** — lista agrupada de tecnologías con una línea de por qué cada una.
8. **Navegación al siguiente proyecto** — card ancha al pie: "Siguiente proyecto →
   Pokemon Game".
9. **Footer** — `</> MarceCode`, año 2026, y "Hecho con Vue".

## Animaciones y transiciones (parte central del encargo)

- **Entrada continua desde la grilla:** la imagen del proyecto lleva
  `view-transition-name: project-img-tienda-jedami`, el mismo nombre que la imagen de su
  card en `/projects`, para que la transición entre vistas sea continua en lugar de un
  corte. Si la View Transition API no está disponible, degradar a fade:
  entrada `opacity 0 → 1` + `translateY(16px) → 0` en 320 ms con `--ease-in-out`.
- **Entrada del encabezado:** el H1 se revela por máscara desde abajo —
  `translateY(100%) → 0` dentro de un contenedor con `overflow: hidden` — y los chips y las
  acciones lo siguen escalonados cada 70 ms.
- **Scroll reveal:** cada bloque de lectura entra con `opacity 0 → 1` +
  `translateY(24px) → 0` en 600 ms con `--ease-out`, umbral del 15 %, una sola vez.
- **Barra de progreso de lectura:** línea de 2 px en acento fija en el tope, que avanza con
  `scaleX` según el scroll de la página.
- **Nav en scroll:** pasando los 80 px, la barra va de transparente a superficie con
  `backdrop-filter: blur(12px)` y reduce su altura, en 320 ms.
- **Card de siguiente proyecto en hover:** `translateY(-6px)`, sombra de `--shadow-md` a
  `--shadow-lg`, y la flecha `→` se desplaza 6 px a la derecha. 180 ms.
- **Micro-interacciones:** botones `scale(0.97)` al presionar; chips con elevación de 2 px
  y borde en acento al hover; enlaces de texto con subrayado que crece desde la izquierda.

**Reglas de movimiento — obligatorias:**
- Animar **solo** `transform` y `opacity`. Nunca `width`, `height`, `top` ni `left`.
- Un gesto protagónico por sección; el resto es acompañamiento.
- Ninguna entrada supera los 900 ms. El contenido es legible aunque la animación no termine.
- `@media (prefers-reduced-motion: reduce)` desactiva todo y deja cada elemento en su
  **estado final visible**.

## Contenido real (usar tal cual — NADA de Lorem Ipsum)

**Proyecto:** Tienda Jedami — slug `tienda-jedami`
**En vivo:** `https://jedamiapp.com`
**Código:** `https://github.com/OliveraMarcelo/tienda-jedami`

**Ficha rápida:** Rol: Desarrollador full stack · Año: 2025 · Estado: En producción

**El problema**
"Un comercio necesitaba vender online sin depender de una plataforma de terceros: catálogo
propio, control del stock y gestión de los pedidos desde un mismo lugar."

**La solución**
"Una aplicación web con catálogo de productos, carrito de compras y panel de gestión de
pedidos. El frontend se construyó con Vue, consumiendo una API propia en Node.js y Express
sobre una base de datos relacional. Las vistas se armaron con componentes reutilizables y
rutas protegidas para la parte de administración."

**Mi rol**
"Diseñé e implementé la interfaz completa, definí la estructura de componentes y el manejo
de estado, y construí la API que la alimenta. También me ocupé del despliegue y de que el
sitio funcione bien en mobile, que es por donde entra la mayoría de los clientes."

**Stack completo**
- `Vue` — interfaz y manejo de estado del carrito
- `JavaScript` — lógica de la aplicación
- `Node.js` + `Express` — API de productos y pedidos
- `MySQL` — persistencia de catálogo, stock y pedidos
- `SASS` — estilos con variables y componentes

**Siguiente proyecto:** Pokemon Game — `/projects/pokemon-game`

**Imágenes:** usar un placeholder con el color dominante de la paleta y un rótulo claro
(el proyecto real ya tiene `jedami-preview.png`). No usar fotos de stock de personas.

## Requisitos técnicos

- Mobile-first (base 390 px), verificado en 390 / 768 / 1280 / 1920.
- Alturas de viewport con `svh`/`dvh`, nunca `vh`.
- Tema claro y oscuro vía tokens CSS, con toggle funcional que persiste en `localStorage`
  y respeta `prefers-color-scheme`. Sin flash de tema al recargar.
- Accesibilidad WCAG 2.1 AA: contraste verificado en ambos temas, `:focus-visible` con
  anillo de 2 px en `--color-focus` y `outline-offset: 3px`, landmarks semánticos, una sola
  `h1`, jerarquía de encabezados sin saltos, `aria-label` en botones con solo ícono,
  skip link como primer tabulable, objetivos táctiles de mínimo 44×44 px.
- Medida de texto máxima de `68ch` en los bloques de lectura.
- Imágenes con `width`/`height` declarados para evitar CLS.
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
