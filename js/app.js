import { exportAll, importAll, clearAll } from './storage.js';
import { initAssessment } from './assessment.js';
import { initReview } from './review.js';
import { initDashboard } from './dashboard.js';

// --- Routing ---
const pages = ['landing', 'assessment', 'review', 'dashboard', 'settings'];

function navigateTo(page) {
  pages.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    const link = document.querySelector(`[data-page="${p}"]`);
    if (p === page) {
      el?.classList.add('active');
      link?.classList.add('active');
    } else {
      el?.classList.remove('active');
      link?.classList.remove('active');
    }
  });

  // Initialize page-specific logic
  if (page === 'assessment') initAssessment();
  if (page === 'review') initReview();
  if (page === 'dashboard') initDashboard();

  window.location.hash = page === 'landing' ? '' : page;
}

// --- Toast ---
export function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --- Settings ---
function initSettings() {
  document.getElementById('btn-export').addEventListener('click', () => {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-pulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已匯出備份');
  });

  const fileInput = document.getElementById('import-file');
  document.getElementById('btn-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importAll(data);
        showToast('已匯入備份');
        navigateTo('dashboard');
      } catch (err) {
        showToast(`匯入失敗：${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('確定要清除所有資料嗎？此操作無法復原。')) {
      clearAll();
      showToast('已清除所有資料');
      navigateTo('landing');
    }
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  // Nav clicks
  document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // CTA buttons
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.goto));
  });

  initSettings();

  // Handle hash routing
  const hash = window.location.hash.slice(1);
  if (pages.includes(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('landing');
  }
});
