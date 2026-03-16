<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">待審假單</h2>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-500 text-sm">
        載入中...
      </div>
      <div
        v-else-if="requests.length === 0"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        目前沒有待審假單
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">申請人</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">假別</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">請假期間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">天數</th>
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
            <td class="px-4 py-3 text-gray-600">{{ LEAVE_TYPE_LABELS[req.type] }}</td>
            <td class="px-4 py-3 text-gray-600">
              {{ formatDate(req.startDate) }} ～ {{ formatDate(req.endDate) }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ req.totalDays }} 天</td>
            <td class="px-4 py-3">
              <StatusBadge :status="req.status" type="leave" />
            </td>
            <td class="px-4 py-3">
              <RouterLink
                :to="`/leave/${req._id}`"
                class="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >審核</RouterLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { LeaveRequest } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import StatusBadge from '@/components/StatusBadge.vue'

  const requests = ref<LeaveRequest[]>([])
  const loading = ref(false)

  function formatDate(d: string) {
    return dayjs(d).format('YYYY/MM/DD')
  }

  async function fetchRequests() {
    loading.value = true
    try {
      const { data } = await api.get('/leave/requests/pending')
      requests.value = data
    } catch {
      requests.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchRequests())
</script>
