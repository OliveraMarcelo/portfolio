<template>
  <Transition name="toast">
    <div v-if="visible" class="update-toast" role="status">
      <p class="update-toast-text">{{ t('actualizacion.texto') }}</p>
      <div class="update-toast-actions">
        <button class="btn btn-primary btn-sm" type="button" @click="actualizar">
          {{ t('actualizacion.actualizar') }}
        </button>
        <button class="btn btn-quiet btn-sm" type="button" @click="descartar">
          {{ t('actualizacion.despues') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

/* Aviso NO bloqueante de version nueva (NFR-21).

   No es un modal: el visitante vino a ver el portfolio, no a administrar
   caches. Va fijo en una esquina, se puede descartar, y si lo descarta no
   vuelve en esa sesion. Posicion fija y fuera del flujo para que aparecer no
   produzca ningun corrimiento de layout (M4). */

const { t } = useI18n();
const visible = ref(false);
let registro = null;
let recargando = false;

function alHaberActualizacion(e) {
  registro = e.detail;
  visible.value = true;
}

function descartar() {
  visible.value = false;
}

function actualizar() {
  visible.value = false;
  const enEspera = registro?.waiting;
  if (!enEspera) { window.location.reload(); return; }

  /* El orden importa y es donde esto se implementa mal casi siempre:
     `postMessage` es ASINCRONO, asi que recargar inmediatamente despues lo
     hace mientras el worker viejo todavia controla la pagina — el navegador
     vuelve a servir el cache viejo y el visitante ve LO MISMO despues de
     haber aceptado actualizar. Peor que no ofrecerlo.

     Se espera el cambio de control, y `recargando` es la guarda contra el
     bucle: sin ella `controllerchange` puede volver a dispararse tras la
     recarga y dejar el sitio recargandose sin parar. */
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (recargando) return;
    recargando = true;
    window.location.reload();
  });

  enEspera.postMessage({ type: 'SKIP_WAITING' });
}

onMounted(() => window.addEventListener('mc:sw-actualizado', alHaberActualizacion));
onUnmounted(() => window.removeEventListener('mc:sw-actualizado', alHaberActualizacion));
</script>

<style scoped>
.update-toast {
  position: fixed;
  z-index: 106;
  left: var(--gutter);
  right: var(--gutter);
  bottom: var(--gutter);
  margin-inline: auto;
  max-width: 30rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 1rem 1.25rem;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.update-toast-text {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.update-toast-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Los botones del aviso son mas chicos que los del sitio, pero el area
   tactil sigue por encima de los 44px de NFR-11. */
.update-toast .btn-sm {
  min-height: 44px;
  padding-inline: 1rem;
}

@media (prefers-reduced-motion: no-preference) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity var(--dur-base) var(--ease-out),
                transform var(--dur-base) var(--ease-out);
  }
  .toast-enter-from,
  .toast-leave-to { opacity: 0; transform: translateY(12px); }
}
</style>
