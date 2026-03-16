## ADDED Requirements

### Requirement: 提交加班申請
員工 SHALL 能事前提交加班申請（日期、時段、原因），送往直屬主管審核。

#### Scenario: 提交加班申請成功
- **WHEN** 員工提交加班申請（date, startTime, endTime, reason）
- **THEN** 系統計算加班時數（hours = endTime - startTime），建立申請，status 設為 pending，通知直屬主管

#### Scenario: 加班時數計算
- **WHEN** 系統計算加班時數
- **THEN** 時數 = (endTime - startTime)，以小時為單位（可有小數），最小單位 0.5 小時

---

### Requirement: 主管審核加班申請
直屬主管 SHALL 能核准或拒絕員工的加班申請，流程與假單相同（二層）。

#### Scenario: 主管核准加班
- **WHEN** 直屬主管核准加班申請
- **THEN** 系統更新 status 為 supervisor_approved，通知員工與 HR

#### Scenario: 主管拒絕加班
- **WHEN** 直屬主管拒絕加班申請
- **THEN** 系統更新 status 為 rejected，通知員工，不產生補休

---

### Requirement: HR 最終核准加班申請
HR SHALL 能對 supervisor_approved 的加班申請執行最終審核。

#### Scenario: HR 核准加班
- **WHEN** HR 核准加班申請
- **THEN** 系統更新 status 為 approved，依使用者設定產生補休時數或標記加班費，通知員工

#### Scenario: 產生補休時數
- **WHEN** 員工設定為補休制，HR 核准加班申請
- **THEN** 系統在 leave_balances 中增加對應補休時數（1小時加班 = 1小時補休）

---

### Requirement: 查詢加班記錄
員工 SHALL 能查詢個人加班申請記錄；Admin/HR SHALL 能查詢所有加班記錄。

#### Scenario: 員工查詢加班記錄
- **WHEN** 員工查詢加班記錄
- **THEN** 系統回傳個人加班申請列表（含狀態、審核歷程、產生的補休時數）

#### Scenario: Admin/HR 查詢所有加班
- **WHEN** Admin 或 HR 查詢加班記錄（可依員工、部門、日期篩選）
- **THEN** 系統回傳符合條件的所有加班記錄
