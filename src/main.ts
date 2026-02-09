import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@logicflow/core/dist/index.css';
import '@logicflow/extension/lib/style/index.css';
import './assets/css/common.less'
import './assets/css/font.less'
import './assets/css/global.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
