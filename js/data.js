/**
 * Default skill categories and items for self-assessment.
 * Users can customize these; defaults serve as a starting point.
 */

export const SKILL_LEVELS = [
  { value: 1, label: '👂 聽過', description: '知道名詞但說不出細節' },
  { value: 2, label: '🎓 讀過', description: '讀過文件但沒自己做過' },
  { value: 3, label: '🖐️ 用過', description: '在專案中用過（含 AI 幫忙）' },
  { value: 4, label: '🙋 能解釋', description: '能向別人說明原理與取捨' },
  { value: 5, label: '🚀 能獨立做', description: '不用 AI 也能從零完成' },
];

export const AI_DEPENDENCY = [
  { value: 'low', label: '低', description: '大部分自己做，偶爾參考 AI' },
  { value: 'medium', label: '中', description: 'AI 輔助但我理解產出內容' },
  { value: 'high', label: '高', description: '主要靠 AI，自己做不太出來' },
];

export const DEFAULT_CATEGORIES = [
  {
    id: 'languages',
    name: '語言 & 框架',
    skills: [
      { id: 'javascript', name: 'JavaScript' },
      { id: 'python', name: 'Python' },
      { id: 'html-css', name: 'HTML / CSS' },
      { id: 'typescript', name: 'TypeScript' },
    ],
  },
  {
    id: 'testing',
    name: '測試',
    skills: [
      { id: 'unit-test', name: '單元測試' },
      { id: 'integration-test', name: '整合測試' },
      { id: 'test-design', name: '測試設計（該測什麼）' },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    skills: [
      { id: 'github-actions', name: 'GitHub Actions' },
      { id: 'cloud-deploy', name: '雲端部署' },
      { id: 'docker', name: 'Docker' },
    ],
  },
  {
    id: 'architecture',
    name: '系統設計 & 架構',
    skills: [
      { id: 'module-design', name: '模組切分 & 職責劃分' },
      { id: 'api-design', name: 'API 設計' },
      { id: 'data-modeling', name: '資料建模' },
    ],
  },
  {
    id: 'debugging',
    name: 'Debug & 問題診斷',
    skills: [
      { id: 'error-reading', name: '閱讀錯誤訊息' },
      { id: 'debugger-usage', name: '使用 Debugger' },
      { id: 'root-cause', name: '根因分析' },
    ],
  },
  {
    id: 'ai-collab',
    name: 'AI 協作',
    skills: [
      { id: 'prompt-quality', name: 'Prompt 設計品質' },
      { id: 'output-review', name: 'AI 輸出審查能力' },
      { id: 'knowing-when-not', name: '判斷何時不該用 AI' },
    ],
  },
];

export const STORAGE_KEYS = {
  CATEGORIES: 'sp_categories',
  ASSESSMENTS: 'sp_assessments',
  REVIEWS: 'sp_reviews',
};
