<template>

    <nav>
        <div class="logo">
            <span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>
            MarceCode
        </div>
        <div class="navigation">
            <ul>
                <li v-for="(item, index) in navItems" :key="index">
                    <router-link :to="item.path" @click="activateItem(index)" @mouseover="highlightItem(index)"
                        :class="{ active: isCurrentPage(item.path) }" @mouseleave="resetHighlight">{{t(item.name)}}</router-link>
                </li>
            </ul>
        </div>
        <div class="lang-switcher">
            <button class="lang-switcher-btn" @click="switchLang">
                {{t('langBtn')}}
            </button>
        </div>
    </nav>
</template>

<script setup>
import { ref, } from 'vue';
import { useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const switchLang = () => {
    locale.value = locale.value === 'es' ? 'en' : 'es';
};
const navItems = [
    {
        name: 'home',
        path: '/',
    },
    {
        name: 'projects',
        path: '/projects',
    },
    {
        name: 'about',
        path: '/about'
    }
];

const route = useRoute();

const isCurrentPage = (path) => {
    return route.path === path;
};

const activeItem = ref();

const activateItem = (index) => {
    activeItem.value = index;
};

const highlightItem = (index) => {
    activeItem.value = index;
};

const resetHighlight = () => {
    activeItem.value = null;
};
</script>

<style lang="scss" scoped>
/* Estilos que estaban inline en el template, movidos acá y tokenizados en
   la historia 1.2. Este componente se reemplaza por AppNav.vue en la 1.5. */
.lang-switcher {
  position: absolute;
  top: 10px;
  right: 20px;
}

.lang-switcher-btn {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-raised);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out);
}

.lang-switcher-btn:hover {
  border-color: var(--color-text-muted);
}
</style>