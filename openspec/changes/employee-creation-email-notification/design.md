## Context

`emailService.ts` 已有 `sendWelcomeEmail`，`users.ts` 建立員工時已呼叫（fire-and-forget）。現行 SMTP 設定使用通用環境變數（`SMTP_HOST`、`SMTP_PORT` 等），未針對 Gmail 設定，導致未設定時靜默跳過。

目標：將 Email 傳輸層改用 Gmail SMTP（`smtp.gmail.com:587 + STARTTLS`），並以 Gmail App Password 驗證。

## Goals / Non-Goals

**Goals:**
- 使用 Gmail SMTP（`smtp.gmail.com`, port 587）作為 transporter
- 以 `GMAIL_USER` 和 `GMAIL_APP_PASSWORD` 環境變數驗證
- 設定不完整時降級為 console.log（維持現有 fallback 行為）
- 更新 `.env.example` 說明如何申請 Gmail App Password

**Non-Goals:**
- 不修改 Email 模板內容
- 不新增前端 UI
- 不支援多 Email 供應商切換

## Decisions

### 使用 Gmail App Password 而非 OAuth2

Gmail 在 2022 年起要求 2FA 帳號使用 App Password，無法直接以 Google 帳號密碼登入 SMTP。App Password 是 16 位一次性密碼，由 Google 帳號安全性頁面產生。

選擇 App Password over OAuth2 的原因：設定簡單，適合內部系統；OAuth2 需要建立 GCP 專案與 OAuth consent screen，overhead 過高。

### 保留 console.log fallback

當 `GMAIL_USER` 或 `GMAIL_APP_PASSWORD` 未設定時，系統不應 crash，維持現有的靜默降級行為，方便本地開發。

## Risks / Trade-offs

- **Gmail 每日發信上限 500 封**：適合內部員工系統，不構成問題。
- **App Password 洩漏風險**：需確保 `.env` 不進入版本控制（`.gitignore` 已涵蓋）。
