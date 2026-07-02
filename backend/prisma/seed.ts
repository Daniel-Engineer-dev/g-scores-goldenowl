/**
 * CSV -> PostgreSQL seeder for G-Scores.
 *
 * Streams the raw exam-results CSV (~1M rows) and inserts them into the
 * `scores` table in batches to keep memory usage flat. Empty cells become
 * NULL. Safe to re-run: existing `sbd` rows are skipped.
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { parse } from 'csv-parse';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const CSV_PATH = path.resolve(
  __dirname,
  '../../dataset/diem_thi_thpt_2024.csv',
);
const BATCH_SIZE = Number(process.env.SEED_BATCH_SIZE) || 5000;
const MAX_RETRIES = 5;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Parse a raw cell into a float, or null when empty/invalid. */
function toFloat(value: string | undefined): number | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/** Parse a raw cell into a trimmed string, or null when empty. */
function toStr(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function mapRow(row: Record<string, string>): Prisma.ScoreCreateManyInput | null {
  const sbd = toStr(row.sbd);
  if (!sbd) return null; // skip rows without a registration number
  return {
    sbd,
    toan: toFloat(row.toan),
    nguVan: toFloat(row.ngu_van),
    ngoaiNgu: toFloat(row.ngoai_ngu),
    vatLi: toFloat(row.vat_li),
    hoaHoc: toFloat(row.hoa_hoc),
    sinhHoc: toFloat(row.sinh_hoc),
    lichSu: toFloat(row.lich_su),
    diaLi: toFloat(row.dia_li),
    gdcd: toFloat(row.gdcd),
    maNgoaiNgu: toStr(row.ma_ngoai_ngu),
  };
}

async function insertBatch(batch: Prisma.ScoreCreateManyInput[]): Promise<number> {
  // Retry transient connection drops (e.g. P1017 on remote/free databases).
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await prisma.score.createMany({
        data: batch,
        skipDuplicates: true,
      });
      return result.count;
    } catch (err) {
      lastErr = err;
      console.warn(
        `   ⚠️  batch insert failed (attempt ${attempt}/${MAX_RETRIES}), retrying...`,
      );
      await sleep(1000 * attempt);
    }
  }
  throw lastErr;
}

async function main() {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found at ${CSV_PATH}`);
  }

  const existing = await prisma.score.count();
  if (existing > 0 && process.env.FORCE_SEED !== '1') {
    console.log(
      `⏭️  scores table already has ${existing.toLocaleString()} rows. Skipping seed (set FORCE_SEED=1 to re-import).`,
    );
    return;
  }
  if (existing > 0) {
    console.log(
      `⚠️  FORCE_SEED=1: table has ${existing.toLocaleString()} rows, duplicate sbd will be skipped.`,
    );
  }

  console.log(`📥 Seeding from ${CSV_PATH} ...`);
  const start = Date.now();

  const parser = createReadStream(CSV_PATH).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true }),
  );

  let batch: Prisma.ScoreCreateManyInput[] = [];
  let total = 0;
  let inserted = 0;

  for await (const record of parser) {
    const mapped = mapRow(record as Record<string, string>);
    if (!mapped) continue;
    batch.push(mapped);

    if (batch.length >= BATCH_SIZE) {
      inserted += await insertBatch(batch);
      total += batch.length;
      batch = [];
      if (total % 100000 === 0) {
        console.log(`   processed ${total.toLocaleString()} rows...`);
      }
    }
  }

  if (batch.length > 0) {
    inserted += await insertBatch(batch);
    total += batch.length;
  }

  const secs = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `✅ Done. Processed ${total.toLocaleString()} rows, inserted ${inserted.toLocaleString()} new rows in ${secs}s.`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
