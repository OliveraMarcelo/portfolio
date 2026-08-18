<template>
  <ul class="project-grid">
    <li v-for="(p, i) in items" :key="p.slug">
      <ProjectCard
        v-reveal="{ delay: i * 70 }"
        :project="p"
        :heading-level="headingLevel"
      />
    </li>
  </ul>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue';

/* La grilla no decide QUE mostrar: recibe los proyectos ya elegidos. La Home
   le pasa los destacados y Proyectos el catalogo completo. Si filtrara aca,
   habria dos lugares donde se decide que ve el visitante.

   El escalonado SI vive aca, y a proposito: el retardo depende del indice, y
   el indice solo existe donde esta el v-for. Sacarlo a las vistas obligaria a
   repetir el v-for en las dos, que es exactamente como la Home y Proyectos
   terminaron con dos implementaciones distintas de la misma card.
   El paso es 70ms, el valor del token --stagger. */

defineProps({
  items: { type: Array, required: true },
  headingLevel: { type: Number, default: 2 },
});
</script>
