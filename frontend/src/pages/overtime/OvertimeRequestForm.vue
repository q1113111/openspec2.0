<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="$emit('update:modelValue', false)" />
      <div class="relative tattoo-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal 標題列 -->
        <div class="flex items-center justify-between mb-4" style="border-bottom: 1px solid var(--tattoo-border); padding-bottom: 1rem;">
          <h3 class="tattoo-heading text-base">✦ 申請加班</h3>
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
            <label class="tattoo-label">加班日期</label>
            <input v-model="form.date" type="date" required class="tattoo-input" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tattoo-label">開始時間</label>
              <input v-model="form.startTime" type="time" required class="tattoo-input" />
            </div>
            <div>
              <label class="tattoo-label">結束時間</label>
              <input v-model="form.endTime" type="time" required class="tattoo-input" />
            </div>
          </div>

          <div
            v-if="computedHours > 0"
            class="font-cinzel text-sm px-3 py-2 border border-tattoo-gold text-tattoo-gold bg-tattoo-dark"
          >
            預計加班時數：{{ computedHours.toFixed(1) }} 小時
          </div>

          <div>
            <label class="tattoo-label">加班原因</label>
            <textarea
              v-model="form.reason"
              required
              rows="3"
              placeholder="請輸入加班原因"
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
  import { ref, computed } from 'vue'
  import api from '@/utils/api'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submitted: []
  }>()

  const submitting = ref(false)
  const errorMsg = ref('')

  const form = ref({
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
  })

  const computedHours = computed(() => {
    if (!form.value.startTime || !form.value.endTime) return 0
    const [sh, sm] = form.value.startTime.split(':').map(Number)
    const [eh, em] = form.value.endTime.split(':').map(Number)
    const diff = eh * 60 + em - (sh * 60 + sm)
    return diff > 0 ? diff / 60 : 0
  })

  async function handleSubmit() {
    errorMsg.value = ''
    if (computedHours.value <= 0) {
      errorMsg.value = '結束時間必須晚於開始時間'
      return
    }
    submitting.value = true
    try {
      await api.post('/overtime/requests', {
        date: form.value.date,
        startTime: form.value.startTime,
        endTime: form.value.endTime,
        reason: form.value.reason,
      })
      emit('submitted')
      emit('update:modelValue', false)
      form.value = { date: '', startTime: '', endTime: '', reason: '' }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '送出失敗，請重試'
    } finally {
      submitting.value = false
    }
  }
</script>
