import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('@/pages/ChangePasswordPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      component: () => import('@/components/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
        },
        {
          path: 'attendance',
          name: 'Attendance',
          component: () => import('@/pages/attendance/AttendancePage.vue'),
        },
        {
          path: 'leave/my',
          name: 'MyLeave',
          component: () => import('@/pages/leave/MyLeavePage.vue'),
        },
        {
          path: 'leave/pending',
          name: 'PendingLeave',
          component: () => import('@/pages/leave/PendingLeavePage.vue'),
          meta: { roles: ['admin', 'hr', 'supervisor'] },
        },
        {
          path: 'leave/:id',
          name: 'LeaveDetail',
          component: () => import('@/pages/leave/LeaveDetailPage.vue'),
        },
        {
          path: 'overtime/my',
          name: 'MyOvertime',
          component: () => import('@/pages/overtime/MyOvertimePage.vue'),
        },
        {
          path: 'overtime/pending',
          name: 'PendingOvertime',
          component: () => import('@/pages/overtime/PendingOvertimePage.vue'),
          meta: { roles: ['admin', 'hr', 'supervisor'] },
        },
        {
          path: 'admin/users',
          name: 'UserManagement',
          component: () => import('@/pages/admin/UserManagementPage.vue'),
          meta: { roles: ['admin'] },
        },
        {
          path: 'admin/leave-quota',
          name: 'LeaveQuota',
          component: () => import('@/pages/admin/LeaveQuotaPage.vue'),
          meta: { roles: ['admin'] },
        },
        {
          path: 'admin/work-schedule',
          name: 'WorkSchedule',
          component: () => import('@/pages/admin/WorkSchedulePage.vue'),
          meta: { roles: ['admin'] },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  const isLoggedIn = !!authStore.user
  const requiresAuth = to.meta.requiresAuth !== false

  if (!isLoggedIn && requiresAuth) {
    return next('/login')
  }

  if (isLoggedIn && to.path === '/login') {
    return next('/dashboard')
  }

  if (isLoggedIn && authStore.user?.mustChangePassword && to.path !== '/change-password') {
    return next('/change-password')
  }

  const allowedRoles = to.meta.roles as string[] | undefined
  if (allowedRoles && isLoggedIn) {
    const userRole = authStore.user?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next('/dashboard')
    }
  }

  next()
})

export default router
