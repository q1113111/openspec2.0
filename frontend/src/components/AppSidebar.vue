<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span class="text-white text-sm font-bold">勤</span>
      </div>
      <span class="font-semibold text-gray-900">出缺勤系統</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <div class="space-y-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
        >
          <span class="text-base">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const authStore = useAuthStore()

  const role = computed(() => authStore.user?.role)

  interface MenuItem {
    to: string
    label: string
    icon: string
    roles?: string[]
  }

  const allMenuItems: MenuItem[] = [
    { to: '/dashboard', label: '首頁總覽', icon: '🏠' },
    { to: '/attendance', label: '出勤記錄', icon: '📋' },
    { to: '/leave/my', label: '我的假單', icon: '📅' },
    { to: '/overtime/my', label: '我的加班', icon: '⏰' },
    { to: '/leave/pending', label: '待審假單', icon: '✅', roles: ['admin', 'hr'] },
    { to: '/overtime/pending', label: '待審加班', icon: '🔍', roles: ['admin', 'hr'] },
    { to: '/admin/users', label: '使用者管理', icon: '👥', roles: ['admin'] },
    { to: '/admin/leave-quota', label: '假別額度', icon: '📊', roles: ['admin'] },
    { to: '/admin/work-schedule', label: '工時設定', icon: '⚙️', roles: ['admin'] },
  ]

  const menuItems = computed(() =>
    allMenuItems.filter((item) => {
      if (!item.roles) return true
      return item.roles.includes(role.value ?? '')
    }),
  )

  function isActive(path: string) {
    return route.path === path || route.path.startsWith(path + '/')
  }
</script>
