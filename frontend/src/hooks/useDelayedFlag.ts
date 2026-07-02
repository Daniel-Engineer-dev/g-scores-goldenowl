import { useEffect, useState } from 'react';

/**
 * Returns true only when `active` stays true longer than `delayMs`.
 * Used so a loading popup appears for slow (uncached / cold-start) requests
 * but never flashes for fast cached responses.
 */
export function useDelayedFlag(active: boolean, delayMs = 400): boolean {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return shown;
}
