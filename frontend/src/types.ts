export type ScoreLevel = 'excellent' | 'good' | 'average' | 'poor';

export interface SubjectScore {
  code: string;
  nameVi: string;
  nameEn: string;
  score: number | null;
  level: ScoreLevel | null;
}

export interface ScoreLookupResult {
  sbd: string;
  maNgoaiNgu: string | null;
  subjects: SubjectScore[];
}

export interface SubjectStatistics {
  code: string;
  nameVi: string;
  nameEn: string;
  counts: Record<ScoreLevel, number>;
  total: number;
}

export interface StatisticsReport {
  levels: { key: ScoreLevel; label: string }[];
  subjects: SubjectStatistics[];
}

export interface TopStudent {
  rank: number;
  sbd: string;
  toan: number;
  vatLi: number;
  hoaHoc: number;
  total: number;
}
