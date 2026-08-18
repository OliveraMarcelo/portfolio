<template>
  <div>
    <section class="view-head" aria-labelledby="titulo-sobre-mi">
      <div class="container">
        <h1 class="view-title" id="titulo-sobre-mi">
          <span class="mask"
            ><span class="mask-in">{{ t('sobreMi.titulo') }}<span class="dot">.</span></span></span
          >
        </h1>
        <p class="view-lede mask">
          <span class="mask-in" style="--d: 70ms">{{ t('sobreMi.lede') }}</span>
        </p>

        <div class="view-actions" v-reveal="{ delay: 140 }">
          <AppButton variant="ghost" @click="downloadPdf">{{ t('hero.ctaCv') }}</AppButton>
        </div>
      </div>
    </section>

    <section class="section section-timeline" aria-labelledby="titulo-trayectoria">
      <div class="container">
        <SectionHeading
          id="titulo-trayectoria"
          :kicker="t('trayectoria.kicker')"
          :title="t('trayectoria.titulo')"
        />

        <TimelineSection :items="timeline" />
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="titulo-certificado">
      <div class="container">
        <SectionHeading
          id="titulo-certificado"
          :kicker="t('certificado.kicker')"
          :title="t('certificado.titulo')"
        >
          {{ t('certificado.nota') }}
        </SectionHeading>

        <figure class="cert-figure" v-reveal>
          <!-- Un <button> y no un <div> con @click: el div no es alcanzable
               por teclado, no responde a Enter ni a Espacio y no se anuncia
               como control. Serian tres fallos de NFR-08 en un elemento. -->
          <button ref="miniaturaRef" class="cert-trigger" type="button" @click="lightboxAbierto = true">
            <img
              class="cert-img"
              :src="certificado"
              :alt="t('certificado.alt')"
              width="1600"
              height="1161"
              loading="lazy"
              decoding="async"
            />
            <span class="cert-zoom" aria-hidden="true"><AppIcon name="external" /></span>
          </button>
          <figcaption class="cert-caption">{{ t('certificado.pie') }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="section" id="stack" aria-labelledby="titulo-stack">
      <div class="container">
        <SectionHeading id="titulo-stack" :title="t('habilidades.titulo')">
          {{ t('habilidades.lede') }}
        </SectionHeading>

        <SkillGrid :groups="skills" />
      </div>
    </section>

    <AppLightbox
      :abierto="lightboxAbierto"
      :label="t('certificado.alt')"
      :disparador="miniaturaRef"
      @cerrar="lightboxAbierto = false"
    >
      <!-- Sin `alt` descriptivo: el dialogo ya esta nombrado con el mismo
           texto por su `aria-label`, y repetirlo lo anunciaria dos veces. -->
      <img :src="certificado" alt="" width="1600" height="1161" decoding="async" />
    </AppLightbox>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineSection from '@/components/sections/TimelineSection.vue';
import AppLightbox from '@/components/ui/AppLightbox.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SkillGrid from '@/components/sections/SkillGrid.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import AppButton from '@/components/ui/AppButton.vue';
import useDownloadPdf from '@/composables/useDownloadPdf';
import { timeline } from '@/content/timeline';
import { skills } from '@/content/skills';
import certificado from '@/assets/img/certificado.webp';

/* El IntersectionObserver local que agregaba `.loaded` se elimino: lo
   reemplaza v-reveal (D7). Las habilidades llegan en la historia 5.4. */

const { t } = useI18n();
/* El mismo composable que el hero (FR-20): la logica de descarga y el nombre
   del archivo viven en un solo lugar. */
const { downloadPdf } = useDownloadPdf();
const lightboxAbierto = ref(false);
const miniaturaRef = ref(null);
</script>

<style scoped>
.view-actions { margin-top: var(--space-8); }

.cert-figure { margin: 0; }

.cert-trigger {
  display: block;
  position: relative;
  width: 100%;
  max-width: 720px;
  padding: 0;
  background: none;
  border: 0;
  border-radius: var(--radius-lg);
  cursor: zoom-in;
  transition: transform var(--dur-base) var(--ease-out);
}

.cert-trigger:hover { transform: scale(1.02); }
.cert-trigger:active { transform: scale(0.99); }

.cert-img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.cert-zoom {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-bg) 78%, transparent);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-spring);
}

.cert-trigger:hover .cert-zoom,
.cert-trigger:focus-visible .cert-zoom { opacity: 1; transform: none; }

.cert-caption {
  margin-top: 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}
</style>
