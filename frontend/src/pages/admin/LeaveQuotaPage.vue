<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="tattoo-heading text-xl">✦ 假別額度管理</h2>
      <select
        v-model="selectedUserId"
        class="tattoo-select w-48"
        @change="fetchBalances"
      >
        <option value="">選擇員工</option>
        <option v-for="u in userStore.users" :key="u._id" :value="u._id">
          {{ u.name }}
        </option>
      </select>
    </div>
    <TattooDivider />

    <div
      v-if="!selectedUserId"
      class="tattoo-card p-12 text-center font-cinzel text-tattoo-warm text-sm"
    >
      請選擇員工以查看假別額度
    </div>

    <div
      v-else-if="loading"
      class="tattoo-card p-12 text-center font-cinzel text-tattoo-warm text-sm"
    >
      載入中...
    </div>

    <div v-else class="tattoo-card p-0 overflow-hidden">
      <div class="px-4 py-3 flex items-center justify-between" style="border-bottom: 1px solid #3a3530;">
        <span class="tattoo-subheading text-sm">{{ selectedUserName }} 的假別餘額</span>
        <button
          v-if="edited"
          :disabled="saving"
          class="tattoo-btn-primary py-1.5 px-4 text-xs"
          @click="handleSave"
        >
          {{ saving ? '儲存中...' : '✦ 儲存變更' }}
        </button>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">假別</th>
            <th class="tattoo-table-header text-left">總額度（天）</th>
            <th class="tattoo-table-header text-left">已使用</th>
            <th class="tattoo-table-header text-left">剩餘</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="balance in editableBalances" :key="balance.type" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">
              {{ LEAVE_TYPE_LABELS[balance.type] }}
            </td>
            <td class="tattoo-table-cell">
              <input
                v-model.number="balance.total"
                type="number"
                min="0"
                step="0.5"
                class="tattoo-input w-24 py-1"
                @input="edited = true"
              />
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ balance.used }}</td>
            <td
              class="tattoo-table-cell font-cinzel-decorative text-lg font-bold"
              :class="balance.remaining <= 0 ? 'text-tattoo-red' : 'text-tattoo-gold'"
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
