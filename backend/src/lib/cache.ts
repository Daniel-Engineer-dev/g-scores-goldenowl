interface Entry<T> {
  promise: Promise<T>;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();

/**
 * In-memory TTL cache with in-flight de-duplication. Suitable for expensive
 * queries over static data (e.g. exam statistics). The cached promise is
 * evicted if it rejects so the next call retries.
 */
export function cached<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.promise;

  const promise = producer().catch((err) => {
    store.delete(key);
    throw err;
  });
  store.set(key, { promise, expires: Date.now() + ttlMs });
  return promise;
}
