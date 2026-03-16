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

// ── GET /api/users  (admin | hr) ──────────────────────────────────────────
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

// ── GET /api/users/me ─────────────────────────────────────────────────────
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

// ── GET /api/users/:id  (admin | hr) ─────────────────────────────────────
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

// ── POST /api/users  (admin) ──────────────────────────────────────────────
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
