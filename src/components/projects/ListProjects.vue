<template>
  <div>
    <SectionTitle text="Proyectos" span-text="." />
    <div class="card-list">
      <div v-for="(project, index) in projects" :key="index" :style="{ width: cardWidth(index) }">
        <ItemProject :image="project.image" :title="project.title" :description="project.description" />
      </div>
    </div>

  </div>
</template>

<script setup>
import SectionTitle from '../texts/SectionTitle.vue';
import { ref } from 'vue';
import ItemProject from './ItemProject.vue';

const projects = ref([
  {
    title: 'Proyecto 1',
    image: 'https://via.placeholder.com/300x200', // Placeholder.com URL
    description: 'Descripción breve del proyecto 1.',
  },
  {
    title: 'Proyecto 2',
    image: 'https://picsum.photos/300/200', // Lorem Picsum URL
    description: 'Descripción breve del proyecto 2.',
  },
  {
    title: 'Proyecto 3',
    image: 'https://via.placeholder.com/300x200', // Placeholder.com URL
    description: 'Descripción breve del proyecto 1.',
  },
  {
    title: 'Proyecto 4',
    image: 'https://picsum.photos/300/200', // Lorem Picsum URL
    description: 'Descripción breve del proyecto 2.',
  },

  // Agrega más proyectos según sea necesario     
]);
const cardWidth = (index) => {
  const isEvenRow = Math.floor(index / 2) % 2 === 0; // Verifica si es fila par o impar
  return isEvenRow ? (index % 2 === 0 ? '60%' : '40%') : (index % 2 === 0 ? '40%' : '60%'); // Alterna entre 60% y 40% en cada fila
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
}

.card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between
}
</style>