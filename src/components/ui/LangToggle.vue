<template>
  <button class="lang-btn" type="button" @click="toggleLocale">
    <span class="lang-current">{{ locale.toUpperCase() }}</span>
    <span class="lang-sep" aria-hidden="true">/</span>
    <span class="lang-other">{{ otro.toUpperCase() }}</span>
    <span class="sr-only">{{ t('lang.aria') }}</span>
  </button>
</template>

<script setup>
/* El nombre accesible sale del CONTENIDO y no de un `aria-label`.

   Con `aria-label` el boton fallaba WCAG 2.5.3 (Label in Name): la regla pide
   que el nombre accesible contenga el texto visible, y "Switch site language
   to English" no contiene "ES / EN". Quien maneja el sitio por voz dice lo
   que ve, y el comando no encontraba el control. Anteponer el texto visible
   al aria-label tampoco alcanzo — la comparacion no es literal.

   Con un `.sr-only` dentro del boton, el nombre se compone del mismo recorrido
   del DOM del que sale el texto visible, asi que contenerlo es automatico:
   "ES / EN Switch site language to English".

   El texto describe LA ACCION y por eso esta en el idioma de destino: en el
   diccionario español dice "Switch to English". No es un descuido. */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';

const { t } = useI18n();
const { locale, toggleLocale } = useLocale();

const otro = computed(() => (locale.value === 'es' ? 'en' : 'es'));
</script>
