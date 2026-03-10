import { getAssessments, getReviews } from './storage.js';
import { formatDate, escapeHtml, getISOWeek, buildSkillNameMap } from './utils.js';

let trendChart = null;
let aidepChart = null;

export function initDashboard() {
  // Read data once, pass to all renderers
  const assessments = getAssessments();
  const reviews = getReviews();

  renderStats(assessments, reviews);
  renderTrend(assessments);
  renderAiDep(assessments);
  renderLearningQueue(reviews);
}

function renderStats(assessments, reviews) {
  document.getElementById('stat-assessments').textContent = assessments.length;
  document.getElementById('stat-reviews').textContent = reviews.length;
  document.getElementById('stat-streak').textContent = calcStreak(reviews);

  if (assessments.length) {
    const latest = assessments[assessments.length - 1];
    const entries = Object.values(latest.ratings);
    const avg = entries.length
      ? (entries.reduce((s, r) => s + r.level, 0) / entries.length).toFixed(1)
      : '-';
    document.getElementById('stat-avg-level').textContent = avg;
  }
}

function calcStreak(reviews) {
  if (!reviews.length) return 0;
  const weeks = [...new Set(reviews.map((r) => r.week))].sort().reverse();
  let streak = 0;
  let checkWeek = getISOWeek(new Date());

  for (const week of weeks) {
    if (week === checkWeek) {
      streak++;
      checkWeek = prevWeek(checkWeek);
    } else if (week === prevWeek(checkWeek)) {
      checkWeek = week;
      streak++;
      checkWeek = prevWeek(checkWeek);
    } else {
      break;
    }
  }
  return streak;
}

function renderTrend(assessments) {
  const canvas = document.getElementById('dashboard-trend');

  if (assessments.length < 1) {
    canvas.parentElement.style.display = 'none';
    return;
  }
  canvas.parentElement.style.display = 'block';

  const skillNameMap = buildSkillNameMap();
  const allSkillIds = [...new Set(assessments.flatMap((a) => Object.keys(a.ratings)))];
  const labels = assessments.map((a) => formatDate(a.date, false));

  const colors = [
    '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4',
    '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#64748b',
    '#a855f7', '#eab308', '#3b82f6', '#10b981', '#e11d48',
  ];

  const datasets = allSkillIds.map((id, i) => ({
    label: skillNameMap[id] || id,
    data: assessments.map((a) => a.ratings[id]?.level ?? null),
    borderColor: colors[i % colors.length],
    backgroundColor: 'transparent',
    tension: 0.3,
    spanGaps: true,
  }));

  if (trendChart) trendChart.destroy();
  trendChart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0, max: 5, ticks: { stepSize: 1, color: '#9ca3af' },
          grid: { color: 'rgba(42,46,58,0.8)' },
        },
        x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(42,46,58,0.5)' } },
      },
      plugins: {
        legend: { labels: { color: '#e4e4e7', font: { size: 11 } } },
      },
    },
  });
}

function renderAiDep(assessments) {
  const canvas = document.getElementById('dashboard-aidep');

  if (!assessments.length) {
    canvas.parentElement.style.display = 'none';
    return;
  }
  canvas.parentElement.style.display = 'block';

  const latest = assessments[assessments.length - 1];
  const entries = Object.values(latest.ratings);
  const counts = { low: 0, medium: 0, high: 0 };
  entries.forEach((r) => { counts[r.aiDep] = (counts[r.aiDep] || 0) + 1; });

  if (aidepChart) aidepChart.destroy();
  aidepChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['低依賴', '中依賴', '高依賴'],
      datasets: [{
        data: [counts.low, counts.medium, counts.high],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#e4e4e7' } },
      },
    },
  });
}

function renderLearningQueue(reviews) {
  const list = document.getElementById('learning-list');
  const items = reviews.slice().reverse().filter((r) => r.leanedOnAI).slice(0, 10);

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">寫週回顧時填寫「Leaned on AI」欄位，這裡會自動產生學習清單</div>';
    return;
  }

  list.innerHTML = items
    .map(
      (r) => `
    <div class="history-item">
      <div class="history-item-header">
        <span class="history-item-date">${r.week}</span>
      </div>
      <p style="font-size:0.9rem;white-space:pre-wrap">${escapeHtml(r.leanedOnAI)}</p>
    </div>
  `
    )
    .join('');
}

function prevWeek(weekStr) {
  const [y, w] = weekStr.split('-W').map(Number);
  if (w > 1) return `${y}-W${String(w - 1).padStart(2, '0')}`;
  return `${y - 1}-W52`;
}
