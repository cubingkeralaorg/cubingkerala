import type { Db } from "@/db/client";
import { getAllCompetitions, upsertCompetition } from "@/db/queries/competitions";
import { setSystemMetadataValue } from "@/db/queries/system-metadata";
import type { Competition } from "@/types/competition";

interface WcaCompetitionListEntry {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  venue?: string;
  country_iso2: string;
  results_posted_at: string | null;
  cancelled_at: string | null;
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 22000): Promise<unknown> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "CubingKerala/1.0", Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`WCA API responded with status: ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

type SyncResult =
  | { status: "updated"; count: number }
  | { status: "no_changes"; count: 0 }
  | { status: "no_kerala_comps_found"; count: 0 };

/**
 * Ported from the Next.js app's src/lib/competitions/sync.ts — same
 * deliberate choices: only page 1 (usually enough to catch newly announced
 * Kerala competitions), city-contains-"kerala" filter, only upsert rows
 * whose critical fields actually changed.
 */
export async function syncCompetitions(db: Db): Promise<SyncResult> {
  console.log("Syncing with WCA API (1 page only)...");
  const base = "https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=100";

  const allWcaCompetitions = (await fetchJsonWithTimeout(`${base}&page=1`)) as WcaCompetitionListEntry[];
  console.log(`Fetched ${allWcaCompetitions.length} competitions from WCA API (Page 1)`);

  const keralaCompetitions = allWcaCompetitions.filter((c) => c.city?.toLowerCase().includes("kerala"));
  console.log(`Found ${keralaCompetitions.length} Kerala competitions in WCA fetch`);

  await setSystemMetadataValue(db, "last_competition_sync", new Date().toISOString());

  if (keralaCompetitions.length === 0) {
    return { status: "no_kerala_comps_found", count: 0 };
  }

  const existingCompetitions = await getAllCompetitions(db);
  const existingMap = new Map(existingCompetitions.map((c) => [c.id, c]));

  const targetedCompetitions = keralaCompetitions.filter((c) => {
    const existing = existingMap.get(c.id);
    if (!existing) return true;

    return (
      existing.name !== c.name ||
      existing.city !== c.city ||
      existing.venue !== (c.venue || "") ||
      existing.has_results !== !!c.results_posted_at ||
      existing.cancelled_at !== (c.cancelled_at ?? null) ||
      JSON.stringify(existing.event_ids) !== JSON.stringify(c.event_ids)
    );
  });

  if (targetedCompetitions.length === 0) {
    console.log("No changes detected in Kerala competitions. Skipping database updates.");
    return { status: "no_changes", count: 0 };
  }

  console.log(`Syncing ${targetedCompetitions.length} changed/new competitions...`);
  await Promise.all(
    targetedCompetitions.map((c) => {
      const competition: Competition = {
        id: c.id,
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
      return upsertCompetition(db, competition).catch((err) => {
        console.error(`Upsert failed for ${c.id}`, err);
      });
    }),
  );
  console.log("Successfully updated changed competitions");
  return { status: "updated", count: targetedCompetitions.length };
}
