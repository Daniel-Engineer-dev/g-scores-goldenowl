import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="page">
      <section className="card">
        <h2 className="card-title">Welcome to G-Scores</h2>
        <p className="muted">
          Look up exam results and explore national score statistics for the
          2024 High School Exam.
        </p>
      </section>

      <div className="dash-grid">
        <Link to="/search" className="card dash-card">
          <h3 className="dash-card-title">🔎 Search Scores</h3>
          <p className="muted">
            Find a candidate's detailed scores by registration number.
          </p>
        </Link>
        <Link to="/reports" className="card dash-card">
          <h3 className="dash-card-title">📊 Reports</h3>
          <p className="muted">
            Score distribution by subject and the Top 10 Group A students.
          </p>
        </Link>
      </div>
    </div>
  );
}
