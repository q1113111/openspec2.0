import mongoose, { Schema, Document } from 'mongoose'

export type AttendanceStatus = 'normal' | 'late' | 'early_leave' | 'absent'

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId
  date: string // YYYY-MM-DD
  clockIn?: Date
  clockOut?: Date
  ip?: string
  status: AttendanceStatus
  workHours?: number
  lateMinutes?: number
  createdAt: Date
  updatedAt: Date
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    clockIn: { type: Date },
    clockOut: { type: Date },
    ip: { type: String },
    status: { type: String, enum: ['normal', 'late', 'early_leave', 'absent'], default: 'normal' },
    workHours: { type: Number },
    lateMinutes: { type: Number },
  },
  { timestamps: true },
)

// Unique per user per date
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true })
AttendanceSchema.index({ date: 1 })

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema)
