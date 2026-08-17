<template>
  <!-- Decorativo: no aporta informacion que no este disponible de otra forma,
       asi que se oculta al lector de pantalla y nada dentro es enfocable.
       FR-09 pide un indicador, no un control. -->
  <Transition name="cue">
    <div v-if="visible" class="scroll-cue" aria-hidden="true">
      <span class="scroll-cue-track"><span class="scroll-cue-dot"></span></span>
      <span class="scroll-cue-text">{{ t('hero.scroll') }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/* Arranca oculto si la pagina ya viene scrolleada: al recargar a mitad de
   camino, o al llegar con un #hash, el navegador restaura la posicion ANTES de
   que el componente monte, y el indicador apareceria en una pagina que ya esta
   desplazada — justo lo contrario de lo que comunica. */
const visible = ref(true);

/* `once: true` en lugar de una bandera con guarda: el navegador desregistra el
   listener tras la primera ejecucion, asi que no hay forma de que el indicador
   reaparezca por error. FR-09 dice que desaparece al primer desplazamiento. */
const alScrollear = () => { visible.value = false; };

onMounted(() => {
  if (window.scrollY > 0) { visible.value = false; return; }
  window.addEventListener('scroll', alScrollear, { passive: true, once: true });
});

onUnmounted(() => window.removeEventListener('scroll', alScrollear));
</script>

<style scoped>
.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: clamp(1.25rem, 4svh, 2.5rem);
  /* Centrado con `translate` y no con `transform`: asi el hook de QA y
     reduced-motion pueden anular `transform` sin descentrar el indicador. */
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out) 700ms;
}

.is-loaded .scroll-cue { opacity: 1; }

.scroll-cue.is-hidden { opacity: 0; transition-delay: 0ms; }

.scroll-cue-track {
  width: 1px;
  height: 42px;
  background: var(--color-border);
  position: relative;
  overflow: hidden;
}

.scroll-cue-dot {
  position: absolute;
  inset: 0 auto auto 0;
  width: 1px;
  height: 14px;
  background: var(--color-text-muted);
  animation: cue-slide 2.2s var(--ease-in-out) infinite;
}

@keyframes cue-slide {

  0%   { transform: translateY(-16px); opacity: 0; }

  35%  { opacity: 1; }

  100% { transform: translateY(44px); opacity: 0; }
}

.scroll-cue-text {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* Salida por opacidad; al terminar el elemento se DESMONTA, asi la animacion
   en bucle del punto deja de consumir fotogramas. */
.cue-leave-active { transition: opacity var(--dur-base) var(--ease-out); }
.cue-leave-to { opacity: 0; }
</style>
