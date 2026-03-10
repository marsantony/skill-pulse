import { describe, it, expect } from 'vitest';
import { SKILL_LEVELS, AI_DEPENDENCY, DEFAULT_CATEGORIES, STORAGE_KEYS } from '../js/data.js';

describe('Data definitions', () => {
  it('has 5 skill levels in order', () => {
    expect(SKILL_LEVELS).toHaveLength(5);
    SKILL_LEVELS.forEach((level, i) => {
      expect(level.value).toBe(i + 1);
      expect(level.label).toBeTruthy();
      expect(level.description).toBeTruthy();
    });
  });

  it('has 3 AI dependency levels', () => {
    expect(AI_DEPENDENCY).toHaveLength(3);
    const values = AI_DEPENDENCY.map((d) => d.value);
    expect(values).toEqual(['low', 'medium', 'high']);
  });

  it('has default categories with unique IDs', () => {
    expect(DEFAULT_CATEGORIES.length).toBeGreaterThan(0);
    const catIds = DEFAULT_CATEGORIES.map((c) => c.id);
    expect(new Set(catIds).size).toBe(catIds.length);

    // All skills have unique IDs across all categories
    const allSkillIds = DEFAULT_CATEGORIES.flatMap((c) => c.skills.map((s) => s.id));
    expect(new Set(allSkillIds).size).toBe(allSkillIds.length);
  });

  it('has all required storage keys', () => {
    expect(STORAGE_KEYS.CATEGORIES).toBeTruthy();
    expect(STORAGE_KEYS.ASSESSMENTS).toBeTruthy();
    expect(STORAGE_KEYS.REVIEWS).toBeTruthy();
  });
});
