import { STORAGE_KEYS, DEFAULT_CATEGORIES } from './data.js';

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Categories ---

export function getCategories() {
  return read(STORAGE_KEYS.CATEGORIES) ?? DEFAULT_CATEGORIES;
}

export function saveCategories(categories) {
  write(STORAGE_KEYS.CATEGORIES, categories);
}

// --- Assessments ---

export function getAssessments() {
  return read(STORAGE_KEYS.ASSESSMENTS) ?? [];
}

export function saveAssessment(assessment) {
  const all = getAssessments();
  // Each assessment has: { id, date, ratings: { [skillId]: { level, aiDep } } }
  const entry = {
    id: assessment.id ?? crypto.randomUUID(),
    date: assessment.date ?? new Date().toISOString(),
    ratings: assessment.ratings,
  };
  all.push(entry);
  write(STORAGE_KEYS.ASSESSMENTS, all);
  return entry;
}

export function deleteAssessment(id) {
  const all = getAssessments().filter((a) => a.id !== id);
  write(STORAGE_KEYS.ASSESSMENTS, all);
}

// --- Weekly Reviews ---

export function getReviews() {
  return read(STORAGE_KEYS.REVIEWS) ?? [];
}

export function saveReview(review) {
  const all = getReviews();
  const entry = {
    id: review.id ?? crypto.randomUUID(),
    date: review.date ?? new Date().toISOString(),
    week: review.week ?? getISOWeek(new Date()),
    learned: review.learned ?? '',
    leanedOnAI: review.leanedOnAI ?? '',
    lacked: review.lacked ?? '',
    nextWeek: review.nextWeek ?? '',
  };
  all.push(entry);
  write(STORAGE_KEYS.REVIEWS, all);
  return entry;
}

export function deleteReview(id) {
  const all = getReviews().filter((r) => r.id !== id);
  write(STORAGE_KEYS.REVIEWS, all);
}

// --- Export / Import ---

export function exportAll() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories: getCategories(),
    assessments: getAssessments(),
    reviews: getReviews(),
  };
}

export function importAll(data) {
  if (!data || data.version !== 1) {
    throw new Error('Invalid backup format');
  }
  if (data.categories) write(STORAGE_KEYS.CATEGORIES, data.categories);
  if (data.assessments) write(STORAGE_KEYS.ASSESSMENTS, data.assessments);
  if (data.reviews) write(STORAGE_KEYS.REVIEWS, data.reviews);
}

export function clearAll() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// --- Helpers ---

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}
