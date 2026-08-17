# Story 7.3: Nadie se queda con la versión vieja

Status: ready-for-dev

## Story

As a visitante que ya conocía el sitio,
I want ver el diseño nuevo sin tener que limpiar el caché,
so that no me quede una versión desactualizada.

## Acceptance Criteria

**AC1 — Aviso de versión nueva**

**Given** `src/registerServiceWorker.js`
**When** el evento `updated(registration)` se dispara
**Then** emite un evento que `App.vue` escucha para mostrar un aviso no bloqueante de versión nueva (NFR-21)

**AC2 — Aceptar el aviso actualiza**

**Given** el aviso visible
**When** el visitante lo acepta
**Then** se envía `SKIP_WAITING` al service worker y la página se recarga con la versión nueva

**AC3 — Cabeceras correctas**

**Given** `nginx.conf`
**When** se revisan sus cabeceras
**Then** `index.html` y `service-worker.js` se sirven con `Cache-Control: no-cache`
**And** los assets con hash conservan `expires 1y, immutable`
**And** se declara `Referrer-Policy: strict-origin-when-cross-origin`

**AC4 — Consola limpia**

**Given** el sitio en producción
**When** se abre la consola del navegador
**Then** no hay ninguna salida (M7)

**AC5 — Cero orígenes externos**

**Given** el sitio cargado
**When** se revisa la pestaña de red
**Then** ninguna petición apunta a un host distinto de marcecode.com (D14)

## Tasks / Subtasks

- [ ] **Tarea 1 — Emitir el evento de actualización** (AC: #1)
  - [ ] En `registerServiceWorker.js`, en el handler `updated(registration)`, despachar un `CustomEvent` con la `registration` en el detalle
  - [ ] Conservar los `console.log` restantes condicionados a `NODE_ENV !== 'production'`, como quedó en la historia 1.1

- [ ] **Tarea 2 — El aviso en `App.vue`** (AC: #1, #2)
  - [ ] Escuchar el evento y mostrar un aviso **no bloqueante**: no un modal, no un overlay
  - [ ] Un botón para actualizar y otro para descartar
  - [ ] Texto por i18n
  - [ ] Área táctil ≥ 44×44 px y alcanzable por teclado
  - [ ] Usar los tokens; sin colores literales

- [ ] **Tarea 3 — Aplicar la actualización** (AC: #2)
  - [ ] Enviar `{ type: 'SKIP_WAITING' }` al worker en espera
  - [ ] Recargar cuando el worker nuevo tome control, no antes (ver §El orden de `SKIP_WAITING` y la recarga)
  - [ ] Guardar contra el bucle de recarga

- [ ] **Tarea 4 — Cabeceras de nginx** (AC: #3)
  - [ ] `location = /index.html` y `location = /service-worker.js` con `Cache-Control: no-cache`
  - [ ] Verificar que el bloque de assets con hash conserve `expires 1y, immutable`
  - [ ] Agregar `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] Considerar la CSP de solo-mismo-origen, viable ahora que no hay terceros (ver §La CSP es opcional pero ya es gratis)

- [ ] **Tarea 5 — Auditar la consola y la red** (AC: #4, #5)
  - [ ] Recorrer las cuatro vistas con el build de producción y confirmar consola vacía
  - [ ] Confirmar que ninguna petición sale del propio origen

- [ ] **Tarea 6 — Verificar el ciclo completo** (AC: #1, #2)
  - [ ] Probar el flujo de actualización de verdad, con dos builds (ver §Cómo probar la actualización)

## Dev Notes

**D12 en la arquitectura: actualización del service worker con aviso al usuario.** Un rediseño total invalida
el caché de todos los visitantes recurrentes; con el comportamiento actual verían el diseño viejo hasta
cerrar todas las pestañas. Además, los `console.log` incondicionales de hoy contradicen literalmente M7.
[Source: architecture.md#Frontend Architecture, D12]

Es la historia más importante de la Épica 7 en términos de impacto real: sin ella, el rediseño se despliega y
la gente que ya visitó el sitio no lo ve.

### Por qué el service worker actual deja a la gente atrás

`registerServiceWorker.js` tiene hoy esto:

```js
updated () {
  console.log('New content is available; please refresh.')
}
```

Un `console.log`. El visitante no lo ve. Workbox descarga la versión nueva, la deja en estado *waiting*, y el
worker viejo sigue sirviendo el caché viejo **hasta que se cierren todas las pestañas del sitio**. En la
práctica, mucha gente no cierra nunca la pestaña.

Resultado: desplegás el rediseño y quien ya conocía el sitio sigue viendo el anterior, sin ninguna forma de
enterarse.

### El orden de `SKIP_WAITING` y la recarga

Esta es la parte que se implementa mal con más frecuencia. El error típico:

```js
// ❌ recarga antes de que el worker nuevo tome control
registration.waiting.postMessage({ type: 'SKIP_WAITING' })
window.location.reload()
```

`postMessage` es asíncrono. La recarga ocurre mientras el worker viejo todavía controla la página, así que
el navegador vuelve a servir el caché viejo y el visitante ve **lo mismo** después de haber aceptado
actualizar. Peor que no ofrecerlo.

El orden correcto es esperar el cambio de control:

```js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (recargando) return
  recargando = true
  window.location.reload()
})

registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
```

La bandera `recargando` es la guarda contra el bucle: sin ella, `controllerchange` puede dispararse de nuevo
tras la recarga y entrar en un ciclo de recargas que hace el sitio inusable.

**Verificá el flujo completo con dos builds.** No alcanza con que compile.

### Cómo probar la actualización

Con un solo build no se puede probar: hace falta que haya una versión vieja cacheada y una nueva disponible.

```bash
# 1. Build y servir
npm run build
npx serve -s dist -l 8080

# 2. Abrir http://localhost:8080, esperar a que el SW se registre
#    (Application → Service Workers → activated and running)

# 3. Cambiar algo visible del código y volver a buildear
npm run build

# 4. Recargar la página abierta.
#    El SW nuevo debe quedar en "waiting" y el aviso debe aparecer.

# 5. Aceptar el aviso: la página recarga con el diseño nuevo.
```

En DevTools → Application → Service Workers, mirá los estados. Si el nuevo queda en *waiting* y el aviso no
aparece, el evento no está llegando. Si aceptás y no cambia nada, el orden de `SKIP_WAITING` y la recarga
está mal.

**No dejes esta prueba para después del deploy.** Es reproducible en local y en producción es el peor lugar
para descubrir que no funciona.

### El aviso no puede ser bloqueante

Un modal que tapa la página para anunciar una versión nueva es hostil: el visitante vino a ver el portfolio,
no a administrar cachés. Un aviso discreto al pie o en una esquina, con dos botones, alcanza.

Y tiene que ser descartable. Si alguien lo cierra, no vuelve a aparecer en esa sesión.

Cuidado con no romper lo ganado en otras historias: el aviso es un elemento nuevo en el layout, así que
verificá que no tape el pie en 390 px, que no produzca CLS al aparecer —posición fija, fuera del flujo— y
que sea alcanzable por teclado con foco visible.

### Las cabeceras: `no-cache` no es `no-store`

```nginx
location = /index.html {
    add_header Cache-Control "no-cache";
}
location = /service-worker.js {
    add_header Cache-Control "no-cache";
}
```

`no-cache` **permite** cachear pero obliga a revalidar con el servidor antes de usar la copia. Es lo que
querés: la respuesta 304 es barata y garantiza que nunca se sirva un `index.html` viejo que apunte a bundles
que ya no existen.

`no-store` prohíbe cachear por completo. Es más agresivo de lo necesario y desperdicia la revalidación.

`nginx.conf` hoy **no declara nada** para `index.html`: cae en el `location /` sin `expires`, así que el
navegador aplica heurística y puede cachearlo. Eso es exactamente lo que hace que el aviso de actualización
no funcione.

El bloque de assets con hash **se queda como está**: `expires 1y, immutable` es correcto para archivos cuyo
nombre cambia con el contenido.

### La CSP es opcional pero ya es gratis

Con D14 cumplido —sin Google Fonts (1.3), sin el worker de PDF.js (1.1), sin Font Awesome (1.4)— el sitio no
pide nada a ningún host externo. Eso hace que una CSP restrictiva sea trivial:

```nginx
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'";
```

Dos advertencias: el `'unsafe-inline'` en `script-src` es necesario por el script inline de tema e idioma
(D2), y el de `style-src` por los estilos inline de Vue. Sin ellos, el sitio se rompe.

La arquitectura la menciona como ajuste puntual, no como requisito de ningún NFR. **Si la agregás, probá el
sitio completo después**: una CSP mal escrita rompe cosas de formas difíciles de diagnosticar. Si tenés dudas,
dejala para otra vez.

### Guardarraíles

- ❌ **No** recargues sin esperar `controllerchange`.
- ❌ **No** omitas la guarda contra el bucle de recarga.
- ❌ **No** hagas el aviso bloqueante ni modal.
- ❌ **No** uses `no-store` donde va `no-cache`.
- ❌ **No** toques el `expires 1y, immutable` de los assets con hash.
- ❌ **No** desregistres el service worker ni desactives el PWA: NFR-21 pide conservarlo.
- ❌ **No** cambies el favicon: NFR-21 pide conservar el actual (`</>`).
- ❌ **No** dejes ningún `console.*` sin condicionar.
- ❌ **No** agregues una CSP sin probar el sitio completo después.
- ❌ **No** cierres la historia sin haber probado el ciclo con dos builds.

### Comandos de verificación

```bash
# Sin console sin condicionar
grep -rn "console\." src/ | grep -v "NODE_ENV"

# Cabeceras declaradas
grep -n "Cache-Control\|Referrer-Policy\|immutable" nginx.conf

# Nada apunta a un host externo
grep -rn "https\?://" src/ public/index.html | grep -v "marcecode.com\|schema.org\|w3.org"
```

En el navegador, con el build de producción:

```js
// Consola vacía: mirar el panel, no ejecutar nada

// Estado del service worker
navigator.serviceWorker.getRegistrations().then(r => console.log(r))

// Cero peticiones externas: pestaña de red, columna Domain,
// filtrar por "3rd-party requests"
```

Y con `curl` sobre el sitio desplegado:

```bash
curl -sI https://marcecode.com/ | grep -i cache-control          # no-cache
curl -sI https://marcecode.com/service-worker.js | grep -i cache-control   # no-cache
curl -sI https://marcecode.com/js/app.<hash>.js | grep -i cache-control    # immutable
```

### Testing standards

Sin pruebas automatizadas (diferido). Verificación observable: build y lint limpios; **el ciclo de
actualización probado con dos builds en local, de punta a punta**; el aviso aparece, es descartable, no
bloquea y no produce CLS; aceptar recarga con la versión nueva y sin bucle; las cabeceras verificadas con
`curl`; consola vacía en producción; cero peticiones externas en la pestaña de red; el favicon `</>` intacto.

### Project Structure Notes

```
src/registerServiceWorker.js    MODIFICADO — emite el evento de actualización
src/App.vue                     MODIFICADO — aviso de versión nueva
nginx.conf                      MODIFICADO — no-cache, Referrer-Policy, CSP opcional
src/locales/{es,en}.json        MODIFICADO — texto del aviso
```

### References

- Historia y criterios: [Source: epics.md#Story 7.3]
- D12, actualización del service worker: [Source: architecture.md#Frontend Architecture]
- D14, cero orígenes de terceros: [Source: architecture.md#Authentication & Security]
- Ajustes de nginx: [Source: architecture.md#Infrastructure & Deployment]
- NFR-21: [Source: prd.md#8.5]
- M7, cero errores de consola: [Source: prd.md#5 Métricas de éxito]
- Condicionado de los logs: historia 1.1, tarea 5

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
