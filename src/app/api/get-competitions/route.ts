import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { fetchCompetitionsFromDb } from "@/lib/competitions.queries";

// App Router route-segment config for Vercel Functions
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

import { syncCompetitions } from "@/lib/competitions.sync";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    let { upcomingCompetitions, pastCompetitions, initialLastUpdated } =
      await fetchCompetitionsFromDb();

    const shouldSync =
      forceRefresh ||
      (upcomingCompetitions.length === 0 && pastCompetitions.length === 0);

    if (shouldSync) {
      const syncResult = await syncCompetitions();
      if (syncResult.status === "updated") {
        revalidateTag("competitions");
        ({ upcomingCompetitions, pastCompetitions, initialLastUpdated } =
          await fetchCompetitionsFromDb());
      }
    }

    const syncMeta = await db.systemMetadata.findUnique({
      where: { key: "last_competition_sync" },
    });
    const lastSyncTime = syncMeta
      ? new Date(syncMeta.value).toISOString()
      : new Date().toISOString();

    return new NextResponse(
      JSON.stringify({
        upcomingCompetitions,
        pastCompetitions,
        lastFetch: lastSyncTime,
        source: shouldSync ? "wca-api-sync" : "database",
        count: upcomingCompetitions.length + pastCompetitions.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "X-Generated-At": new Date().toISOString(),
          "X-DB-Count": (
            upcomingCompetitions.length + pastCompetitions.length
          ).toString(),
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching competitions:", error);
    
    // In case of API failure, still try to return data from database
    try {
      const {
        upcomingCompetitions,
        pastCompetitions,
        initialLastUpdated,
      } = await fetchCompetitionsFromDb();

      const syncMetaFallback = await db.systemMetadata.findUnique({
        where: { key: "last_competition_sync" },
      });
      const lastSyncTimeFallback = syncMetaFallback
        ? new Date(syncMetaFallback.value).toISOString()
        : initialLastUpdated || new Date().toISOString();

      return new NextResponse(
        JSON.stringify({
          upcomingCompetitions,
          pastCompetitions,
          lastFetch: lastSyncTimeFallback,
          source: "database-fallback",
          error: error.message,
        }),
        { status: 200 },
      );
    } catch (dbError) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to fetch from both API and Database",
          timestamp: new Date().toISOString(),
        }),
        { status: 500 }
      );
    }
  }
}
