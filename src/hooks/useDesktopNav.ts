"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind `lg` — keep in sync with navbar desktop/mobile split. */
export const DESKTOP_NAV_MEDIA_QUERY = "(min-width: 1024px)";

export function useDesktopNav() {
  const [isDesktopNav, setIsDesktopNav] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_NAV_MEDIA_QUERY);
    const sync = () => setIsDesktopNav(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return isDesktopNav;
}
