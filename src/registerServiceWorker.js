/* eslint-disable no-console */

import { register } from 'register-service-worker'

const isDev = process.env.NODE_ENV !== 'production'
const log = (...args) => { if (isDev) console.log(...args) }

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      log('Service worker has been registered.')
    },
    cached () {
      log('Content has been cached for offline use.')
    },
    updatefound () {
      log('New content is downloading.')
    },
    updated (registration) {
      log('New content is available; please refresh.')
      /* Un console.log no lo ve nadie. Workbox deja la version nueva en
         estado `waiting` y el worker viejo sigue sirviendo el cache viejo
         HASTA QUE SE CIERREN TODAS LAS PESTAÑAS del sitio — y mucha gente no
         cierra nunca la pestaña. Sin este aviso, el rediseno se despliega y
         quien ya conocia el sitio sigue viendo el anterior sin forma de
         enterarse (NFR-21, D12).

         Se emite un evento en lugar de importar App.vue: el registro corre
         fuera del arbol de componentes. */
      window.dispatchEvent(new CustomEvent('mc:sw-actualizado', { detail: registration }))
    },
    offline () {
      log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      // Un fallo real de registro sigue siendo visible: no es ruido.
      console.error('Error during service worker registration:', error)
    }
  })
}
