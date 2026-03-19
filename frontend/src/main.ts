import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import './style/tattoo.css'
import './style/muji.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化主題（從 localStorage 恢復）
const themeStore = useThemeStore()
themeStore.init()

// 在 mount 前先確認登入狀態，避免 router guard 誤判跳轉造成閃爍
const authStore = useAuthStore()
authStore
  .fetchMe()
  .catch(() => {})
  .finally(() => {
    app.use(router)
    app.mount('#app')
  })
