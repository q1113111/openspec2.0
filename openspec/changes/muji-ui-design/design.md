## Context

本次為純視覺設計稿任務，使用 Pencil MCP 工具在 `pencil-MUJI.pen` 中建立 MUJI 奶油風 UI 設計。設計稿作為前端 UI 重構的視覺參考，與現有的暗色刺青風（tattoo-ui-redesign）並列比較。

目前 `pencil-MUJI.pen` 已有一個空白 Frame `bi8Au`（1994×1496 px），需在其中建立三個 1440×900 的桌面頁面螢幕。

## Goals / Non-Goals

**Goals:**
- 在 `pencil-MUJI.pen` 建立 MUJI 色彩 design tokens（Pencil Variables）
- 設計三個完整頁面螢幕：Dashboard、請假表單、出勤記錄
- 每個螢幕包含左側 Sidebar（240px）+ 主內容區
- 視覺風格：奶油底色、大量留白、細線邊框、無圓角或微圓角（4px）、Noto 字體

**Non-Goals:**
- 不生成任何 Vue 原始碼
- 不修改後端 API 或資料庫
- 不設計行動版（Mobile）或平板版
- 不製作互動原型（Prototype）

## Decisions

### 決策 1：三螢幕水平排列

將三個 1440×900 螢幕在 `bi8Au` frame 內水平排列（間距 120px），方便一次瀏覽比對。

### 決策 2：先設定 Pencil Variables 再設計

使用 `pencil_set_variables` 先建立所有色彩 token，設計時透過 `$variable-name` 引用，確保色彩一致性。

### 決策 3：MUJI 色彩體系

| Token 名稱 | 色碼 | 用途 |
|---|---|---|
| `muji-bg` | `#FAF8F5` | 主背景 |
| `muji-card` | `#F2EDE5` | 卡片背景 |
| `muji-border` | `#DDD8CF` | 邊框/分隔線 |
| `muji-text-primary` | `#2C2926` | 主文字 |
| `muji-text-secondary` | `#6B6560` | 次文字 |
| `muji-text-muted` | `#9C9590` | 輔助文字 |
| `muji-accent` | `#6B8C7A` | 主要強調（MUJI 綠） |
| `muji-danger` | `#C0614A` | 危險/警示 |
| `muji-success` | `#7A9B6C` | 成功狀態 |
| `muji-pending` | `#C4A35A` | 待核准（暖金） |

### 決策 4：螢幕建立順序

1. Dashboard（最複雜，包含多種 UI 元素）
2. 請假申請表單（表單範例）
3. 出勤記錄（資料表格）

## Risks / Trade-offs

- **字體渲染限制** → Pencil 中 Noto Serif JP 可能不完全支援，改用系統內建 serif 字體替代；不影響設計概念
- **Frame 尺寸限制** → `bi8Au` 目前 1994×1496 px，三個 1440px 螢幕水平排列需要約 4440px 寬，需先擴展 bi8Au 尺寸
- **純設計稿無法驗證互動** → 使用截圖確認靜態視覺效果即可，互動行為在後續 Vue 實作階段驗證
