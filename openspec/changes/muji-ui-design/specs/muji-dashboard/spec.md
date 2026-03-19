## ADDED Requirements

### Requirement: Dashboard 儀表板畫面設計

設計稿 SHALL 包含一個 1440×900 px 的 Dashboard 畫面，採用 MUJI 奶油風設計語言，呈現員工的出勤狀態、統計數據與假別餘額。

畫面結構：
- 左側固定 Sidebar（240px）：系統名稱、導航連結（儀表板、出勤、請假、加班、管理）
- 右側主內容區（1200px）：Header + 內容卡片
- 主背景色 `#FAF8F5`，卡片背景 `#F2EDE5`

#### Scenario: Header 區域呈現

- **WHEN** 設計稿 Dashboard 畫面被開啟
- **THEN** 右上角 SHALL 顯示日期與使用者名稱，左上顯示系統標題「出缺勤系統」

#### Scenario: 打卡狀態卡片

- **WHEN** 設計稿 Dashboard 畫面被檢視
- **THEN** SHALL 顯示今日打卡狀態（上班時間、下班打卡按鈕），卡片背景 `#F2EDE5`，按鈕使用主強調色 `#6B8C7A`

#### Scenario: 統計卡片列

- **WHEN** 設計稿 Dashboard 畫面被檢視
- **THEN** SHALL 顯示三個並排統計卡片：本月出勤天數、剩餘年假、待審假單數

#### Scenario: 假別餘額進度條

- **WHEN** 設計稿 Dashboard 畫面被檢視
- **THEN** SHALL 顯示年假、特休、補休三種假別的剩餘比例，以水平進度條呈現
