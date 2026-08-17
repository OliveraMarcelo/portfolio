<template>
  <!-- Sprite SVG del design system, portado literal de
       public/ui-generated/_system/sprite.html.
       Se monta UNA sola vez en App.vue. Los iconos se consumen con
       <AppIcon name="moon" />, que resuelve a <use href="#i-moon">.

       El contenedor NO usa display:none ni visibility:hidden a proposito:
       algunos navegadores dejan de resolver las referencias <use> a
       simbolos dentro de un subarbol oculto de esa forma. La regla
       .sprite de base.scss lo saca del flujo con width/height 0. -->
<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 13.4A8.2 8.2 0 0 1 10.6 4a8.2 8.2 0 1 0 9.4 9.4Z"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-external" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/></symbol>
  <symbol id="i-github" viewBox="0 0 24 24"><path d="M9.2 20.6v-2.9c-3 .6-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10 10 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.7 1.1 2.9 0 4.2-2.6 5.1-5 5.4.4.4.8 1.1.8 2.2v3.3"/></symbol>
  <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M3.5 20.5 5 16.4A8 8 0 1 1 8 19.3l-4.5 1.2Z"/><path d="M9 9.2c.2 1.6 1.9 4 4.2 4.8.7.2 1.3-.3 1.5-.9l-1.6-.9-.8.7c-.9-.5-1.6-1.2-2-2.1l.8-.7-.8-1.6c-.6.2-1.2.6-1.3 1.3Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 7 7.1 5.3c.7.5 1.6.5 2.2 0L20.2 7"/></symbol>
  <symbol id="i-linkedin" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V17M8 7.4v.1M12 17v-3.6a2.4 2.4 0 0 1 4.8 0V17"/></symbol>
  <symbol id="i-code" viewBox="0 0 24 24"><path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14"/></symbol>
</svg>
</template>
