<template>
  <div class="home">
    <HeroSection />

    <!-- Las secciones que siguen conservan los componentes viejos hasta que
         su historia las reemplace: proyectos destacados en la 4.7,
         habilidades en la 5.4, trayectoria en la 5.5 y contacto en la 6.2. -->
    <ListProjects :projects="projects" />
    <SkillList />
    <MyStory />
  </div>
</template>

<script setup>
import HeroSection from '@/components/sections/HeroSection.vue';
import ListProjects from '@/components/projects/ListProjects.vue';
import SkillList from '@/components/skills/SkillList.vue';
import MyStory from '@/components/stories/MyStory.vue';
import jedamiPreview from '@/assets/icons/jedami-preview.png';
import pokemonPreview from '@/assets/icons/pokemon-preview.png';

/* El IntersectionObserver local que agregaba `.loaded` se elimino: lo
   reemplaza la directiva v-reveal de la historia 2.7. Dos observers
   compitiendo es justo lo que D7 evita. */

const projects = [
  {
    title: 'proyectosLegacy.onlineStoreTitle',
    image: jedamiPreview,
    description: 'proyectosLegacy.onlineStoreDesc',
    visit: 'https://jedamiapp.com',
    github: 'https://github.com/OliveraMarcelo/tienda-jedami',
  },
  {
    title: 'proyectosLegacy.pokemonGameTitle',
    image: pokemonPreview,
    description: 'proyectosLegacy.pokemonGameDesc',
    visit: 'https://pokemon-game-theta-gold.vercel.app',
    github: 'https://github.com/OliveraMarcelo/pokemon-game',
  },
];
</script>
