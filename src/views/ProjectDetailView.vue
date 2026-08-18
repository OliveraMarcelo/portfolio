<template>
  <div>
    <header class="project-head">
      <div class="container">
        <h1 class="project-title">
          <span class="mask"><span class="mask-in">{{ textos.title }}</span></span>
        </h1>

        <p class="project-lede" v-reveal="{ delay: 70 }">{{ textos.summary }}</p>

        <ul class="chips" v-reveal="{ delay: 140 }" :aria-label="t('detalle.stackAria')">
          <li v-for="(tec, i) in project.stack" :key="tec">
            <span class="chip" :class="{ 'chip-lead': i === 0 }">{{ tec }}</span>
          </li>
        </ul>

        <!-- Sin ninguna URL no se emite el contenedor: un bloque vacio con su
             margen se lee como un error de render, no como una ausencia. -->
        <div
          v-if="project.liveUrl || project.repoUrl"
          class="project-actions"
          v-reveal="{ delay: 210 }"
        >
          <AppButton v-if="project.liveUrl" :href="project.liveUrl">
            {{ t('proyectos.verEnVivo') }}
            <template #icono><AppIcon name="external" /></template>
          </AppButton>
          <AppButton v-if="project.repoUrl" variant="quiet" :href="project.repoUrl">
            <template #icono><AppIcon name="code" /></template>
            {{ t('proyectos.verCodigo') }}
          </AppButton>
        </div>
      </div>
    </header>

    <div class="project-media-wrap">
      <div class="container">
        <figure class="project-media">
          <!-- Al reves que en la card, aca la imagen esta sobre el pliegue y
               es la candidata a LCP de la vista: sin `loading="lazy"`. -->
          <img
            v-if="imagen"
            class="project-img"
            :src="imagen"
            :alt="textos.title"
            :style="estiloTransicion"
            width="1200"
            height="750"
            decoding="async"
          />
          <figcaption v-else class="project-media-empty">{{ t('proyectos.sinCaptura') }}</figcaption>
        </figure>
      </div>
    </div>

    <div class="chapters">
      <div class="container">
        <section v-for="c in capitulos" :key="c.clave" class="chapter" v-reveal>
          <h2 class="chapter-title">{{ t(`detalle.${c.clave}`) }}</h2>
          <p class="chapter-body">{{ c.texto }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/ui/AppButton.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import { imagenDeProyecto } from '@/utils/assets';
import { useReducedMotion } from '@/composables/useReducedMotion';

/* La vista es pura: recibe el proyecto ya resuelto y lo renderiza (D5). No
   lee `route.params` ni llama a `bySlug`.

   Eso tiene dos consecuencias, y las dos son el punto:
     1. El slug inexistente lo ataja el `beforeEnter` del router, asi que aca
        no hace falta ningun estado de "no encontrado" ni un `v-if="project"`:
        si la vista se monto, el proyecto existe.
     2. Es renderizable sin router, con cualquier proyecto.

   Del prototipo NO se portan la barra de progreso de lectura, las migas ni la
   card de "siguiente proyecto": son razonables pero ningun FR las pide, y
   sumarlas seria ampliar el alcance por cuenta propia.

   Tampoco se porta la ficha rapida (`.fact-strip`): sus tres datos son rol,
   año y estado, y el contenido solo tiene rol. Inventar el año y el estado
   para llenar la ficha seria contenido falso; el rol ya se lee como capitulo. */

const props = defineProps({
  project: { type: Object, required: true },
});

const { t, locale } = useI18n();

const textos = computed(() => props.project.i18n[locale.value] ?? props.project.i18n.es);
const imagen = computed(() => imagenDeProyecto(props.project.image));

/* El mismo nombre que la card del mismo slug: es lo que hace que el navegador
   anime entre las dos geometrias en lugar de cruzar dos imagenes sueltas. Las
   dos usan `object-fit: cover`; con encuadres distintos la transicion muestra
   un salto a mitad de camino. */
const { reducido } = useReducedMotion();
const estiloTransicion = computed(() =>
  reducido.value ? null : { viewTransitionName: `proyecto-${props.project.slug}` });

const capitulos = computed(() => [
  { clave: 'problema', texto: textos.value.problem },
  { clave: 'solucion', texto: textos.value.solution },
  { clave: 'rol', texto: textos.value.role },
]);
</script>

<style scoped>
.project-head {
  padding-block: clamp(2.5rem, 6vw, var(--space-16)) clamp(2rem, 5vw, 3rem);
}

.project-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
  max-width: 14ch;
}

/* Selector con contexto: la utilidad `.mask-in` nunca declara `display`. */
.project-title .mask-in { display: block; }

.project-lede {
  max-width: 44ch;
  margin-top: 1.125rem;
  font-size: var(--text-lg);
  line-height: 1.5;
  color: var(--color-text-muted);
}

.project-head .chips { margin-top: 1.75rem; }

.project-head .project-actions { margin-top: 1.75rem; }

.project-media-wrap { padding-block-end: clamp(2rem, 5vw, 3.25rem); }

.chapters { padding-block-end: clamp(2.5rem, 6vw, var(--space-16)); }

.chapter {
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.chapter + .chapter { margin-top: clamp(2.5rem, 6vw, 4.5rem); }

.chapter-title {
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.chapter-body {
  max-width: 68ch;
  margin-top: 1rem;
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-muted);
}
</style>
