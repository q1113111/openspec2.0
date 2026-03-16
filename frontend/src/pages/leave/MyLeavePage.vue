<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">我的假單</h2>
      <button
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        @click="showForm = true"
      >
        + 申請假單
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-500 text-sm">
        載入中...
      </div>
      <div
        v-else-if="requests.length === 0"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        目前沒有假單記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">假別</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">請假期間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">天數</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">申請日期</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="req in requests"
            :key="req._id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ LEAVE_TYPE_LABELS[req.type] }}</td>
            <td class="px-4 py-3 text-gray-600">
              {{ formatDate(req.startDate) }} ～ {{ formatDate(req.endDate) }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ req.totalDays }} 天</td>
            <td class="px-4 py-3">
              <StatusBadge :status="req.status" type="leave" />
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(req.createdAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <RouterLink
                  :to="`/leave/${req._id}`"
                  class="text-blue-600 hover:text-blue-800 text-xs"
                  >詳情</RouterLink
                >
                <button
                  v-if="req.status === 'pending'"
                  class="text-red-500 hover:text-red-700 text-xs"
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
