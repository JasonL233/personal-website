export const THEME_STORAGE_KEY = "maple-theme";
export const NIGHT_START = 19;
export const DAY_START = 7;

export function themePreference(value) {
  return value === "light" || value === "dark" ? value : "auto";
}

// Date#getHours deliberately uses the visitor's timezone, including DST.
export function resolveTheme(preference, date = new Date()) {
  if (preference === "light" || preference === "dark") return preference;
  const hour = date.getHours();
  return hour >= NIGHT_START || hour < DAY_START ? "dark" : "light";
}

// Runs before the page paints; the provider takes over after hydration.
export const themeBootstrap = `(()=>{let p="auto";try{p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch{}const h=new Date().getHours();const t=p==="dark"||p==="light"?p:h>=${NIGHT_START}||h<${DAY_START}?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()`;
