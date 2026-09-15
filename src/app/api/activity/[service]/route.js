import { getActivity, isKnownService } from "@/lib/getActivity.mjs";

export const dynamic = "force-dynamic";

/**
 * Thin wrapper around the shared fetcher. The About page calls `getActivity` directly during
 * server rendering; this route remains for the client's retry button and any later refresh.
 */
export async function GET(_request, { params }) {
  const { service } = await params;
  if (!isKnownService(service)) {
    return Response.json({ error: "Unknown service" }, { status: 404 });
  }

  const data = await getActivity(service);
  const status = data.status === "unavailable" && data.message ? 503 : 200;
  return Response.json(data, { status });
}
