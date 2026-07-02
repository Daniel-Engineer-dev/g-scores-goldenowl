import { scoreRepository, ScoreRepository } from '../repositories/score.repository';
import { subjectRegistry, SubjectRegistry } from '../domain/SubjectRegistry';
import { ScoreLevel, SCORE_LEVELS, LEVEL_LABELS } from '../domain/ScoreLevel';

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

export class ReportService {
  constructor(
    private readonly repo: ScoreRepository = scoreRepository,
    private readonly registry: SubjectRegistry = subjectRegistry,
  ) {}

  /** Per-subject counts across the 4 report levels (data for the chart). */
  async getStatistics(): Promise<StatisticsReport> {
    const rows = await this.repo.getStatistics();
    const byColumn = new Map(rows.map((r) => [r.column, r]));

    const subjects: SubjectStatistics[] = this.registry.all().map((subject) => {
      const r = byColumn.get(subject.column);
      const counts: Record<ScoreLevel, number> = {
        [ScoreLevel.Excellent]: r?.excellent ?? 0,
        [ScoreLevel.Good]: r?.good ?? 0,
        [ScoreLevel.Average]: r?.average ?? 0,
        [ScoreLevel.Poor]: r?.poor ?? 0,
      };
      const total =
        counts.excellent + counts.good + counts.average + counts.poor;
      return {
        code: subject.code,
        nameVi: subject.nameVi,
        nameEn: subject.nameEn,
        counts,
        total,
      };
    });

    return {
      levels: SCORE_LEVELS.map((key) => ({ key, label: LEVEL_LABELS[key] })),
      subjects,
    };
  }

  /** Top N Group A students (Math + Physics + Chemistry). */
  async getTopGroupA(limit = 10): Promise<TopStudent[]> {
    const rows = await this.repo.getTopGroupA(limit);
    return rows.map((r, i) => ({
      rank: i + 1,
      sbd: r.sbd,
      toan: r.toan,
      vatLi: r.vat_li,
      hoaHoc: r.hoa_hoc,
      total: Number(r.total),
    }));
  }
}

export const reportService = new ReportService();
