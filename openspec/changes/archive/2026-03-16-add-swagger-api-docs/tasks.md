## 1. 安裝套件與設定

- [x] 1.1 在 `backend/` 安裝 `swagger-jsdoc`、`swagger-ui-express` 及對應 `@types` 套件
- [x] 1.2 在 `.env.example` 與 `.env` 加入 `ENABLE_SWAGGER=true`
- [x] 1.3 建立 `backend/src/config/swagger.ts`，設定 `swaggerJsdoc` options（info、servers、components/schemas、securitySchemes）

## 2. 定義共用 Components Schemas

- [x] 2.1 在 `swagger.ts` 的 `components.schemas` 定義 `User` schema（id、name、email、role、department、supervisorId、mustChangePassword）
- [x] 2.2 定義 `Attendance` schema（id、userId、date、checkIn、checkOut、status）
- [x] 2.3 定義 `LeaveRequest` schema（id、userId、type、startDate、endDate、days、reason、status）
- [x] 2.4 定義 `OvertimeRequest` schema（id、userId、date、startTime、endTime、hours、reason、status）
- [x] 2.5 定義 `WorkSchedule` schema 及共用 `PaginatedResponse`、`ErrorResponse` schemas

## 3. 掛載 Swagger UI 於 index.ts

- [x] 3.1 在 `backend/src/index.ts` 讀取 `ENABLE_SWAGGER` 環境變數
- [x] 3.2 若啟用，掛載 `GET /api-docs` (swagger-ui-express) 與 `GET /api-docs.json` (swagger spec JSON)

## 4. 撰寫 Auth 路由 JSDoc 文件

- [x] 4.1 為 `POST /api/auth/login` 加入 OpenAPI 標籤（requestBody、200/401 responses）
- [x] 4.2 為 `POST /api/auth/logout`、`POST /api/auth/refresh`、`POST /api/auth/change-password` 加入文件

## 5. 撰寫 Users 路由 JSDoc 文件

- [x] 5.1 為 `GET /api/users`、`POST /api/users` 加入文件（含分頁 query params、roles 權限說明）
- [x] 5.2 為 `GET /api/users/:id`、`PUT /api/users/:id`、`DELETE /api/users/:id` 加入文件

## 6. 撰寫 Attendance 路由 JSDoc 文件

- [x] 6.1 為 `POST /api/attendance/check-in`、`POST /api/attendance/check-out` 加入文件
- [x] 6.2 為 `GET /api/attendance`、`GET /api/attendance/:id` 加入文件

## 7. 撰寫 Leave 路由 JSDoc 文件

- [x] 7.1 為 `POST /api/leave`、`GET /api/leave` 加入文件
- [x] 7.2 為審核端點 `PUT /api/leave/:id/supervisor-approve`、`PUT /api/leave/:id/approve`、`PUT /api/leave/:id/reject` 加入文件（含兩層審核流程說明）
- [x] 7.3 為 `GET /api/leave/balance` 加入文件

## 8. 撰寫 Overtime 路由 JSDoc 文件

- [x] 8.1 為 `POST /api/overtime`、`GET /api/overtime` 加入文件
- [x] 8.2 為審核端點加入文件（同請假兩層審核）

## 9. 撰寫 WorkSchedule 路由 JSDoc 文件

- [x] 9.1 為 `GET /api/work-schedule`、`PUT /api/work-schedule` 加入文件

## 10. 驗證與收尾

- [x] 10.1 啟動後端，瀏覽 `http://localhost:3000/api-docs` 確認 UI 正常顯示所有端點
- [x] 10.2 下載 `/api-docs.json` 驗證為合法 OpenAPI 3.0 JSON
- [x] 10.3 確認 `ENABLE_SWAGGER=false` 時 `/api-docs` 回傳 404
- [x] 10.4 更新 `README.md` 或 `CLAUDE.md` 加入 Swagger 說明（存取路徑、環境變數）
