# Story 5.4: Habilidades agrupadas por categoría

Status: done

## Story

As a reclutador técnico,
I want ver el stack organizado,
so that pueda comparar rápido contra lo que estoy buscando.

## Acceptance Criteria

**AC1 — Tres grupos con encabezado**

**Given** la sección de habilidades
**When** se renderiza desde `src/content/skills.js`
**Then** los ítems aparecen agrupados en Frontend, Backend y Herramientas, cada grupo con su encabezado (FR-21)

**AC2 — Entrada escalonada**

**Given** el grupo que entra en viewport
**When** se dispara el revelado
**Then** los ítems entran de forma escalonada con `v-reveal` (FR-22, A2)

**AC3 — Micro-interacción al hover**

**Given** el visitante que apunta un ítem
**When** hace hover
**Then** el ícono responde con rotación de 6° y `scale(1.08)` usando `--ease-spring` (A7)

**AC4 — Los componentes viejos desaparecen**

**Given** el componente `SkillGrid.vue`
**When** se crea
**Then** `SkillList.vue` e `ItemSkill.vue` quedan eliminados

**AC5 — Movimiento reducido**

**Given** un visitante con `prefers-reduced-motion: reduce`
**When** carga la sección
**Then** todos los ítems son visibles y el hover no produce movimiento

## Tasks / Subtasks

- [x] **Tarea 1 — Decidir los íconos** (AC: #3)
  - [x] La historia 5.1 dejó un campo `icon` en `skills.js` con el nombre previsto y la decisión pendiente
  - [x] Sumar al sprite de `AppSprite.vue` los símbolos de tecnología que falten, en el mismo estilo de trazo (ver §Los íconos de tecnología no están en el sprite)
  - [x] IDs con el prefijo `i-`, como el resto: `i-vue`, `i-docker`
  - [x] **No** uses los PNG de `src/assets/icons/`

- [x] **Tarea 2 — Construir `SkillGrid.vue`** (AC: #1)
  - [x] Prop `groups` (Object o Array): los grupos de `src/content/skills.js`
  - [x] Estructura: `.stack-groups` → un `.stack-group` por categoría → `.stack-group-title` + `.skill-list` → un `.skill` por ítem
  - [x] La etiqueta del grupo sale de los locales; el nombre de la tecnología, del módulo
  - [x] Estilos portados de `home/page.css` (líneas 442–496)

- [x] **Tarea 3 — Revelado escalonado** (AC: #2)
  - [x] `v-reveal` a nivel de grupo o de ítem, con retardo creciente
  - [x] Reutilizar el mismo mecanismo de custom property que las historias 3.3 y 4.7
  - [x] Con movimiento reducido, todos visibles de inmediato

- [x] **Tarea 4 — Micro-interacción** (AC: #3, #5)
  - [x] `.skill:hover .ico { transform: rotate(6deg) scale(1.08) }` con `--ease-spring`
  - [x] Solo `transform` y `color` (NFR-02)
  - [x] Con movimiento reducido, sin rotación ni escala

- [x] **Tarea 5 — Montar en las dos vistas** (AC: #1)
  - [x] `HomeView.vue`: sección de habilidades, tercera según FR-08
  - [x] `AboutView.vue`: la sección de habilidades que hoy está comentada
  - [x] **El mismo componente en las dos**, sin variantes duplicadas (ver §El mismo componente en Home y en Sobre mí)

- [x] **Tarea 6 — Eliminar los componentes viejos** (AC: #4)
  - [x] Borrar `src/components/skills/SkillList.vue` y `src/components/skills/ItemSkill.vue`
  - [x] Descomentar y reemplazar el `<!-- <SkillList/> -->` de `AboutView.vue`
  - [x] Borrar los PNG de tecnología que queden sin uso
  - [x] Verificar por `grep` que nada los referencia

- [x] **Tarea 7 — Verificar** (AC: todos)
  - [x] `npm run build` sin errores y `npm run lint` sin advertencias
  - [x] Los tres grupos con sus ítems reales, en las dos vistas
  - [x] Comparar la firma del DOM entre la Home y Sobre mí
  - [x] El revelado escalonado se ve
  - [x] El hover rota y escala el ícono
  - [x] Los íconos cambian de color al alternar el tema
  - [x] Con movimiento reducido: visibles, sin movimiento
  - [x] Verificar en 390 px y 1280 px, en los tres estados de tema

## Dev Notes

FR-21 y FR-22 juntos: agrupar por categoría y darle a cada ítem su entrada escalonada y su
micro-interacción. Es la tercera sección de la Home según el orden de FR-08 y también aparece en Sobre mí.

Notá que `AboutView.vue` tiene hoy `<!-- <SkillList/> -->` comentado: la sección de habilidades está
deshabilitada en el sitio actual. Esta historia la reactiva con el componente nuevo.

### Los íconos de tecnología no están en el sprite

Esta es la decisión que la historia 5.1 dejó preparada y que acá hay que cerrar.

El sprite de la historia 1.4 tiene once símbolos —luna, sol, menú, cerrar, flecha, externo, GitHub,
WhatsApp, mail, LinkedIn, código— y **ninguno es de una tecnología**. No hay ícono de Vue, ni de Docker,
ni de Node.

Lo que existe hoy son PNG en `src/assets/icons/`: `vue.png`, `react.png`, `flutter.png`, `js.png`,
`html-5.png`, `css-3.png`. Usarlos contradice dos decisiones:

- **D9:** los íconos son sprite SVG inline, para que hereden el color del tema por `currentColor`. Un PNG
  no cambia de color, así que en tema claro los logos de marca se van a ver mal o directamente ilegibles.
- **D14:** ya se eliminaron dos paquetes de íconos; volver a íconos rasterizados es ir para atrás.

**El camino es sumar los símbolos al sprite.** Once tecnologías del PRD: HTML, CSS, JavaScript, Vue, React,
Flutter, Node.js, Express, SQL/NoSQL, Git, Docker.

Dos consideraciones prácticas:

1. **Logos de marca vs. íconos de trazo.** Los logos oficiales son de relleno y multicolor; el sprite es
   monocromo de trazo con `stroke: currentColor`. Un logo de marca metido ahí se va a ver distinto del
   resto. La salida coherente es un ícono **abstracto y monocromo** por tecnología, en el estilo del
   sprite, no el logo oficial.
2. **Si eso es demasiado trabajo**, la alternativa aceptable es **sin íconos**: los grupos con tipografía
   y listas. Se pierde la micro-interacción de A7 en esta sección, que el catálogo describe como
   acompañamiento y no como gesto protagónico.

**Decidí explícitamente entre las dos y dejá el motivo en un comentario.** Lo que no es opción es usar los
PNG ni dejar `.skill .ico` apuntando a un símbolo que no existe: un `<use>` a un ID inexistente renderiza
un SVG vacío **sin ningún error en consola**, y la sección queda con huecos que nadie nota hasta que
alguien la mira de cerca.

### El mismo componente en Home y en Sobre mí

`SkillGrid` se monta en las dos vistas. **Es el mismo componente, con los mismos datos.** No hagas una
versión resumida para la Home y una completa para Sobre mí.

Si el diseño pide que en la Home se vean menos ítems, eso se resuelve en la vista filtrando lo que se le
pasa por props —igual que `ProjectGrid` en la historia 4.7— no clonando el componente.

Verificalo comparando la firma del DOM entre las dos vistas, como en la historia 4.7. Es la misma
disciplina de NFR-17 y la misma forma de comprobarla.

### El escalonado, tercera vez

Este es el tercer lugar donde aparece el mismo patrón: hero (3.3), destacados (4.7), habilidades (5.4).
Si en las dos anteriores quedó resuelto con una custom property y un `calc`, **reusá exactamente eso**.

Tres implementaciones distintas del mismo escalonado es cómo se acumula CSS que hace lo mismo de tres
formas — el problema que costó la unificación del prototipo.

### El separador es un borde, no un margen

`home/page.css` separa los ítems con `border-bottom` y lo quita en el último:

```css
.skill:last-child { border-bottom: 0; }
```

Portá esa regla. Es el detalle que evita el borde suelto al final de cada lista, y es el tipo de cosa que
se nota solo cuando falta.

### `--ease-spring` es para esto

`cubic-bezier(0.34, 1.56, 0.64, 1)` sobrepasa el valor final y vuelve: da el rebote. El catálogo lo asigna
a las micro-interacciones —íconos de skill, toggle de tema— y no a las transiciones de UI.

No lo uses para el revelado ni para el hover de la card: ahí va `--ease-out`. Cada curva tiene su lugar.

### Guardarraíles

- ❌ **No** uses los PNG de `src/assets/icons/`.
- ❌ **No** dejes un `<use>` apuntando a un símbolo que no existe.
- ❌ **No** metas logos de marca multicolor en el sprite monocromo.
- ❌ **No** hagas dos versiones de `SkillGrid`.
- ❌ **No** filtres dentro del componente: quien filtra es la vista.
- ❌ **No** inventes una tercera forma de escalonar.
- ❌ **No** agregues tecnologías que no estén en el PRD §7.5.
- ❌ **No** traduzcas los nombres de las tecnologías.
- ❌ **No** uses `--ease-spring` para el revelado.
- ❌ **No** implementes el contador A9: la UX spec lo marca como opcional y la arquitectura lo difiere.
- ❌ **No** toques la trayectoria ni el certificado: son las historias 5.2 y 5.3.

### Comandos de verificación

```bash
# Sin PNG de tecnología
grep -rn "vue.png\|react.png\|flutter.png\|js.png\|html-5.png\|css-3.png" src/

# Los componentes viejos desaparecieron
grep -rn "SkillList\|ItemSkill" src/

# Todos los <use> apuntan a símbolos existentes
grep -o 'i-[a-z0-9-]*' src/components/layout/AppSprite.vue | sort -u > /tmp/simbolos.txt
grep -rho "'#i-[a-z0-9-]*'\|\"#i-[a-z0-9-]*\"" src/ | tr -d "'\"#" | sort -u
# comparar las dos listas
```

En el navegador:

```js
// Tres grupos con los ítems del PRD
document.querySelectorAll('.stack-group').length          // 3
[...document.querySelectorAll('.stack-group')].map(g =>
  [g.querySelector('.stack-group-title').textContent, g.querySelectorAll('.skill').length])

// Ningún ícono vacío: todo <use> resuelve
[...document.querySelectorAll('.skill .ico use')]
  .filter(u => !document.querySelector(u.getAttribute('href')))
// tiene que quedar vacío

// Los íconos siguen el tema
const ico = document.querySelector('.skill .ico')
getComputedStyle(ico).stroke
document.documentElement.setAttribute('data-theme', 'light')
getComputedStyle(ico).stroke      // distinto

// Firma del DOM: correr en Home y en Sobre mí y comparar
[...document.querySelector('.stack-groups').querySelectorAll('*')]
  .map(n => `${n.tagName}.${n.className}`).join('|')
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; tres grupos con los
ítems del PRD, en las dos vistas; **la firma del DOM coincide entre Home y Sobre mí**; ningún `<use>` sin
resolver; los íconos cambian de color con el tema; el revelado escalonado se ve; el hover rota y escala;
con movimiento reducido visibles y quietos; verificado en 390 px y 1280 px en los tres temas; consola sin
errores.

### Project Structure Notes

```
src/components/sections/SkillGrid.vue      NUEVO — reemplaza SkillList.vue e ItemSkill.vue
src/components/layout/AppSprite.vue        MODIFICADO — símbolos de tecnología (si se elige esa vía)
src/views/HomeView.vue                     MODIFICADO — sección de habilidades
src/views/AboutView.vue                    MODIFICADO — reactiva la sección
src/styles/sections.scss                   MODIFICADO — .stack-groups, .skill y derivados
src/components/skills/SkillList.vue        ELIMINADO
src/components/skills/ItemSkill.vue        ELIMINADO
src/assets/icons/*.png                     ELIMINADOS los de tecnología sin uso
src/locales/{es,en}.json                   MODIFICADO — etiquetas de grupo y título de sección
```

`src/components/skills/` queda vacía y se puede borrar.

### References

- Historia y criterios: [Source: epics.md#Story 5.4]
- FR-21, FR-22: [Source: prd.md#7.5 Habilidades]
- FR-08, orden de la Home: [Source: prd.md#7.2]
- NFR-02/07/17: [Source: prd.md#8.1, #8.2, #8.4]
- D9, sprite SVG: [Source: architecture.md#Frontend Architecture]
- D14, cero terceros: [Source: architecture.md#Authentication & Security]
- A2 y A7: [Source: ux-design-specification.md#4.3]
- A9 diferida: [Source: architecture.md#Decisiones diferidas]
- Estilos fuente: `public/ui-generated/home/page.css` líneas 442–496

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

**AC1 — los tres grupos, medidos:**

```
FRONTEND  HTML · CSS · JavaScript · Vue · React · Flutter
BACKEND   Node.js · Express · SQL/NoSQL
TOOLS     Git · Docker
```

Exactamente los del PRD §7.5, ni uno más.

**AC2 —** revelado escalonado por grupo con `v-reveal`, paso 70 ms.

**AC3 —** `.skill:hover .ico` con `rotate(6deg) scale(1.08)` en `--ease-spring`; solo `transform` y
`color`.

**AC4 —** `SkillList.vue` e `ItemSkill.vue` eliminados, y con ellos los seis PNG de tecnología.

**AC5 —** con movimiento reducido, los tres grupos visibles y la transición del ícono en 0.01 ms.

### La decisión de los íconos: se dibujaron once símbolos

La historia 5.1 dejó abierta la elección entre sumar símbolos al sprite, quedarse sin íconos o usar los
PNG. **Se eligió sumarlos al sprite**, y son abstracciones monocromas de trazo, no los logos oficiales:
el sprite es `fill: none` con `stroke: currentColor`, y un logo de marca —de relleno y multicolor—
metido ahí se vería de otro material que el resto y dejaría de seguir el color del tema, que es todo el
punto de D9.

Once símbolos nuevos: `i-html`, `i-css`, `i-javascript`, `i-vue`, `i-react`, `i-flutter`, `i-node`,
`i-express`, `i-database`, `i-git`, `i-docker`.

Y se verificó lo que la historia advertía, porque **un `<use>` a un ID inexistente renderiza un SVG
vacío sin ningún error en consola**:

```
símbolos usados: 11      que no existen: []      con caja de tamaño cero: 0
color heredado del tema: rgb(90, 98, 112)
```

Medir la caja es lo que detecta el símbolo faltante; la consola no dice nada.

### El mismo componente en las dos vistas

La firma del DOM de `.stack-groups` en la Home y en Sobre mí es **idéntica**. Es el mismo componente con
los mismos datos: si alguna vista tuviera que mostrar menos, filtraría lo que le pasa por props.

### `--ease-spring` es para esto y no para lo otro

`cubic-bezier(0.34, 1.56, 0.64, 1)` sobrepasa y vuelve. Va en la micro-interacción del ícono (A7), no en
el revelado ni en el hover de la card, que llevan `--ease-out`.

### File List
