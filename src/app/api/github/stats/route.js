import { getGithubStats, isValidGitHubLogin, DEFAULT_USERNAME } from "@/lib/githubStats.mjs";

export const revalidate = 3600;

/**
 * Thin wrapper around the shared fetcher. The About page calls `getGithubStats` directly
 * during server rendering; this route exists for the client-side year switching, which
 * still needs an HTTP endpoint to hit after the page has loaded.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || DEFAULT_USERNAME).trim();

  if (!isValidGitHubLogin(username)) {
    return Response.json({ error: "Invalid GitHub username." }, { status: 400 });
  }

  const result = await getGithubStats(username, searchParams.get("year"));

  if (!result.ok) {
    return Response.json(
      {
        error: "GitHub user not found or API error.",
        details: result.status === 403 ? "Rate limited by GitHub. Try again shortly." : undefined,
      },
      { status: result.status === 404 ? 404 : 502 }
    );
  }

  return Response.json(result.data);
}
