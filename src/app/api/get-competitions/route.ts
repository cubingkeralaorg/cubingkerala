import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// App Router route-segment config for Vercel Functions
export const dynamic = "force-dynamic"; 
export const revalidate = 0; 
export const maxDuration = 30; 

// Helper to fetch with an AbortController timeout
async function fetchJsonWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 22000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "CubingKerala/1.0",
        Accept: "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`WCA API responded with status: ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function GET(_req: NextRequest) {
  try {
    // 1. Fetch more competitions from India to better populate the DB
    // Fetching 3 pages of 100 to get a good sample of recent/upcoming ones
    console.log("Fetching competitions from WCA API...");
    const base = "https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=100";
    const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = await Promise.all(
      pages.map(page => fetchJsonWithTimeout(`${base}&page=${page}`))
    );
    const allWcaCompetitions = results.flat();
    console.log(`Fetched ${allWcaCompetitions.length} competitions from WCA API`);

    // 2. Filter Kerala competitions and upsert to DB
    const keralaCompetitions = allWcaCompetitions.filter(
      (c: any) => c.city && c.city.toLowerCase().includes("kerala")
    );
    console.log(`Found ${keralaCompetitions.length} Kerala competitions in WCA fetch`);

    if (keralaCompetitions.length > 0) {
      const upsertPromises = keralaCompetitions.map((c: any) => {
        // Use a safer upsert that doesn't crash if cancelled_at is missing from client
        const data = {
          name: c.name,
          city: c.city,
          start_date: c.start_date,
          end_date: c.end_date,
          event_ids: c.event_ids,
          venue: c.venue || "",
          country_iso2: c.country_iso2,
          has_results: !!c.results_posted_at,
          cancelled_at: c.cancelled_at ?? null,
        };

        return db.competitions.upsert({
          where: { id: c.id },
          update: data as any,
          create: { id: c.id, ...data } as any,
        }).catch((err: any) => {
          console.error(`Upsert failed for ${c.id}, retrying without cancelled_at`, err);
          // Fallback for stale client
          const { cancelled_at, ...safeData } = data;
          return db.competitions.upsert({
            where: { id: c.id },
            update: safeData as any,
            create: { id: c.id, ...safeData } as any,
          });
        });
      });
      await Promise.all(upsertPromises);
      console.log("Successfully upserted Kerala competitions to DB");
    }

    // 3. Fetch all Kerala competitions from database for the final response
    // 3. Fetch all Kerala competitions from database using raw query to bypass stale client
    const allKeralaFromDb = await db.$queryRaw<any[]>`SELECT * FROM "Competitions" ORDER BY "start_date" DESC`;
    console.log(`Fetched ${allKeralaFromDb.length} Kerala competitions from DB`);

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
        source: 'database',
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
