import mongoose, { Schema, Document } from 'mongoose'

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  isRevoked: boolean
  createdAt: Date
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true },
)

RefreshTokenSchema.index({ token: 1 })
RefreshTokenSchema.index({ userId: 1 })
// TTL index — auto remove expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema)
