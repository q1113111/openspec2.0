<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { LeaveStatus, OvertimeStatus } from '@/types'
  import { LEAVE_STATUS_LABELS, OVERTIME_STATUS_LABELS, ATTENDANCE_STATUS_LABELS } from '@/types'

  type StatusType = LeaveStatus | OvertimeStatus | 'normal' | 'late' | 'early_leave' | 'absent'

  const props = defineProps<{
    status: StatusType
    type?: 'leave' | 'overtime' | 'attendance'
  }>()

  const label = computed(() => {
    if (props.type === 'attendance') {
      return ATTENDANCE_STATUS_LABELS[props.status] ?? props.status
    }
    if (props.type === 'overtime') {
      return OVERTIME_STATUS_LABELS[props.status as OvertimeStatus] ?? props.status
    }
    return LEAVE_STATUS_LABELS[props.status as LeaveStatus] ?? props.status
  })

  const badgeClass = computed(() => {
    switch (props.status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'supervisor_approved':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      case 'normal':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-orange-100 text-orange-800'
      case 'early_leave':
        return 'bg-yellow-100 text-yellow-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  })
</script>
