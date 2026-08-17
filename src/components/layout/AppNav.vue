<template>
  <header class="site-header">
    <div class="header-inner">
      <!-- `custom` para desactivar el aria-current automático de RouterLink:
           el logo no es un ítem de navegación, y sin esto habría tres
           elementos anunciando "página actual" en la Home (los dos logos y
           el enlace Inicio). -->
      <RouterLink v-slot="{ href, navigate }" to="/" custom>
        <a class="logo" :href="href" :aria-label="t('a11y.logo')" @click="navigate">
          <span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>
          <span class="logo-word">MarceCode</span>
        </a>
      </RouterLink>

      <nav class="nav" :aria-label="t('nav.aria')">
        <ul class="nav-list">
          <li v-for="item in items" :key="item.name">
            <RouterLink
              class="nav-link"
              :class="{ 'is-active': esActiva(item.name) }"
              :to="item.path"
              :aria-current="esActiva(item.name) ? 'page' : null"
            >{{ t(item.clave) }}</RouterLink>
          </li>
        </ul>
        <!-- El indicador se anima en la historia 2.2. Va en el markup ahora
             para no tocar el chasis dos veces; sin `.is-ready` es invisible. -->
        <span class="nav-indicator" aria-hidden="true"></span>
      </nav>

      <div class="header-actions">
        <ThemeToggle />
        <LangToggle />
        <!-- El boton de menu mobile lo agrega la historia 2.4. -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import LangToggle from '@/components/ui/LangToggle.vue';

const { t } = useI18n();
const route = useRoute();

const items = [
  { name: 'home', path: '/', clave: 'nav.home' },
  { name: 'projects', path: '/projects', clave: 'nav.projects' },
  { name: 'about', path: '/about', clave: 'nav.about' },
];

const esActiva = (name) => route.name === name;

</script>
