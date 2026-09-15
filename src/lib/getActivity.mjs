import { unstable_cache } from "next/cache";
import { activityProfiles } from "@/data/activityProfiles";
import { fetchLeetcode, fetchDuolingo, fetchLeague } from "@/lib/activityStats.mjs";

const providers = { leetcode: fetchLeetcode, duolingo: fetchDuolingo, league: fetchLeague };

export const ACTIVITY_SERVICES = Object.keys(providers);
export function isKnownService(service) {
  return Object.hasOwn(providers, service);
}

/**
 * Shared by the API route (for the client's retry button) and by the About page itself,
 * which calls this directly during server rendering so the cards' first paint already has
 * real numbers instead of "Fetching the latest stats…".
 *
 * Never throws: failures come back as a `status` the UI already knows how to render, so a
 * flaky provider can't take down the page render.
 */
export async function getActivity(service) {
  if (!isKnownService(service)) return { status: "unavailable" };

  const profile = { ...activityProfiles[service] };
  if (service === "duolingo") {
    profile.username = process.env.DUOLINGO_USERNAME?.trim() || profile.username;
  }
  if (service !== "league" && !profile.username) return { status: "not_connected" };

  try {
    // Cache only validated successes. Each service updates independently every 15 minutes.
    const read = unstable_cache(
      async () => ({
        ...(await providers[service](profile)),
        fetchedAt: new Date().toISOString(),
        status: "ready",
      }),
      [
        "activity-v1",
        service,
        JSON.stringify(profile),
        process.env.RIOT_API_KEY ? "riot" : "public",
      ],
      { revalidate: 900 }
    );
    return await read();
  } catch {
    // Provider bodies and credentials must never reach the public response.
    return { status: "unavailable", message: "Stats are taking a break. Check back soon." };
  }
}
