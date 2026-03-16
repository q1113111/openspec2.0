import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { TOKEN_KEYS } from '@/utils/api'
import type { UserRole } from '@/types'

interface AuthUser {
  _id: string
  name: string
  email: string
  role: UserRole
  mustChangePassword: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)

  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem(TOKEN_KEYS.access, data.accessToken)
      localStorage.setItem(TOKEN_KEYS.refresh, data.refreshToken)
      user.value = data.user
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh)
      await api.post('/auth/logout', { refreshToken })
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem(TOKEN_KEYS.access)
      localStorage.removeItem(TOKEN_KEYS.refresh)
      user.value = null
      isLoading.value = false
    }
  }

  async function fetchMe() {
    isLoading.value = true
    try {
      const { data } = await api.get('/users/me')
      user.value = data
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(newPassword: string) {
    isLoading.value = true
    try {
      await api.put('/auth/change-password', { newPassword })
      if (user.value) {
        user.value.mustChangePassword = false
      }
    } finally {
      isLoading.value = false
    }
  }

  return { user, isLoading, login, logout, fetchMe, changePassword }
})
