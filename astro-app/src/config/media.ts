// Astro PUBLIC_* build-time var (see astro-app/.env.example) — same pattern
// as config/social.ts's WHATSAPP_GROUP_URL. Defaults to the /media/* route
// in src/worker.ts, which streams the `cubingkerala-media` R2 bucket from
// our own domain (HTTP/2+3, real Cache-Control, edge-cached) instead of the
// bucket's r2.dev URL (HTTP/1.1, no caching headers, rate-limited).
const MEDIA_BASE_URL = import.meta.env.PUBLIC_MEDIA_BASE_URL || "/media";

/** Builds a full R2 media URL from a path like "images/misc/after-comp.jpg". */
export function mediaUrl(path: string): string {
  return `${MEDIA_BASE_URL}/${path}`;
}

// Widths the /media route will resize images to (see MEDIA_IMAGE_WIDTHS in
// src/worker.ts — keep the two in sync).
export type MediaImageWidth = 640 | 800;

/**
 * Like mediaUrl(), but asks the /media route for a resized WebP copy of the
 * image (`?w=`). Only applies when serving from our own /media route — an
 * external PUBLIC_MEDIA_BASE_URL (e.g. r2.dev) can't resize, so it just
 * gets the original.
 */
export function mediaImageUrl(path: string, width: MediaImageWidth): string {
  const url = mediaUrl(path);
  return MEDIA_BASE_URL === "/media" ? `${url}?w=${width}` : url;
}
