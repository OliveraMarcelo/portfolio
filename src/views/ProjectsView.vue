<template>
  <div class="projects">
    <div class="projects-description">
      <MainTitle span-text="Mis" text="Proyectos" />
      <SubTitle
        text="Soy un apasionado en desarrollar aplicaciones web o mobile. Aca se muestran varios de las aplicaciones que fui desarrollando a lo largo de mi carrera" />
    </div>
    <ListProjects :projects="projects"/>
  </div>
</template>
<script setup>

import ListProjects from '@/components/projects/ListProjects.vue';
/*import SkillList from '@/components/skills/SkillList.vue'; */  
import MainTitle from '@/components/texts/MainTitle.vue';
import SubTitle from '@/components/texts/SubTitle.vue';
import { onMounted, ref } from 'vue';

const projects = ref([
{
    title: 'Proyecto 1',
    image: 'https://picsum.photos/300/200',
    description: 'Descripción breve del proyecto 1.',
    visit: 'https://misitio.com/proyecto1',
    github: 'https://github.com/usuario/proyecto1',
  },
  {
    title: 'Proyecto 2',
    image: 'https://picsum.photos/300/200',
    description: 'Descripción breve del proyecto 2.',
    visit: 'https://misitio.com/proyecto2',
    github: 'https://github.com/usuario/proyecto2',
  },
  {
    title: 'Proyecto 3',
    image: 'https://picsum.photos/300/200',
    description: 'Descripción breve del proyecto 1.',
    visit: 'https://misitio.com/proyecto1',
    github: 'https://github.com/usuario/proyecto1',
  },
  {
    title: 'Proyecto 4',
    image: 'https://picsum.photos/300/200',
    description: 'Descripción breve del proyecto 2.',
    visit: 'https://misitio.com/proyecto2',
    github: 'https://github.com/usuario/proyecto2',
  },
  // Agrega más proyectos según sea necesario     
]);

onMounted(() => {
  setTimeout(() => {
    document.querySelectorAll('.presentation').forEach((card) => {
      card.classList.add('loaded');
    });
  }, 100);
  setTimeout(() => {
    document.querySelectorAll('.photo').forEach((card) => {
      card.classList.add('loaded');
    });
  }, 100);
});
</script>