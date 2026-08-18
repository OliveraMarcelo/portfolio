<template>
  <article class="project-card" :class="`is-${variant}`">
    <figure class="project-media">
      <img
        v-if="imagen"
        class="project-img"
        :src="imagen"
        :alt="textos.title"
        :style="estiloTransicion"
        width="1200"
        height="750"
        loading="lazy"
        decoding="async"
      />
      <!-- Sin captura todavia. No se inventa una imagen ni se reusa otra:
           el hueco es la brecha de contenido que la historia 7.1 resuelve. -->
      <figcaption v-else class="project-media-empty">{{ t('proyectos.sinCaptura') }}</figcaption>
    </figure>

    <div class="project-body">
      <component :is="`h${headingLevel}`" class="project-title">
        <!-- Ruta como string y no como nombre: la registra la historia 4.5.
             Un `to` con nombre inexistente hace que Vue Router avise en
             consola; con path, la 4.5 lo hace navegar sin tocar la card. -->
        <RouterLink class="card-title-link" :to="`/projects/${project.slug}`">
          {{ textos.title }}
        </RouterLink>
      </component>

      <p class="project-summary">{{ textos.summary }}</p>

      <ul class="chips chips-sm" :aria-label="t('proyectos.stackDe', { proyecto: textos.title })">
        <li v-for="(tec, i) in project.stack" :key="tec">
          <span class="chip" :class="{ 'chip-lead': i === 0 }">{{ tec }}</span>
        </li>
      </ul>

      <!-- `chat-tiempo-real` no tiene ni sitio en vivo ni repositorio publico.
           Su card se renderiza SIN acciones, y el contenedor no se emite
           vacio: dejaria un padding-top suelto y un hueco visible en la
           grilla (AC3). -->
      <div v-if="project.liveUrl || project.repoUrl" class="project-actions">
        <AppButton v-if="project.liveUrl" variant="ghost" :href="project.liveUrl">
          {{ t('proyectos.verEnVivo') }}
          <template #icono><AppIcon name="external" /></template>
        </AppButton>
        <AppButton v-if="project.repoUrl" variant="quiet" :href="project.repoUrl">
          <template #icono><AppIcon name="code" /></template>
          {{ t('proyectos.verCodigo') }}
        </AppButton>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import AppButton from '@/components/ui/AppButton.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import { imagenDeProyecto } from '@/utils/assets';
import { useReducedMotion } from '@/composables/useReducedMotion';

/* LA card de proyecto del sitio (NFR-17). La consumen la Home (4.7) y la
   vista de Proyectos (4.3), y su imagen es el elemento compartido de la
   transicion de la 4.6. No hay una segunda: ItemProject.vue se elimino. */

const props = defineProps({
  project: { type: Object, required: true },
  variant: { type: String, default: 'featured', validator: (v) => ['featured', 'compact'].includes(v) },
  /* El nivel depende de donde se monta la card, no de la card: h2 bajo el h1
     de Proyectos, h3 bajo el h2 de "Destacados" en la Home (NFR-09). */
  headingLevel: { type: Number, default: 2, validator: (v) => v >= 2 && v <= 4 },
});

const { t, locale } = useI18n();

const textos = computed(() => props.project.i18n[locale.value] ?? props.project.i18n.es);
const imagen = computed(() => imagenDeProyecto(props.project.image));

/* Elemento compartido con el detalle (FR-14, A6). El nombre es un
   <custom-ident>, no una cadena: no puede empezar con digito, ni llevar
   espacios ni comillas. El prefijo `proyecto-` cubre las dos cosas — evita
   colisionar con otro nombre del sitio y garantiza que nunca arranque con un
   digito aunque un slug futuro si lo haga.

   Con movimiento reducido NO se aplica: el guard de la 2.6 ya evita la
   transicion, pero un elemento nombrado se promueve a su propia capa de
   composicion y eso cuesta aunque no se anime. */
const { reducido } = useReducedMotion();
const estiloTransicion = computed(() =>
  reducido.value ? null : { viewTransitionName: `proyecto-${props.project.slug}` });
</script>
