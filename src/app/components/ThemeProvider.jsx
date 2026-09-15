"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { resolveTheme, themePreference, THEME_STORAGE_KEY } from "../../lib/theme.mjs";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState("auto");
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved = "auto";
    try { saved = themePreference(localStorage.getItem(THEME_STORAGE_KEY)); } catch { /* Storage may be disabled. */ }
    setPreference(saved);
    setTheme(resolveTheme(saved));
    setReady(true);
    const sync = event => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) setPreference(themePreference(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let timer;
    const update = () => {
      clearTimeout(timer);
      const next = resolveTheme(preference);
      setTheme(next);
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      // Align with the next minute and recheck after sleep or timezone changes.
      if (preference === "auto") timer = setTimeout(update, 60000 - Date.now() % 60000);
    };
    update();
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [preference, ready]);

  function choose(value) {
    const next = themePreference(value);
    setPreference(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Still works for this visit. */ }
  }

  return <ThemeContext.Provider value={{ theme, preference, choose, ready }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
