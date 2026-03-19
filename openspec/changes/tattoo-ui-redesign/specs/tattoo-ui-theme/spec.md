## ADDED Requirements

### Requirement: 全站刺青主題色彩體系
系統前端 SHALL 採用「狂野紅黑」美式刺青色彩體系：主色猩紅 `#DC143C`、底色極黑 `#0d0d0d`/`#1a1a1a`、強調色暗金 `#DAA520`。所有 UI 元素 MUST 使用 `uno.config.ts` 中定義的 `tattoo-*` shortcuts。

#### Scenario: 頁面背景色
- **WHEN** 任何頁面載入
- **THEN** 頁面背景色 SHALL 為極黑 `#0d0d0d`，透過 `<html>` 元素設定

#### Scenario: 使用 tattoo shortcuts
- **WHEN** 開發者實作任何 UI 元素
- **THEN** MUST 優先使用 `tattoo-card`、`tattoo-btn-primary` 等已定義 shortcuts，不得直接寫 hex 色碼

### Requirement: Cinzel 字體系統
系統 SHALL 在 `frontend/index.html` 引入 Cinzel Decorative（標題）與 Cinzel（內文）Google Fonts。

#### Scenario: 字體載入
- **WHEN** 頁面首次載入
- **THEN** Google Fonts Cinzel 與 Cinzel Decorative 字體 SHALL 可用於 CSS font-family

#### Scenario: 標題字體應用
- **WHEN** 系統標題（`tattoo-heading` class）渲染
- **THEN** 字體 SHALL 為 Cinzel Decorative，顏色 SHALL 為金色 `#DAA520`

### Requirement: AppLayout 刺青主題
AppLayout、AppSidebar、AppHeader 組件 SHALL 套用刺青風格設計。

#### Scenario: Sidebar 樣式
- **WHEN** 側邊欄顯示
- **THEN** 背景色 SHALL 為極黑 `#0d0d0d`，左側 SHALL 有 2px 猩紅邊線，導覽項目 SHALL 使用 `tattoo-nav-link` / `tattoo-nav-active` shortcuts

#### Scenario: Header 樣式
- **WHEN** 頂部標題列顯示
- **THEN** 背景色 SHALL 為深黑 `#1a1a1a`，底部 SHALL 有猩紅分隔線，系統名稱 SHALL 使用 Cinzel Decorative 金色字體

#### Scenario: Logo 文字
- **WHEN** Sidebar/Header Logo 區域顯示
- **THEN** 文字 SHALL 為 `✦ ATTENDANCE ✦` 大寫格式，Cinzel Decorative 金色

### Requirement: 認證頁面刺青風格
LoginPage 與 ChangePasswordPage SHALL 採用刺青卡片設計。

#### Scenario: 登入頁背景
- **WHEN** 登入頁面載入
- **THEN** 整頁背景 SHALL 為極黑 `#0d0d0d`

#### Scenario: 登入卡片樣式
- **WHEN** 登入表單顯示
- **THEN** 卡片 SHALL 使用 `tattoo-card` class，四角 SHALL 有 `TattooCorner` 裝飾組件，標題 SHALL 有 `TattooBanner` 卷軸

#### Scenario: 表單元素樣式
- **WHEN** 輸入框和按鈕顯示
- **THEN** 輸入框 SHALL 使用 `tattoo-input` class，送出按鈕 SHALL 使用 `tattoo-btn-primary` class

### Requirement: 儀表板刺青風格
DashboardPage SHALL 以刺青主題呈現統計卡片、打卡操作、假別餘額。

#### Scenario: 統計卡片
- **WHEN** 儀表板統計卡片顯示
- **THEN** 卡片 SHALL 使用 `tattoo-card` class，頂部 SHALL 有 2px 猩紅邊線，今日出勤大數字 SHALL 使用 Cinzel Decorative 猩紅色

#### Scenario: 打卡按鈕
- **WHEN** 打卡操作區域顯示
- **THEN** 上班打卡 SHALL 使用 `tattoo-btn-primary`（猩紅），下班打卡 SHALL 使用 `tattoo-btn-danger`

#### Scenario: 假別餘額進度條
- **WHEN** 假別餘額顯示
- **THEN** 進度條填充色 SHALL 為猩紅，邊框 SHALL 為金色

### Requirement: 業務頁面表格刺青風格
出缺勤、請假、加班相關頁面的表格 SHALL 套用刺青主題。

#### Scenario: 表格標頭
- **WHEN** 資料表格顯示
- **THEN** 標頭列 SHALL 使用 `tattoo-table-header` class（金色文字、深色底）

#### Scenario: 表格資料列
- **WHEN** 表格資料列顯示
- **THEN** 資料列 SHALL 使用 `tattoo-table-row` class（hover 時顯示深灰底色）

#### Scenario: 頁面標題區
- **WHEN** 業務頁面標題顯示
- **THEN** 標題 SHALL 使用 `tattoo-heading` class，下方 SHALL 有 `TattooDivider` 分隔線

### Requirement: StatusBadge 刺青徽章樣式
StatusBadge 組件 SHALL 更新為刺青徽章風格，使用 `tattoo-badge` class。

#### Scenario: 狀態徽章顯示
- **WHEN** 審核狀態徽章顯示
- **THEN** 徽章 SHALL 使用 `tattoo-badge` class，不同狀態 SHALL 有對應色彩（待審核：金色、已核准：猩紅、已拒絕：灰色）

### Requirement: ConfirmModal 刺青風格
ConfirmModal 組件 SHALL 採用刺青卡片設計。

#### Scenario: Modal 外觀
- **WHEN** 確認 Modal 顯示
- **THEN** Modal 內容 SHALL 使用 `tattoo-card` class，確認按鈕 SHALL 使用 `tattoo-btn-primary`，取消按鈕 SHALL 使用 `tattoo-btn-secondary`
