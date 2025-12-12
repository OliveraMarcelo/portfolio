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
  const observeElements = (selector, options = { threshold: 0.15 }) => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach(el => io.observe(el));
  };

  observeElements('.presentation', { threshold: 0.1 });
  observeElements('.photo', { threshold: 0.2 });
});
</script>