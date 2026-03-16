import mongoose, { Schema, Document } from 'mongoose'
import type { LeaveType } from './LeaveRequest'

export interface ILeaveBalance extends Document {
  userId: mongoose.Types.ObjectId
  year: number
  type: LeaveType
  total: number // days (hours for compensatory)
  used: number
  updatedAt: Date
}

const LeaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    year: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        'annual',
        'compensatory',
        'personal',
        'sick',
        'marriage',
        'bereavement',
        'maternity',
        'paternity',
        'official',
      ],
      required: true,
    },
    total: { type: Number, required: true, default: 0 },
    used: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
)

LeaveBalanceSchema.index({ userId: 1, year: 1, type: 1 }, { unique: true })

export default mongoose.model<ILeaveBalance>('LeaveBalance', LeaveBalanceSchema)
