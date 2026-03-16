## Why

企業缺乏統一的出缺勤管理工具，員工打卡、請假、加班申請流程分散且難以追蹤。本系統旨在提供一個完整的線上出缺勤管理平台，涵蓋打卡、假單簽核、加班申請及補休管理，提升 HR 行政效率並確保合規性。

## What Changes

- 全新系統，從零建立（非既有系統修改）
- 員工可透過網頁進行上下班打卡（任何地點，記錄時間戳與 IP）
- 支援彈性工時設定（核心時段 + 每日應工作時數）
- 假單申請系統，涵蓋 8 種假別，含餘額追蹤
- 二層簽核流程（直屬主管 → HR）
- 加班申請系統，核准後自動產生補休時數
- 代理人制度（工作代理，記錄用途）
- 管理者後台：使用者管理、假別額度設定
- 新增使用者時自動發送 Email 含初始密碼
- Docker Compose 一鍵啟動（含 MongoDB Admin 介面）

## Capabilities

### New Capabilities

- `auth`: 使用者認證與角色管理（admin / hr / employee），JWT 驗證，首次登入強制改密碼
- `user-management`: 管理者對使用者的 CRUD 操作，含 Email 發送初始密碼
- `attendance`: 員工上下班打卡、出勤記錄查詢、遲到/早退自動標記
- `work-schedule`: 彈性工時設定（核心時段、每日工時目標）
- `leave-management`: 假單申請、8 種假別餘額管理、年資自動計算特休
- `leave-approval`: 二層簽核流程（主管 → HR），Email 通知，代理人記錄
- `overtime`: 加班申請、二層簽核、核准後自動產生補休時數
- `notification`: Email 通知系統（帳號建立、假單狀態變更、加班審核）

### Modified Capabilities

（無既有系統）

## Impact

- **前端**：Vue 3 + UnoCSS + Vite，全新專案
- **後端**：Node.js + Express，RESTful API
- **資料庫**：MongoDB + Mongoose，全新 Schema 設計
- **Email**：Nodemailer + SMTP（環境變數設定，支援 Gmail / SendGrid）
- **容器化**：Docker Compose（frontend, backend, mongodb, mongo-express）
- **外部依賴**：SMTP 服務（需設定環境變數）
