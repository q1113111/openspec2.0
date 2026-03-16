import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '出缺勤管理系統 API',
      version: '1.0.0',
      description:
        '出缺勤管理系統後端 API 文件。認證採用 httpOnly Cookie (JWT)，請先呼叫 POST /api/auth/login 取得有效 session，Swagger UI 會自動帶入 Cookie。',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '本機開發伺服器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Access Token，透過 POST /api/auth/login 取得',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            name: { type: 'string', example: '王小明' },
            email: { type: 'string', format: 'email', example: 'wang@company.com' },
            role: {
              type: 'string',
              enum: ['admin', 'hr', 'employee'],
              example: 'employee',
            },
            department: { type: 'string', example: '工程部' },
            supervisorId: {
              type: 'string',
              nullable: true,
              example: '64a1b2c3d4e5f6a7b8c9d0e2',
            },
            employmentDate: {
              type: 'string',
              format: 'date',
              example: '2022-01-01',
            },
            isActive: { type: 'boolean', example: true },
            mustChangePassword: { type: 'boolean', example: false },
            overtimePay: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e3' },
            userId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            date: { type: 'string', format: 'date', example: '2026-03-16' },
            clockIn: { type: 'string', format: 'date-time', nullable: true },
            clockOut: { type: 'string', format: 'date-time', nullable: true },
            status: {
              type: 'string',
              enum: ['normal', 'late', 'early_leave', 'absent'],
              example: 'normal',
            },
            workHours: { type: 'number', example: 8.5 },
            lateMinutes: { type: 'number', example: 0 },
            ip: { type: 'string', example: '127.0.0.1' },
          },
        },
        LeaveRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e4' },
            userId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            type: {
              type: 'string',
              enum: [
                'annual',
                'sick',
                'personal',
                'compensatory',
                'marriage',
                'bereavement',
                'maternity',
                'paternity',
                'official',
              ],
              example: 'annual',
            },
            startDate: { type: 'string', format: 'date', example: '2026-04-01' },
            endDate: { type: 'string', format: 'date', example: '2026-04-03' },
            totalDays: { type: 'number', example: 3 },
            totalHours: { type: 'number', nullable: true, example: null },
            reason: { type: 'string', example: '家庭旅遊' },
            proxyUserId: {
              type: 'string',
              nullable: true,
              example: '64a1b2c3d4e5f6a7b8c9d0e2',
            },
            status: {
              type: 'string',
              enum: ['pending', 'supervisor_approved', 'approved', 'rejected', 'cancelled'],
              example: 'pending',
            },
            approvalHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string' },
                  userId: { type: 'string' },
                  action: { type: 'string', enum: ['approved', 'rejected'] },
                  comment: { type: 'string' },
                  at: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OvertimeRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e5' },
            userId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            date: { type: 'string', format: 'date', example: '2026-03-20' },
            startTime: { type: 'string', example: '18:00' },
            endTime: { type: 'string', example: '21:00' },
            hours: { type: 'number', example: 3 },
            reason: { type: 'string', example: '專案上線準備' },
            status: {
              type: 'string',
              enum: ['pending', 'supervisor_approved', 'approved', 'rejected'],
              example: 'pending',
            },
            compensatoryGenerated: { type: 'boolean', example: false },
            approvalHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string' },
                  userId: { type: 'string' },
                  action: { type: 'string', enum: ['approved', 'rejected'] },
                  comment: { type: 'string' },
                  at: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WorkSchedule: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            coreStart: { type: 'string', example: '09:00' },
            coreEnd: { type: 'string', example: '18:00' },
            dailyHours: { type: 'number', example: 8 },
            flexStart: { type: 'string', example: '07:00' },
            flexEnd: { type: 'string', example: '10:00' },
            workDays: {
              type: 'array',
              items: { type: 'number', minimum: 0, maximum: 6 },
              example: [1, 2, 3, 4, 5],
              description: '0=週日, 1=週一, ..., 6=週六',
            },
          },
        },
        LeaveBalance: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'annual' },
            year: { type: 'number', example: 2026 },
            entitled: { type: 'number', example: 14 },
            used: { type: 'number', example: 3 },
            remaining: { type: 'number', example: 11 },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
