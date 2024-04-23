<template>
    <div>
        <nav>
            <ul>
                <li v-for="(item, index) in navItems" :key="index" >
                    <router-link :to="item.path" @click="activateItem(index)" @mouseover="highlightItem(index)"
                    :class="{ active: isCurrentPage(item.path) }"
                        @mouseleave="resetHighlight">{{ item.name }}</router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref,  } from 'vue';
import { useRoute } from 'vue-router';

const navItems = [
    {
        name: 'Inicio',
        path: '/',

    },
    {
        name: 'Proyectos',
        path: '/projects',
    },
    {
        name: 'Sobre mí',
        path : '/about'
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