<template>
  <component :is="etiqueta" v-bind="atributos" :class="clases">
    <slot />
    <slot name="icono" />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

/* Un solo componente de boton para todo el sitio (NFR-17). Las variantes se
   resuelven con props, no clonando el componente — el proyecto ya tiene cuatro
   componentes de titulo que hacen lo mismo y no va a sumar un quinto caso.

   Lo que navega es un <a>, lo que ejecuta es un <button>. Que se vean igual es
   una decision visual; que sean el mismo elemento no lo es. */

const props = defineProps({
  variant: { type: String, default: 'primary', validator: (v) => ['primary', 'ghost'].includes(v) },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  download: { type: Boolean, default: false },
});

const etiqueta = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return 'a';
  return 'button';
});

const atributos = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) {
    const externo = /^https?:/.test(props.href);
    return {
      href: props.href,
      ...(props.download ? { download: '' } : {}),
      ...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    };
  }
  return { type: 'button' };
});

const clases = computed(() => ['btn', `btn-${props.variant}`]);
</script>
