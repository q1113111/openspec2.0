## Context

前端目前使用標準藍白配色，所有業務頁面直接使用 Tailwind/UnoCSS 原生 utility classes（`bg-white`、`text-blue-600` 等）。`uno.config.ts` 已預定義 `tattoo-*` shortcuts 色彩體系，`frontend/src/components/tattoo/` 已有五個裝飾組件，但均未被任何業務頁面引用。本次改版純屬前端視覺層重設計，不涉及後端 API 或業務邏輯。

## Goals / Non-Goals

**Goals:**
- 全站統一套用猩紅 `#DC143C` / 極黑 `#0d0d0d`/`#1a1a1a` / 暗金 `#DAA520` 三色刺青主題
- 優先使用 `uno.config.ts` 中已定義的 `tattoo-*` shortcuts，避免重複定義色碼
- 整合 TattooCorner、TattooBanner、TattooDivider 等裝飾組件至關鍵頁面
- 所有頁面保留完整業務功能，外觀之外不做任何修改

**Non-Goals:**
- 不修改後端任何程式碼
- 不新增或移除任何業務功能
- 不修改 Pinia stores、Vue Router、API 呼叫邏輯
- 不修改 `uno.config.ts`（現有 shortcuts 已足夠）

## Decisions

### 決策 1：優先使用現有 tattoo-* shortcuts

**決策**：直接使用 `uno.config.ts` 中定義的 shortcuts（`tattoo-card`、`tattoo-btn-primary` 等），而非直接寫 hex 色碼或新建 CSS 變數。

**理由**：保持設計一致性，避免色值散落各處。若未來需調整主色，只需修改 `uno.config.ts` 一個地方。

**替代方案考慮**：直接寫 `bg-[#DC143C]` 等 arbitrary values — 拒絕，會導致維護困難。

### 決策 2：Phase 順序（Layout → Auth → Dashboard → Business → Admin）

**決策**：從最外層框架往內改，先完成 AppLayout/Sidebar/Header，再改各業務頁面。

**理由**：Layout 是所有頁面的容器，先改好後，業務頁面的背景色等全局設定就已就位，避免重複調整。

### 決策 3：font-face 透過 index.html 引入 Google Fonts

**決策**：在 `frontend/index.html` 的 `<head>` 加入 Google Fonts link（Cinzel + Cinzel Decorative），而非透過 CSS `@import` 或本地字體。

**理由**：最簡單直接，Vite 構建不需要特別處理，CDN 載入速度快。

### 決策 4：裝飾組件使用場景

| 組件 | 使用位置 |
|------|----------|
| `TattooCorner` | 登入卡片四角、重要 Modal |
| `TattooBanner` | 登入頁標題、Dashboard 大標題 |
| `TattooDivider` | 頁面標題下方分隔線 |
| `TattooRose` | Sidebar 底部裝飾（選用） |
| `TattooAnchor` | Dashboard 統計區域裝飾（選用） |

## Risks / Trade-offs

- **[風險] 改版後若有 UnoCSS class 未 tree-shake 到** → 使用 UnoCSS `safelist` 或確保每個 class 在 source 中靜態出現
- **[風險] Cinzel 字體在中文環境下無中文字形** → 標題用英文 + 中文補充說明，或僅英文系統名稱用 Cinzel，中文正文用系統字體
- **[Trade-off] 極黑背景可能影響可及性（accessibility）** → 使用 WCAG AA 標準確認文字對比度（金色 `#DAA520` 在黑底需驗證）
- **[風險] 改版頁面數量多（約 15 個 .vue 文件）** → 按 Phase 順序逐步改，每 Phase 驗證功能正常後再進行下一 Phase
