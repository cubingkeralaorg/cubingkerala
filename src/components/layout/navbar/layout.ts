/** Shared shell classes — keep navbar and mobile menu headers aligned below `lg`. */
export const NAVBAR_CONTAINER_CLASS = "container mx-auto px-4 sm:px-6 lg:px-8";

export const NAVBAR_ROW_CLASS = "flex h-16 items-center justify-between";

/** Spacing between wordmark and the nav link group. */
export const NAVBAR_BRAND_GAP_CLASS = "gap-6";

/** Spacing between individual navbar links. */
export const NAVBAR_LINKS_GAP_CLASS = "gap-2";

export const NAVBAR_LOGO_LINK_CLASS =
  "text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground";

/** Text links — muted with accent background on hover. */
export const NAVBAR_LINK_CLASS =
  "inline-flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

/** Icon controls (GitHub, theme) — same hover as text links. */
export const NAVBAR_ICON_BUTTON_CLASS =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";
