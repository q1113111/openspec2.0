## 1. 專案初始化與基礎設施

- [x] 1.1 建立 monorepo 目錄結構（frontend/, backend/, docker-compose.yml）
- [x] 1.2 建立 backend Express 專案（package.json, tsconfig, 基本目錄結構）
- [x] 1.3 建立 frontend Vue3 + Vite + UnoCSS 專案
- [x] 1.4 撰寫 docker-compose.yml（frontend, backend, mongodb, mongo-express）
- [x] 1.5 撰寫各服務的 Dockerfile（frontend, backend）
- [x] 1.6 建立 .env.example 含所有環境變數（SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, JWT_SECRET 等）
- [x] 1.7 設定 Mongoose 連線（backend/src/config/database.ts）

## 2. 資料庫 Schema

- [x] 2.1 建立 User Schema（mongoose）含所有欄位及 index
- [x] 2.2 建立 Attendance Schema（含唯一索引 userId + date）
- [x] 2.3 建立 LeaveRequest Schema（含 approvalHistory 子陣列）
- [x] 2.4 建立 OvertimeRequest Schema（含 approvalHistory 子陣列）
- [x] 2.5 建立 LeaveBalance Schema（含唯一索引 userId + year + type）
- [x] 2.6 建立 RefreshToken Schema（userId, token, expiresAt, isRevoked）
- [x] 2.7 建立 WorkSchedule Schema（全公司設定，單筆文件）
- [x] 2.8 建立 AdminSeed 初始資料腳本（建立預設 admin 帳號）

## 3. 認證 API（auth）

- [x] 3.1 POST /api/auth/login（Email + 密碼，回傳 JWT Cookie）
- [x] 3.2 POST /api/auth/logout（撤銷 Refresh Token，清除 Cookie）
- [x] 3.3 POST /api/auth/refresh（Refresh Token Rotation）
- [x] 3.4 PUT /api/auth/change-password（首次登入改密碼）
- [x] 3.5 建立 authMiddleware（驗證 Access Token）
- [x] 3.6 建立 roleMiddleware（驗證角色權限）

## 4. 使用者管理 API（user-management）

- [x] 4.1 GET /api/users（admin/hr，支援篩選）
- [x] 4.2 GET /api/users/me（個人資料）
- [x] 4.3 POST /api/users（admin，新增使用者，發送 Welcome Email）
- [x] 4.4 PUT /api/users/:id（admin，編輯使用者）
- [x] 4.5 DELETE /api/users/:id（admin，軟刪除）
- [x] 4.6 POST /api/users/:id/resend-email（admin，重發 Welcome Email）
- [x] 4.7 建立 Email 服務（Nodemailer，sendWelcomeEmail 函式）

## 5. 打卡 API（attendance）

- [x] 5.1 POST /api/attendance/clock-in（上班打卡）
- [x] 5.2 POST /api/attendance/clock-out（下班打卡）
- [x] 5.3 GET /api/attendance/today（今日狀態查詢）
- [x] 5.4 GET /api/attendance（列表，employee 只看自己，admin/hr 可篩選）
- [x] 5.5 建立遲到/早退判斷邏輯（workScheduleService）

## 6. 工時設定 API（work-schedule）

- [x] 6.1 GET /api/work-schedule（查詢設定）
- [x] 6.2 PUT /api/work-schedule（admin，修改設定）

## 7. 假別餘額與假單 API（leave-management）

- [x] 7.1 GET /api/leave/balances（個人假別餘額，特休動態計算）
- [x] 7.2 建立特休天數計算邏輯（依台灣勞基法年資計算）
- [x] 7.3 POST /api/leave/requests（提交假單申請，驗證餘額）
- [x] 7.4 GET /api/leave/requests（假單列表，含篩選）
- [x] 7.5 DELETE /api/leave/requests/:id（撤回 pending 假單）
- [x] 7.6 建立工作日計算邏輯（排除週末）

## 8. 假單簽核 API（leave-approval）

- [x] 8.1 POST /api/leave/requests/:id/approve（主管/HR 核准）
- [x] 8.2 POST /api/leave/requests/:id/reject（主管/HR 拒絕）
- [x] 8.3 GET /api/leave/requests/pending（待審列表）
- [x] 8.4 建立假單核准後扣除假別餘額邏輯
- [x] 8.5 建立假單審核 Email 通知邏輯（各狀態對應通知對象）

## 9. 加班申請 API（overtime）

- [x] 9.1 POST /api/overtime/requests（提交加班申請）
- [x] 9.2 GET /api/overtime/requests（加班記錄列表）
- [x] 9.3 POST /api/overtime/requests/:id/approve（主管/HR 核准）
- [x] 9.4 POST /api/overtime/requests/:id/reject（主管/HR 拒絕）
- [x] 9.5 建立加班核准後產生補休時數邏輯

## 10. 前端：基礎架構

- [x] 10.1 設定 Vue Router（路由結構：login, dashboard, 各功能頁）
- [x] 10.2 設定 Pinia Store（auth store, user store）
- [x] 10.3 建立 API 請求封裝（axios instance，自動刷新 Token）
- [x] 10.4 建立 Layout 元件（側邊欄、頂部導航）
- [x] 10.5 建立 router guard（未登入導向 login，mustChangePassword 導向改密碼頁）

## 11. 前端：認證頁面

- [x] 11.1 登入頁（LoginPage.vue）
- [x] 11.2 改密碼頁（ChangePasswordPage.vue）

## 12. 前端：儀表板與打卡

- [x] 12.1 Dashboard 首頁（今日打卡狀態、快速打卡按鈕）
- [x] 12.2 出勤記錄頁（AttendancePage.vue，含月曆或列表檢視）

## 13. 前端：假單功能

- [x] 13.1 假別餘額卡片元件（LeaveBalanceCard.vue）
- [x] 13.2 申請假單表單（LeaveRequestForm.vue，含代理人選擇）
- [x] 13.3 假單列表頁（MyLeavePage.vue）
- [x] 13.4 待審假單頁（PendingLeavePage.vue，主管/HR 用）
- [x] 13.5 假單詳情與審核頁（LeaveDetailPage.vue）

## 14. 前端：加班功能

- [x] 14.1 申請加班表單（OvertimeRequestForm.vue）
- [x] 14.2 加班記錄頁（MyOvertimePage.vue）
- [x] 14.3 待審加班頁（PendingOvertimePage.vue，主管/HR 用）

## 15. 前端：Admin 後台

- [x] 15.1 使用者管理頁（UserManagementPage.vue，含新增/編輯/停用）
- [x] 15.2 新增/編輯使用者 Modal（UserFormModal.vue）
- [x] 15.3 假別額度管理頁（LeaveQuotaPage.vue）
- [x] 15.4 工時設定頁（WorkSchedulePage.vue）

## 16. 整合測試與部署驗證

- [x] 16.1 驗證 Docker Compose 完整啟動（所有 4 個服務）
- [x] 16.2 驗證 mongo-express 可存取 MongoDB
- [x] 16.3 驗證 Admin Seed 腳本執行後可登入
- [x] 16.4 端對端測試：打卡流程
- [x] 16.5 端對端測試：假單申請 → 主管核准 → HR 核准 → 餘額扣除
- [x] 16.6 端對端測試：加班申請 → 核准 → 補休時數產生
- [x] 16.7 驗證 Email 發送（Welcome Email 與審核通知）
