---
stepsCompleted: ['discovery', 'core-experience', 'emotional-response', 'inspiration', 'design-system', 'defining-experience', 'visual-foundation', 'design-directions', 'user-journeys', 'component-strategy', 'ux-patterns', 'responsive-accessibility']
inputDocuments: ['prd.md']
---

# UX Design Specification — MarceCode Portfolio (Rediseño 2026)

**Autor:** Marcelo Olivera
**Fecha:** 2026-08-07
**Versión:** 1.0
**Documento base:** `prd.md`

---

## 1. Experiencia central

### 1.1 La frase que define el sitio

> **"El sitio es la demo."**

Todo lo demás se subordina a eso. Cada decisión se valida con una pregunta:
*¿esto demuestra competencia técnica, o solo la declara?*

### 1.2 Respuesta emocional buscada

| Momento | Lo que debe sentir el visitante |
|---|---|
| Primeros 2 segundos | "Esto está bien hecho." — precisión, no ruido |
| Primer scroll | "Ah, responde." — el sitio está vivo y acompaña |
| Ver los proyectos | "Esto es real, está en producción" |
| Leer la trayectoria | "Trabaja de esto en serio, no es un hobby" |
| Al irse | "Me quedo con el contacto" |

**Lo que NO debe sentir:** que está frente a una plantilla; que las animaciones lo hacen
esperar; que hay que adivinar dónde hacer clic.

### 1.3 Referencias e inspiración

- **Linear / Vercel** — tipografía grande y precisa, oscuro con un acento, movimiento sobrio.
- **Portfolios de agencia** — el gesto protagónico del hero como declaración de intención.
- **Stripe Docs** — micro-interacciones que confirman cada acción sin distraer.

Lo que se toma: la disciplina tipográfica y la contención del color.
Lo que se descarta: el maximalismo WebGL — cuesta performance y este sitio compite por
segundos, no por espectáculo.

---

## 2. Direcciones visuales exploradas

### D1 — **Estudio Nocturno** ✅ *(dirección elegida)*

Dark-first. Fondo casi negro con superficies apenas elevadas, tipografía display enorme y
apretada, y el naranja de marca (`#FF7948`) usado con avaricia: solo en la acción primaria,
el indicador activo y el foco. Grano sutil sobre el fondo y un halo cálido detrás del
retrato. El movimiento es el protagonista: revelados por máscara, indicador de nav que se
desliza, cards que se levantan.

**Por qué se elige:** es la dirección donde el movimiento luce más y donde el naranja
existente gana fuerza en lugar de perderse. Mantiene continuidad con la marca actual
(MarceCode, favicon `</>`) sin heredar su blandura. Y dark-first es el terreno natural de
la audiencia técnica primaria.

### D2 — Editorial Claro

Fondo blanco cálido, grid editorial visible, serif de peso alto para títulos, líneas finas
como separadores. Elegante y muy legible.
**Por qué no:** el movimiento se nota menos sobre blanco y la propuesta se vuelve más
"diseñador" que "frontend developer".

### D3 — Terminal Brutalista

Monoespaciada en todo, bordes duros de 2 px, sin sombras, verde fósforo sobre negro.
**Por qué no:** es un cliché del portfolio de developer y limita el rango expresivo del
resto del contenido (certificados, fotos, capturas).

> El tema **claro es obligatorio igualmente** (FR-26): D1 define su variante clara como una
> inversión disciplinada de tokens, no como un tema secundario descuidado.

---

## 3. Fundación visual

### 3.1 Color — tokens

**Tema oscuro (por defecto)**

```css
--color-bg:            #0B0D10;  /* fondo base */
--color-surface:       #12151A;  /* cards, superficies */
--color-surface-raised:#1A1F26;  /* hover, elementos elevados */
--color-border:        #262C35;  /* bordes sutiles */
--color-text:          #EDEFF2;  /* texto principal */
--color-text-muted:    #98A1AE;  /* texto secundario */
--color-accent:        #FF7948;  /* naranja de marca — acción primaria */
--color-accent-hover:  #FF8F66;
--color-accent-soft:   rgba(255, 121, 72, 0.12);  /* fondos de chip, halos */
--color-focus:         #4CC9F0;  /* anillo de foco — frío, siempre distinguible */
--color-success:       #3DD68C;
```

**Tema claro**

```css
--color-bg:            #FAFAF9;
--color-surface:       #FFFFFF;
--color-surface-raised:#F4F4F2;
--color-border:        #E2E2DF;
--color-text:          #14171C;
--color-text-muted:    #5A6270;
--color-accent:        #E2551F;  /* naranja oscurecido para contraste AA sobre claro */
--color-accent-hover:  #C84615;
--color-accent-soft:   rgba(226, 85, 31, 0.10);
--color-focus:         #0B7EA3;
--color-success:       #16794C;
```

**Reglas de color**

- El acento **nunca** se usa para texto largo. Solo: botón primario, indicador activo,
  subrayado del enlace en hover, chip destacado.
- Máximo **un** elemento en acento por pliegue de pantalla.
- El foco usa un color distinto del acento (`--color-focus`, frío) para que sea legible
  incluso encima de un elemento ya acentuado.
- Todo par texto/fondo debe verificarse contra WCAG 2.1 AA (4.5:1 en texto normal,
  3:1 en texto ≥ 24 px y en elementos gráficos) antes de dar el diseño por cerrado.

### 3.2 Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Space Grotesk** (600/700) | H1, H2, números grandes |
| Body | **Inter** (400/500/600) | párrafos, UI, navegación |
| Mono | **JetBrains Mono** (400/500) | chips de stack, etiquetas técnicas, el `</>` de marca |

Se reemplaza Poppins: su geometría redonda contradice la precisión que busca D1.
Space Grotesk aporta carácter técnico sin caer en la monoespaciada.

**Escala fluida**

```css
--text-xs:   clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem);
--text-sm:   clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem);
--text-base: clamp(1rem, 0.96rem + 0.2vw, 1.0625rem);
--text-lg:   clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem);
--text-xl:   clamp(1.5rem, 1.3rem + 1vw, 2rem);
--text-2xl:  clamp(2rem, 1.6rem + 2vw, 3rem);
--text-3xl:  clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
--text-hero: clamp(3rem, 2rem + 7vw, 7.5rem);
```

**Reglas tipográficas**

- Títulos display: `letter-spacing: -0.03em`, `line-height: 0.95`.
- Cuerpo: `line-height: 1.65`, ancho de medida máximo `68ch`.
- Una sola `h1` por vista.
- El nombre "Marcelo Olivera" en el hero usa `--text-hero` y es el elemento más grande del sitio.

### 3.3 Espaciado, radios y elevación

```css
/* Espaciado — escala de 4 */
--space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
--space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;
--space-32: 8rem;    /* separación entre secciones en desktop */

/* Radios */
--radius-sm: 6px;  --radius-md: 12px;  --radius-lg: 20px;  --radius-full: 999px;

/* Elevación (sutil — en dark se apoya más en el borde que en la sombra) */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.24);
--shadow-md: 0 8px 24px rgba(0,0,0,0.28);
--shadow-lg: 0 24px 64px rgba(0,0,0,0.36);
--shadow-accent: 0 12px 40px rgba(255,121,72,0.22);  /* solo botón primario en hover */

/* Contenedor */
--container-max: 1200px;
--gutter: clamp(1.25rem, 4vw, 3rem);
```

### 3.4 Textura

- **Grano:** overlay de ruido al 3 % de opacidad sobre el fondo base. Evita que el negro se
  vea plano. Debe ser una capa CSS/SVG, nunca una imagen pesada.
- **Halo del hero:** gradiente radial de `--color-accent-soft` detrás del retrato,
  con desenfoque amplio. Es el único gradiente del sitio.

---

## 4. Sistema de movimiento

> El movimiento es el argumento central del rediseño. Esta sección es normativa, no sugerente.

### 4.1 Tokens de movimiento

```css
--dur-instant: 100ms;   /* feedback de press */
--dur-fast:    180ms;   /* hover, cambios de color */
--dur-base:    320ms;   /* transiciones de UI */
--dur-slow:    600ms;   /* revelados al scroll */
--dur-hero:    900ms;   /* entrada del hero */

--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);    /* salida — el default */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* transiciones de ruta */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* micro-interacciones con rebote */

--stagger: 70ms;  /* retardo entre hermanos en una secuencia */
```

### 4.2 Presupuesto de movimiento

- **Un gesto protagónico por sección.** El resto es acompañamiento.
- Ninguna animación de entrada supera los **900 ms**.
- Nada bloquea la lectura: el contenido es legible aunque la animación no termine.
- Solo se anima `transform` y `opacity` (NFR-02).

### 4.3 Catálogo de animaciones

**A1 — Entrada del hero** *(protagónica, al cargar)*
Las líneas del título se revelan por máscara desde abajo (`translateY(100%) → 0` dentro de
un contenedor con `overflow: hidden`), escalonadas cada 70 ms. El retrato aparece con fade
y una escala de `1.04 → 1`. El halo cálido crece en opacidad detrás. Duración total: 900 ms.

**A2 — Scroll reveal** *(en cada sección)*
Al entrar en viewport (umbral 15 %): `opacity 0 → 1` y `translateY(24px) → 0` en
`--dur-slow` con `--ease-out`. Los hijos de una grilla se escalonan con `--stagger`.
Se dispara una sola vez por elemento (`IntersectionObserver` con `unobserve`).

**A3 — Indicador de navegación**
Una barra en acento se desliza entre los ítems del nav siguiendo la ruta activa, animando
su posición y ancho en `--dur-base` con `--ease-out`. En hover se adelanta al ítem
apuntado y vuelve al activo al salir.

**A4 — Nav en scroll**
Al superar los 80 px de scroll, la barra pasa de transparente a superficie con
`backdrop-filter: blur(12px)` y reduce su altura. Transición en `--dur-base`.

**A5 — Card de proyecto en hover**
`translateY(-6px)`, sombra de `--shadow-md` a `--shadow-lg`, imagen interna a `scale(1.06)`
y aparición de las acciones. Todo en `--dur-fast` con `--ease-out`.

**A6 — Transición entre rutas**
Salida: `opacity → 0` + `translateY(-12px)` en 200 ms.
Entrada: `opacity 0 → 1` + `translateY(16px) → 0` en `--dur-base` con `--ease-in-out`.
Cuando la View Transition API esté disponible, la imagen de la card y la del detalle
comparten `view-transition-name` para una transición continua (FR-14); si no lo está,
degrada al fade descrito arriba.

**A7 — Micro-interacciones**
- Botones: `scale(0.97)` al presionar en `--dur-instant`.
- Chips de stack: elevación de 2 px y borde en acento al hover.
- Íconos de skill: rotación de 6° y `scale(1.08)` con `--ease-spring`.
- Toggle de tema: el ícono rota 180° mientras los colores cruzan en `--dur-base`.
- Enlaces de texto: subrayado que crece desde la izquierda (`scaleX 0 → 1`).

**A8 — Línea de tiempo de la trayectoria**
La línea vertical se dibuja progresivamente según el avance del scroll (`scaleY`), y cada
hito aparece con A2 al alcanzarlo.

**A9 — Contador del stack** *(opcional, discreto)*
Los números de la sección de habilidades cuentan desde 0 al entrar en viewport. Solo si no
compromete el presupuesto de movimiento.

### 4.4 Movimiento reducido — obligatorio

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Con movimiento reducido, todo elemento animado debe quedar en su **estado final visible**.
Ningún contenido puede depender de que una animación termine para ser legible (NFR-07).

---

## 5. Estrategia de componentes

**Regla madre (NFR-17):** un componente canónico por elemento. Las variantes se resuelven
con props o atributos `data-*`, jamás clonando el componente por página.

| Componente | Variantes | Notas |
|---|---|---|
| `AppNav` | `transparent` / `solid` | Indicador animado (A3), colapsa a overlay en mobile |
| `AppButton` | `primary` / `secondary` / `ghost` | Único botón del sitio; el actual `ButtonCustom` se refactoriza aquí |
| `HeroSection` | — | Solo en Home; entrada A1 |
| `ProjectCard` | `featured` / `compact` | Misma clase y markup en Home y en Proyectos |
| `ProjectDetail` | — | Vista nueva `/projects/:slug` |
| `StackChip` | `sm` / `md` | Tipografía mono |
| `SectionHeading` | — | Reemplaza `SectionTitle` / `MainTitle` / `SubTitle` (hoy son tres componentes casi idénticos) |
| `SkillGrid` | por categoría | Entrada escalonada A2 |
| `Timeline` / `TimelineItem` | `education` / `work` / `personal` | Animación A8 |
| `ContactSection` | — | WhatsApp, email, LinkedIn |
| `ThemeToggle` | — | Persistente, respeta el sistema |
| `LangToggle` | — | ES/EN, persistente |
| `Lightbox` | — | Certificado ampliable, cierre con `Escape` |
| `ScrollCue` | — | Indicador del hero, desaparece al primer scroll |
| `AppFooter` | — | Redes + créditos |

**Consolidación respecto del código actual:** `MainTitle`, `SubTitle`, `SectionTitle` y
`ProjectTitle` se unifican en `SectionHeading` con un prop de nivel. Hoy son cuatro
componentes que hacen lo mismo con estilos distintos, y son la causa principal de la
jerarquía plana (P3).

---

## 6. Pantallas y recorridos

### P1 — Home *(pantalla tesis)*

```
┌─ Nav transparente ──────────────────────────────┐
│                                                 │
│  HERO (100svh)                                  │
│   "Hola, soy"                                   │
│   MARCELO OLIVERA          [retrato + halo]     │
│   Frontend Developer                            │
│   línea de propuesta de valor                   │
│   [Ver proyectos] [Descargar CV]                │
│   chips: Vue · Flutter · TypeScript · Node      │
│                            ↓ scroll cue         │
├─────────────────────────────────────────────────┤
│  PROYECTOS DESTACADOS (máx. 3)                  │
│   grilla responsive de ProjectCard              │
│   [Ver todos los proyectos →]                   │
├─────────────────────────────────────────────────┤
│  STACK — Frontend / Backend / Herramientas      │
├─────────────────────────────────────────────────┤
│  TRAYECTORIA (resumen, 3 hitos)                 │
│   [Conocer más sobre mí →]                      │
├─────────────────────────────────────────────────┤
│  CONTACTO — WhatsApp · Email · LinkedIn         │
└─ Footer ────────────────────────────────────────┘
```

Animaciones: A1 en el hero, A2 en cada sección, A4 en el nav, A5 en las cards.
Acción primaria única: **Ver proyectos**.

### P2 — Proyectos

Encabezado con `SectionHeading` + descripción, y grilla de `ProjectCard` (1 columna en
mobile, 2 desde 768 px). Sin anchos calculados por índice (FR-11).
Cada card enlaza a `/projects/:slug`.
Animaciones: A2 escalonada en la grilla, A5 en hover, A6 al abrir el detalle.

### P3 — Detalle de proyecto *(nueva)*

Imagen grande arriba (elemento compartido con la card), título, chips del stack, y bloques:
**el problema** · **la solución** · **mi rol**. Acciones: *Ver en vivo* y *Ver código*.
Al pie, navegación al proyecto siguiente.
Animaciones: A6 de entrada, A2 en los bloques de texto.

### P4 — Sobre mí

Encabezado, retrato secundario, y la trayectoria como `Timeline` con los hitos reales:

- **EXO S.A. — Frontend Developer** *(actual)*: Flutter, Riverpod y Dart para web, mobile y
  escritorio Windows; Vue.js para dashboards de visualización de datos.
- **IFTS N.º 11 — Desarrollo de Software** *(en curso, 1.º año)*: algoritmos, estructuras de
  datos, POO.
- **Digital House — Full Stack Developer** *(egresado)*: HTML, CSS, JavaScript, Node.js,
  Express, React, bases relacionales y no relacionales. Certificado ampliable en `Lightbox`.
- **Autodidacta**: cursos, documentación oficial y proyectos prácticos.
- **Fuera del código**: guitarra y canto.

Animaciones: A8 en la línea de tiempo, A2 en cada hito.

---

## 7. Patrones de interacción

| Patrón | Comportamiento |
|---|---|
| **Navegación mobile** | Botón hamburguesa → overlay a pantalla completa, ítems con entrada escalonada, cierre por `Escape`, tap fuera o selección |
| **Estado activo de ruta** | Indicador deslizante (A3) + `aria-current="page"` |
| **Carga de imágenes** | Placeholder con el color dominante → fade al cargar; `width`/`height` declarados para evitar CLS |
| **Enlaces externos** | `target="_blank"` + `rel="noopener noreferrer"` + ícono de enlace externo |
| **Descarga del CV** | Feedback inmediato en el botón; el archivo es `Marcelo Olivera - Curriculum Vitae.pdf` |
| **Cambio de idioma** | Cross-fade breve del texto, se conserva la posición de scroll, se actualiza `lang` del documento |
| **Cambio de tema** | Transición de color en `--dur-base`; sin flash al recargar (el tema se resuelve antes del primer paint) |
| **Foco** | `:focus-visible` con anillo de 2 px en `--color-focus` y `outline-offset: 3px` |
| **Skip link** | Primer elemento tabulable: "Saltar al contenido" |

---

## 8. Responsive

| Breakpoint | Ancho | Comportamiento |
|---|---|---|
| Base | 390 px | 1 columna, nav colapsado, hero apilado (texto → retrato), `--text-hero` en su mínimo |
| `sm` | 640 px | Chips en línea, más aire vertical |
| `md` | 768 px | Grilla de proyectos a 2 columnas, nav desplegado |
| `lg` | 1024 px | Hero en 2 columnas (texto izquierda, retrato derecha) |
| `xl` | 1280 px | Contenedor tope de 1200 px, `--space-32` entre secciones |
| `2xl` | 1920 px | Sin cambios de layout; solo escala tipográfica |

**Reglas**

- Mobile-first estricto: el desktop se construye agregando, nunca reordenando por completo.
- Alturas de viewport con `svh`/`dvh`, jamás `vh` (NFR-14).
- Objetivos táctiles mínimos de 44×44 px (NFR-11).
- La grilla usa `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`.

---

## 9. Accesibilidad — lista de verificación

- [ ] Contraste AA verificado en **ambos** temas, para todo par texto/fondo
- [ ] `prefers-reduced-motion` respetado en el 100 % de las animaciones
- [ ] Navegación completa por teclado, con orden de tabulación lógico
- [ ] `:focus-visible` visible sobre cualquier fondo
- [ ] Landmarks semánticos: `header`, `nav`, `main`, `footer`
- [ ] Una sola `h1` por vista, jerarquía de encabezados sin saltos
- [ ] `alt` descriptivo en imágenes informativas, `alt=""` en decorativas
- [ ] Overlay de menú y `Lightbox` con foco atrapado y retorno al disparador al cerrar
- [ ] `aria-current="page"` en el ítem de nav activo
- [ ] `aria-label` en los botones que solo tienen ícono (tema, idioma, menú)
- [ ] Skip link funcional
- [ ] El sitio es usable con JavaScript lento: el contenido del hero no depende de JS para renderizar

---

## 10. Entregables para la generación de UI

Pantallas a generar con Open Design, en este orden:

| ID | Pantalla | Prompt | Prioridad |
|----|----------|--------|-----------|
| P1 | Home | `ui-prompts/home.md` | Pantalla tesis — se genera y valida primero |
| P2 | Proyectos | `ui-prompts/proyectos.md` | Alta |
| P3 | Detalle de proyecto | `ui-prompts/proyecto-detalle.md` | Media |
| P4 | Sobre mí | `ui-prompts/sobre-mi.md` | Media |

Cada prompt debe incluir, sin excepción: los tokens de la sección 3 **exactos**, la
dirección visual D1, el catálogo de animaciones aplicable a esa pantalla (sección 4.3), los
componentes de la sección 5 y el **contenido real** del PRD.

---

## 11. Documentos relacionados

- `prd.md` — requisitos del producto
- `ui-prompts/` — prompts de generación
- `ui-handoff.md` — entrega de pantallas generadas
