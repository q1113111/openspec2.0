## ADDED Requirements

### Requirement: MyOvertimePage 我的加班列表設計

設計稿 SHALL 包含一個 1440×900 px 的「我的加班」頁面，含左側 Sidebar（加班申請 active），列表呈現個人加班記錄。

#### Scenario: 加班記錄列表

- **WHEN** 設計稿我的加班頁被開啟
- **THEN** SHALL 顯示加班記錄卡片列表，每筆含：日期、加班時段、時數、原因、狀態徽章

#### Scenario: 月度工時統計摘要

- **WHEN** 設計稿頁面頂部摘要區被檢視
- **THEN** SHALL 顯示當月加班總時數統計卡片

---

### Requirement: PendingOvertimePage 待審加班設計

設計稿 SHALL 包含一個 1440×900 px 的「待審加班」頁面，含 Sidebar，表格呈現需審核的加班申請。

#### Scenario: 待審加班表格

- **WHEN** 設計稿待審加班頁被開啟
- **THEN** SHALL 顯示表格欄位：員工姓名、日期、加班時段、時數、原因、操作（核准/拒絕）

---

### Requirement: OvertimeRequestForm 加班申請表單設計

設計稿 SHALL 包含一個 1440×900 px 的「加班申請」表單頁面，含 Sidebar，居中表單卡片。

表單欄位：
- 加班日期（日期選擇器）
- 開始時間 / 結束時間（並排時間選擇器）
- 加班原因（textarea）
- 提交/取消按鈕

#### Scenario: 加班表單結構

- **WHEN** 設計稿加班申請表單頁被開啟
- **THEN** 表單卡片 SHALL 含：加班日期、並排時段選擇、原因 textarea、右對齊提交/取消按鈕

#### Scenario: 預估時數顯示

- **WHEN** 設計稿時段輸入欄被檢視
- **THEN** SHALL 在時間輸入下方顯示「預估加班時數：N 小時」提示文字
