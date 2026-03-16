## ADDED Requirements

### Requirement: 管理者新增使用者
Admin SHALL 能建立新使用者帳號，系統自動產生 8 碼隨機初始密碼並發送 Email 通知。

#### Scenario: 新增使用者成功
- **WHEN** Admin 提交使用者資料（name, email, role, department, supervisorId, employmentDate）
- **THEN** 系統建立使用者，產生隨機初始密碼，寄送 Welcome Email，回傳使用者資料（含初始密碼）

#### Scenario: Email 已存在
- **WHEN** Admin 提交的 Email 已在系統中
- **THEN** 系統回傳 409 Conflict，不建立重複帳號

#### Scenario: Email 發送失敗
- **WHEN** SMTP 服務暫時不可用
- **THEN** 使用者仍正常建立，回傳初始密碼，並標記 Email 待補發

---

### Requirement: 管理者編輯使用者
Admin SHALL 能修改使用者基本資料（name, role, department, supervisorId, employmentDate, isActive）。

#### Scenario: 停用使用者
- **WHEN** Admin 將使用者 isActive 設為 false
- **THEN** 該使用者無法再登入，既有 Refresh Token 失效

#### Scenario: 更新直屬主管
- **WHEN** Admin 更新使用者的 supervisorId
- **THEN** 後續假單/加班申請將送往新的直屬主管審核

---

### Requirement: 管理者刪除使用者
Admin SHALL 能刪除使用者，系統採軟刪除（isActive: false）而非實際刪除資料，以保留歷史記錄。

#### Scenario: 刪除使用者
- **WHEN** Admin 刪除使用者
- **THEN** 系統設定 isActive: false，使用者無法登入，歷史出勤/假單資料保留

---

### Requirement: 管理者查詢使用者列表
Admin 與 HR SHALL 能查詢所有使用者列表，支援依部門、角色、狀態篩選。

#### Scenario: 查詢使用者列表
- **WHEN** Admin 呼叫使用者列表 API（可附帶篩選條件）
- **THEN** 系統回傳符合條件的使用者列表（不含密碼欄位）

---

### Requirement: 員工查看個人資料
Employee SHALL 能查看並編輯自身非權限相關資料（不含 role, supervisorId 等）。

#### Scenario: 查看個人資料
- **WHEN** 員工呼叫 `/api/users/me`
- **THEN** 系統回傳個人資料（name, email, department, employmentDate）
