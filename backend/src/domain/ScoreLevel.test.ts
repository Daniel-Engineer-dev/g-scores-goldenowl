import { describe, it, expect } from 'vitest';
import { ScoreLevel, classifyScore } from './ScoreLevel';

/**
 * The assignment defines four report levels:
 *   >= 8            -> Excellent
 *   6 <= score < 8  -> Good
 *   4 <= score < 6  -> Average
 *   score < 4       -> Poor
 * The boundaries (8, 6, 4) are the part most easily gotten wrong, so they are
 * pinned explicitly here.
 */
describe('classifyScore', () => {
  it('classifies scores at and above 8 as Excellent', () => {
    expect(classifyScore(10)).toBe(ScoreLevel.Excellent);
    expect(classifyScore(8)).toBe(ScoreLevel.Excellent); // inclusive lower bound
  });

  it('classifies [6, 8) as Good', () => {
    expect(classifyScore(7.99)).toBe(ScoreLevel.Good);
    expect(classifyScore(6)).toBe(ScoreLevel.Good); // inclusive lower bound
  });

  it('classifies [4, 6) as Average', () => {
    expect(classifyScore(5.99)).toBe(ScoreLevel.Average);
    expect(classifyScore(4)).toBe(ScoreLevel.Average); // inclusive lower bound
  });

  it('classifies below 4 as Poor', () => {
    expect(classifyScore(3.99)).toBe(ScoreLevel.Poor);
    expect(classifyScore(0)).toBe(ScoreLevel.Poor);
  });
});
