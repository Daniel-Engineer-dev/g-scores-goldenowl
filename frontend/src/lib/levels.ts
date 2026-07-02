import type { ScoreLevel } from '../types';

/** Display label per level (matches backend thresholds). */
export const LEVEL_LABEL: Record<ScoreLevel, string> = {
  excellent: '>= 8',
  good: '6 - 8',
  average: '4 - 6',
  poor: '< 4',
};

/** Short descriptive name per level. */
export const LEVEL_NAME: Record<ScoreLevel, string> = {
  excellent: 'Excellent',
  good: 'Good',
  average: 'Average',
  poor: 'Poor',
};

/** Accessible, distinct colours for the four levels. */
export const LEVEL_COLOR: Record<ScoreLevel, string> = {
  excellent: '#2e7d5b', // green
  good: '#1e4db7', // blue
  average: '#e8a300', // amber
  poor: '#d64545', // red
};

export const LEVEL_ORDER: ScoreLevel[] = [
  'excellent',
  'good',
  'average',
  'poor',
];
