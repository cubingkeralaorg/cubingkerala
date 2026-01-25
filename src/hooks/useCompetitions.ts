import { useState, useEffect, useCallback } from "react";
import { Competition } from "@/types/competition.types";
import {
  getCompetitionsCache,
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
    const cachedResult = getCompetitionsCache();

    if (cachedResult) {
      // Use cached data
      setUpcomingCompetitions(cachedResult.data?.upcomingCompetitions || []);
      setPastCompetitions(cachedResult.data?.pastCompetitions || []);
      setLastUpdated(formatLastUpdated(cachedResult.cachedAt));
      setLoading(false);
      setDataLoaded(true);
    } else {
      // Cache expired or missing - fetch fresh data
      console.log("Cache expired or missing - fetching fresh data");
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
