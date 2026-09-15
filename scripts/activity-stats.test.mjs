import test from "node:test";
import assert from "node:assert/strict";
import { decodeOpgg, normalizeOpgg, normalizeRank, normalizeDuolingo, normalizeLeetcode, fetchLeague } from "../src/lib/activityStats.mjs";

const profile = { gameName: "枫zz", tagLine: "OwO", platform: "na1", region: "NA" };
const compact = `class Response: data
class Data: summoner
class Summoner: game_name,tagline,updated_at,league_stats
class LeagueStat: game_type,tier_info,win,lose,updated_at
class TierInfo: tier,division,lp

Response(Data(Summoner("枫zz","OwO","2026-09-13T12:00:00Z",[LeagueStat("FLEXRANKED",TierInfo("EMERALD",3,47),52,38,null),LeagueStat("SOLORANKED",TierInfo("DIAMOND",1,50),141,94,null)])))`;
const mcp = { content: [{ type: "text", text: compact }] };

test("OP.GG compact data yields Solo/Duo, never Flex, and computes win rate", () => {
  const result = normalizeOpgg(decodeOpgg(mcp), profile);
  assert.equal(result.tier, "DIAMOND");
  assert.equal(result.division, "I");
  assert.equal(result.lp, 50);
  assert.equal(result.winRate, 60);
  assert.equal(result.wins, 141);
});

test("OP.GG also accepts JSON and rejects mismatched accounts and remote code", () => {
  const json = decodeOpgg(mcp);
  assert.deepEqual(decodeOpgg({ content: [{ type: "text", text: JSON.stringify(json) }] }), json);
  assert.throws(() => normalizeOpgg(json, { ...profile, tagLine: "NA1" }));
  assert.throws(() => decodeOpgg({ content: [{ type: "text", text: compact + "; process.exit()" }] }));
  assert.throws(() => decodeOpgg({ isError: true, content: mcp.content }));
  assert.throws(() => decodeOpgg({ content: [{ type: "text", text: compact.replace("TierInfo: tier,division,lp", "TierInfo: tier,lp") }] }));
});

test("Unranked and zero games never invent a 0% win rate", () => {
  assert.equal(normalizeRank(null).ranked, false);
  assert.equal(normalizeRank(null).winRate, null);
  assert.equal(normalizeRank({ tier: "GOLD", division: "IV", lp: 0, wins: 0, losses: 0 }).winRate, null);
  assert.equal(normalizeRank({ tier: "MASTER", division: "I", lp: 50, wins: 10, losses: 9 }).division, "");
  assert.throws(() => normalizeRank({ tier: "GOLD", division: "IV", lp: 0, wins: -1, losses: 3 }));
});

test("Duolingo distinguishes a real zero-day streak from missing/private data", () => {
  assert.equal(normalizeDuolingo({ users: [{ username: "test", streak: 0 }] }, "test").streak, 0);
  assert.equal(normalizeDuolingo({ users: [{ username: "test", streakData: { currentStreak: { length: 42 } } }] }, "test").streak, 42);
  assert.throws(() => normalizeDuolingo({ users: [{ username: "test" }] }, "test"));
  assert.throws(() => normalizeDuolingo({ users: [{ username: "different", streak: 12 }] }, "test"));
});

test("LeetCode validates per-difficulty data and sums failed questions", () => {
  const data = { allQuestionsCount: ["Easy", "Medium", "Hard"].map((difficulty) => ({ difficulty, count: 100 })), matchedUser: { username: "test", submitStatsGlobal: { acSubmissionNum: ["Easy", "Medium", "Hard"].map((difficulty, i) => ({ difficulty, count: i + 1 })) } }, userProfileUserQuestionProgressV2: { numFailedQuestions: [{ count: 1 }, { count: 2 }] } };
  assert.equal(normalizeLeetcode({ data }).solved, 6);
  assert.equal(normalizeLeetcode({ data }).attempting, 3);
  assert.throws(() => normalizeLeetcode({ data: { ...data, matchedUser: null } }));
  assert.throws(() => normalizeLeetcode({ data, errors: [{ message: "Not available" }] }));
  data.matchedUser.submitStatsGlobal.acSubmissionNum.pop();
  assert.throws(() => normalizeLeetcode({ data }));
});

test("Riot uses server-side headers and only the Solo/Duo entry; expired keys fall back", async (t) => {
  const previousKey = process.env.RIOT_API_KEY;
  process.env.RIOT_API_KEY = "test-key";
  t.after(() => { if (previousKey === undefined) delete process.env.RIOT_API_KEY; else process.env.RIOT_API_KEY = previousKey; });
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push([url, options]);
    return Response.json(url.includes("accounts/by-riot-id") ? { puuid: "test-puuid" } : [
      { queueType: "RANKED_FLEX_SR", tier: "GOLD", rank: "III", leaguePoints: 10, wins: 1, losses: 9 },
      { queueType: "RANKED_SOLO_5x5", tier: "DIAMOND", rank: "I", leaguePoints: 50, wins: 141, losses: 94 },
    ]);
  });
  const result = await fetchLeague(profile);
  assert.equal(result.source, "Riot Games");
  assert.equal(result.winRate, 60);
  assert.ok(calls[0][0].includes("americas.api.riotgames.com"));
  assert.ok(calls[1][0].includes("na1.api.riotgames.com/lol/league/v4/entries/by-puuid/"));
  assert.equal(calls[0][1].headers["X-Riot-Token"], "test-key");
  assert.ok(!calls[0][0].includes("test-key"));
  globalThis.fetch.mock.mockImplementation(async (url) => url.includes("riotgames.com") ? new Response("", { status: 403 }) : Response.json({ result: mcp }));
  assert.equal((await fetchLeague(profile)).source, "OP.GG");
});
