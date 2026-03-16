<template>
  <div class="space-y-6">
    <!-- 今日打卡狀態 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900">今日出勤</h2>
        <span class="text-sm text-gray-500">{{ todayDate }}</span>
      </div>

      <div v-if="loadingAttendance" class="text-sm text-gray-500">載入中...</div>
      <div v-else class="flex items-center gap-6">
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">上班打卡</p>
            <p
              class="text-lg font-semibold"
              :class="todayAttendance?.clockIn ? 'text-green-600' : 'text-gray-400'"
            >
              {{ todayAttendance?.clockIn ? formatTime(todayAttendance.clockIn) : '尚未打卡' }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-md p-4">
            <p class="text-xs text-gray-500 mb-1">下班打卡</p>
            <p
              class="text-lg font-semibold"
              :class="todayAttendance?.clockOut ? 'text-blue-600' : 'text-gray-400'"
            >
              {{ todayAttendance?.clockOut ? formatTime(todayAttendance.clockOut) : '尚未打卡' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button
            v-if="!todayAttendance?.clockIn"
            :disabled="clockingIn"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            @click="handleClockIn"
          >
            {{ clockingIn ? '打卡中...' : '上班打卡' }}
          </button>
          <button
            v-if="todayAttendance?.clockIn && !todayAttendance?.clockOut"
            :disabled="clockingOut"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            @click="handleClockOut"
          >
            {{ clockingOut ? '打卡中...' : '下班打卡' }}
          </button>
          <div
            v-if="todayAttendance?.clockIn && todayAttendance?.clockOut"
            class="text-sm text-gray-500 text-center"
          >
            今日已完成打卡
          </div>
        </div>
      </div>
    </div>

    <!-- 假別餘額 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">假別餘額</h2>
      <div v-if="loadingBalances" class="text-sm text-gray-500">載入中...</div>
      <div v-else-if="leaveBalances.length === 0" class="text-sm text-gray-500">無假別資料</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="balance in leaveBalances" :key="balance.type" class="bg-gray-50 rounded-md p-3">
          <p class="text-xs text-gray-500 mb-1">{{ LEAVE_TYPE_LABELS[balance.type] }}</p>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-bold text-blue-600">{{ balance.remaining }}</span>
            <span class="text-xs text-gray-400">/ {{ balance.total }} 天</span>
          </div>
          <div class="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 rounded-full transition-all"
              :style="{
                width: balance.total > 0 ? `${(balance.remaining / balance.total) * 100}%` : '0%',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-2 gap-4">
      <RouterLink
        to="/leave/my"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition-colors group"
      >
        <div class="text-2xl mb-2">📅</div>
        <p class="font-medium text-gray-900 group-hover:text-blue-600">申請假單</p>
        <p class="text-xs text-gray-500 mt-0.5">查看並申請請假</p>
      </RouterLink>
      <RouterLink
        to="/overtime/my"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition-colors group"
      >
        <div class="text-2xl mb-2">⏰</div>
        <p class="font-medium text-gray-900 group-hover:text-blue-600">申請加班</p>
        <p class="text-xs text-gray-500 mt-0.5">查看並申請加班</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { Attendance, LeaveBalance } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'

  const todayDate = dayjs().format('YYYY年MM月DD日')
  const todayAttendance = ref<Attendance | null>(null)
  const leaveBalances = ref<LeaveBalance[]>([])
  const loadingAttendance = ref(false)
  const loadingBalances = ref(false)
  const clockingIn = ref(false)
  const clockingOut = ref(false)

  function formatTime(isoStr: string) {
    return dayjs(isoStr).format('HH:mm')
  }

  async function fetchTodayAttendance() {
    loadingAttendance.value = true
    try {
      const { data } = await api.get('/attendance/today')
      todayAttendance.value = data
    } catch {
      todayAttendance.value = null
    } finally {
      loadingAttendance.value = false
    }
  }

  async function fetchBalances() {
    loadingBalances.value = true
    try {
      const { data } = await api.get('/leave/balances')
      leaveBalances.value = data
    } catch {
      leaveBalances.value = []
    } finally {
      loadingBalances.value = false
    }
  }

  async function handleClockIn() {
    clockingIn.value = true
    try {
      const { data } = await api.post('/attendance/clock-in')
      todayAttendance.value = data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '打卡失敗')
    } finally {
      clockingIn.value = false
    }
  }

  async function handleClockOut() {
    clockingOut.value = true
    try {
      const { data } = await api.post('/attendance/clock-out')
      todayAttendance.value = data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '打卡失敗')
    } finally {
      clockingOut.value = false
    }
  }

  onMounted(() => {
    fetchTodayAttendance()
    fetchBalances()
  })
</script>
