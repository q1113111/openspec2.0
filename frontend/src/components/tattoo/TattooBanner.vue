<template>
  <div class="tattoo-banner relative flex items-center justify-center px-8 py-2">
    <!-- 卷軸左端 -->
    <svg class="flex-shrink-0" width="24" height="32" viewBox="0 0 24 32" fill="none">
      <path d="M20 2 C20 2 4 2 4 2 C2 2 2 4 2 6 L2 26 C2 28 4 30 6 30 L18 30 C20 30 22 28 22 26 L22 6 C22 4 20 2 20 2Z"
        fill="#2a2a2a" stroke="#DAA520" stroke-width="1.5"/>
      <line x1="12" y1="4" x2="12" y2="28" stroke="#8B7355" stroke-width="0.5" opacity="0.5"/>
    </svg>
    <!-- 標題文字 -->
    <div class="px-4 text-center">
      <slot />
    </div>
    <!-- 卷軸右端 -->
    <svg class="flex-shrink-0 scale-x-[-1]" width="24" height="32" viewBox="0 0 24 32" fill="none">
      <path d="M20 2 C20 2 4 2 4 2 C2 2 2 4 2 6 L2 26 C2 28 4 30 6 30 L18 30 C20 30 22 28 22 26 L22 6 C22 4 20 2 20 2Z"
        fill="#2a2a2a" stroke="#DAA520" stroke-width="1.5"/>
      <line x1="12" y1="4" x2="12" y2="28" stroke="#8B7355" stroke-width="0.5" opacity="0.5"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.tattoo-banner {
  background: linear-gradient(to right, transparent, rgba(218, 165, 32, 0.05), transparent);
}
</style>
