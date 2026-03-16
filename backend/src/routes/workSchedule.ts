import { Router, Request, Response } from 'express'
import WorkSchedule from '../models/WorkSchedule'
import { authMiddleware, requireRole } from '../middleware/auth'

const router = Router()

// ── GET /api/work-schedule ────────────────────────────────────────────────
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    let schedule = await WorkSchedule.findOne().lean()
    if (!schedule) {
      // Create default schedule if none exists
      const created = await WorkSchedule.create({})
      schedule = created.toObject()
    }
    res.json(schedule)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── PUT /api/work-schedule  (admin) ───────────────────────────────────────
router.put('/', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { coreStart, coreEnd, dailyHours, flexStart, flexEnd, workDays } = req.body

    const update: Record<string, unknown> = {}
    if (coreStart !== undefined) update.coreStart = coreStart
    if (coreEnd !== undefined) update.coreEnd = coreEnd
    if (dailyHours !== undefined) update.dailyHours = dailyHours
    if (flexStart !== undefined) update.flexStart = flexStart
    if (flexEnd !== undefined) update.flexEnd = flexEnd
    if (workDays !== undefined) update.workDays = workDays

    const schedule = await WorkSchedule.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    }).lean()

    res.json(schedule)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
