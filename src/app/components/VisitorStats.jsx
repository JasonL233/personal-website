"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import styles from "./VisitorStats.module.css";

const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes - matches the API's per-IP window

function formatInt(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

const VisitorStats = () => {
  const [status, setStatus] = useState("loading"); // loading | success | unconfigured | error
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch("/api/visitors", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("bad response");
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          if (data?.configured === false) {
            setStatus("unconfigured");
            return;
          }
          const n = Number(data?.count);
          if (Number.isNaN(n)) {
            setStatus("error");
            return;
          }
          setCount(n);
          setStatus("success");
        })
        .catch(() => {
          if (!cancelled) setStatus("error");
        });
    };

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.badge} role="status" aria-label={status === "success" ? `${formatInt(count)} total visitors` : "Visitor count unavailable"}>
      <span className={styles.iconFrame}><EyeIcon className={styles.icon} aria-hidden="true" /></span>
      <span className={styles.details}>
        <span className={styles.label}>Total visitors</span>
        <span className={styles.count}>{status === "success" ? formatInt(count) : "—"}</span>
      </span>
    </div>
  );
};

export default VisitorStats;
