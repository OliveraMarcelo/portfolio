import { ref, readonly } from 'vue';

/* Estado global de tema. Singleton por `ref` de modulo, sin Pinia (D3): el
   estado global del sitio son exactamente dos valores enumerados, y Pinia
   aportaria devtools, modulos y SSR-safety — ninguno con uso aca — a cambio
   de una dependencia mas en el bundle critico.

   Clave de localStorage: `mc-theme`. TIENE que ser identica a la que usa el
   script inline de public/index.html; si divergen, el sintoma es un destello
   en cada carga sin ningun error en consola. */

export const CLAVE = 'mc-theme';
const VALIDOS = ['dark', 'light'];

const raiz = document.documentElement;

/* El DOM es la fuente de verdad, no una variable paralela. El ref se
   INICIALIZA leyendo el atributo que el script inline ya dejo puesto; no
   vuelve a consultar localStorage ni prefers-color-scheme. Si lo recalculara
   por su cuenta habria dos fuentes que pueden discrepar, y el sintoma seria
   un parpadeo al montar la app que nadie sabria explicar. */
const temaDelDom = () => (raiz.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

const theme = ref(temaDelDom());

function leerGuardado() {
  try {
    const v = localStorage.getItem(CLAVE);
    return VALIDOS.includes(v) ? v : null;
  } catch (e) {
    return null; // modo privado de Safari: el mero acceso lanza
  }
}

function aplicar(valor) {
  raiz.setAttribute('data-theme', valor);
  theme.value = valor;
}

function setTheme(valor, persistir = true) {
  if (!VALIDOS.includes(valor)) return;
  aplicar(valor);
  if (persistir) {
    try { localStorage.setItem(CLAVE, valor); } catch (e) { /* noop */ }
  }
}

function toggleTheme() {
  setTheme(theme.value === 'light' ? 'dark' : 'light');
}

/* Seguir al sistema, pero solo hasta que el usuario opine.
   Si nunca toco el boton, el sitio acompaña los cambios del sistema en vivo.
   En cuanto alterna manualmente una vez, su eleccion manda para siempre.

   El cambio del sistema NO se persiste: si lo hiciera, el visitante quedaria
   atado a lo que su sistema hacia en ese momento, sin haber elegido nada. */
const consultaSistema = window.matchMedia('(prefers-color-scheme: light)');
const alCambiarSistema = (e) => {
  if (!leerGuardado()) setTheme(e.matches ? 'light' : 'dark', false);
};
if (typeof consultaSistema.addEventListener === 'function') {
  consultaSistema.addEventListener('change', alCambiarSistema);
}

export function useTheme() {
  return { theme: readonly(theme), setTheme, toggleTheme };
}
