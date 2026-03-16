## Context

全新建立的出缺勤管理系統，採用 Vue 3 + Express + MongoDB 技術堆疊，透過 Docker Compose 部署。系統需支援三種角色（admin / hr / employee），提供打卡、請假、加班申請及二層簽核等核心功能。

## Goals / Non-Goals

**Goals:**
- 提供完整的出缺勤管理功能（打卡、請假、加班）
- 二層簽核流程（直屬主管 → HR）
- 角色權限管理（admin / hr / employee）
- Email 通知整合（帳號建立、審核狀態）
- Docker Compose 一鍵部署
- 支援台灣勞基法特休天數自動計算

**Non-Goals:**
- 行動 App（僅網頁版）
- 薪資計算與發放
- 地點限制打卡（GPS / IP 白名單）
- 第三方 HR 系統整合
- 多公司/多租戶架構

---

## Decisions

### 1. 認證機制：JWT（Access + Refresh Token）

**決定**：使用 JWT，Access Token 有效期 1 小時，Refresh Token 7 天，儲存於 HTTP-only Cookie。

**理由**：相較 Session-based auth，JWT 在無狀態 API 架構下更易擴展；HTTP-only Cookie 防止 XSS 竊取 Token。

**替代方案**：Session + Redis — 需額外維護 Redis 容器，複雜度高於需求。

---

### 2. 角色架構：三種固定角色

```
admin     → 使用者管理、系統設定、所有資料查閱
hr        → 假單/加班第二層審核、出勤報表
employee  → 打卡、申請假單/加班、查看個人紀錄
```

**決定**：角色儲存於 User document，不使用動態 RBAC。

**理由**：需求明確為三種固定角色，動態 RBAC 增加不必要的複雜度。

---

### 3. 簽核流程架構

```
LeaveRequest / OvertimeRequest
    status: pending | supervisor_approved | approved | rejected

流程：
員工建立申請 (pending)
    → 直屬主管審核 (supervisor_approved / rejected)
    → HR 審核 (approved / rejected)
```

**決定**：申請單內嵌審核歷程（`approvalHistory` 陣列），不使用獨立 WorkflowStep collection。

**理由**：審核步驟固定為二層，不需要通用 workflow engine 的靈活性。

---

### 4. 補休時數計算

```
加班申請核准後：
    OvertimeRequest.hours → 自動建立 CompensatoryLeave 記錄
    補休餘額 = sum(已核准加班時數) - sum(已使用補休時數)
```

**決定**：補休以「小時」為單位，請假時以小時扣除；加班費 vs 補休由 Admin 在使用者設定中切換。

---

### 5. 特休天數計算（台灣勞基法）

```
年資（年）  特休天數
< 0.5       0
0.5 ~ 1     3
1 ~ 2       7
2 ~ 3       10
3 ~ 5       14
5 ~ 10      15
≥ 10        每多一年 +1，上限30天
```

**決定**：每次查詢時即時計算（根據入職日期），不預先儲存，避免資料不一致。

---

### 6. Email 服務：Nodemailer + SMTP

**決定**：使用 Nodemailer，SMTP 設定透過環境變數注入。

```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

**理由**：彈性高，本機開發可用 Mailtrap，生產環境可用 Gmail / SendGrid，不鎖定特定服務商。

---

### 7. 資料庫 Schema 設計（核心 Collections）

```
users
  _id, name, email, passwordHash, role, department,
  supervisorId, employmentDate, isActive,
  workConfig: { overtimePay: bool }
  createdAt, updatedAt

attendances
  _id, userId, date, clockIn, clockOut, ip,
  status: normal | late | early_leave | absent
  workHours (計算值)

leave_requests
  _id, userId, type, startDate, endDate, totalDays,
  reason, proxyUserId, status,
  approvalHistory: [{ role, userId, action, comment, at }]
  createdAt

overtime_requests
  _id, userId, date, startTime, endTime, hours, reason,
  status, approvalHistory: [...], createdAt

leave_balances
  _id, userId, year, type, total, used, remaining
  (特休動態計算，其他假別使用此 collection)
```

---

### 8. Docker Compose 架構

```yaml
services:
  frontend:   Vue3 + Vite (port 5173)
  backend:    Express (port 3000)
  mongodb:    MongoDB 7 (port 27017)
  mongo-express: (port 8081)
```

掛載 volume 確保 MongoDB 資料持久化。

---

## Risks / Trade-offs

| 風險 | 緩解措施 |
|------|---------|
| Email SMTP 設定錯誤導致無法建立帳號 | 後台提供重發 Email 功能；初始密碼也顯示於 Admin 建立使用者的 Response |
| 特休計算邏輯複雜，易有邊界條件 bug | 撰寫單元測試覆蓋所有年資區間 |
| MongoDB 無 Schema 強制，資料不一致 | 透過 Mongoose Schema + validation 強制欄位規範 |
| JWT Refresh Token 無法主動撤銷 | Refresh Token 儲存於 DB，登出時標記為失效 |
| 並發打卡（雙擊）可能產生重複記錄 | 後端以 userId + date 做唯一索引，前端按鈕防連擊 |

## Open Questions

- 跨日加班（例如 23:00 ~ 01:00）如何計算天數與補休時數？（建議：以開始日期為準，超過午夜自動截斷至 24:00）
- 病假是否需要上傳醫療證明附件？（初版不實作，預留欄位）
