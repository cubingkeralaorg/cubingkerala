import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/db/client";
import { getAllCompetitions } from "@/db/queries/competitions";
import { getAllMembers } from "@/db/queries/members";

// Ported from the old Next.js app's sitemap.xml route, now pointing at the
// real domain (cubingkerala.com, not the old expired cubingkerala.org) and
// expanded to include every competition/member detail page from D1, not
// just the 4 static top-level routes. `/sitemap` is already in
// src/middleware.ts's VALID_ROUTES allowlist.
const SITE_ORIGIN = "https://cubingkerala.com";
const STATIC_PATHS = ["", "/competitions", "/members", "/rankings", "/learn"];

export const GET: APIRoute = async () => {
  // `new Date()` outside an actual request handler is frozen (Workers
  // disables high-precision Date access outside request context, a Spectre
  // mitigation) — this previously lived at module scope and always
  // produced 1970-01-01. Computing it inside the handler, per request,
  // fixes that.
  const today = new Date().toISOString().slice(0, 10);

  const db = getDb(env.DB);
  const [competitions, members] = await Promise.all([getAllCompetitions(db), getAllMembers(db)]);

  const paths = [
    ...STATIC_PATHS,
    ...competitions.map((c) => `/competitions/${c.id}`),
    ...members.map((m) => `/members/${m.wcaid}`),
  ];

  const urls = paths
    .map(
      (path) => `
  <url>
    <loc>${SITE_ORIGIN}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};
