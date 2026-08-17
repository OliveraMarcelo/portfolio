/* Directiva `v-reveal` (A2, D7).

   UN solo IntersectionObserver de modulo para todo el sitio. El patron
   alternativo —uno por componente— multiplica los callbacks de layout durante
   el scroll y es el camino mas corto a perder los 60 fps de NFR-03.

   Uso:
     <section v-reveal>                    revelado simple
     <div v-reveal="{ delay: 140 }">       con retardo, para escalonar
*/

const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)');

let observer = null;

function obtenerObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      /* `unobserve` no es opcional: sin el, el observer sigue notificando el
         elemento en cada cruce del umbral durante todo el scroll. Con veinte
         elementos revelados son veinte callbacks inutiles por movimiento. */
      observer.unobserve(entrada.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  return observer;
}

export default {
  mounted(el, binding) {
    el.classList.add('reveal');

    const retardo = binding.value?.delay;
    if (retardo) el.style.setProperty('--d', `${retardo}ms`);

    /* Con movimiento reducido, o sin soporte de IntersectionObserver, el
       contenido se muestra de inmediato y no se observa nada. */
    if (REDUCIDO.matches || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    obtenerObserver().observe(el);
  },

  unmounted(el) {
    /* Si la vista se desmonta con elementos aun no revelados, el observer se
       quedaria con referencias a nodos que ya no estan en el documento. */
    observer?.unobserve(el);
  },
};
