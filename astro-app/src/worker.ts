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
// /members. There are two different caches in play here, with two
// different rules, because they have very different sharing properties:
//
//   1. Cloudflare's edge Cache API (`caches.default`) — SHARED across every
//      visitor who hits the same URL. Anonymous-only: a logged-in render
//      written here would leak that visitor's login state (and email) to
//      the next, unrelated visitor of the same URL. (Tried keying it
//      per-visitor instead of excluding auth entirely — see the note
//      below; reverted, it didn't work.)
//   2. The requesting browser's own HTTP cache — inherently private to
//      that one visitor already, regardless of login state, the same way
//      their cookies are. There's nothing to leak by letting a logged-in
//      visitor's browser cache their own personalized page: nobody else's
//      browser can ever read it. So every cacheable response gets a real
//      browser-facing `max-age` — public+shared for anonymous (also
//      backed by the edge cache above), `private` for authenticated
//      (browser-only, no edge cache involved at all) — so repeat clicks
//      from the same visitor, logged in or not, redisplay instantly with
//      zero network request instead of re-running D1 + SSR every time.
//
// Caching anything personalized in the browser is only safe paired with
// login/logout actively invalidating it the moment the cookie changes —
// otherwise a page cached while logged in (or out) could keep showing
// that stale state after switching. src/pages/api/auth/callback.ts and
// .../logout.ts both send `Clear-Site-Data: "cache"` for exactly this.
//
// Tried (and reverted): keying the EDGE cache per-visitor by folding the
// cookie's value into the cache key, so a logged-in visitor's repeat click
// could hit a dedicated edge cache entry instead of just their own browser
// cache. Cloudflare's Cache API silently failed to persist anything
// written under that scheme — cache.put() resolved without error, but an
// immediate self-verifying cache.match() for the identical key right after
// still came back empty, consistently, regardless of TTL, Cache-Control
// value (public/private, with/without s-maxage), or how the key Request
// was constructed. Isolated it to "a real auth cookie was present on the
// request" specifically — not the D1 queries Layout.astro does for a real
// cookie (reproduced with no D1 work at all), not the key string (an
// authenticated key byte-identical to a working anonymous one still
// failed), not timing. Couldn't find the actual cause, so not shipping
// edge-cache writes I've proven don't reliably work. The browser-cache
// approach above sidesteps this entirely — it was only ever the shared
// edge cache that had both the leak risk and this reliability problem.
const CACHEABLE_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/learn\/?$/,
  /^\/competitions\/?$/,
  /^\/competitions\/[^/]+\/?$/,
  /^\/rankings\/?$/,
  /^\/members\/?$/,
  /^\/members\/[^/]+\/?$/,
];

const CACHE_FRESH_SECONDS = 60;
const EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS = 300;

function hasAuthCookie(request: Request): boolean {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((pair) => pair.trim().startsWith("userInfo="));
}

function isCacheablePath(url: URL): boolean {
  return CACHEABLE_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cacheablePath = request.method === "GET" && isCacheablePath(url);
    const authenticated = cacheablePath && hasAuthCookie(request);
    // Only the anonymous case uses the shared edge cache — see the big
    // comment above for why authenticated responses skip it entirely.
    const useEdgeCache = cacheablePath && !authenticated;
    // `caches.default` is a Cloudflare-specific extension of the standard
    // CacheStorage interface (the global CDN cache, distinct from
    // `caches.open(name)`'s namespaced caches) — not present on the DOM
    // lib's CacheStorage type that this program also pulls in for the
    // client-side React islands, hence the cast.
    const cache = (caches as unknown as { default: Cache }).default;

    if (useEdgeCache) {
      const cached = await cache.match(request);
      if (cached) return cached;
    }

    // Only requests that actually reach this point (edge cache misses,
    // and every authenticated request — those never check the edge cache
    // above) count against the rate limit. A repeat visitor served
    // straight from their own browser's cache never reaches the network
    // at all, so it never reaches here either.
    const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: clientIp });
    if (!success) {
      return new Response("Too many requests — please slow down and try again shortly.", {
        status: 429,
        headers: { "Retry-After": "30" },
      });
    }

    const response = await handle(request, env, ctx);
    if (!cacheablePath || !response.ok) return response;

    const headers = new Headers(response.headers);
    // None of the cacheable routes set cookies today, but if one ever does
    // (e.g. a new analytics cookie), it must never ride along into a
    // response reused across multiple requests via the edge cache, or
    // persisted in the browser's own cache past this response.
    headers.delete("Set-Cookie");
    headers.set(
      "Cache-Control",
      authenticated
        ? `private, max-age=${CACHE_FRESH_SECONDS}`
        : `public, max-age=${CACHE_FRESH_SECONDS}, s-maxage=${CACHE_FRESH_SECONDS}, stale-while-revalidate=${EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS}`,
    );
    const cacheableResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
    if (useEdgeCache) ctx.waitUntil(cache.put(request, cacheableResponse.clone()));
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
