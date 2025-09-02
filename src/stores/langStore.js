import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const state = reactive({
  locale: 'es',
});

export function useLangStore() {
  const { locale } = useI18n();

  function switchLang() {
    state.locale = state.locale === 'es' ? 'en' : 'es';
    locale.value = state.locale;
  }

  return {
    locale: state,
    switchLang,
  };
}
