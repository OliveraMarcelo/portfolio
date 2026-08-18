import { createRouter, createWebHistory } from 'vue-router'
import { ref, nextTick } from 'vue'
import i18n from '@/i18n'
import { movimientoReducido } from '@/composables/useReducedMotion'
import { bySlug } from '@/content/projects'

/* Los metadatos van por ruta y los aplica un guard `afterEach` (D11): en un
   solo lugar, en lugar de dispersarse como un `onMounted` en cuatro vistas.
   Que los títulos pasen por claves de i18n es lo que hace que la cobertura
   bilingüe alcance también al <title>, no solo al contenido visible. */

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { titleKey: 'meta.home.title', descriptionKey: 'meta.home.description' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { titleKey: 'meta.about.title', descriptionKey: 'meta.about.description' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsView.vue'),
    meta: { titleKey: 'meta.projects.title', descriptionKey: 'meta.projects.description' },
  },
  {
    /* La resolucion slug -> proyecto ocurre EXCLUSIVAMENTE aca (D5): el
       proyecto llega a la vista como prop, no como parametro de ruta.
       El `beforeEnter` ataja el slug inexistente antes de montar nada, asi
       que la vista no necesita un estado de "no encontrado". */
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('../views/ProjectDetailView.vue'),
    props: (route) => ({ project: bySlug(route.params.slug) }),
    beforeEnter: (to) => (bySlug(to.params.slug) ? true : { name: 'projects' }),
    meta: {
      /* Estos metadatos dependen del dato, no de la ruta: el titulo lleva el
         nombre del proyecto. Por eso son funciones, y el guard sabe
         invocarlas. */
      title: (ruta) => {
        const p = bySlug(ruta.params.slug)
        return p ? `${p.i18n[i18n.global.locale.value].title} — Marcelo Olivera` : null
      },
      description: (ruta) => bySlug(ruta.params.slug)?.i18n[i18n.global.locale.value].summary ?? null,
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,

  /* `savedPosition` viene poblado SOLO en navegacion por el historial —boton
     atras o adelante—; en una navegacion nueva llega null. Vue Router ya
     distingue los dos casos, no hay que detectarlo a mano.

     El `top: 80` del caso hash compensa la altura del header fijo: sin el, el
     destino queda tapado. */
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, top: 80 }
    if (!savedPosition) return { top: 0 }

    /* La restauracion NO puede ser sincrona, y tampoco alcanza con esperar
       un par de fotogramas.

       Con `return savedPosition` el navegador aplica la posicion antes de que
       la vista destino tenga altura, asi que RECORTA: medido, 590px guardados
       se restauraban en 171px — el maximo scroll de la vista a medio renderizar.

       Verificado que la View Transitions API NO es la causa: el recorte ocurre
       igual con la API anulada. La causa real son DOS retrasos distintos en el
       montaje de la vista destino: la propia transicion nativa, y el
       `mode="out-in"` del <Transition> de respaldo, que no monta la vista nueva
       hasta que termina la salida de la vieja.

       En lugar de adivinar cuanto esperar, se espera la CONDICION que importa:
       que el documento sea lo bastante alto para la posicion guardada. Con un
       techo de fotogramas para no colgarse si nunca lo es. */
    return new Promise((resolve) => {
      let intentos = 0
      const intentar = () => {
        const alcanzable = document.documentElement.scrollHeight - window.innerHeight
        if (alcanzable >= savedPosition.top || intentos > 40) {
          resolve(savedPosition)
          return
        }
        intentos += 1
        requestAnimationFrame(intentar)
      }
      nextTick(intentar)
    })
  },
})

/* Crea la etiqueta la primera vez y la reutiliza después: public/index.html
   no trae ningún <meta name="description">. */
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/* Exportada para que useLocale pueda reaplicarla al cambiar de idioma sin
   necesidad de navegar. Usa la INSTANCIA de i18n, no useI18n(): un guard no
   corre dentro del setup() de un componente. */
export function aplicarMetadatos(ruta = router.currentRoute.value) {
  const t = i18n.global.t

  /* Dos formas de declarar metadatos, porque hay dos casos reales: las rutas
     estaticas los tienen en una clave de i18n, y la de detalle los deriva del
     proyecto abierto. El guard resuelve las dos en lugar de tener un `if
     (to.name === 'project-detail')` que habria que ampliar en la proxima ruta
     dinamica. */
  const titulo = typeof ruta.meta?.title === 'function'
    ? ruta.meta.title(ruta)
    : (ruta.meta?.titleKey ? t(ruta.meta.titleKey) : null)

  const descripcion = typeof ruta.meta?.description === 'function'
    ? ruta.meta.description(ruta)
    : (ruta.meta?.descriptionKey ? t(ruta.meta.descriptionKey) : null)

  if (titulo) document.title = titulo
  if (descripcion) setMeta('description', descripcion)
}

/* `afterEach` y no `beforeEach`: si otro guard cancelara la navegación, con
   `beforeEach` ya habrías cambiado el título por una página a la que el
   visitante nunca llegó. */
/* Transicion entre vistas (D6, A6).

   El guard va en `beforeResolve` y NO en `beforeEach`: las vistas se cargan
   diferidas, y si la transicion arrancara antes de resolver el componente
   destino, la API capturaria el fotograma de una vista vacia. `beforeResolve`
   corre despues de que todos los componentes asincronos estan resueltos.

   El punto fino: `startViewTransition` espera una promesa que se resuelva
   CUANDO EL DOM YA CAMBIO. En una SPA con Vue, `next()` no actualiza el DOM
   de forma sincrona: la navegacion se confirma despues y Vue renderiza en su
   propio ciclo. Resolviendo la promesa con un doble rAF, la API se queda
   esperando y aborta con "Transition was aborted because of timeout in DOM
   update". La promesa se resuelve desde `afterEach` + `nextTick`, que es
   cuando Vue ya monto la vista nueva.

   La existencia de la API se chequea EN CADA navegacion, no una vez al crear
   el router: asi el camino de degradacion es probable anulando
   document.startViewTransition desde la consola. */
export const usarVistaNativa = ref(false)

function hayApi() {
  return typeof document.startViewTransition === 'function'
}

/* Resolver de la promesa que la API esta esperando. */
let avisarDomActualizado = null

router.beforeResolve((to, from, next) => {
  /* En la primera carga no hay desde donde transicionar. */
  if (!from.name || !hayApi() || movimientoReducido()) {
    usarVistaNativa.value = false
    next()
    return
  }

  usarVistaNativa.value = true
  const transicion = document.startViewTransition(() => {
    next()
    return new Promise((resolve) => { avisarDomActualizado = resolve })
  })

  transicion.finished
    .catch(() => { /* una transicion salteada no es un error para el visitante */ })
    .finally(() => { usarVistaNativa.value = false })
})

router.afterEach((to) => {
  aplicarMetadatos(to)
  /* La navegacion ya se confirmo; `nextTick` espera a que Vue haya volcado el
     DOM. Recien ahi la API puede capturar el fotograma nuevo. */
  if (avisarDomActualizado) {
    const avisar = avisarDomActualizado
    avisarDomActualizado = null
    nextTick(() => avisar())
  }
})

export default router
