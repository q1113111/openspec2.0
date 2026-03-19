<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <div>
      <h2 class="tattoo-heading text-xl">✦ 今日出勤 ✦</h2>
      <TattooDivider class="mt-2" />
    </div>

    <!-- 今日打卡狀態 -->
    <div class="tattoo-card tattoo-corners relative" style="border-top: 2px solid #DC143C;">
      <div class="flex items-center justify-between mb-4">
        <span class="tattoo-subheading text-sm">打卡狀態</span>
        <span class="font-cinzel text-tattoo-warm text-xs">{{ todayDate }}</span>
      </div>

      <div v-if="loadingAttendance" class="font-cinzel text-tattoo-warm text-sm">載入中...</div>
      <div v-else class="flex items-center gap-6">
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div class="bg-tattoo-dark border border-tattoo-border p-4">
            <p class="tattoo-label mb-1">上班打卡</p>
            <p
              class="font-cinzel-decorative text-2xl font-bold"
              :class="todayAttendance?.clockIn ? 'text-tattoo-gold' : 'text-tattoo-warm opacity-40'"
            >
              {{ todayAttendance?.clockIn ? formatTime(todayAttendance.clockIn) : '--:--' }}
            </p>
          </div>
          <div class="bg-tattoo-dark border border-tattoo-border p-4">
            <p class="tattoo-label mb-1">下班打卡</p>
            <p
              class="font-cinzel-decorative text-2xl font-bold"
              :class="todayAttendance?.clockOut ? 'text-tattoo-gold' : 'text-tattoo-warm opacity-40'"
            >
              {{ todayAttendance?.clockOut ? formatTime(todayAttendance.clockOut) : '--:--' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button
            v-if="!todayAttendance?.clockIn"
            :disabled="clockingIn"
            class="tattoo-btn-primary"
            @click="handleClockIn"
          >
            {{ clockingIn ? '打卡中...' : '✦ 上班打卡' }}
          </button>
          <button
            v-if="todayAttendance?.clockIn && !todayAttendance?.clockOut"
            :disabled="clockingOut"
            class="tattoo-btn-danger"
            @click="handleClockOut"
          >
            {{ clockingOut ? '打卡中...' : '✦ 下班打卡' }}
          </button>
          <div
            v-if="todayAttendance?.clockIn && todayAttendance?.clockOut"
            class="font-cinzel text-tattoo-gold text-xs uppercase tracking-wider text-center"
          >
            ✦ 今日已完成打卡 ✦
          </div>
        </div>
      </div>
    </div>

    <!-- 假別餘額 -->
    <div>
      <h2 class="tattoo-heading text-lg mb-3">✦ 假別餘額</h2>
      <div v-if="loadingBalances" class="font-cinzel text-tattoo-warm text-sm">載入中...</div>
      <div v-else-if="leaveBalances.length === 0" class="font-cinzel text-tattoo-warm text-sm">無假別資料</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="balance in leaveBalances"
          :key="balance.type"
          class="tattoo-card p-3"
          style="border-top: 2px solid #DC143C;"
        >
          <p class="tattoo-label">{{ LEAVE_TYPE_LABELS[balance.type] }}</p>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="font-cinzel-decorative text-2xl font-bold text-tattoo-red">{{ balance.remaining }}</span>
            <span class="font-cinzel text-tattoo-warm text-xs">/ {{ balance.total }} 天</span>
          </div>
          <!-- 進度條 -->
          <div class="mt-2 h-1.5 bg-tattoo-dark border border-tattoo-gold overflow-hidden">
            <div
              class="h-full bg-tattoo-red transition-all"
              :style="{
                width: balance.total > 0 ? `${(balance.remaining / balance.total) * 100}%` : '0%',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div>
      <h2 class="tattoo-heading text-lg mb-3">✦ 快速操作</h2>
      <div class="grid grid-cols-2 gap-4">
        <RouterLink
          to="/leave/my"
          class="tattoo-card hover:border-tattoo-gold transition-colors group"
          style="border-top: 2px solid #DC143C;"
        >
          <div class="text-2xl mb-2">📅</div>
          <p class="tattoo-subheading text-sm group-hover:text-tattoo-gold">申請假單</p>
          <p class="font-cinzel text-tattoo-warm text-xs mt-0.5 uppercase tracking-wider">查看並申請請假</p>
        </RouterLink>
        <RouterLink
          to="/overtime/my"
          class="tattoo-card hover:border-tattoo-gold transition-colors group"
          style="border-top: 2px solid #DC143C;"
        >
          <div class="text-2xl mb-2">⏰</div>
          <p class="tattoo-subheading text-sm group-hover:text-tattoo-gold">申請加班</p>
          <p class="font-cinzel text-tattoo-warm text-xs mt-0.5 uppercase tracking-wider">查看並申請加班</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { Attendance, LeaveBalance } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
