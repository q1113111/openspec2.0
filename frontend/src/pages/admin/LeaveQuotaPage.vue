<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">假別額度管理</h2>
      <div class="flex items-center gap-3">
        <select
          v-model="selectedUserId"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          @change="fetchBalances"
        >
          <option value="">選擇員工</option>
          <option v-for="u in userStore.users" :key="u._id" :value="u._id">
            {{ u.name }}
          </option>
        </select>
      </div>
    </div>

    <div
      v-if="!selectedUserId"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500 text-sm"
    >
      請選擇員工以查看假別額度
    </div>

    <div
      v-else-if="loading"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500 text-sm"
    >
      載入中...
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">{{ selectedUserName }} 的假別餘額</span>
        <button
          v-if="edited"
          :disabled="saving"
          class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
          @click="handleSave"
        >
          {{ saving ? '儲存中...' : '儲存變更' }}
        </button>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">假別</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">總額度（天）</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">已使用</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">剩餘</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="balance in editableBalances"
            :key="balance.type"
            class="border-b border-gray-100"
          >
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ LEAVE_TYPE_LABELS[balance.type] }}
            </td>
            <td class="px-4 py-3">
              <input
                v-model.number="balance.total"
                type="number"
                min="0"
                step="0.5"
                class="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="edited = true"
              />
            </td>
            <td class="px-4 py-3 text-gray-600">{{ balance.used }}</td>
            <td
              class="px-4 py-3 font-medium"
              :class="balance.remaining <= 0 ? 'text-red-600' : 'text-green-600'"
            >
              {{ balance.total - balance.used }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import api from '@/utils/api'
  import type { LeaveBalance, LeaveType } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  const selectedUserId = ref('')
  const loading = ref(false)
  const saving = ref(false)
  const edited = ref(false)
  const editableBalances = ref<(LeaveBalance & { remaining: number })[]>([])

  const selectedUserName = computed(() => {
    return userStore.users.find((u) => u._id === selectedUserId.value)?.name ?? ''
  })

  async function fetchBalances() {
    if (!selectedUserId.value) return
    loading.value = true
    edited.value = false
    try {
      const { data } = await api.get('/leave/balances', {
        params: { userId: selectedUserId.value },
      })
      editableBalances.value = (data as LeaveBalance[]).map((b) => ({
        ...b,
        remaining: b.remaining,
      }))
    } catch {
      editableBalances.value = []
    } finally {
      loading.value = false
    }
  }

  async function handleSave() {
    saving.value = true
    try {
      const updates: Record<LeaveType, number> = {} as Record<LeaveType, number>
      editableBalances.value.forEach((b) => {
        updates[b.type] = b.total
      })
      await api.put('/leave/balances', {
        userId: selectedUserId.value,
        quotas: updates,
      })
      edited.value = false
      await fetchBalances()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '儲存失敗')
    } finally {
      saving.value = false
    }
  }

  onMounted(() => userStore.fetchUsers())
</script>
