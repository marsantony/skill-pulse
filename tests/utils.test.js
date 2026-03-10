import { describe, it, expect } from 'vitest';
import { formatDate, escapeHtml, getISOWeek, buildSkillNameMap } from '../js/utils.js';
import { DEFAULT_CATEGORIES } from '../js/data.js';

describe('formatDate', () => {
  it('formats with year by default', () => {
    const result = formatDate('2026-03-10T12:00:00Z');
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/03/);
    expect(result).toMatch(/10/);
  });

  it('formats without year when includeYear is false', () => {
    const result = formatDate('2026-03-10T12:00:00Z', false);
    expect(result).not.toMatch(/2026/);
    expect(result).toMatch(/03/);
  });
});

describe('escapeHtml', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('getISOWeek', () => {
  it('returns correct format', () => {
    const result = getISOWeek(new Date('2026-03-10'));
    expect(result).toMatch(/^\d{4}-W\d{2}$/);
  });

  it('returns W10 for 2026-03-10', () => {
    expect(getISOWeek(new Date('2026-03-10'))).toBe('2026-W10');
  });
});

describe('buildSkillNameMap', () => {
  it('builds map from default categories', () => {
    const map = buildSkillNameMap();
    // Check a known skill from DEFAULT_CATEGORIES
    expect(map.javascript).toBe('JavaScript');
    expect(map.python).toBe('Python');
  });

  it('includes all skills', () => {
    const map = buildSkillNameMap();
    const expectedCount = DEFAULT_CATEGORIES.reduce((sum, cat) => sum + cat.skills.length, 0);
    expect(Object.keys(map).length).toBe(expectedCount);
  });
});
