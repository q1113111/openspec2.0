## ADDED Requirements

### Requirement: Gmail SMTP 設定
系統 SHALL 使用 Gmail SMTP（smtp.gmail.com, port 587, STARTTLS）作為 Email 傳輸層，並以 `GMAIL_USER` 和 `GMAIL_APP_PASSWORD` 環境變數驗證。

#### Scenario: Gmail 設定完整時建立傳輸器
- **WHEN** `GMAIL_USER` 和 `GMAIL_APP_PASSWORD` 均已設定
- **THEN** emailService 建立 Gmail SMTP transporter

#### Scenario: Gmail 設定不完整時降級
- **WHEN** `GMAIL_USER` 或 `GMAIL_APP_PASSWORD` 任一未設定
- **THEN** emailService 不建立 transporter，發送時改以 console.log 輸出郵件內容

### Requirement: 建立員工時發送歡迎 Email
系統 SHALL 在 Admin 成功建立員工帳號後，自動發送歡迎通知 Email 至員工 Email 地址。

#### Scenario: 成功建立員工並寄送通知
- **WHEN** Admin 呼叫 `POST /api/users` 且帳號建立成功
- **THEN** 系統以 fire-and-forget 方式呼叫 `sendWelcomeEmail`，Email 包含員工姓名、登入帳號、初始密碼及首次登入改密提醒

#### Scenario: Email 發送失敗不影響 API 回應
- **WHEN** Gmail SMTP 回傳錯誤
- **THEN** API 仍回傳 201 成功，錯誤記錄至 console.error
