import { useState, useEffect, useCallback } from "react";
import { Competition } from "@/types/competition.types";
import {
  clearCompetitionsCache,
  formatLastUpdated,
} from "@/lib/competition/cache";
import { fetchCompetitions } from "@/lib/competition/api";

interface UseCompetitionsReturn {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
  loading: boolean;
  lastUpdated: string;
  isRefreshing: boolean;
  handleForceRefresh: () => void;
}

export function useCompetitions(): UseCompetitionsReturn {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  /**
   * Fetch competitions from API and update state
   */
  const fetchAndUpdateCompetitions = useCallback(
    async (showLoading: boolean) => {
      if (showLoading) {
        setIsRefreshing(true);
        setLoading(true);
        setDataLoaded(false);
      }

      const result = await fetchCompetitions(showLoading);

      if (result.success && result.data) {
        setUpcomingCompetitions(result.data.upcomingCompetitions);
        setPastCompetitions(result.data.pastCompetitions);
        setLastUpdated(result.timestamp);
      } else {
        setLastUpdated(result.timestamp);
      }

      // Add delay for better UX when refreshing
      if (showLoading) {
        setTimeout(() => {
          setIsRefreshing(false);
          setLoading(false);
          setDataLoaded(true);
        }, 1000);
      } else {
        setLoading(false);
        setDataLoaded(true);
      }
    },
    [],
  );

  /**
   * Load competitions from cache or fetch fresh data
   */
  const loadCompetitions = useCallback(async () => {
    // We try to get "expired" cache too for SWR behavior
    // Modification: Use localStorage directly or modify getCompetitionsCache to return stale
    const itemStr = typeof window !== "undefined" ? localStorage.getItem("competitions") : null;
    let cachedItem: any = null;
    
    if (itemStr) {
      try {
        cachedItem = JSON.parse(itemStr);
      } catch (e) {}
    }

    if (cachedItem) {
      // Show cached data immediately (SWR)
      setUpcomingCompetitions(cachedItem.value?.upcomingCompetitions || []);
      setPastCompetitions(cachedItem.value?.pastCompetitions || []);
      setLastUpdated(formatLastUpdated(cachedItem.cachedAt));
      setLoading(false);
      setDataLoaded(true);

      // If expired, or just to be fresh, revalidate in background
      const now = Date.now();
      if (now > cachedItem.expiry) {
        console.log("Cache expired - revalidating in background...");
        fetchAndUpdateCompetitions(false);
      }
    } else {
      // No cache at all - fetch fresh data
      console.log("No cache found - fetching fresh data");
      setLoading(true);
      setDataLoaded(false);
      await fetchAndUpdateCompetitions(false);
    }
  }, [fetchAndUpdateCompetitions]);

  /**
   * Force refresh competitions (clears cache)
   */
  const handleForceRefresh = () => {
    clearCompetitionsCache();
    fetchAndUpdateCompetitions(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCompetitions();

    // Re-check cache when page becomes visible or focused
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page visible - checking cache");
        loadCompetitions();
      }
    };

    const handleFocus = () => {
      console.log("Page focused - checking cache");
      loadCompetitions();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadCompetitions]);

  return {
    upcomingCompetitions,
    pastCompetitions,
    loading: loading || !dataLoaded,
    lastUpdated,
    isRefreshing,
    handleForceRefresh,
  };
}
