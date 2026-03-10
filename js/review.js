import { getReviews, saveReview, deleteReview } from './storage.js';
import { showToast } from './app.js';

export function initReview() {
  renderHistory();

  document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });
}

function handleSubmit() {
  const learned = document.getElementById('review-learned').value.trim();
  const leanedOnAI = document.getElementById('review-leaned').value.trim();
  const lacked = document.getElementById('review-lacked').value.trim();
  const nextWeek = document.getElementById('review-next').value.trim();

  if (!learned && !leanedOnAI && !lacked && !nextWeek) {
    showToast('請至少填寫一個欄位', 'error');
    return;
  }

  saveReview({ learned, leanedOnAI, lacked, nextWeek });
  showToast('週回顧已儲存！');

  // Reset form
  document.getElementById('review-form').reset();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('review-list');
  const reviews = getReviews().slice().reverse();

  if (!reviews.length) {
    list.innerHTML = '<div class="empty-state">還沒有週回顧紀錄</div>';
    return;
  }

  list.innerHTML = reviews
    .map(
      (r) => `
    <div class="history-item">
      <div class="history-item-header">
        <span class="history-item-date">${r.week}　(${formatDate(r.date)})</span>
        <button class="btn btn-sm btn-danger" data-delete-review="${r.id}">刪除</button>
      </div>
      ${field('📗 Learned', r.learned)}
      ${field('🤖 Leaned on AI', r.leanedOnAI)}
      ${field('🚧 Lacked', r.lacked)}
      ${field('🎯 Next Week', r.nextWeek)}
    </div>
  `
    )
    .join('');

  list.querySelectorAll('[data-delete-review]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteReview(btn.dataset.deleteReview);
      renderHistory();
      showToast('已刪除');
    });
  });
}

function field(label, value) {
  if (!value) return '';
  return `
    <div class="history-item-field">
      <strong>${label}</strong>
      <p>${escapeHtml(value)}</p>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
