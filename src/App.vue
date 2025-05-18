<template>
  <NavBar />
  <router-view />
  <Footer/>
</template>

<style lang="scss"></style>
<script setup>
import NavBar from './components/layouts/NavBar.vue';
import Footer from '@/components/layouts/FooterPage.vue';

</script>