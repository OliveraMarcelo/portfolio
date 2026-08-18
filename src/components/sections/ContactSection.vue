<template>
  <section class="section section-alt" id="contacto" aria-labelledby="titulo-contacto">
    <div class="container">
      <SectionHeading id="titulo-contacto" :title="t('contacto.titulo')">
        {{ t('contacto.lede') }}
      </SectionHeading>

      <ul class="contact-list">
        <li v-for="(canal, i) in channels" :key="canal.id">
          <!-- La card ENTERA es el enlace. Con un <a> chico adentro, el
               visitante ve una card grande que invita al clic y descubre que
               solo funciona sobre el texto — y el objetivo tactil pasa a ser
               la altura de una linea, muy por debajo de los 44px. -->
          <a
            class="contact-card"
            v-reveal="{ delay: i * 70 }"
            :href="canal.href"
            v-bind="atributosDeEnlace(canal)"
            :aria-label="textos(canal).aria"
          >
            <AppIcon :name="canal.icon" size="lg" />
            <span class="contact-label">{{ textos(canal).label }}</span>
            <span class="contact-value">{{ canal.value }}</span>
            <AppIcon class="contact-arrow" name="arrow" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import { atributosDeEnlace } from '@/content/contact';

/* Sin formulario, y no por simplificar: FR-24 pide enlaces directos y el PRD
   excluye del alcance el backend. Un formulario sin backend necesitaria un
   servicio de terceros —Formspree, EmailJS— que ademas contradice D14. */

defineProps({
  channels: { type: Array, required: true },
});

const { t, locale } = useI18n();

const textos = (canal) => canal.i18n[locale.value] ?? canal.i18n.es;
</script>
