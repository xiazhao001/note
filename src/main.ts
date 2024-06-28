import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// init db
import {sequelizeInit} from "./service/initSequelize"
sequelizeInit();

createApp(App).use(router).mount('#app')
