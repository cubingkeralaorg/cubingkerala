import axios from "axios";
import { CompetitorData } from "@/types/api";

const CACHE_KEY_PREFIX = "wca_person_";

/**
 * Fetches person data from the official WCA API with local caching and retries.
 */
export const fetchPersonData = async (
  wcaId: string,
  retries = 3,
): Promise<CompetitorData | null> => {
  // Try to get from sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${wcaId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to read from session storage", e);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(
        `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
      );
      const data = response.data;

      // Cache the result
      try {
        sessionStorage.setItem(`${CACHE_KEY_PREFIX}${wcaId}`, JSON.stringify(data));
      } catch (e) {
        console.warn("Failed to write to session storage", e);
      }

      return data;
    } catch (error) {
      const isRateLimited = axios.isAxiosError(error) && error.response?.status === 429;
      
      if (isRateLimited && attempt < retries) {
        const backoff = Math.pow(2, attempt) * 500; // 500ms, 1000ms, 2000ms
        console.warn(`Rate limited for ${wcaId}, retrying in ${backoff}ms...`);
        await sleep(backoff);
        continue;
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
 * Fetches data for multiple persons by their WCA IDs with batching and throttling.
 */
export const fetchMultiplePersonsData = async (
  wcaIds: string[],
): Promise<CompetitorData[]> => {
  const BATCH_SIZE = 5;
  const DELAY_BETWEEN_BATCHES = 150; // ms
  const allResults: CompetitorData[] = [];

  for (let i = 0; i < wcaIds.length; i += BATCH_SIZE) {
    const batch = wcaIds.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((wcaId) => fetchPersonData(wcaId)),
    );

    allResults.push(...batchResults.filter((r): r is CompetitorData => r !== null));

    // Wait before the next batch if there are more items
    if (i + BATCH_SIZE < wcaIds.length) {
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  return allResults;
};

export const fetchPersonFromWCA = async (wcaId: string) => {
  const response = await axios.get(
    `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`,
  );
  return response.data;
};
