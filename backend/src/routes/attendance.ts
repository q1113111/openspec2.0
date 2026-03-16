import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import Attendance from '../models/Attendance'
import User from '../models/User'
import { authMiddleware, requireRole } from '../middleware/auth'
import { getWorkSchedule, checkLate, checkEarlyLeave } from '../services/workScheduleService'

const router = Router()

function todayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ── POST /api/attendance/clock-in ─────────────────────────────────────────
router.post('/clock-in', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const date = todayString()

    const existing = await Attendance.findOne({ userId, date })
    if (existing?.clockIn) {
      return res.status(409).json({ message: 'Already clocked in today' })
    }

    const now = new Date()
    const schedule = await getWorkSchedule()
    const { isLate, lateMinutes } = checkLate(now, schedule)

    let status: 'normal' | 'late' = isLate ? 'late' : 'normal'

    const record = await Attendance.findOneAndUpdate(
      { userId, date },
      {
        userId,
        date,
        clockIn: now,
        ip: req.ip,
        status,
        lateMinutes: isLate ? lateMinutes : undefined,
      },
      { upsert: true, new: true },
    )

    res.status(201).json(record)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── POST /api/attendance/clock-out ────────────────────────────────────────
router.post('/clock-out', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const date = todayString()

    const record = await Attendance.findOne({ userId, date })
    if (!record) {
      return res.status(400).json({ message: 'No clock-in record found for today' })
    }
    if (record.clockOut) {
      return res.status(409).json({ message: 'Already clocked out today' })
    }
    if (!record.clockIn) {
      return res.status(400).json({ message: 'No clock-in time recorded' })
    }

    const now = new Date()
    const schedule = await getWorkSchedule()
    const { isEarlyLeave, workHours } = checkEarlyLeave(record.clockIn, now, schedule)

    // Determine final status
    let finalStatus = record.status
    if (isEarlyLeave) {
      finalStatus = 'early_leave'
    }

    record.clockOut = now
    record.workHours = workHours
    record.status = finalStatus as typeof record.status
    await record.save()

    res.json(record)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── GET /api/attendance/today ─────────────────────────────────────────────
router.get('/today', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const date = todayString()
    const record = await Attendance.findOne({ userId, date }).lean()
    res.json(record || null)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── GET /api/attendance ───────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { role, userId: currentUserId } = req.user
    const { userId, startDate, endDate, department } = req.query

    const filter: Record<string, unknown> = {}

    if (role === 'employee') {
      // Employees can only view their own records
      filter.userId = new mongoose.Types.ObjectId(currentUserId)
    } else {
      // admin / hr can filter by userId or department
      if (userId) {
        filter.userId = new mongoose.Types.ObjectId(userId as string)
      } else if (department) {
        const usersInDept = await User.find({ department }).select('_id').lean()
        const ids = usersInDept.map((u) => u._id)
        filter.userId = { $in: ids }
      }
    }

    if (startDate || endDate) {
      const dateFilter: Record<string, string> = {}
      if (startDate) dateFilter.$gte = startDate as string
      if (endDate) dateFilter.$lte = endDate as string
      filter.date = dateFilter
    }

    const records = await Attendance.find(filter).sort({ date: -1 }).lean()

    res.json(records)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
