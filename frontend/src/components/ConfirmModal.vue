<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="$emit('update:modelValue', false)" />
      <div class="relative tattoo-card w-full max-w-md mx-4">
        <h3 class="tattoo-heading text-base mb-3">{{ title }}</h3>
        <TattooDivider class="mb-4" />
        <p class="font-cinzel text-tattoo-cream text-sm mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="tattoo-btn-secondary"
            @click="$emit('update:modelValue', false)"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            :class="props.variant === 'danger' ? 'tattoo-btn-danger' : 'tattoo-btn-primary'"
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
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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

  function handleConfirm() {
    emit('confirm')
    emit('update:modelValue', false)
  }
</script>
