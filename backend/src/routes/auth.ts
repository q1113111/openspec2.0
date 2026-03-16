import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User'
import RefreshToken from '../models/RefreshToken'
import { authMiddleware, JwtPayload } from '../middleware/auth'

const router = Router()

const ACCESS_SECRET = () => process.env.JWT_ACCESS_SECRET || 'access_secret'


function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET(), { expiresIn: '1h' })
}

async function generateRefreshToken(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ userId, token, expiresAt })
  return token
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 使用者登入
 *     description: 驗證帳號密碼，成功後回傳 accessToken 與 refreshToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@company.com
 *               password:
 *                 type: string
 *                 example: Admin@1234
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     mustChangePassword:
 *                       type: boolean
 *       400:
 *         description: 缺少 email 或 password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 帳號或密碼錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

    res.json({
      accessToken,
      refreshToken,
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

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 登出
 *     description: 撤銷 refreshToken
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.body?.refreshToken
    if (token) {
      await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true })
    }
    res.json({ message: 'Logged out' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 刷新 Access Token
 *     description: 使用 refreshToken 輪轉並產生新的 accessToken 與 refreshToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token 已更新
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: refreshToken 無效或已過期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.body?.refreshToken
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

    res.json({ accessToken, refreshToken: newRefreshToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

/**
 * @openapi
 * /api/auth/change-password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: 變更密碼
 *     description: 登入用戶變更自己的密碼，成功後清除 mustChangePassword 旗標
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: NewPass@123
 *     responses:
 *       200:
 *         description: 密碼變更成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: 密碼長度不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
