import { createApp } from 'vue'
import './registerServiceWorker'
import router from './router'

/* Orden obligatorio: los tokens primero, después la base que los consume,
   y al final los módulos heredados.

   `App.vue` se importa DESPUÉS de los estilos a propósito: su bloque
   `<style>` no es scoped, y webpack emite el CSS en el orden en que
   resuelve los imports. Importándolo antes, sus reglas quedaban en el
   bundle por delante de tokens.css. Hoy no rompe nada —`var()` se
   resuelve en tiempo de valor computado, no de parseo— pero el primer
   componente que necesite pisar algo de base.scss perdería sin motivo
   aparente. */
import './styles/tokens.css'
import './styles/fonts.scss'
import './styles/base.scss'
import './styles/chassis.scss'
import './styles/animations.scss'
import './styles/sections.scss'
import './styles/components.scss'

import App from './App.vue'
import reveal from './directives/reveal'
import i18n from './i18n';

createApp(App)
.use(i18n)
.use(router)
.directive('reveal', reveal)
.mount('#app')
