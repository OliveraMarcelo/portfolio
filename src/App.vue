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

  <button class="toggle-mode-btn" @click="toggleMode">
    {{ isDark ? '☀️ Light' : '🌙 Dark' }}
  </button>
</template>

<style lang="scss">
.toggle-mode-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background: var(--color-surface-raised);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  opacity: 0.85;
  transition: background-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}
.toggle-mode-btn:hover {
  background: var(--color-border);
  opacity: 1;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSprite from '@/components/layout/AppSprite.vue';
import AppNav from '@/components/layout/AppNav.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const { t } = useI18n();

/* PUENTE TEMPORAL — historia 1.2.
   La cascada `body.dark-mode` con !important se eliminó al portar los
   tokens, así que el toggle ya no tiene CSS al que engancharse. Se apunta
   a `data-theme` sobre <html>, que es el contrato de tokens.css.

   Esto NO es la historia 1.6: no hay persistencia en localStorage, no hay
   script inline previo al primer pintado, y no se consulta
   prefers-color-scheme. La 1.6 reemplaza este bloque por useTheme.js y
   ThemeToggle.vue, y borra este botón flotante. */

const isDark = ref(true);
const aplicarTema = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};
const toggleMode = () => {
  isDark.value = !isDark.value;
  aplicarTema();
};
onMounted(aplicarTema);
</script>
