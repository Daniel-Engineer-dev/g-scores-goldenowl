import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  sbd: string;
  rank: number;
  total: number;
}

/**
 * Congratulations popup shown when the searched candidate is in the
 * Top 10 of Group A. Closes on Escape or backdrop click.
 */
export default function CelebrationModal({
  open,
  onClose,
  sbd,
  rank,
  total,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card celebration"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="celebration-emoji">🎉🏆🎉</div>
        <h2 className="celebration-title">Congratulations!</h2>
        <p className="celebration-text">
          Registration number <strong>{sbd}</strong> is in the{' '}
          <strong>Top 10 of Group A</strong> (Math · Physics · Chemistry)!
        </p>
        <div className="celebration-stats">
          <div className="celebration-stat">
            <span className="celebration-stat-value">#{rank}</span>
            <span className="celebration-stat-label">Rank</span>
          </div>
          <div className="celebration-stat">
            <span className="celebration-stat-value">{total.toFixed(2)}</span>
            <span className="celebration-stat-label">Total score</span>
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={onClose}>
          Awesome!
        </button>
      </div>
    </div>
  );
}
