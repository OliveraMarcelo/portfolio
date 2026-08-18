<template>
  <header class="section-head">
    <p v-if="kicker" class="section-kicker" v-reveal>{{ kicker }}</p>

    <component :is="`h${level}`" class="section-title" :id="id" v-reveal="{ delay: kicker ? 70 : 0 }">
      {{ title }}<span v-if="dot" class="dot" aria-hidden="true">.</span>
    </component>

    <p v-if="$slots.default" class="section-lede" v-reveal="{ delay: 140 }">
      <slot />
    </p>
  </header>
</template>

<script setup>
/* UN componente de encabezado para todo el sitio (NFR-17).

   Reemplaza a MainTitle, SubTitle, SectionTitle y ProjectTitle: cuatro
   componentes que renderizaban un titulo con estilos distintos. El efecto
   practico era que no habia jerarquia tipografica —cada vista elegia el que
   "se veia bien" en lugar del que correspondia al nivel semantico— y esa es
   la causa principal del problema P3 del PRD.

   El nivel es explicito en el llamado, no implicito en el nombre del
   componente: en la Home la h1 es el nombre del hero, asi que TODAS sus
   secciones van en 2 (NFR-09). */

defineProps({
  title: { type: String, required: true },
  level: { type: Number, default: 2, validator: (v) => [1, 2, 3].includes(v) },
  /* El punto final en color de acento es un gesto chico y repetido de la
     identidad. Va como prop y no escrito a mano en cada llamado. */
  dot: { type: Boolean, default: true },
  kicker: { type: String, default: null },
  id: { type: String, default: null },
});
</script>
