<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: #0d0d0d;">
    <div class="w-full max-w-md">
      <!-- 標題橫幅 -->
      <div class="text-center mb-8">
        <TattooBanner>
          <h1 class="tattoo-heading text-2xl">ATTENDANCE</h1>
        </TattooBanner>
        <p class="font-cinzel text-tattoo-warm text-xs uppercase tracking-widest mt-3">
          Management System
        </p>
      </div>

      <!-- 登入卡片 -->
      <div class="tattoo-card tattoo-card-double tattoo-corners relative">
        <!-- 四角裝飾 -->
        <TattooCorner class="absolute top-0 left-0" :size="50" />
        <TattooCorner class="absolute top-0 right-0" :size="50" style="transform: scaleX(-1);" />
        <TattooCorner class="absolute bottom-0 left-0" :size="50" style="transform: scaleY(-1);" />
        <TattooCorner class="absolute bottom-0 right-0" :size="50" style="transform: scale(-1);" />

        <div class="relative z-10">
          <TattooDivider class="mb-6" />

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
              class="text-sm font-cinzel px-3 py-2 border border-tattoo-red text-tattoo-red bg-tattoo-dark"
            >
              {{ errorMsg }}
            </div>

            <TattooDivider class="my-4" />

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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import TattooBanner from '@/components/tattoo/TattooBanner.vue'
  import TattooCorner from '@/components/tattoo/TattooCorner.vue'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const authStore = useAuthStore()
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
