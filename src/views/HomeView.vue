<template>
  <div class="home">
    <HeroSection />

    <section class="section" id="proyectos" aria-labelledby="titulo-destacados">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title" id="titulo-destacados" v-reveal>
            {{ t('home.destacadosTitulo') }}<span class="dot" aria-hidden="true">.</span>
          </h2>
          <p class="section-lede" v-reveal="{ delay: 70 }">{{ t('home.destacadosLede') }}</p>
        </header>

        <ProjectGrid :items="destacados" :heading-level="3" />

        <p class="section-foot" v-reveal>
          <RouterLink class="link-arrow" to="/projects">
            {{ t('home.verTodos') }}
            <AppIcon name="arrow" />
          </RouterLink>
        </p>
      </div>
    </section>

    <!-- Las secciones que siguen conservan los componentes viejos hasta que
         su historia las reemplace: habilidades en la 5.4, trayectoria en la
         5.5 y contacto en la 6.2. -->
    <SkillList />
    <MyStory />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import HeroSection from '@/components/sections/HeroSection.vue';
import ProjectGrid from '@/components/sections/ProjectGrid.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SkillList from '@/components/skills/SkillList.vue';
import MyStory from '@/components/stories/MyStory.vue';
import { projects } from '@/content/projects';

/* El IntersectionObserver local que agregaba `.loaded` se elimino: lo
   reemplaza la directiva v-reveal de la historia 2.7. Dos observers
   compitiendo es justo lo que D7 evita. */

const { t } = useI18n();

/* El filtro sale del dato (`featured`), no de tomar los primeros tres.

   Y el `.slice(0, 3)` no es redundante aunque hoy `featured` devuelva
   exactamente tres: FR-08 dice "maximo 3", y el dia que se marque un cuarto
   proyecto sin pensarlo la Home mostraria cuatro sin que nadie toque esta
   vista. Convierte el requisito en una garantia estructural. */
const destacados = computed(() => projects.filter((p) => p.featured).slice(0, 3));
</script>
