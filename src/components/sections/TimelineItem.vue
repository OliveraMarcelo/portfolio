<template>
  <li class="milestone" :class="`is-${item.type}`">
    <span class="milestone-node" aria-hidden="true"></span>

    <p class="milestone-meta">
      <span class="milestone-tag" :class="{ 'is-now': enCurso }">{{ periodo }}</span>
    </p>

    <h3 class="milestone-title">{{ textos.role }}</h3>
    <p class="milestone-org">{{ textos.org }}</p>
    <p class="milestone-desc">{{ textos.text }}</p>

    <ul v-if="item.stack.length" class="chips chips-sm">
      <li v-for="tec in item.stack" :key="tec"><span class="chip">{{ tec }}</span></li>
    </ul>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  item: { type: Object, required: true },
});

const { t, locale } = useI18n();

const textos = computed(() => props.item.i18n[locale.value] ?? props.item.i18n.es);

const enCurso = computed(() => props.item.status === 'ongoing');

/* El formateo del periodo es responsabilidad del componente, no del dato: por
   eso `timeline.js` guarda { from, to } y no "2023 — actualidad". La palabra
   sale de los locales y asi se traduce sola.

   Mientras los años no esten cargados —el PRD no los trae y no se inventan—
   se muestra la etiqueta de estado, que es lo que si se sabe. */
const periodo = computed(() => {
  const { from, to } = props.item.period;
  if (from === null) return t(`trayectoria.${props.item.status}`);
  return to === null ? `${from} — ${t('trayectoria.hasta')}` : `${from} — ${to}`;
});
</script>
