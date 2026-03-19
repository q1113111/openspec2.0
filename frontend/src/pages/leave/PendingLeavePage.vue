<template>
  <div class="space-y-4">
    <h2 class="tattoo-heading text-xl">✦ 待審假單</h2>
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
        目前沒有待審假單
      </div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="tattoo-table-header text-left">申請人</th>
            <th class="tattoo-table-header text-left">假別</th>
            <th class="tattoo-table-header text-left">請假期間</th>
            <th class="tattoo-table-header text-left">天數</th>
            <th class="tattoo-table-header text-left">狀態</th>
            <th class="tattoo-table-header text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req._id" class="tattoo-table-row">
            <td class="tattoo-table-cell font-cinzel text-tattoo-gold">{{ req.userName }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ LEAVE_TYPE_LABELS[req.type] }}</td>
            <td class="tattoo-table-cell text-tattoo-cream">
              {{ formatDate(req.startDate) }} ～ {{ formatDate(req.endDate) }}
            </td>
            <td class="tattoo-table-cell text-tattoo-cream">{{ req.totalDays }} 天</td>
            <td class="tattoo-table-cell">
              <StatusBadge :status="req.status" type="leave" />
            </td>
            <td class="tattoo-table-cell">
              <RouterLink
                :to="`/leave/${req._id}`"
                class="font-cinzel text-tattoo-gold hover:text-tattoo-cream text-xs uppercase tracking-wider transition-colors"
              >
                ✦ 審核
              </RouterLink>
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
