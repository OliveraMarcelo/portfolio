---
name: unify-components
description: 'Audita las pantallas ya generadas, detecta componentes divergentes y los reemplaza por los canónicos con markup idéntico. Extrae un design system compartido (tokens + componentes + chasis) que todas las vistas consumen, y verifica la consistencia MIDIENDO en navegador.'
---

# Workflow: Unificar componentes (design-system-first)

**Meta:** que las pantallas generadas dejen de ser N sitios parecidos y pasen a ser **un
solo sistema**: una fuente de verdad de tokens y componentes, que todas las vistas
consumen. El resultado se **mide**, no se supone.

**Cuándo se usa:** después de generar las pantallas con `create-ui-from-ux`, cuando cada
una trajo su propia copia divergente del chasis. Idealmente el contrato de generación ya
previene la mayor parte de esto — este workflow existe para lo que se filtre y para
proyectos generados antes de que el contrato existiera.

> **Por qué existe:** al generar pantalla por pantalla, cada run inventa su convención.
> Medido en un caso real de 4 pantallas: el panel del menú se llamaba `mobile-menu`,
> `nav-main` y `nav__menu`; el botón primario `btn-primary` y `btn--primary`; 4.019 líneas
> de CSS con los tokens redefinidos en las 4 y **solo 131 líneas idénticas entre todas**.
> No es duplicación prolija: es divergencia. Y cada bug del chasis (z-index del menú, velo
> que come clicks, enlaces roto) hubo que arreglarlo **una vez por pantalla**.

---

## FASE 1 — AUDITAR (medir la divergencia)

No empezar a mover código sin números. Para cada componente compartido, listar qué clase
usa cada pantalla:

```bash
# ejemplo: panel del menu movil, boton primario, card
for d in <pantallas>; do
  printf "%-18s " $d
  grep -ohE 'class="(mobile-menu|nav-main|nav__menu)[^"]*"' $d/index.html | sort -u | head -1
  echo
done
```

Medir también el peso y la duplicación real:

```bash
# lineas de CSS por pantalla y total
# tokens redefinidos: grep -c '\--color-bg:' por pantalla
# lineas identicas entre pares (duplicacion) vs presentes en todas
```

Registrar la tabla resultante: es la línea de base contra la que se comparará al final.

---

## FASE 2 — FIJAR LAS CLASES CANÓNICAS

Elegir **una** convención y dejarla escrita. Criterio: la que ya usa la mayoría de las
pantallas, salvo razón fuerte en contra. Documentar el mapeo completo:

| Componente | Canónica | Variantes que se reemplazan |
|---|---|---|
| Header | `.site-header` | ... |
| Contenedor del header | `.header-inner` | `.nav-inner`, `.nav__inner` |
| Nav | `.nav` + `.nav-list` + `.nav-link` | `.nav-main`, `.nav__menu`, `.nav__link` |
| Panel móvil | `.mobile-menu` + `.mobile-link` | `.nav__menu` |
| Velo | `.nav-scrim` | ... |
| Botón | `.btn` + `.btn-primary` / `.btn-ghost` | `.btn--primary`, `.btn--ghost` |
| Chip | `.chips` + `.chip` | ... |
| Icono | `.ico` | `.ic`, `.icon` |
| Footer | `.site-footer` | `.footer`, `.footer__inner` |

**Regla:** un componente canónico con **modos** (`data-mode`, o clases de variante), nunca
un clon por contexto.

---

## FASE 3 — EXTRAER EL SISTEMA

Tomar la **pantalla tesis** (la más completa) como base y sacar de ahí el sistema:

```
<raiz-de-pantallas>/_system/
├── tokens.css       # UNA definicion de tokens (los 3 bloques de tema)
├── components.css   # base + chasis (header/nav/footer) + primitivas + utilidades
├── system.js        # tema, idioma, header en scroll, indicador, menu, reveal
├── chasis.html      # header + footer canonicos, con marcadores de ruta y de activo
└── sprite.html      # simbolos SVG compartidos
```

**Qué va al sistema:**

- Tokens de color, tipografía, espaciado, radios, sombras y movimiento.
- Reset/base, `.container`, `.skip-link`, `.ico`.
- Chasis completo: header, nav, indicador, panel móvil, velo, footer.
- Primitivas: `.btn` y variantes, `.chips`/`.chip`.
- Utilidades de animación: `.reveal`/`.is-visible`, `.mask`/`.mask-in`, hook `data-qa`,
  bloque de `prefers-reduced-motion`, `@view-transition`.
- Tokens específicos que usan **dos o más** pantallas (ej. `--ph-*` de los marcadores de
  captura): también son del sistema.
- El apilamiento del menú, con `z-index` explícito: `scrim 90 < header 100 < panel 105`.

**Qué NO va:** todo lo que es de una sola pantalla (hero, grillas, timeline, fichas).

El `system.js` expone una API mínima para que las páginas aporten lo suyo:

```js
MC.registrarTextos({ es: {...}, en: {...} });   // merge + re-aplica el idioma
```

---

## FASE 4 — REPARTIR EL CSS (por selector, NUNCA por rangos de línea)

> ⚠ **La lección más cara de este workflow.** Recortar el CSS de página por rangos de
> línea **rompe el archivo**: es cuestión de tiempo que un rango caiga dentro de un
> `@media` y lo parta al medio, dejando CSS inválido y silencioso. En un caso real eso se
> llevó el `grid-template-columns` de una línea de tiempo y el texto quedó en columnas de
> un carácter. Las llaves desbalanceadas son la señal (`{` vs `}`).

Criterio correcto: **un bloque se queda en `page.css` salvo que todos sus selectores ya
estén definidos en el sistema.** Así nada se pierde por accidente y nada duplica al sistema.

```
para cada bloque del CSS original:
    si es @media  -> filtrar bloque por bloque adentro, y conservar el @media
                     solo si algo quedo dentro
    si todos sus selectores estan en el sistema -> descartar (ya lo da el sistema)
    si no                                        -> conservar en page.css
```

Al terminar, **verificar el balance de llaves** de cada `page.css`. Si no cierra, el
reparto rompió algo.

---

## FASE 5 — MIGRAR EL HTML

Por cada pantalla:

1. Reemplazar skip link + header + footer por el **chasis canónico instanciado** (sus rutas
   y su ítem activo). El markup queda **idéntico** en todas.
2. Insertar el sprite del sistema, conservando los símbolos propios de la pantalla.
3. Enlazar en orden: `tokens.css` → `components.css` → `page.css`.
4. Enlazar `system.js` → `page.js`.
5. **Renombrar en el HTML las clases divergentes del contenido** al nombre canónico
   (`class="ic"` → `class="ico"`, `btn--primary` → `btn-primary`). Esto se olvida fácil:
   el header se reemplaza entero, pero las clases divergentes que están en el `<main>`
   sobreviven y quedan sin estilo.
6. Reducir el `main.js` a `page.js`: solo el diccionario de la pantalla (vía
   `MC.registrarTextos`) y su comportamiento propio.

---

## FASE 6 — LIMPIAR EL CSS MUERTO

Tras migrar, el CSS del chasis viejo queda sin uso. Detectarlo comparando las clases del
`page.css` contra las que realmente aparecen en su `index.html`:

```
clases_en_css - clases_en_html - estados_por_js(is-*, has-*, js*)  =  muertas
```

Eliminar solo los bloques cuyos selectores apunten **exclusivamente** a clases muertas.

---

## FASE 7 — VERIFICAR MIDIENDO (y además mirando)

### 7.1 Consistencia demostrable

La prueba fuerte: si el chasis es de verdad el mismo componente, su **firma es idéntica**
en todas las pantallas.

```js
const header = document.querySelector('.site-header');
const firma = [...header.querySelectorAll('*')]
  .map(e => e.tagName + '.' + (e.className||'').toString().replace(/ is-active/g,''))
  .join('|');
// hash de la firma: debe ser EL MISMO numero en todas las pantallas
firma.split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0, 0)
```

Y las medidas que el principio pide explícitamente:

- posición del logo (`.logo` → `getBoundingClientRect().left`): idéntica
- alto del header: idéntico
- `.btn.btn-primary` existe (viene del sistema) en todas
- 0 clases de las convenciones viejas (`[class*="btn--"]`, `[class*="nav__"]`)
- `getComputedStyle(document.querySelector('.chips')).display === 'flex'`

### 7.2 Funcional, pantalla por pantalla

- Los tres estados de tema devuelven el token exacto.
- El menú móvil abre, sus enlaces **reciben el clic** (`elementFromPoint`) y cierra con `Escape`.
- Con `data-qa="show-all"`, 0 elementos animados ocultos.
- Sin scroll horizontal.
- Consola sin errores.

### 7.3 Y MIRAR cada pantalla

> ⚠ **Las métricas no ven un layout roto.** En el caso real, el chasis medía idéntico en
> las 4 y sin embargo una pantalla tenía el texto en columnas de un carácter y otra las
> imágenes en negro. Sacar captura de **cada** pantalla y compararla contra la de antes de
> unificar. Ninguna debe verse peor.

---

## FASE 8 — REGISTRAR EL RESULTADO

Actualizar el handoff con la tabla antes/después: líneas de CSS por pantalla, tokens
redefinidos, clases por componente, y qué quedó en el sistema. Ese diff es la evidencia de
que el principio design-system-first se cumplió.

---

## REGLAS DE ESTE WORKFLOW

- **Design-system-first:** una fuente de verdad. Ninguna pantalla redefine tokens ni chasis.
- **Componente canónico con modos**, nunca un clon por página.
- **Consistencia demostrable:** se mide (firma del chasis, posición del logo, clase
  computada), no se afirma por inspección visual.
- **Repartir por selector, jamás por rangos de línea.**
- **Medir Y mirar:** las métricas detectan divergencia; los ojos detectan layout roto.
- Respaldar antes de migrar: el reparto es destructivo y se corrige comparando con el original.
- Preservar el JS propio de cada página; solo el chasis se centraliza.
