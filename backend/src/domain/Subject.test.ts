import { describe, it, expect } from 'vitest';
import { ScoreLevel } from './ScoreLevel';
import { subjectRegistry, GROUP_A_CODES } from './SubjectRegistry';

describe('Subject.classify', () => {
  const toan = subjectRegistry.getByCode('toan')!;

  it('returns null when the subject was not sat', () => {
    expect(toan.classify(null)).toBeNull();
    expect(toan.classify(undefined)).toBeNull();
  });

  it('classifies a present score', () => {
    expect(toan.classify(8)).toBe(ScoreLevel.Excellent);
    expect(toan.classify(3.5)).toBe(ScoreLevel.Poor);
  });
});

describe('SubjectRegistry', () => {
  it('exposes all nine exam subjects', () => {
    expect(subjectRegistry.all()).toHaveLength(9);
  });

  it('defines Group A as Math + Physics + Chemistry', () => {
    expect(GROUP_A_CODES).toEqual(['toan', 'vat_li', 'hoa_hoc']);
    for (const code of GROUP_A_CODES) {
      expect(subjectRegistry.getByCode(code)).toBeDefined();
    }
  });

  it('throws on an unknown subject code', () => {
    expect(() => subjectRegistry.getMany(['nope'])).toThrow();
  });
});
