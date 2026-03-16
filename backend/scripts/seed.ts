import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User'
import WorkSchedule from '../src/models/WorkSchedule'
import LeaveBalance from '../src/models/LeaveBalance'

const YEAR = 2026

async function hashPw(pw: string) {
  return bcrypt.hash(pw, 10)
}

async function ensureLeaveBalances(userId: mongoose.Types.ObjectId, annualDays: number) {
  const types: { type: string; total: number }[] = [
    { type: 'annual', total: annualDays },
    { type: 'personal', total: 3 },
    { type: 'sick', total: 30 },
    { type: 'compensatory', total: 0 },
    { type: 'marriage', total: 8 },
    { type: 'bereavement', total: 8 },
    { type: 'maternity', total: 0 },
    { type: 'paternity', total: 7 },
    { type: 'official', total: 0 },
  ]

  for (const { type, total } of types) {
    await LeaveBalance.updateOne(
      { userId, year: YEAR, type },
      { $setOnInsert: { userId, year: YEAR, type, total, used: 0 } },
      { upsert: true },
    )
  }
}

async function seed() {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not defined')

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  // ── Work Schedule ──────────────────────────────────────────────
  const scheduleCount = await WorkSchedule.countDocuments()
  if (scheduleCount === 0) {
    await WorkSchedule.create({})
    console.log('✓ Default work schedule created')
  }

  // ── 1. Admin ───────────────────────────────────────────────────
  let admin = await User.findOne({ email: 'admin@company.com' })
  if (!admin) {
    admin = await User.create({
      name: '系統管理員',
      email: 'admin@company.com',
      passwordHash: await hashPw('Admin@1234'),
      role: 'admin',
      department: '資訊部',
      employmentDate: new Date('2020-01-01'),
      isActive: true,
      mustChangePassword: false,
      overtimePay: false,
    })
    console.log('✓ admin@company.com / Admin@1234')
  } else {
    console.log('  admin@company.com already exists')
  }

  // ── 2. HR ──────────────────────────────────────────────────────
  let hr = await User.findOne({ email: 'hr@company.com' })
  if (!hr) {
    hr = await User.create({
      name: '林人資',
      email: 'hr@company.com',
      passwordHash: await hashPw('Hr@12345'),
      role: 'hr',
      department: '人資部',
      employmentDate: new Date('2019-03-15'),
      isActive: true,
      mustChangePassword: false,
      overtimePay: false,
    })
    console.log('✓ hr@company.com / Hr@12345')
  } else {
    console.log('  hr@company.com already exists')
  }
  await ensureLeaveBalances(hr._id as mongoose.Types.ObjectId, 15)

  // ── 3. Supervisor（主管 — 員工身份，有下屬）────────────────────
  let supervisor = await User.findOne({ email: 'supervisor@company.com' })
  if (!supervisor) {
    supervisor = await User.create({
      name: '陳部長',
      email: 'supervisor@company.com',
      passwordHash: await hashPw('Sup@12345'),
      role: 'employee',
      department: '業務部',
      employmentDate: new Date('2018-06-01'),
      isActive: true,
      mustChangePassword: false,
      overtimePay: false,
    })
    console.log('✓ supervisor@company.com / Sup@12345')
  } else {
    console.log('  supervisor@company.com already exists')
  }
  await ensureLeaveBalances(supervisor._id as mongoose.Types.ObjectId, 15)

  // ── 4. Employee A（有主管、可加班費）──────────────────────────
  let empA = await User.findOne({ email: 'employee1@company.com' })
  if (!empA) {
    empA = await User.create({
      name: '王小明',
      email: 'employee1@company.com',
      passwordHash: await hashPw('Emp@12345'),
      role: 'employee',
      department: '業務部',
      supervisorId: supervisor._id,
      employmentDate: new Date('2022-07-01'),
      isActive: true,
      mustChangePassword: false,
      overtimePay: true,
    })
    console.log('✓ employee1@company.com / Emp@12345  (業務部, 主管=陳部長, 加班費)')
  } else {
    console.log('  employee1@company.com already exists')
  }
  await ensureLeaveBalances(empA._id as mongoose.Types.ObjectId, 7)

  // ── 5. Employee B（有主管、不可加班費）──────────────────────────
  let empB = await User.findOne({ email: 'employee2@company.com' })
  if (!empB) {
    empB = await User.create({
      name: '李小花',
      email: 'employee2@company.com',
      passwordHash: await hashPw('Emp@12345'),
      role: 'employee',
      department: '業務部',
      supervisorId: supervisor._id,
      employmentDate: new Date('2023-03-20'),
      isActive: true,
      mustChangePassword: false,
      overtimePay: false,
    })
    console.log('✓ employee2@company.com / Emp@12345  (業務部, 主管=陳部長)')
  } else {
    console.log('  employee2@company.com already exists')
  }
  await ensureLeaveBalances(empB._id as mongoose.Types.ObjectId, 3)

  // ── 6. Employee C（資訊部、必須改密碼）──────────────────────────
  let empC = await User.findOne({ email: 'employee3@company.com' })
  if (!empC) {
    empC = await User.create({
      name: '張新進',
      email: 'employee3@company.com',
      passwordHash: await hashPw('Newuser@1'),
      role: 'employee',
      department: '資訊部',
      supervisorId: admin._id,
      employmentDate: new Date('2026-02-01'),
      isActive: true,
      mustChangePassword: true,
      overtimePay: false,
      initialPassword: 'Newuser@1',
    })
    console.log('✓ employee3@company.com / Newuser@1  (資訊部, 首次登入需改密碼)')
  } else {
    console.log('  employee3@company.com already exists')
  }
  await ensureLeaveBalances(empC._id as mongoose.Types.ObjectId, 3)

  // ── 7. Inactive Employee（停用帳號）──────────────────────────────
  const existingInactive = await User.findOne({ email: 'inactive@company.com' })
  if (!existingInactive) {
    await User.create({
      name: '趙離職員',
      email: 'inactive@company.com',
      passwordHash: await hashPw('Emp@12345'),
      role: 'employee',
      department: '業務部',
      employmentDate: new Date('2021-01-01'),
      isActive: false,
      mustChangePassword: false,
      overtimePay: false,
    })
    console.log('✓ inactive@company.com / Emp@12345  (停用帳號，無法登入)')
  } else {
    console.log('  inactive@company.com already exists')
  }

  await mongoose.disconnect()
  console.log('\nSeed complete ✓')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
