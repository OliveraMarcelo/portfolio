<template>
  <AppSprite />

  <!-- Primer elemento enfocable, ANTES del header: si fuera después, quien
       navega por teclado tendría que atravesar todo el nav para encontrar el
       atajo que existe justamente para evitarlo. -->
  <a class="skip-link" href="#main">{{ t('a11y.skip') }}</a>

  <AppNav />

  <!-- `tabindex="-1"` no es opcional en el destino de un skip link. Medido:
       al activarlo, la URL cambiaba a #main y el scroll saltaba, pero el foco
       se quedaba en el <body> — un elemento sin tabindex no puede recibirlo.
       Quien navega con lector de pantalla activaba el atajo y seguia leyendo
       desde el principio, que es exactamente lo que el atajo evita.
       El -1 lo hace enfocable por programa sin agregarlo al orden de Tab. -->
  <main id="main" tabindex="-1">
    <!-- `mode="out-in"`: sin el, Vue monta la vista nueva mientras la vieja
         todavia sale y las dos coexisten un instante, lo que empuja el layout.
         A6 describe salida y despues entrada.

         El `name` se vacia cuando la View Transition esta corriendo: un
         <Transition> sin nombre no anima, y asi las dos no se superponen en un
         fade doble. -->
    <RouterView v-slot="{ Component }">
      <Transition :name="usarVistaNativa ? '' : 'view'" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />

  <UpdateToast />
</template>

<script setup>
import { onMounted } from 'vue';
import { usarVistaNativa } from '@/router';
import { useI18n } from 'vue-i18n';
import AppSprite from '@/components/layout/AppSprite.vue';
import AppNav from '@/components/layout/AppNav.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import UpdateToast from '@/components/ui/UpdateToast.vue';

const { t } = useI18n();

/* `is-loaded` en el body dispara las animaciones de mascara (.mask-in).
   El doble requestAnimationFrame no es supersticion: garantiza que el
   navegador ya pinto al menos un fotograma con el estado inicial. Agregando
   la clase en el mismo tick del montaje, el navegador puede no registrar el
   cambio como transicion y el hero simplemente aparece, sin animarse. */
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  });
});

/* El puente temporal de tema de la historia 1.2 —el botón flotante y el
   `data-theme` aplicado al montar— se eliminó acá: lo reemplazan el script
   inline de public/index.html, useTheme.js y ThemeToggle.vue. */
</script>
