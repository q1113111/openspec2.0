# 出缺勤管理系統

企業出缺勤管理平台，支援打卡、請假、加班申請及二層簽核流程。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | Vue 3 + TypeScript + UnoCSS + Pinia + Vue Router |
| 後端 | Node.js + Express + TypeScript |
| 資料庫 | MongoDB 7 + Mongoose |
| 容器 | Docker Compose |
| 管理介面 | mongo-express |

---

## 快速啟動

### 前置需求

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 第一次啟動

```bash
# 1. 複製環境變數設定
cp .env.example .env

# 2. 啟動所有服務（首次會自動 build，需等幾分鐘）
docker compose up -d

# 3. 建立預設 Admin 帳號
docker compose exec backend npm run seed
```

### 日常啟動 / 停止

```bash
# 啟動
docker compose up -d

# 停止
docker compose down

# 查看服務狀態
docker compose ps

# 查看 log
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 服務入口

| 服務 | URL | 說明 |
|------|-----|------|
| 前端介面 | http://localhost:5173 | 主要使用介面 |
| 後端 API | http://localhost:3000/api | RESTful API |
| Swagger UI | http://localhost:3000/api-docs | API 文件（需設定 `ENABLE_SWAGGER=true`） |
| Mongo Express | http://localhost:8081 | MongoDB 管理介面 |

### Mongo Express 登入
- 帳號：`admin`
- 密碼：`admin123`

---

## 預設帳號

執行 seed 後會建立以下帳號：

| 帳號 | 密碼 | 角色 |
|------|------|------|
| admin@company.com | Admin@1234 | 系統管理員 |

> 首次登入後建議至「使用者管理」新增 HR 及員工帳號。

---

## 環境變數說明（.env）

```env
# MongoDB 連線
MONGO_ROOT_USER=admin
MONGO_ROOT_PASS=adminpass
MONGO_URI=mongodb://admin:adminpass@mongodb:27017/attendance?authSource=admin

# JWT 金鑰（請修改為隨機字串）
JWT_ACCESS_SECRET=your-access-secret-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this

# Email SMTP 設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="出缺勤系統 <noreply@yourcompany.com>"

# Mongo Express 登入
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=admin123
```

> SMTP 若未設定，Email 通知會改為 console.log 輸出，系統其他功能不受影響。

---

## 系統功能

### 角色權限

| 功能 | Employee | HR | Admin |
|------|:--------:|:--:|:-----:|
| 打卡上下班 | ✅ | ✅ | ✅ |
| 查看個人出勤 | ✅ | ✅ | ✅ |
| 查看所有出勤 | ❌ | ✅ | ✅ |
| 申請假單 | ✅ | ✅ | ✅ |
| 審核假單（第一層） | 主管身份 | ✅ | ✅ |
| 審核假單（第二層） | ❌ | ✅ | ✅ |
| 申請加班 | ✅ | ✅ | ✅ |
| 使用者管理 | ❌ | ❌ | ✅ |
| 假別額度設定 | ❌ | ❌ | ✅ |
| 工時設定 | ❌ | ❌ | ✅ |

### 假別類型

| 假別 | 天數規則 |
|------|---------|
| 特休 | 依台灣勞基法年資自動計算 |
| 補休 | 加班核准後每小時產生 1 小時補休 |
| 事假 | Admin 設定額度 |
| 病假 | Admin 設定額度 |
| 婚假 | 8 天（一次性） |
| 喪假 | 依親等 3 / 6 / 8 天 |
| 產假 | 56 天 |
| 陪產假 | 7 天 |
| 公假 | 無上限 |

### 特休天數（台灣勞基法）

| 年資 | 天數 |
|------|------|
| 未滿 6 個月 | 0 天 |
| 6 個月～未滿 1 年 | 3 天 |
| 1 年～未滿 2 年 | 7 天 |
| 2 年～未滿 3 年 | 10 天 |
| 3 年～未滿 5 年 | 14 天 |
| 5 年～未滿 10 年 | 15 天 |
| 10 年以上 | 每年 +1 天，上限 30 天 |

---

## 目錄結構

```
openspec/
├── backend/                  # Express 後端
│   ├── src/
│   │   ├── config/           # 資料庫連線設定
│   │   ├── middleware/       # authMiddleware、roleMiddleware
│   │   ├── models/           # Mongoose Schema
│   │   ├── routes/           # API 路由
│   │   └── services/         # 業務邏輯（email、假別計算）
│   ├── scripts/
│   │   └── seed.ts           # 初始資料腳本
│   └── Dockerfile
├── frontend/                 # Vue 3 前端
│   ├── src/
│   │   ├── components/       # 共用元件
│   │   ├── pages/            # 頁面元件
│   │   ├── router/           # Vue Router
│   │   ├── stores/           # Pinia Store
│   │   ├── types/            # TypeScript 型別
│   │   └── utils/            # API 封裝（axios）
│   └── Dockerfile
├── openspec/                 # 規格文件
│   └── changes/
│       └── attendance-management-system/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API 端點總覽

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
PUT    /api/auth/change-password

GET    /api/users
GET    /api/users/me
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

POST   /api/attendance/clock-in
POST   /api/attendance/clock-out
GET    /api/attendance/today
GET    /api/attendance

GET    /api/work-schedule
PUT    /api/work-schedule

GET    /api/leave/balances
GET    /api/leave/requests
POST   /api/leave/requests
GET    /api/leave/requests/pending
DELETE /api/leave/requests/:id
POST   /api/leave/requests/:id/approve
POST   /api/leave/requests/:id/reject

GET    /api/overtime/requests
POST   /api/overtime/requests
GET    /api/overtime/requests/pending
POST   /api/overtime/requests/:id/approve
POST   /api/overtime/requests/:id/reject
```
