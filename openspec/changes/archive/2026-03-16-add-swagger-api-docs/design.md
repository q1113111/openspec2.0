## Context

後端目前有 6 個路由模組（auth、users、attendance、leave、overtime、workSchedule），均掛載於 `backend/src/index.ts`。認證採 JWT httpOnly Cookie，沒有任何 API 文件，開發者需直接閱讀原始碼。

## Goals / Non-Goals

**Goals:**
- 在後端整合 Swagger UI（`/api-docs`）與 OpenAPI JSON（`/api-docs.json`）
- 以 JSDoc `@openapi` 或 `@swagger` 標籤描述所有路由端點
- 定義可重用的 components/schemas（User、Attendance、LeaveRequest 等）與 securitySchemes（Cookie Auth）
- 透過環境變數控制是否開放 Swagger UI（`ENABLE_SWAGGER=true`）

**Non-Goals:**
- 不做前端頁面變更
- 不自動生成 client SDK
- 不引入 OpenAPI 規格驗證 middleware
- 不修改任何現有 API 行為

## Decisions

### D1：使用 swagger-jsdoc + swagger-ui-express

**選擇**：`swagger-jsdoc` 解析 JSDoc 註解生成 OpenAPI spec；`swagger-ui-express` 提供 UI。

**替代方案**：
- 手寫獨立 `openapi.yaml` — 與程式碼脫節，維護成本高
- `tsoa` — 從 TypeScript 裝飾器自動生成，重構量大，侵入性強

**理由**：JSDoc 方式對現有程式碼侵入性最低，每個路由就近維護文件，不需額外生成步驟。

---

### D2：Swagger 設定集中於 `backend/src/config/swagger.ts`

集中管理 `swaggerJsdoc` options（`info`、`servers`、`components`），掃描 `routes/*.ts` 的 JSDoc 標籤。index.ts 只做 `app.use('/api-docs', ...)` 掛載。

---

### D3：Security Scheme — Cookie Bearer

OpenAPI 定義 `cookieAuth`（`type: apiKey, in: cookie, name: accessToken`）。各需認證端點標注 `security: [{ cookieAuth: [] }]`。Swagger UI 無法直接帶 httpOnly Cookie 測試，但透過 `Try it out` 在有效 session 下可正常運作（瀏覽器自動送 Cookie）。

---

### D4：Swagger UI 僅在 `ENABLE_SWAGGER=true` 時啟用

避免在生產環境暴露 API 結構，降低資訊洩漏風險。`.env.example` 加入 `ENABLE_SWAGGER=false`；開發環境預設開啟。

## Risks / Trade-offs

| 風險 | 說明 | 緩解措施 |
|------|------|----------|
| JSDoc 與實際實作不同步 | 開發者修改路由時忘記更新 JSDoc | 在 PR checklist 提示；未來可考慮 `express-openapi-validator` |
| Swagger UI 在生產環境暴露 | 洩漏 API 結構 | `ENABLE_SWAGGER` 環境變數控制，預設 `false` |
| Cookie 認證在 Swagger UI 測試限制 | httpOnly Cookie 無法透過 Swagger UI 手動設定 | 文件中說明需先透過瀏覽器登入取得有效 session |
