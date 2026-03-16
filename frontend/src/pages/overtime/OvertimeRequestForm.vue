<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">申請加班</h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">加班日期</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">開始時間</label>
              <input
                v-model="form.startTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">結束時間</label>
              <input
                v-model="form.endTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div
            v-if="computedHours > 0"
            class="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
          >
            預計加班時數：{{ computedHours.toFixed(1) }} 小時
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">加班原因</label>
            <textarea
              v-model="form.reason"
              required
              rows="3"
              placeholder="請輸入加班原因"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {{ errorMsg }}
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ submitting ? '提交中...' : '送出申請' }}
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
