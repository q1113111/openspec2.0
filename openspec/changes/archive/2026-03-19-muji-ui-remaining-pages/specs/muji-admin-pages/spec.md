## ADDED Requirements

### Requirement: UserManagementPage 員工管理頁設計

設計稿 SHALL 包含一個 1440×900 px 的「員工管理」頁面，含左側 Sidebar（系統管理 active），以表格呈現所有員工列表，供 admin/hr 管理。

#### Scenario: 員工列表表格

- **WHEN** 設計稿員工管理頁被開啟
- **THEN** SHALL 顯示表格欄位：姓名、Email、角色、部門、到職日、狀態、操作按鈕（編輯/停用）

#### Scenario: 新增員工按鈕

- **WHEN** 設計稿頁面右上角被檢視
- **THEN** SHALL 顯示「+ 新增員工」按鈕（MUJI 綠填滿）

#### Scenario: 搜尋欄

- **WHEN** 設計稿篩選列被檢視
- **THEN** SHALL 顯示員工姓名/Email 搜尋輸入欄與角色篩選下拉

---

### Requirement: UserFormModal 員工表單 Modal 設計

設計稿 SHALL 包含一個 Modal 覆蓋層設計（疊加在 UserManagementPage 上），以居中卡片呈現員工新增/編輯表單。

表單欄位：姓名、Email、角色、部門、主管、到職日

#### Scenario: Modal 遮罩與卡片

- **WHEN** 設計稿員工表單 Modal 被呈現
- **THEN** SHALL 顯示半透明深色遮罩層 + 居中白卡片，卡片含標題「新增員工」、欄位表單、確認/取消按鈕

---

### Requirement: LeaveQuotaPage 假別額度管理頁設計

設計稿 SHALL 包含一個 1440×900 px 的「假別額度」頁面，含 Sidebar，以表格呈現每位員工的各假別餘額供管理員查閱與調整。

#### Scenario: 假別額度表格

- **WHEN** 設計稿假別額度頁被開啟
- **THEN** SHALL 顯示表格：員工姓名、年假、補休、病假、事假各類型的已用/剩餘天數，可點擊調整

---

### Requirement: WorkSchedulePage 班表設定頁設計

設計稿 SHALL 包含一個 1440×900 px 的「班表設定」頁面，含 Sidebar，以 checkbox 群組呈現工作日設定（週一至週日）。

#### Scenario: 工作日 Checkbox 設定

- **WHEN** 設計稿班表設定頁被開啟
- **THEN** SHALL 顯示週一至週日 7 個 checkbox，預設週一至週五勾選，可切換；另含班次時間設定（上班/下班時間）

#### Scenario: 儲存按鈕

- **WHEN** 設計稿班表設定頁底部被檢視
- **THEN** SHALL 顯示「儲存設定」按鈕（MUJI 綠）
