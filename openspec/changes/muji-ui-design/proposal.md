## Why

出缺勤管理系統目前缺乏視覺設計規範，需要一套符合品牌識別的 UI 風格提案。本次以 **MUJI 奶油風（Cream Minimalism）** 為主題，製作完整的 Pencil 設計稿，作為前端 UI 重構的視覺基準，與現有的暗色刺青風（tattoo-ui-redesign）形成設計對比。

## What Changes

- 在 `pencil-MUJI.pen` 中建立 MUJI 奶油風設計稿，包含三個核心畫面
- 定義 MUJI 色彩變量（design tokens）並寫入 Pencil 文件
- 設計 Dashboard 儀表板、請假申請表單、出勤記錄三個頁面（1440×900 桌面尺寸）
- 建立可複用的 Sidebar 導航組件

Non-goals：
- 不修改任何前端 Vue 原始碼（純視覺設計稿）
- 不實作深色模式
- 不影響現有 tattoo-ui-redesign 的任何進度

## Capabilities

### New Capabilities

- `muji-dashboard`: Dashboard 儀表板畫面設計（打卡區、統計卡片、假別餘額）
- `muji-leave-form`: 請假申請表單畫面設計（假別選擇、日期、原因、代理人）
- `muji-attendance-table`: 出勤記錄表格畫面設計（篩選列、資料表格、月度摘要）

### Modified Capabilities

（無，本次為純設計稿，不修改現有規格）

## Impact

- **設計稿檔案**：`pencil-MUJI.pen`（唯一修改對象）
- **不影響**：後端 API、前端 Vue 程式碼、資料庫、其他 changes
- **相關規格參考**：
  - `frontend/src/pages/DashboardPage.vue`
  - `frontend/src/pages/leave/LeaveRequestForm.vue`
  - `frontend/src/pages/attendance/AttendancePage.vue`
  - `frontend/src/types/index.ts`（LEAVE_TYPE_LABELS）
