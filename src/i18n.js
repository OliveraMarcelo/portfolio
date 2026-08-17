import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

/* Reducido a la creacion de la instancia (D13). Los textos de interfaz viven
   en src/locales/{es,en}.json; los de contenido —proyectos, trayectoria,
   habilidades— van a src/content/* en las historias 4.1 y 5.1.
   Son dos ciclos de vida distintos: las etiquetas cambian cuando cambia el
   diseño, el contenido cuando Marcelo suma un proyecto.

   El locale inicial se lee del atributo `lang` que el script inline de
   public/index.html ya dejo puesto, no de localStorage: una sola fuente. */

const inicial = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';

const i18n = createI18n({
  legacy: false,
  locale: inicial,
  fallbackLocale: 'en',
  messages: { es, en },
});

export default i18n;
