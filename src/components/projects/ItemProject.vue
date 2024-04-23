<template>
    <div class="card">
        <img :src="props.image" alt="Project Image" />
        <h2>{{ props.title }}</h2>
        <p>{{ props.description }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    image: String,
    title : String,
    description : String,
});
</script>

<style lang="scss" scoped></style>