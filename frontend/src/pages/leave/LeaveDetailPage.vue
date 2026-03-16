<template>
  <div class="max-w-2xl space-y-5">
    <div class="flex items-center gap-3">
      <RouterLink to="/leave/my" class="text-sm text-gray-500 hover:text-gray-700"
        >← 返回</RouterLink
      >
    </div>

    <div v-if="loading" class="text-sm text-gray-500">載入中...</div>

    <template v-else-if="request">
      <!-- 基本資訊 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">假單詳情</h2>
          <StatusBadge :status="request.status" type="leave" />
        </div>

        <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div v-if="request.userName">
            <dt class="text-gray-500">申請人</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ request.userName }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">假別</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ LEAVE_TYPE_LABELS[request.type] }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">請假期間</dt>
            <dd class="font-medium text-gray-900 mt-0.5">
              {{ formatDate(request.startDate) }} ～ {{ formatDate(request.endDate) }}
            </dd>
          </div>
          <div>
            <dt class="text-gray-500">天數</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ request.totalDays }} 天</dd>
          </div>
          <div v-if="request.proxyUserName">
            <dt class="text-gray-500">代理人</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ request.proxyUserName }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">申請日期</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ formatDate(request.createdAt) }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-gray-500">原因</dt>
            <dd class="font-medium text-gray-900 mt-0.5">{{ request.reason }}</dd>
          </div>
        </dl>
      </div>

      <!-- 審核紀錄 -->
      <div
        v-if="request.approvalHistory.length > 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 class="text-sm font-semibold text-gray-900 mb-3">審核紀錄</h3>
        <div class="space-y-3">
          <div
            v-for="(record, idx) in request.approvalHistory"
            :key="idx"
            class="flex items-start gap-3 text-sm"
          >
            <span
              class="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
              :class="record.action === 'approved' ? 'bg-green-500' : 'bg-red-500'"
            />
            <div>
              <p class="text-gray-900">
                <span class="font-medium">{{ record.userName ?? record.role }}</span>
                <span
                  class="ml-1"
                  :class="record.action === 'approved' ? 'text-green-600' : 'text-red-600'"
                >
                  {{ record.action === 'approved' ? '核准' : '拒絕' }}
                </span>
              </p>
              <p v-if="record.comment" class="text-gray-500 mt-0.5">{{ record.comment }}</p>
              <p class="text-gray-400 text-xs mt-0.5">{{ formatDateTime(record.at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 審核操作（主管/HR） -->
      <div v-if="canApprove" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">審核操作</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">審核意見（可選）</label>
            <textarea
              v-model="comment"
              rows="2"
              placeholder="請輸入審核意見"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div class="flex gap-3">
            <button
              :disabled="approving"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              @click="handleApprove"
            >
              {{ approving ? '處理中...' : '核准' }}
            </button>
            <button
              :disabled="rejecting"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              @click="handleReject"
            >
              {{ rejecting ? '處理中...' : '拒絕' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import api from '@/utils/api'
  import type { LeaveRequest } from '@/types'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import { useAuthStore } from '@/stores/auth'
  import StatusBadge from '@/components/StatusBadge.vue'

  const route = useRoute()
  const authStore = useAuthStore()

  const request = ref<LeaveRequest | null>(null)
  const loading = ref(false)
  const comment = ref('')
  const approving = ref(false)
  const rejecting = ref(false)

  const canApprove = computed(() => {
    const role = authStore.user?.role
    const status = request.value?.status
    if (!role || !status) return false
    return (
      (role === 'admin' || role === 'hr') &&
      (status === 'pending' || status === 'supervisor_approved')
    )
  })

  function formatDate(d: string) {
    return dayjs(d).format('YYYY/MM/DD')
  }
  function formatDateTime(d: string) {
    return dayjs(d).format('YYYY/MM/DD HH:mm')
  }

  async function fetchDetail() {
    loading.value = true
    try {
      const { data } = await api.get(`/leave/requests`)
      const all = data as LeaveRequest[]
      request.value = all.find((r) => r._id === route.params.id) ?? null
    } catch {
      request.value = null
    } finally {
      loading.value = false
    }
  }

  async function handleApprove() {
    approving.value = true
    try {
      await api.post(`/leave/requests/${route.params.id}/approve`, { comment: comment.value })
      await fetchDetail()
      comment.value = ''
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '操作失敗')
    } finally {
      approving.value = false
    }
  }

  async function handleReject() {
    rejecting.value = true
    try {
      await api.post(`/leave/requests/${route.params.id}/reject`, { comment: comment.value })
      await fetchDetail()
      comment.value = ''
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message ?? '操作失敗')
    } finally {
      rejecting.value = false
    }
  }

  onMounted(() => fetchDetail())
</script>
