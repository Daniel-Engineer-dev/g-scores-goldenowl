import { ScoreLevel, classifyScore } from './ScoreLevel';

/**
 * OOP representation of an exam subject (môn học).
 *
 * A Subject knows how it maps to the database (both the Prisma model field
 * and the raw SQL column), how it is labelled, and how to classify a score
 * into a report level. This is the single source of truth used by the
 * lookup, statistics and top-list features.
 */
export class Subject {
  constructor(
    /** Prisma model field name, e.g. "nguVan". */
    public readonly field: string,
    /** Raw SQL column name, e.g. "ngu_van". */
    public readonly column: string,
    /** Short stable code used in API responses, e.g. "ngu_van". */
    public readonly code: string,
    /** Vietnamese display name. */
    public readonly nameVi: string,
    /** English display name. */
    public readonly nameEn: string,
  ) {}

  /** Classify a raw score for this subject; null when not sat. */
  classify(score: number | null | undefined): ScoreLevel | null {
    if (score === null || score === undefined) return null;
    return classifyScore(score);
  }

  toJSON() {
    return {
      code: this.code,
      field: this.field,
      nameVi: this.nameVi,
      nameEn: this.nameEn,
    };
  }
}
