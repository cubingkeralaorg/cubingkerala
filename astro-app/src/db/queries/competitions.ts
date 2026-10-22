import { asc, desc, eq, gte, lt } from "drizzle-orm";
import { competitions } from "@/db/schema";
import type { Db } from "@/db/client";
import type { Competition } from "@/types/competition";
import { parseEventIds, serializeEventIds } from "@/db/helpers";

// Ported from the Next.js app's src/lib/competitions/queries.ts — same
// today-boundary logic (local midnight, ISO date string comparison; plain
// TEXT columns sort lexicographically the same as chronologically for
// YYYY-MM-DD strings, so this works identically under SQLite).
function getTodayIsoDate(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
}

function toCompetition(row: typeof competitions.$inferSelect): Competition {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    start_date: row.startDate,
    end_date: row.endDate,
    event_ids: parseEventIds(row.eventIds),
    venue: row.venue,
    country_iso2: row.countryIso2,
    has_results: row.hasResults,
    cancelled_at: row.cancelledAt,
  };
}

export async function getCompetitionById(db: Db, id: string): Promise<Competition | null> {
  const [row] = await db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
  return row ? toCompetition(row) : null;
}

export async function getUpcomingCompetitions(db: Db): Promise<Competition[]> {
  const todayIso = getTodayIsoDate();
  const rows = await db
    .select()
    .from(competitions)
    .where(gte(competitions.startDate, todayIso))
    .orderBy(asc(competitions.startDate));
  return rows.map(toCompetition);
}

export async function getPastCompetitions(db: Db): Promise<Competition[]> {
  const todayIso = getTodayIsoDate();
  const rows = await db
    .select()
    .from(competitions)
    .where(lt(competitions.startDate, todayIso))
    .orderBy(desc(competitions.startDate));
  return rows.map(toCompetition);
}

/** All competitions, for the sync job's diff-against-existing check. */
export async function getAllCompetitions(db: Db): Promise<Competition[]> {
  const rows = await db.select().from(competitions);
  return rows.map(toCompetition);
}

export async function upsertCompetition(db: Db, competition: Competition): Promise<void> {
  const now = new Date();
  const [existing] = await db.select().from(competitions).where(eq(competitions.id, competition.id)).limit(1);

  const values = {
    name: competition.name,
    city: competition.city,
    startDate: competition.start_date,
    endDate: competition.end_date,
    eventIds: serializeEventIds(competition.event_ids),
    venue: competition.venue,
    countryIso2: competition.country_iso2,
    hasResults: competition.has_results,
    cancelledAt: competition.cancelled_at ?? null,
    updatedAt: now,
  };

  if (existing) {
    await db.update(competitions).set(values).where(eq(competitions.id, competition.id));
  } else {
    await db.insert(competitions).values({ id: competition.id, ...values, createdAt: now });
  }
}
