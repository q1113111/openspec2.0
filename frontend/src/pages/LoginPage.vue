<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-white text-2xl font-bold">勤</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">出缺勤管理系統</h1>
        <p class="text-gray-500 mt-1 text-sm">請登入以繼續</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">電子郵件</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="請輸入電子郵件"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">密碼</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="請輸入密碼"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.isLoading ? '登入中...' : '登入' }}
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
