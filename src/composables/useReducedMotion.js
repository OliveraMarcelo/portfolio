import { ref, readonly } from 'vue';

/* Origen UNICO de verdad para prefers-reduced-motion.

   Lo consumen la transicion de ruta (2.6), el elemento compartido (4.6), el
   progreso de la linea de tiempo (5.2) y la verificacion de la 7.6. Si cada
   uno consultara matchMedia por su cuenta habria varias lecturas que pueden
   discrepar —sobre todo si el visitante cambia la preferencia con la pestaña
   abierta— y el sitio quedaria a medio quieto. La arquitectura lo registra
   como dependencia cruzada D6 <-> D7. */

const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducido = ref(consulta.matches);

/* Escucha el cambio: si el visitante ajusta la preferencia del sistema con la
   pestaña abierta, el sitio reacciona. */
if (typeof consulta.addEventListener === 'function') {
  consulta.addEventListener('change', (e) => { reducido.value = e.matches; });
}

export function useReducedMotion() {
  return { reducido: readonly(reducido) };
}

/* Lectura sincrona, para los guards del router: no corren en un setup(). */
export function movimientoReducido() {
  return reducido.value;
}
