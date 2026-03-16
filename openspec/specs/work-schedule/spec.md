# work-schedule

## Purpose

管理全公司的工時設定與工作日設定，包括彈性工時範圍、核心工時及遲到早退判斷邏輯。

## Requirements

### Requirement: 系統預設彈性工時設定
系統 SHALL 維護全公司預設的彈性工時設定，Admin 可修改。

#### Scenario: 查詢工時設定
- **WHEN** 任何已登入使用者查詢工時設定
- **THEN** 系統回傳 { coreStart: "10:00", coreEnd: "16:00", dailyHours: 8, flexStart: "07:00", flexEnd: "22:00" }

#### Scenario: Admin 修改工時設定
- **WHEN** Admin 提交新的工時設定
- **THEN** 系統更新設定，後續打卡遲到/早退判斷依新設定計算

---

### Requirement: 遲到早退判斷邏輯
系統 SHALL 根據工時設定自動判斷員工出勤狀態。

#### Scenario: 判斷遲到
- **WHEN** 員工上班打卡時間晚於 coreStart
- **THEN** 出勤記錄標記 status: late，遲到分鐘數記錄於 lateMinutes

#### Scenario: 判斷早退
- **WHEN** 員工下班打卡時間早於 coreEnd
- **THEN** 出勤記錄標記 status: early_leave

#### Scenario: 打卡超出彈性範圍
- **WHEN** 員工嘗試在 flexStart 之前或 flexEnd 之後打卡
- **THEN** 系統允許打卡但標記警告（不阻擋，僅記錄）

---

### Requirement: 工作日設定
系統 SHALL 支援設定每週工作日（預設週一至週五），假日不計算出勤。

#### Scenario: 假日不顯示應打卡
- **WHEN** 今日為非工作日（週六、週日或國定假日）
- **THEN** 系統不要求打卡，出勤狀態顯示為「非工作日」
