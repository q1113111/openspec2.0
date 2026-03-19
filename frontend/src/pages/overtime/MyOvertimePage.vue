<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="tattoo-heading text-xl">✦ 我的加班記錄</h2>
      <button class="tattoo-btn-primary" @click="showForm = true">
        ✦ 申請加班
      </button>
    </div>
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
        目前沒有加班記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">加班日期</th>
            <th class="tattoo-table-header text-left">時間</th>
            <th class="tattoo-table-header text-left">時數</th>
            <th class="tattoo-table-header text-left">原因</th>
            <th class="tattoo-table-header text-left">狀態</th>
            <th class="tattoo-table-header text-left">申請日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req._id" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">{{ formatDate(req.date) }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.startTime }} ～ {{ req.endTime }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.hours.toFixed(1) }} h</td>
            <td class="tattoo-table-cell text-tattoo-warm max-w-xs truncate">{{ req.reason }}</td>
            <td class="tattoo-table-cell">
              <StatusBadge :status="req.status" type="overtime" />
            </td>
            <td class="tattoo-table-cell text-tattoo-warm">{{ formatDate(req.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <OvertimeRequestForm v-model="showForm" @submitted="fetchRequests" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { OvertimeRequest } from '@/types'
  import StatusBadge from '@/components/StatusBadge.vue'
  import OvertimeRequestForm from './OvertimeRequestForm.vue'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const requests = ref<OvertimeRequest[]>([])
  const loading = ref(false)
  const showForm = ref(false)

  function formatDate(d: string) {
    return dayjs(d).format('YYYY/MM/DD')
  }

  async function fetchRequests() {
    loading.value = true
    try {
      const { data } = await api.get('/overtime/requests')
      requests.value = data
    } catch {
      requests.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchRequests())
</script>
