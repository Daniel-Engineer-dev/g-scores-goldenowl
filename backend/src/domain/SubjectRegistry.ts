import { Subject } from './Subject';

/**
 * Central registry of all exam subjects. Everything that needs to iterate
 * over subjects (score lookup, per-subject statistics, group definitions)
 * goes through this single instance so there is one source of truth.
 */
export class SubjectRegistry {
  private readonly subjects: Subject[];
  private readonly byCode: Map<string, Subject>;

  constructor(subjects: Subject[]) {
    this.subjects = subjects;
    this.byCode = new Map(subjects.map((s) => [s.code, s]));
  }

  /** All subjects in definition order. */
  all(): Subject[] {
    return this.subjects;
  }

  getByCode(code: string): Subject | undefined {
    return this.byCode.get(code);
  }

  /** Resolve a list of codes to Subject instances (throws if unknown). */
  getMany(codes: string[]): Subject[] {
    return codes.map((code) => {
      const subject = this.getByCode(code);
      if (!subject) throw new Error(`Unknown subject code: ${code}`);
      return subject;
    });
  }
}

// --- Subject definitions (field, column, code, nameVi, nameEn) ---
export const subjectRegistry = new SubjectRegistry([
  new Subject('toan', 'toan', 'toan', 'Toán', 'Mathematics'),
  new Subject('nguVan', 'ngu_van', 'ngu_van', 'Ngữ Văn', 'Literature'),
  new Subject('ngoaiNgu', 'ngoai_ngu', 'ngoai_ngu', 'Ngoại Ngữ', 'Foreign Language'),
  new Subject('vatLi', 'vat_li', 'vat_li', 'Vật Lí', 'Physics'),
  new Subject('hoaHoc', 'hoa_hoc', 'hoa_hoc', 'Hóa Học', 'Chemistry'),
  new Subject('sinhHoc', 'sinh_hoc', 'sinh_hoc', 'Sinh Học', 'Biology'),
  new Subject('lichSu', 'lich_su', 'lich_su', 'Lịch Sử', 'History'),
  new Subject('diaLi', 'dia_li', 'dia_li', 'Địa Lí', 'Geography'),
  new Subject('gdcd', 'gdcd', 'gdcd', 'GDCD', 'Civic Education'),
]);

/** Group A = Mathematics + Physics + Chemistry. */
export const GROUP_A_CODES = ['toan', 'vat_li', 'hoa_hoc'];
