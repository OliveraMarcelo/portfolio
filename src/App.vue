<template>
  <NavBar />
  <router-view />
  <Footer/>
  <button class="toggle-mode-btn" @click="toggleMode">
    {{ isDark ? '☀️ Light' : '🌙 Dark' }}
  </button>
</template>

<style lang="scss">
.toggle-mode-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  cursor: pointer;
  opacity: 0.85;
  transition: background 0.3s, color 0.3s;
}
.toggle-mode-btn:hover {
  background: #ff9800;
  color: #222;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import NavBar from './components/layouts/NavBar.vue';
import Footer from '@/components/layouts/FooterPage.vue';

const isDark = ref(false);
const toggleMode = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle('dark-mode', isDark.value);
};
onMounted(() => {
  document.body.classList.toggle('dark-mode', isDark.value);
});
</script>