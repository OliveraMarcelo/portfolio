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
import MainTitle from '@/components/texts/MainTitle.vue';
import SubTitle from '@/components/texts/SubTitle.vue';
import jedamiPreview from '@/assets/icons/jedami-preview.png';
import { onMounted, ref } from 'vue';

const projects = ref([
  {
    title: 'Tienda Jedami',
    image: jedamiPreview,
    description: 'E-commerce con catálogo de productos, carrito de compras y gestión de pedidos. Desarrollado con Node.js y Vue.',
    visit: 'https://jedamiapp.com',
    github: 'https://github.com/OliveraMarcelo/tienda-jedami',
  },
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