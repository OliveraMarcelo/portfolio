import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
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
  if (ruta.meta?.titleKey) document.title = t(ruta.meta.titleKey)
  if (ruta.meta?.descriptionKey) setMeta('description', t(ruta.meta.descriptionKey))
}

/* `afterEach` y no `beforeEach`: si otro guard cancelara la navegación, con
   `beforeEach` ya habrías cambiado el título por una página a la que el
   visitante nunca llegó. */
router.afterEach((to) => aplicarMetadatos(to))

export default router
