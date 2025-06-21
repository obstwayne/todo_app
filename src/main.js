import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles.css';
import './assets/leftPanel.css';
import './assets/rightPanel.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia).mount('#app')
// createApp(App).mount('#app')
