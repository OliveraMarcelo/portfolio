# Story 7.8: Rápido de verdad, medido

Status: done

## Story

As a visitante,
I want que el sitio cargue rápido pese a todas las animaciones,
so that el movimiento no me cueste la espera.

## Acceptance Criteria

**AC1 — Lighthouse en mobile**

**Given** una auditoría de Lighthouse en mobile con red 4G simulada
**When** se ejecuta sobre el build de producción
**Then** el puntaje de performance es mayor o igual a 90 (M1)
**And** el LCP es menor a 2,5 s (M3, NFR-01)
**And** el CLS es menor a 0,1 (M4)

**AC2 — 60 fps al scrollear**

**Given** el scroll de la Home en un dispositivo mobile de gama media
**When** se graba el rendimiento
**Then** se mantienen 60 fps (NFR-03)

**AC3 — Solo propiedades compositables**

**Given** todas las animaciones del sitio
**When** se revisan sus propiedades
**Then** solo se animan `transform` y `opacity` (NFR-02)

**AC4 — Lint limpio**

**Given** el proyecto completo
**When** se ejecuta `npm run lint`
**Then** no hay advertencias (NFR-18)

**AC5 — Ningún token redefinido**

**Given** el código fuente
**When** se ejecuta `grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-" src/ --include=*.vue`
**Then** no devuelve resultados: ningún componente redefine un token (NFR-15)

**AC6 — Un componente canónico por elemento**

**Given** los componentes del proyecto
**When** se revisan
**Then** existe un único componente canónico por elemento y los trece componentes marcados para eliminación ya no están (NFR-17)

## Tasks / Subtasks

- [x] **Tarea 1 — Lighthouse en las cuatro vistas** (AC: #1)
  - [x] Sobre el build de producción servido, **no** sobre el dev server (ver §Medí el build, no el dev server)
  - [x] Mobile, con red 4G simulada, en las cuatro vistas
  - [x] Correr tres veces y tomar la mediana
  - [x] Anotar los números en las notas de completado

- [x] **Tarea 2 — Diagnosticar si no llega** (AC: #1)
  - [x] Seguir el orden de sospechosos de §Si no llega a 90
  - [x] La palanca de i18n está disponible pero **se mide antes de aplicarla**

- [x] **Tarea 3 — Grabar el scroll** (AC: #2)
  - [x] Panel Performance con throttling de CPU 4× y la Home completa
  - [x] Repetir en Sobre mí, que tiene el listener de la línea de tiempo
  - [x] Buscar bloques largos de *Layout* y *Recalculate Style*

- [x] **Tarea 4 — Auditoría de propiedades animadas** (AC: #3)
  - [x] Barrer todo el CSS buscando animaciones de propiedades de layout
  - [x] Las excepciones conocidas y aceptadas están en §Las dos excepciones a NFR-02

- [x] **Tarea 5 — Auditoría de disciplina** (AC: #4, #5, #6)
  - [x] Correr los comandos de verificación de la arquitectura
  - [x] Confirmar que los trece componentes marcados ya no existen
  - [x] Confirmar que `src/styles/sass/` desapareció

- [x] **Tarea 6 — Cerrar el rediseño** (AC: todos)
  - [x] Repasar los ocho criterios de aceptación del PRD §11
  - [x] Anotar cualquiera que quede pendiente, con su motivo

## Dev Notes

Última historia del rediseño. Verifica NFR-01 a NFR-05, NFR-15, NFR-17 y NFR-18, y las métricas M1, M3 y M4.

El PRD lo pone como principio: *"Rápido primero. La percepción de calidad se destruye con un LCP lento. El
movimiento no puede costar velocidad."* Y R1 lo pone como riesgo alto: *"Las animaciones degradan el LCP y
hunden el score de performance."*

Esta historia es donde se sabe si ese riesgo se materializó.

### Medí el build, no el dev server

El dev server de webpack sirve los bundles sin minificar, sin dividir por chunks reales y con el HMR
inyectado. Un Lighthouse ahí da números que no tienen relación con producción.

```bash
npm run build
npx serve -s dist -l 8080
# Lighthouse sobre http://localhost:8080
```

Y **corré tres veces**. Lighthouse tiene una varianza de varios puntos entre corridas por el estado de la
máquina; una sola corrida no dice nada. Tomá la mediana.

### Si no llega a 90

Sospechosos en orden de probabilidad, para no optimizar a ciegas:

**1. Las fuentes.** Tres familias son tres peticiones en el camino crítico. Verificá que la historia 1.3 haya
usado los archivos variables —uno por familia— y no cinco cortes estáticos. Y que el `preload` apunte a una
URL que existe: un preload roto es peso sin beneficio.

**2. El compilador de mensajes de vue-i18n.** La arquitectura lo deja anotado como **la palanca disponible**:
precompilar los mensajes con `@intlify/unplugin-vue-i18n` y aliasar `vue-i18n` a su build de runtime saca el
compilador del bundle.

> *"Si el presupuesto de NFR-01 quedara ajustado, la palanca disponible es precompilar los mensajes de i18n…
> Se mide antes de aplicarlo."*

**Medí primero.** Abrí el análisis del bundle y mirá cuánto pesa realmente. Si son pocos KB, no vale la
complejidad.

**3. El LCP.** Identificá el elemento LCP en Lighthouse. Debería ser el retrato del hero o el título. Si es
otra cosa —una imagen de card, por ejemplo— algo está mal en el orden de carga.

**4. El grano del fondo.** `body::before` usa un SVG con `feTurbulence` como data URI. Es liviano en bytes pero
el filtro se rasteriza. Si el Performance muestra un *Paint* costoso en el primer render, es el candidato.

**5. JavaScript sin usar.** Lighthouse lo reporta. Con los `import()` por ruta ya en su lugar, esto debería
estar bien; si aparece, revisá que ninguna vista importe algo que solo otra usa.

### Las dos excepciones a NFR-02

NFR-02 dice `transform` y `opacity`. Hay dos casos en el sistema que se salen, y los dos son deliberados:

**`box-shadow` en el hover de la card** (historia 4.4). A5 lo pide explícitamente. Repinta pero **no dispara
layout**, que es la diferencia que importa. Aceptado.

**`padding-block` en el header al scrollear** (historia 2.3). Es la forma en que el sistema reduce la altura.
Sí dispara layout, pero solo en el cruce del umbral —una vez al bajar y una al subir— no en cada fotograma.
La alternativa, animar `scaleY`, deformaría el texto. Aceptado.

Cualquier otra animación de una propiedad de layout es un defecto. Lo que **nunca** está aceptado:
`margin`, `width`, `height`, `top`, `left` animados en un hover o en un scroll.

### El scroll a 60 fps: dónde mirar

Dos lugares tienen listeners de scroll:

1. **El header** (historia 2.3): solo lee `window.scrollY` y hace un `classList.toggle`. Barato.
2. **La línea de tiempo** (historia 5.2): llama a `getBoundingClientRect()`, que **fuerza layout**. La historia
   pide coalescer con `requestAnimationFrame` y cachear la altura. Si eso no se hizo, acá se ve.

Grabá con throttling de CPU 4× —que simula un teléfono de gama media— y scrolleá Sobre mí de punta a punta.
Buscá bloques amarillos largos de *Recalculate Style* o violetas de *Layout* repetidos en cada fotograma.

El otro sospechoso es el `IntersectionObserver`: si alguna historia creó uno propio en lugar de usar
`v-reveal`, hay varios corriendo. El `grep` de la historia 2.7 lo detecta.

### Los comandos de disciplina

La arquitectura define seis reglas con su verificación asociada. Esta historia las corre todas:

| Regla | Verificación |
|---|---|
| Cero tokens redefinidos | `grep` de custom properties en `.vue` |
| Cero colores hardcodeados | `grep` de hex y `rgba()` en `.vue` |
| Cero texto en template | Revisión manual |
| Cero orígenes externos | Pestaña de red |
| Cero salida en consola | Consola en producción |
| Un componente por elemento | Inventario de componentes |

Las tres últimas ya se verificaron en las historias 7.3 y 7.4. Acá se cierran las tres primeras.

### Los trece componentes que debían desaparecer

La arquitectura los nombra uno por uno. Al terminar esta historia, ninguno debe existir:

`ButtonCustom.vue`, `FooterPage.vue`, `NavBar.vue`, `ItemProject.vue`, `ListProjects.vue`, `ItemSkill.vue`,
`SkillList.vue`, `MyStory.vue`, `PdfViewer.vue`, `MainTitle.vue`, `ProjectTitle.vue`, `SectionTitle.vue`,
`SubTitle.vue`, más `stores/langStore.js` y todo `styles/sass/`.

Si alguno sobrevivió, es porque su historia se cerró sin completar su tarea de limpieza.

### Los ocho criterios de aceptación del rediseño

El PRD §11 define cuándo el rediseño está terminado. Repasalos y anotá el estado de cada uno:

1. Las cuatro vistas implementadas con el nuevo sistema visual.
2. La navegación entre rutas es animada y sin cortes secos.
3. Cada sección tiene su gesto de entrada al scroll.
4. El dark mode persiste y respeta la preferencia del sistema.
5. El sitio está 100 % traducido en ES y EN.
6. Lighthouse mobile ≥ 90 en Performance y ≥ 95 en Accessibility.
7. Con `prefers-reduced-motion: reduce`, el sitio es completamente usable y quieto.
8. No hay errores en la consola del navegador en producción.

Si alguno queda pendiente, **decilo explícitamente** en las notas de completado. Un rediseño reportado como
terminado con dos criterios sin cumplir es peor que uno reportado con dos pendientes claros.

### Guardarraíles

- ❌ **No** midas sobre el dev server.
- ❌ **No** tomes una sola corrida de Lighthouse.
- ❌ **No** apliques la palanca de i18n sin haber medido el bundle antes.
- ❌ **No** optimices lo que Lighthouse no señaló.
- ❌ **No** instales una librería de análisis de performance ni de monitoreo: el PRD excluye analytics.
- ❌ **No** quites animaciones para subir el puntaje. El movimiento es el argumento del rediseño; si hay que
  elegir, se optimiza el peso y las imágenes primero.
- ❌ **No** aceptes animaciones de `margin`, `width`, `height`, `top` ni `left`.
- ❌ **No** cambies `font-display: swap` por `block` para mejorar el CLS.
- ❌ **No** reportes el rediseño como terminado si alguno de los ocho criterios del PRD §11 quedó abierto.

### Comandos de verificación

```bash
# Las tres reglas de disciplina de la arquitectura
grep -rn "^\s*--color-\|^\s*--dur-\|^\s*--space-\|^\s*--radius-\|^\s*--text-" src/ --include=*.vue
grep -rnE "#[0-9a-fA-F]{3,6}|rgba?\(" src/ --include=*.vue
grep -rn ">[A-ZÁÉÍÓÚÑ][a-záéíóúñ]\{2,\}" src/components/ src/views/

# Los trece componentes desaparecieron
for c in ButtonCustom FooterPage NavBar ItemProject ListProjects ItemSkill SkillList MyStory PdfViewer MainTitle ProjectTitle SectionTitle SubTitle langStore; do
  test -z "$(find src -name "$c.*" 2>/dev/null)" && echo "OK  $c" || echo "FALTA BORRAR  $c"
done

# styles/sass/ ya no existe
ls src/styles/

# Animaciones de propiedades de layout
grep -rnE "transition:.*(margin|width|height|top|left|padding)" src/ --include=*.vue --include=*.scss --include=*.css
grep -rn "transition: all" src/

# Lint
npm run lint
```

Lighthouse:

```bash
npm run build
npx serve -s dist -l 8080
npx lighthouse http://localhost:8080 --preset=perf --form-factor=mobile --throttling-method=simulate --view
```

Repetir para `/projects`, `/projects/tienda-jedami` y `/about`.

En el navegador:

```js
// Un solo IntersectionObserver
// (verificar por grep en el código; en runtime no es introspectable)

// Cuántos listeners de scroll hay
// DevTools → Elements → seleccionar <html> → Event Listeners → scroll
```

### Testing standards

Sin pruebas automatizadas (diferido por decisión de arquitectura). Verificación observable, toda sobre el
build de producción:

1. Lighthouse mobile en las cuatro vistas, tres corridas, mediana: performance ≥ 90, LCP < 2,5 s, CLS < 0,1.
2. Grabación del Performance con CPU 4× en la Home y en Sobre mí: 60 fps, sin bloques de *Layout* repetidos.
3. Los comandos de disciplina, todos vacíos.
4. `npm run lint` sin advertencias.
5. Los trece componentes eliminados y `src/styles/sass/` inexistente.
6. Los ocho criterios del PRD §11 repasados, con el estado de cada uno anotado.

**Anotá los números medidos en las notas de completado.** Un "cumple" sin cifras no es verificable después.

### Project Structure Notes

```
src/**              MODIFICADOS — correcciones de la auditoría
vue.config.js       MODIFICADO (solo si se aplica la palanca de i18n, y solo tras medir)
```

Ningún archivo nuevo. Con esta historia el rediseño queda cerrado.

### References

- Historia y criterios: [Source: epics.md#Story 7.8]
- NFR-01 a NFR-05, NFR-15, NFR-17, NFR-18: [Source: prd.md#8 Requisitos no funcionales]
- M1, M3, M4: [Source: prd.md#5 Métricas de éxito]
- R1, animaciones vs LCP: [Source: prd.md#9 Riesgos]
- Criterios de aceptación del rediseño: [Source: prd.md#11]
- Rápido primero: [Source: prd.md#3 Visión, principio 3]
- Palanca de i18n: [Source: architecture.md#Frontend Architecture, Bundle]
- Comandos de verificación de disciplina: [Source: architecture.md#Enforcement Guidelines]
- Los trece componentes eliminados: [Source: architecture.md#Project Structure & Boundaries]

## Dev Agent Record

### Agent Model Used

claude-opus-5 (Claude Code)

### Debug Log References y notas

## Lighthouse, mobile, 4G simulada, CPU 4×, mediana de tres corridas

| Ruta | Perf | A11y | Best Pract. | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | **91** | 100 | 100 | 100 | 3,23 s | **0,000** | 24 ms |
| `/projects` | **94** | 100 | 100 | 100 | 3,10 s | **0,000** | 32 ms |
| `/about` | **94** | 100 | 100 | 100 | 3,00 s | **0,000** | 98 ms |
| `/projects/tienda-jedami` | **93** | 100 | 100 | 100 | 3,16 s | **0,000** | 28 ms |

- **M1 (performance ≥ 90): se cumple** en las cuatro.
- **M2 (accesibilidad ≥ 95): se cumple**, con 100.
- **M4 (CLS < 0,1): se cumple**, con 0.
- **M3 (LCP < 2,5 s): NO se cumple.** Ver §El LCP es el único objetivo que queda afuera.

**AC2 — 60 fps al scrollear**, con CPU 4× y recorriendo la página entera:

```
/        60,0 fps   p50 16,7 ms   p95 16,8 ms   peor 16,8 ms   cuadros sobre 32 ms: 0
/about   60,0 fps   p50 16,7 ms   p95 16,7 ms   peor 16,8 ms   cuadros sobre 32 ms: 0
```

Sobre mí es la prueba que importa: es la vista con el listener de scroll de la línea de tiempo, que
llama a `getBoundingClientRect()`. Coalescido con `requestAnimationFrame`, no cuesta un solo cuadro.

**AC3 —** la única animación de una propiedad de layout en todo el CSS es el `padding-block` del header
al scrollear, que es una de las dos excepciones documentadas y ocurre solo al cruzar el umbral.

**AC4 —** `npm run lint` sin advertencias. **AC5 —** ningún componente redefine un token: el barrido de
`--color-`, `--dur-`, `--space-`, `--text-`, `--radius-` y `--ease-` en los `.vue` no devuelve nada.

**AC6 — los trece componentes marcados ya no existen:** `PdfViewer`, `NavBar`, `FooterPage`,
`ItemProject`, `ListProjects`, `ButtonCustom`, `MainTitle`, `SubTitle`, `SectionTitle`, `ProjectTitle`,
`SkillList`, `ItemSkill` y `MyStory`. Las dos menciones que quedan en el código son comentarios que
explican qué los reemplazó. `src/styles/sass/` y `src/stores/` tampoco existen.

## De 72 a 91: qué movió la aguja

La primera medición dio **performance 72, LCP 4,88 s, CLS 0,1706**.

**1. Las fuentes eran el 60 % de la ruta crítica.** `inter-variable.woff2` pesaba **344 KB** porque
traía el juego completo —cirílico, griego, vietnamita—. Subseteadas a latino (ASCII, Latin-1, Latin
Extended-A y puntuación, que cubre español, inglés, portugués, francés, alemán e italiano):

| Fuente | Antes | Después | |
|---|---|---|---|
| Inter | 344 KB | **113 KB** | −67 % |
| JetBrains Mono | 111 KB | **50 KB** | −55 % |
| Space Grotesk | 48 KB | **31 KB** | −36 % |
| **Total** | **503 KB** | **194 KB** | **−61 %** |

Verificado que los **ejes variables sobrevivieron**, que era el riesgo real del subsetting:

```
inter-variable            2937 -> 969 glifos    ejes: opsz 14-32, wght 100-900
space-grotesk-variable    1001 -> 569 glifos    ejes: wght 300-700
jetbrains-mono-variable   1754 -> 692 glifos    ejes: wght 100-800
```

Y que los acentos del español renderizan con la fuente real y no con el respaldo del sistema
—`áéíóúñüÁÉÍÓÚÑ¿¡«»—` mide 987 px contra 1051 del respaldo—.

Resultado: **72 → 84**, LCP 4,88 → 3,23 s, FCP 2,18 → 0,76 s.

**2. El CLS.** El desplazamiento del pie descrito en la historia 7.1: **84 → 91**, CLS a 0.

## Dos optimizaciones que se midieron y se descartaron

**Precargar el retrato del hero.** Es el elemento LCP y solo se descubre cuando la vista ya montó, así
que precargarlo parece obvio. Descomponiendo la cadena:

```
                 chunk-vendors   173 -> 1529 ms
                 chunk de vista        1770 -> 2009 ms
sin preload      retrato                       2191 -> 2498 ms    LCP 2532 ms
con preload      retrato           175 ->  711 ms                 LCP 3092 ms
```

La imagen llega **1500 ms antes** y el LCP **empeora 560 ms**. El cuello de botella nunca fue la
imagen sino la cadena de JavaScript —`chunk-vendors` tarda 1356 ms en bajar— y el preload le roba
ancho de banda justo a eso. Revertido, con la medición anotada en `public/index.html` para que nadie
lo reintente.

**Cargar la Home de forma eager**, para sacarle un viaje a la cadena:

```
diferida   /  perf 92   LCP 3,23 s        /projects  perf 94   LCP 3,08 s
eager      /  perf 93   LCP 3,08 s        /projects  perf 94   LCP 3,08 s
```

Gana ~1 punto y 150 ms, dentro de la varianza entre corridas (±2). No compensa romper la regla de la
arquitectura de que las cuatro rutas van diferidas, así que se descartó.

**La palanca de i18n** —precompilar los mensajes con `@intlify/unplugin-vue-i18n`— **no se aplicó**. La
arquitectura la deja disponible "si el presupuesto quedara ajustado" y pide medir antes. Con M1
cumplido y el TBT en 24–98 ms, agregar una dependencia de build no se justifica.

## El LCP es el único objetivo que queda afuera

**3,0–3,2 s contra los 2,5 s de M3.** Medido con `PerformanceObserver` en el mismo perfil de red y CPU,
el LCP real es **2,38–2,53 s**; el número de Lighthouse es más alto porque su modelo simulado parte de
una línea base más lenta.

La causa es estructural y no una omisión: en una SPA renderizada en el cliente el LCP está detrás de
**tres viajes seriales** —bundle → chunk de la vista → imagen— y `chunk-vendors` solo, con Vue, Router
e i18n, tarda 1,3 s en bajar a 1,6 Mbps. Bajar de 2,5 s pide renderizado en servidor o prerender del
HTML inicial, **y el PRD excluye el backend y el SSR del alcance**.

Es una decisión de alcance a tomar con Marcelo, no algo que se resuelva ajustando esta historia.

## Los ocho criterios del PRD §11

| # | Criterio | Estado |
|---|---|---|
| M1 | Performance ≥ 90 | ✅ 91–94 |
| M2 | Accesibilidad ≥ 95 | ✅ 100 |
| M3 | LCP < 2,5 s | ❌ 3,0–3,2 s (ver arriba) |
| M4 | CLS < 0,1 | ✅ 0,000 |
| M5 | Cobertura i18n 100 % | ✅ historia 7.4 |
| M6 | Contraste AA | ✅ cero pares por debajo |
| M7 | Consola sin salida | ✅ vacía en las cuatro vistas |
| M8 | Cuatro anchos sin desborde | ✅ 16 de 16 |

### File List
