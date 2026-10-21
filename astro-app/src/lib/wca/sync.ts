import { env } from "cloudflare:workers";
import type { Db } from "@/db/client";
import { upsertMemberWcaData } from "@/db/queries/wca-data";
import { getSystemMetadataValue, setSystemMetadataValue } from "@/db/queries/system-metadata";
import type { CompetitorData } from "@/types/ranking";

/** Align with the daily cron; stale rows refresh on the next sync run. */
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

const SYNC_CONCURRENCY = 5;
const WCA_API_BATCH_DELAY_MS = 500;
const WCA_SYNC_OFFSET_KEY = "wca_sync_offset";
const WCA_API_ORIGIN = "https://www.worldcubeassociation.org";
const WCA_PERSON_API_PATH = "/api/v0/persons/";
/** Official WCA person IDs: 4-digit year + 4 letters + 2-digit suffix (e.g. 2023TEST01). */
const WCA_ID_PATTERN = /^[0-9]{4}[A-Z]{4}[0-9]{2}$/;

function buildWcaPersonApiUrl(wcaId: string): URL | null {
  if (!WCA_ID_PATTERN.test(wcaId)) return null;

  const url = new URL(`${WCA_PERSON_API_PATH}${wcaId}`, WCA_API_ORIGIN);
  if (url.origin !== WCA_API_ORIGIN || url.pathname !== `${WCA_PERSON_API_PATH}${wcaId}`) {
    return null;
  }
  return url;
}

export function isLiveWcaSyncEnabled(): boolean {
  return env.SKIP_WCA_LIVE_SYNC !== "true";
}

export function isWcaCacheFresh(updatedAt: Date): boolean {
  return Date.now() - updatedAt.getTime() < CACHE_DURATION_MS;
}

/**
 * Live WCA person lookup (SSRF-safe URL building, same as the sync job
 * uses). Exported for the admin "add member by WCA ID" endpoint, which
 * wants a fresh fetch regardless of isLiveWcaSyncEnabled() — unlike the
 * bulk sync, this is an explicit one-off admin action where skipping the
 * fetch would defeat the whole point.
 */
export async function fetchWcaPersonData(wcaId: string): Promise<CompetitorData | null> {
  const personUrl = buildWcaPersonApiUrl(wcaId);
  if (!personUrl) return null;

  try {
    const response = await fetch(personUrl, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as CompetitorData;
  } catch (error) {
    console.error("[WcaSync] Error fetching WCA ID:", wcaId, error);
    return null;
  }
}

/** Fetches one member from WCA and upserts MemberWcaData. Returns fresh data or null. */
export async function syncSingleMemberWcaData(db: Db, wcaId: string): Promise<CompetitorData | null> {
  if (!isLiveWcaSyncEnabled()) return null;

  const data = await fetchWcaPersonData(wcaId);
  if (!data) return null;

  await upsertMemberWcaData(db, wcaId, data);
  return data;
}

async function getWcaSyncOffset(db: Db): Promise<number> {
  const value = await getSystemMetadataValue(db, WCA_SYNC_OFFSET_KEY);
  if (value === null) return 0;
  const offset = Number.parseInt(value, 10);
  return Number.isFinite(offset) && offset >= 0 ? offset : 0;
}

async function setWcaSyncOffset(db: Db, offset: number): Promise<void> {
  await setSystemMetadataValue(db, WCA_SYNC_OFFSET_KEY, String(offset));
}

interface SyncMemberWcaDataOptions {
  timeBudgetMs?: number;
  rotateOffset?: boolean;
}

/** Refreshes MemberWcaData for many members (cron and background sync). */
export async function syncMemberWcaData(
  db: Db,
  wcaIds: string[],
  options: SyncMemberWcaDataOptions = {},
): Promise<void> {
  if (!isLiveWcaSyncEnabled() || wcaIds.length === 0) return;

  const { timeBudgetMs, rotateOffset = false } = options;
  const sortedIds = [...wcaIds].sort();
  let idsToSync = sortedIds;
  let nextOffset = 0;

  if (rotateOffset) {
    const offset = await getWcaSyncOffset(db);
    idsToSync = sortedIds.map((_, index) => sortedIds[(offset + index) % sortedIds.length]);
    nextOffset = (offset + sortedIds.length) % sortedIds.length;
  }

  console.log(`[WcaSync] Starting sync for ${idsToSync.length} members...`);
  const startedAt = Date.now();
  let syncedCount = 0;

  for (let i = 0; i < idsToSync.length; i += SYNC_CONCURRENCY) {
    if (timeBudgetMs && Date.now() - startedAt >= timeBudgetMs) {
      console.log(`[WcaSync] Stopping early after ${syncedCount} members (time budget reached).`);
      break;
    }

    const batch = idsToSync.slice(i, i + SYNC_CONCURRENCY);
    await Promise.all(batch.map((wcaId) => syncSingleMemberWcaData(db, wcaId)));
    syncedCount += batch.length;

    if (i + SYNC_CONCURRENCY < idsToSync.length) {
      await new Promise((resolve) => setTimeout(resolve, WCA_API_BATCH_DELAY_MS));
    }
  }

  if (rotateOffset && sortedIds.length > 0) {
    await setWcaSyncOffset(db, nextOffset);
  }

  console.log(`[WcaSync] Sync complete (${syncedCount} members processed).`);
}
