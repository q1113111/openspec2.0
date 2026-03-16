import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import LeaveRequest from '../models/LeaveRequest'
import LeaveBalance from '../models/LeaveBalance'
import User from '../models/User'
import { authMiddleware, requireRole } from '../middleware/auth'
import {
  calculateAnnualLeaveDays,
  countWorkingDays,
  deductLeaveBalance,
  getLeaveBalance,
} from '../services/leaveService'
import {
  sendLeaveRequestNotification,
  sendSupervisorApprovedLeaveNotification,
  sendHrApprovedLeaveNotification,
  sendRejectedLeaveNotification,
  sendProxyNotification,
} from '../services/emailService'
import type { LeaveType } from '../models/LeaveRequest'

const router = Router()

/**
 * @openapi
 * /api/leave/balances:
 *   get:
 *     tags:
 *       - Leave
 *     summary: 取得當前使用者假別餘額
 *     description: 依台灣勞基法年資自動計算年假，回傳所有假別今年可用天數
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 假別餘額列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveBalance'
 */
router.get('/balances', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const year = new Date().getFullYear()

    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const leaveTypes: LeaveType[] = [
      'annual',
      'compensatory',
      'personal',
      'sick',
      'marriage',
      'bereavement',
      'maternity',
      'paternity',
      'official',
    ]

    const balances = await Promise.all(
      leaveTypes.map(async (type) => {
        const b = await getLeaveBalance(userId, type, year, user.employmentDate)
        return { type, year, ...b }
      }),
    )

    res.json(balances)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/leave/requests:
 *   post:
 *     tags:
 *       - Leave
 *     summary: 提交請假申請
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
 *               - type
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [annual, sick, personal, compensatory, marriage, bereavement, maternity, paternity, official]
 *                 example: annual
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-01'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-03'
 *               reason:
 *                 type: string
 *                 example: 家庭旅遊
 *               proxyUserId:
 *                 type: string
 *                 description: 代理人 userId
 *               totalHours:
 *                 type: number
 *                 description: 補休小時數（僅 compensatory 假別需要）
 *     responses:
 *       201:
 *         description: 申請成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
 *       400:
 *         description: 假別餘額不足或必填欄位缺少
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Leave
 *     summary: 查詢請假申請列表
 *     description: 員工只能查自己；admin / hr 可依 userId / status / type 篩選
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
 *           enum: [pending, supervisor_approved, approved, rejected, cancelled]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
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
 *         description: 請假申請列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaveRequest'
 */
router.post('/requests', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId
    const { type, startDate, endDate, reason, proxyUserId, totalHours } = req.body

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'type, startDate, endDate and reason are required' })
    }

    const user = await User.findById(userId).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Get work schedule for working-day calculation
    const { getWorkSchedule } = await import('../services/workScheduleService')
    const schedule = await getWorkSchedule()
    const totalDays = countWorkingDays(startDate, endDate, schedule)

    // Validate balance for types that require it
    const typesRequiringBalance: LeaveType[] = ['annual', 'compensatory']
    if (typesRequiringBalance.includes(type as LeaveType)) {
      const year = new Date(startDate).getFullYear()
      const bal = await getLeaveBalance(userId, type as LeaveType, year, user.employmentDate)

      if (type === 'compensatory') {
        const requestHours = totalHours ?? totalDays * 8
        if (requestHours > bal.remaining) {
          return res.status(400).json({ message: 'Insufficient compensatory leave balance' })
        }
      } else {
        if (totalDays > bal.remaining) {
          return res.status(400).json({ message: 'Insufficient annual leave balance' })
        }
      }
    }

    const request = await LeaveRequest.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      startDate,
      endDate,
      totalDays,
      totalHours: type === 'compensatory' ? (totalHours ?? totalDays * 8) : undefined,
      reason,
      proxyUserId: proxyUserId ? new mongoose.Types.ObjectId(proxyUserId) : undefined,
      status: 'pending',
    })

    // Notify supervisor
    if (user.supervisorId) {
      const supervisor = await User.findById(user.supervisorId).lean()
      if (supervisor) {
        sendLeaveRequestNotification(supervisor.email, user.name, type, startDate, endDate).catch(
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

// ── GET /api/leave/requests ───────────────────────────────────────────────
router.get('/requests', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { role, userId: currentUserId } = req.user
    const { userId, status, type, startDate, endDate } = req.query

    const filter: Record<string, unknown> = {}

    if (role === 'employee') {
      filter.userId = new mongoose.Types.ObjectId(currentUserId)
    } else if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId as string)
    }

    if (status) filter.status = status
    if (type) filter.type = type
    if (startDate) filter.startDate = { $gte: startDate as string }
    if (endDate) filter.endDate = { $lte: endDate as string }

    const requests = await LeaveRequest.find(filter)
      .populate('userId', 'name email department')
      .populate('proxyUserId', 'name email')
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
 * /api/leave/requests/pending:
 *   get:
 *     tags:
 *       - Leave
 *     summary: 取得待審核請假申請
 *     description: |
 *       - HR / Admin：回傳 supervisor_approved 狀態的申請（等待 HR 終審）
 *       - 主管：回傳其下屬 pending 狀態的申請（等待主管初審）
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
 *                 $ref: '#/components/schemas/LeaveRequest'
 */
router.get('/requests/pending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { role, userId: currentUserId } = req.user

    let filter: Record<string, unknown>

    if (role === 'hr' || role === 'admin') {
      // HR sees supervisor_approved requests
      filter = { status: 'supervisor_approved' }
    } else {
      // Supervisors see pending requests from their direct reports
      const subordinates = await User.find({ supervisorId: currentUserId }).select('_id').lean()
      const ids = subordinates.map((u) => u._id)
      filter = { userId: { $in: ids }, status: 'pending' }
    }

    const requests = await LeaveRequest.find(filter)
      .populate('userId', 'name email department')
      .populate('proxyUserId', 'name email')
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
 * /api/leave/requests/{id}:
 *   delete:
 *     tags:
 *       - Leave
 *     summary: 取消請假申請
 *     description: 只有申請人本人（或 admin）可取消，且只有 pending 狀態可取消
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 取消成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave request cancelled
 *       400:
 *         description: 只有 pending 狀態可取消
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非申請人且非 admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 申請不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/requests/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId: currentUserId, role } = req.user
    const request = await LeaveRequest.findById(req.params.id)

    if (!request) return res.status(404).json({ message: 'Leave request not found' })

    // Only the owner (or admin) can cancel, and only when still pending
    if (request.userId.toString() !== currentUserId && role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' })
    }

    request.status = 'cancelled'
    await request.save()
    res.json({ message: 'Leave request cancelled' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/leave/requests/{id}/approve:
 *   post:
 *     tags:
 *       - Leave
 *     summary: 審核通過請假申請
 *     description: |
 *       **兩層審核流程：**
 *       1. 主管（supervisor）：pending → supervisor_approved
 *       2. HR / Admin：supervisor_approved → approved（並扣除假別餘額）
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
 *               $ref: '#/components/schemas/LeaveRequest'
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

    const request = await LeaveRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Leave request not found' })

    const applicant = await User.findById(request.userId).lean()
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' })

    let nextStatus: string

    if (role === 'hr' || role === 'admin') {
      // HR can approve supervisor_approved → approved
      if (request.status !== 'supervisor_approved' && request.status !== 'pending') {
        return res.status(400).json({ message: 'Request is not in an approvable state for HR' })
      }
      nextStatus = 'approved'
    } else {
      // Supervisor: pending → supervisor_approved
      // Verify current user is the supervisor of the applicant
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
      // Notify employee and all HR users
      const hrUsers = await User.find({ role: 'hr', isActive: true }).select('email').lean()
      const hrEmails = hrUsers.map((u) => u.email)
      sendSupervisorApprovedLeaveNotification(applicant.email, applicant.name, hrEmails).catch(
        console.error,
      )
    }

    if (nextStatus === 'approved') {
      // Deduct balance
      const year = new Date(request.startDate).getFullYear()
      await deductLeaveBalance(
        request.userId.toString(),
        request.type,
        year,
        request.totalDays,
        request.totalHours,
      )

      // Notify employee
      sendHrApprovedLeaveNotification(applicant.email, applicant.name).catch(console.error)

      // Notify proxy user if set
      if (request.proxyUserId) {
        const proxyUser = await User.findById(request.proxyUserId).lean()
        if (proxyUser) {
          sendProxyNotification(
            proxyUser.email,
            proxyUser.name,
            applicant.name,
            request.startDate,
            request.endDate,
          ).catch(console.error)
        }
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
 * /api/leave/requests/{id}/reject:
 *   post:
 *     tags:
 *       - Leave
 *     summary: 駁回請假申請
 *     description: 主管或 HR / Admin 可駁回 pending 或 supervisor_approved 的申請，需填寫原因
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
 *                 example: 人力不足，請擇期申請
 *     responses:
 *       200:
 *         description: 駁回成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeaveRequest'
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

    const request = await LeaveRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Leave request not found' })

    if (!['pending', 'supervisor_approved'].includes(request.status)) {
      return res.status(400).json({ message: 'Request cannot be rejected in its current state' })
    }

    const applicant = await User.findById(request.userId).lean()
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' })

    // Supervisor can only reject their own subordinates' requests
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

    sendRejectedLeaveNotification(applicant.email, applicant.name, comment).catch(console.error)

    res.json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
