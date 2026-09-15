import { getRedis } from "@/lib/redisClient";
import { getClientIdentifier } from "@/lib/getClientIdentifier";

const VISITORS_COUNT_KEY = "visitors:count";
const VISITOR_IP_PREFIX = "visitors:ip:";
const IP_WINDOW_SECONDS = 600; // 10 minutes - same IP counts again after this

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ count: 0, configured: false });
  }

  try {
    const raw = await redis.get(VISITORS_COUNT_KEY);
    const count = raw == null ? 0 : Number(raw) || 0;
    return Response.json({ count, configured: true });
  } catch (error) {
    console.error("visitors GET:", error);
    return Response.json({ count: 0, configured: true }, { status: 500 });
  }
}

export async function POST(request) {
  const redis = getRedis();
  if (!redis) {
    return Response.json({ success: true, configured: false });
  }

  try {
    const identifier = getClientIdentifier(request);
    const ipKey = `${VISITOR_IP_PREFIX}${identifier}`;

    // Only true the very first time this IP is seen within the window - `nx` means
    // "set only if it doesn't already exist", so repeat visits inside the window no-op here.
    const isNewVisitor = await redis.set(ipKey, "1", {
      ex: IP_WINDOW_SECONDS,
      nx: true,
    });

    if (isNewVisitor) {
      await redis.incr(VISITORS_COUNT_KEY);
    }

    return Response.json({ success: true, configured: true });
  } catch (error) {
    console.error("visitors POST:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
