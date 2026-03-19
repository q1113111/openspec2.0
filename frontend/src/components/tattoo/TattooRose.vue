<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="tattoo-rose"
  >
    <!-- 葉子 -->
    <ellipse cx="30" cy="90" rx="16" ry="8" fill="#2d5a1b" stroke="#DAA520" stroke-width="1" transform="rotate(-45 30 90)"/>
    <ellipse cx="90" cy="90" rx="16" ry="8" fill="#2d5a1b" stroke="#DAA520" stroke-width="1" transform="rotate(45 90 90)"/>
    <!-- 莖 -->
    <path d="M60 115 C60 115 55 95 60 80" stroke="#2d5a1b" stroke-width="3" stroke-linecap="round"/>
    <path d="M60 100 C50 95 42 97 38 90" stroke="#2d5a1b" stroke-width="2" stroke-linecap="round"/>
    <!-- 玫瑰花瓣外層 -->
    <circle cx="60" cy="55" r="28" fill="#8B0000" stroke="#DAA520" stroke-width="1.5"/>
    <!-- 花瓣層 1 -->
    <ellipse cx="60" cy="38" rx="14" ry="18" fill="#B22222" stroke="#DAA520" stroke-width="1" opacity="0.9"/>
    <ellipse cx="45" cy="58" rx="14" ry="18" fill="#B22222" stroke="#DAA520" stroke-width="1" opacity="0.9" transform="rotate(72 45 58)"/>
    <ellipse cx="52" cy="75" rx="14" ry="18" fill="#B22222" stroke="#DAA520" stroke-width="1" opacity="0.9" transform="rotate(144 52 75)"/>
    <ellipse cx="68" cy="75" rx="14" ry="18" fill="#B22222" stroke="#DAA520" stroke-width="1" opacity="0.9" transform="rotate(216 68 75)"/>
    <ellipse cx="75" cy="58" rx="14" ry="18" fill="#B22222" stroke="#DAA520" stroke-width="1" opacity="0.9" transform="rotate(288 75 58)"/>
    <!-- 花瓣層 2（內） -->
    <circle cx="60" cy="55" r="16" fill="#DC143C" stroke="#DAA520" stroke-width="1"/>
    <ellipse cx="60" cy="44" rx="8" ry="12" fill="#DC143C" stroke="#DAA520" stroke-width="0.5" opacity="0.8"/>
    <ellipse cx="52" cy="62" rx="8" ry="12" fill="#DC143C" stroke="#DAA520" stroke-width="0.5" opacity="0.8" transform="rotate(120 52 62)"/>
    <ellipse cx="68" cy="62" rx="8" ry="12" fill="#DC143C" stroke="#DAA520" stroke-width="0.5" opacity="0.8" transform="rotate(240 68 62)"/>
    <!-- 花心 -->
    <circle cx="60" cy="55" r="7" fill="#FF6B6B" stroke="#DAA520" stroke-width="1"/>
    <circle cx="60" cy="55" r="3" fill="#FFB3B3"/>
    <!-- 高光 -->
    <ellipse cx="55" cy="50" rx="3" ry="4" fill="white" opacity="0.2" transform="rotate(-20 55 50)"/>
  </svg>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: number
    }>(),
    { size: 120 },
  )
</script>

<style scoped>
.tattoo-rose {
  filter: drop-shadow(0 0 8px rgba(220, 20, 60, 0.4));
}
</style>
