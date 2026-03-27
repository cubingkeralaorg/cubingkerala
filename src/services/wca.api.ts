import axios from "axios";
import { CompetitorData } from "@/types/api";

const UNIFIED_CACHE_KEY = "ck_members_wca_data";
const CACHE_DURATION_PERSON = 7 * 24 * 60 * 60 * 1000; // 7 days for unified cache items

interface UnifiedCache {
  [wcaId: string]: {
    data: CompetitorData | null;
    expiry: number;
    updatedAt: number;
  };
}

/**
 * Gets the unified cache from localStorage
 */
export const getUnifiedCache = (): UnifiedCache => {
  const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
  if (!isBrowser) return {};
  
  try {
    const cached = localStorage.getItem(UNIFIED_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to read unified cache", e);
  }
  return {};
};

/**
 * Saves multiple persons' data to the unified cache at once
 */
const saveBatchToUnifiedCache = (dataMap: { [wcaId: string]: CompetitorData | null }) => {
  const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
  if (!isBrowser) return;

  try {
    const cache = getUnifiedCache();
    const now = Date.now();
    
    Object.entries(dataMap).forEach(([wcaId, data]) => {
      cache[wcaId] = {
        data,
        expiry: now + CACHE_DURATION_PERSON,
        updatedAt: now,
      };
    });
    
    localStorage.setItem(UNIFIED_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Failed to save to unified cache", e);
  }
};

/**
 * Cleans up legacy individual person cache keys
 */
export const cleanLegacyCache = () => {
  const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
  if (!isBrowser) return;

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("wca_person_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} legacy cache keys.`);
    }
  } catch (e) {
    console.warn("Failed to clean legacy cache", e);
  }
};

/**
 * Fetches person data from the official WCA API with retries.
 * NO LONGER handles individual caching.
 */
export const fetchPersonData = async (
  wcaId: string,
  retries = 3,
): Promise<CompetitorData | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
      );
      return response.data;
    } catch (error) {
      const isRateLimited = axios.isAxiosError(error) && error.response?.status === 429;
      
      if (isRateLimited && attempt < retries) {
        const backoff = Math.pow(2, attempt) * 1000;
        console.warn(`Rate limited for ${wcaId}, retrying in ${backoff}ms...`);
        await sleep(backoff);
        continue;
      }
      
      const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
      if (isNotFound) {
        console.warn(`WCA ID ${wcaId} not found.`);
        return null;
      }
      
      console.error(`Error fetching data for WCA ID ${wcaId} (attempt ${attempt + 1}):`, error);
      if (attempt === retries) return null;
    }
  }
  return null;
};

/**
 * Utility for intentional delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Synchronously check for cached person data in unified cache
 */
export const getCachedPersonData = (wcaId: string): CompetitorData | null => {
  const cache = getUnifiedCache();
  const cached = cache[wcaId];
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  return null;
};

/**
 * Fetches data for multiple persons by their WCA IDs.
 * STRICTLY INCREMENTAL: Only fetches what's missing unless explicitly told to refresh all.
 */
export const fetchMultiplePersonsData = async (
  wcaIds: string[],
  options: { forceRefreshAll?: boolean; priorityIds?: string[] } = {},
): Promise<CompetitorData[]> => {
  const { forceRefreshAll = false, priorityIds = [] } = options;
  const cache = getUnifiedCache();
  const now = Date.now();
  
  const allResultsMap: { [wcaId: string]: CompetitorData | null } = {};
  const idsToFetch: string[] = [];

  // Categorize IDs
  for (const wcaId of wcaIds) {
    const cached = cache[wcaId];
    if (!forceRefreshAll && cached && now < cached.expiry) {
      allResultsMap[wcaId] = cached.data;
    } else {
      idsToFetch.push(wcaId);
    }
  }

  // If priority IDs are provided and not already in idsToFetch, add them (if they exist in wcaIds)
  priorityIds.forEach(id => {
    if (wcaIds.includes(id) && !idsToFetch.includes(id)) {
      idsToFetch.unshift(id); // Prioritize these
    }
  });

  if (idsToFetch.length === 0) {
    return Object.values(allResultsMap).filter(Boolean) as CompetitorData[];
  }

  console.log(`Incremental fetch: fetching ${idsToFetch.length} missing/stale members...`);

  // Fetch missing items in throttled batches
  const BATCH_SIZE = 4; // Smaller batch size to be safer
  const DELAY_BETWEEN_BATCHES = 2000;
  const fetchedDataMap: { [wcaId: string]: CompetitorData | null } = {};

  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (wcaId) => {
      const result = await fetchPersonData(wcaId, 2);
      fetchedDataMap[wcaId] = result;
      allResultsMap[wcaId] = result;
    }));

    // Save progressively to unified cache
    saveBatchToUnifiedCache(fetchedDataMap);

    if (i + BATCH_SIZE < idsToFetch.length) {
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  return Object.values(allResultsMap).filter(Boolean) as CompetitorData[];
};

export const fetchPersonFromWCA = async (wcaId: string) => {
  const response = await axios.get(
    `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
  );
  return response.data;
};
