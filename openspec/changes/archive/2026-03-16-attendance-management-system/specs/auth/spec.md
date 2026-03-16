## ADDED Requirements

### Requirement: 使用者登入
系統 SHALL 提供 Email + 密碼登入，驗證成功後發放 Access Token（1小時）與 Refresh Token（7天），以 HTTP-only Cookie 傳送。

#### Scenario: 登入成功
- **WHEN** 使用者提交正確的 Email 與密碼
- **THEN** 系統回傳 200，設定 HTTP-only Cookie 含 Access Token 與 Refresh Token，回傳使用者基本資料（name, role）

#### Scenario: 登入失敗（錯誤密碼）
- **WHEN** 使用者提交錯誤密碼
- **THEN** 系統回傳 401 錯誤訊息，不揭露是帳號或密碼錯誤

#### Scenario: 帳號停用
- **WHEN** 使用者帳號 isActive 為 false
- **THEN** 系統回傳 403，拒絕登入

---

### Requirement: 首次登入強制改密碼
系統 SHALL 在使用者首次登入（使用系統產生的初始密碼）時，強制導向改密碼頁面，完成前無法使用其他功能。

#### Scenario: 首次登入偵測
- **WHEN** 使用者登入且 `mustChangePassword` 為 true
- **THEN** 系統回傳 token 但附帶 `requirePasswordChange: true`，前端強制導向改密碼頁

#### Scenario: 完成改密碼
- **WHEN** 使用者提交新密碼（符合規則：8碼以上）
- **THEN** 系統更新密碼，設定 `mustChangePassword: false`，導向首頁

---

### Requirement: Token 刷新
系統 SHALL 在 Access Token 過期時，使用 Refresh Token 自動取得新 Access Token。

#### Scenario: Refresh Token 有效
- **WHEN** 前端使用有效 Refresh Token 呼叫 `/api/auth/refresh`
- **THEN** 系統發放新的 Access Token，舊 Refresh Token 作廢並發放新 Refresh Token（Rotation）

#### Scenario: Refresh Token 無效或已撤銷
- **WHEN** 前端使用過期或已撤銷的 Refresh Token
- **THEN** 系統回傳 401，前端導向登入頁

---

### Requirement: 登出
系統 SHALL 提供登出功能，清除 Cookie 並撤銷 Refresh Token。

#### Scenario: 登出成功
- **WHEN** 使用者呼叫 `/api/auth/logout`
- **THEN** 系統清除 Cookie，將 Refresh Token 標記為失效，回傳 200

---

### Requirement: 角色權限控制
系統 SHALL 根據使用者角色（admin / hr / employee）限制 API 存取。

#### Scenario: 無權限存取
- **WHEN** employee 嘗試存取 admin 或 hr 專屬 API
- **THEN** 系統回傳 403 Forbidden
