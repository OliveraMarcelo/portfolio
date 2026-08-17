<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolleado }">
    <div class="header-inner">
      <!-- `custom` para desactivar el aria-current automático de RouterLink:
           el logo no es un ítem de navegación, y sin esto habría tres
           elementos anunciando "página actual" en la Home (los dos logos y
           el enlace Inicio). -->
      <RouterLink v-slot="{ href, navigate }" to="/" custom>
        <a class="logo" :href="href" :aria-label="t('a11y.logo')" @click="navigate">
          <span class="logo-mark" aria-hidden="true">&lt;/&gt;</span>
          <span class="logo-word">MarceCode</span>
        </a>
      </RouterLink>

      <nav ref="navRef" class="nav" :aria-label="t('nav.aria')">
        <ul ref="listaRef" class="nav-list" @mouseleave="volverAlActivo">
          <li v-for="item in items" :key="item.name">
            <RouterLink
              class="nav-link"
              :class="{ 'is-active': esActiva(item.name) }"
              :to="item.path"
              :aria-current="esActiva(item.name) ? 'page' : null"
              @mouseenter="moverA($event.currentTarget)"
              @focus="moverA($event.currentTarget)"
            >{{ t(item.clave) }}</RouterLink>
          </li>
        </ul>
        <span ref="indicadorRef" class="nav-indicator" aria-hidden="true"></span>
      </nav>

      <div class="header-actions">
        <ThemeToggle />
        <LangToggle />
        <!-- El boton de menu mobile lo agrega la historia 2.4. -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import LangToggle from '@/components/ui/LangToggle.vue';
import { useLocale } from '@/composables/useLocale';

const { t } = useI18n();
const route = useRoute();
const { locale } = useLocale();

const navRef = ref(null);
const listaRef = ref(null);
const indicadorRef = ref(null);

const items = [
  { name: 'home', path: '/', clave: 'nav.home' },
  { name: 'projects', path: '/projects', clave: 'nav.projects' },
  { name: 'about', path: '/about', clave: 'nav.about' },
];

const esActiva = (name) => route.name === name;

/* Indicador animado (A3). El CSS del sistema lo posiciona con
   `translateX(var(--nav-x)) scaleX(var(--nav-w))` sobre una base de 1px de
   ancho, así que solo se anima `transform` (NFR-02): --nav-x es el offset en
   px y --nav-w el ancho como factor de escala. */
function moverA(destino) {
  const ind = indicadorRef.value;
  if (!ind || !destino) return;
  ind.style.setProperty('--nav-x', `${destino.offsetLeft}px`);
  ind.style.setProperty('--nav-w', String(destino.offsetWidth));
  ind.classList.add('is-ready');
}

function volverAlActivo() {
  moverA(navRef.value?.querySelector('.nav-link.is-active'));
}

/* Medir DESPUÉS del render: offsetLeft y offsetWidth devuelven 0 si el
   elemento todavía no está en el layout. */
async function reposicionar() {
  await nextTick();
  volverAlActivo();
}

/* Las tres causas de desalineación, cada una con su reposicionamiento:

   1. Cambio de ruta — cambia cuál es el activo.
   2. Cambio de IDIOMA — "Sobre mí" y "About me" no miden lo mismo. Es la que
      se olvida, porque no se te ocurre probarla.
   3. Carga de fuentes — con `font-display: swap` el nav se pinta primero con
      el respaldo y el ancho de las etiquetas cambia cuando llega la real.
   Más el `resize`, porque el .nav-list es flex. */
watch(() => route.name, reposicionar);
watch(locale, reposicionar);

/* Header en scroll (A4). El handler solo lee window.scrollY y hace un
   classList.toggle idempotente: no mide nada del DOM, asi que no produce
   layout thrashing. `passive: true` es obligatorio — sin el, el navegador
   espera a que el handler termine para saber si llamaste a preventDefault(),
   y eso bloquea el scroll (NFR-03). */
const scrolleado = ref(false);
const onScroll = () => { scrolleado.value = window.scrollY > 80; };

onMounted(() => {
  reposicionar();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', volverAlActivo);
  if (document.fonts?.ready) {
    document.fonts.ready.then(volverAlActivo).catch(() => { /* noop */ });
  }
});

/* Al navegar, la historia 2.5 lleva el scroll al tope: hay que reevaluar el
   estado del header o queda compacto en una pagina que esta arriba. */
watch(() => route.name, onScroll);

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', volverAlActivo);
});
</script>
