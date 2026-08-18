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
   servicio de terceros —Formspree, EmailJS— que ademas contradice D14.

   Las cards NO llevan aria-label. Lo tenian —"Escribime por WhatsApp"— y
   Lighthouse lo marco: WCAG 2.5.3 (Label in Name) pide que el nombre
   accesible CONTENGA el texto visible, y "Escribime por WhatsApp" no contiene
   "+54 11 3432-3271". Quien maneja el sitio por voz dice lo que ve y el
   comando no encuentra el control.

   Sin el atributo, el nombre accesible sale del contenido —"WhatsApp
   +54 11 3432-3271"— y coincide exactamente con lo que se ve. Los iconos del
   pie SI conservan su aria-label porque no tienen texto visible, y ahi 2.5.3
   no aplica. */

defineProps({
  channels: { type: Array, required: true },
});

const { t, locale } = useI18n();

const textos = (canal) => canal.i18n[locale.value] ?? canal.i18n.es;
</script>
