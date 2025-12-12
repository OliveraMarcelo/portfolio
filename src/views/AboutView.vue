<template>
  <div class="about">
      <div class="about-description">
        
        <MainTitle span-text="Sobre" text="mi"/>
        <SubTitle text="Desarrollar sitios web hermosos y funcionales es lo que amo hacer, y por eso doy lo mejor de mí en cada nuevo desafío."/>
      </div>

      <!-- <SkillList/> -->
      <MyStory/>
  </div>
</template>

<script setup>
/* import SkillList from '@/components/skills/SkillList.vue'; */
import MyStory from '@/components/stories/MyStory.vue';
import MainTitle from '@/components/texts/MainTitle.vue';
import SubTitle from '@/components/texts/SubTitle.vue';
import { onMounted } from 'vue';

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