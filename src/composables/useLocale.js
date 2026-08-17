import { ref, readonly } from 'vue';
import i18n from '@/i18n';

/* Estado global de idioma. Reemplaza a src/stores/langStore.js, que estaba
   roto por construccion: llamaba a useI18n() desde una funcion exportada que
   puede invocarse en cualquier contexto, cuando useI18n() solo es valido
   dentro del setup() de un componente. Ademas mantenia un state.locale
   paralelo al locale de vue-i18n, o sea dos fuentes de verdad.

   Aca se importa la INSTANCIA de i18n, no el hook. Asi el composable
   funciona desde cualquier lado, incluido un guard del router — que es lo
   que la historia 2.1 necesita para retraducir el titulo del documento.

   Clave de localStorage: `mc-lang`. Identica a la del script inline. */

export const CLAVE = 'mc-lang';
const VALIDOS = ['es', 'en'];

const raiz = document.documentElement;

/* Igual que useTheme: el DOM es la fuente de verdad. El ref se inicializa
   desde el atributo que el script inline dejo puesto. */
const locale = ref(raiz.getAttribute('lang') === 'en' ? 'en' : 'es');

function setLocale(valor, persistir = true) {
  if (!VALIDOS.includes(valor)) return;
  i18n.global.locale.value = valor;
  raiz.setAttribute('lang', valor);
  locale.value = valor;
  if (persistir) {
    try { localStorage.setItem(CLAVE, valor); } catch (e) { /* noop */ }
  }
}

function toggleLocale() {
  setLocale(locale.value === 'es' ? 'en' : 'es');
}

export function useLocale() {
  return { locale: readonly(locale), setLocale, toggleLocale };
}
