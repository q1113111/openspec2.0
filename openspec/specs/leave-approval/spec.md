# leave-approval

## Purpose

管理假單的二層審核流程，包括直屬主管初審及 HR 最終核准，並支援代理人指定與待審假單查詢。

## Requirements

### Requirement: 直屬主管審核假單
直屬主管 SHALL 能對待審假單執行核准或拒絕。

#### Scenario: 主管核准假單
- **WHEN** 直屬主管對 status 為 pending 的假單執行核准
- **THEN** 系統更新 status 為 supervisor_approved，記錄審核歷程（userId, action: approved, comment, at），發送 Email 通知員工與 HR

#### Scenario: 主管拒絕假單
- **WHEN** 直屬主管對假單執行拒絕（附上原因）
- **THEN** 系統更新 status 為 rejected，記錄審核歷程，發送 Email 通知員工，假別餘額不扣除

#### Scenario: 非直屬主管無法審核
- **WHEN** 非該員工直屬主管嘗試審核假單
- **THEN** 系統回傳 403 Forbidden

---

### Requirement: HR 二層審核假單
HR SHALL 能對已通過主管審核（supervisor_approved）的假單執行最終核准或拒絕。

#### Scenario: HR 核准假單
- **WHEN** HR 對 status 為 supervisor_approved 的假單執行核准
- **THEN** 系統更新 status 為 approved，記錄審核歷程，扣除假別餘額，發送 Email 通知員工

#### Scenario: HR 拒絕假單
- **WHEN** HR 對假單執行拒絕（附上原因）
- **THEN** 系統更新 status 為 rejected，發送 Email 通知員工與主管，假別餘額不扣除

#### Scenario: HR 不能審核尚未通過主管的假單
- **WHEN** HR 嘗試審核 status 為 pending 的假單
- **THEN** 系統回傳 400，說明需先通過主管審核

---

### Requirement: 代理人指定與通知
員工申請假單時 SHALL 能指定工作代理人，代理人收到 Email 通知。

#### Scenario: 指定代理人
- **WHEN** 員工提交假單時填入 proxyUserId
- **THEN** 假單建立後，系統寄送 Email 給代理人，說明代理期間與代理事項

#### Scenario: 代理人欄位選填
- **WHEN** 員工提交假單時未填代理人
- **THEN** 系統正常建立假單，不發送代理通知

---

### Requirement: 待審假單列表
主管與 HR SHALL 能查看待自己審核的假單列表。

#### Scenario: 主管查詢待審假單
- **WHEN** 主管查詢待審假單
- **THEN** 系統回傳所有直屬下屬中 status 為 pending 的假單

#### Scenario: HR 查詢待審假單
- **WHEN** HR 查詢待審假單
- **THEN** 系統回傳所有 status 為 supervisor_approved 的假單
