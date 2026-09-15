const TIERS = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];

function count(value) {
  if (!Number.isInteger(value) || value < 0) throw new Error("Invalid upstream count");
  return value;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Activity provider returned ${response.status}`);
  return response.json();
}

export function normalizeLeetcode(json) {
  if (json.errors?.length || !json.data?.matchedUser) throw new Error("LeetCode profile unavailable");
  const { matchedUser, allQuestionsCount, userProfileUserQuestionProgressV2 } = json.data;
  const difficulties = ["Easy", "Medium", "Hard"].map((difficulty) => ({
    difficulty,
    solved: count(matchedUser.submitStatsGlobal?.acSubmissionNum?.find((item) => item.difficulty === difficulty)?.count),
    total: count(allQuestionsCount?.find((item) => item.difficulty === difficulty)?.count),
  }));
  return {
    username: matchedUser.username,
    solved: difficulties.reduce((sum, item) => sum + item.solved, 0),
    total: difficulties.reduce((sum, item) => sum + item.total, 0),
    attempting: Array.isArray(userProfileUserQuestionProgressV2?.numFailedQuestions)
      ? userProfileUserQuestionProgressV2.numFailedQuestions.reduce((sum, item) => sum + count(item.count), 0)
      : null,
    difficulties,
  };
}

export async function fetchLeetcode(profile) {
  const json = await fetchJson("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com", "User-Agent": "Mozilla/5.0" },
    body: JSON.stringify({
      query: `query ActivityStats($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) { username submitStatsGlobal { acSubmissionNum { difficulty count } } }
        userProfileUserQuestionProgressV2(userSlug: $username) { numFailedQuestions { difficulty count } }
      }`,
      variables: { username: profile.username },
    }),
  });
  return { ...normalizeLeetcode(json), source: "LeetCode", profileUrl: `https://leetcode.com/u/${encodeURIComponent(profile.username)}/` };
}

export function normalizeDuolingo(json, username) {
  const user = json.users?.find((item) => item.username?.toLowerCase() === username.toLowerCase());
  if (!user) throw new Error("Duolingo profile unavailable");
  // A missing streak is unavailable, never an invented zero-day streak.
  return { username: user.username, streak: count(user.streak ?? user.streakData?.currentStreak?.length) };
}

export async function fetchDuolingo(profile) {
  const url = new URL("https://www.duolingo.com/2017-06-30/users");
  url.searchParams.set("username", profile.username);
  url.searchParams.set("fields", "users{username,streak,streakData}");
  const json = await fetchJson(url, { headers: { Accept: "application/json" } });
  return { ...normalizeDuolingo(json, profile.username), source: "Duolingo", profileUrl: `https://www.duolingo.com/profile/${encodeURIComponent(profile.username)}` };
}

export function normalizeRank(entry) {
  if (!entry || entry.tier === "UNRANKED" || entry.tier == null) {
    return { ranked: false, tier: null, division: null, lp: null, wins: null, losses: null, winRate: null };
  }
  const tier = entry.tier.toUpperCase();
  if (!TIERS.includes(tier)) throw new Error("Unknown rank tier");
  const wins = count(entry.wins);
  const losses = count(entry.losses);
  let division = String(entry.division);
  if (TIERS.indexOf(tier) < 7) {
    division = ({ 1: "I", 2: "II", 3: "III", 4: "IV" })[division] || division;
    if (!["I", "II", "III", "IV"].includes(division)) throw new Error("Unknown rank division");
  } else division = "";
  return { ranked: true, tier, division, lp: count(entry.lp), wins, losses, winRate: wins + losses ? Math.round(wins / (wins + losses) * 1000) / 10 : null };
}

// OP.GG's public MCP can return JSON or a compact class representation.
// Decode its declared fields as data; never evaluate remote text as JavaScript.
export function decodeOpgg(result) {
  if (!result || result.isError) throw new Error("OP.GG profile unavailable");
  if (result.structuredContent) return result.structuredContent;
  const text = result.content?.find((item) => item.type === "text")?.text;
  if (!text || text.length > 64000) throw new Error("Invalid OP.GG response");
  try { return JSON.parse(text); } catch { /* Compact format follows. */ }
  const classes = new Map();
  const body = text.replace(/^class (\w+): ([^\n]+)\n?/gm, (_, name, fields) => {
    classes.set(name, fields.split(",").map((field) => field.trim()));
    return "";
  }).trim();
  let position = 0;
  const skip = () => { while (/\s/.test(body[position] || "") && position < body.length) position++; };
  const consume = (character) => { skip(); if (body[position++] !== character) throw new Error("Invalid OP.GG format"); };
  function parse(depth = 0) {
    if (depth > 15) throw new Error("Invalid OP.GG nesting");
    skip();
    const rest = body.slice(position);
    const scalar = rest.match(/^("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|null|true|false)/);
    if (scalar) { position += scalar[0].length; return JSON.parse(scalar[0]); }
    let fields;
    let closing;
    if (body[position] === "[") { position++; closing = "]"; }
    else {
      const name = rest.match(/^\w+/)?.[0];
      fields = classes.get(name);
      if (!fields) throw new Error("Unknown OP.GG class");
      position += name.length;
      consume("(");
      closing = ")";
    }
    const values = [];
    skip();
    while (body[position] !== closing) {
      if (values.length) consume(",");
      values.push(parse(depth + 1));
      skip();
    }
    consume(closing);
    if (!fields) return values;
    if (fields.length !== values.length) throw new Error("OP.GG fields changed");
    return Object.fromEntries(fields.map((field, index) => [field, values[index]]));
  }
  const data = parse();
  skip();
  if (position !== body.length) throw new Error("Unexpected OP.GG content");
  return data;
}

export function normalizeOpgg(json, profile) {
  const summoner = json.data?.summoner;
  if (!summoner || summoner.game_name !== profile.gameName || summoner.tagline?.toLowerCase() !== profile.tagLine.toLowerCase() || !Array.isArray(summoner.league_stats)) {
    throw new Error("OP.GG profile did not match");
  }
  const solo = summoner.league_stats.find((entry) => entry.game_type === "SOLORANKED");
  return {
    ...normalizeRank(solo ? { tier: solo.tier_info?.tier, division: solo.tier_info?.division, lp: solo.tier_info?.lp, wins: solo.win, losses: solo.lose } : null),
    sourceUpdatedAt: summoner.updated_at || null,
  };
}

async function fetchOpgg(profile) {
  const json = await fetchJson("https://mcp-api.op.gg/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: {
      name: "lol_get_summoner_profile",
      arguments: {
        game_name: profile.gameName, tag_line: profile.tagLine, region: profile.region,
        desired_output_fields: ["data.summoner.{game_name,tagline,updated_at}", "data.summoner.league_stats[].{game_type,win,lose,updated_at}", "data.summoner.league_stats[].tier_info.{tier,division,lp}"],
      },
    } }),
  });
  if (json.error) throw new Error("OP.GG request failed");
  return { ...normalizeOpgg(decodeOpgg(json.result), profile), source: "OP.GG" };
}

async function fetchRiot(profile, apiKey) {
  const regions = { na1: "americas", br1: "americas", la1: "americas", la2: "americas", kr: "asia", jp1: "asia", euw1: "europe", eun1: "europe", tr1: "europe", ru: "europe", me1: "europe", oc1: "sea", sg2: "sea", tw2: "sea", vn2: "sea" };
  const region = regions[profile.platform];
  if (!region) throw new Error("Unsupported Riot platform");
  const options = { headers: { "X-Riot-Token": apiKey } };
  const account = await fetchJson(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(profile.gameName)}/${encodeURIComponent(profile.tagLine)}`, options);
  if (!account.puuid) throw new Error("Riot account unavailable");
  const entries = await fetchJson(`https://${profile.platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(account.puuid)}`, options);
  if (!Array.isArray(entries)) throw new Error("Riot ranks unavailable");
  const solo = entries.find((entry) => entry.queueType === "RANKED_SOLO_5x5");
  return { ...normalizeRank(solo ? { tier: solo.tier, division: solo.rank, lp: solo.leaguePoints, wins: solo.wins, losses: solo.losses } : null), source: "Riot Games" };
}

export async function fetchLeague(profile) {
  let data;
  if (process.env.RIOT_API_KEY) {
    try { data = await fetchRiot(profile, process.env.RIOT_API_KEY); } catch { /* Public provider also covers expired development keys. */ }
  }
  data ||= await fetchOpgg(profile);
  return { ...data, username: `${profile.gameName}#${profile.tagLine}`, region: profile.region, profileUrl: `https://op.gg/lol/summoners/${profile.region.toLowerCase()}/${encodeURIComponent(`${profile.gameName}-${profile.tagLine}`)}` };
}
