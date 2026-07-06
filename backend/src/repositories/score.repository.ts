import { prisma } from '../lib/prisma';
import { Score } from '@prisma/client';
import { subjectRegistry, GROUP_A_CODES } from '../domain/SubjectRegistry';

/** Raw per-subject, per-level counts as returned by the statistics query. */
export interface SubjectLevelCounts {
  column: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

export interface TopGroupARow {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  total: number;
}

export class ScoreRepository {
  /** Look up a single candidate by registration number. */
  findBySbd(sbd: string): Promise<Score | null> {
    return prisma.score.findUnique({ where: { sbd } });
  }

  /**
   * Count candidates per report level for every subject in a single pass
   * using conditional aggregation. Column names come from the trusted
   * SubjectRegistry (never user input), so string interpolation is safe.
   */
  async getStatistics(): Promise<SubjectLevelCounts[]> {
    const selects = subjectRegistry
      .all()
      .map((s) => {
        const c = s.column;
        return `
          COUNT(*) FILTER (WHERE "${c}" >= 8) AS "${c}_excellent",
          COUNT(*) FILTER (WHERE "${c}" >= 6 AND "${c}" < 8) AS "${c}_good",
          COUNT(*) FILTER (WHERE "${c}" >= 4 AND "${c}" < 6) AS "${c}_average",
          COUNT(*) FILTER (WHERE "${c}" IS NOT NULL AND "${c}" < 4) AS "${c}_poor"`;
      })
      .join(',');

    const sql = `SELECT ${selects} FROM scores`;
    const rows = await prisma.$queryRawUnsafe<Record<string, bigint>[]>(sql);
    const row = rows[0] ?? {};

    return subjectRegistry.all().map((s) => {
      const c = s.column;
      return {
        column: c,
        excellent: Number(row[`${c}_excellent`] ?? 0),
        good: Number(row[`${c}_good`] ?? 0),
        average: Number(row[`${c}_average`] ?? 0),
        poor: Number(row[`${c}_poor`] ?? 0),
      };
    });
  }

  /**
   * Top candidates of Group A (Math + Physics + Chemistry) ranked by the
   * sum of the three scores. Only candidates who sat all three count.
   */
  async getTopGroupA(limit: number): Promise<TopGroupARow[]> {
    const [math, physics, chemistry] = GROUP_A_CODES.map((code) => {
      const s = subjectRegistry.getByCode(code);
      if (!s) throw new Error(`Missing Group A subject: ${code}`);
      return s.column;
    });

    const sql = `
      SELECT sbd, "${math}" AS toan, "${physics}" AS vat_li, "${chemistry}" AS hoa_hoc,
             ("${math}" + "${physics}" + "${chemistry}") AS total
      FROM scores
      WHERE "${math}" IS NOT NULL
        AND "${physics}" IS NOT NULL
        AND "${chemistry}" IS NOT NULL
      ORDER BY total DESC, sbd ASC
      LIMIT $1`;

    return prisma.$queryRawUnsafe<TopGroupARow[]>(sql, limit);
  }
}

export const scoreRepository = new ScoreRepository();
