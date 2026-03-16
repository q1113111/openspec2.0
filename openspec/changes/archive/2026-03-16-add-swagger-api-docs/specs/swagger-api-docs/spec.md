## ADDED Requirements

### Requirement: Swagger UI 端點可存取
後端 SHALL 在 `/api-docs` 提供 Swagger UI 介面，在 `ENABLE_SWAGGER=true` 時啟用，讓開發者可瀏覽所有 API 端點。

#### Scenario: 開啟 Swagger UI
- **WHEN** `ENABLE_SWAGGER=true` 且使用者瀏覽 `http://localhost:3000/api-docs`
- **THEN** 系統回傳 Swagger UI HTML 頁面，列出所有 API 端點

#### Scenario: 生產環境隱藏 Swagger UI
- **WHEN** `ENABLE_SWAGGER=false`（或未設定）且使用者請求 `/api-docs`
- **THEN** 系統回傳 404，不暴露 API 結構

---

### Requirement: OpenAPI JSON 規格可下載
後端 SHALL 在 `/api-docs.json` 提供完整 OpenAPI 3.0 規格 JSON，供工具整合使用。

#### Scenario: 下載規格 JSON
- **WHEN** `ENABLE_SWAGGER=true` 且 GET `/api-docs.json`
- **THEN** 回傳合法的 OpenAPI 3.0 JSON，包含所有端點、schemas 及 securitySchemes

---

### Requirement: 所有路由端點均有 OpenAPI 文件
後端所有路由模組（auth、users、attendance、leave、overtime、workSchedule）的每個端點 SHALL 有對應 JSDoc `@openapi` 標籤，涵蓋 HTTP 方法、路徑、summary、parameters、requestBody、responses。

#### Scenario: 端點文件完整
- **WHEN** 開發者查看 Swagger UI
- **THEN** 能看到全部 6 個路由模組的端點，每個端點均有 summary 及至少一個成功回應的 schema

---

### Requirement: 共用 Schema 定義於 components
User、Attendance、LeaveRequest、OvertimeRequest、WorkSchedule 等資料模型 SHALL 定義為 OpenAPI `components/schemas`，各端點 response/requestBody 透過 `$ref` 引用，避免重複。

#### Scenario: Schema 可重用
- **WHEN** 開發者在 Swagger UI 查看某端點的 response
- **THEN** Response schema 透過 `$ref` 指向 components 中的共用定義，而非行內重複定義

---

### Requirement: Cookie 認證標記於安全方案
OpenAPI spec SHALL 定義 `cookieAuth` security scheme（`type: apiKey, in: cookie, name: accessToken`），所有需認證的端點標注 `security: [{ cookieAuth: [] }]`。

#### Scenario: 需認證端點顯示鎖頭圖示
- **WHEN** 開發者在 Swagger UI 查看需認證的端點
- **THEN** 端點旁顯示鎖頭圖示，表示需要 Cookie 認證

#### Scenario: 公開端點（登入/刷新）不需認證標注
- **WHEN** 開發者查看 `POST /api/auth/login` 或 `POST /api/auth/refresh`
- **THEN** 端點無 `security` 標注，表示可匿名呼叫
