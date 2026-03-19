## Context

延續 `muji-ui-design` change 的設計語言，在 `pencil-MUJI.pen` 中補齊剩餘 12 個頁面的設計稿。現有的 MUJI 色彩 design tokens、Sidebar 組件結構均可直接沿用。

需在 `bi8Au` 框架外的畫布新空間排列新螢幕（或擴展 bi8Au），每個螢幕 1440×900 px。

## Goals / Non-Goals

**Goals:**
- 補齊所有 12 個缺少頁面的設計稿
- 沿用現有 MUJI 色彩 tokens（`$muji-*` 變量）
- 認證頁（Login/ChangePassword）不含 Sidebar，其餘頁面含左側 Sidebar 240px

**Non-Goals:**
- 不生成 Vue 程式碼
- 不修改已完成的 3 個頁面
- 不設計行動版

## Decisions

### 決策 1：分兩個畫布群組排列

- **Group A**（認證頁，無 Sidebar）：LoginPage、ChangePasswordPage — 置中表單設計
- **Group B**（含 Sidebar 的功能頁）：其餘 10 個頁面，按群組水平排列，每群組換行

### 決策 2：設計複雜度分級

| 頁面 | 類型 | 主要 UI 元素 |
|---|---|---|
| LoginPage | 認證 | 居中卡片、帳號/密碼輸入、登入按鈕 |
| ChangePasswordPage | 認證 | 居中卡片、3 個密碼輸入欄 |
| MyLeavePage | 列表 | 篩選列、假單卡片列表、狀態徽章 |
| PendingLeavePage | 審核列表 | 待審假單表格、核准/拒絕按鈕 |
| LeaveDetailPage | 詳情 | 假單資訊卡、審核記錄時間軸 |
| MyOvertimePage | 列表 | 加班記錄列表、時數統計 |
| PendingOvertimePage | 審核列表 | 待審加班表格、核准/拒絕按鈕 |
| OvertimeRequestForm | 表單 | 日期、時段、原因輸入 |
| UserManagementPage | 管理表格 | 員工列表表格、新增員工按鈕 |
| UserFormModal | Modal | 員工資料填寫表單 |
| LeaveQuotaPage | 管理表格 | 員工假別餘額管理表格 |
| WorkSchedulePage | 設定 | 工作日設定（週一至週五 checkbox） |

### 決策 3：沿用現有 Sidebar 結構

直接複製 Screen 1 Dashboard 的 Sidebar 節點結構，調整 active 導航項目高亮，避免重複建立。

## Risks / Trade-offs

- **畫布空間**：12 個新螢幕需要額外約 18000px 寬的空間，建立新的頂層 Frame 群組容納
- **Modal 設計**：UserFormModal 為 Modal 覆蓋層，以帶遮罩的 Frame 呈現
