<template>
  <span class="tattoo-badge" :class="badgeClass">
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
      case 'normal':
        return 'text-tattoo-gold border-tattoo-gold'
      case 'supervisor_approved':
        return 'text-tattoo-warm border-tattoo-warm'
      case 'pending':
        return 'text-tattoo-gold border-tattoo-gold opacity-70'
      case 'rejected':
      case 'absent':
        return 'text-tattoo-red border-tattoo-red'
      case 'cancelled':
        return 'text-tattoo-warm border-tattoo-warm opacity-50'
      case 'late':
      case 'early_leave':
        return 'text-tattoo-red border-tattoo-red opacity-80'
      default:
        return 'text-tattoo-warm border-tattoo-warm'
    }
  })
</script>
