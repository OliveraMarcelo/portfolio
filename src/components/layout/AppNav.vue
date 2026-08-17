<template>
  <header class="site-header">
    <div class="header-inner">
      <!-- `custom` para desactivar el aria-current automático de RouterLink:
           el logo no es un ítem de navegación, y sin esto habría tres
           elementos anunciando "página actual" en la Home (los dos logos y
           el enlace Inicio). -->
      <RouterLink v-slot="{ href, navigate }" to="/" custom>
        <a class="logo" :href="href" :aria-label="t('logoAria')" @click="navigate">
          <span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>
          <span class="logo-word">MarceCode</span>
        </a>
      </RouterLink>

      <nav class="nav" :aria-label="t('navAria')">
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
        <!-- El toggle de tema lo agrega la historia 1.6 y el de menu mobile
             la 2.4. Un boton que no hace nada es peor que uno ausente. -->
        <button class="lang-btn" type="button" :aria-label="t('langAria')" @click="alternarIdioma">
          <span class="lang-current">{{ idioma.toUpperCase() }}</span>
          <span class="lang-sep" aria-hidden="true">/</span>
          <span class="lang-other">{{ otroIdioma.toUpperCase() }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

/* Comportamiento provisorio del idioma: alterna el locale de vue-i18n, igual
   que hacia NavBar.vue. La persistencia, el composable useLocale y el script
   inline previo al primer pintado son la historia 1.7. */

const { t, locale } = useI18n();
const route = useRoute();

const items = [
  { name: 'home', path: '/', clave: 'home' },
  { name: 'projects', path: '/projects', clave: 'projects' },
  { name: 'about', path: '/about', clave: 'about' },
];

const esActiva = (name) => route.name === name;

const idioma = computed(() => locale.value);
const otroIdioma = computed(() => (locale.value === 'es' ? 'en' : 'es'));
const alternarIdioma = () => { locale.value = otroIdioma.value; };
</script>
