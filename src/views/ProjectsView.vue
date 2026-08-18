<template>
  <div>
    <section class="view-head" aria-labelledby="titulo-proyectos">
      <div class="container">
        <h1 class="view-title" id="titulo-proyectos">
          <span class="mask"
            ><span class="mask-in">{{ t('proyectos.titulo') }}<span class="dot">.</span></span></span
          >
        </h1>
        <p class="view-lede mask">
          <span class="mask-in" style="--d: 70ms">{{ t('proyectos.lede') }}</span>
        </p>
      </div>
    </section>

    <section class="section" :aria-label="t('proyectos.gridAria')">
      <div class="container">
        <ProjectGrid :items="projects" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import ProjectGrid from '@/components/sections/ProjectGrid.vue';
import { projects } from '@/content/projects';

/* El orden del array ES el orden de presentacion: la vista no reordena ni
   filtra. Muestra el catalogo completo; la Home muestra los destacados. */

const { t } = useI18n();
</script>
