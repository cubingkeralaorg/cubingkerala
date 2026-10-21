import { useCallback, useEffect, useState } from "react";

/**
 * Stand-in for the real WCA OAuth flow (Phase 3) — there's no `/login` page
 * or backend session yet, so this just mimics "logged in" with a single
 * hardcoded mock identity (always the admin, since that's the only role
 * this UI-only phase needs to demo) persisted in localStorage so it
 * survives full page navigations between Astro islands.
 */
const STORAGE_KEY = "ck_mock_auth";
const AUTH_CHANGE_EVENT = "ck-mock-auth-change";

export const MOCK_ADMIN_USER = {
  wcaid: "2020ROHI03",
  name: "Rohit Menon",
};

function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useMockAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(readStoredAuth());

    const sync = () => setIsLoggedIn(readStoredAuth());
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable (private browsing etc.) — state still
      // updates for this tab, just won't persist across reloads.
    }
    setIsLoggedIn(true);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // see above
    }
    setIsLoggedIn(false);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  // The mock identity is always the admin — no non-admin logged-in state
  // to model for a UI-only phase.
  return { isLoggedIn, isAdmin: isLoggedIn, login, logout, user: MOCK_ADMIN_USER };
}
