<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div>
      <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-sm text-gray-600">
        <span class="font-medium text-gray-900">{{ authStore.user?.name }}</span>
        <span class="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{{ roleLabel }}</span>
      </div>
      <button
        class="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
        @click="handleLogout"
      >
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
    admin: '管理員',
    hr: 'HR',
    employee: '員工',
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
