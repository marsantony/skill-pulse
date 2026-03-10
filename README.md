# ⚡ Skill Pulse — 技能脈搏

AI 時代工程師的技能健康追蹤工具。

## 為什麼？

AI 讓你寫 code 更快，但你對系統的理解可能正在萎縮。Anthropic 研究顯示，AI 輔助組的技能測驗平均只拿 50%，手動組拿 67%，差距最大的領域是 debug 能力。

Skill Pulse 幫你定期量測技能健康狀態，追蹤 AI 依賴度，把「讓 AI 做了但不懂的事」轉化為學習清單。

## 功能

- **技能自評**：對各領域技能評估理解等級（聽過 → 能獨立做）與 AI 依賴度，產出雷達圖
- **週回顧**：引導式 Three Ls 回顧（Learned / Leaned on AI / Lacked），自動產生學習清單
- **Dashboard**：技能變化趨勢、AI 依賴度分佈、週回顧連續紀錄

## 技術棧

- 純前端：HTML + CSS + Vanilla JS
- 圖表：Chart.js
- 資料儲存：localStorage（零後端、零帳號）
- 測試：Vitest + jsdom
- 部署：GitHub Pages

## 開發

```bash
npm install
npm test
npm run dev    # 啟動本地伺服器
```

## 方法論

基於以下研究：

- [Anthropic: How AI assistance impacts coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)
- [Cognitive Debt](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) — 技術債存在於程式碼，認知債存在於開發者腦中
- [Addy Osmani: Avoiding Skill Atrophy](https://addyo.substack.com/p/avoiding-skill-atrophy-in-the-age)

核心理念：**先察覺，才能改善。**
