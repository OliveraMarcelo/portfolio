<template>
    <div class="title">
        <span class="orange-text">{{ props.spanText }}</span> {{props.text}}
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,
  spanText : String,
});
</script>

<style lang="scss" scoped>
</style>