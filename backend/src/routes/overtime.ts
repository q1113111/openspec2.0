import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import OvertimeRequest from '../models/OvertimeRequest'
import User from '../models/User'
import { authMiddleware } from '../middleware/auth'
import { addCompensatoryHours } from '../services/leaveService'
import {
  sendOvertimeRequestNotification,
  sendSupervisorApprovedOvertimeNotification,
  sendHrApprovedOvertimeNotification,
  sendRejectedOvertimeNotification,
} from '../services/emailService'

const router = Router()

/**
 * @openapi
 * /api/overtime/requests:
 *   post:
 *     tags:
 *       - Overtime
 *     summary: 提交加班申請
 *     description: 員工提交後狀態為 pending，系統通知主管審核
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *               - hours
 *               - reason
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2026-03-20'
 *               startTime:
 *                 type: string
 *                 example: '18:00'
 *               endTime:
 *                 type: string
 *                 example: '21:00'
 *               hours:
 *                 type: number
 *                 example: 3
 *               reason:
 *                 type: string
 *                 example: 專案上線準備
 *     responses:
 *       201:
 *         description: 申請成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OvertimeRequest'
 *       400:
 *         description: 必填欄位缺少
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Overtime
 *     summary: 查詢加班申請列表
 *     description: 員工只能查自己；admin / hr 可依 userId / status 篩選
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, supervisor_approved, approved, rejected]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: 加班申請列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OvertimeRequest'
 */
router.post('/requests', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const { date, startTime, endTime, hours, reason } = req.body

    if (!date || !startTime || !endTime || hours === undefined || !reason) {
      return res
        .status(400)
        .json({ message: 'date, startTime, endTime, hours and reason are required' })
    }

    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const request = await OvertimeRequest.create({
      userId: new mongoose.Types.ObjectId(userId),
      date,
      startTime,
      endTime,
      hours,
      reason,
      status: 'pending',
    })

    // Notify supervisor
    if (user.supervisorId) {
      const supervisor = await User.findById(user.supervisorId).lean()
      if (supervisor) {
        sendOvertimeRequestNotification(supervisor.email, user.name, date, hours).catch(
          console.error,
        )
      }
    }

    res.status(201).json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── GET /api/overtime/requests ────────────────────────────────────────────
router.get('/requests', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { role, userId: currentUserId } = req.user
    const { userId, status, startDate, endDate } = req.query

    const filter: Record<string, unknown> = {}

    if (role === 'employee') {
      filter.userId = new mongoose.Types.ObjectId(currentUserId)
    } else if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId as string)
    }

    if (status) filter.status = status
    if (startDate) filter.date = { $gte: startDate as string }
    if (endDate) {
      const dateFilter = (filter.date as Record<string, string>) || {}
      dateFilter.$lte = endDate as string
      filter.date = dateFilter
    }

    const requests = await OvertimeRequest.find(filter)
      .populate('userId', 'name email department')
      .sort({ createdAt: -1 })
      .lean()

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/overtime/requests/pending:
 *   get:
 *     tags:
 *       - Overtime
 *     summary: 取得待審核加班申請
 *     description: |
 *       - HR / Admin：回傳 supervisor_approved 狀態
 *       - 主管：回傳其下屬 pending 狀態
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 待審核申請列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OvertimeRequest'
 */
router.get('/requests/pending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { role, userId: currentUserId } = req.user

    let filter: Record<string, unknown>

    if (role === 'hr' || role === 'admin') {
      filter = { status: 'supervisor_approved' }
    } else {
      const subordinates = await User.find({ supervisorId: currentUserId }).select('_id').lean()
      const ids = subordinates.map((u) => u._id)
      filter = { userId: { $in: ids }, status: 'pending' }
    }

    const requests = await OvertimeRequest.find(filter)
      .populate('userId', 'name email department')
      .sort({ createdAt: -1 })
      .lean()

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/overtime/requests/{id}/approve:
 *   post:
 *     tags:
 *       - Overtime
 *     summary: 審核通過加班申請
 *     description: |
 *       **兩層審核流程：**
 *       1. 主管：pending → supervisor_approved
 *       2. HR / Admin：supervisor_approved → approved（若員工無加班費則自動累計補休時數）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: 同意
 *     responses:
 *       200:
 *         description: 審核通過
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OvertimeRequest'
 *       400:
 *         description: 狀態不符合審核條件
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非申請人主管或權限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/requests/:id/approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId: currentUserId, role } = req.user
    const { comment } = req.body

    const request = await OvertimeRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Overtime request not found' })

    const applicant = await User.findById(request.userId).lean()
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' })

    let nextStatus: string

    if (role === 'hr' || role === 'admin') {
      if (request.status !== 'supervisor_approved' && request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is not in an approvable state for HR' })
      }
      nextStatus = 'approved'
    } else {
      if (applicant.supervisorId?.toString() !== currentUserId) {
        return res
          .status(403)
          .json({ message: 'Forbidden — you are not the supervisor of this user' })
      }
      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is not pending' })
      }
      nextStatus = 'supervisor_approved'
    }

    request.approvalHistory.push({
      role,
      userId: new mongoose.Types.ObjectId(currentUserId),
      action: 'approved',
      comment,
      at: new Date(),
    })
    request.status = nextStatus as typeof request.status
    await request.save()

    // ── Post-approval side effects ────────────────────────────────────────
    if (nextStatus === 'supervisor_approved') {
      const hrUsers = await User.find({ role: 'hr', isActive: true }).select('email').lean()
      const hrEmails = hrUsers.map((u) => u.email)
      sendSupervisorApprovedOvertimeNotification(applicant.email, applicant.name, hrEmails).catch(
        console.error,
      )
    }

    if (nextStatus === 'approved') {
      sendHrApprovedOvertimeNotification(applicant.email, applicant.name).catch(console.error)

      // Grant compensatory hours if employee does not receive overtime pay
      if (!applicant.overtimePay && !request.compensatoryGenerated) {
        const year = new Date(request.date).getFullYear()
        await addCompensatoryHours(request.userId.toString(), year, request.hours)
        request.compensatoryGenerated = true
        await request.save()
      }
    }

    res.json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/overtime/requests/{id}/reject:
 *   post:
 *     tags:
 *       - Overtime
 *     summary: 駁回加班申請
 *     description: 主管或 HR / Admin 可駁回，需填寫原因
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: 業務量不符合加班標準
 *     responses:
 *       200:
 *         description: 駁回成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OvertimeRequest'
 *       400:
 *         description: 缺少原因或狀態不可駁回
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 員工無審核權限
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/requests/:id/reject', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId: currentUserId, role } = req.user
    const { comment } = req.body

    if (!comment) {
      return res.status(400).json({ message: 'comment is required for rejection' })
    }

    const request = await OvertimeRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Overtime request not found' })

    if (!['pending', 'supervisor_approved'].includes(request.status)) {
      return res.status(400).json({ message: 'Request cannot be rejected in its current state' })
    }

    const applicant = await User.findById(request.userId).lean()
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' })

    if (role === 'employee') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (role !== 'hr' && role !== 'admin') {
      if (applicant.supervisorId?.toString() !== currentUserId) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    }

    request.approvalHistory.push({
      role,
      userId: new mongoose.Types.ObjectId(currentUserId),
      action: 'rejected',
      comment,
      at: new Date(),
    })
    request.status = 'rejected'
    await request.save()

    sendRejectedOvertimeNotification(applicant.email, applicant.name, comment).catch(console.error)

    res.json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
