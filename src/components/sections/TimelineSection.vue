<template>
  <ol ref="raizRef" class="timeline" :aria-label="t('trayectoria.aria')">
    <span class="timeline-rail" aria-hidden="true">
      <span class="timeline-progress"></span>
    </span>

    <TimelineItem
      v-for="(hito, i) in items"
      :key="hito.id"
      v-reveal="{ delay: i * 70 }"
      :item="hito"
    />
  </ol>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineItem from './TimelineItem.vue';
import { useReducedMotion } from '@/composables/useReducedMotion';

defineProps({
  items: { type: Array, required: true },
});

const { t } = useI18n();
const { reducido } = useReducedMotion();
const raizRef = ref(null);

/* Progreso del eje (A8). Se escribe en --timeline-progress y el CSS lo aplica
   con scaleY: animar `height` dispararia layout en cada fotograma del scroll,
   que es el peor caso posible para NFR-03.

   getBoundingClientRect() FUERZA layout, y aca no hay forma de evitarlo — el
   avance depende de la geometria. La mitigacion son tres cosas:

     1. listener pasivo;
     2. coalescido con requestAnimationFrame, asi se mide UNA vez por
        fotograma como maximo y no una por evento de scroll;
     3. lo que no cambia con el scroll —la altura del bloque— se cachea y se
        recalcula solo en resize.

   El handler no toca clases ni estilos que disparen layout: escribe una sola
   custom property. */
let alto = 0;
let pedido = false;

function medir() {
  alto = raizRef.value?.offsetHeight ?? 0;
}

function actualizar() {
  const el = raizRef.value;
  if (!el || !alto) return;
  /* El ancla es el 55% del viewport: el eje va un poco adelantado respecto de
     lo que se esta leyendo, que es lo que hace que se sienta como una guia y
     no como un rastro. */
  const ancla = window.innerHeight * 0.55;
  const avance = (ancla - el.getBoundingClientRect().top) / alto;
  el.style.setProperty('--timeline-progress', Math.max(0, Math.min(1, avance)).toFixed(4));
}

function alScrollear() {
  if (pedido) return;
  pedido = true;
  requestAnimationFrame(() => { actualizar(); pedido = false; });
}

function alRedimensionar() {
  medir();
  alScrollear();
}

onMounted(() => {
  /* Con movimiento reducido el eje se muestra completo y NO se registra el
     listener: es el estado final legible que pide NFR-07, y no se gasta un
     handler de scroll en alguien que pidio explicitamente menos movimiento. */
  if (reducido.value) {
    raizRef.value?.style.setProperty('--timeline-progress', '1');
    return;
  }
  medir();
  actualizar();
  window.addEventListener('scroll', alScrollear, { passive: true });
  window.addEventListener('resize', alRedimensionar);
});

onUnmounted(() => {
  window.removeEventListener('scroll', alScrollear);
  window.removeEventListener('resize', alRedimensionar);
});
</script>
