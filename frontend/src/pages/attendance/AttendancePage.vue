<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">出勤記錄</h2>
      <div class="flex items-center gap-3">
        <input
          v-model="filterMonth"
          type="month"
          class="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="fetchAttendance"
        />
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-500 text-sm">
        載入中...
      </div>
      <div
        v-else-if="records.length === 0"
        class="flex items-center justify-center py-16 text-gray-500 text-sm"
      >
        本月無出勤記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-600">日期</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">上班時間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">下班時間</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">工作時數</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">遲到分鐘</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in records"
            :key="record._id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ formatDate(record.date) }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ record.clockIn ? formatTime(record.clockIn) : '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ record.clockOut ? formatTime(record.clockOut) : '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ record.workHours != null ? `${record.workHours.toFixed(1)} h` : '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ record.lateMinutes ? `${record.lateMinutes} 分` : '-' }}
            </td>
            <td class="px-4 py-3">
              <StatusBadge :status="record.status" type="attendance" />
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
  import type { Attendance } from '@/types'
  import StatusBadge from '@/components/StatusBadge.vue'

  const records = ref<Attendance[]>([])
  const loading = ref(false)
  const filterMonth = ref(dayjs().format('YYYY-MM'))

  function formatDate(d: string) {
    return dayjs(d).format('MM/DD (ddd)')
  }
  function formatTime(t: string) {
    return dayjs(t).format('HH:mm')
  }

  async function fetchAttendance() {
    loading.value = true
    try {
      const [year, month] = filterMonth.value.split('-')
      const { data } = await api.get('/attendance', {
        params: { year, month },
      })
      records.value = data
    } catch {
      records.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchAttendance())
</script>
