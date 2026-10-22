import { eq } from "drizzle-orm";
import { memberWcaData } from "@/db/schema";
import type { Db } from "@/db/client";
import type { CompetitorData, WcaTeamMembership } from "@/types/ranking";

export async function getMemberWcaDataRow(db: Db, wcaid: string) {
  const [row] = await db.select().from(memberWcaData).where(eq(memberWcaData.wcaid, wcaid)).limit(1);
  return row ?? null;
}

export interface MemberTags {
  delegateStatus: string | null;
  teams: WcaTeamMembership[];
}

/**
 * Delegate status and team memberships — stored already (the sync job
 * saves the WCA API's full person object, never filtered), just not read
 * anywhere until now. Null fields render as no badge at all, not an error.
 */
export async function getMemberTags(db: Db, wcaid: string): Promise<MemberTags> {
  const row = await getMemberWcaDataRow(db, wcaid);
  if (!row) return { delegateStatus: null, teams: [] };

  const data = JSON.parse(row.data) as CompetitorData;
  return {
    delegateStatus: data.person?.delegate_status ?? null,
    teams: data.person?.teams ?? [],
  };
}

/**
 * Ported from wca/sync.ts's upsertMemberWcaDataRecord — skips the rewrite
 * (just bumps updatedAt) when competition_count and personal_records are
 * unchanged, same dedupe optimization as the original.
 */
export async function upsertMemberWcaData(db: Db, wcaid: string, data: CompetitorData): Promise<void> {
  const existing = await getMemberWcaDataRow(db, wcaid);
  const now = new Date();

  if (existing) {
    const existingData = JSON.parse(existing.data) as CompetitorData;
    const isCompsSame = existingData?.competition_count === data.competition_count;
    const isPRsSame = JSON.stringify(existingData?.personal_records) === JSON.stringify(data.personal_records);

    if (isCompsSame && isPRsSame) {
      await db.update(memberWcaData).set({ updatedAt: now }).where(eq(memberWcaData.wcaid, wcaid));
      return;
    }

    await db
      .update(memberWcaData)
      .set({ data: JSON.stringify(data), updatedAt: now })
      .where(eq(memberWcaData.wcaid, wcaid));
    return;
  }

  await db.insert(memberWcaData).values({ wcaid, data: JSON.stringify(data), updatedAt: now });
}
