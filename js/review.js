import { getReviews, saveReview, deleteReview } from './storage.js';
import { formatDate, escapeHtml } from './utils.js';
import { showToast } from './app.js';

export function initReview() {
  renderHistory();

  document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  // Event delegation for history actions
  document.getElementById('review-list').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-delete-review]');
    if (deleteBtn) {
      deleteReview(deleteBtn.dataset.deleteReview);
      renderHistory();
      showToast('已刪除');
    }
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
