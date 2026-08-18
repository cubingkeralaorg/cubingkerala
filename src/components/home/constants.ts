export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS";

export const INSTAGRAM_URL = "https://www.instagram.com/cubingkerala";
export const FACEBOOK_URL = "https://www.facebook.com/cubingkeralaofficial";

export const SOCIAL_LINKS = [
  { id: "whatsapp", name: "WhatsApp", href: WHATSAPP_GROUP_URL },
  { id: "instagram", name: "Instagram", href: INSTAGRAM_URL },
  { id: "facebook", name: "Facebook", href: FACEBOOK_URL },
] as const;

/** One full viewport per landing section (below the navbar). */
export const LANDING_VIEWPORT_SECTION_CLASS =
  "flex min-h-[calc(100dvh-4rem)] flex-col justify-center";

/** Gap between the hero title row and destination cards. */
export const HERO_BLOCK_GAP_CLASS = "gap-12 lg:gap-16";

/** Gap between the unravel grid and contact card. */
export const UNRAVEL_BLOCK_GAP_CLASS = "gap-10 lg:gap-14";

/** Inner vertical padding inside each viewport section. */
export const LANDING_SECTION_INNER_PY_CLASS = "py-8 lg:py-10";
