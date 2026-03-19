<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--tattoo-black);">
    <div class="w-full max-w-md">
      <!-- 標題 -->
      <div class="text-center mb-8">
        <TattooBanner>
          <h1 class="tattoo-heading text-xl">CHANGE PASSWORD</h1>
        </TattooBanner>
        <p class="font-cinzel text-tattoo-warm text-xs uppercase tracking-widest mt-3">
          首次登入需設定新密碼
        </p>
      </div>

      <!-- 卡片 -->
      <div class="tattoo-card tattoo-card-double tattoo-corners relative">
        <TattooCorner class="absolute top-0 left-0" :size="50" />
        <TattooCorner class="absolute top-0 right-0" :size="50" style="transform: scaleX(-1);" />
        <TattooCorner class="absolute bottom-0 left-0" :size="50" style="transform: scaleY(-1);" />
        <TattooCorner class="absolute bottom-0 right-0" :size="50" style="transform: scale(-1);" />

        <div class="relative z-10">
          <TattooDivider class="mb-6" />

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="tattoo-label">新密碼</label>
              <input
                v-model="newPassword"
                type="password"
                required
                minlength="8"
                placeholder="至少 8 個字元"
                class="tattoo-input"
              />
            </div>

            <div>
              <label class="tattoo-label">確認新密碼</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="再次輸入新密碼"
                class="tattoo-input"
              />
            </div>

            <div
              v-if="errorMsg"
              class="text-sm font-cinzel px-3 py-2 border border-tattoo-red text-tattoo-red bg-tattoo-dark"
            >
              {{ errorMsg }}
            </div>

            <div
              v-if="successMsg"
              class="text-sm font-cinzel px-3 py-2 border border-tattoo-gold text-tattoo-gold bg-tattoo-dark"
            >
              {{ successMsg }}
            </div>

            <TattooDivider class="my-4" />

            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="tattoo-btn-primary w-full text-center"
            >
              {{ authStore.isLoading ? '處理中...' : '✦ 確認修改 ✦' }}
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

  const newPassword = ref('')
  const confirmPassword = ref('')
  const errorMsg = ref('')
  const successMsg = ref('')

  async function handleSubmit() {
    errorMsg.value = ''
    successMsg.value = ''

    if (newPassword.value !== confirmPassword.value) {
      errorMsg.value = '兩次輸入的密碼不一致'
      return
    }

    if (newPassword.value.length < 8) {
      errorMsg.value = '密碼至少需要 8 個字元'
      return
    }

    try {
      await authStore.changePassword(newPassword.value)
      successMsg.value = '密碼修改成功，即將跳轉...'
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '密碼修改失敗，請重試'
    }
  }
</script>
