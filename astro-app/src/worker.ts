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
export default {
  fetch: handle,
  async scheduled(_event, env, _ctx) {
    const db = getDb(env.DB);
    const wcaIds = await getAllMemberWcaIds(db);

    console.log(`[Cron] Triggered WCA Sync for ${wcaIds.length} members`);
    await syncMemberWcaData(db, wcaIds, { timeBudgetMs: 50_000, rotateOffset: true });

    console.log("[Cron] Triggered Competitions Sync");
    await syncCompetitions(db);
  },
} satisfies ExportedHandler<Env>;
