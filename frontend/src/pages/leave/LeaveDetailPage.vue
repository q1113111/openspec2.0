<template>
  <div class="max-w-2xl space-y-5">
    <div class="flex items-center gap-3">
      <RouterLink
        to="/leave/my"
        class="font-cinzel text-tattoo-warm hover:text-tattoo-gold text-xs uppercase tracking-wider transition-colors"
      >
        ← 返回
      </RouterLink>
    </div>

    <div v-if="loading" class="font-cinzel text-tattoo-warm text-sm">載入中...</div>

    <template v-else-if="request">
      <!-- 基本資訊 -->
      <div class="tattoo-card" style="border-top: 2px solid #DC143C;">
        <div class="flex items-start justify-between mb-4">
          <h2 class="tattoo-heading text-lg">✦ 假單詳情</h2>
          <StatusBadge :status="request.status" type="leave" />
        </div>
        <TattooDivider class="mb-4" />

        <dl class="grid grid-cols-2 gap-x-6 gap-y-4">
          <div v-if="request.userName">
            <dt class="tattoo-label">申請人</dt>
            <dd class="font-cinzel text-tattoo-cream mt-0.5">{{ request.userName }}</dd>
          </div>
          <div>
            <dt class="tattoo-label">假別</dt>
            <dd class="font-cinzel text-tattoo-gold mt-0.5">{{ LEAVE_TYPE_LABELS[request.type] }}</dd>
          </div>
          <div>
            <dt class="tattoo-label">請假期間</dt>
            <dd class="font-cinzel text-tattoo-cream mt-0.5">
              {{ formatDate(request.startDate) }} ～ {{ formatDate(request.endDate) }}
            </dd>
          </div>
          <div>
            <dt class="tattoo-label">天數</dt>
            <dd class="font-cinzel-decorative text-tattoo-red text-xl mt-0.5">{{ request.totalDays }} 天</dd>
          </div>
          <div v-if="request.proxyUserName">
            <dt class="tattoo-label">代理人</dt>
            <dd class="font-cinzel text-tattoo-cream mt-0.5">{{ request.proxyUserName }}</dd>
          </div>
          <div>
            <dt class="tattoo-label">申請日期</dt>
            <dd class="font-cinzel text-tattoo-warm mt-0.5">{{ formatDate(request.createdAt) }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="tattoo-label">原因</dt>
            <dd class="font-cinzel text-tattoo-cream mt-0.5">{{ request.reason }}</dd>
          </div>
        </dl>
      </div>

      <!-- 審核紀錄 -->
      <div
        v-if="request.approvalHistory.length > 0"
        class="tattoo-card"
        style="border-top: 2px solid #DC143C;"
      >
        <h3 class="tattoo-subheading text-sm mb-3">審核紀錄</h3>
        <TattooDivider class="mb-3" />
        <div class="space-y-3">
          <div
            v-for="(record, idx) in request.approvalHistory"
            :key="idx"
            class="flex items-start gap-3"
          >
            <span
              class="mt-1 w-2 h-2 flex-shrink-0"
              :style="{ backgroundColor: record.action === 'approved' ? '#DAA520' : '#DC143C' }"
            />
            <div>
              <p class="font-cinzel text-sm text-tattoo-cream">
                <span class="text-tattoo-gold">{{ record.userName ?? record.role }}</span>
                <span
                  class="ml-1 font-cinzel"
                  :class="record.action === 'approved' ? 'text-tattoo-gold' : 'text-tattoo-red'"
                >
                  {{ record.action === 'approved' ? '核准' : '拒絕' }}
                </span>
              </p>
              <p v-if="record.comment" class="font-cinzel text-tattoo-warm text-xs mt-0.5">{{ record.comment }}</p>
              <p class="font-cinzel text-tattoo-warm text-xs mt-0.5 opacity-60">{{ formatDateTime(record.at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 審核操作（主管/HR） -->
      <div v-if="canApprove" class="tattoo-card" style="border-top: 2px solid #DC143C;">
        <h3 class="tattoo-subheading text-sm mb-3">審核操作</h3>
        <TattooDivider class="mb-4" />
        <div class="space-y-4">
          <div>
            <label class="tattoo-label">審核意見（可選）</label>
            <textarea
              v-model="comment"
              rows="2"
              placeholder="請輸入審核意見"
              class="tattoo-input resize-none"
            />
          </div>
          <div class="flex gap-3">
            <button
              :disabled="approving"
              class="tattoo-btn-primary"
              @click="handleApprove"
            >
              {{ approving ? '處理中...' : '✦ 核准' }}
            </button>
            <button
              :disabled="rejecting"
              class="tattoo-btn-danger"
              @click="handleReject"
            >
              {{ rejecting ? '處理中...' : '✦ 拒絕' }}
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
