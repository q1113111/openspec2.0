<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="tattoo-heading text-xl">✦ 使用者管理</h2>
      <button class="tattoo-btn-primary" @click="openCreate">
        ✦ 新增使用者
      </button>
    </div>

    <!-- 篩選列 -->
    <div class="flex items-center gap-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋姓名或信箱..."
        class="tattoo-input w-64"
      />
      <select v-model="filterRole" class="tattoo-select w-auto">
        <option value="">所有角色</option>
        <option value="admin">管理員</option>
        <option value="hr">HR</option>
        <option value="employee">員工</option>
      </select>
      <label class="flex items-center gap-2 font-cinzel text-tattoo-warm text-xs uppercase tracking-wider cursor-pointer">
        <input v-model="showInactive" type="checkbox" class="accent-tattoo-red" />
        顯示停用帳號
      </label>
    </div>

    <TattooDivider />

    <div class="tattoo-card p-0 overflow-hidden">
      <div
        v-if="userStore.isLoading"
        class="flex items-center justify-center py-16 font-cinzel text-tattoo-warm text-sm"
      >
        載入中...
      </div>
      <div
        v-else-if="filteredUsers.length === 0"
        class="flex items-center justify-center py-16 font-cinzel text-tattoo-warm text-sm"
      >
        沒有符合條件的使用者
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">姓名</th>
            <th class="tattoo-table-header text-left">電子郵件</th>
            <th class="tattoo-table-header text-left">角色</th>
            <th class="tattoo-table-header text-left">部門</th>
            <th class="tattoo-table-header text-left">到職日</th>
            <th class="tattoo-table-header text-left">狀態</th>
            <th class="tattoo-table-header text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user._id"
            class="tattoo-table-row"
            :class="{ 'opacity-50': !user.isActive }"
          >
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">{{ user.name }}</td>
            <td class="tattoo-table-cell text-tattoo-cream text-xs">{{ user.email }}</td>
            <td class="tattoo-table-cell">
              <span class="tattoo-badge" :class="roleClass(user.role)">
                {{ ROLE_LABELS[user.role] }}
              </span>
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ user.department }}</td>
            <td class="tattoo-table-cell text-tattoo-warm">{{ formatDate(user.employmentDate) }}</td>
            <td class="tattoo-table-cell">
              <span
                class="tattoo-badge"
                :class="user.isActive ? 'text-tattoo-gold border-tattoo-gold' : 'text-tattoo-warm border-tattoo-warm opacity-50'"
              >
                {{ user.isActive ? '啟用' : '停用' }}
              </span>
            </td>
            <td class="tattoo-table-cell">
              <div class="flex items-center gap-3">
                <button
                  class="font-cinzel text-tattoo-gold hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
                  @click="openEdit(user)"
                >
                  編輯
                </button>
                <button
                  class="font-cinzel text-tattoo-warm hover:text-tattoo-gold text-xs uppercase tracking-wider transition-colors"
                  @click="resendEmail(user._id)"
                >
                  重送信
                </button>
                <button
                  v-if="user.isActive"
                  class="font-cinzel text-tattoo-red hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const userStore = useUserStore()

  const searchQuery = ref('')
  const filterRole = ref('')
  const showInactive = ref(false)
  const showForm = ref(false)
  const showDisableModal = ref(false)
  const editTarget = ref<User | null>(null)
  const disableTargetId = ref('')

  const ROLE_LABELS: Record<string, string> = { admin: 'ADMIN', hr: 'HR', employee: 'EMPLOYEE' }

  function roleClass(role: string) {
    if (role === 'admin') return 'text-tattoo-red border-tattoo-red'
    if (role === 'hr') return 'text-tattoo-gold border-tattoo-gold'
    return 'text-tattoo-warm border-tattoo-warm'
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
