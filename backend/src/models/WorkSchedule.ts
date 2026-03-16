import mongoose, { Schema, Document } from 'mongoose'

export interface IWorkSchedule extends Document {
  coreStart: string // HH:mm
  coreEnd: string // HH:mm
  dailyHours: number
  flexStart: string // HH:mm
  flexEnd: string // HH:mm
  workDays: number[] // 0=Sun,1=Mon,...,6=Sat
  updatedAt: Date
}

const WorkScheduleSchema = new Schema<IWorkSchedule>(
  {
    coreStart: { type: String, default: '10:00' },
    coreEnd: { type: String, default: '16:00' },
    dailyHours: { type: Number, default: 8 },
    flexStart: { type: String, default: '07:00' },
    flexEnd: { type: String, default: '22:00' },
    workDays: { type: [Number], default: [1, 2, 3, 4, 5] },
  },
  { timestamps: true },
)

export default mongoose.model<IWorkSchedule>('WorkSchedule', WorkScheduleSchema)
