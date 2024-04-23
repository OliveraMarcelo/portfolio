<template>
    <div class="home">
    <div class="presentation-box-photo">
      <div class="presentation">
        <MainTitle span-text="Mis" text="Proyectos"/>
        <SubTitle text="Soy un apasionado en desarrollar aplicaciones web o mobile. Aca se muestran varios de las aplicaciones que fui desarrollando a lo largo de mi carrera"/>
      </div>
    </div>
   
  <ListProjects/>
  <SkillList/>
  <MyStory/>
  </div>
  </template>
  <script setup>

  import ListProjects from '@/components/projects/ListProjects.vue';
  import SkillList from '@/components/skills/SkillList.vue';
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