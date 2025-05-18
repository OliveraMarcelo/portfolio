import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import "./styles/sass/main.scss";
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App).use(router).mount('#app')
