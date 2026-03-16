import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { authMiddleware, requireRole } from '../middleware/auth'
import { sendWelcomeEmail } from '../services/emailService'

const router = Router()

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: 取得使用者列表
 *     description: 回傳所有使用者（admin / hr 限定），支援依角色、部門、啟用狀態篩選
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, hr, employee]
 *         description: 篩選角色
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: 篩選部門
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: 篩選啟用狀態
 *     responses:
 *       200:
 *         description: 使用者列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 權限不足（非 admin / hr）
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authMiddleware, requireRole('admin', 'hr'), async (req: Request, res: Response) => {
  try {
    const { role, department, isActive } = req.query
    const filter: Record<string, unknown> = {}

    if (role) filter.role = role
    if (department) filter.department = department
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const users = await User.find(filter).select('-passwordHash -initialPassword').lean()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: 取得當前登入使用者資料
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 當前使用者資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 使用者不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-passwordHash -initialPassword')
      .lean()
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: 取得指定使用者
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 使用者 MongoDB ObjectId
 *     responses:
 *       200:
 *         description: 使用者資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 使用者不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Users
 *     summary: 更新使用者資料
 *     description: 僅 admin 可操作
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
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, hr, employee]
 *               department:
 *                 type: string
 *               supervisorId:
 *                 type: string
 *                 nullable: true
 *               employmentDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *               overtimePay:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 使用者不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Users
 *     summary: 停用使用者（軟刪除）
 *     description: 僅 admin 可操作，將 isActive 設為 false
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
 *         description: 停用成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deactivated
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: 使用者不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id',
  authMiddleware,
  requireRole('admin', 'hr'),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-passwordHash -initialPassword')
        .lean()
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
)

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: 建立新使用者
 *     description: 僅 admin 可操作。系統自動產生隨機密碼並發送歡迎 Email，mustChangePassword 預設為 true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - employmentDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: 李小華
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lee@company.com
 *               role:
 *                 type: string
 *                 enum: [admin, hr, employee]
 *                 default: employee
 *               department:
 *                 type: string
 *                 example: 行銷部
 *               supervisorId:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e1
 *               employmentDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-01-01'
 *               overtimePay:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: 使用者建立成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 必填欄位缺少
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非 admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email 已被使用
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { name, email, role, department, supervisorId, employmentDate, overtimePay } = req.body

    if (!name || !email || !employmentDate) {
      return res.status(400).json({ message: 'name, email and employmentDate are required' })
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const plainPassword = generatePassword()
    const passwordHash = await bcrypt.hash(plainPassword, 10)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      initialPassword: plainPassword,
      role: role || 'employee',
      department: department || '',
      supervisorId: supervisorId || undefined,
      employmentDate: new Date(employmentDate),
      overtimePay: overtimePay ?? false,
      mustChangePassword: true,
    })

    // Fire and forget welcome email
    sendWelcomeEmail(email, name, plainPassword).catch(console.error)

    const { passwordHash: _ph, initialPassword: _ip, ...userData } = user.toObject()
    res.status(201).json(userData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── PUT /api/users/:id  (admin) ───────────────────────────────────────────
router.put('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { name, role, department, supervisorId, employmentDate, isActive, overtimePay } = req.body
    const update: Record<string, unknown> = {}

    if (name !== undefined) update.name = name
    if (role !== undefined) update.role = role
    if (department !== undefined) update.department = department
    if (supervisorId !== undefined) update.supervisorId = supervisorId || null
    if (employmentDate !== undefined) update.employmentDate = new Date(employmentDate)
    if (isActive !== undefined) update.isActive = isActive
    if (overtimePay !== undefined) update.overtimePay = overtimePay

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('-passwordHash -initialPassword')
      .lean()

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── DELETE /api/users/:id  (admin) — soft delete ─────────────────────────
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
      .select('-passwordHash -initialPassword')
      .lean()

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deactivated', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ── POST /api/users/:id/resend-email  (admin) ─────────────────────────────
router.post(
  '/:id/resend-email',
  authMiddleware,
  requireRole('admin'),
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) return res.status(404).json({ message: 'User not found' })

      if (!user.initialPassword) {
        return res.status(400).json({ message: 'No initial password stored for this user' })
      }

      await sendWelcomeEmail(user.email, user.name, user.initialPassword)
      res.json({ message: 'Welcome email resent' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
)

export default router
