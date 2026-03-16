## Why

後端 API 目前缺乏自動化文件，開發者必須手動查閱程式碼才能了解端點行為、請求格式及回應結構，導致前後端協作效率低落。新增 Swagger / OpenAPI 文件讓所有 API 端點可透過互動式 UI 瀏覽與測試，降低溝通成本。

## What Changes

- 安裝 `swagger-jsdoc` 與 `swagger-ui-express` 套件
- 在後端所有路由（auth、user、attendance、leave、overtime、work-schedule）加入 JSDoc 風格 OpenAPI 註解
- 掛載 Swagger UI 至 `/api-docs` 端點（僅限非正式環境，或依設定開放）
- 定義共用 schema（User、Attendance、LeaveRequest、OvertimeRequest 等）於統一設定檔

**Non-goals**：
- 不產生前端 SDK / client code generation
- 不加入 API 版本控制（versioning）
- 不修改任何現有 API 行為或回應格式

## Capabilities

### New Capabilities
- `swagger-api-docs`: 後端 Swagger UI 及 OpenAPI JSON/YAML 規格，涵蓋所有現有 API 端點的文件與互動式測試介面

### Modified Capabilities
<!-- 無現有 spec 需要修改 -->

## Impact

- **受影響角色**：admin、hr、employee（所有角色可查閱文件；依設定可限制存取）
- **受影響程式碼**：`backend/src/routes/*.ts`、`backend/src/index.ts`
- **新增依賴**：`swagger-jsdoc`、`swagger-ui-express`、對應 `@types` 套件
- **無資料庫 schema 變更**
