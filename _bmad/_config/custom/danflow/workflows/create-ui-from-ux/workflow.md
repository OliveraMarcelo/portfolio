---
name: create-ui-from-ux
description: 'Genera UI de calidad de producción desde la especificación UX usando Open Design (open-design.ai) vía CLI. Elige design-system + skill del catálogo, redacta el prompt desde la UX spec, lanza el pipeline de forma eficiente en tokens, y al final muestra el diseño para revisar.'
---

# Workflow: Generar UI con Open Design (desde la UX Spec)

**Meta:** Convertir la especificación UX del proyecto en pantallas HTML/CSS/JS de calidad de producción — con animaciones y transiciones — usando el motor de Open Design (open-design.ai). El resultado es open design: archivos estándar sin lock-in, que se pueden inspeccionar, modificar y construir.

**Principio central de eficiencia:** Open Design lanza **su propio agente** (claude BYOK) para hacer el diseño. Nuestro rol es: leer la UX spec, elegir el design-system + skill correcto, redactar un prompt preciso, lanzar el run **por CLI** (para que el polling de 5–30 min corra en un solo proceso bash, no en el contexto de la conversación), y al final revisar el resultado.

---

## HERRAMIENTA: el helper `od.sh`

Todo se orquesta con el script:

```
{project-root}/_bmad/danflow/workflows/create-ui-from-ux/scripts/od.sh
```

Subcomandos:

| Comando | Qué hace |
|---|---|
| `od.sh doctor` | Verifica que el daemon está vivo, descubre el puerto, lista agentes instalados |
| `od.sh systems [filtro]` | Lista los design-systems disponibles (opcional: filtro por nombre) |
| `od.sh skills [filtro]` | Lista los skills disponibles (opcional: filtro) |
| `od.sh agents` | Lista los agentes instalados que pueden correr el run |
| `od.sh new <projId> <nombre> [designSystem] [skill]` | Crea un proyecto |
| `od.sh run <projId> <promptFile> [skill] [agent] [model]` | Lanza el run, **espera dentro del script**, y reporta la previewUrl |
| `od.sh pull <projId> <destDir>` | Copia los archivos generados al proyecto |
| `od.sh preview <projId>` | Imprime la previewUrl del navegador |

**REGLA DE ORO:** el polling sucede DENTRO de `od.sh run`. Nunca hagas un loop de `get_run` turno-a-turno en la conversación — eso quema tokens sin agregar valor.

**LÍMITE DE CONCURRENCIA: 2 runs en paralelo.** Medido en campo: con **3** simultáneos, los
tres marcaron `status: failed` (~585s) — aunque los tres habían dejado los archivos
completos. Con 1 solo run el resultado también marcó `failed` pero completo, así que el
status no es confiable en ningún caso; lo que sí escala con la concurrencia es la
probabilidad de que el daemon se caiga al cerrar. Con 2 el pipeline se comporta.

Aun cuando un run marca "failed", casi siempre dejó los archivos completos — verificalos
antes de regenerar (ver 4.2b).

---

## PREREQUISITOS

1. **Open Design corriendo.** Verificar con `od.sh doctor`. Si el daemon no responde, arrancarlo:
   ```
   cd ~/repositorios/open-design && CI=true corepack pnpm exec tools-dev start web
   ```
   (si el checkout vive en otro lado, exportar `OD_ROOT=/ruta/a/open-design`)
2. **UX spec completa:** `{planning_artifacts}/ux-design-specification.md`
3. **Un agente instalado** (claude está confirmado). Verificar con `od.sh doctor`.

---

## CONFIGURACIÓN

Cargar `{project-root}/_bmad/danflow/config.yaml`:

- `{project_name}`, `{planning_artifacts}`, `{user_name}`, `{communication_language}`

Definir la ruta del script:

```
OD={project-root}/_bmad/danflow/workflows/create-ui-from-ux/scripts/od.sh
```

Definir el prefijo de proyectos en Open Design (evita colisiones entre proyectos distintos
que comparten el mismo daemon):

```
SLUG=<slug corto de {project_name}>   # ej: "portfolio", "hotel"
```

---

## FASE 1 — VERIFICAR Y EXTRAER LA UX SPEC

### 1.1 Doctor

Correr `bash "$OD" doctor`. Confirmar daemon vivo y que `claude` (u otro) está en la lista de agentes.

### 1.2 Extraer las variables de diseño de la UX spec

Leer `{planning_artifacts}/ux-design-specification.md` y extraer:

- **Paleta** (tokens CSS: `--color-primary`, `--color-accent`, `--color-bg`...)
- **Tipografías** (display + body)
- **Dirección visual elegida** (la que el usuario aprobó, con su nombre y sus rasgos)
- **Componentes** por pantalla
- **Principios de experiencia** (mobile-first, accesibilidad, CTAs, etc.)
- **Contenido real** del PRD (nombres, textos, datos — nada inventado)

---

## FASE 2 — ELEGIR DESIGN-SYSTEM Y SKILL

### 2.1 Explorar el catálogo

```
bash "$OD" systems       # ver design-systems disponibles
bash "$OD" skills        # ver skills disponibles
```

### 2.2 Skills candidatos

**Skill principal (elegir 1 como recipe):**

| Skill | Cuándo |
|---|---|
| `frontend-skill` | Landing pages / websites visualmente fuertes — buen default |
| `high-end-visual-design` | "Diseñar como agencia high-end" — máxima calidad visual |
| `design-taste-frontend` | Anti-slop, landing pages con carácter |
| `gpt-taste` | Elite UX/UI + motion GSAP avanzado — si querés animaciones protagonistas |
| `redesign-existing-projects` | Si ya hay un sitio y se quiere elevar a premium |

**Skills de animación (complementarios, mencionar en el prompt):**

- `gsap-scrolltrigger`, `gsap-timeline` — animaciones on-scroll y secuencias
- `emilkowalski-motion` — micro-interacciones refinadas
- `frame-liquid-bg-hero` — hero con fondo fluido WebGL

> Los IDs de arriba son los que existían al portar el workflow. **Siempre validar contra
> `od.sh skills`** antes de usarlos: si un ID no está en el catálogo instalado, elegir el
> más cercano de la lista real.

### 2.3 Design-system: prefabricado vs. identidad propia

- Si el proyecto **ya tiene identidad propia** definida en la UX spec (tokens + dirección visual),
  crear el proyecto **SIN** `designSystemId` y pasar los tokens exactos dentro del prompt.
  Así Open Design respeta la identidad y no la pisa.
- Si el proyecto **no tiene identidad** todavía, elegir un design-system del catálogo que
  coincida con la dirección visual y pasarlo en `od.sh new`.

### 2.4 Confirmar con {user_name}

Presentar la elección de skill + skills de animación y pedir confirmación antes de gastar el run (cada run consume tiempo/tokens BYOK del usuario). Ofrecer:

```
[A] Aprobar y generar
[B] Cambiar el skill
[C] Ajustar qué pantallas generar
```

> **Modo autónomo:** si {user_name} pidió explícitamente correr sin interrupciones, elegir la
> opción más alineada con la UX spec, dejar registrada la decisión en el handoff y seguir.

---

## FASE 3 — REDACTAR EL PROMPT DE GENERACIÓN

Para cada pantalla, escribir un archivo de prompt en:

```
{planning_artifacts}/ui-prompts/{pantalla}.md
```

### 3.1 Plantilla de prompt (crítica para la calidad del resultado)

El prompt debe ser autónomo y preciso — el agente interno de Open Design no ve la UX spec,
solo ve este archivo. Estructura:

```markdown
# [Nombre de la pantalla] — [Nombre del proyecto]

## Contexto
[Qué es el producto, para quién, en una o dos frases.]
Pantalla: [nombre y rol de la pantalla en el flujo].

## Dirección visual — [Nombre de la dirección elegida]
- [Rasgo 1: hero, layout, densidad]
- [Rasgo 2: tratamiento tipográfico]
- [Rasgo 3: comportamiento del nav]
- [Adjetivos guía y — explícitamente — lo que NO debe ser]

## Design tokens (usar EXACTAMENTE estos)
--color-primary: ...;
--color-accent:  ...;
--color-bg:      ...;
--font-display:  ...;
--font-body:     ...;

## Componentes de esta pantalla
[lista específica y ordenada de arriba a abajo]

## Animaciones y transiciones
- [entrada del hero, scroll-reveal, hovers, transición del nav]
- Respetar prefers-reduced-motion

## Contenido real
[textos reales del PRD]
[NADA de Lorem Ipsum]

## Requisitos técnicos
- Mobile-first (base 390px), responsive a desktop
- Light y dark theme via tokens CSS
- Accesibilidad WCAG 2.1 AA: contraste, focus-visible, ARIA
- HTML/CSS/JS estándar, todo inline o en archivos hermanos

## Contrato técnico de salida (OBLIGATORIO — copiar textual en cada prompt)
[pegar acá la sección 3.1b completa]
```

### 3.1b Contrato técnico de salida — pegar SIEMPRE en cada prompt

Sin esta sección, cada pantalla sale con su propia convención y el conjunto deja de ser un
sistema: los entry files cambian de nombre, las clases de animación no coinciden y el tema
no se puede forzar para revisar. Todo esto pasó de verdad. Pegar textual:

```markdown
## Contrato técnico de salida (obligatorio)

**Archivos** — exactamente estos tres nombres, siempre, sin importar el nombre de la pantalla:
- `index.html` (el entry file SIEMPRE se llama así)
- `styles.css` (todo el CSS acá, no inline en el HTML)
- `main.js` (todo el JS acá)

**Contrato de tema** — los tres casos deben funcionar:
- `:root` sin atributo → tema por defecto de la dirección visual
- `<html data-theme="dark">` → fuerza oscuro (declarar la regla aunque oscuro sea el default)
- `<html data-theme="light">` → fuerza claro
El JS resuelve el tema inicial ANTES del primer paint (script inline en el `<head>`),
respeta `prefers-color-scheme` cuando no hay preferencia guardada, y persiste la elección
manual en `localStorage`.

**Contrato de animación** — nombres de clase canónicos, sin variantes:
- Elemento que entra al scroll: clase `reveal`, y el observer le agrega `is-visible`
- Elemento que entra por máscara: contenedor `mask` (con `overflow:hidden`) + hijo `mask-in`
- Ninguna clase utilitaria de animación (`mask-in`, `reveal`, etc.) debe declarar `display`:
  pisa por cascada el layout del elemento que envuelve (a un `ul.chips` lo saca de `flex`).
  Si necesitás `display: block` para que el transform funcione, aplicalo con un selector
  que no colisione (`span.mask-in`, `h1.mask-in`).

**Verificabilidad** — el diseño debe poder inspeccionarse sin correr las animaciones:
agregar en `styles.css` una regla que, con `<html data-qa="show-all">`, deje todo elemento
animado en su estado final visible (`opacity:1; transform:none`). Es el mismo estado que
produce `prefers-reduced-motion`, expuesto para QA.

**Artefactos de tu propia verificación** — si sacás capturas para revisar tu trabajo,
guardalas en un subdirectorio `.qa/`. No las dejes en la raíz del proyecto: la raíz es el
entregable y se copia tal cual al repo del proyecto.

**Consistencia entre pantallas** — el nav y el footer son los mismos componentes en todas
las pantallas: mismo markup, mismas clases, misma altura, logo en la misma posición. Lo
único que cambia es cuál ítem está activo.

**Contrato de navegación** — el prototipo tiene que ser **clickeable de punta a punta**.
Cada pantalla vive en su propio directorio hermano, así que los enlaces entre pantallas son
**relativos con `../`**, nunca rutas absolutas ni nombres inventados:

| Destino | href exacto |
|---|---|
| Cada pantalla del inventario | `../{directorio-de-la-pantalla}/index.html` |
| La pantalla actual (logo, ítem activo) | `index.html` |
| Assets del sitio (CV, PDFs) | `../../{archivo}` |

- **Prohibido** `href="/"`, `href="/proyectos"` y similares: no resuelven al abrir el
  prototipo desde el filesystem ni servido desde un subdirectorio.
- **Prohibido** inventar nombres de archivo (`projects.html`, `inicio.html`, `about.html`):
  el entry file siempre es `index.html` dentro del directorio de su pantalla.
- Si una pantalla que querés enlazar no está en el inventario, enlazá a la más cercana que
  sí exista. **Nunca** dejes un enlace a un archivo que no se generó.
- Las **cards de proyecto llevan al detalle** cuando ese detalle está en el inventario: el
  título de la card es el enlace.
- Para que la transición entre pantallas no se saltee, **toda** hoja de estilo declara
  `@view-transition { navigation: auto; }`. Si solo la declara una de las dos pantallas
  involucradas, el navegador descarta la transición.

**Contrato de apilamiento del menú mobile** — el menú tiene que ser **usable**, no solo
verse. Declarar `z-index` **explícito** en las tres capas, nunca dejarlas en `auto`:

```css
.scrim  { z-index: 90; }   /* el velo que oscurece la pagina */
.header { z-index: 100; }
.panel  { z-index: 105; }  /* el panel del menu va SOBRE el scrim */
```

Con las tres en `z-index: auto` gana la que aparece después en el DOM. Si el scrim está
después del panel —lo habitual— se pinta encima y **se come todos los clicks**: el menú se
ve bien y no navega. Además el panel necesita **fondo opaco** (no translúcido sobre el
contenido) y el `<body>` debe quedar en `overflow: hidden` mientras está abierto.

El menú debe cerrarse de las tres formas: botón, tecla `Escape` y clic en el scrim.
```

### 3.1c Design-system-first: la pantalla tesis define el sistema

> ⚠ **Este es el principio central del agente y el más fácil de incumplir.** Generar N
> pantallas por separado y esperar que la consistencia *emerja* del prompt no funciona:
> cada run inventa su convención. Medido en un caso real de 4 pantallas: 3 nombres
> distintos para el panel del menú, 2 convenciones de botón, tokens redefinidos 4 veces y
> solo 131 líneas de CSS idénticas entre todas. Peor: cada bug del chasis hubo que
> arreglarlo **una vez por pantalla**.

El orden correcto no es "pantalla → pantalla → pantalla", es **sistema → pantallas**:

1. **Generar la pantalla tesis** (P1) con el contrato completo.
2. **Extraer de ella el sistema** a un directorio `_system/` hermano:
   `tokens.css`, `components.css`, `system.js`, `chasis.html`, `sprite.html`.
   (El workflow `unify-components` detalla qué va en cada uno.)
3. **En el prompt de cada pantalla siguiente**, pegar el bloque de abajo para que
   **consuma** el sistema en vez de reinventarlo.
4. Al terminar todas, correr `unify-components` como red de seguridad y **medir**.

Bloque a pegar en los prompts de P2 en adelante:

```markdown
## Consumir el design system (obligatorio)

Este sitio YA tiene un design system. **No lo redefinas: consumilo.**

Enlazá, en este orden exacto:
    <link rel="stylesheet" href="../_system/tokens.css">
    <link rel="stylesheet" href="../_system/components.css">
    <link rel="stylesheet" href="page.css">
    <script src="../_system/system.js"></script>
    <script src="page.js"></script>

Del sistema salen (NO los declares de nuevo en `page.css`):
- todos los tokens de color, tipografía, espaciado, radios, sombras y movimiento
- el chasis: `.site-header`, `.header-inner`, `.logo`, `.nav`, `.nav-list`, `.nav-link`,
  `.nav-indicator`, `.header-actions`, `.mobile-menu`, `.mobile-link`, `.nav-scrim`,
  `.site-footer`
- las primitivas: `.btn` + `.btn-primary` / `.btn-ghost`, `.chips` + `.chip`, `.ico`,
  `.container`, `.skip-link`
- las utilidades: `.reveal` → `.is-visible`, `.mask` + `.mask-in`, el hook
  `[data-qa="show-all"]`, el bloque de `prefers-reduced-motion` y `@view-transition`

El header y el footer se copian **textual** de `_system/chasis.html`, cambiando solo los
href y cuál ítem lleva `is-active` + `aria-current="page"`.

En `page.css` va **solo** lo propio de esta pantalla. En `page.js`, solo los textos de la
pantalla (`MC.registrarTextos({ es: {...}, en: {...} })`) y su comportamiento propio: el
tema, el idioma, el header en scroll, el indicador, el menú y el scroll reveal ya los
maneja `system.js`.
```

### 3.2 Inventario de pantallas

Construir la tabla desde la UX spec (una fila por pantalla, con su archivo de prompt):

| ID | Pantalla | Prompt file |
|----|----------|-------------|
| P1 | [pantalla tesis] | `ui-prompts/[slug].md` |
| P2 | ... | ... |

Empezar SIEMPRE por P1 — la pantalla tesis, la que fija el lenguaje visual. Validar el
resultado con el usuario antes de generar las demás (así se ajusta el prompt/skill si hace
falta sin desperdiciar runs).

---

## FASE 4 — GENERAR (una pantalla a la vez)

Para cada pantalla:

### 4.1 Crear el proyecto

```
bash "$OD" new {SLUG}-{pantalla} "{project_name} {Pantalla}"
```

(sin designSystemId si la identidad va en el prompt — ver 2.3)

### 4.2 Lanzar el run (bloquea hasta terminar, DENTRO del script)

```
bash "$OD" run {SLUG}-{pantalla} "{planning_artifacts}/ui-prompts/{pantalla}.md" frontend-skill claude
```

- El script hace polling cada 45s internamente y reporta el progreso
- Tarda 5–30 min. Mientras corre, avisar a {user_name}: "Open Design está generando la pantalla, tarda unos minutos".
- El script imprime la `previewUrl` al terminar.

> **Si el run devuelve una pregunta en vez de archivos** (el agente interno pidió aclaración), leer el `agentMessage`, ajustar el prompt, y volver a lanzar `od.sh run`.

> ⚠ **REGLA CRÍTICA — prompt nuevo = proyecto fresco.** Open Design reanuda la sesión anterior si re-corrés sobre el MISMO proyecto (`native_session_recovery: resumed`), y el prompt actualizado NO se entrega como instrucción nueva — el agente interno responde "no recibí instrucción nueva" y no toca los archivos. Para re-generar con un prompt cambiado, SIEMPRE usar un proyecto nuevo (`{SLUG}-{pantalla}-v2`, `-v3`...). Solo reutilizá el mismo proyecto si querés continuar la conversación con una instrucción de ajuste incremental (ej: "hacé el hero más oscuro"), NO para re-enviar un prompt completo reescrito.

### 4.2b Verificar el resultado ANTES de aceptarlo o descartarlo

> ⚠ **`status: failed` es un falso negativo frecuente.** En la práctica, los runs marcan
> `failed` al cerrar y sin embargo dejan los archivos **completos**. Jamás regenerar por el
> status: decidir por el archivo.

Chequeo de integridad (segundos, sin navegador):

```bash
P="$OD_ROOT/.od/projects/{proj}"
for f in "$P"/index.html "$P"/styles.css "$P"/main.js; do
  [ -f "$f" ] || { echo "FALTA $f"; continue; }
  python3 -c "
s=open('$f',encoding='utf-8',errors='replace').read()
print('$f', 'lineas=',s.count(chr(10)), 'llaves=',s.count('{'),'/',s.count('}'),
      'cierra_html=', ('</html>' in s) if '$f'.endswith('.html') else '-')
"
done
```

Se acepta el output si: los tres archivos existen, el HTML cierra `</html>`, y las llaves
del CSS/JS están **balanceadas**. Si algo no cierra, ahí sí el run se cortó de verdad.

**Si el daemon murió durante el run** (`od.sh` avisa que no lo encuentra), reiniciarlo y
seguir — los archivos ya están en disco y `pull` no necesita daemon:

```
cd $OD_ROOT && CI=true corepack pnpm exec tools-dev start web
```

### 4.3 Traer los archivos al proyecto

```
bash "$OD" pull {SLUG}-{pantalla} {project-root}/public/ui-generated/{pantalla}
```

(ajustar el destino a donde el proyecto sirva estáticos; si no aplica, usar
`{planning_artifacts}/ui-generated/{pantalla}`)

### 4.3b Verificación en navegador (MIDIENDO, no mirando)

El principio de consistencia demostrable aplica acá: se mide.

1. **Consola limpia.** Navegar a la previewUrl y leer los errores. Un 404 de
   `/favicon.ico` es del servidor de preview de Open Design, no del diseño — ignorarlo.
2. **Contrato de tema.** Verificar los tres casos:
   ```js
   // con data-theme="dark" y con data-theme="light"
   getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
   ```
   Debe devolver el token exacto de la UX spec en cada caso. Si al forzar `dark` no cambia
   nada, el CSS declaró solo `[data-theme="light"]` — es un incumplimiento del contrato.
3. **Estado revelado.** ⚠ Una captura `fullPage` **no dispara** el `IntersectionObserver`:
   todo lo que nunca estuvo en viewport sigue en `opacity: 0` y la captura muestra secciones
   vacías que en realidad funcionan. Dos formas de verificar de verdad:
   - Activar el hook de QA del contrato: `document.documentElement.dataset.qa = 'show-all'`
   - O scrollear de verdad y contar lo que quedó oculto:
     ```js
     window.scrollTo(0, document.body.scrollHeight);
     // tras ~1.5s
     [...document.querySelectorAll('main *')].filter(e => getComputedStyle(e).opacity === '0').length
     ```
     Debe dar 0.
4. **Layout sin colisiones de cascada.** Verificar que los contenedores flex sigan siendo
   flex: `getComputedStyle(document.querySelector('.chips')).display === 'flex'`.
5. **Contenido real.** Buscar en el HTML los textos clave del PRD y confirmar que están.
6. **Navegación clickeable de punta a punta.** El chequeo que más se olvida y el que rompe
   el prototipo entero. Servir el directorio del proyecto por HTTP y verificar que **todo**
   enlace interno responda 200:

   ```bash
   # desde la raíz de las pantallas generadas
   python3 -m http.server 8899 &
   ```

   ```js
   // en el navegador, para cada pantalla del inventario
   const html = await (await fetch(url)).text();
   const doc = new DOMParser().parseFromString(html, 'text/html');
   const internos = [...doc.querySelectorAll('a[href]')]
     .map(a => a.getAttribute('href'))
     .filter(h => h && !h.startsWith('#') && !h.startsWith('mailto:') && !/^https?:/.test(h));
   for (const h of new Set(internos)) {
     console.log(h, (await fetch(new URL(h, url), {method:'HEAD'})).status);  // todos 200
   }
   ```

   Señales de que el contrato de navegación se incumplió: algún href arranca con `/`, o
   apunta a un `*.html` que no existe. Además, recorrer el circuito con clicks reales
   y confirmar que `aria-current="page"` acompaña.

7. **El menú mobile RECIBE los clicks** (a 390 px, en **todas** las pantallas). Que el menú
   se vea abierto no significa que funcione: si el scrim quedó encima, los enlaces son
   inalcanzables. Verificar que el clic llega al enlace y no a otra cosa:

   ```js
   document.querySelector('.menu-btn').click();
   const panel = document.getElementById(document.querySelector('.menu-btn').getAttribute('aria-controls'));
   [...panel.querySelectorAll('a')].map(a => {
     const r = a.getBoundingClientRect();
     const e = document.elementFromPoint(r.x + r.width/2, r.y + r.height/2);
     return { texto: a.textContent.trim(), ok: e === a || a.contains(e), loTapa: e && e.className };
   });  // todos ok:true
   ```

   Probarlo **pantalla por pantalla**: el bug apareció solo en dos de las cuatro, y
   verificar únicamente la Home lo dejó pasar. Confirmar también que cierra con `Escape`.

8. **Verificar en el contexto donde el usuario mira.** El prototipo se sirve desde dos
   lugares con estructuras de URL distintas, y arreglar uno **no** arregla el otro:

   | Contexto | Estructura | href entre pantallas |
   |---|---|---|
   | Repo (`public/ui-generated/`) | directorios hermanos | `../{pantalla}/index.html` |
   | Preview del daemon | proyectos separados de OD | `../../{proyecto}/raw/index.html` |

   No existe un href que sirva en ambos. Si le pasaste al usuario las `previewUrl`, es ahí
   donde va a probar: corré el chequeo de enlaces (punto 6) **también** sobre esas URLs.
   Al arreglar los dos, las copias quedan divergentes en los `href` — dejarlo escrito en el
   handoff, porque un `od.sh pull` posterior pisa el repo con las rutas del daemon.

### 4.4 Mostrar el diseño final a {user_name}

- Imprimir la `previewUrl` como link clickeable
- Abrir el HTML generado y describir qué se logró (jerarquía, animaciones, momentos de delight)
- Ofrecer:
  ```
  [A] Ajustar esta pantalla (nuevo run con prompt refinado)
  [N] Siguiente pantalla del inventario
  [C] Aprobar y continuar
  ```

---

## FASE 4.5 — MODIFICACIONES E ITERACIÓN (aprendido en la práctica)

**Regla madre: NO crear un proyecto nuevo por cada cambio.** Elegí el camino según el tipo de modificación:

### Árbol de decisión

```
¿Qué tipo de cambio es?
│
├─ Fix quirúrgico (1 color, 1 línea CSS, un texto, un bug puntual)
│    → EDITAR el archivo a mano (Edit tool). NO re-generar.
│    → Es más rápido y barato que un run de 5 min.
│    → Sincronizar ambas copias (ver abajo).
│
├─ Ajuste incremental conversacional ("hacé el hero más oscuro",
│  "agregá testimonios", "cambiá el orden de las secciones")
│    → MISMO proyecto OD, `od.sh run` con instrucción CORTA de delta.
│    → La reanudación de sesión de OD SÍ funciona para esto.
│
└─ Prompt completo reescrito / pantalla nueva desde cero
     → Proyecto FRESCO ({SLUG}-{pantalla}-v2, -v3...).
     → Si re-enviás un prompt completo al MISMO proyecto, OD reanuda
       la sesión vieja y responde "no recibí instrucción nueva" SIN
       tocar archivos (run "succeeded" en ~45s pero sin cambios).
```

### Sincronizar ambas copias tras un fix a mano

Un archivo vive en DOS lugares. Al editar a mano, actualizar los dos:

1. Fuente en OD: `$OD_ROOT/.od/projects/{proj}/index.html`
2. Copia en el proyecto: el destino que usaste en `od.sh pull`

Lo más simple: editar en la fuente OD y re-`pull`:

```
# editar $OD_ROOT/.od/projects/{proj}/index.html con Edit
bash "$OD" pull {proj} <destino>
```

### Bugs conocidos a revisar en el output generado

- **Hero sin foto de fondo:** verificar el orden de capas en `background-image`. La PRIMERA capa va ARRIBA — la foto debe ir primera, el gradiente de fallback después. Un fallback opaco como primera capa tapa la foto entera.
- **URL equivocada al revisar:** si generaste en `-v2`, la preview es `.../projects/{SLUG}-{pantalla}-v2/raw/index.html`. No mires el proyecto viejo.
- **Imágenes que no cargan:** confirmá que las URLs remotas respondan HTTP 200 (`curl`).

### Limpieza de proyectos huérfanos

Tras consolidar una versión buena, borrar los proyectos viejos:

```
curl -s -X DELETE "$DAEMON/api/projects/{proj-viejo}" \
  -H "Content-Type: application/json" -d '{"confirm":true}'
```

---

## FASE 5 — REVISIÓN FINAL Y HANDOFF

### 5.1 Ver todos los diseños

Cuando todas las pantallas estén generadas y aprobadas, listar todas las previewUrl para revisión conjunta.

### 5.2 Documento de handoff

Guardar en `{planning_artifacts}/ui-handoff.md`:

```markdown
# UI Design Handoff — {project_name}
**Fecha:** {fecha}
**Agente:** Luna — UI Designer (danflow)
**Motor:** Open Design (open-design.ai)
**Dirección visual:** [nombre]
**Skill usado:** [skill] | Skills de animación: [lista]

## Pantallas generadas
| Pantalla | previewUrl | Archivos en |
|----------|-----------|-------------|
| ... | | |

## Tokens aplicados
[lista de tokens CSS]

## Animaciones implementadas
[por pantalla]

## Notas de implementación para el desarrollador
[cómo integrar los archivos generados en la arquitectura del proyecto]

## Próximos pasos
[qué iterar, qué falta]
```

---

## LECCIONES DE CAMPO

Registro de lo que se aprendió corriendo este workflow de verdad. Cada línea costó un run
o un rato de debugging: leerla antes de generar sale más barato que re-aprenderla.

| Lección | Qué hacer |
|---|---|
| El `status` del run no es confiable — `failed` suele traer archivos completos | Decidir por el archivo (4.2b), nunca por el status |
| El daemon puede morir al cerrar el run | Reiniciarlo y seguir; `pull` funciona sin daemon |
| El daemon toma un **puerto efímero nuevo** en cada arranque | Nunca cachear la previewUrl; regenerarla con `od.sh preview` |
| Sin contrato de nombres, cada pantalla nombra su entry distinto (`proyectos.html`, `sobre-mi.html`…) | Exigir `index.html` en el contrato (3.1b) |
| Sin contrato, unas pantallas salen autocontenidas y otras con CSS/JS separado | Exigir los tres archivos fijos |
| Las clases de animación divergen entre runs (`is-visible`, `is-revealed`, `is-in`) | Fijarlas en el contrato: `.reveal` → `.is-visible` |
| Un `[data-theme="dark"]` sin regla CSS propia hace que forzar oscuro no haga nada | Exigir que los tres casos de tema funcionen |
| Una clase utilitaria con `display` pisa por cascada el layout que envuelve | Prohibirlo en el contrato; verificar con `getComputedStyle` |
| `fullPage` screenshot no dispara el `IntersectionObserver` | Usar el hook `data-qa="show-all"` o scrollear de verdad |
| El agente interno se auto-verifica y deja `check-*.png` y `.playwright-mcp/` | Ya los excluye `od.sh pull` |
| El agente interno puede **corregir** la paleta por accesibilidad (y tener razón) | Leer los comentarios que deja en el CSS; documentar la desviación en el handoff |
| El agente interno deja capturas de su propia verificación en la raíz (`qa-*.png`, `*-1280.png`) | Pedirle `.qa/` en el contrato; `od.sh pull` ya filtra esos patrones |
| **Editar `od.sh` con runs en vuelo rompe el run**: bash relee el script en disco y falla con error de sintaxis en una línea sana (exit 2) | No tocar el script mientras haya runs corriendo; esperar a que cierren |
| Con **2** runs en paralelo aparecieron los primeros `succeeded` reales | Confirmado: 2 es el número, no 3 |
| Un run que muere a los **~45s sin dejar archivos** es un fallo REAL (distinto del falso negativo, que muere a los 500–900s con todo completo) | Discriminar por tiempo + archivos: si murió temprano y vacío, relanzar en un proyecto nuevo (`-v3`) |
| `od.sh pull` es **aditivo**: no borra el destino, así que deja archivos de la versión anterior | Al regenerar, `rm -rf` el destino antes del `pull` |
| El agente puede referenciar imágenes reales del repo que no existen en el proyecto OD (404 en la preview) | Copiar las imágenes al proyecto OD y re-`pull`; queda mejor que el placeholder |
| **Sin contrato de navegación, el prototipo no se puede recorrer**: cada pantalla inventa su esquema de URLs (`projects.html`, `inicio.html`, `/proyectos`) y ningún enlace resuelve | Fijar los href en el contrato (§3.1b) y verificar los enlaces internos midiendo (§4.3b punto 6) |
| Las cards no enlazaban al detalle: el prototipo quedaba sin el recorrido que pide el PRD | Exigirlo en el contrato: el título de la card es el enlace |
| Una transición entre documentos se saltea si **solo una** de las dos pantallas declara `@view-transition` | Exigir la declaración en todas las hojas de estilo |
| Los enlaces relativos entre pantallas solo tienen sentido en el repo (en el proyecto OD cada pantalla está sola) | Aplicar el fix de navegación sobre la copia del repo, no sobre la fuente OD |
| **El menú mobile se ve abierto pero no navega**: scrim y panel ambos en `z-index:auto`, y el scrim va después en el DOM → se pinta encima e intercepta los clicks | Exigir `z-index` explícito en las tres capas (§3.1b) y medir con `elementFromPoint` (§4.3b punto 7) |
| Verificar el menú solo en una pantalla no alcanza: el bug estaba en 2 de 4 | Correr el chequeo del menú en **todas** las pantallas del inventario |
| Editar un CSS ya cargado y recargar la página **no** refresca el estilo (caché) | Verificar en un puerto nuevo, o leer el archivo del servidor con `fetch` y un query único |
| **El prototipo tiene DOS contextos de navegación** y arreglar uno no arregla el otro: en el repo las pantallas son directorios hermanos (`../sobre-mi/index.html`), en la preview del daemon son proyectos separados (`../../{proj}/raw/index.html`) | Arreglar los dos, cada uno con su ruta; y verificar en el contexto donde el usuario realmente mira |
| Tras arreglar ambos, las dos copias **divergen a propósito en los href**: un `pull` posterior pisa el repo con las rutas del daemon | Documentarlo en el handoff; si se rehace el `pull`, reaplicar el mapeo del repo |
| **Fijar convenciones de nombres NO alcanza para tener un design system.** Un contrato de archivos, clases de animación y tema da pantallas parecidas, no un sistema: los tokens y el chasis siguen escritos N veces distinto | Generar el sistema desde la pantalla tesis y hacer que las demás lo **consuman** (§3.1c); cerrar con `unify-components` |
| Los bugs del chasis se pagan N veces cuando no hay componente canónico (z-index del menú en 2 de 4, velo que come clicks, 4 esquemas de enlaces) | Un chasis compartido: el bug se arregla una vez |
| Verificar la consistencia "por inspección visual" es lo que el principio prohíbe | Medir: hash de la firma del chasis, posición del logo, alto del header, clase computada |

## REGLAS DE ESTE WORKFLOW

- **Eficiencia de tokens es prioridad #1**: el polling vive dentro de `od.sh run`. Jamás hacer polling turno-a-turno en la conversación.
- SIEMPRE leer la UX spec antes de redactar el primer prompt
- Los tokens de la UX spec son ley: van EXACTOS dentro del prompt de generación
- NUNCA adoptar un design-system prefabricado que pise una identidad ya definida
- Generar una pantalla a la vez; validar la pantalla tesis antes de generar el resto
- NUNCA cancelar un run en vuelo por impaciencia — status:running con archivos estáticos es el agente pensando
- Real content only — nada de Lorem Ipsum, el contenido sale del PRD
- Si Open Design no está disponible (daemon caído), avisar y ofrecer arrancarlo — NO caer en escribir el HTML a mano salvo que {user_name} lo pida explícitamente

---

## MENÚ DE CONTINUACIÓN

**[N]** Next — siguiente pantalla del inventario
**[A]** Ajustar la última pantalla (refinar prompt y re-generar)
**[V]** Ver todas las previewUrl generadas hasta ahora
**[C]** Continuar — todas aprobadas, generar handoff final
