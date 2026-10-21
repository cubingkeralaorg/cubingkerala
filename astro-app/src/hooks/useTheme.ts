import { useCallback, useEffect, useState } from "react";

/**
 * Opt-in dark-mode preview — a manual toggle, not a system-preference
 * auto-switch. Persisted in localStorage; the inline script in Layout.astro
 * applies the stored class before first paint so there's no flash of the
 * wrong theme on load.
 */
const STORAGE_KEY = "ck_theme";

function readStoredTheme(): "light" | "dark" {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  const applyTheme = useCallback((next: "light" | "dark") => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — theme still applies for this load, just
      // won't persist across reloads.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  return { theme, toggleTheme };
}
