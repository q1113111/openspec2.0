import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database'
import { swaggerSpec } from './config/swagger'
import swaggerUi from 'swagger-ui-express'

// Routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import attendanceRoutes from './routes/attendance'
import workScheduleRoutes from './routes/workSchedule'
import leaveRoutes from './routes/leave'
import overtimeRoutes from './routes/overtime'

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/work-schedule', workScheduleRoutes)
app.use('/api/leave', leaveRoutes)
app.use('/api/overtime', overtimeRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

if (process.env.ENABLE_SWAGGER === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.log('Swagger UI available at http://localhost:3000/api-docs')
}

connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  })
