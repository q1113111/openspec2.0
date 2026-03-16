import WorkSchedule, { IWorkSchedule } from '../models/WorkSchedule'

/**
 * Return the singleton WorkSchedule document (create default if not found).
 */
export async function getWorkSchedule(): Promise<IWorkSchedule> {
  let schedule = await WorkSchedule.findOne()
  if (!schedule) {
    schedule = await WorkSchedule.create({})
  }
  return schedule
}

/**
 * Parse "HH:mm" into minutes-from-midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export interface ClockInResult {
  isLate: boolean
  lateMinutes: number
}

/**
 * Compare clockIn time against the schedule's coreStart.
 * A clock-in after coreStart is considered late.
 */
export function checkLate(clockIn: Date, schedule: IWorkSchedule): ClockInResult {
  const clockInMinutes = clockIn.getHours() * 60 + clockIn.getMinutes()
  const coreStartMinutes = timeToMinutes(schedule.coreStart)

  if (clockInMinutes > coreStartMinutes) {
    return {
      isLate: true,
      lateMinutes: clockInMinutes - coreStartMinutes,
    }
  }
  return { isLate: false, lateMinutes: 0 }
}

export interface ClockOutResult {
  isEarlyLeave: boolean
  workHours: number
}

/**
 * Compare clockOut time against coreEnd; calculate work hours.
 */
export function checkEarlyLeave(
  clockIn: Date,
  clockOut: Date,
  schedule: IWorkSchedule,
): ClockOutResult {
  const clockOutMinutes = clockOut.getHours() * 60 + clockOut.getMinutes()
  const coreEndMinutes = timeToMinutes(schedule.coreEnd)

  const diffMs = clockOut.getTime() - clockIn.getTime()
  const workHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100

  return {
    isEarlyLeave: clockOutMinutes < coreEndMinutes,
    workHours,
  }
}
