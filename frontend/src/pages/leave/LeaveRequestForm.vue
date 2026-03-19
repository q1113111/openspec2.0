<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="$emit('update:modelValue', false)" />
      <div class="relative tattoo-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal 標題列 -->
        <div class="flex items-center justify-between mb-4" style="border-bottom: 1px solid #3a3530; padding-bottom: 1rem;">
          <h3 class="tattoo-heading text-base">✦ 申請假單</h3>
          <button
            type="button"
            class="font-cinzel text-tattoo-warm hover:text-tattoo-gold transition-colors text-lg"
            @click="$emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="tattoo-label">假別</label>
            <select v-model="form.type" required class="tattoo-select">
              <option value="">請選擇假別</option>
              <option v-for="(label, value) in LEAVE_TYPE_LABELS" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tattoo-label">開始日期</label>
              <input v-model="form.startDate" type="date" required class="tattoo-input" />
            </div>
            <div>
              <label class="tattoo-label">結束日期</label>
              <input v-model="form.endDate" type="date" required :min="form.startDate" class="tattoo-input" />
            </div>
          </div>

          <div>
            <label class="tattoo-label">代理人（可選）</label>
            <select v-model="form.proxyUserId" class="tattoo-select">
              <option value="">不指定代理人</option>
              <option v-for="u in userStore.users" :key="u._id" :value="u._id">
                {{ u.name }} ({{ u.department }})
              </option>
            </select>
          </div>

          <div>
            <label class="tattoo-label">請假原因</label>
            <textarea
              v-model="form.reason"
              required
              rows="3"
              placeholder="請輸入請假原因"
              class="tattoo-input resize-none"
            />
          </div>

          <div
            v-if="errorMsg"
            class="font-cinzel text-sm px-3 py-2 border border-tattoo-red text-tattoo-red bg-tattoo-dark"
          >
            {{ errorMsg }}
          </div>

          <TattooDivider />

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="tattoo-btn-secondary"
              @click="$emit('update:modelValue', false)"
            >
              取消
            </button>
            <button type="submit" :disabled="submitting" class="tattoo-btn-primary">
              {{ submitting ? '提交中...' : '✦ 送出申請' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/utils/api'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import { useUserStore } from '@/stores/user'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submitted: []
  }>()

  const userStore = useUserStore()

  const submitting = ref(false)
  const errorMsg = ref('')

  const form = ref({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    proxyUserId: '',
  })

  async function handleSubmit() {
    errorMsg.value = ''
    submitting.value = true
    try {
      const payload: Record<string, unknown> = {
        type: form.value.type,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        reason: form.value.reason,
      }
      if (form.value.proxyUserId) payload.proxyUserId = form.value.proxyUserId

      await api.post('/leave/requests', payload)
      emit('submitted')
      emit('update:modelValue', false)
      form.value = { type: '', startDate: '', endDate: '', reason: '', proxyUserId: '' }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '送出失敗，請重試'
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    if (userStore.users.length === 0) {
      userStore.fetchUsers().catch(() => {})
    }
  })
</script>
