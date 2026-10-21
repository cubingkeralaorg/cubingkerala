// Astro PUBLIC_* build-time var (see astro-app/.env.example) — same pattern
// as config/social.ts's WHATSAPP_GROUP_URL. Falls back to the real r2.dev
// public URL for the `cubingkerala-media` bucket so dev works with no .env
// file present. At Phase 10 cutover this should point at a real custom
// subdomain (e.g. media.cubingkerala.org) instead — r2.dev is fine for now
// but isn't meant for production traffic (Cloudflare rate-limits it).
const MEDIA_BASE_URL =
  import.meta.env.PUBLIC_MEDIA_BASE_URL || "https://pub-f5a49e330f2443ed88ce6e6675c39d6c.r2.dev";

/** Builds a full R2 media URL from a path like "images/misc/after-comp.jpg". */
export function mediaUrl(path: string): string {
  return `${MEDIA_BASE_URL}/${path}`;
}
