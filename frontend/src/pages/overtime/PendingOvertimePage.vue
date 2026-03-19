<template>
  <div class="space-y-4">
    <h2 class="tattoo-heading text-xl">✦ 待審加班</h2>
    <TattooDivider />

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
        目前沒有待審加班申請
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">申請人</th>
            <th class="tattoo-table-header text-left">加班日期</th>
            <th class="tattoo-table-header text-left">時間</th>
            <th class="tattoo-table-header text-left">時數</th>
            <th class="tattoo-table-header text-left">狀態</th>
            <th class="tattoo-table-header text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req._id" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">{{ req.userName }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ formatDate(req.date) }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.startTime }} ～ {{ req.endTime }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.hours.toFixed(1) }} h</td>
            <td class="tattoo-table-cell">
              <StatusBadge :status="req.status" type="overtime" />
            </td>
            <td class="tattoo-table-cell">
              <div class="flex items-center gap-3">
                <button
                  class="font-cinzel text-tattoo-gold hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
                  @click="openApprove(req._id)"
                >
                  ✦ 核准
                </button>
                <button
                  class="font-cinzel text-tattoo-red hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
                  @click="openReject(req._id)"
                >
                  ✦ 拒絕
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      v-model="showApproveModal"
      title="核准加班申請"
      message="確定要核准此加班申請嗎？"
      confirm-text="確認核准"
      variant="primary"
      @confirm="handleApprove"
    />

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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
