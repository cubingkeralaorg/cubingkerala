import { useState, useEffect, useCallback } from "react";
import { Competition } from "@/types/competition.types";
import { fetchCompetitions } from "@/lib/competition/api";

interface UseCompetitionsReturn {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
  loading: boolean;
  lastUpdated: string;
  isRefreshing: boolean;
  handleForceRefresh: () => void;
}

export function useCompetitions(
  initialUpcoming: Competition[] = [],
  initialPast: Competition[] = []
): UseCompetitionsReturn {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>(initialUpcoming);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>(initialPast);
  
  const hasInitialData = initialUpcoming.length > 0 || initialPast.length > 0;
  
  const [loading, setLoading] = useState(!hasInitialData);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(hasInitialData);

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
   * Load fresh competitions from API
   */
  const loadCompetitions = useCallback(async () => {
    setLoading(true);
    setDataLoaded(false);
    await fetchAndUpdateCompetitions(false);
  }, [fetchAndUpdateCompetitions]);

  const handleForceRefresh = () => {
    fetchAndUpdateCompetitions(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hasInitialData) {
      loadCompetitions();
    }
  }, [hasInitialData, loadCompetitions]);

  return {
    upcomingCompetitions,
    pastCompetitions,
    loading: loading || !dataLoaded,
    lastUpdated,
    isRefreshing,
    handleForceRefresh,
  };
}
