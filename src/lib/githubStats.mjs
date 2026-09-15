const GITHUB_API = "https://api.github.com";
const GITHUB_CONTRIBUTIONS = "https://github.com/users";

export const DEFAULT_USERNAME = "JasonL233";

/** GitHub username: alphanumeric and hyphens, 1-39 chars (simplified). */
export function isValidGitHubLogin(login) {
  if (!login || typeof login !== "string") return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(login.trim());
}

/**
 * GITHUB_TOKEN is entirely optional - nothing here requires auth. When present it only
 * raises the REST rate limit (60/hr unauthenticated -> 5000/hr), which is a nice cushion but
 * unnecessary given responses are cached for an hour.
 */
function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "personal-website",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchUser(username) {
  const res = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, {
    headers: githubHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { ok: false, status: res.status };
  return { ok: true, data: await res.json() };
}

/** GitHub has no single "total stars" field, so sum stargazers_count across all public repos. */
async function sumPublicRepoStars(username) {
  const headers = githubHeaders();
  let total = 0;
  let page = 1;
  const perPage = 100;
  const maxPages = 15;

  while (page <= maxPages) {
    const url = new URL(`${GITHUB_API}/users/${encodeURIComponent(username)}/repos`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) break;

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) break;

    for (const r of repos) total += Number(r.stargazers_count) || 0;

    if (repos.length < perPage) break;
    page += 1;
  }

  return total;
}

/**
 * The day-by-day contribution calendar for one year, read from the same endpoint that
 * renders the calendar on github.com/<user>. Deliberately NOT the GraphQL API: GraphQL
 * only counts contributions the *token* can see, so private-repo work is missing from it
 * even when the profile is set to show private contributions publicly. This endpoint
 * returns exactly what a visitor sees on the profile, and needs no token at all.
 *
 * The tradeoff: it's an undocumented endpoint returning HTML, so GitHub could change the
 * markup. Parse failures return null, and the caller degrades to `calendarAvailable: false`
 * rather than breaking the card.
 */
async function fetchContributionsForYear(username, year) {
  const url = `${GITHUB_CONTRIBUTIONS}/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`;

  const res = await fetch(url, {
    headers: { "User-Agent": "personal-website", Accept: "text/html" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const html = await res.text();

  // Each day's exact count lives in a <tool-tip> keyed to that day cell's id; the cell
  // itself only carries a 0-4 colour level, which is too coarse for the hover text.
  const counts = new Map();
  for (const m of html.matchAll(
    /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g
  )) {
    counts.set(m[1], /^No contributions/i.test(m[2]) ? 0 : parseInt(m[2], 10) || 0);
  }

  // The id encodes grid position: contribution-day-component-<weekday>-<week>.
  const byWeek = new Map();
  let total = 0;
  for (const m of html.matchAll(
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-(\d+)-(\d+))"/g
  )) {
    const [, date, id, weekdayRaw, weekRaw] = m;
    const contributionCount = counts.get(id) ?? 0;
    total += contributionCount;

    const week = Number(weekRaw);
    if (!byWeek.has(week)) byWeek.set(week, []);
    byWeek.get(week).push({ date, contributionCount, weekday: Number(weekdayRaw) });
  }

  if (byWeek.size === 0) return null; // markup changed - let the caller fall back

  const weeks = [...byWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, days]) => ({ contributionDays: days.sort((a, b) => a.weekday - b.weekday) }));

  return { totalContributions: total, weeks };
}

/** Years to offer in the picker: account creation year through the current year. */
function contributionYears(createdAt) {
  const currentYear = new Date().getUTCFullYear();
  const startYear = createdAt ? new Date(createdAt).getUTCFullYear() : currentYear;
  const years = [];
  for (let y = currentYear; y >= startYear; y -= 1) years.push(y);
  return years;
}

/** Clamp an arbitrary `year` input to something sane, defaulting to the current year. */
export function resolveYear(input) {
  const currentYear = new Date().getUTCFullYear();
  const requested = parseInt(input, 10);
  return Number.isInteger(requested) && requested >= 2005 && requested <= currentYear
    ? requested
    : currentYear;
}

/**
 * Shared by the API route (for the client's year-switching) and by the About page itself,
 * which calls this directly during server rendering so the card's first paint already has
 * real numbers instead of a loading state.
 */
export async function getGithubStats(username = DEFAULT_USERNAME, yearInput) {
  const year = resolveYear(yearInput);

  const userResult = await fetchUser(username);
  if (!userResult.ok) return { ok: false, status: userResult.status };

  const u = userResult.data;

  const [totalStars, calendar] = await Promise.all([
    sumPublicRepoStars(username),
    fetchContributionsForYear(username, year),
  ]);

  return {
    ok: true,
    data: {
      login: u.login,
      name: u.name,
      avatarUrl: u.avatar_url,
      htmlUrl: u.html_url,
      bio: u.bio,
      followers: u.followers,
      following: u.following,
      publicRepos: u.public_repos,
      totalStars,
      year,
      calendarAvailable: Boolean(calendar),
      contributionYears: calendar ? contributionYears(u.created_at) : null,
      contributionsInYear: calendar?.totalContributions ?? null,
      weeks: calendar?.weeks ?? null,
    },
  };
}
