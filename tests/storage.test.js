import { describe, it, expect } from 'vitest';
import {
  getCategories,
  saveCategories,
  getAssessments,
  saveAssessment,
  deleteAssessment,
  getReviews,
  saveReview,
  deleteReview,
  exportAll,
  importAll,
  clearAll,
} from '../js/storage.js';
import { DEFAULT_CATEGORIES } from '../js/data.js';

describe('Categories', () => {
  it('returns default categories when none saved', () => {
    const cats = getCategories();
    expect(cats).toEqual(DEFAULT_CATEGORIES);
  });

  it('returns saved categories after save', () => {
    const custom = [{ id: 'test', name: 'Test', skills: [] }];
    saveCategories(custom);
    expect(getCategories()).toEqual(custom);
  });
});

describe('Assessments', () => {
  it('starts empty', () => {
    expect(getAssessments()).toEqual([]);
  });

  it('saves and retrieves an assessment', () => {
    const entry = saveAssessment({
      ratings: { javascript: { level: 4, aiDep: 'low' } },
    });
    expect(entry.id).toBeDefined();
    expect(entry.date).toBeDefined();
    expect(entry.ratings.javascript.level).toBe(4);

    const all = getAssessments();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(entry.id);
  });

  it('appends multiple assessments', () => {
    saveAssessment({ ratings: { a: { level: 1, aiDep: 'high' } } });
    saveAssessment({ ratings: { b: { level: 3, aiDep: 'medium' } } });
    expect(getAssessments()).toHaveLength(2);
  });

  it('deletes an assessment by id', () => {
    const e1 = saveAssessment({ ratings: {} });
    const e2 = saveAssessment({ ratings: {} });
    deleteAssessment(e1.id);
    const all = getAssessments();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(e2.id);
  });
});

describe('Reviews', () => {
  it('starts empty', () => {
    expect(getReviews()).toEqual([]);
  });

  it('saves a weekly review with defaults', () => {
    const entry = saveReview({
      learned: 'Python decorators',
      leanedOnAI: 'Wrote pytest fixtures',
      lacked: 'Debugging async code',
      nextWeek: 'Hand-write 3 tests',
    });
    expect(entry.id).toBeDefined();
    expect(entry.week).toMatch(/^\d{4}-W\d{2}$/);
    expect(entry.learned).toBe('Python decorators');
    expect(entry.leanedOnAI).toBe('Wrote pytest fixtures');
  });

  it('deletes a review by id', () => {
    const e1 = saveReview({ learned: 'a' });
    saveReview({ learned: 'b' });
    deleteReview(e1.id);
    expect(getReviews()).toHaveLength(1);
  });
});

describe('Export / Import', () => {
  it('exports all data with version', () => {
    saveAssessment({ ratings: { x: { level: 2, aiDep: 'low' } } });
    saveReview({ learned: 'something' });

    const data = exportAll();
    expect(data.version).toBe(1);
    expect(data.exportedAt).toBeDefined();
    expect(data.assessments).toHaveLength(1);
    expect(data.reviews).toHaveLength(1);
    expect(data.categories).toEqual(DEFAULT_CATEGORIES);
  });

  it('imports data and overwrites existing', () => {
    saveReview({ learned: 'old' });

    const backup = {
      version: 1,
      categories: [{ id: 'custom', name: 'Custom', skills: [] }],
      assessments: [{ id: 'a1', date: '2026-01-01', ratings: {} }],
      reviews: [{ id: 'r1', date: '2026-01-01', week: '2026-W01', learned: 'new' }],
    };
    importAll(backup);

    expect(getCategories()).toEqual(backup.categories);
    expect(getAssessments()).toEqual(backup.assessments);
    expect(getReviews()).toEqual(backup.reviews);
  });

  it('rejects invalid format', () => {
    expect(() => importAll(null)).toThrow('Invalid backup format');
    expect(() => importAll({ version: 99 })).toThrow('Invalid backup format');
  });
});

describe('clearAll', () => {
  it('removes all stored data', () => {
    saveAssessment({ ratings: {} });
    saveReview({ learned: 'x' });
    saveCategories([]);
    clearAll();
    expect(getAssessments()).toEqual([]);
    expect(getReviews()).toEqual([]);
    expect(getCategories()).toEqual(DEFAULT_CATEGORIES);
  });
});
