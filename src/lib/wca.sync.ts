import db from "./db";
import { CompetitorData } from "@/types/api";

const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Fetches person data from the official WCA API on the server.
 */
async function fetchWcaPersonData(wcaId: string): Promise<CompetitorData | null> {
  try {
    const response = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`[WcaSync] Error fetching WCA ID ${wcaId}:`, error);
    return null;
  }
}

/**
 * Returns a unified cache object for the given WCA IDs, 
 * using database-cached data where available.
 */
export async function getUnifiedWcaCacheForMembers(wcaIds: string[]) {
  // @ts-ignore - Prisma model newly added
  const cachedData = await db.memberWcaData.findMany({
    where: { wcaid: { in: wcaIds } }
  });

  const cacheMap: Record<string, any> = {};
  const staleOrMissingIds: string[] = [];
  const now = Date.now();

  // 1. Initial Map from DB
  const dbDataMap = new Map(cachedData.map((d: any) => [d.wcaid, d]));

  for (const wcaId of wcaIds) {
    const dbEntry = dbDataMap.get(wcaId) as any;
    if (dbEntry && (now - new Date(dbEntry.updatedAt).getTime() < CACHE_DURATION_MS)) {
      cacheMap[wcaId] = {
        data: dbEntry.data,
        expiry: new Date(dbEntry.updatedAt).getTime() + CACHE_DURATION_MS,
        updatedAt: new Date(dbEntry.updatedAt).getTime(),
      };
    } else {
      staleOrMissingIds.push(wcaId);
      // Even if stale, we might want to return it as a fallback if we don't sync now
      if (dbEntry) {
         cacheMap[wcaId] = {
          data: dbEntry.data,
          expiry: new Date(dbEntry.updatedAt).getTime() + CACHE_DURATION_MS,
          updatedAt: new Date(dbEntry.updatedAt).getTime(),
        };
      }
    }
  }

  // Optional: Trigger background sync for missing/stale if needed
  // For now, we return what we have to keep it fast.
  // The client can still fetch if something is truly missing.

  return cacheMap;
}

/**
 * Background sync function that can be called to refresh the database cache.
 */
export async function syncMemberWcaData(wcaIds: string[]) {
  console.log(`[WcaSync] Starting sync for ${wcaIds.length} members...`);
  
  // We'll do this sequentially or in small batches to avoid rate limits
  for (const wcaId of wcaIds) {
    const data = await fetchWcaPersonData(wcaId);
    if (data) {
      // @ts-ignore - Prisma model newly added
      await db.memberWcaData.upsert({
        where: { wcaid: wcaId },
        update: { data: data as any, updatedAt: new Date() },
        create: { wcaid: wcaId, data: data as any },
      });
    }
    // Small delay to be nice to WCA API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`[WcaSync] Sync complete.`);
}
