import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

/* Orden obligatorio: los tokens primero, después la base que los consume,
   y al final los módulos heredados. Cambiarlo hace que los estilos base
   pisen o sean pisados de forma impredecible. */
import './styles/tokens.css'
import './styles/base.scss'
import './styles/sass/main.scss'

import i18n from './i18n';
createApp(App)
.use(i18n)
.use(router)
.mount('#app')
