## 1. 環境設定

- [ ] 1.1 在 `.env.example` 新增 `GMAIL_USER` 和 `GMAIL_APP_PASSWORD` 說明
- [ ] 1.2 在 `.env` 填入實際 Gmail 帳號和 App Password

## 2. 後端 — Gmail SMTP 設定

- [ ] 2.1 修改 `backend/src/services/emailService.ts`，將 SMTP 設定改為 Gmail（`smtp.gmail.com`, port 587, STARTTLS），讀取 `GMAIL_USER` 和 `GMAIL_APP_PASSWORD`
