import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 在 mount 前先確認登入狀態，避免 router guard 誤判跳轉造成閃爍
const authStore = useAuthStore()
authStore
  .fetchMe()
  .catch(() => {})
  .finally(() => {
    app.use(router)
    app.mount('#app')
  })
