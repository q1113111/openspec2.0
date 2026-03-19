<template>
  <div class="max-w-xl space-y-4">
    <h2 class="tattoo-heading text-xl">✦ 工時設定</h2>
    <TattooDivider />

    <div
      v-if="loading"
      class="tattoo-card p-12 text-center font-cinzel text-tattoo-warm text-sm"
    >
      載入中...
    </div>

    <div v-else class="tattoo-card">
      <form @submit.prevent="handleSave" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="tattoo-label">核心上班時間</label>
            <input v-model="form.coreStart" type="time" required class="tattoo-input" />
          </div>
          <div>
            <label class="tattoo-label">核心下班時間</label>
            <input v-model="form.coreEnd" type="time" required class="tattoo-input" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="tattoo-label">彈性上班最早時間</label>
            <input v-model="form.flexStart" type="time" required class="tattoo-input" />
          </div>
          <div>
            <label class="tattoo-label">彈性下班最晚時間</label>
            <input v-model="form.flexEnd" type="time" required class="tattoo-input" />
          </div>
        </div>

        <div>
          <label class="tattoo-label">每日標準工時（小時）</label>
          <input
            v-model.number="form.dailyHours"
            type="number"
            min="1"
            max="24"
            step="0.5"
            required
            class="tattoo-input w-32"
          />
        </div>

        <div>
          <label class="tattoo-label mb-2 block">工作日</label>
          <div class="flex gap-4 flex-wrap">
            <label
              v-for="day in weekDays"
              :key="day.value"
              class="flex items-center gap-2 font-cinzel text-tattoo-warm text-xs uppercase tracking-wider cursor-pointer"
            >
              <input
                type="checkbox"
                :value="day.value"
                v-model="form.workDays"
                class="accent-tattoo-gold"
              />
              {{ day.label }}
            </label>
          </div>
        </div>

        <TattooDivider />

        <div
          v-if="successMsg"
          class="font-cinzel text-sm px-3 py-2 border border-tattoo-gold text-tattoo-gold bg-tattoo-dark"
        >
          {{ successMsg }}
        </div>
        <div
          v-if="errorMsg"
          class="font-cinzel text-sm px-3 py-2 border border-tattoo-red text-tattoo-red bg-tattoo-dark"
        >
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="saving" class="tattoo-btn-primary">
          {{ saving ? '儲存中...' : '✦ 儲存設定' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/utils/api'
  import type { WorkSchedule } from '@/types'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const loading = ref(false)
  const saving = ref(false)
  const successMsg = ref('')
  const errorMsg = ref('')

  const weekDays = [
    { value: 0, label: '日' },
    { value: 1, label: '一' },
    { value: 2, label: '二' },
    { value: 3, label: '三' },
    { value: 4, label: '四' },
    { value: 5, label: '五' },
    { value: 6, label: '六' },
  ]

  const form = ref<WorkSchedule>({
    coreStart: '09:00',
    coreEnd: '18:00',
    dailyHours: 8,
    flexStart: '07:00',
    flexEnd: '22:00',
    workDays: [1, 2, 3, 4, 5],
  })

  async function fetchSchedule() {
    loading.value = true
    try {
      const { data } = await api.get('/work-schedule')
      form.value = data
    } catch {
      // use defaults
    } finally {
      loading.value = false
    }
  }

  async function handleSave() {
    saving.value = true
    errorMsg.value = ''
    successMsg.value = ''
    try {
      await api.put('/work-schedule', form.value)
      successMsg.value = '✦ 設定已儲存'
      setTimeout(() => (successMsg.value = ''), 3000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '儲存失敗'
    } finally {
      saving.value = false
    }
  }

  onMounted(() => fetchSchedule())
</script>
