import { useState, useEffect, FormEvent } from 'react';
import { fetchScore, fetchTopGroupA, apiErrorMessage } from '../api/client';
import type { ScoreLookupResult, TopStudent } from '../types';
import { LEVEL_COLOR, LEVEL_LABEL, LEVEL_NAME } from '../lib/levels';
import { launchFireworks } from '../lib/fireworks';
import CelebrationModal from '../components/CelebrationModal';
import LoadingModal from '../components/LoadingModal';
import { useDelayedFlag } from '../hooks/useDelayedFlag';

const SBD_PATTERN = /^\d{8}$/;

interface Celebration {
  sbd: string;
  rank: number;
  total: number;
}

export default function SearchScores() {
  const [sbd, setSbd] = useState('');
  const [result, setResult] = useState<ScoreLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const showLoadingPopup = useDelayedFlag(loading);

  // Load the Top 10 Group A list once so we can detect a match on search.
  useEffect(() => {
    fetchTopGroupA()
      .then(setTopStudents)
      .catch(() => setTopStudents([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = sbd.trim();

    // Client-side validation (backend validates again).
    if (!SBD_PATTERN.test(value)) {
      setError('Registration number must be exactly 8 digits.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchScore(value);
      setResult(data);

      // Celebrate if this candidate is in the Top 10 of Group A.
      const top = topStudents.find((s) => s.sbd === data.sbd);
      if (top) {
        setCelebration({ sbd: data.sbd, rank: top.rank, total: top.total });
        launchFireworks();
      }
    } catch (err) {
      setResult(null);
      setError(apiErrorMessage(err, 'Failed to fetch scores.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <section className="card">
        <h2 className="card-title">User Registration</h2>
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="sbd">
            Registration Number:
          </label>
          <div className="search-row">
            <input
              id="sbd"
              className="text-input"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Enter registration number (8 digits)"
              value={sbd}
              onChange={(e) => setSbd(e.target.value)}
            />
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Submit'}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>

      <section className="card">
        <h2 className="card-title">Detailed Scores</h2>
        {!result && !error && (
          <p className="muted">Detailed view of search scores here!</p>
        )}
        {result && (
          <div className="result">
            <div className="result-meta">
              <span>
                <strong>Registration No:</strong> {result.sbd}
              </span>
              {result.maNgoaiNgu && (
                <span>
                  <strong>Foreign Lang. Code:</strong> {result.maNgoaiNgu}
                </span>
              )}
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((s) => (
                    <tr key={s.code}>
                      <td>{s.nameVi}</td>
                      <td>{s.score ?? '—'}</td>
                      <td>
                        {s.level ? (
                          <span
                            className="level-badge"
                            style={{ background: LEVEL_COLOR[s.level] }}
                            title={LEVEL_LABEL[s.level]}
                          >
                            {LEVEL_NAME[s.level]}
                          </span>
                        ) : (
                          <span className="muted">Not taken</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <LoadingModal open={showLoadingPopup} />

      <CelebrationModal
        open={celebration !== null}
        onClose={() => setCelebration(null)}
        sbd={celebration?.sbd ?? ''}
        rank={celebration?.rank ?? 0}
        total={celebration?.total ?? 0}
      />
    </div>
  );
}
