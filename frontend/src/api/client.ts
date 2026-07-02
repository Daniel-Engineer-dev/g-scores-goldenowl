import axios from 'axios';
import type {
  ScoreLookupResult,
  StatisticsReport,
  TopStudent,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
});

/** Extract a human-friendly message from an axios error. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message ?? fallback;
  }
  return fallback;
}

// Session-lifetime cache for static report data: repeated visits (e.g.
// switching to the Reports tab) reuse the result and also de-duplicate any
// in-flight request instead of re-querying the backend.
const cache = new Map<string, Promise<unknown>>();

function cachedGet<T>(key: string, request: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    cache.set(
      key,
      request().catch((err) => {
        cache.delete(key); // allow retry after a failure
        throw err;
      }),
    );
  }
  return cache.get(key) as Promise<T>;
}

export async function fetchScore(sbd: string): Promise<ScoreLookupResult> {
  const { data } = await api.get<ScoreLookupResult>(`/scores/${sbd}`);
  return data;
}

export function fetchStatistics(): Promise<StatisticsReport> {
  return cachedGet('statistics', async () => {
    const { data } = await api.get<StatisticsReport>('/reports/statistics');
    return data;
  });
}

export function fetchTopGroupA(): Promise<TopStudent[]> {
  return cachedGet('top-group-a', async () => {
    const { data } = await api.get<TopStudent[]>('/reports/top-group-a');
    return data;
  });
}
