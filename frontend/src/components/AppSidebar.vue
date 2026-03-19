<template>
  <aside
    class="w-64 flex flex-col h-full flex-shrink-0"
    style="background-color: #0d0d0d; border-right: 1px solid #3a3530; border-left: 3px solid #DC143C;"
  >
    <!-- Logo 區 -->
    <div class="px-6 py-5" style="border-bottom: 1px solid #3a3530;">
      <div class="text-center">
        <p class="tattoo-heading text-lg tracking-[0.2em]">✦ ATTENDANCE ✦</p>
        <p class="font-cinzel text-tattoo-warm text-xs tracking-widest uppercase mt-1">Management System</p>
      </div>
    </div>

    <!-- 導覽選單 -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="isActive(item.to) ? 'tattoo-nav-active' : 'tattoo-nav-link'"
      >
        <span class="text-base w-5 text-center">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- 底部裝飾 -->
    <div class="px-6 py-4" style="border-top: 1px solid #3a3530;">
      <TattooDivider :my="0" />
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

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
