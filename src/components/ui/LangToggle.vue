<template>
  <button class="lang-btn" type="button" :aria-label="t('lang.aria')" @click="toggleLocale">
    <span class="lang-current">{{ locale.toUpperCase() }}</span>
    <span class="lang-sep" aria-hidden="true">/</span>
    <span class="lang-other">{{ otro.toUpperCase() }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';

const { t } = useI18n();
const { locale, toggleLocale } = useLocale();

const otro = computed(() => (locale.value === 'es' ? 'en' : 'es'));
</script>
