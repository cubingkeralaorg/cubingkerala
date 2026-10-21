// Astro PUBLIC_* build-time var (see astro-app/.env.example) — same pattern
// as config/social.ts's WHATSAPP_GROUP_URL. Falls back to the real r2.dev
// public URL for the `cubingkerala-media` bucket so dev works with no .env
// file present. Still in use for production traffic right now — worth
// pointing at a real custom subdomain instead (e.g. media.cubingkerala.com)
// at some point, since r2.dev isn't meant for production traffic long-term
// (Cloudflare rate-limits it).
const MEDIA_BASE_URL =
  import.meta.env.PUBLIC_MEDIA_BASE_URL || "https://pub-f5a49e330f2443ed88ce6e6675c39d6c.r2.dev";

/** Builds a full R2 media URL from a path like "images/misc/after-comp.jpg". */
export function mediaUrl(path: string): string {
  return `${MEDIA_BASE_URL}/${path}`;
}
