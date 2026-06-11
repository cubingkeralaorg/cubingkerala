import { after } from "next/server";
import db from "./db";
import { CompetitorData } from "@/types/api";

/** Align with daily cron; stale rows refresh on the next page load. */
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

const SYNC_CONCURRENCY = 5;
const WCA_API_BATCH_DELAY_MS = 500;
const WCA_SYNC_OFFSET_KEY = "wca_sync_offset";

export type WcaCacheEntry = {
  data: CompetitorData;
  expiry: number;
  updatedAt: number;
};

export function isLiveWcaSyncEnabled(): boolean {
  return process.env.SKIP_WCA_LIVE_SYNC !== "true";
}

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
  if (!isLiveWcaSyncEnabled()) {
    const existing = await db.memberWcaData.findUnique({
      where: { wcaid: wcaId },
    });
    return existing ? (existing.data as unknown as CompetitorData) : null;
  }

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

async function getWcaSyncOffset(): Promise<number> {
  const row = await db.systemMetadata.findUnique({
    where: { key: WCA_SYNC_OFFSET_KEY },
  });
  if (!row) return 0;

  const offset = Number.parseInt(row.value, 10);
  return Number.isFinite(offset) && offset >= 0 ? offset : 0;
}

async function setWcaSyncOffset(offset: number): Promise<void> {
  await db.systemMetadata.upsert({
    where: { key: WCA_SYNC_OFFSET_KEY },
    create: { key: WCA_SYNC_OFFSET_KEY, value: String(offset) },
    update: { value: String(offset) },
  });
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

  if (!isLiveWcaSyncEnabled()) {
    return existing ? (existing.data as unknown as CompetitorData) : null;
  }

  const fresh = await syncSingleMemberWcaData(wcaId);
  if (fresh) return fresh;

  return existing ? (existing.data as unknown as CompetitorData) : null;
}

/**
 * Returns a unified cache object for the given WCA IDs.
 * Stale or missing rows are refreshed in the background without blocking the page.
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

  if (staleOrMissingIds.length > 0 && isLiveWcaSyncEnabled()) {
    after(async () => {
      await syncMemberWcaData(staleOrMissingIds);
    });
  }

  return cacheMap;
}

type SyncMemberWcaDataOptions = {
  timeBudgetMs?: number;
  rotateOffset?: boolean;
};

/**
 * Refreshes MemberWcaData for many members (cron and background sync).
 */
export async function syncMemberWcaData(
  wcaIds: string[],
  options: SyncMemberWcaDataOptions = {},
) {
  if (!isLiveWcaSyncEnabled() || wcaIds.length === 0) {
    return;
  }

  const { timeBudgetMs, rotateOffset = false } = options;
  const sortedIds = [...wcaIds].sort();
  let idsToSync = sortedIds;
  let nextOffset = 0;

  if (rotateOffset) {
    const offset = await getWcaSyncOffset();
    idsToSync = sortedIds.map(
      (_, index) => sortedIds[(offset + index) % sortedIds.length],
    );
    nextOffset = (offset + sortedIds.length) % sortedIds.length;
  }

  console.log(`[WcaSync] Starting sync for ${idsToSync.length} members...`);

  const startedAt = Date.now();
  let syncedCount = 0;

  for (let i = 0; i < idsToSync.length; i += SYNC_CONCURRENCY) {
    if (timeBudgetMs && Date.now() - startedAt >= timeBudgetMs) {
      console.log(
        `[WcaSync] Stopping early after ${syncedCount} members (time budget reached).`,
      );
      break;
    }

    const batch = idsToSync.slice(i, i + SYNC_CONCURRENCY);
    await Promise.all(batch.map((wcaId) => syncSingleMemberWcaData(wcaId)));
    syncedCount += batch.length;

    if (i + SYNC_CONCURRENCY < idsToSync.length) {
      await new Promise((resolve) =>
        setTimeout(resolve, WCA_API_BATCH_DELAY_MS),
      );
    }
  }

  if (rotateOffset && sortedIds.length > 0) {
    await setWcaSyncOffset(nextOffset);
  }

  console.log(`[WcaSync] Sync complete (${syncedCount} members processed).`);
}
