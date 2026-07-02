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

export async function fetchScore(sbd: string): Promise<ScoreLookupResult> {
  const { data } = await api.get<ScoreLookupResult>(`/scores/${sbd}`);
  return data;
}

export async function fetchStatistics(): Promise<StatisticsReport> {
  const { data } = await api.get<StatisticsReport>('/reports/statistics');
  return data;
}

export async function fetchTopGroupA(): Promise<TopStudent[]> {
  const { data } = await api.get<TopStudent[]>('/reports/top-group-a');
  return data;
}
