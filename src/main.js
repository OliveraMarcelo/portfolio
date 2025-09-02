import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import "./styles/sass/main.scss";
import '@fortawesome/fontawesome-free/css/all.css'
import i18n from './i18n';
createApp(App)
.use(i18n)
.use(router)
.mount('#app')

