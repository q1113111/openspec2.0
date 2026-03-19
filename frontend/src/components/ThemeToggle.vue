<template>
  <button
    class="theme-toggle-btn"
    :title="isMuji ? '切換至刺青風' : '切換至 MUJI 風'"
    @click="themeStore.toggle()"
  >
    <span class="theme-icon">{{ isMuji ? '🖤' : '🌿' }}</span>
    <span class="theme-label">{{ isMuji ? 'TATTOO' : 'MUJI' }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isMuji = computed(() => themeStore.theme === 'muji')
</script>

<style scoped>
.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 2px solid var(--tattoo-gold);
  background: transparent;
  color: var(--tattoo-gold);
  font-family: 'Cinzel', serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.theme-toggle-btn:hover {
  background: var(--tattoo-gold);
  color: var(--tattoo-black);
}

.theme-icon {
  font-size: 14px;
  line-height: 1;
}
</style>
