<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            @click="$emit('update:modelValue', false)"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
            :class="confirmClass"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      title?: string
      message?: string
      confirmText?: string
      cancelText?: string
      variant?: 'danger' | 'primary'
    }>(),
    {
      title: '確認',
      message: '確定要執行此操作嗎？',
      confirmText: '確認',
      cancelText: '取消',
      variant: 'primary',
    },
  )

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
  }>()

  const confirmClass = computed(() =>
    props.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700',
  )

  function handleConfirm() {
    emit('confirm')
    emit('update:modelValue', false)
  }
</script>
