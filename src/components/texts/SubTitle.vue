<template>
  <div class="subtitle">
    {{props.text}}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String
});
</script>

<style lang="scss" scoped></style>