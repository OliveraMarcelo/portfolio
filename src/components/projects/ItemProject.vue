<template>
    <div class="card">
  <img :src="props.image" alt="Project Image" />
  <h2>{{$t(props.title)}}</h2>
  <p>{{$t(props.description)}}</p>
        <div class="box-buttons">
            <ButtonCustom
  class="boton-primario"
  text="Visitar"
  :click="() => openLink(props.visit)"
/>
<ButtonCustom
  class="boton-secundario"
  text="Github"
  :click="() => openLink(props.github)"
/>

   </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ButtonCustom from "../buttons/ButtonCustom.vue";
const props = defineProps({
  image: String,
  title: String,
  description: String,
  visit: String,
  github: String,
});
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    console.warn('No URL provided');
  }
};

</script>

<style lang="scss" scoped></style>