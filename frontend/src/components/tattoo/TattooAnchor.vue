<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 錨鏈環 -->
    <circle cx="32" cy="10" r="7" fill="none" :stroke="color" stroke-width="2.5"/>
    <circle cx="32" cy="10" r="3.5" fill="none" :stroke="color" stroke-width="1.5"/>
    <!-- 錨橫桿 -->
    <line x1="14" y1="18" x2="50" y2="18" :stroke="color" stroke-width="3" stroke-linecap="square"/>
    <rect x="13" y="16" width="6" height="4" :fill="color"/>
    <rect x="45" y="16" width="6" height="4" :fill="color"/>
    <!-- 錨桿 -->
    <line x1="32" y1="10" x2="32" y2="54" :stroke="color" stroke-width="3" stroke-linecap="square"/>
    <!-- 錨底弧 -->
    <path d="M14 42 Q14 58 32 58 Q50 58 50 42" fill="none" :stroke="color" stroke-width="3" stroke-linecap="square"/>
    <!-- 底部左右端點 -->
    <circle cx="14" cy="42" r="4" :fill="color"/>
    <circle cx="50" cy="42" r="4" :fill="color"/>
    <!-- 繩索裝飾 -->
    <path d="M32 18 C28 25 36 32 32 38" fill="none" stroke="#8B7355" stroke-width="1" opacity="0.6"/>
  </svg>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: number
      color?: string
    }>(),
    {
      size: 64,
      color: '#F5F0E8',
    },
  )
</script>
