<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">使用者管理</h2>
      <button
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        @click="openCreate"
      >
        + 新增使用者
      </button>
    </div>

    <!-- 篩選 -->
    <div class="flex items-center gap-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋姓名或信箱..."
        class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />
      <select
        v-model="filterRole"
        class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">所有角色</option>
        <option value="admin">管理員</option>
        <option value="hr">HR</option>
        <option value="employee">員工</option>
      </select>
      <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input v-model="showInactive" type="checkbox" class="rounded" />
        顯示停用帳號
      </label>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div
        v-if="userStore.isLoading"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        載入中...
      </div>
      <div
        v-else-if="filteredUsers.length === 0"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        沒有符合條件的使用者
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">姓名</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">電子郵件</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">角色</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">部門</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">到職日</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user._id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-60': !user.isActive }"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ user.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="roleClass(user.role)"
              >
                {{ ROLE_LABELS[user.role] }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ user.department }}</td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(user.employmentDate) }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ user.isActive ? '啟用' : '停用' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button class="text-blue-600 hover:text-blue-800 text-xs" @click="openEdit(user)">
                  編輯
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 text-xs"
                  @click="resendEmail(user._id)"
                >
                  重送信件
                </button>
                <button
                  v-if="user.isActive"
                  class="text-red-500 hover:text-red-700 text-xs"
                  @click="openDisable(user._id)"
                >
                  停用
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserFormModal v-model="showForm" :edit-user="editTarget" @saved="userStore.fetchUsers()" />

    <ConfirmModal
      v-model="showDisableModal"
      title="停用使用者"
      message="確定要停用此使用者帳號嗎？"
      confirm-text="確認停用"
      variant="danger"
      @confirm="handleDisable"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import { useUserStore } from '@/stores/user'
  import type { User } from '@/types'
  import UserFormModal from './UserFormModal.vue'
  import ConfirmModal from '@/components/ConfirmModal.vue'

  const userStore = useUserStore()

  const searchQuery = ref('')
  const filterRole = ref('')
  const showInactive = ref(false)
  const showForm = ref(false)
  const showDisableModal = ref(false)
  const editTarget = ref<User | null>(null)
  const disableTargetId = ref('')

  const ROLE_LABELS: Record<string, string> = { admin: '管理員', hr: 'HR', employee: '員工' }

  function roleClass(role: string) {
    if (role === 'admin') return 'bg-purple-100 text-purple-700'
    if (role === 'hr') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  function formatDate(d: string) {
    return d ? dayjs(d).format('YYYY/MM/DD') : '-'
  }

  const filteredUsers = computed(() => {
    return userStore.users.filter((u) => {
      if (!showInactive.value && !u.isActive) return false
      if (filterRole.value && u.role !== filterRole.value) return false
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      }
      return true
    })
  })

  function openCreate() {
    editTarget.value = null
    showForm.value = true
  }

  function openEdit(user: User) {
    editTarget.value = user
    showForm.value = true
  }

  function openDisable(id: string) {
    disableTargetId.value = id
    showDisableModal.value = true
  }

  async function handleDisable() {
    try {
      await userStore.updateUser(disableTargetId.value, { isActive: false })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '操作失敗')
    }
  }

  async function resendEmail(id: string) {
    try {
      await userStore.resendEmail(id)
      alert('重送成功')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '重送失敗')
    }
  }

  onMounted(() => userStore.fetchUsers())
</script>
