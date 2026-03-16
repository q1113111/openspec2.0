import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
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
      user.value = data.user
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore logout errors
    } finally {
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
