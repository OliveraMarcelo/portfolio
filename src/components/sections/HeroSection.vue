<template>
  <section class="hero">
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="hero-inner">
      <div class="hero-copy">
        <p class="hero-kicker mask">
          <span class="mask-in" style="--d: 0ms">{{ t('hero.kicker') }}</span>
        </p>

        <h1 class="hero-title">
          <span class="mask"><span class="mask-in" style="--d: 70ms">Marcelo</span></span>
          <span class="mask"><span class="mask-in" style="--d: 140ms">Olivera</span></span>
        </h1>

        <p class="hero-role mask">
          <span class="mask-in" style="--d: 210ms">
            <em>{{ t('hero.roleAccent') }}</em> <span>{{ t('hero.roleRest') }}</span>
          </span>
        </p>

        <p class="hero-lede reveal" style="--d: 300ms" v-reveal>{{ t('hero.lede') }}</p>

        <!-- Exactamente UNA accion primaria y UNA secundaria (FR-06). El PRD
             identifica la jerarquia plana como el problema P3; un tercer boton
             la reintroduce. -->
        <div class="hero-actions reveal" style="--d: 360ms" v-reveal>
          <AppButton to="/projects">{{ t('hero.ctaProjects') }}</AppButton>
          <AppButton variant="ghost" @click="downloadPdf">{{ t('hero.ctaCv') }}</AppButton>
        </div>

        <ul class="chips chips-sm" :aria-label="t('hero.stackAria')">
          <li v-for="(tec, i) in stack" :key="tec" v-reveal :style="{ '--d': `${420 + i * 60}ms` }">
            <span class="chip">{{ tec }}</span>
          </li>
        </ul>
      </div>

      <div class="hero-portrait">
        <figure class="portrait">
          <img
            :src="retrato"
            :alt="t('hero.portraitAlt')"
            width="640"
            height="640"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </div>

    <ScrollCue />
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/ui/AppButton.vue';
import ScrollCue from '@/components/ui/ScrollCue.vue';
import useDownloadPdf from '@/composables/useDownloadPdf';
import retrato from '@/assets/img/retrato.webp';

const { t } = useI18n();
const { downloadPdf } = useDownloadPdf();

/* Stack principal del hero. Va como array y no como texto literal en el
   template (NFR-16). La historia 4.1 crea src/content/ y este dato podria
   mudarse ahi si se decide que es contenido y no configuracion de la vista. */
const stack = ['Vue', 'Flutter', 'TypeScript', 'Node.js'];
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  /* `#main` despeja el header fijo con un padding-top de --header-h, pero el
     hero YA reserva ese espacio en su propio padding-block y esta disenado
     para pasar por debajo del header transparente. Sin cancelarlo los 72px se
     cuentan dos veces y el `min-height: 100svh` desborda el viewport: medido,
     los chips del stack quedaban 9px bajo el pliegue a 1280x800, lo que
     violaba FR-05. */
  margin-top: calc(var(--header-h) * -1);
  display: flex;
  align-items: center;
  padding-block: calc(var(--header-h) + var(--space-16)) var(--space-16);
  isolation: isolate;
}

/* A1 declara 900ms de duracion TOTAL para el gesto de entrada, y el
   escalonado del prototipo se pasaba: con --dur-hero (900ms) por elemento mas
   70ms de paso, la ultima linea del titulo terminaba a los 1110ms — medido.

   Se acorta la duracion de los elementos de A1 a --dur-slow, que conserva el
   escalonado que A1 describe y deja el gesto en 810ms para el texto y 780ms
   para el retrato. No es una desviacion del sistema: es corregir el prototipo
   contra el numero que su propia especificacion declara. */
.hero .mask-in,
.hero .portrait,
.hero .hero-glow {
  transition-duration: var(--dur-slow);
}

.hero-glow {
  position: absolute;
  z-index: -1;
  top: 58%;
  left: 50%;
  width: min(560px, 90vw);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at center,
              color-mix(in srgb, var(--color-accent) 42%, transparent) 0%,
              color-mix(in srgb, var(--color-accent) 12%, transparent) 42%,
              transparent 70%);
  filter: blur(60px);
  opacity: 0;
  transition: opacity var(--dur-hero) var(--ease-out) 200ms;
}

.is-loaded .hero-glow { opacity: 0.62; }

[data-theme="light"] .hero-glow { filter: blur(70px); }

[data-theme="light"] .is-loaded .hero-glow { opacity: 0.3; }

.hero-inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
  display: grid;
  gap: var(--space-16);
  align-items: center;
}

.hero-kicker {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-size: var(--text-hero);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  text-wrap: nowrap;
}

/* Headroom para que `line-height: .95` no recorte las mayusculas dentro
   del overflow del contenedor de mascara. El margen negativo lo compensa. */
.hero-title .mask {
  display: block;
  padding-top: 0.1em;
  margin-top: -0.1em;
  padding-bottom: 0.04em;
}

.hero-role {
  margin-top: 0.875rem;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-text-muted);
}

.hero-role em { font-style: normal; color: var(--color-accent); }

.hero-lede {
  margin-top: 1.25rem;
  max-width: 46ch;
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: var(--space-8);
}

.hero-portrait { display: flex; justify-content: center; }

.portrait {
  position: relative;
  margin: 0;
  width: min(320px, 72vw);
  aspect-ratio: 1;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity var(--dur-hero) var(--ease-out) 180ms,
              transform var(--dur-hero) var(--ease-out) 180ms;
}

.is-loaded .portrait { opacity: 1; transform: none; }


@media (min-width: 1024px) {

  .hero-inner {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: var(--space-8);
  }

  .hero-portrait { justify-content: flex-end; }

  .portrait { width: min(400px, 34vw); }

  /* Alineado al centro del retrato: el halo lo rodea en vez de quedar detras. */
  .hero-glow { left: auto; right: 0; top: 50%; transform: translateY(-50%); width: min(660px, 50vw); }
}
/* El marcador SVG del prototipo se reemplaza por la foto real. */
.portrait img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
}
</style>
