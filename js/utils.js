import { getCategories } from './storage.js';

export function formatDate(iso, includeYear = true) {
  const d = new Date(iso);
  const opts = includeYear
    ? { year: 'numeric', month: '2-digit', day: '2-digit' }
    : { month: '2-digit', day: '2-digit' };
  return d.toLocaleDateString('zh-TW', opts);
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function buildSkillNameMap() {
  const categories = getCategories();
  const map = {};
  categories.forEach((cat) => cat.skills.forEach((s) => (map[s.id] = s.name)));
  return map;
}
