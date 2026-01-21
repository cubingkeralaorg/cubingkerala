import { CACHE_DURATION } from "@/constants/competitions";
import { CachedData, CompetitionsData } from "@/types/competition";

const STORAGE_KEY = "competitions";

/**
 * Store competitions data in localStorage with expiry
 */
export const setCompetitionsCache = (data: CompetitionsData): void => {
  const now = new Date();
  const item = {
    value: data,
    cachedAt: now.getTime(),
    expiry: now.getTime() + CACHE_DURATION,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  } catch (error) {
    console.error("Failed to cache competitions:", error);
  }
};

/**
 * Retrieve competitions data from localStorage if not expired
 * Returns null if cache is expired or doesn't exist
 */
export const getCompetitionsCache = (): CachedData | null => {
  const itemStr = localStorage.getItem(STORAGE_KEY);
  
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now > item.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      data: item.value,
      cachedAt: item.cachedAt,
    };
  } catch (error) {
    console.error("Failed to parse cached competitions:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/**
 * Clear competitions cache from localStorage
 */
export const clearCompetitionsCache = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear competitions cache:", error);
  }
};

/**
 * Format timestamp for display
 */
export const formatLastUpdated = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
