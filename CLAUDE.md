# 環境部影片需求問卷

## 專案概述
線上問卷，讓環境部副總透過手機填寫影片製作需求。語音友善的對話式一問一答介面。

## 線上網址
- **GitHub Pages**: vincentlololo.github.io/env-video-questionnaire/
- **Repo**: VincentLoLoLo/env-video-questionnaire（Public, main branch）

## 技術架構
- 單一 `index.html`，無建置步驟
- React 18 + ReactDOM 18 + Babel Standalone 7.23.9（瀏覽器端 JSX 轉譯）
- Inline CSS styles + CSS animations（無 Tailwind）
- Inter (Google Fonts) + PingFang TC 字體
- Canvas animated gradient background（5 浮動色球）
- macOS 風格毛玻璃效果（backdrop-filter blur + dark theme）

## 部署流程
```bash
git add index.html
git commit -m "描述"
git push origin main
# GitHub Pages 自動部署，約 1-2 分鐘
# 手動觸發：gh api -X POST repos/VincentLoLoLo/env-video-questionnaire/pages/builds
```

## Git 認證
- 使用 `gh` CLI 認證為 VincentLoLoLo
- `gh auth setup-git` 設定 HTTPS credential

## 檔案結構
```
/
├── index.html              ← 問卷主體（唯一需要維護的檔案）
├── google-apps-script.js   ← Google Sheets 串接用的 Apps Script 程式碼
├── README.md
└── CLAUDE.md
```

## index.html 結構
- **31 題，5 段落**：
  - A 整體背景（6 題，藍色 #3B82F6）— 場合、觀眾、時程、預算、參考、禁忌
  - B 開場影片（8 題，琥珀色 #F59E0B）— 歡樂氛圍、部長入鏡、舞伴
  - C 1999 整合（9 題，翠綠色 #10B981）— 服務整合、一鏡到底、多管道
  - D 影片規格（7 題，玫紅色 #EC4899）— 畫面類型、音樂、色調、字卡、節奏、格式
  - E 補充（1 題，紫色 #A855F7）— 自由補充
- **兩種題型**：`confirm`（已知待確認）、`open`（開放式）
- **元件**：App → Splash / Welcome / Question / Overview 四畫面
- **側邊欄**：桌面版固定 260px，手機版漢堡選單抽屜
- **時間軸**：頂部五段式彩色進度條
- **響應式**：768px 斷點（isWide state）
- **動畫**：Canvas 浮動色球背景、毛玻璃面板、滑動切換、紙屑慶祝

## Google Sheets 串接
- Apps Script URL: `https://script.google.com/macros/s/AKfycbzQU97_ZCoBzm6yAZymP-rECJTxZ4BfaGpj07IyqSv7ZW-GAErikF3wKBXwpo2deRsn/exec`
- 提交方式：hidden iframe form submission（繞過 CORS）
- Apps Script 需讀取 `e.parameter.data`（表單提交格式）
- **用戶需自行在 Apps Script 編輯器部署新版本**

## 已知問題與教訓
1. iOS Safari 的 textarea fontSize 必須 ≥ 16px，否則會觸發自動放大
2. `env(safe-area-inset-bottom)` 用於 iPhone 底部安全區域
3. localStorage key: `env_video_answers`
4. Babel Standalone 首次載入約 0.5 秒白屏是正常的
5. Google Apps Script POST 有 CORS 限制，用 hidden iframe + form 提交繞過
6. 防重複送出：submittingRef（useRef）作即時鎖 + disabled 屬性

## 角色定義
- 副總 = 甲方（填寫者）
- 我（開發者）= 乙方，無團隊
- 問卷語氣：乙方個人向甲方釐清需求的敘述
