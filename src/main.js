import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import "./styles/sass/main.scss";

createApp(App).use(router).mount('#app')
