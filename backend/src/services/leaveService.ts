import LeaveBalance from '../models/LeaveBalance'
import { IWorkSchedule } from '../models/WorkSchedule'
import type { LeaveType } from '../models/LeaveRequest'
import mongoose from 'mongoose'

/**
 * Calculate annual leave entitlement (days) based on Taiwan Labor Standards Act.
 * @param employmentDate  The date the employee was hired.
 * @param referenceDate   The date used to measure tenure (defaults to today).
 */
export function calculateAnnualLeaveDays(
  employmentDate: Date,
  referenceDate: Date = new Date(),
): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const msPerYear = msPerDay * 365.25

  const tenureMs = referenceDate.getTime() - employmentDate.getTime()
  const tenureYears = tenureMs / msPerYear

  if (tenureYears < 0.5) return 0
  if (tenureYears < 1) return 3
  if (tenureYears < 2) return 7
  if (tenureYears < 3) return 10
  if (tenureYears < 5) return 14
  if (tenureYears < 10) return 15

  // 10+ years: 15 + (full years - 10), max 30
  const fullYears = Math.floor(tenureYears)
  return Math.min(15 + (fullYears - 10), 30)
}

/**
 * Count working days between startDate and endDate (inclusive),
 * excluding days not in WorkSchedule.workDays.
 * @param startDate  "YYYY-MM-DD"
 * @param endDate    "YYYY-MM-DD"
 */
export function countWorkingDays(
  startDate: string,
  endDate: string,
  schedule: IWorkSchedule,
): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let count = 0

  const current = new Date(start)
  while (current <= end) {
    if (schedule.workDays.includes(current.getDay())) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  return count
}

/**
 * Get the leave balance for a user for the current year.
 * For 'annual' leave, the total is computed dynamically from employment date.
 */
export async function getLeaveBalance(
  userId: string,
  type: LeaveType,
  year: number,
  employmentDate?: Date,
): Promise<{ total: number; used: number; remaining: number }> {
  let balance = await LeaveBalance.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    year,
    type,
  })

  let total = balance?.total ?? 0

  if (type === 'annual' && employmentDate) {
    const refDate = new Date(year, 11, 31) // end of the year
    total = calculateAnnualLeaveDays(employmentDate, refDate)
  }

  const used = balance?.used ?? 0
  return { total, used, remaining: total - used }
}

/**
 * Deduct leave balance when HR approves a request.
 * Uses totalHours for compensatory, totalDays for everything else.
 * Creates the record if it does not yet exist.
 */
export async function deductLeaveBalance(
  userId: string,
  type: LeaveType,
  year: number,
  totalDays: number,
  totalHours?: number,
): Promise<void> {
  const amount = type === 'compensatory' ? (totalHours ?? 0) : totalDays

  await LeaveBalance.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId), year, type },
    { $inc: { used: amount } },
    { upsert: true, setDefaultsOnInsert: true },
  )
}

/**
 * Add compensatory leave hours (called when HR approves an overtime request
 * and the employee has overtimePay = false).
 */
export async function addCompensatoryHours(
  userId: string,
  year: number,
  hours: number,
): Promise<void> {
  await LeaveBalance.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId), year, type: 'compensatory' },
    { $inc: { total: hours } },
    { upsert: true },
  )
}
