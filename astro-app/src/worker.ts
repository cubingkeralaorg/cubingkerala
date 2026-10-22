import { handle } from "@astrojs/cloudflare/handler";
import { getDb } from "./db/client";
import { getAllMemberWcaIds } from "./db/queries/members";
import { syncMemberWcaData } from "./lib/wca/sync";
import { syncCompetitions } from "./lib/competitions/sync";

// Custom Worker entrypoint (replaces @astrojs/cloudflare/entrypoints/server
// as wrangler.jsonc's "main") so we can add a scheduled() export alongside
// Astro's own fetch handler — the adapter has no built-in Cron Trigger
// support, this is the officially documented "custom worker entry file"
// pattern (import handle from @astrojs/cloudflare/handler, export a
// standard ExportedHandler). Relative imports throughout, not the `@/*`
// alias — this file is bundled directly by wrangler, not through Astro's
// own Vite pipeline, so there's no guarantee tsconfig paths resolve here.
//
// Ported from the Next.js app's /api/cron/sync-wca route — same two calls,
// same options — just triggered by a native Cron Trigger instead of a
// CRON_SECRET-guarded HTTP endpoint (see wrangler.jsonc's [triggers] and
// the plan doc's "Cron" decision).
//
// --- Edge caching + rate limiting ---
// Every page here is SSR (astro.config.mjs's output: 'server') and does at
// least one D1 round trip, with zero caching anywhere — repeatedly hitting
// several routes (e.g. manual perf testing, or a scraper) re-runs all of
// that on every single request. On the Workers Free plan that's what was
// tripping the "exceeded resource limits" error: there's no code-level dial
// to raise the ~10ms CPU/request cap, so the only way to stay under it is
// to do the expensive work (D1 queries + Astro rendering) less often.
// Two layers, applied only to the page routes below (never to /api/* or
// POST requests, which already set their own no-store headers):
//   1. Cache API: a cache hit skips D1 + rendering entirely.
//   2. Rate limiter: only guards cache *misses*, i.e. the actual expensive
//      path. One person clicking around fast still gets cache hits after
//      the first visit to each page; the limit only trips on sustained
//      bursts across many distinct/uncached URLs (bots, load tests).
//
// Every page goes through Layout.astro (src/layouts/Layout.astro), which
// reads the "userInfo" cookie to compute isLoggedIn/isAdmin — and even the
// viewer's own email for the footer — for literally every route, not just
// /members. The cache key is just the URL, so a logged-in render written
// to the shared edge cache would leak that visitor's login state (and
// email) to the next, unrelated visitor of the same URL. So caching is
// gated on the *absence* of that cookie, not on a per-path allowlist of
// "safe" pages — any request carrying it always bypasses the cache in
// both directions (never read, never written), and always renders fresh.
const CACHEABLE_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/learn\/?$/,
  /^\/competitions\/?$/,
  /^\/competitions\/[^/]+\/?$/,
  /^\/rankings\/?$/,
  /^\/members\/?$/,
  /^\/members\/[^/]+\/?$/,
];

const EDGE_CACHE_FRESH_SECONDS = 60;
const EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS = 300;

function hasAuthCookie(request: Request): boolean {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((pair) => pair.trim().startsWith("userInfo="));
}

function isCacheableRequest(request: Request, url: URL): boolean {
  return (
    request.method === "GET" &&
    CACHEABLE_PATTERNS.some((pattern) => pattern.test(url.pathname)) &&
    !hasAuthCookie(request)
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cacheable = isCacheableRequest(request, url);
    // `caches.default` is a Cloudflare-specific extension of the standard
    // CacheStorage interface (the global CDN cache, distinct from
    // `caches.open(name)`'s namespaced caches) — not present on the DOM
    // lib's CacheStorage type that this program also pulls in for the
    // client-side React islands, hence the cast.
    const cache = (caches as unknown as { default: Cache }).default;

    if (cacheable) {
      const cached = await cache.match(request);
      if (cached) return cached;
    }

    // Only cache misses (the expensive path) count against the rate limit —
    // a repeat visitor served straight from cache above never reaches here.
    const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: clientIp });
    if (!success) {
      return new Response("Too many requests — please slow down and try again shortly.", {
        status: 429,
        headers: { "Retry-After": "30" },
      });
    }

    const response = await handle(request, env, ctx);
    if (!cacheable || !response.ok) return response;

    const headers = new Headers(response.headers);
    // None of the cacheable routes set cookies today, but if one ever does
    // (e.g. a new analytics cookie), it must never ride along into a
    // response shared across every visitor via the edge cache.
    headers.delete("Set-Cookie");
    // `s-maxage`/`stale-while-revalidate` govern OUR edge cache (above) —
    // the actual TTL this entry lives for. `no-cache` (not `max-age`) is
    // what's aimed at the browser: every page here reads the login cookie
    // (Layout.astro) and can change the instant a visitor logs in or out,
    // so the browser must never silently reuse its own local copy — it has
    // no way to know the cookie changed between navigations. `no-cache`
    // forces it to always revalidate with us first; without that, logging
    // in/out only "took effect" after a hard refresh, since normal
    // navigation was served straight from the browser's own cache.
    headers.set(
      "Cache-Control",
      `public, no-cache, s-maxage=${EDGE_CACHE_FRESH_SECONDS}, stale-while-revalidate=${EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS}`,
    );
    const cacheableResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
    ctx.waitUntil(cache.put(request, cacheableResponse.clone()));
    return cacheableResponse;
  },
  async scheduled(_event, env, _ctx) {
    const db = getDb(env.DB);
    const wcaIds = await getAllMemberWcaIds(db);

    console.log(`[Cron] Triggered WCA Sync for ${wcaIds.length} members`);
    await syncMemberWcaData(db, wcaIds, { timeBudgetMs: 50_000, rotateOffset: true });

    console.log("[Cron] Triggered Competitions Sync");
    await syncCompetitions(db);
  },
} satisfies ExportedHandler<Env>;
