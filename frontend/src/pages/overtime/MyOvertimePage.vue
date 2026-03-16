<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">我的加班記錄</h2>
      <button
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        @click="showForm = true"
      >
        + 申請加班
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
        目前沒有加班記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">加班日期</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">時間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">時數</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">原因</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">申請日期</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="req in requests"
            :key="req._id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ formatDate(req.date) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ req.startTime }} ～ {{ req.endTime }}</td>
            <td class="px-4 py-3 text-gray-600">{{ req.hours.toFixed(1) }} h</td>
            <td class="px-4 py-3 text-gray-600 max-w-xs truncate">{{ req.reason }}</td>
            <td class="px-4 py-3">
              <StatusBadge :status="req.status" type="overtime" />
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(req.createdAt) }}</td>
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
