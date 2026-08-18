<template>
  <div class="stack-groups">
    <div v-for="(grupo, i) in groups" :key="grupo.id" class="stack-group" v-reveal="{ delay: i * 70 }">
      <h3 class="stack-group-title">{{ t(`habilidades.${grupo.id}`) }}</h3>
      <ul class="skill-list">
        <li v-for="item in grupo.items" :key="item.name" class="skill">
          <AppIcon :name="item.icon" />
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/ui/AppIcon.vue';

/* El mismo componente en la Home y en Sobre mi, con los mismos datos. Si
   alguna vista tuviera que mostrar menos, filtraria lo que le pasa por props
   —como ProjectGrid en la 4.7— no habria una version resumida. */

defineProps({
  groups: { type: Array, required: true },
});

const { t } = useI18n();
</script>
