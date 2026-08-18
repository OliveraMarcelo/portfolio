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
              :class="{ 'is-active': esSeccionActiva(item) }"
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
        <button
          ref="botonMenuRef"
          class="icon-btn menu-btn"
          type="button"
          :aria-expanded="String(menuAbierto)"
          aria-controls="mobile-menu"
          :aria-label="menuAbierto ? t('menu.close') : t('menu.open')"
          @click="alternarMenu"
        >
          <AppIcon class="ico-menu" name="menu" />
          <AppIcon class="ico-close" name="close" />
        </button>
      </div>
    </div>

    <div id="mobile-menu" ref="panelRef" class="mobile-menu" :class="{ 'is-open': menuAbierto }">
      <ul class="mobile-list">
        <li v-for="item in items" :key="item.name">
          <RouterLink
            class="mobile-link"
            :class="{ 'is-active': esSeccionActiva(item) }"
            :to="item.path"
            :aria-current="esActiva(item.name) ? 'page' : null"
            @click="cerrarMenu"
          >{{ t(item.clave) }}</RouterLink>
        </li>
      </ul>
    </div>
  </header>

  <!-- El velo va FUERA del header: dentro heredaria su contexto de
       apilamiento y el z-index: 90 dejaria de compararse con el del panel. -->
  <div class="nav-scrim" :class="{ 'is-visible': menuAbierto }" aria-hidden="true" @click="cerrarMenu"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import LangToggle from '@/components/ui/LangToggle.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import { useFocusTrap } from '@/composables/useFocusTrap';
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

/* Dos nociones distintas de "activo", y separarlas importa:

   - `esActiva` es exacta y gobierna el `aria-current="page"`. En
     /projects/tienda-jedami NINGUN item del nav es la pagina actual, y
     decir lo contrario le miente al lector de pantalla.
   - `esSeccionActiva` incluye las rutas hijas y gobierna el estado VISUAL.
     Sin ella, al abrir el detalle de un proyecto el visitante pierde toda
     referencia de donde esta. */
const esActiva = (name) => route.name === name;

const esSeccionActiva = (item) => (
  item.path === '/'
    ? route.path === '/'
    : route.path === item.path || route.path.startsWith(`${item.path}/`)
);

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
  const activo = navRef.value?.querySelector('.nav-link.is-active');
  /* Sin destino el indicador se OCULTA en lugar de quedarse donde estaba:
     antes de esto, en una ruta sin item de nav senalaba el ultimo que hubiera
     tocado — que es peor que no senalar nada. */
  if (!activo) {
    indicadorRef.value?.classList.remove('is-ready');
    return;
  }
  moverA(activo);
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
/* `route.path` y no `route.name`: entre dos detalles de proyecto el nombre de
   ruta no cambia, y el indicador tiene que reevaluarse igual. */
watch(() => route.path, reposicionar);
watch(locale, reposicionar);

/* Menu mobile (FR-03). El apilamiento vive en chassis.scss: velo 90 <
   header 100 < panel 105. Sin eso el velo se pinta encima del panel y se
   come los clicks de los enlaces — el defecto que en el prototipo pasó
   desapercibido en dos de cuatro pantallas. */
const menuAbierto = ref(false);
const panelRef = ref(null);
const botonMenuRef = ref(null);
const { abrir, cerrar, alPresionarTab } = useFocusTrap();

function cerrarMenu() {
  if (!menuAbierto.value) return;
  menuAbierto.value = false;
  document.body.style.overflow = '';
  cerrar();
}

async function alternarMenu() {
  menuAbierto.value = !menuAbierto.value;
  if (menuAbierto.value) {
    document.body.style.overflow = 'hidden';
    await nextTick();
    abrir(panelRef.value, botonMenuRef.value);
  } else {
    document.body.style.overflow = '';
    cerrar();
  }
}

function alPresionarTecla(e) {
  if (!menuAbierto.value) return;
  if (e.key === 'Escape') { cerrarMenu(); return; }
  alPresionarTab(e, panelRef.value);
}

/* Cerrar al cambiar de ruta, por si la navegacion viene de otro lado. */
watch(() => route.name, cerrarMenu);

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
  document.addEventListener('keydown', alPresionarTecla);
  window.addEventListener('resize', volverAlActivo);
  if (document.fonts?.ready) {
    document.fonts.ready.then(volverAlActivo).catch(() => { /* noop */ });
  }
});

/* Al navegar, la historia 2.5 lleva el scroll al tope: hay que reevaluar el
   estado del header o queda compacto en una pagina que esta arriba. */
watch(() => route.name, onScroll);

onUnmounted(() => {
  /* Si el componente se desmonta con el menu abierto, el body quedaria
     bloqueado y la pagina no scrollearia. Pasa en el HMR de desarrollo. */
  document.body.style.overflow = '';
  document.removeEventListener('keydown', alPresionarTecla);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', volverAlActivo);
});
</script>
