# Story 7.2: El sitio se ve bien cuando se comparte

Status: ready-for-dev

## Story

As a visitante que comparte el enlace,
I want que se vea una previsualización decente,
so that el enlace invite a entrar.

## Acceptance Criteria

**AC1 — Open Graph y Twitter Card**

**Given** `public/index.html`
**When** se inspeccionan sus metadatos
**Then** declara Open Graph y Twitter Card con título, descripción e imagen (NFR-20)
**And** la URL de la imagen es absoluta (`https://marcecode.com/og-image.webp`), no relativa

**AC2 — La imagen refleja el diseño nuevo**

**Given** la imagen de previsualización
**When** se genera en `public/og-image.webp`
**Then** representa el diseño nuevo, no el anterior

**AC3 — Metadatos propios por ruta**

**Given** cada una de las cuatro rutas
**When** se carga
**Then** el título del documento y la meta description son propios de esa ruta y están traducidos al idioma activo (NFR-19)

## Tasks / Subtasks

- [ ] **Tarea 1 — Generar la imagen de previsualización** (AC: #2)
  - [ ] Captura del hero del diseño nuevo, en tema oscuro, a 1200×630 px
  - [ ] Guardar como `public/og-image.webp` (ver §Por qué va en `public/` y no en `src/assets/`)
  - [ ] Verificar que el texto del hero sea legible al tamaño en que se muestra la tarjeta

- [ ] **Tarea 2 — Declarar los metadatos sociales** (AC: #1)
  - [ ] En `<head>` de `public/index.html`: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:locale`
  - [ ] Twitter: `twitter:card` en `summary_large_image`, más `twitter:title`, `twitter:description`, `twitter:image`
  - [ ] URLs **absolutas** con el dominio completo
  - [ ] Estáticos, no dinámicos (ver §Los metadatos sociales son estáticos, y eso está bien)

- [ ] **Tarea 3 — Completar los metadatos por ruta** (AC: #3)
  - [ ] La historia 2.1 dejó el guard `afterEach` funcionando para tres rutas y la 4.5 para el detalle
  - [ ] Verificar las cuatro, en los dos idiomas
  - [ ] Revisar que las descripciones tengan entre 120 y 160 caracteres y sean distintas entre sí

- [ ] **Tarea 4 — Canonical y `robots.txt`** (AC: #1)
  - [ ] `<link rel="canonical">` apuntando al dominio
  - [ ] Revisar que `public/robots.txt` no esté bloqueando el sitio (ver §Revisá el `robots.txt`)

- [ ] **Tarea 5 — Verificar** (AC: todos)
  - [ ] `npm run build` sin errores y `npm run lint` sin advertencias
  - [ ] Validar la tarjeta con un depurador (ver §Cómo verificar la tarjeta de verdad)
  - [ ] Confirmar título y descripción propios en las cuatro rutas, en los dos idiomas
  - [ ] Confirmar que `og:image` resuelve a una URL que existe

## Dev Notes

NFR-20 y NFR-19. Esta historia no cambia nada de lo que se ve en el sitio: cambia lo que se ve **fuera** del
sitio, cuando alguien pega el enlace en LinkedIn, WhatsApp o Slack.

Para un portfolio es más importante de lo que parece: el recorrido J1 empieza con un reclutador que llega
desde LinkedIn, y la tarjeta de previsualización es lo primero que ve.

### Los metadatos sociales son estáticos, y eso está bien

**D11 en la arquitectura:** los títulos y descripciones por ruta se resuelven en el guard del router, pero
**Open Graph y Twitter Card se declaran estáticos en `public/index.html`**.

Parece una inconsistencia. No lo es: los rastreadores de LinkedIn, WhatsApp y Twitter **no ejecutan
JavaScript**. Piden el HTML, leen las metaetiquetas que están en el documento inicial y se van. Cualquier
metaetiqueta que Vue inserte al montar es invisible para ellos.

Consecuencia práctica: en una SPA sin renderizado en servidor, **todas las rutas comparten la misma tarjeta
de previsualización**. Es una limitación real del alcance —el PRD excluye backend y SSR— y no un defecto.

Por eso la tarjeta debe describir el sitio, no una página: título con el nombre y el rol, descripción de la
propuesta, imagen del hero.

**No intentes resolverlo** con un guard que actualice las etiquetas `og:` en runtime. Es código que no hace
nada para su único consumidor.

### Por qué va en `public/` y no en `src/assets/`

Todas las demás imágenes van en `src/assets/` para que webpack las versione con hash. Esta va en `public/`.

El motivo: `og:image` necesita una URL **estable y predecible** que se pueda escribir literal en el HTML. Con
hash de contenido, la URL cambia en cada build y habría que interpolarla — y además las plataformas cachean
la tarjeta agresivamente, así que una URL cambiante hace que la previsualización se rompa después de cada
deploy.

`nginx.conf` sirve los `webp` con `expires 1y, immutable`, lo que es correcto para esta imagen mientras no
cambie. Si la cambiás, hay que forzar el refresco desde el depurador de la plataforma.

### Las URLs tienen que ser absolutas

```html
<!-- ✅ -->
<meta property="og:image" content="https://marcecode.com/og-image.webp">

<!-- ❌ ninguna plataforma lo resuelve -->
<meta property="og:image" content="/og-image.webp">
```

Es la brecha menor 7 de la validación de arquitectura, anotada precisamente porque es el error más común y
falla en silencio: la tarjeta simplemente sale sin imagen.

Lo mismo vale para `og:url` y para el `canonical`.
[Source: architecture.md#Gap Analysis Results, brecha 7]

### `og:image:width` y `og:image:height` no son decorativos

Sin esas dos etiquetas, algunas plataformas —LinkedIn entre ellas— tienen que descargar la imagen para
conocer sus dimensiones antes de decidir el layout de la tarjeta. Si la descarga tarda, muestran la tarjeta
sin imagen.

Declaralas: `1200` y `630`.

### 1200×630 y por qué esa proporción

Es la relación 1.91:1 que Open Graph recomienda y que `twitter:card=summary_large_image` espera. Con otra
proporción, las plataformas recortan por el centro y pueden cortar el texto del hero.

Y un cuidado de composición: la tarjeta se muestra chica en el feed. Un hero con el título a
`clamp(3rem, 2rem + 7vw, 7.5rem)` capturado a 1200 px de ancho se ve bien; el mismo hero capturado a 1920 y
escalado, no. Capturá al tamaño de destino.

### Revisá el `robots.txt`

`public/robots.txt` ya existe. Antes de cerrar la historia, abrilo: si tiene un `Disallow: /` de alguna
prueba anterior, el sitio está pidiendo no ser indexado y toda esta historia no sirve para nada.

Debería permitir todo y, opcionalmente, apuntar a un sitemap. Un sitemap para cuatro rutas no aporta gran
cosa, así que es opcional.

### Cómo verificar la tarjeta de verdad

Mirar las metaetiquetas en el HTML confirma que están, no que funcionan. Las tres formas, de mejor a peor:

1. **Los depuradores oficiales**, que además fuerzan el refresco del caché de la plataforma:
   - LinkedIn: `https://www.linkedin.com/post-inspector/`
   - Facebook / Open Graph: `https://developers.facebook.com/tools/debug/`
   - Twitter: el validador de tarjetas
2. **Pegar el enlace en un chat de WhatsApp con vos mismo.** Rápido y fiel, pero cachea y no muestra por qué
   falla.
3. **`curl` y leer el HTML.** Confirma que las etiquetas se sirven, y nada más.

Usá la 1. **Requiere que el sitio esté desplegado**, así que esta verificación ocurre después del deploy, no
en local. Anotalo como tal en las notas de la historia.

### Guardarraíles

- ❌ **No** uses URLs relativas en `og:image`, `og:url` ni el `canonical`.
- ❌ **No** implementes metaetiquetas `og:` dinámicas por ruta.
- ❌ **No** instales `vue-meta` ni `@unhead/vue`.
- ❌ **No** pongas `og-image.webp` en `src/assets/`.
- ❌ **No** omitas `og:image:width` ni `og:image:height`.
- ❌ **No** uses una captura del diseño viejo.
- ❌ **No** captures a 1920 y escales: capturá a 1200×630.
- ❌ **No** dejes un `Disallow: /` en `robots.txt`.
- ❌ **No** agregues datos estructurados JSON-LD: no lo pide ningún NFR.
- ❌ **No** toques el service worker: es la historia 7.3.

### Comandos de verificación

```bash
# Las etiquetas están y las URLs son absolutas
grep -n "og:\|twitter:\|canonical" public/index.html

# La imagen existe y mide lo declarado
ls -la public/og-image.webp
python3 -c "
from PIL import Image
print(Image.open('public/og-image.webp').size)   # (1200, 630)
" 2>/dev/null || echo 'verificar dimensiones a mano'

# robots.txt no bloquea
cat public/robots.txt
```

En el navegador, en cada una de las cuatro rutas y en los dos idiomas:

```js
document.title
document.querySelector('meta[name="description"]').content

// Los og: son los mismos en las cuatro — es esperado
[...document.querySelectorAll('meta[property^="og:"]')].map(m => [m.getAttribute('property'), m.content])
```

Y después del deploy, el Post Inspector de LinkedIn sobre `https://marcecode.com`.

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; las etiquetas presentes
con URLs absolutas; la imagen existe, mide 1200×630 y muestra el diseño nuevo con texto legible; título y
descripción propios y traducidos en las cuatro rutas; `robots.txt` no bloquea; **la tarjeta validada con el
depurador de LinkedIn tras el deploy**.

### Project Structure Notes

```
public/index.html          MODIFICADO — Open Graph, Twitter Card, canonical
public/og-image.webp       NUEVO — 1200×630, hero del diseño nuevo
public/robots.txt          VERIFICAR — que no bloquee
src/locales/{es,en}.json   VERIFICAR — descripciones de 120–160 caracteres, distintas por ruta
```

### References

- Historia y criterios: [Source: epics.md#Story 7.2]
- D11, metadatos por ruta: [Source: architecture.md#Frontend Architecture]
- Brecha de la URL absoluta: [Source: architecture.md#Gap Analysis Results, brecha 7]
- NFR-19, NFR-20: [Source: prd.md#8.5 SEO y compartición]
- J1, llegada desde LinkedIn: [Source: prd.md#4.2]
- Sin backend ni SSR: [Source: prd.md#6.2 Fuera del alcance]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
