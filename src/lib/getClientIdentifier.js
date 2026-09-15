/**
 * Best-effort visitor IP from request headers. Vercel (and most proxies) set
 * `x-forwarded-for` to "client, proxy1, proxy2" - the first entry is the real client.
 * Falls back to `x-real-ip`, then "unknown" if neither is present (e.g. local dev
 * without a proxy in front of it).
 */
export function getClientIdentifier(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
