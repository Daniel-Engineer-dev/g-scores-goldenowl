interface Props {
  open: boolean;
  message?: string;
}

const DEFAULT_MESSAGE =
  'The first request may take a few seconds while the server wakes up and builds its cache. Subsequent requests will be much faster — thanks for your patience!';

/**
 * Blocking loading popup shown during slow (first / uncached) requests.
 * It has no close button — it disappears automatically once data arrives.
 */
export default function LoadingModal({ open, message }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card loading-card" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <h2 className="loading-title">Loading data…</h2>
        <p className="loading-text">{message ?? DEFAULT_MESSAGE}</p>
      </div>
    </div>
  );
}
