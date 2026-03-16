<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-2">修改密碼</h2>
        <p class="text-sm text-gray-500 mb-6">首次登入需要修改密碼，請設定新密碼後繼續使用。</p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">新密碼</label>
            <input
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              placeholder="至少 8 個字元"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">確認新密碼</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="再次輸入新密碼"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {{ errorMsg }}
          </div>

          <div v-if="successMsg" class="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            {{ successMsg }}
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.isLoading ? '處理中...' : '確認修改' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

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
