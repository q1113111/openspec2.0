import mongoose, { Schema, Document } from 'mongoose'

export type LeaveType =
  | 'annual' // 特休/年假
  | 'compensatory' // 補休
  | 'personal' // 事假
  | 'sick' // 病假
  | 'marriage' // 婚假
  | 'bereavement' // 喪假
  | 'maternity' // 產假
  | 'paternity' // 陪產假
  | 'official' // 公假

export type LeaveStatus = 'pending' | 'supervisor_approved' | 'approved' | 'rejected' | 'cancelled'

export interface IApprovalRecord {
  role: string
  userId: mongoose.Types.ObjectId
  action: 'approved' | 'rejected'
  comment?: string
  at: Date
}

export interface ILeaveRequest extends Document {
  userId: mongoose.Types.ObjectId
  type: LeaveType
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  totalDays: number
  totalHours?: number // for compensatory
  reason: string
  proxyUserId?: mongoose.Types.ObjectId
  status: LeaveStatus
  approvalHistory: IApprovalRecord[]
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

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalHours: { type: Number },
    reason: { type: String, required: true },
    proxyUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'supervisor_approved', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    approvalHistory: [ApprovalRecordSchema],
  },
  { timestamps: true },
)

LeaveRequestSchema.index({ userId: 1, status: 1 })
LeaveRequestSchema.index({ status: 1 })

export default mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema)
