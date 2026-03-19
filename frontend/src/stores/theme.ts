import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'tattoo' | 'muji'>(
    (localStorage.getItem('theme') as 'tattoo' | 'muji') || 'tattoo'
  )

  function toggle() {
    theme.value = theme.value === 'tattoo' ? 'muji' : 'tattoo'
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function init() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return { theme, toggle, init }
})
