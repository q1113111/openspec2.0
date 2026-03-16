# leave-management

## Purpose

管理員工假別餘額與假單申請流程，支援多種假別、年資計算特休，以及假單的提交、查詢與撤回。

## Requirements

### Requirement: 假別餘額查詢
系統 SHALL 提供員工查詢個人各假別剩餘天數（或小時數）。

#### Scenario: 查詢假別餘額
- **WHEN** 員工查詢個人假別餘額
- **THEN** 系統回傳各假別 { type, total, used, remaining }，特休依年資動態計算

#### Scenario: 特休天數依年資自動計算
- **WHEN** 系統計算特休餘額
- **THEN** 依台灣勞基法（年資 0.5年:3天, 1年:7天, 2年:10天, 3年:14天, 5年:15天, 每多1年+1天上限30天）計算本年度應有天數

---

### Requirement: 提交假單申請
員工 SHALL 能提交各種假別的假單申請，系統驗證餘額是否充足。

#### Scenario: 提交假單成功
- **WHEN** 員工提交假單（type, startDate, endDate, reason, proxyUserId）且餘額充足
- **THEN** 系統建立假單，status 設為 pending，發送通知給直屬主管

#### Scenario: 假別餘額不足
- **WHEN** 員工提交假單所需天數超過剩餘天數
- **THEN** 系統回傳 400，拒絕申請並說明餘額不足

#### Scenario: 補休申請
- **WHEN** 員工申請補休假，hours 為申請時數
- **THEN** 系統檢查補休餘額（以小時計），充足則建立申請

#### Scenario: 跨日假單天數計算
- **WHEN** 員工提交跨多日假單
- **THEN** 系統自動排除非工作日，僅計算工作日天數

---

### Requirement: 查詢假單列表
員工 SHALL 能查詢個人假單列表；Admin/HR SHALL 能查詢所有員工假單。

#### Scenario: 員工查詢個人假單
- **WHEN** 員工查詢假單（可依狀態、日期範圍篩選）
- **THEN** 系統回傳個人假單列表含審核歷程

#### Scenario: 撤回待審假單
- **WHEN** 員工對 status 為 pending 的假單執行撤回
- **THEN** 系統將假單 status 更新為 cancelled，不扣除假別餘額

---

### Requirement: 假別額度管理
Admin SHALL 能設定/調整員工的假別額度（排除動態計算的特休）。

#### Scenario: 手動調整年度假別額度
- **WHEN** Admin 調整指定員工的某假別年度總額
- **THEN** 系統更新 leave_balances，remaining 重新計算（total - used）
