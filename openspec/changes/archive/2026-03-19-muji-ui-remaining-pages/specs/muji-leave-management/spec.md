## ADDED Requirements

### Requirement: MyLeavePage 我的假單列表設計

設計稿 SHALL 包含一個 1440×900 px 的「我的假單」頁面，含左側 Sidebar（請假管理 active），以列表卡片方式呈現個人請假記錄。

內容：
- 頁面標題「我的假單」+ 「申請請假」按鈕（右上）
- 狀態篩選 tab（全部、待審、已核准、已拒絕）
- 假單卡片列表：假別、日期範圍、天數、狀態徽章、查看詳情連結

#### Scenario: 假單卡片列表

- **WHEN** 設計稿我的假單頁被開啟
- **THEN** SHALL 顯示至少 4 筆假單卡片，每張含：假別標籤、日期區間、天數、狀態徽章（pending=金、approved=綠、rejected=磚紅）

#### Scenario: 申請請假快速入口

- **WHEN** 設計稿頁面右上角被檢視
- **THEN** SHALL 顯示「+ 申請請假」按鈕（MUJI 綠）

---

### Requirement: PendingLeavePage 待審假單設計

設計稿 SHALL 包含一個 1440×900 px 的「待審假單」頁面，含 Sidebar，以表格呈現需要當前使用者審核的請假申請。

#### Scenario: 待審假單表格

- **WHEN** 設計稿待審假單頁被開啟
- **THEN** SHALL 顯示表格欄位：員工姓名、假別、日期範圍、天數、提交時間、操作按鈕（核准/拒絕）

#### Scenario: 審核操作按鈕

- **WHEN** 設計稿表格每列操作欄被檢視
- **THEN** SHALL 顯示「核准」（綠色）與「拒絕」（磚紅邊框）兩個按鈕

---

### Requirement: LeaveDetailPage 假單詳情設計

設計稿 SHALL 包含一個 1440×900 px 的「假單詳情」頁面，含 Sidebar，以卡片方式呈現單筆假單完整資訊及審核記錄。

#### Scenario: 假單基本資訊卡

- **WHEN** 設計稿假單詳情頁被開啟
- **THEN** SHALL 顯示：假別、日期區間、天數、原因、代理人、狀態，以兩欄 key-value 格式呈現

#### Scenario: 審核記錄時間軸

- **WHEN** 設計稿假單詳情頁下半部被檢視
- **THEN** SHALL 顯示審核記錄時間軸：員工提交 → 主管審核 → HR 審核，每筆含角色、姓名、時間、備註
