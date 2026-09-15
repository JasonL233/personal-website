import { Redis } from "@upstash/redis";

/**
 * Lazily builds an Upstash Redis client from env vars. Returns null when the two
 * env vars aren't set, so callers can fall back gracefully (e.g. "not configured")
 * instead of throwing - lets the app run fine before Upstash is set up.
 */
export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
