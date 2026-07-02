import { useState, FormEvent } from 'react';
import { fetchScore, apiErrorMessage } from '../api/client';
import type { ScoreLookupResult } from '../types';
import { LEVEL_COLOR, LEVEL_LABEL, LEVEL_NAME } from '../lib/levels';

const SBD_PATTERN = /^\d{6,8}$/;

export default function SearchScores() {
  const [sbd, setSbd] = useState('');
  const [result, setResult] = useState<ScoreLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = sbd.trim();

    // Client-side validation (backend validates again).
    if (!SBD_PATTERN.test(value)) {
      setError('Registration number must contain 6-8 digits.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchScore(value);
      setResult(data);
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
              placeholder="Enter registration number"
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
    </div>
  );
}
