## ADDED Requirements

### Requirement: 員工上班打卡
員工 SHALL 能在系統中執行上班打卡，每日限打卡一次，記錄時間戳與 IP。

#### Scenario: 正常上班打卡
- **WHEN** 員工點擊「上班打卡」且當日尚未打卡
- **THEN** 系統記錄當前時間為 clockIn，狀態標記為 normal 或 late（依工時設定判斷）

#### Scenario: 重複上班打卡
- **WHEN** 員工嘗試在同一日再次上班打卡
- **THEN** 系統回傳 409，拒絕重複打卡

#### Scenario: 遲到標記
- **WHEN** 員工打卡時間晚於工作排班開始時間
- **THEN** 系統自動在出勤記錄標記 `status: late`

---

### Requirement: 員工下班打卡
員工 SHALL 能在上班打卡後執行下班打卡，系統自動計算工作時數。

#### Scenario: 正常下班打卡
- **WHEN** 員工點擊「下班打卡」且當日已有上班打卡
- **THEN** 系統記錄 clockOut，計算 workHours = (clockOut - clockIn) 小時，狀態更新

#### Scenario: 早退標記
- **WHEN** 下班打卡時間早於預期下班時間
- **THEN** 系統標記 `status: early_leave`

#### Scenario: 未上班打卡即下班打卡
- **WHEN** 員工嘗試下班打卡但當日無上班記錄
- **THEN** 系統回傳 400 錯誤

---

### Requirement: 查詢出勤記錄
員工 SHALL 能查看個人出勤記錄；Admin/HR SHALL 能查看所有員工出勤記錄。

#### Scenario: 員工查詢個人出勤
- **WHEN** 員工查詢出勤記錄（可指定日期範圍）
- **THEN** 系統回傳該員工的出勤列表（clockIn, clockOut, workHours, status）

#### Scenario: Admin 查詢所有出勤
- **WHEN** Admin/HR 查詢出勤記錄（可依員工、部門、日期篩選）
- **THEN** 系統回傳符合條件的所有出勤記錄

---

### Requirement: 今日出勤狀態查詢
員工 SHALL 能查看今日是否已打卡及打卡時間。

#### Scenario: 查詢今日狀態
- **WHEN** 員工進入系統首頁
- **THEN** 系統回傳今日 clockIn / clockOut（若有），顯示當前打卡狀態
