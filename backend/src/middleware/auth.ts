import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { UserRole } from '../models/User'

export interface JwtPayload {
  userId: string
  role: UserRole
  email: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'access_secret'
    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
