import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// App Router route-segment config for Vercel Functions
export const dynamic = "force-dynamic"; 
export const revalidate = 0; 
export const maxDuration = 30; 

import { syncCompetitions } from "@/lib/competitions.sync";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // 1. Fetch all Kerala competitions from database first
    let allKeralaFromDb = await db.$queryRaw<any[]>`SELECT * FROM "Competitions" ORDER BY "start_date" DESC`;
    
    const shouldSync = forceRefresh || allKeralaFromDb.length === 0;

    if (shouldSync) {
      const syncResult = await syncCompetitions();
      if (syncResult.status === "updated") {
        // Refresh final list from DB
        allKeralaFromDb = await db.$queryRaw<any[]>`SELECT * FROM "Competitions" ORDER BY "start_date" DESC`;
      }
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingCompetitions = allKeralaFromDb
      .filter((c: any) => new Date(c.start_date) >= now)
      .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      
    const pastCompetitions = allKeralaFromDb
      .filter((c: any) => new Date(c.start_date) < now)
      .sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    return new NextResponse(
      JSON.stringify({
        upcomingCompetitions,
        pastCompetitions,
        lastFetch: new Date().toISOString(),
        source: shouldSync ? 'wca-api-sync' : 'database',
        count: allKeralaFromDb.length
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "X-Generated-At": new Date().toISOString(),
          "X-DB-Count": allKeralaFromDb.length.toString(),
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching competitions:", error);
    
    // In case of API failure, still try to return data from database
    try {
      const allKeralaFromDb = await db.competitions.findMany({
        orderBy: {
          start_date: 'desc'
        }
      });

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingCompetitions = allKeralaFromDb
        .filter((c: any) => new Date(c.start_date) >= now)
        .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        
      const pastCompetitions = allKeralaFromDb
        .filter((c: any) => new Date(c.start_date) < now)
        .sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

      return new NextResponse(
        JSON.stringify({
          upcomingCompetitions,
          pastCompetitions,
          lastFetch: new Date().toISOString(),
          source: 'database-fallback',
          error: error.message
        }),
        { status: 200 }
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
