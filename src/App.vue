<template>
  <AppSprite />

  <!-- Primer elemento enfocable, ANTES del header: si fuera después, quien
       navega por teclado tendría que atravesar todo el nav para encontrar el
       atajo que existe justamente para evitarlo. -->
  <a class="skip-link" href="#main">{{ t('skipLink') }}</a>

  <AppNav />

  <main id="main">
    <router-view />
  </main>

  <AppFooter />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppSprite from '@/components/layout/AppSprite.vue';
import AppNav from '@/components/layout/AppNav.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const { t } = useI18n();

/* El puente temporal de tema de la historia 1.2 —el botón flotante y el
   `data-theme` aplicado al montar— se eliminó acá: lo reemplazan el script
   inline de public/index.html, useTheme.js y ThemeToggle.vue. */
</script>
