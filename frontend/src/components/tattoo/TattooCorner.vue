<template>
  <div class="tattoo-corner-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 左上角 -->
      <path d="M2 20 L2 2 L20 2" :stroke="color" stroke-width="2" stroke-linecap="square"/>
      <path d="M6 20 L6 6 L20 6" :stroke="color" stroke-width="1" stroke-linecap="square" opacity="0.5"/>
      <!-- 右上角 -->
      <path d="M40 2 L58 2 L58 20" :stroke="color" stroke-width="2" stroke-linecap="square"/>
      <path d="M40 6 L54 6 L54 20" :stroke="color" stroke-width="1" stroke-linecap="square" opacity="0.5"/>
      <!-- 左下角 -->
      <path d="M2 40 L2 58 L20 58" :stroke="color" stroke-width="2" stroke-linecap="square"/>
      <path d="M6 40 L6 54 L20 54" :stroke="color" stroke-width="1" stroke-linecap="square" opacity="0.5"/>
      <!-- 右下角 -->
      <path d="M40 58 L58 58 L58 40" :stroke="color" stroke-width="2" stroke-linecap="square"/>
      <path d="M40 54 L54 54 L54 40" :stroke="color" stroke-width="1" stroke-linecap="square" opacity="0.5"/>
      <!-- 中心星形 -->
      <path v-if="showStar" d="M30 24 L31.5 28.5 L36 30 L31.5 31.5 L30 36 L28.5 31.5 L24 30 L28.5 28.5 Z"
        :fill="color" opacity="0.8"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: number
      color?: string
      showStar?: boolean
    }>(),
    {
      size: 60,
      color: '#DAA520',
      showStar: false,
    },
  )
</script>

<style scoped>
.tattoo-corner-wrapper {
  display: inline-block;
  flex-shrink: 0;
}
</style>
