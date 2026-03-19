<template>
  <aside class="sidebar w-64 flex flex-col h-full flex-shrink-0">
    <!-- Logo 區 -->
    <div class="sidebar-logo-area px-6 py-5">
      <!-- 刺青風 Logo -->
      <div class="tattoo-logo text-center">
        <p class="tattoo-heading text-lg tracking-[0.2em] whitespace-nowrap">✦ ATTENDANCE ✦</p>
        <p
          class="font-cinzel text-xs tracking-widest uppercase mt-1"
          style="color: var(--tattoo-warm)"
        >
          Management System
        </p>
      </div>
      <!-- MUJI 風 Logo -->
      <div class="muji-logo">
        <p class="muji-logo-text">出缺勤系統</p>
        <p class="muji-logo-sub">Attendance Management</p>
      </div>
    </div>

    <!-- 導覽選單 -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="isActive(item.to) ? 'nav-item nav-active' : 'nav-item nav-inactive'"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- 底部裝飾 -->
    <div class="sidebar-footer px-6 py-4">
      <div class="tattoo-divider-line"></div>
    </div>
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

<style scoped>
  /* ── 基礎 Sidebar ── */
  .sidebar {
    background-color: var(--tattoo-black);
    border-right: 1px solid var(--tattoo-border);
    border-left: 3px solid var(--tattoo-red);
  }

  /* ── Logo 區 ── */
  .sidebar-logo-area {
    border-bottom: 1px solid var(--tattoo-border);
  }

  /* 刺青風 logo（預設顯示） */
  .tattoo-logo {
    display: block;
  }
  .muji-logo {
    display: none;
  }

  /* ── Nav 項目 ── */
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition:
      background 0.15s,
      color 0.15s;
    text-decoration: none;
  }

  .nav-active {
    background-color: var(--tattoo-border);
    color: var(--tattoo-gold);
    border-left: 2px solid var(--tattoo-gold);
  }

  .nav-inactive {
    color: var(--tattoo-warm);
  }
  .nav-inactive:hover {
    color: var(--tattoo-gold);
    background-color: var(--tattoo-border);
  }

  /* ── 底部裝飾 ── */
  .tattoo-divider-line {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--tattoo-gold), transparent);
  }

  /* ── MUJI 主題覆蓋 ── */
  :global([data-theme='muji']) .sidebar {
    background-color: var(--tattoo-dark);
    border-right: 1px solid var(--tattoo-border);
    border-left: none;
  }

  :global([data-theme='muji']) .tattoo-logo {
    display: none;
  }
  :global([data-theme='muji']) .muji-logo {
    display: block;
  }

  :global([data-theme='muji']) .nav-item {
    font-family: 'Inter', sans-serif;
    text-transform: none;
    letter-spacing: 0;
    font-size: 13px;
  }

  :global([data-theme='muji']) .nav-active {
    background-color: var(--tattoo-gold);
    color: #ffffff;
    border-left: none;
  }

  :global([data-theme='muji']) .nav-inactive {
    color: var(--tattoo-warm);
  }
  :global([data-theme='muji']) .nav-inactive:hover {
    background-color: var(--tattoo-border);
    color: var(--tattoo-cream);
  }

  :global([data-theme='muji']) .tattoo-divider-line {
    display: none;
  }

  /* ── MUJI Logo 樣式 ── */
  .muji-logo-text {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: var(--tattoo-cream);
  }
  .muji-logo-sub {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.05em;
    color: var(--tattoo-warm);
    margin-top: 2px;
  }
</style>
