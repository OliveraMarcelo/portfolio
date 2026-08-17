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

      <!-- Los canales se conservan acá para no perder FR-25 mientras la
           seccion de contacto no existe. La historia 6.1 crea
           src/content/contact.js y la 6.3 los cablea a ese modulo. -->
      <ul class="footer-canales">
        <li v-for="c in canales" :key="c.id">
          <a
            class="icon-btn"
            :href="c.href"
            :target="c.externo ? '_blank' : null"
            :rel="c.externo ? 'noopener noreferrer' : null"
            :aria-label="t(c.clave)"
          >
            <AppIcon :name="c.icono" />
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

const { t } = useI18n();

/* Valores literales por ahora: la historia 6.1 los mueve a
   src/content/contact.js y la 6.3 hace que este componente los lea de ahí.
   `externo: false` en el email a proposito: mailto: no abre una pestaña, y
   con target="_blank" quedaria una en blanco huerfana. */
const canales = [
  { id: 'whatsapp', href: 'https://wa.me/541134323271', externo: true, icono: 'whatsapp', clave: 'footer.whatsapp' },
  { id: 'email', href: 'mailto:olivera.m.et13@gmail.com', externo: false, icono: 'mail', clave: 'footer.email' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/marcelodanielolivera/', externo: true, icono: 'linkedin', clave: 'footer.linkedin' },
];
</script>

<style scoped>
/* Unica clase propia de este componente: el sistema no define una lista de
   canales en el pie porque su pie canonico no los tiene. */
.footer-canales {
  display: flex;
  gap: 0.25rem;
}
</style>
