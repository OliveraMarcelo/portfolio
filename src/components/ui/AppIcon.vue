<template>
  <svg class="ico" :class="{ 'ico-lg': size === 'lg' }" aria-hidden="true" focusable="false">
    <use :href="`#i-${name}`" />
  </svg>
</template>

<script>
/* Ámbito de módulo. `defineProps()` se iza fuera de `setup()`, así que su
   validator no puede referenciar una constante declarada en <script setup>:
   tiene que vivir acá. */
export const ICONOS = [
  'moon', 'sun', 'menu', 'close', 'arrow',
  'external', 'github', 'whatsapp', 'mail', 'linkedin', 'code',
  /* Tecnologias (historia 5.4). */
  'html', 'css', 'javascript', 'vue', 'react', 'flutter',
  'node', 'express', 'database', 'git', 'docker',
];
</script>

<script setup>
/* Consume el sprite que AppSprite.vue monta una sola vez.

   El prefijo de los IDs es `i-`, no `ico-`: `ico` es la CLASE del <svg> y
   `i-` es el prefijo del ID del <symbol>. Un <use> que apunta a un ID
   inexistente renderiza un SVG vacío SIN ningún error en consola, así que
   el prop se valida contra la lista real de símbolos. */

defineProps({
  name: {
    type: String,
    required: true,
    validator: (v) => ICONOS.includes(v),
  },
  size: {
    type: String,
    default: null,
    validator: (v) => v === null || v === 'lg',
  },
});
</script>
