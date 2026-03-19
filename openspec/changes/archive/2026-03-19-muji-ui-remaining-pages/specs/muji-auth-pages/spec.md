## ADDED Requirements

### Requirement: LoginPage 登入頁設計

設計稿 SHALL 包含一個 1440×900 px 的登入頁面，無 Sidebar，採用 MUJI 奶油風設計語言，畫面以居中卡片呈現登入表單。

結構：
- 全頁背景色 `#FAF8F5`
- 居中登入卡片（寬 400px，背景 `#F2EDE5`，細線邊框）
- 系統名稱標題「出缺勤系統」
- 帳號（email）輸入欄
- 密碼輸入欄
- 登入按鈕（MUJI 綠填滿）
- 底部版權說明文字

#### Scenario: 登入卡片居中呈現

- **WHEN** 設計稿登入頁被開啟
- **THEN** 登入卡片 SHALL 垂直水平居中於頁面，寬度 400px，包含系統標題、帳號/密碼輸入、登入按鈕

#### Scenario: 無 Sidebar 佈局

- **WHEN** 設計稿登入頁與其他功能頁比較
- **THEN** 登入頁 SHALL 不含左側 Sidebar，為全頁居中佈局

---

### Requirement: ChangePasswordPage 改密碼頁設計

設計稿 SHALL 包含一個 1440×900 px 的改密碼頁面，無 Sidebar，居中表單卡片，含三個密碼輸入欄。

#### Scenario: 改密碼表單結構

- **WHEN** 設計稿改密碼頁被開啟
- **THEN** SHALL 顯示：頁面標題「修改密碼」、當前密碼輸入、新密碼輸入、確認新密碼輸入、確認修改按鈕

#### Scenario: 首次登入提示

- **WHEN** 設計稿改密碼頁頂部被檢視
- **THEN** SHALL 顯示提示訊息（amber 背景）：「首次登入，請先修改密碼」
