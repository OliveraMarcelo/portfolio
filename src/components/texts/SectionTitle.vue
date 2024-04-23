<template>
  <div class="section-title">
    {{props.text}}
    <span class="orange-text">{{ props.spanText }}</span> 
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,
  spanText : String,
});
</script>

<style lang="scss" scoped></style>