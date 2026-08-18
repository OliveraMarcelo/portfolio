<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <!-- `custom` por el mismo motivo que en AppNav: el logo no debe
           anunciar aria-current. -->
      <RouterLink v-slot="{ href, navigate }" to="/" custom>
        <a class="logo logo-sm" :href="href" :aria-label="t('a11y.logo')" @click="navigate">
          <span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>
          <span class="logo-word">MarceCode</span>
        </a>
      </RouterLink>

      <!-- FR-25: los tres canales al pie de las cuatro vistas, asi el
           contacto nunca esta a mas de un gesto. Los datos salen del modulo
           y los atributos del enlace de la misma funcion que usa la seccion
           de contacto: si el pie los derivara por su cuenta, el mailto:
           abriria una pestaña en blanco en un lugar y no en el otro. -->
      <ul class="footer-canales">
        <li v-for="canal in contact" :key="canal.id">
          <a
            class="icon-btn"
            :href="canal.href"
            v-bind="atributosDeEnlace(canal)"
            :aria-label="textos(canal).aria"
          >
            <AppIcon :name="canal.icon" />
          </a>
        </li>
      </ul>

      <p class="footer-meta">
        <span>2026</span>
        <span class="footer-sep" aria-hidden="true">·</span>
        <span>{{ t('footer.made') }}</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/ui/AppIcon.vue';
import { contact, atributosDeEnlace } from '@/content/contact';

const { t, locale } = useI18n();

const textos = (canal) => canal.i18n[locale.value] ?? canal.i18n.es;
</script>

<style scoped>
/* Unica clase propia de este componente: el sistema no define una lista de
   canales en el pie porque su pie canonico no los tiene. */
.footer-canales {
  display: flex;
  gap: 0.25rem;
}
</style>
