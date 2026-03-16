import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User'
import RefreshToken from '../models/RefreshToken'
import { authMiddleware, JwtPayload } from '../middleware/auth'

const router = Router()

const ACCESS_SECRET = () => process.env.JWT_ACCESS_SECRET || 'access_secret'
const REFRESH_SECRET = () => process.env.JWT_REFRESH_SECRET || 'refresh_secret'

const COOKIE_OPTS_ACCESS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 1000, // 1h
}

const COOKIE_OPTS_REFRESH = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
}

function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET(), { expiresIn: '1h' })
}

async function generateRefreshToken(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ userId, token, expiresAt })
  return token
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase(), isActive: true })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = await user.comparePassword(password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = await generateRefreshToken(user._id.toString())

    res
      .cookie('accessToken', accessToken, COOKIE_OPTS_ACCESS)
      .cookie('refreshToken', refreshToken, COOKIE_OPTS_REFRESH)
      .json({
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        },
      })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true })
    }
    res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' })
    }

    const stored = await RefreshToken.findOne({ token })
    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const user = await User.findById(stored.userId)
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' })
    }

    // Token Rotation — revoke old, issue new
    stored.isRevoked = true
    await stored.save()

    const newRefreshToken = await generateRefreshToken(user._id.toString())
    const payload: JwtPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    }
    const accessToken = generateAccessToken(payload)

    res
      .cookie('accessToken', accessToken, COOKIE_OPTS_ACCESS)
      .cookie('refreshToken', newRefreshToken, COOKIE_OPTS_REFRESH)
      .json({ message: 'Token refreshed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(req.user.userId, {
      passwordHash,
      mustChangePassword: false,
    })

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
