## ADDED Requirements

### Requirement: 帳號建立通知
系統 SHALL 在新使用者帳號建立時，自動發送 Welcome Email 含初始密碼。

#### Scenario: 發送 Welcome Email
- **WHEN** Admin 成功建立新使用者
- **THEN** 系統寄送 Email 至新使用者信箱，內容含：系統登入連結、初始密碼、首次登入須改密碼提示

---

### Requirement: 假單狀態變更通知
系統 SHALL 在假單狀態改變時，發送 Email 通知相關人員。

#### Scenario: 新假單通知主管
- **WHEN** 員工提交假單
- **THEN** 系統寄送 Email 給直屬主管，含假單摘要與審核連結

#### Scenario: 主管核准後通知 HR 與員工
- **WHEN** 主管核准假單
- **THEN** 系統寄送 Email 給 HR（含假單摘要）與員工（告知主管已核准，待 HR 確認）

#### Scenario: 假單最終核准通知員工
- **WHEN** HR 核准假單
- **THEN** 系統寄送 Email 給員工，告知假單已全數核准，確認假別扣除

#### Scenario: 假單拒絕通知員工
- **WHEN** 主管或 HR 拒絕假單
- **THEN** 系統寄送 Email 給員工，含拒絕原因

---

### Requirement: 加班申請狀態變更通知
系統 SHALL 在加班申請狀態改變時，發送 Email 通知相關人員（流程與假單通知相同）。

#### Scenario: 加班申請各狀態通知
- **WHEN** 加班申請狀態變更（提交/主管核准/HR核准/拒絕）
- **THEN** 系統依對應角色發送 Email，邏輯同假單通知流程

---

### Requirement: 代理人通知
系統 SHALL 在假單核准後，寄送 Email 通知指定代理人。

#### Scenario: 通知代理人
- **WHEN** 含代理人的假單最終核准（HR 核准）
- **THEN** 系統寄送 Email 給代理人，告知代理期間（startDate ~ endDate）與申請人姓名

---

### Requirement: Email 重發機制
Admin SHALL 能對 Email 發送失敗的記錄執行重發。

#### Scenario: 重發 Welcome Email
- **WHEN** Admin 對指定使用者執行重發
- **THEN** 系統重新寄送 Welcome Email（若初始密碼仍未修改，帶原密碼；否則產生新密碼）
