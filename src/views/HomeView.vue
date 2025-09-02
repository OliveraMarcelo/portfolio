<template>
  <div class="home">
    <div class="presentation-box-photo">
      <div class="presentation presentation-col presentation-desktop">
        <SubTitle :text="t('helloIm')" span-text="Marcelo Olivera!"/>
        <MainTitle span-text="Front" :text="t('developer')"/>
        <SubTitle :text="t('aboutMeDesc')"/>
      </div>
      <div class="bordeline-photo bordeline-desktop"><img class="photo" alt="photo" src="../assets/icons/photo.jpeg"></div>
    </div>
   <div class="box-buttons">
  <ButtonCustom class="boton-primario" :text="t('downloadCV')" :click="downloadPdf" />
<!--     <ButtonCustom class="boton-secundario" text="Ver proyectos" :click="()=>{console.log('print')}" />
 -->   </div>
  <ListProjects :projects="projects"/>
  <SkillList/>
  <MyStory/> 
  </div>
</template>

<script setup>
import ButtonCustom from '@/components/buttons/ButtonCustom.vue';
import ListProjects from '@/components/projects/ListProjects.vue';
import SkillList from '@/components/skills/SkillList.vue';
import MyStory from '@/components/stories/MyStory.vue';
import MainTitle from '@/components/texts/MainTitle.vue';
import SubTitle from '@/components/texts/SubTitle.vue';
import useDownloadPdf from '@/composables/useDownloadPdf.vue';

import { onMounted, } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const  { downloadPdf } = useDownloadPdf('Marcelo%20Olivera%20-%20Curriculum%20Vitae.pdf');

const projects = [
  {
    title: 'realtimeMessagingTitle',
    image: 'https://picsum.photos/300/200',
    description: 'realtimeMessagingDesc',
    visit: 'https://misitio.com/proyecto1',
    github: 'https://github.com/usuario/proyecto1',
  },
  {
    title: 'onlineStoreTitle',
    image: 'https://picsum.photos/300/200',
    description: 'onlineStoreDesc',
    visit: 'https://misitio.com/proyecto2',
    github: 'https://github.com/usuario/proyecto2',
  },
];

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