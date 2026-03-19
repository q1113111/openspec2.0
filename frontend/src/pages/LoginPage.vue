<template>
  <div class="login-page min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- 刺青風標題橫幅 -->
      <div v-show="themeStore.theme === 'tattoo'" class="text-center mb-8">
        <TattooBanner>
          <h1 class="tattoo-heading text-2xl">ATTENDANCE</h1>
        </TattooBanner>
        <p class="font-cinzel text-tattoo-warm text-xs uppercase tracking-widest mt-3">
          Management System
        </p>
      </div>

      <!-- MUJI 風標題 -->
      <div v-show="themeStore.theme === 'muji'" class="text-center mb-8">
        <p class="muji-logo-title">出缺勤系統</p>
        <p class="muji-logo-subtitle">Attendance Management</p>
      </div>

      <!-- 登入卡片 -->
      <div class="tattoo-card tattoo-card-double tattoo-corners relative">
        <!-- 四角裝飾（刺青風） -->
        <TattooCorner v-show="themeStore.theme === 'tattoo'" class="absolute top-0 left-0" :size="50" />
        <TattooCorner v-show="themeStore.theme === 'tattoo'" class="absolute top-0 right-0" :size="50" style="transform: scaleX(-1);" />
        <TattooCorner v-show="themeStore.theme === 'tattoo'" class="absolute bottom-0 left-0" :size="50" style="transform: scaleY(-1);" />
        <TattooCorner v-show="themeStore.theme === 'tattoo'" class="absolute bottom-0 right-0" :size="50" style="transform: scale(-1);" />

        <div class="relative z-10">
          <TattooDivider v-show="themeStore.theme === 'tattoo'" class="mb-6" />

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="tattoo-label">電子郵件</label>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="請輸入電子郵件"
                class="tattoo-input"
              />
            </div>

            <div>
              <label class="tattoo-label">密碼</label>
              <input
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="請輸入密碼"
                class="tattoo-input"
              />
            </div>

            <div
              v-if="errorMsg"
              class="error-msg text-sm px-3 py-2 border"
            >
              {{ errorMsg }}
            </div>

            <TattooDivider v-show="themeStore.theme === 'tattoo'" class="my-4" />

            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="tattoo-btn-primary w-full text-center"
            >
              {{ authStore.isLoading ? '登入中...' : '✦ 登入系統 ✦' }}
            </button>
          </form>
        </div>
      </div>

      <!-- MUJI 風頁腳 -->
      <p v-show="themeStore.theme === 'muji'" class="muji-footer">© 2026 出缺勤管理系統</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useThemeStore } from '@/stores/theme'
  import TattooBanner from '@/components/tattoo/TattooBanner.vue'
  import TattooCorner from '@/components/tattoo/TattooCorner.vue'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const authStore = useAuthStore()
  const themeStore = useThemeStore()
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const errorMsg = ref('')

  async function handleLogin() {
    errorMsg.value = ''
    try {
      await authStore.login(email.value, password.value)
      if (authStore.user?.mustChangePassword) {
        router.push('/change-password')
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '登入失敗，請確認帳號密碼'
    }
  }
</script>

<style scoped>
/* ── 頁面背景 ── */
.login-page {
  background-color: var(--tattoo-black);
}

/* ── 錯誤訊息 ── */
.error-msg {
  font-family: 'Cinzel', serif;
  color: var(--tattoo-red);
  border-color: var(--tattoo-red);
  background-color: var(--tattoo-dark);
}

/* ── MUJI Logo 文字 ── */
.muji-logo-title {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--tattoo-cream);
}
.muji-logo-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--tattoo-brown);
  margin-top: 4px;
}

/* ── MUJI 頁腳 ── */
.muji-footer {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--tattoo-brown);
  text-align: center;
  margin-top: 24px;
}
</style>
