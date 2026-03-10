import { SKILL_LEVELS, AI_DEPENDENCY } from './data.js';
import { getCategories, getAssessments, saveAssessment, deleteAssessment } from './storage.js';
import { showToast } from './app.js';

let radarChart = null;

export function initAssessment() {
  renderForm();
  renderHistory();

  document.getElementById('assessment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });
}

function renderForm() {
  const container = document.getElementById('assessment-categories');
  const categories = getCategories();

  container.innerHTML = categories
    .map(
      (cat) => `
    <div class="category-group">
      <h3>${cat.name}</h3>
      ${cat.skills
        .map(
          (skill) => `
        <div class="skill-row">
          <span class="skill-name">${skill.name}</span>
          <select class="level-select" data-skill="${skill.id}">
            <option value="">— 選擇等級 —</option>
            ${SKILL_LEVELS.map((l) => `<option value="${l.value}">${l.label}</option>`).join('')}
          </select>
          <select class="aidep-select" data-skill="${skill.id}">
            ${AI_DEPENDENCY.map((d) => `<option value="${d.value}">AI 依賴：${d.label}</option>`).join('')}
          </select>
        </div>
      `
        )
        .join('')}
    </div>
  `
    )
    .join('');
}

function handleSubmit() {
  const levelSelects = document.querySelectorAll('.level-select');
  const aidepSelects = document.querySelectorAll('.aidep-select');
  const ratings = {};
  let hasAny = false;

  levelSelects.forEach((sel) => {
    const skillId = sel.dataset.skill;
    const level = parseInt(sel.value, 10);
    if (!level) return;
    hasAny = true;
    const aidepSel = [...aidepSelects].find((s) => s.dataset.skill === skillId);
    ratings[skillId] = {
      level,
      aiDep: aidepSel?.value || 'medium',
    };
  });

  if (!hasAny) {
    showToast('請至少評估一個技能', 'error');
    return;
  }

  saveAssessment({ ratings });
  showToast('自評已儲存！');

  // Reset form
  levelSelects.forEach((s) => (s.value = ''));

  renderHistory();
  renderRadar(ratings);
}

function renderRadar(ratings) {
  const container = document.getElementById('assessment-chart-container');
  container.style.display = 'block';
  const canvas = document.getElementById('assessment-radar');

  const labels = [];
  const values = [];
  const categories = getCategories();
  const skillNameMap = {};
  categories.forEach((cat) => cat.skills.forEach((s) => (skillNameMap[s.id] = s.name)));

  for (const [skillId, data] of Object.entries(ratings)) {
    labels.push(skillNameMap[skillId] || skillId);
    values.push(data.level);
  }

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: '技能等級',
          data: values,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 0.8)',
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
            color: '#9ca3af',
            backdropColor: 'transparent',
          },
          grid: { color: 'rgba(42, 46, 58, 0.8)' },
          angleLines: { color: 'rgba(42, 46, 58, 0.8)' },
          pointLabels: { color: '#e4e4e7', font: { size: 12 } },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function renderHistory() {
  const list = document.getElementById('assessment-list');
  const assessments = getAssessments().slice().reverse();
  const categories = getCategories();
  const skillNameMap = {};
  categories.forEach((cat) => cat.skills.forEach((s) => (skillNameMap[s.id] = s.name)));

  if (!assessments.length) {
    list.innerHTML = '<div class="empty-state">還沒有自評紀錄</div>';
    return;
  }

  list.innerHTML = assessments
    .map((a) => {
      const ratingEntries = Object.entries(a.ratings);
      const avgLevel = ratingEntries.length
        ? (ratingEntries.reduce((sum, [, r]) => sum + r.level, 0) / ratingEntries.length).toFixed(1)
        : '-';
      const highAiDep = ratingEntries.filter(([, r]) => r.aiDep === 'high').length;

      return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-item-date">${formatDate(a.date)}</span>
          <span>平均 ${avgLevel} / 5　|　高 AI 依賴：${highAiDep} 項
            <button class="btn btn-sm btn-danger" data-delete-assessment="${a.id}">刪除</button>
            <button class="btn btn-sm btn-secondary" data-view-assessment="${a.id}">查看雷達圖</button>
          </span>
        </div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem">
          ${ratingEntries.map(([id, r]) => `${skillNameMap[id] || id}: ${SKILL_LEVELS[r.level - 1]?.label || r.level}`).join('　')}
        </div>
      </div>
    `;
    })
    .join('');

  list.querySelectorAll('[data-delete-assessment]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteAssessment(btn.dataset.deleteAssessment);
      renderHistory();
      showToast('已刪除');
    });
  });

  list.querySelectorAll('[data-view-assessment]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const a = assessments.find((x) => x.id === btn.dataset.viewAssessment);
      if (a) renderRadar(a.ratings);
    });
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
