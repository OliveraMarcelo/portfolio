<template>

    <nav>
        <div class="logo">
            <i class="fas fa-code"></i>
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
        <div class="lang-switcher" style="position: absolute; top: 10px; right: 20px;">
            <button @click="switchLang" style="padding: 4px 10px; border-radius: 6px; border: none; background: #222; color: #fff; cursor: pointer;">
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

<style lang="scss" scoped></style>