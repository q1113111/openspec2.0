## Why

前端目前為標準藍白配色，缺乏品牌識別度。專案內已預先建置完整刺青主題系統（`tattoo-*` shortcuts、Cinzel 字體、五個裝飾組件），但尚未應用到任何頁面。本次改版目標是全站套用「狂野紅黑」美式刺青風格，提升系統視覺衝擊力與一致性。

## What Changes

- **全站配色**：從藍白主題改為猩紅（`#DC143C`）/ 極黑（`#0d0d0d`、`#1a1a1a`）/ 暗金（`#DAA520`）三色體系
- **字體系統**：標題採用 Cinzel Decorative，內文採用 Cinzel（Google Fonts）
- **Layout 框架**：AppLayout、AppSidebar、AppHeader 全面重設計
- **認證頁面**：LoginPage、ChangePasswordPage 套用刺青風格卡片
- **儀表板**：DashboardPage 統計卡片、打卡按鈕、假別進度條更新
- **業務頁面**：出缺勤、請假、加班相關頁面表格與表單更新
- **管理後台**：使用者管理、假別配額、工作班表頁面更新
- **共用組件**：StatusBadge、ConfirmModal 更新為刺青徽章樣式
- **啟用刺青裝飾組件**：TattooCorner、TattooRose、TattooBanner、TattooAnchor、TattooDivider 整合至各頁面

## Capabilities

### New Capabilities

- `tattoo-ui-theme`: 全站美式刺青風格主題，涵蓋 Layout 框架、認證頁面、儀表板、業務頁面、管理後台的視覺設計統一

### Modified Capabilities

（無既有 spec 需要修改，本次純前端外觀改版，不影響業務邏輯規格）

## Impact

- **影響範圍**：前端所有 `.vue` 頁面組件與共用組件
- **不影響**：後端 API、資料庫、業務邏輯、認證流程
- **依賴資源**：`frontend/uno.config.ts`（tattoo-* shortcuts 已定義）、`frontend/src/components/tattoo/`（裝飾組件已存在）、Google Fonts（Cinzel 字體）
- **Non-goals**：不修改後端程式碼、不改變任何業務功能、不修改資料模型

**影響角色**：admin、hr、employee（所有使用者皆看到新介面）
