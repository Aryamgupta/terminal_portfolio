import { kv } from "@vercel/kv";

export type KVResponse<T> = {
  data: T;
  exportedAt: string;
};

/**
 * Safely fetches cached data from Vercel KV.
 * - In local development: immediately runs dbFallback() to prevent slow network lookups.
 * - In production: races KV lookup with a 400ms timeout, falling back to dbFallback() on error or timeout.
 */
export async function getCachedData<T>(key: string, dbFallback: () => Promise<T>): Promise<T> {
  if (process.env.NODE_ENV === "development") {
    return dbFallback();
  }

  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), 400)
  );

  try {
    const fetchPromise = kv.get(key);
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (result) {
      const response = result as KVResponse<T>;
      if (response && response.data !== undefined) {
        return response.data;
      }
    }
  } catch (err) {
    console.error(`KV cache lookup failed/timed out for key "${key}". Using database fallback.`, err);
  }

  return dbFallback();
}
