import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'admin' | 'hr' | 'employee'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  department: string
  supervisorId?: mongoose.Types.ObjectId
  employmentDate: Date
  isActive: boolean
  mustChangePassword: boolean
  overtimePay: boolean
  initialPassword?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'hr', 'employee'], default: 'employee' },
    department: { type: String, default: '' },
    supervisorId: { type: Schema.Types.ObjectId, ref: 'User' },
    employmentDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true },
    overtimePay: { type: Boolean, default: false },
    initialPassword: { type: String },
  },
  { timestamps: true },
)

UserSchema.index({ supervisorId: 1 })
UserSchema.index({ isActive: 1, role: 1 })

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model<IUser>('User', UserSchema)
