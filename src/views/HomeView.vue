<template>
  <div class="home">
    <HeroSection />

    <section class="section" id="proyectos" aria-labelledby="titulo-destacados">
      <div class="container">
        <SectionHeading id="titulo-destacados" :title="t('home.destacadosTitulo')">
          {{ t('home.destacadosLede') }}
        </SectionHeading>

        <ProjectGrid :items="destacados" :heading-level="3" />

        <p class="section-foot" v-reveal>
          <RouterLink class="link-arrow" to="/projects">
            {{ t('home.verTodos') }}
            <AppIcon name="arrow" />
          </RouterLink>
        </p>
      </div>
    </section>

    <section class="section section-alt" id="stack" aria-labelledby="titulo-stack">
      <div class="container">
        <SectionHeading id="titulo-stack" :title="t('habilidades.titulo')">
          {{ t('habilidades.lede') }}
        </SectionHeading>

        <SkillGrid :groups="skills" />
      </div>
    </section>

    <section class="section" id="trayectoria" aria-labelledby="titulo-trayectoria">
      <div class="container">
        <SectionHeading
          id="titulo-trayectoria"
          :kicker="t('trayectoria.kicker')"
          :title="t('trayectoria.titulo')"
        />

        <!-- La Home resume: solo los hitos de trabajo. Quien filtra es la
             vista, no el componente — mismo criterio que ProjectGrid y
             SkillGrid. TimelineItem es el MISMO de Sobre mi. -->
        <ol class="timeline">
          <span class="timeline-rail" aria-hidden="true"><span class="timeline-progress"></span></span>
          <TimelineItem
            v-for="(hito, i) in trayectoriaLaboral"
            :key="hito.id"
            v-reveal="{ delay: i * 70 }"
            :item="hito"
          />
        </ol>

        <p class="section-foot" v-reveal>
          <RouterLink class="link-arrow" to="/about">
            {{ t('home.verTrayectoria') }}
            <AppIcon name="arrow" />
          </RouterLink>
        </p>
      </div>
    </section>

    <ContactSection :channels="contact" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import HeroSection from '@/components/sections/HeroSection.vue';
import ProjectGrid from '@/components/sections/ProjectGrid.vue';
import AppIcon from '@/components/ui/AppIcon.vue';
import SkillGrid from '@/components/sections/SkillGrid.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import TimelineItem from '@/components/sections/TimelineItem.vue';
import ContactSection from '@/components/sections/ContactSection.vue';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { timeline } from '@/content/timeline';
import { contact } from '@/content/contact';

/* El IntersectionObserver local que agregaba `.loaded` se elimino: lo
   reemplaza la directiva v-reveal de la historia 2.7. Dos observers
   compitiendo es justo lo que D7 evita. */

const { t } = useI18n();

/* El filtro sale del dato (`featured`), no de tomar los primeros tres.

   Y el `.slice(0, 3)` no es redundante aunque hoy `featured` devuelva
   exactamente tres: FR-08 dice "maximo 3", y el dia que se marque un cuarto
   proyecto sin pensarlo la Home mostraria cuatro sin que nadie toque esta
   vista. Convierte el requisito en una garantia estructural. */
const destacados = computed(() => projects.filter((p) => p.featured).slice(0, 3));

/* El resumen de la Home muestra la trayectoria laboral; el detalle completo
   —formacion y perfil personal incluidos— vive en Sobre mi. */
const trayectoriaLaboral = computed(() => timeline.filter((h) => h.type === 'work'));
</script>
