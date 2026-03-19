<template>
  <div class="space-y-4">
    <!-- 頁面標題 + 篩選 -->
    <div class="flex items-center justify-between">
      <h2 class="tattoo-heading text-xl">✦ 出勤記錄</h2>
      <input
        v-model="filterMonth"
        type="month"
        class="tattoo-input w-auto"
        @change="fetchAttendance"
      />
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
        v-else-if="records.length === 0"
        class="flex items-center justify-center py-16 font-cinzel text-tattoo-warm text-sm"
      >
        本月無出勤記錄
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">日期</th>
            <th class="tattoo-table-header text-left">上班時間</th>
            <th class="tattoo-table-header text-left">下班時間</th>
            <th class="tattoo-table-header text-left">工作時數</th>
            <th class="tattoo-table-header text-left">遲到分鐘</th>
            <th class="tattoo-table-header text-left">狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record._id" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">
              {{ formatDate(record.date) }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ record.clockIn ? formatTime(record.clockIn) : '-' }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ record.clockOut ? formatTime(record.clockOut) : '-' }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ record.workHours != null ? `${record.workHours.toFixed(1)} h` : '-' }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ record.lateMinutes ? `${record.lateMinutes} 分` : '-' }}
            </td>
            <td class="tattoo-table-cell">
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
