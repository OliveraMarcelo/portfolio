<template>
  <button @click="props.click" :class="props.class">{{ props.text }}</button>
</template>

<script setup>
import { defineProps } from 'vue';

// Define el evento personalizado "click"
/* const emitirClick = () => {
  emit('click');
}; */

/* const { emit } = defineEmits(['click']);*/
const props = defineProps({
  text: String,
  class: String,
  click : Function
})
</script>
  
<style scoped></style>