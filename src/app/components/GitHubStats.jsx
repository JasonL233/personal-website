"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  StarIcon,
  FolderOpenIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { SiGithub } from "react-icons/si";

const USERNAME = "JasonL233";
const MIN_CELL = 6; // px, floor for how small a cell is allowed to shrink on narrow screens
const DEFAULT_CELL = 14; // px, first-paint guess before the container is measured
const GAP = 2; // px, gap between cells
const LABEL_WIDTH = 26; // px, width reserved for the Sun..Sat weekday column
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Warm rust/tan ramp so the grid matches the site instead of GitHub's green. */
const LEVEL_COLORS = ["var(--contribution-0)", "var(--contribution-1)", "var(--contribution-2)", "var(--contribution-3)", "var(--contribution-4)"];

function levelForCount(count) {
  if (!count) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatInt(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

const statTiles = [
  { key: "totalStars", label: "Stars", Icon: StarIcon, color: "#c9852a" },
  { key: "publicRepos", label: "Repos", Icon: FolderOpenIcon, color: "#3b7a95" },
  { key: "followers", label: "Followers", Icon: UserGroupIcon, color: "#7c5cad" },
  { key: "following", label: "Following", Icon: UserPlusIcon, color: "#6b7280" },
];

/** Renders one year's day-by-day calendar from GitHub's GraphQL `weeks` shape. */
function ContributionGrid({ weeks }) {
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL);

  // Cells must be square AND fully stretch to fill the container's width (no leftover gap,
  // no scrollbar). Since that width is only known once laid out (and changes on resize),
  // measure it and derive one square size that exactly fits all `weeks.length` columns —
  // no upper cap, and no rounding down, so the grid always reaches the right edge exactly.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recompute = () => {
      const width = el.clientWidth;
      if (!width) return;
      const raw = (width - GAP * (weeks.length - 1)) / weeks.length;
      setCellSize(Math.max(MIN_CELL, raw));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [weeks.length]);

  const monthLabels = [];
  let prevMonth = null;
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();
    if (month !== prevMonth) {
      monthLabels.push({ index: i, label: MONTH_LABELS[month] });
      prevMonth = month;
    }
  });

  return (
    <div className="w-full">
      {/* Month labels, offset by the weekday-label column so they line up with the grid below. */}
      <div className="flex gap-1.5">
        <div style={{ width: LABEL_WIDTH }} aria-hidden />
        <div
          className="grid mb-1 flex-1 min-w-0"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`, columnGap: GAP }}
        >
          {monthLabels.map((m) => (
            <span
              key={m.index}
              style={{ gridColumnStart: m.index + 1 }}
              className="text-[10px] text-[var(--muted)] leading-none"
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5">
        {/* Every weekday, sized with the exact same row template as the day grid so they line up. */}
        <div
          className="grid shrink-0"
          style={{ gridTemplateRows: `repeat(7, ${cellSize}px)`, rowGap: GAP, width: LABEL_WIDTH }}
        >
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="text-[9px] text-[var(--muted)] leading-none flex items-center">
              {label}
            </span>
          ))}
        </div>

        {/* Measured square cells: width comes from the container's actual rendered width, height matches it exactly. */}
        <div
          ref={containerRef}
          className="grid grid-flow-col flex-1 min-w-0"
          style={{
            gridTemplateRows: `repeat(7, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
            gap: GAP,
          }}
        >
          {weeks.map((week, wi) =>
            Array.from({ length: 7 }).map((_, weekday) => {
              const day = week.contributionDays.find((d) => d.weekday === weekday);
              return (
                <div
                  key={`${wi}-${weekday}`}
                  title={day ? `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${day.date}` : undefined}
                  className="rounded-[2px]"
                  style={{
                    background: day ? LEVEL_COLORS[levelForCount(day.contributionCount)] : "transparent",
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

async function fetchStats(year) {
  const res = await fetch(`/api/github/stats?username=${USERNAME}&year=${year}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/**
 * `initialData` comes from the About page's server render, so the card paints with real
 * numbers immediately instead of flashing a loading state while the browser fetches. The
 * client fetch below only runs when the server didn't manage to supply it (e.g. GitHub was
 * unreachable at render time), so a failure there degrades to the old behaviour rather than
 * leaving the card empty.
 */
const GitHubStats = ({ initialData = null }) => {
  const [year, setYear] = useState(() => initialData?.year ?? new Date().getFullYear());
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useRef(false);

  // Only needed as a fallback: with server-provided data there's nothing to fetch on mount.
  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    fetchStats(year)
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load GitHub stats.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Year changes: only the contribution grid should show a loading state, not the whole card.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    let cancelled = false;
    setCalendarLoading(true);
    fetchStats(year)
      .then((json) => {
        if (!cancelled) setData((prev) => ({ ...prev, ...json }));
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load GitHub stats.");
      })
      .finally(() => {
        if (!cancelled) setCalendarLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year]);

  const displayName = data?.name || data?.login || USERNAME;

  return (
    <section className="mt-14 sm:mt-20">
      <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-serif tracking-tight text-[var(--foreground)] mb-6">
        <span
          className="grid place-items-center h-10 w-10 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
          aria-hidden
        >
          <SiGithub className="h-5 w-5" />
        </span>
        GitHub
      </h2>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        {loading && (
          <p className="p-6 text-sm text-[var(--muted)]" role="status">
            Loading GitHub profile…
          </p>
        )}

        {!loading && error && (
          <p className="p-6 text-sm text-[var(--accent)]" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && data && (
          <div className="p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 sm:items-start">
              <div className="shrink-0 flex justify-center sm:justify-start">
                <div className="relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden ring-2 ring-[var(--border)]">
                  <Image
                    src={data.avatarUrl}
                    alt={`${displayName} avatar`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-[var(--foreground)] truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-[var(--muted)]">@{data.login}</p>
                  </div>
                  <a
                    href={data.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)] underline underline-offset-4 shrink-0"
                  >
                    View on GitHub
                    <span aria-hidden>↗</span>
                  </a>
                </div>

                {data.bio ? (
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{data.bio}</p>
                ) : null}

                <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {statTiles.map(({ key, label, Icon, color }) => (
                    <div
                      key={key}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-center sm:text-left"
                    >
                      <dt className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                        <Icon className="h-4 w-4" style={{ color }} aria-hidden />
                        {label}
                      </dt>
                      <dd className="mt-1 text-xl font-bold tabular-nums text-[var(--foreground)]">
                        {formatInt(data[key])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-sm text-[var(--muted)]">
                  {data.calendarAvailable ? (
                    <>
                      <span className="font-medium text-[var(--foreground)]">
                        {formatInt(data.contributionsInYear)}
                      </span>{" "}
                      contributions in {data.year}
                    </>
                  ) : (
                    <span className="font-semibold text-[var(--foreground)]">Contribution activity</span>
                  )}
                </p>

                {data.calendarAvailable && data.contributionYears?.length > 0 && (
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    disabled={calendarLoading}
                    className="text-sm rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[var(--foreground)] disabled:opacity-60"
                    aria-label="Select contribution year"
                  >
                    {data.contributionYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {data.calendarAvailable && data.weeks ? (
                <div
                  className={calendarLoading ? "opacity-40 transition-opacity" : "transition-opacity"}
                  aria-busy={calendarLoading}
                >
                  <ContributionGrid weeks={data.weeks} />
                </div>
              ) : (
                <>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    Couldn&apos;t read the contribution calendar from GitHub just now — showing a
                    rolling 12-month graph instead.
                  </p>
                  <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--background)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://ghchart.rshah.org/885a35/${data.login}`}
                      alt={`${data.login} GitHub contribution graph`}
                      className="w-full h-auto max-h-[140px] sm:max-h-[160px] object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubStats;
