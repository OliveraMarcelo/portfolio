<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="abierto"
        ref="capaRef"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        @click="alClicEnFondo"
      >
        <div class="lightbox-scrim" aria-hidden="true"></div>

        <div class="lightbox-panel">
          <div class="lightbox-bar">
            <p class="lightbox-title">{{ label }}</p>
            <button
              ref="botonCerrarRef"
              class="icon-btn"
              type="button"
              :aria-label="t('ui.cerrar')"
              @click="cerrarCapa"
            >
              <AppIcon name="close" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/ui/AppIcon.vue';
import { useFocusTrap } from '@/composables/useFocusTrap';

/* Capa ampliada, generica: recibe su contenido por slot para servir a
   cualquier imagen y no solo al certificado.

   NO usa <dialog> ni showModal(), a pesar de que darian foco contenido y
   cierre con Escape gratis. El elemento nativo promueve el dialogo al TOP
   LAYER, que es un contexto de apilamiento fuera del arbol normal: el
   contrato de z-index del sitio —scrim 90 < header 100 < panel 105— dejaria
   de aplicar, y ese contrato existe porque su ausencia ya causo un defecto
   real en la historia 2.4. Ademas el ::backdrop se estiliza aparte y no
   hereda los tokens del tema igual. */

const props = defineProps({
  abierto: { type: Boolean, required: true },
  label: { type: String, required: true },
  disparador: { type: Object, default: null },
});

const emit = defineEmits(['cerrar']);

const { t } = useI18n();
const capaRef = ref(null);
const botonCerrarRef = ref(null);
const { abrir, cerrar, alPresionarTab } = useFocusTrap();

function cerrarCapa() {
  emit('cerrar');
}

/* El fondo atenuado CIERRA, asi que tiene que recibir el clic — nada de
   `pointer-events: none`. Y el clic se compara contra el propio contenedor:
   escuchando en toda la capa, un clic SOBRE la imagen tambien cerraria. */
function alClicEnFondo(e) {
  if (e.target === capaRef.value || e.target.classList.contains('lightbox-scrim')) cerrarCapa();
}

function alPresionarTecla(e) {
  if (!props.abierto) return;
  if (e.key === 'Escape') { cerrarCapa(); return; }
  alPresionarTab(e, capaRef.value);
}

watch(() => props.abierto, async (estaAbierto) => {
  if (estaAbierto) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', alPresionarTecla);
    await nextTick();
    /* El disparador se pasa explicito: un `.click()` programatico no mueve el
       foco, y Safari no enfoca los <button> al hacer clic. Mismo patron que
       el menu mobile de la historia 2.4 — el composable es el mismo, no una
       segunda implementacion. */
    abrir(capaRef.value, props.disparador);
    botonCerrarRef.value?.focus();
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', alPresionarTecla);
    cerrar();
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', alPresionarTecla);
});
</script>

<style>
/* Sin `scoped`: el Teleport monta el nodo en <body>, fuera del subarbol del
   componente, asi que un atributo de scope no alcanzaria a estas reglas. */

/* El contrato de apilamiento del sitio termina en 105 (panel mobile). El
   lightbox es modal y va encima de todo. */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: var(--gutter);
}

.lightbox-scrim {
  position: absolute;
  inset: 0;
  background: rgba(4, 5, 7, 0.86);
}

.lightbox-panel {
  position: relative;
  z-index: 1;
  width: min(1040px, 92vw);
  max-height: 92svh;
  overflow: auto;
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.lightbox-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 0.25rem 0.25rem 0.75rem 0.75rem;
}

.lightbox-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.lightbox img {
  display: block;
  width: 100%;
  max-height: 78svh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

@media (prefers-reduced-motion: no-preference) {
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: opacity var(--dur-base) var(--ease-out);
  }
  .lightbox-enter-active .lightbox-panel,
  .lightbox-leave-active .lightbox-panel {
    transition: transform var(--dur-base) var(--ease-out);
  }
  .lightbox-enter-from,
  .lightbox-leave-to { opacity: 0; }
  .lightbox-enter-from .lightbox-panel,
  .lightbox-leave-to .lightbox-panel { transform: scale(0.96); }
}
</style>
