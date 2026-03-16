## Why

建立員工帳號後，員工無法得知自己的帳號資訊，需要 Admin 手動通知，流程繁瑣且容易遺漏。透過 Gmail SMTP 自動發送通知 Email，讓員工在帳號建立當下即收到登入憑證，提升入職體驗與操作效率。

## What Changes

- 建立員工帳號時，後端自動透過 Gmail SMTP 發送通知 Email 給員工
- 通知信件內容包含：員工姓名、登入帳號（email）、預設密碼、系統登入網址、首次登入須改密碼提醒
- `.env` 新增 Gmail SMTP 設定（`GMAIL_USER`、`GMAIL_APP_PASSWORD`）
- 後端 `emailService.ts` 新增 `sendEmployeeWelcomeEmail` 方法

## Capabilities

### New Capabilities
- `employee-welcome-email`: 建立員工帳號時透過 Gmail SMTP 自動發送歡迎通知信

### Modified Capabilities
- `employee-management`: 建立員工 API（`POST /api/users`）觸發後新增寄信邏輯

## Impact

- **後端**：`backend/src/services/emailService.ts`、`backend/src/routes/users.ts`
- **設定**：`.env`、`.env.example` 新增 Gmail SMTP 環境變數
- **依賴**：使用現有 `nodemailer`（若未安裝需新增）
