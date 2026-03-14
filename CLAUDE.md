# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述
線上問卷，讓環境部副總（甲方）透過手機填寫影片製作需求。對話式一問一答介面，開發者（乙方，無團隊）向甲方釐清需求。

## 線上網址
- **GitHub Pages**: vincentlololo.github.io/env-video-brief/
- **Repo**: VincentLoLoLo/env-video-brief（Public, main branch）
- ~~舊 repo: env-video-questionnaire / env-video-form（被 Google Safe Browsing 標記，已棄用）~~

## 技術架構
- 單一 `index.html`，無建置步驟
- React 18 + ReactDOM 18 + Babel Standalone 7.23.9（瀏覽器端 JSX 轉譯）
- Inline CSS styles + CSS animations（無 Tailwind）
- Inter (Google Fonts) + PingFang TC 字體
- Canvas animated gradient background（5 浮動色球，背景 #0c0f1a）
- macOS 風格毛玻璃效果（backdrop-filter blur + dark theme）

## 部署流程
```bash
# 前端（GitHub Pages）
git add index.html
git commit -m "描述"
git push origin main
gh api -X POST repos/VincentLoLoLo/env-video-brief/pages/builds

# Apps Script（clasp CLI）
clasp push && clasp deploy -d "描述"
# 每次 deploy 產生新 URL，須同步更新 index.html 的 SHEET_SCRIPT_URL
# 首次部署需在瀏覽器授權一次（clasp open → 執行任意函式 → 允許權限）
```

## Git 認證
- 使用 `gh` CLI 認證為 VincentLoLoLo
- `gh auth setup-git` 設定 HTTPS credential

## 檔案結構
```
index.html              ← 問卷主體（唯一前端檔案）
google-apps-script.js   ← Apps Script 程式碼（clasp push 上傳）
appsscript.json         ← Apps Script 設定（webapp, timezone）
.clasp.json             ← clasp 設定（scriptId, rootDir, parentId）
.claspignore            ← 只上傳 google-apps-script.js + appsscript.json
```

## index.html 架構
- **31 題，5 段落**（SC 物件定義各段顏色）：
  - A 整體背景（6 題，#3B82F6）· B 開場影片（8 題，#F59E0B）· C 1999 整合（9 題，#10B981）· D 影片規格（7 題，#EC4899）· E 補充（1 題，#A855F7）
- **題型**：`confirm`（已知待確認，有 prefilled）、`open`（開放式）
- **複選標記**：`multi:true` 的題目允許多選（Q1,2,3,6,16,17,19,22）
- **四個畫面**：Splash → Welcome → Question → Overview（isComplete / showOverview）
- **答案資料模型**：`{selected: "選中的 prompt 文字", note: "補充文字"}`，多選用 `\n` 分隔 selected
- **UI 元件**：Sidebar（桌面固定 260px / 手機漢堡抽屜）、Timeline（頂部五段彩色進度條）
- **響應式**：768px 斷點（isWide state）

## Google Sheets 串接
- **Apps Script URL**: `https://script.google.com/macros/s/AKfycbxkXos321qpb9izn3zYfsi6K_QLYUY2MFMKbRn5W_1yaDoo3gACs6fy1xUfsqQOOmf8Dw/exec`
- **Script Project ID**: `1Md76z76CPuZctfSBfpgGmNMbSMD5fFSW134ELDZ6wvg9VJCq7-kVN3NL`
- **目標 Sheet**: `1NulQPHDvnSC1GD1DuxApOPbzPKtrrgZeY_1NeXew2lM`（用 `openById` 指定，非 getActiveSpreadsheet）
- **提交方式**: hidden iframe form submission（繞過 CORS），data 欄位為 JSON 字串
- **Apps Script 支援**: `e.parameter.data`（表單提交）和 `e.postData.contents`（JSON body）
- **HEADERS**: 31 欄完整題目文字，方便匯入 AI 分析
- **clasp 登入帳號**: therock78331@gmail.com

## 已知問題與教訓
1. iOS Safari textarea fontSize 必須 ≥ 16px，否則觸發自動放大
2. `env(safe-area-inset-bottom)` 用於 iPhone 底部安全區域
3. localStorage key: `env_video_answers`，舊版字串格式會自動清除
4. Babel Standalone 首次載入約 0.5 秒白屏是正常的
5. Google Apps Script POST 有 CORS 限制，用 hidden iframe + form 提交繞過
6. 防重複送出：submittingRef（useRef）作即時鎖 + disabled 屬性
7. React hooks 中 `const` 有 temporal dead zone — getAns/hasAns/ansText 必須定義在 useAutoResize 之前
8. `hasResume` 判斷用 `answeredCount > 0`，不可用 `Object.keys(answers).length`（空物件會誤判）
9. 手機版選擇 prompt 後不可 auto-focus textarea（會彈出鍵盤影響體驗）
10. clasp deploy 每次產生新 URL，舊 deployment URL 指向舊版程式碼不會自動更新
11. clasp 新建 project 首次部署必須在瀏覽器執行一次函式才能授權 web app
12. Overview / 完成頁面需 `window.scrollTo(0, 0)` — 與 Question 頁面的 contentRef.scrollTop 分開處理
