import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)

  async function fetchUsers() {
    isLoading.value = true
    try {
      const { data } = await api.get('/users')
      users.value = data
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(payload: Partial<User> & { password?: string }) {
    const { data } = await api.post('/users', payload)
    users.value.push(data)
    return data as User
  }

  async function updateUser(id: string, payload: Partial<User>) {
    const { data } = await api.put(`/users/${id}`, payload)
    const idx = users.value.findIndex((u) => u._id === id)
    if (idx !== -1) users.value[idx] = data
    return data as User
  }

  async function deleteUser(id: string) {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter((u) => u._id !== id)
  }

  async function resendEmail(id: string) {
    await api.post(`/users/${id}/resend-email`)
  }

  function getUserById(id: string) {
    return users.value.find((u) => u._id === id)
  }

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resendEmail,
    getUserById,
  }
})
