/**
 * The four report levels required by the assignment:
 *   - Excellent: score >= 8
 *   - Good:      6 <= score < 8
 *   - Average:   4 <= score < 6
 *   - Poor:      score < 4
 */
export enum ScoreLevel {
  Excellent = 'excellent',
  Good = 'good',
  Average = 'average',
  Poor = 'poor',
}

/** Ordered list of levels (highest -> lowest) for stable reporting output. */
export const SCORE_LEVELS: ScoreLevel[] = [
  ScoreLevel.Excellent,
  ScoreLevel.Good,
  ScoreLevel.Average,
  ScoreLevel.Poor,
];

/** Human-readable labels for each level. */
export const LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.Excellent]: '>= 8',
  [ScoreLevel.Good]: '6 - 8',
  [ScoreLevel.Average]: '4 - 6',
  [ScoreLevel.Poor]: '< 4',
};

/** Classify a numeric score into its report level. */
export function classifyScore(score: number): ScoreLevel {
  if (score >= 8) return ScoreLevel.Excellent;
  if (score >= 6) return ScoreLevel.Good;
  if (score >= 4) return ScoreLevel.Average;
  return ScoreLevel.Poor;
}
