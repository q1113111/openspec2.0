<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">待審加班</h2>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-500 text-sm">
        載入中...
      </div>
      <div
        v-else-if="requests.length === 0"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        目前沒有待審加班申請
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">申請人</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">加班日期</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">時間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">時數</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="req in requests"
            :key="req._id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ req.userName }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(req.date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ req.startTime }} ～ {{ req.endTime }}</td>
            <td class="px-4 py-3 text-gray-600">{{ req.hours.toFixed(1) }} h</td>
            <td class="px-4 py-3">
              <StatusBadge :status="req.status" type="overtime" />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  class="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 rounded hover:bg-green-50"
                  @click="openApprove(req._id)"
                >
                  核准
                </button>
                <button
                  class="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                  @click="openReject(req._id)"
                >
                  拒絕
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 核准確認 -->
    <ConfirmModal
      v-model="showApproveModal"
      title="核准加班申請"
      message="確定要核准此加班申請嗎？"
      confirm-text="確認核准"
      variant="primary"
      @confirm="handleApprove"
    />

    <!-- 拒絕確認 -->
    <ConfirmModal
      v-model="showRejectModal"
      title="拒絕加班申請"
      message="確定要拒絕此加班申請嗎？"
      confirm-text="確認拒絕"
      variant="danger"
      @confirm="handleReject"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { OvertimeRequest } from '@/types'
  import StatusBadge from '@/components/StatusBadge.vue'
  import ConfirmModal from '@/components/ConfirmModal.vue'

  const requests = ref<OvertimeRequest[]>([])
  const loading = ref(false)
  const showApproveModal = ref(false)
  const showRejectModal = ref(false)
  const targetId = ref('')

  function formatDate(d: string) {
    return dayjs(d).format('YYYY/MM/DD')
  }

  async function fetchRequests() {
    loading.value = true
    try {
      const { data } = await api.get('/overtime/requests/pending')
      requests.value = data
    } catch {
      requests.value = []
    } finally {
      loading.value = false
    }
  }

  function openApprove(id: string) {
    targetId.value = id
    showApproveModal.value = true
  }

  function openReject(id: string) {
    targetId.value = id
    showRejectModal.value = true
  }

  async function handleApprove() {
    try {
      await api.post(`/overtime/requests/${targetId.value}/approve`)
      await fetchRequests()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '操作失敗')
    }
  }

  async function handleReject() {
    try {
      await api.post(`/overtime/requests/${targetId.value}/reject`)
      await fetchRequests()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '操作失敗')
    }
  }

  onMounted(() => fetchRequests())
</script>
