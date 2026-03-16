import { Router, Request, Response } from 'express'
import WorkSchedule from '../models/WorkSchedule'
import { authMiddleware, requireRole } from '../middleware/auth'

const router = Router()

/**
 * @openapi
 * /api/work-schedule:
 *   get:
 *     tags:
 *       - WorkSchedule
 *     summary: 取得工作排班設定
 *     description: 回傳全系統共用的工作時間設定（如無設定則自動建立預設值）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 工作排班設定
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkSchedule'
 *   put:
 *     tags:
 *       - WorkSchedule
 *     summary: 更新工作排班設定
 *     description: 僅 admin 可操作
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coreStart:
 *                 type: string
 *                 example: '09:00'
 *               coreEnd:
 *                 type: string
 *                 example: '18:00'
 *               dailyHours:
 *                 type: number
 *                 example: 8
 *               flexStart:
 *                 type: string
 *                 example: '07:00'
 *               flexEnd:
 *                 type: string
 *                 example: '10:00'
 *               workDays:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 3, 4, 5]
 *                 description: '0=週日, 1=週一, ..., 6=週六'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkSchedule'
 *       403:
 *         description: 非 admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
