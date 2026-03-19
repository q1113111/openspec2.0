<template>
  <div class="flex items-center gap-3 w-full" :style="{ margin: `${my}px 0` }">
    <div class="flex-1 h-px" :style="{ backgroundColor: lineColor }"></div>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1 L11.8 7.2 L18 10 L11.8 12.8 L10 19 L8.2 12.8 L2 10 L8.2 7.2 Z"
        :fill="starColor"
      />
    </svg>
    <div class="flex-1 h-px" :style="{ backgroundColor: lineColor }"></div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      lineColor?: string
      starColor?: string
      my?: number
    }>(),
    {
      lineColor: '#8B7355',
      starColor: '#DAA520',
      my: 0,
    },
  )
</script>
