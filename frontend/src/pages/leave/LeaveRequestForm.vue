<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">申請假單</h3>
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
            <label class="block text-sm font-medium text-gray-700 mb-1.5">假別</label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇假別</option>
              <option v-for="(label, value) in LEAVE_TYPE_LABELS" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">開始日期</label>
              <input
                v-model="form.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">結束日期</label>
              <input
                v-model="form.endDate"
                type="date"
                required
                :min="form.startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">代理人（可選）</label>
            <select
              v-model="form.proxyUserId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">不指定代理人</option>
              <option v-for="u in userStore.users" :key="u._id" :value="u._id">
                {{ u.name }} ({{ u.department }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">請假原因</label>
            <textarea
              v-model="form.reason"
              required
              rows="3"
              placeholder="請輸入請假原因"
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
  import { ref, onMounted } from 'vue'
  import api from '@/utils/api'
  import { LEAVE_TYPE_LABELS } from '@/types'
  import { useUserStore } from '@/stores/user'

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
