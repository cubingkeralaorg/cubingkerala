import { after } from "next/server";
import db from "./db";
import { CompetitorData } from "@/types/api";

/** Align with daily cron; stale rows refresh on the next page load. */
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

const SYNC_ON_READ_LIMIT = 20;
const SYNC_CONCURRENCY = 5;
const WCA_API_BATCH_DELAY_MS = 500;

export type WcaCacheEntry = {
  data: CompetitorData;
  expiry: number;
  updatedAt: number;
};

export function isWcaCacheFresh(updatedAt: Date | string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < CACHE_DURATION_MS;
}

/**
 * Fetches person data from the official WCA API on the server.
 */
async function fetchWcaPersonData(
  wcaId: string,
): Promise<CompetitorData | null> {
  try {
    const response = await fetch(
      `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`[WcaSync] Error fetching WCA ID ${wcaId}:`, error);
    return null;
  }
}

async function upsertMemberWcaDataRecord(
  wcaId: string,
  data: CompetitorData,
): Promise<void> {
  const existing = await db.memberWcaData.findUnique({
    where: { wcaid: wcaId },
  });

  if (existing) {
    const existingData = existing.data as unknown as CompetitorData;
    const isCompsSame =
      existingData?.competition_count === data.competition_count;
    const isPRsSame =
      JSON.stringify(existingData?.personal_records) ===
      JSON.stringify(data.personal_records);

    if (isCompsSame && isPRsSame) {
      await db.memberWcaData.update({
        where: { wcaid: wcaId },
        data: { updatedAt: new Date() },
      });
      console.log(`[WcaSync] Skipped rewrite for ${wcaId} (No changes)`);
      return;
    }

    await db.memberWcaData.update({
      where: { wcaid: wcaId },
      data: { data: data as object, updatedAt: new Date() },
    });
    console.log(`[WcaSync] Updated data for ${wcaId}`);
    return;
  }

  await db.memberWcaData.create({
    data: { wcaid: wcaId, data: data as object },
  });
  console.log(`[WcaSync] Created data for ${wcaId}`);
}

/**
 * Fetches one member from WCA and upserts MemberWcaData. Returns fresh data or null.
 */
export async function syncSingleMemberWcaData(
  wcaId: string,
): Promise<CompetitorData | null> {
  const data = await fetchWcaPersonData(wcaId);
  if (!data) return null;

  await upsertMemberWcaDataRecord(wcaId, data);
  return data;
}

function toCacheEntry(data: CompetitorData, updatedAt: Date): WcaCacheEntry {
  const updatedAtMs = updatedAt.getTime();
  return {
    data,
    expiry: updatedAtMs + CACHE_DURATION_MS,
    updatedAt: updatedAtMs,
  };
}

/**
 * Returns WCA data for one member, refreshing from WCA when cache is missing or stale.
 */
export async function getMemberWcaData(
  wcaId: string,
): Promise<CompetitorData | null> {
  const existing = await db.memberWcaData.findUnique({
    where: { wcaid: wcaId },
  });

  if (existing && isWcaCacheFresh(existing.updatedAt)) {
    return existing.data as unknown as CompetitorData;
  }

  const fresh = await syncSingleMemberWcaData(wcaId);
  if (fresh) return fresh;

  return existing ? (existing.data as unknown as CompetitorData) : null;
}

/**
 * Returns a unified cache object for the given WCA IDs.
 * Refreshes stale or missing rows (sync on read for small sets; background sync otherwise).
 */
export async function getUnifiedWcaCacheForMembers(wcaIds: string[]) {
  const cachedData = await db.memberWcaData.findMany({
    where: { wcaid: { in: wcaIds } },
  });

  const cacheMap: Record<string, WcaCacheEntry> = {};
  const staleOrMissingIds: string[] = [];
  const dbDataMap = new Map(cachedData.map((d) => [d.wcaid, d]));

  for (const wcaId of wcaIds) {
    const dbEntry = dbDataMap.get(wcaId);
    if (dbEntry && isWcaCacheFresh(dbEntry.updatedAt)) {
      cacheMap[wcaId] = toCacheEntry(
        dbEntry.data as unknown as CompetitorData,
        dbEntry.updatedAt,
      );
      continue;
    }

    staleOrMissingIds.push(wcaId);
    if (dbEntry) {
      cacheMap[wcaId] = toCacheEntry(
        dbEntry.data as unknown as CompetitorData,
        dbEntry.updatedAt,
      );
    }
  }

  if (staleOrMissingIds.length === 0) {
    return cacheMap;
  }

  const applySyncedData = (wcaId: string, data: CompetitorData) => {
    const now = new Date();
    cacheMap[wcaId] = toCacheEntry(data, now);
  };

  if (staleOrMissingIds.length <= SYNC_ON_READ_LIMIT) {
    for (const wcaId of staleOrMissingIds) {
      const data = await syncSingleMemberWcaData(wcaId);
      if (data) applySyncedData(wcaId, data);
    }
  } else {
    after(async () => {
      await syncMemberWcaData(staleOrMissingIds);
    });
  }

  return cacheMap;
}

/**
 * Refreshes MemberWcaData for many members (cron and background sync).
 */
export async function syncMemberWcaData(wcaIds: string[]) {
  console.log(`[WcaSync] Starting sync for ${wcaIds.length} members...`);

  for (let i = 0; i < wcaIds.length; i += SYNC_CONCURRENCY) {
    const batch = wcaIds.slice(i, i + SYNC_CONCURRENCY);
    await Promise.all(batch.map((wcaId) => syncSingleMemberWcaData(wcaId)));

    if (i + SYNC_CONCURRENCY < wcaIds.length) {
      await new Promise((resolve) =>
        setTimeout(resolve, WCA_API_BATCH_DELAY_MS),
      );
    }
  }

  console.log(`[WcaSync] Sync complete.`);
}
