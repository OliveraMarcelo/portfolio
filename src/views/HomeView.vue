<template>
  <div class="home">
    <div class="presentation-box-photo">
      <div class="presentation">
        <SubTitle text="Hola soy" span-text="Marcelo Olivera!"/>
        <MainTitle span-text="Front" text="Developer"/>
        <SubTitle text="Soy un apasionado desarrollador web con experiencia en front-end y back-end. Me encanta crear aplicaciones
            web increíbles y resolver problemas desafiantes."/>
      </div>
      <div class="bordeline-photo"><img class="photo" alt="photo" src="../assets/icons/photo.jpeg"></div>
    </div>
   <div class="box-buttons">
    <ButtonCustom class="boton-primario" text="Descargar CV" :click="downloadPdf" />
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
import { onMounted, ref } from 'vue';

const  { downloadPdf } = useDownloadPdf('Marcelo%20Olivera%20-%20Curriculum%20Vitae.pdf');
const projects = ref([
  {
    title: 'Mensajeria en tiempo real',
    image: 'https://picsum.photos/300/200',
    description: 'Deseas mandar mensajes en tiempo real y chatear con tus amigos ! Entonces este proyecto te interesara!',
    visit: 'https://misitio.com/proyecto1',
    github: 'https://github.com/usuario/proyecto1',
  },
  {
    title: 'Tienda online',
    image: 'https://picsum.photos/300/200',
    description: 'Descripción breve del proyecto 2.',
    visit: 'https://misitio.com/proyecto2',
    github: 'https://github.com/usuario/proyecto2',
  },
]);

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