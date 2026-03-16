export type UserRole = 'admin' | 'hr' | 'employee'
export type LeaveType =
  | 'annual'
  | 'compensatory'
  | 'personal'
  | 'sick'
  | 'marriage'
  | 'bereavement'
  | 'maternity'
  | 'paternity'
  | 'official'
export type LeaveStatus = 'pending' | 'supervisor_approved' | 'approved' | 'rejected' | 'cancelled'
export type OvertimeStatus = 'pending' | 'supervisor_approved' | 'approved' | 'rejected'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  department: string
  supervisorId?: string
  employmentDate: string
  isActive: boolean
  mustChangePassword: boolean
  overtimePay: boolean
}

export interface Attendance {
  _id: string
  userId: string
  date: string
  clockIn?: string
  clockOut?: string
  status: 'normal' | 'late' | 'early_leave' | 'absent'
  workHours?: number
  lateMinutes?: number
}

export interface LeaveBalance {
  type: LeaveType
  total: number
  used: number
  remaining: number
}

export interface ApprovalRecord {
  role: string
  userId: string
  userName?: string
  action: 'approved' | 'rejected'
  comment?: string
  at: string
}

export interface LeaveRequest {
  _id: string
  userId: string
  userName?: string
  type: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  totalHours?: number
  reason: string
  proxyUserId?: string
  proxyUserName?: string
  status: LeaveStatus
  approvalHistory: ApprovalRecord[]
  createdAt: string
}

export interface OvertimeRequest {
  _id: string
  userId: string
  userName?: string
  date: string
  startTime: string
  endTime: string
  hours: number
  reason: string
  status: OvertimeStatus
  approvalHistory: ApprovalRecord[]
  createdAt: string
}

export interface WorkSchedule {
  coreStart: string
  coreEnd: string
  dailyHours: number
  flexStart: string
  flexEnd: string
  workDays: number[]
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: '特休',
  compensatory: '補休',
  personal: '事假',
  sick: '病假',
  marriage: '婚假',
  bereavement: '喪假',
  maternity: '產假',
  paternity: '陪產假',
  official: '公假',
}

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: '待審核',
  supervisor_approved: '主管已核准',
  approved: '已核准',
  rejected: '已拒絕',
  cancelled: '已撤回',
}

export const OVERTIME_STATUS_LABELS: Record<OvertimeStatus, string> = {
  pending: '待審核',
  supervisor_approved: '主管已核准',
  approved: '已核准',
  rejected: '已拒絕',
}

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  normal: '正常',
  late: '遲到',
  early_leave: '早退',
  absent: '缺勤',
}
