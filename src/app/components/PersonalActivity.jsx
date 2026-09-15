"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SiLeetcode, SiDuolingo, SiLeagueoflegends } from "react-icons/si";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { activityProfiles } from "@/data/activityProfiles";
import styles from "./PersonalActivity.module.css";

const DuoOwl = dynamic(() => import("./DuoOwl"), { ssr: false, loading: () => <div className={styles.owlStage} /> });
const number = (value) => typeof value === "number" ? value.toLocaleString("en-US") : "—";
const colors = { Easy: "#16aaa9", Medium: "#efa900", Hard: "#ef585d" };

/**
 * `initial` is supplied by the About page's server render, so a card paints real numbers on
 * first paint instead of "Fetching the latest stats…". The fetch below then only runs when
 * the server had nothing to give (or when the visitor hits Retry), which keeps the old
 * client-fetch path intact as a fallback.
 */
function useActivity(service, initial) {
  const [result, setResult] = useState(initial ?? { status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (initial && attempt === 0) return;
    const controller = new AbortController();
    setResult({ status: "loading" });
    fetch(`/api/activity/${service}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error("Unavailable");
        if (!controller.signal.aborted) setResult(data);
      })
      .catch(() => { if (!controller.signal.aborted) setResult({ status: "unavailable" }); });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, attempt]);
  return [result, () => setAttempt((previous) => previous + 1)];
}

function Source({ data, retry, fallback }) {
  return <div className={styles.source} aria-live="polite">
    {data.status === "loading" ? <span>Fetching the latest stats…</span>
      : data.status === "unavailable" ? <><span>Stats temporarily unavailable</span><button onClick={retry}>Retry ↻</button></>
      : data.status === "not_connected" ? <span>{fallback}</span>
      : <><span title={`Checked ${new Date(data.fetchedAt).toLocaleString()}`}><i />{data.source}{data.sourceUpdatedAt && <> · Updated {new Date(data.sourceUpdatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" })}</>}</span><a href={data.profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${data.source} profile`}>Profile ↗</a></>}
  </div>;
}

function CardHeader({ icon: Icon, title, detail, className }) {
  return <header className={styles.cardHeader}>
    <span className={`${styles.brandIcon} ${className}`}><Icon aria-hidden="true" /></span>
    <div><h3>{title}</h3><p>{detail}</p></div>
  </header>;
}

function arc(start, sweep) {
  const point = (degrees) => {
    const radians = degrees * Math.PI / 180;
    // Stable precision avoids tiny Node/WebKit trig differences during hydration.
    return `${(100 + 85 * Math.cos(radians)).toFixed(3)} ${(100 + 85 * Math.sin(radians)).toFixed(3)}`;
  };
  return `M ${point(start)} A 85 85 0 ${sweep > 180 ? 1 : 0} 1 ${point(start + sweep)}`;
}

function LeetcodeCard({ initial }) {
  const [data, retry] = useActivity("leetcode", initial);
  const available = data.status === "ready";
  const difficulties = data.difficulties || ["Easy", "Medium", "Hard"].map((difficulty) => ({ difficulty }));
  let angle = 135;
  return <article className={`${styles.card} ${styles.leetcodeCard}`} aria-busy={data.status === "loading"}>
    <CardHeader icon={SiLeetcode} title="LeetCode" detail={`@${activityProfiles.leetcode.username}`} className={styles.leetcodeBrand} />
    <div className={styles.leetcodeBody}>
      <div className={styles.ring}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {difficulties.map((item) => {
            const sweep = available && data.total ? item.total / data.total * 254 : 254 / 3;
            const path = arc(angle, sweep);
            angle += sweep + 8;
            return <g key={item.difficulty} stroke={colors[item.difficulty]} strokeWidth="6" fill="none" strokeLinecap="round">
              <path d={path} opacity=".19" />
              {available && item.solved > 0 && <path d={path} pathLength="100" strokeDasharray={`${Math.min(100, item.solved / item.total * 100)} 100`} />}
            </g>;
          })}
        </svg>
        <div className={styles.ringLabel}>
          <div><strong>{number(data.solved)}</strong><span>/{number(data.total)}</span></div>
          <p><span className={styles.solvedCheck}>✓</span> Solved</p>
        </div>
        <p className={styles.attempting}>{data.attempting != null ? `${number(data.attempting)} Attempting` : "Keep solving"}</p>
      </div>
      <dl className={styles.difficulties}>
        {difficulties.map((item) => <div key={item.difficulty}>
          <dt style={{ color: colors[item.difficulty] }}>{item.difficulty === "Medium" ? "Med." : item.difficulty}</dt>
          <dd>{number(item.solved)}<span>/{number(item.total)}</span></dd>
        </div>)}
      </dl>
    </div>
    <Source data={data} retry={retry} />
  </article>;
}

function DuolingoCard({ initial }) {
  const [data, retry] = useActivity("duolingo", initial);
  return <article className={`${styles.card} ${styles.duolingoCard}`} aria-busy={data.status === "loading"}>
    <CardHeader icon={SiDuolingo} title="Duolingo" detail={`@${data.username || activityProfiles.duolingo.username}`} className={styles.duolingoBrand} />
    <DuoOwl />
    <div className={styles.streak}>
      <svg viewBox="0 0 24 30" aria-hidden="true"><path d="M13 0C16 9 23 10 23 18A11 11 0 0 1 1 18C1 12 5 8 8 6C8 11 10 12 11 11C14 8 11 4 13 0Z" fill="currentColor" /><path d="M12 16C12 20 17 20 16 24C15 28 8 28 7 24C6 21 10 20 12 16Z" fill="#ffd26f" /></svg>
      <strong>{number(data.streak)}</strong><span>day streak in Korean</span>
    </div>
    <Source data={data} retry={retry} fallback="Streak coming soon" />
  </article>;
}

function LeagueCard({ initial }) {
  const [data, retry] = useActivity("league", initial);
  const ready = data.status === "ready";
  const tier = data.tier ? data.tier.charAt(0) + data.tier.slice(1).toLowerCase() : "";
  return <article className={`${styles.card} ${styles.leagueCard}`} aria-busy={data.status === "loading"}>
    <CardHeader icon={SiLeagueoflegends} title="League of Legends" detail={`Ranked Solo / Duo · ${activityProfiles.league.region}`} className={styles.leagueBrand} />
    <div className={styles.leagueBody}>
      <div
        className={styles.rankEmblem}
        tabIndex={data.ranked ? 0 : undefined}
        role="img"
        aria-label={data.ranked ? `${tier} ${data.division} rank` : ready ? "Unranked" : "Rank pending"}
      >
        {data.ranked ? <>
          {/* Official Riot rank assets, optimized and served locally. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.rankBadge} src={`/images/ranks/${data.tier.toLowerCase()}.webp`} alt={`${tier} rank emblem`} width="148" height="148" />
        </> : <svg viewBox="0 0 120 130" aria-label={ready ? "Unranked" : "Rank pending"} role="img"><path d="m60 8 39 16v39c0 29-39 56-39 56S21 92 21 63V24Z" fill="#efe8d8" stroke="#b5a385" strokeWidth="2" /><path d="m60 29 22 30-22 30-22-30Z" fill="none" stroke="#b5a385" strokeWidth="2" /><path d="M48 59h24" stroke="#b5a385" strokeWidth="2" /></svg>}
      </div>
      <p className={styles.summoner}>{data.username || `${activityProfiles.league.gameName}#${activityProfiles.league.tagLine}`}</p>
      <p className={styles.rankTitle}>{data.ranked ? <>{tier} {data.division}<span>{number(data.lp)} LP</span></> : ready ? "Unranked" : "Rank pending"}</p>
      <div className={styles.winRate}>
        <p>{data.ranked ? <><span>{number(data.wins)}W</span> / {number(data.losses)}L</> : ready ? "No Solo / Duo rank this season" : "Awaiting ranked stats"}</p>
        {data.ranked && <><span className={styles.statDivider} aria-hidden="true">·</span><p><span>{data.winRate != null ? `${number(data.winRate)}%` : "—"}</span> win rate</p></>}
      </div>
    </div>
    <Source data={data} retry={retry} />
  </article>;
}

export default function PersonalActivity({ initialData = {} }) {
  return <section className={styles.section} aria-labelledby="personal-activity-title">
    <div className={styles.sectionHeading}>
      <h2 id="personal-activity-title">
        <span className={styles.sectionIcon} aria-hidden="true"><SparklesIcon /></span>
        Beyond the code
      </h2>
    </div>
    <div className={styles.grid}><LeetcodeCard initial={initialData.leetcode} /><DuolingoCard initial={initialData.duolingo} /><LeagueCard initial={initialData.league} /></div>
  </section>;
}
