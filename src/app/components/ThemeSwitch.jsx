"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeProvider";
import styles from "./ThemeSwitch.module.css";

export default function ThemeSwitch() {
  const { theme, preference, choose, ready } = useTheme();
  const dark = theme === "dark";
  return (
    <div className={styles.control} role="group" aria-label="Appearance">
      <button type="button" className={styles.toggle} role="switch" aria-label="Night mode" aria-checked={dark}
        disabled={!ready} onClick={() => choose(dark ? "light" : "dark")}
        title={`Switch to ${dark ? "day" : "night"} mode`}>
        <SunIcon className={styles.sun} aria-hidden="true" />
        <MoonIcon className={styles.moon} aria-hidden="true" />
        <span className={styles.thumb} />
      </button>
      <button type="button" className={styles.auto} aria-label="Use automatic day and night mode" aria-pressed={preference === "auto"}
        disabled={!ready} onClick={() => choose("auto")} title="Follow your local time · Night 7 p.m.–7 a.m.">Auto</button>
    </div>
  );
}
