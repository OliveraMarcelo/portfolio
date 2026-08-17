<template>
  <button
    class="icon-btn theme-btn"
    type="button"
    :aria-label="etiqueta"
    @click="toggleTheme"
  >
    <!-- Los dos íconos están siempre en el DOM, superpuestos en la misma
         celda de grilla. El cruce lo hace el CSS del sistema animando
         opacidad y rotación (A7), no un v-if: con v-if no habría nada que
         animar entre un estado y el otro. -->
    <AppIcon class="ico-moon" name="moon" />
    <AppIcon class="ico-sun" name="sun" />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/ui/AppIcon.vue';
import { useTheme } from '@/composables/useTheme';

const { t } = useI18n();
const { theme, toggleTheme } = useTheme();

/* La etiqueta describe ADÓNDE lleva el botón, no dónde estás: quien lo
   escucha necesita saber qué va a pasar si lo activa. */
const etiqueta = computed(() => (theme.value === 'light' ? t('themeToDark') : t('themeToLight')));
</script>
