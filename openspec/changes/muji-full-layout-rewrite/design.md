## Context

現有前端以 `--tattoo-*` CSS 自訂屬性定義設計 token，搭配 UnoCSS shortcuts（`tattoo-card`、`tattoo-btn-primary` 等）。所有組件以 `Cinzel` 字體、深色底色為主。

`pencil-MUJI.pen` 已有完整 MUJI 設計稿，包含：
- 設計 token：`muji-bg #FAF8F5`、`muji-card #F2EDE5`、`muji-accent #6B8C7A`、`muji-text-primary #2C2926` 等 10 個變數
- 所有頁面設計：Auth、Dashboard、Leave、Overtime、Admin
- 字體：`Inter`（替換 Cinzel）
- Sidebar：240px，奶油背景，lucide 圖示 + sage green active 狀態

## Goals / Non-Goals

**Goals:**
- 點擊 Header 切換按鈕，整個 Layout（顏色、字體、組件風格）一次切換
- `[data-theme="muji"]` 套在 `<html>` 上，覆蓋所有 `--tattoo-*` CSS 變數至 MUJI 色值
- 同時覆蓋字體，`Inter` 取代 `Cinzel`
- 主題狀態以 `localStorage` 持久化，重整後維持

**Non-Goals:**
- 不修改後端
- 不做響應式行動版
- 不重寫每個頁面的 HTML 結構（結構不變，只換樣式）

## Decisions

### 決策 1：CSS 變數覆蓋策略（不重寫組件 HTML）

**選擇**：以 `[data-theme="muji"]` 選擇器重新定義所有 `--tattoo-*` 變數，讓現有組件自動響應。

```css
/* muji.css */
[data-theme="muji"] {
  --tattoo-black: #FAF8F5;   /* bg */
  --tattoo-dark:  #F2EDE5;   /* card bg */
  --tattoo-card:  #EDEAE4;   /* deeper card */
  --tattoo-red:   #C0614A;   /* danger/accent */
  --tattoo-gold:  #6B8C7A;   /* primary accent */
  --tattoo-cream: #2C2926;   /* text primary */
  --tattoo-warm:  #6B6560;   /* text secondary */
  --tattoo-brown: #9C9590;   /* text muted */
  --tattoo-border: #DDD8CF;  /* border */
}
[data-theme="muji"] body {
  font-family: 'Inter', sans-serif;
}
```

**優點**：不需修改每個 .vue 檔，單一 CSS 檔即可覆蓋全站。
**缺點**：AppHeader 有 inline style 硬編碼顏色，需改為 CSS 變數。

### 決策 2：Pinia Store + localStorage 持久化

```typescript
// stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'tattoo' | 'muji'>(
    (localStorage.getItem('theme') as 'tattoo' | 'muji') || 'tattoo'
  )
  function toggle() {
    theme.value = theme.value === 'tattoo' ? 'muji' : 'tattoo'
    localStorage.setItem('theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }
  function init() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }
  return { theme, toggle, init }
})
```

### 決策 3：Inter 字體需在 index.html 引入

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

MUJI 主題需在 `[data-theme="muji"]` 下覆蓋 `font-family`，包含 `body` 與 `*` 選擇器。

### 決策 4：AppHeader inline style 改為 CSS 變數

原本 `style="background-color: #1a1a1a; border-bottom: 2px solid #DC143C;"` 需改為：
```css
.app-header {
  background-color: var(--tattoo-black);
  border-bottom: 2px solid var(--tattoo-red);
}
```

### 決策 5：ThemeToggle 按鈕放在 AppHeader 右側

按鈕顯示當前主題的對立標籤（MUJI 模式時顯示 TATTOO，刺青模式時顯示 MUJI），同時用小圖示區分。

## Risks / Trade-offs

- **UnoCSS 靜態 class 問題** → UnoCSS shortcuts 使用硬編碼色值（如 `bg-tattoo-black: #1a1a1a`），切換主題時這些靜態 class 不會響應 CSS 變數。解法：優先使用 `style="background-color: var(--tattoo-black)"` 而非 UnoCSS 顏色 class，或將 UnoCSS 顏色 class 改為語義 CSS 變數版本。
- **字體閃爍** → Inter 字體需 Google Fonts 網路載入，離線環境 fallback 為系統 sans-serif（可接受）。
- **AppSidebar 深色文字** → Tattoo 主題的側欄導航文字使用 `text-tattoo-gold`，MUJI 主題需覆蓋為 `muji-text-secondary`，已在 CSS 變數映射中處理。

## Migration Plan

1. 建立 `muji.css`（CSS 變數覆蓋）
2. 在 `index.html` 加入 Inter 字體
3. 建立 `stores/theme.ts`（Pinia）
4. 修正 `AppHeader.vue`（inline style → CSS 變數 + ThemeToggle 按鈕）
5. 修正 `AppSidebar.vue`（inline style → CSS 變數）
6. 建立 `ThemeToggle.vue` 元件
7. 在 `main.ts` 初始化 `themeStore.init()`
8. 驗證：每個頁面切換後視覺正確，重整後主題持久
