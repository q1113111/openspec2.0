## ADDED Requirements

### Requirement: 主題切換按鈕
系統 SHALL 在 AppHeader 右側提供切換按鈕，讓所有使用者可以在「刺青風（tattoo）」與「MUJI 奶油風（muji）」之間一鍵切換完整視覺主題。

#### Scenario: 預設主題為刺青風
- **WHEN** 使用者首次開啟系統（無 localStorage 紀錄）
- **THEN** 系統以刺青風（黑底紅金）顯示

#### Scenario: 切換至 MUJI 主題
- **WHEN** 使用者點擊 Header 切換按鈕
- **THEN** 整個 Layout（背景、字體、Sidebar、Header、卡片、按鈕、輸入框）立即切換為 MUJI 奶油風

#### Scenario: 切換回刺青風
- **WHEN** 使用者在 MUJI 主題下再次點擊切換按鈕
- **THEN** 整個 Layout 切換回刺青風

#### Scenario: 主題持久化
- **WHEN** 使用者切換主題後重新整理頁面
- **THEN** 系統維持上次選擇的主題，不重置為預設值

---

### Requirement: MUJI 設計 Token
系統 SHALL 定義 MUJI 主題的完整 CSS 設計 token，覆蓋所有 `--tattoo-*` 變數。

#### Scenario: 顏色 token 覆蓋
- **WHEN** `[data-theme="muji"]` 套用在 `<html>` 上
- **THEN** 所有 `--tattoo-*` CSS 變數改為 MUJI 色值：
  - `--tattoo-black`: `#FAF8F5`（奶油白背景）
  - `--tattoo-dark`: `#F2EDE5`（卡片背景）
  - `--tattoo-card`: `#EDEAE4`（深卡片）
  - `--tattoo-red`: `#C0614A`（danger/強調）
  - `--tattoo-gold`: `#6B8C7A`（主要 accent，sage green）
  - `--tattoo-cream`: `#2C2926`（主要文字）
  - `--tattoo-warm`: `#6B6560`（次要文字）
  - `--tattoo-brown`: `#9C9590`（muted 文字）
  - `--tattoo-border`: `#DDD8CF`（邊框）

#### Scenario: 字體切換
- **WHEN** MUJI 主題啟用
- **THEN** 全站字體從 `Cinzel` 改為 `Inter`（400/500/600 weight）

---

### Requirement: MUJI Sidebar 樣式
系統 SHALL 在 MUJI 主題下，Sidebar 呈現以下視覺：奶油色背景（`muji-card #F2EDE5`）、sage green 高亮 active 項目、Inter 字體、lucide 圖示。

#### Scenario: Sidebar 切換色彩
- **WHEN** MUJI 主題啟用
- **THEN** Sidebar 背景為 `#F2EDE5`、邊框為 `#DDD8CF`，active nav item 背景為 `#6B8C7A`（白色文字）

#### Scenario: Sidebar inactive 項目
- **WHEN** MUJI 主題啟用，nav item 非 active 狀態
- **THEN** 圖示與文字顏色為 `#6B6560`（次要文字），hover 時有淡色底色

---

### Requirement: AppHeader 主題感知
系統 SHALL 在 MUJI 主題下，AppHeader 呈現淺色背景（`#FAF8F5`）、`#DDD8CF` 下邊框，完全無刺青風深色元素。

#### Scenario: Header 背景切換
- **WHEN** MUJI 主題啟用
- **THEN** AppHeader 背景為 `#FAF8F5`，下邊框為 1px `#DDD8CF`

#### Scenario: Header 文字切換
- **WHEN** MUJI 主題啟用
- **THEN** 頁面標題、使用者名稱、角色 badge 均使用 MUJI 文字色系（深棕色）
