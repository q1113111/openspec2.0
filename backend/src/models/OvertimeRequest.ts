import mongoose, { Schema, Document } from 'mongoose'
import type { IApprovalRecord } from './LeaveRequest'

export type OvertimeStatus = 'pending' | 'supervisor_approved' | 'approved' | 'rejected'

export interface IOvertimeRequest extends Document {
  userId: mongoose.Types.ObjectId
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  hours: number
  reason: string
  status: OvertimeStatus
  approvalHistory: IApprovalRecord[]
  compensatoryGenerated: boolean
  createdAt: Date
  updatedAt: Date
}

const ApprovalRecordSchema = new Schema<IApprovalRecord>(
  {
    role: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['approved', 'rejected'], required: true },
    comment: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
)

const OvertimeRequestSchema = new Schema<IOvertimeRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    hours: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'supervisor_approved', 'approved', 'rejected'],
      default: 'pending',
    },
    approvalHistory: [ApprovalRecordSchema],
    compensatoryGenerated: { type: Boolean, default: false },
  },
  { timestamps: true },
)

OvertimeRequestSchema.index({ userId: 1, status: 1 })
OvertimeRequestSchema.index({ status: 1 })

export default mongoose.model<IOvertimeRequest>('OvertimeRequest', OvertimeRequestSchema)
