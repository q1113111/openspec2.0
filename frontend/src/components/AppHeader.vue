<template>
  <header
    class="h-16 flex items-center justify-between px-6 flex-shrink-0"
    style="background-color: #1a1a1a; border-bottom: 2px solid #DC143C;"
  >
    <!-- 頁面標題 -->
    <div>
      <h1 class="tattoo-subheading text-base">{{ pageTitle }}</h1>
    </div>

    <!-- 右側使用者資訊 -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="font-cinzel text-tattoo-cream text-sm">{{ authStore.user?.name }}</span>
        <span class="tattoo-badge text-tattoo-gold border-tattoo-gold text-xs">{{ roleLabel }}</span>
      </div>
      <button class="tattoo-btn-danger text-xs py-1.5 px-4" @click="handleLogout">
        登出
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()

  const PAGE_TITLES: Record<string, string> = {
    '/dashboard': '首頁總覽',
    '/attendance': '出勤記錄',
    '/leave/my': '我的假單',
    '/leave/pending': '待審假單',
    '/overtime/my': '我的加班',
    '/overtime/pending': '待審加班',
    '/admin/users': '使用者管理',
    '/admin/leave-quota': '假別額度',
    '/admin/work-schedule': '工時設定',
    '/change-password': '修改密碼',
  }

  const ROLE_LABELS: Record<string, string> = {
    admin: 'ADMIN',
    hr: 'HR',
    employee: 'EMPLOYEE',
  }

  const pageTitle = computed(() => {
    const path = route.path
    if (PAGE_TITLES[path]) return PAGE_TITLES[path]
    if (path.startsWith('/leave/')) return '假單詳情'
    return '出缺勤系統'
  })

  const roleLabel = computed(() => ROLE_LABELS[authStore.user?.role ?? ''] ?? '')

  async function handleLogout() {
    await authStore.logout()
    router.push('/login')
  }
</script>
