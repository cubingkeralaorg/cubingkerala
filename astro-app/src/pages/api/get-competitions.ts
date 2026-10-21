import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/db/client";
import { getUpcomingCompetitions, getPastCompetitions } from "@/db/queries/competitions";
import { syncCompetitions } from "@/lib/competitions/sync";

// Ported from src/app/api/get-competitions/route.ts. Now that
// competitions/sync.ts exists (Phase 7), `refresh=true` / empty-DB actually
// trigger a live WCA sync before responding, matching the original.
export const GET: APIRoute = async ({ url }) => {
  const db = getDb(env.DB);
  const forceRefresh = url.searchParams.get("refresh") === "true";

  let [upcomingCompetitions, pastCompetitions] = await Promise.all([
    getUpcomingCompetitions(db),
    getPastCompetitions(db),
  ]);

  const shouldSync = forceRefresh || (upcomingCompetitions.length === 0 && pastCompetitions.length === 0);
  let source: "database" | "wca-api-sync" = "database";

  if (shouldSync) {
    try {
      const syncResult = await syncCompetitions(db);
      if (syncResult.status === "updated") {
        source = "wca-api-sync";
        [upcomingCompetitions, pastCompetitions] = await Promise.all([
          getUpcomingCompetitions(db),
          getPastCompetitions(db),
        ]);
      }
    } catch (error) {
      // Sync failures fall back to whatever's already in D1 — same
      // database-fallback behavior the original had for an API failure.
      console.error("Error syncing competitions:", error);
    }
  }

  return new Response(
    JSON.stringify({
      upcomingCompetitions,
      pastCompetitions,
      source,
      count: upcomingCompetitions.length + pastCompetitions.length,
      generatedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
};
