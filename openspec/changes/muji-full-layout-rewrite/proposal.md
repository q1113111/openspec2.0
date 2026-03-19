## Why

現有前端固定使用「美式刺青風格」深色主題（黑底紅金、Cinzel 字體）。`pencil-MUJI.pen` 已完成完整的 MUJI 奶油風設計稿（涵蓋所有頁面）。目標是讓使用者能一鍵切換完整主題 Layout，在「刺青風（Tattoo）」與「MUJI 奶油風」之間全面切換——不只是顏色，而是整個視覺語言（字體、間距、組件風格）都跟著變。

## What Changes

- 新增 AppHeader 主題切換按鈕（Tattoo ⇄ MUJI），點擊即切換全站 Layout
- 新增 `frontend/src/style/muji.css`：以 `[data-theme="muji"]` 選擇器覆蓋所有 CSS 設計 token
- 新增 `frontend/src/stores/theme.ts`：Pinia store 管理主題狀態，localStorage 持久化
- **MUJI 主題完整覆蓋範圍**（切換後整個 Layout 全換）：
  - 全局背景色、字體色改為奶油色系
  - 字體從 `Cinzel` 改為 `Inter`
  - Sidebar 背景、Nav 樣式、active 狀態色改為 MUJI 設計
  - Header 背景、邊框改為淺色系
  - 所有卡片、按鈕、輸入框、表格全部換 MUJI 風格
  - 登入頁居中白卡風格
- 刺青風（tattoo）維持不變，為預設主題
- 後端不受影響

## Capabilities

### New Capabilities
- `muji-design-system`: MUJI 奶油風完整設計系統，以 `[data-theme="muji"]` 選擇器覆蓋所有 token，讓整個 Layout 完整切換

### Modified Capabilities
（無功能需求變更）

## Impact

- 影響所有前端視覺組件（`AppLayout`、`AppSidebar`、`AppHeader`、所有 pages/components）
- 影響全局樣式（`style/`、`uno.config.ts`、`index.html` 字體引入）
- 影響角色：所有使用者（admin / hr / employee）
- Non-goals：不做響應式行動版適配、不修改後端 API、不修改業務邏輯
