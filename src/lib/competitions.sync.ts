import db from "@/lib/db";

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

export async function syncCompetitions() {
  console.log("Syncing with WCA API (1 page only)...");
  const base = "https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=100";
  
  // We only fetch 1 page to get the latest/upcoming competitions
  // This is usually enough to catch new Kerala competitions if they were recently announced
  const allWcaCompetitions = await fetchJsonWithTimeout(`${base}&page=1`);
  console.log(`Fetched ${allWcaCompetitions.length} competitions from WCA API (Page 1)`);

  // Filter Kerala competitions
  const keralaCompetitions = allWcaCompetitions.filter(
    (c: any) => c.city && c.city.toLowerCase().includes("kerala")
  );
  console.log(`Found ${keralaCompetitions.length} Kerala competitions in WCA fetch`);

  if (keralaCompetitions.length > 0) {
    const allKeralaFromDb = await db.$queryRaw<any[]>`SELECT * FROM "Competitions" ORDER BY "start_date" DESC`;
    // Create a lookup map of existing competitions to avoid redundant upserts
    const existingMap = new Map(allKeralaFromDb.map(c => [c.id, c]));

    // Only upsert if it's new OR if critical metadata has changed
    const targetedCompetitions = keralaCompetitions.filter((c: any) => {
      const existing = existingMap.get(c.id);
      if (!existing) return true; // New competition

      // Check for changes in critical fields
      const hasChanged = 
        existing.name !== c.name ||
        existing.city !== c.city ||
        existing.venue !== (c.venue || "") ||
        existing.has_results !== !!c.results_posted_at ||
        existing.cancelled_at !== (c.cancelled_at ?? null) ||
        JSON.stringify(existing.event_ids) !== JSON.stringify(c.event_ids);

      return hasChanged;
    });

    if (targetedCompetitions.length > 0) {
      console.log(`Syncing ${targetedCompetitions.length} changed/new competitions...`);
      const upsertPromises = targetedCompetitions.map((c: any) => {
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
          console.error(`Upsert failed for ${c.id}`, err);
        });
      });
      await Promise.all(upsertPromises);
      console.log("Successfully updated changed competitions");
      return { status: "updated", count: targetedCompetitions.length };
    } else {
      console.log("No changes detected in Kerala competitions. Skipping database updates.");
      return { status: "no_changes", count: 0 };
    }
  }
  return { status: "no_kerala_comps_found", count: 0 };
}
