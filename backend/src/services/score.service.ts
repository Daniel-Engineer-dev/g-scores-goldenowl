import { scoreRepository, ScoreRepository } from '../repositories/score.repository';
import { subjectRegistry, SubjectRegistry } from '../domain/SubjectRegistry';
import { NotFoundError } from '../lib/errors';

export interface SubjectScore {
  code: string;
  nameVi: string;
  nameEn: string;
  score: number | null;
  level: string | null;
}

export interface ScoreLookupResult {
  sbd: string;
  maNgoaiNgu: string | null;
  subjects: SubjectScore[];
}

export class ScoreService {
  constructor(
    private readonly repo: ScoreRepository = scoreRepository,
    private readonly registry: SubjectRegistry = subjectRegistry,
  ) {}

  /** Look up a candidate's scores by registration number. */
  async getScoreBySbd(sbd: string): Promise<ScoreLookupResult> {
    const record = await this.repo.findBySbd(sbd);
    if (!record) {
      throw new NotFoundError(`No candidate found with registration number "${sbd}"`);
    }

    const subjects: SubjectScore[] = this.registry.all().map((subject) => {
      const score = (record as Record<string, unknown>)[subject.field] as
        | number
        | null;
      return {
        code: subject.code,
        nameVi: subject.nameVi,
        nameEn: subject.nameEn,
        score: score ?? null,
        level: subject.classify(score),
      };
    });

    return {
      sbd: record.sbd,
      maNgoaiNgu: record.maNgoaiNgu,
      subjects,
    };
  }
}

export const scoreService = new ScoreService();
