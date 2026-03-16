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

/**
 * @openapi
 * /api/attendance/clock-in:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: 上班打卡
 *     description: 記錄當天上班時間，依 WorkSchedule 判斷是否遲到
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 打卡成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       409:
 *         description: 今天已打過上班卡
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/attendance/clock-out:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: 下班打卡
 *     description: 記錄當天下班時間，計算工時，依 WorkSchedule 判斷是否早退
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 打卡成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: 今天尚未打上班卡
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 今天已打過下班卡
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/attendance/today:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: 取得今日打卡紀錄
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 今日打卡紀錄（無紀錄時回傳 null）
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Attendance'
 *                 - type: 'null'
 */
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

/**
 * @openapi
 * /api/attendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: 查詢出勤紀錄
 *     description: 員工只能查自己；admin / hr 可依 userId 或 department 篩選
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: 篩選特定使用者（admin/hr）
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: 篩選部門（admin/hr）
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 開始日期（YYYY-MM-DD）
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 結束日期（YYYY-MM-DD）
 *     responses:
 *       200:
 *         description: 出勤紀錄列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
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
