import { eq, inArray } from "drizzle-orm";
import { members, memberWcaData } from "@/db/schema";
import type { Db } from "@/db/client";
import type { RequestInfo, MemberWcaSummary, Medals } from "@/types/member";
import type { CompetitorData, RankingsWcaEntry } from "@/types/ranking";

function toRequestInfo(row: typeof members.$inferSelect): RequestInfo {
  return {
    wcaid: row.wcaid,
    name: row.name,
    avatarUrl: row.avatarUrl,
    country: row.country ?? "",
    gender: row.gender ?? "",
    role: row.role ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAllMembers(db: Db): Promise<RequestInfo[]> {
  const rows = await db.select().from(members);
  return rows.map(toRequestInfo);
}

export async function getAllMemberWcaIds(db: Db): Promise<string[]> {
  const rows = await db.select({ wcaid: members.wcaid }).from(members);
  return rows.map((row) => row.wcaid);
}

export async function getMemberByWcaid(db: Db, wcaid: string): Promise<RequestInfo | null> {
  const [row] = await db.select().from(members).where(eq(members.wcaid, wcaid)).limit(1);
  return row ? toRequestInfo(row) : null;
}

interface NewMember {
  wcaid: string;
  name: string;
  avatarUrl: string;
  country: string;
  gender: string;
  role: string;
}

export async function createMember(db: Db, data: NewMember): Promise<void> {
  const now = new Date();
  await db.insert(members).values({ ...data, createdAt: now, updatedAt: now });
}

/** Returns true if a row existed and was deleted. */
export async function deleteMemberByWcaid(db: Db, wcaid: string): Promise<boolean> {
  const existing = await getMemberByWcaid(db, wcaid);
  if (!existing) return false;
  await db.delete(members).where(eq(members.wcaid, wcaid));
  return true;
}

type MemberUpdateFields = Partial<Pick<NewMember, "name" | "avatarUrl" | "country" | "gender" | "role">>;

/** Returns the updated row, or null if no member with this wcaid exists. */
export async function updateMember(
  db: Db,
  wcaid: string,
  fields: MemberUpdateFields,
): Promise<RequestInfo | null> {
  const existing = await getMemberByWcaid(db, wcaid);
  if (!existing) return null;
  await db.update(members).set({ ...fields, updatedAt: new Date() }).where(eq(members.wcaid, wcaid));
  return getMemberByWcaid(db, wcaid);
}

const EMPTY_MEDALS: Medals = { gold: 0, silver: 0, bronze: 0, total: 0 };

// Ported from the Next.js app's src/lib/wca/sync.ts loadMemberWcaRows() +
// getWcaSummaryForMembers()/getRankingsWcaDataForMembers() — DB-read side
// only for now. The live-WCA-API refresh-on-stale-data behavior
// (isWcaCacheFresh, the after()-scheduled background sync) is intentionally
// not ported yet; that depends on wca/sync.ts itself, which is Phase 7.
// Until then this just reads whatever's in MemberWcaData — empty today.
//
// Chunked at 90 (D1 caps bound parameters per query at 100, and this
// builds one per wcaid via IN (...) — a single unchunked query here took
// the whole site down in production the moment the roster crossed that
// limit, confirmed via wrangler tail's "Failed query" error against this
// exact IN clause). Queries run in parallel and get merged below.
const MAX_IN_CLAUSE_SIZE = 90;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function loadMemberWcaRows(db: Db, wcaIds: string[]) {
  if (wcaIds.length === 0) return new Map<string, typeof memberWcaData.$inferSelect>();
  const batches = await Promise.all(
    chunk(wcaIds, MAX_IN_CLAUSE_SIZE).map((batch) =>
      db.select().from(memberWcaData).where(inArray(memberWcaData.wcaid, batch)),
    ),
  );
  return new Map(batches.flat().map((row) => [row.wcaid, row]));
}

export async function getWcaSummaryForMembers(
  db: Db,
  wcaIds: string[],
): Promise<Record<string, MemberWcaSummary>> {
  const dbDataMap = await loadMemberWcaRows(db, wcaIds);
  const summaries: Record<string, MemberWcaSummary> = {};

  for (const wcaId of wcaIds) {
    const row = dbDataMap.get(wcaId);
    if (row) {
      const data = JSON.parse(row.data) as CompetitorData;
      summaries[wcaId] = {
        competition_count: data.competition_count ?? 0,
        medals: data.medals ?? EMPTY_MEDALS,
      };
    } else {
      summaries[wcaId] = {
        competition_count: 0,
        medals: EMPTY_MEDALS,
        isUnavailable: true,
      };
    }
  }

  return summaries;
}

export async function getRankingsWcaDataForMembers(
  db: Db,
  wcaIds: string[],
): Promise<Record<string, RankingsWcaEntry>> {
  const dbDataMap = await loadMemberWcaRows(db, wcaIds);
  const entries: Record<string, RankingsWcaEntry> = {};

  for (const wcaId of wcaIds) {
    const row = dbDataMap.get(wcaId);
    if (row) {
      const data = JSON.parse(row.data) as CompetitorData;
      entries[wcaId] = { personal_records: data.personal_records ?? {} };
    } else {
      entries[wcaId] = { personal_records: {}, isUnavailable: true };
    }
  }

  return entries;
}
