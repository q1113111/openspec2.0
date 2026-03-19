<template>
  <div class="space-y-4">
    <!-- 頁面標題 -->
    <div class="flex items-center justify-between">
      <h2 class="tattoo-heading text-xl">✦ 我的假單</h2>
      <button class="tattoo-btn-primary" @click="showForm = true">
        ✦ 申請假單
      </button>
    </div>
    <TattooDivider />

    <!-- 表格 -->
    <div class="tattoo-card p-0 overflow-hidden">
      <div
        v-if="loading"
        class="flex items-center justify-center py-16 font-cinzel text-tattoo-warm text-sm"
      >
        載入中...
      </div>
      <div
        v-else-if="requests.length === 0"
        class="flex items-center justify-center py-16 font-cinzel text-tattoo-warm text-sm"
      >
        目前沒有假單記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">假別</th>
            <th class="tattoo-table-header text-left">請假期間</th>
            <th class="tattoo-table-header text-left">天數</th>
            <th class="tattoo-table-header text-left">狀態</th>
            <th class="tattoo-table-header text-left">申請日期</th>
            <th class="tattoo-table-header text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req._id" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">{{ LEAVE_TYPE_LABELS[req.type] }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ formatDate(req.startDate) }} ～ {{ formatDate(req.endDate) }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.totalDays }} 天</td>
            <td class="tattoo-table-cell">
              <StatusBadge :status="req.status" type="leave" />
            </td>
            <td class="tattoo-table-cell text-tattoo-warm">{{ formatDate(req.createdAt) }}</td>
            <td class="tattoo-table-cell">
              <div class="flex items-center gap-3">
                <RouterLink
                  :to="`/leave/${req._id}`"
                  class="font-cinzel text-tattoo-gold hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
                >
                  詳情
                </RouterLink>
                <button
                  v-if="req.status === 'pending'"
                  class="font-cinzel text-tattoo-red hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
                  @click="openCancelConfirm(req._id)"
                >
                  撤回
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <LeaveRequestForm v-model="showForm" @submitted="fetchRequests" />

    <ConfirmModal
      v-model="showCancelModal"
      title="撤回假單"
      message="確定要撤回此假單嗎？此操作無法復原。"
      confirm-text="確認撤回"
      variant="danger"
      @confirm="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { LeaveRequest } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import StatusBadge from '@/components/StatusBadge.vue'
  import ConfirmModal from '@/components/ConfirmModal.vue'
  import LeaveRequestForm from './LeaveRequestForm.vue'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const requests = ref<LeaveRequest[]>([])
  const loading = ref(false)
  const showForm = ref(false)
  const showCancelModal = ref(false)
  const cancelTargetId = ref('')

  function formatDate(d: string) {
    return dayjs(d).format('YYYY/MM/DD')
  }

  async function fetchRequests() {
    loading.value = true
    try {
      const { data } = await api.get('/leave/requests')
      requests.value = data
    } catch {
      requests.value = []
    } finally {
      loading.value = false
    }
  }

  function openCancelConfirm(id: string) {
    cancelTargetId.value = id
    showCancelModal.value = true
  }

  async function handleCancel() {
    try {
      await api.delete(`/leave/requests/${cancelTargetId.value}`)
      await fetchRequests()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '撤回失敗')
    }
  }

  onMounted(() => fetchRequests())
</script>
