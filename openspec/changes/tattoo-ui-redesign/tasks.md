## 1. 全域設定

- [ ] 1.1 在 `frontend/index.html` 的 `<head>` 加入 Google Fonts（Cinzel + Cinzel Decorative）並設定 `<html>` 背景色為 `#0d0d0d`
- [ ] 1.2 確認 `frontend/src/main.ts` 無需修改（字體已透過 HTML link 引入）

## 2. Phase 1：Layout 框架

- [ ] 2.1 改寫 `frontend/src/components/AppLayout.vue`：設定極黑背景容器，確保子組件正確排版
- [ ] 2.2 改寫 `frontend/src/components/AppSidebar.vue`：極黑底 `#0d0d0d`、左側猩紅邊線、Logo 改為 `✦ ATTENDANCE ✦` Cinzel Decorative 金色、導覽項目套用 `tattoo-nav-link` / `tattoo-nav-active`
- [ ] 2.3 改寫 `frontend/src/components/AppHeader.vue`：深黑底 `#1a1a1a`、底部猩紅分隔線、標題 Cinzel Decorative 金色

## 3. Phase 2：認證頁面

- [ ] 3.1 改寫 `frontend/src/pages/LoginPage.vue`：全頁極黑背景、登入卡片用 `tattoo-card` + `TattooCorner` 四角裝飾、標題用 `TattooBanner`、輸入框 `tattoo-input`、按鈕 `tattoo-btn-primary`
- [ ] 3.2 改寫 `frontend/src/pages/ChangePasswordPage.vue`：同登入頁風格，卡片 `tattoo-card` + `TattooCorner`、輸入框 `tattoo-input`、按鈕 `tattoo-btn-primary`

## 4. Phase 3：儀表板

- [ ] 4.1 改寫 `frontend/src/pages/DashboardPage.vue`：統計卡片 `tattoo-card` + 頂部猩紅邊線、今日出勤大數字 Cinzel Decorative 猩紅、打卡按鈕 `tattoo-btn-primary`（上班）/ `tattoo-btn-danger`（下班）、假別餘額進度條猩紅填充金色邊框、快速操作 `tattoo-btn-secondary`

## 5. Phase 4：業務頁面

- [ ] 5.1 改寫 `frontend/src/pages/attendance/AttendancePage.vue`：頁面標題 `tattoo-heading` + `TattooDivider`、表格 `tattoo-table-header` / `tattoo-table-row`
- [ ] 5.2 改寫 `frontend/src/pages/leave/MyLeavePage.vue`：同上表格風格，申請按鈕 `tattoo-btn-primary`
- [ ] 5.3 改寫 `frontend/src/pages/leave/PendingLeavePage.vue`：審核操作按鈕 `tattoo-btn-primary`（核准）/ `tattoo-btn-danger`（拒絕）
- [ ] 5.4 改寫 `frontend/src/pages/leave/LeaveDetailPage.vue`：詳情卡片 `tattoo-card`、操作按鈕刺青風格
- [ ] 5.5 改寫 `frontend/src/pages/leave/LeaveRequestForm.vue`：表單輸入框 `tattoo-input`、送出按鈕 `tattoo-btn-primary`
- [ ] 5.6 改寫 `frontend/src/pages/overtime/MyOvertimePage.vue`：同請假頁表格風格
- [ ] 5.7 改寫 `frontend/src/pages/overtime/PendingOvertimePage.vue`：審核操作按鈕刺青風格
- [ ] 5.8 改寫 `frontend/src/pages/overtime/OvertimeRequestForm.vue`：表單輸入框 `tattoo-input`、送出按鈕 `tattoo-btn-primary`

## 6. Phase 5：管理後台

- [ ] 6.1 改寫 `frontend/src/pages/admin/UserManagementPage.vue`：搜尋列猩紅邊框 focus、表格 `tattoo-table-header` / `tattoo-table-row`、操作按鈕刺青風格
- [ ] 6.2 改寫 `frontend/src/pages/admin/UserFormModal.vue`：Modal 用 `tattoo-card`、輸入框 `tattoo-input`、按鈕 `tattoo-btn-primary`
- [ ] 6.3 改寫 `frontend/src/pages/admin/LeaveQuotaPage.vue`：表格風格、配額輸入框 `tattoo-input`
- [ ] 6.4 改寫 `frontend/src/pages/admin/WorkSchedulePage.vue`：表格風格、操作按鈕刺青風格

## 7. 共用組件

- [ ] 7.1 改寫 `frontend/src/components/StatusBadge.vue`：更新為 `tattoo-badge` class，不同狀態對應刺青色彩
- [ ] 7.2 改寫 `frontend/src/components/ConfirmModal.vue`：Modal 用 `tattoo-card`、確認按鈕 `tattoo-btn-primary`、取消按鈕 `tattoo-btn-secondary`
