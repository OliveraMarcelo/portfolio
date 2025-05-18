<template>
  <div class="about">
      <div class="about-description">
        <MainTitle span-text="Sobre" text="mi"/>
        <SubTitle text="Desarrollar sitios web hermosos y funcionales es lo que amo hacer, y por eso doy lo mejor de mí en cada nuevo desafío."/>
      </div>
      <SkillList/>
      <MyStory/>
  </div>
</template>

<script setup>
import SkillList from '@/components/skills/SkillList.vue';
import MyStory from '@/components/stories/MyStory.vue';
import MainTitle from '@/components/texts/MainTitle.vue';
import SubTitle from '@/components/texts/SubTitle.vue';
import { onMounted } from 'vue';

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