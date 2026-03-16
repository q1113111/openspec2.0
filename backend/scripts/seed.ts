import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User'
import WorkSchedule from '../src/models/WorkSchedule'

async function seed() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not defined')

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  // Create default admin
  const existing = await User.findOne({ email: 'admin@company.com' })
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@1234', 10)
    await User.create({
      name: '系統管理員',
      email: 'admin@company.com',
      passwordHash,
      role: 'admin',
      department: '資訊部',
      employmentDate: new Date('2020-01-01'),
      isActive: true,
      mustChangePassword: false,
    })
    console.log('✓ Admin account created: admin@company.com / Admin@1234')
  } else {
    console.log('Admin account already exists')
  }

  // Create default work schedule if not exists
  const scheduleCount = await WorkSchedule.countDocuments()
  if (scheduleCount === 0) {
    await WorkSchedule.create({})
    console.log('✓ Default work schedule created')
  }

  await mongoose.disconnect()
  console.log('Seed complete')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
