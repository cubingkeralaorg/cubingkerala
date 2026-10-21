// PUBLIC_* is Astro/Vite's own build-time env convention (import.meta.env),
// separate from the Cloudflare Worker secrets/bindings read via
// `cloudflare:workers` elsewhere in this project — this value isn't a
// secret and isn't a binding, just a value that can change without a code
// change. Falls back to the current real group link so dev works with no
// .env file present.
export const WHATSAPP_GROUP_URL =
  import.meta.env.PUBLIC_WHATSAPP_CONTACT_URL || "https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS";
export const INSTAGRAM_URL = "https://www.instagram.com/cubingkerala";
export const FACEBOOK_URL = "https://www.facebook.com/cubingkeralaofficial";
export const GITHUB_URL = "https://github.com/cubingkeralaorg/cubingkerala";

export const SOCIAL_LINKS = [
  { id: "whatsapp", name: "WhatsApp", href: WHATSAPP_GROUP_URL },
  { id: "instagram", name: "Instagram", href: INSTAGRAM_URL },
  { id: "facebook", name: "Facebook", href: FACEBOOK_URL },
] as const;
