## 1. 基礎設施：字體與 CSS Token

- [x] 1.1 在 `frontend/index.html` 加入 Inter 字體 Google Fonts link（weight 400/500/600）
- [x] 1.2 建立 `frontend/src/style/muji.css`：以 `[data-theme="muji"]` 覆蓋所有 `--tattoo-*` CSS 變數（9 個顏色 token）
- [x] 1.3 在 `[data-theme="muji"]` 下覆蓋 `body, *` 的 `font-family` 為 `Inter, sans-serif`
- [x] 1.4 在 `[data-theme="muji"]` 下覆蓋 scrollbar、selection、autofill 樣式
- [x] 1.5 在 `frontend/src/main.ts` 引入 `./style/muji.css`

## 2. Theme Store

- [x] 2.1 建立 `frontend/src/stores/theme.ts`（Pinia store）：`theme ref`、`toggle()`、`init()`
- [x] 2.2 `init()` 從 localStorage 讀取主題並設定 `document.documentElement.setAttribute('data-theme', ...)`
- [x] 2.3 在 `frontend/src/main.ts` 於 mount 前呼叫 `themeStore.init()`

## 3. ThemeToggle 元件

- [x] 3.1 建立 `frontend/src/components/ThemeToggle.vue`：參照 Pencil MUJI 設計，顯示當前非使用中主題名稱（MUJI / TATTOO），點擊呼叫 `themeStore.toggle()`
- [x] 3.2 ThemeToggle 按鈕樣式使用 CSS 變數（`var(--tattoo-gold)` 邊框、`var(--tattoo-black)` 背景），確保兩個主題下均可見

## 4. AppHeader 修正

- [x] 4.1 移除 `AppHeader.vue` 的 inline style 硬編碼色值（`#1a1a1a`、`#DC143C`）
- [x] 4.2 改為 `<style scoped>` 中使用 `var(--tattoo-black)` 和 `var(--tattoo-red)`
- [x] 4.3 在右側工具列插入 `<ThemeToggle />` 元件（位於使用者名稱左側）

## 5. AppSidebar 修正

- [x] 5.1 移除 `AppSidebar.vue` 的 inline style 硬編碼色值（`#0d0d0d`、`#3a3530`、`#DC143C`）
- [x] 5.2 改為 `<style scoped>` 使用 CSS 變數：`var(--tattoo-black)` 背景、`var(--tattoo-border)` 邊框
- [x] 5.3 移除 `border-left: 3px solid #DC143C`（刺青特有裝飾），改由 MUJI 主題下不顯示此邊框（CSS 條件覆蓋）
- [x] 5.4 Logo 區：MUJI 主題下以 `[data-theme="muji"] .sidebar-logo` 隱藏刺青文字「✦ ATTENDANCE ✦」，改顯示「出缺勤系統」Inter 字體版本（CSS display 切換）
- [x] 5.5 Nav active 樣式：移除 `tattoo-nav-active`/`tattoo-nav-link` UnoCSS class 的硬編碼色值依賴，確保 CSS 變數覆蓋後 active 底色正確顯示為 sage green（`var(--tattoo-gold)`）
- [x] 5.6 移除底部 `TattooDivider` 裝飾（MUJI 主題無此裝飾），以 CSS `[data-theme="muji"] .tattoo-divider-line { display: none }` 隱藏

## 6. 各頁面 inline style 掃描修正

- [x] 6.1 掃描所有 `.vue` 檔中的 inline style 硬編碼顏色，替換為對應的 CSS 變數（優先修 AppLayout、LoginPage）
- [x] 6.2 確認 `LoginPage.vue` 背景與卡片使用 CSS 變數
- [x] 6.3 確認 `ChangePasswordPage.vue` 背景與卡片使用 CSS 變數
- [x] 6.4 確認 `DashboardPage.vue` 卡片色使用 CSS 變數

## 7. UnoCSS shortcuts 修正

- [x] 7.1 修改 `uno.config.ts` 中 `tattoo-*` 顏色定義為 CSS 變數引用（`var(--tattoo-*)`），讓所有 shortcuts 自動響應主題切換
- [x] 7.2 在 `muji.css` 覆蓋 tattoo.css 中剩餘的硬編碼 rgba glow/hover 效果

## 8. 驗證

- [x] 8.1 `docker compose up -d`，開啟 http://localhost:5173
- [x] 8.2 確認預設為刺青風（黑底紅金、Cinzel 字體）
- [x] 8.3 點擊切換按鈕 → 整個 Layout 切換為 MUJI 奶油風（Inter 字體、淺色背景、sage green accent）
- [x] 8.4 再點一次 → 切回刺青風
- [x] 8.5 切換後重整頁面 → 主題持久保存
- [x] 8.6 確認所有頁面（Dashboard、請假、加班、管理、登入）在兩個主題下均正常顯示
