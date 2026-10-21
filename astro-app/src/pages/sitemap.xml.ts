import type { APIRoute } from "astro";

// Ported from the old Next.js app's sitemap.xml route — same four top-level
// URLs, now pointing at the real domain (cubingkerala.com, not the old
// expired cubingkerala.org). `/sitemap` is already in src/middleware.ts's
// VALID_ROUTES allowlist — that was carried over from the old app's
// middleware but had nothing to actually serve until now.
const SITE_ORIGIN = "https://cubingkerala.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

const PATHS = ["", "/competitions", "/members", "/rankings"];

export const GET: APIRoute = () => {
  const urls = PATHS.map(
    (path) => `
  <url>
    <loc>${SITE_ORIGIN}${path}</loc>
    <lastmod>${LASTMOD}</lastmod>
  </url>`,
  ).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};
