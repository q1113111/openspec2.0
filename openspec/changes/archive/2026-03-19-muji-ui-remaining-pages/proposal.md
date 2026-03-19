## Why

`muji-ui-design` change 僅涵蓋 3 個核心頁面（Dashboard、請假申請、出勤記錄），系統共有 15 個前端頁面，尚有 12 個未製作 MUJI 奶油風設計稿。本次補齊所有缺少的頁面設計，讓設計稿完整覆蓋整個系統的使用者流程。

## What Changes

- 在 `pencil-MUJI.pen` 中補上 12 個缺少頁面的 MUJI 風設計稿（1440×900）
- 分四個群組：認證頁、請假管理、加班管理、管理員功能
- 所有頁面沿用已定義的 MUJI 色彩 design tokens

Non-goals：
- 不修改任何 Vue 原始碼（純視覺設計稿）
- 不重新設計已完成的 3 個頁面

## Capabilities

### New Capabilities

- `muji-auth-pages`: 登入頁（LoginPage）與改密碼頁（ChangePasswordPage）設計
- `muji-leave-management`: 我的假單列表（MyLeavePage）、待審假單（PendingLeavePage）、假單詳情（LeaveDetailPage）設計
- `muji-overtime-pages`: 我的加班列表（MyOvertimePage）、待審加班（PendingOvertimePage）、加班申請表單（OvertimeRequestForm）設計
- `muji-admin-pages`: 員工管理（UserManagementPage）、員工表單（UserFormModal）、假別額度（LeaveQuotaPage）、班表設定（WorkSchedulePage）設計

### Modified Capabilities

（無）

## Impact

- **設計稿檔案**：`pencil-MUJI.pen`（唯一修改對象）
- **不影響**：後端 API、Vue 程式碼、資料庫、其他 changes
- **相關規格參考**：
  - `frontend/src/pages/LoginPage.vue`
  - `frontend/src/pages/ChangePasswordPage.vue`
  - `frontend/src/pages/leave/MyLeavePage.vue`
  - `frontend/src/pages/leave/PendingLeavePage.vue`
  - `frontend/src/pages/leave/LeaveDetailPage.vue`
  - `frontend/src/pages/overtime/MyOvertimePage.vue`
  - `frontend/src/pages/overtime/PendingOvertimePage.vue`
  - `frontend/src/pages/overtime/OvertimeRequestForm.vue`
  - `frontend/src/pages/admin/UserManagementPage.vue`
  - `frontend/src/pages/admin/UserFormModal.vue`
  - `frontend/src/pages/admin/LeaveQuotaPage.vue`
  - `frontend/src/pages/admin/WorkSchedulePage.vue`
