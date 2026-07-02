import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchStatistics, fetchTopGroupA, apiErrorMessage } from '../api/client';
import type { StatisticsReport, TopStudent } from '../types';
import { LEVEL_COLOR, LEVEL_LABEL, LEVEL_ORDER, LEVEL_NAME } from '../lib/levels';
import LoadingModal from '../components/LoadingModal';
import { useDelayedFlag } from '../hooks/useDelayedFlag';

export default function Reports() {
  const [stats, setStats] = useState<StatisticsReport | null>(null);
  const [top, setTop] = useState<TopStudent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const showLoadingPopup = useDelayedFlag(loading);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsData, topData] = await Promise.all([
          fetchStatistics(),
          fetchTopGroupA(),
        ]);
        if (cancelled) return;
        setStats(statsData);
        setTop(topData);
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err, 'Failed to load reports.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Transform stats into Recharts rows: one row per subject, one key per level.
  const chartData =
    stats?.subjects.map((s) => ({
      subject: s.nameVi,
      excellent: s.counts.excellent,
      good: s.counts.good,
      average: s.counts.average,
      poor: s.counts.poor,
    })) ?? [];

  return (
    <div className="page">
      <LoadingModal open={showLoadingPopup} />
      <section className="card">
        <h2 className="card-title">Score Distribution by Subject</h2>
        <p className="muted">
          Number of candidates in each level: {LEVEL_LABEL.excellent} ·{' '}
          {LEVEL_LABEL.good} · {LEVEL_LABEL.average} · {LEVEL_LABEL.poor}
        </p>
        {loading && <p className="muted">Loading chart…</p>}
        {error && <p className="form-error">{error}</p>}
        {stats && (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} interval={0} />
                <YAxis tick={{ fontSize: 12 }} width={70} />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                {LEVEL_ORDER.map((level) => (
                  <Bar
                    key={level}
                    dataKey={level}
                    name={`${LEVEL_NAME[level]} (${LEVEL_LABEL[level]})`}
                    fill={LEVEL_COLOR[level]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">Top 10 Students — Group A (Math · Physics · Chemistry)</h2>
        {loading && <p className="muted">Loading…</p>}
        {!loading && !error && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Registration No.</th>
                  <th>Math</th>
                  <th>Physics</th>
                  <th>Chemistry</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {top.map((s) => (
                  <tr key={s.sbd}>
                    <td>
                      <span className="rank-badge">{s.rank}</span>
                    </td>
                    <td>{s.sbd}</td>
                    <td>{s.toan}</td>
                    <td>{s.vatLi}</td>
                    <td>{s.hoaHoc}</td>
                    <td>
                      <strong>{s.total.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
