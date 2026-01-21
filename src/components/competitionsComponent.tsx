"use client";

import React, { useEffect, useState } from "react";
import BlurIn from "./ui/blur-in";
import LoadingComponent from "./loading";
import RefreshButton from "./competitions/RefreshButton";
import CompetitionSection from "./competitions/CompetitionSection";

import {
  getCompetitionsCache,
  clearCompetitionsCache,
  formatLastUpdated,
} from "../lib/competition/cache";
import { fetchCompetitions } from "../lib/competition/api";
import { Competition } from "@/types/competition";

const CompetitionsPage = () => {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  /**
   * Load competitions from cache or fetch fresh data
   */
  const loadCompetitions = async () => {
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
  };

  /**
   * Fetch competitions from API and update state
   */
  const fetchAndUpdateCompetitions = async (showLoading: boolean) => {
    if (showLoading) {
      setIsRefreshing(true);
      setLoading(true);
      setDataLoaded(false);
    }

    const result = await fetchCompetitions(showLoading);

    if (result.success && result.data) {
      setUpcomingCompetitions(result?.data?.upcomingCompetitions);
      setPastCompetitions(result?.data?.pastCompetitions);
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
  };

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
  }, []);

  // Show loading component when loading or not yet loaded data
  if (loading || !dataLoaded) {
    return <LoadingComponent />;
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200 flex flex-col min-h-[calc(100vh-160px)]">
      <div className="animate-fade-in w-full">
        {/* Header Section */}
        <div className="flex align-center justify-between mb-4">
          <div>
            <BlurIn
              word="Competitions"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-2 md:mb-4"
            />
            <div className="text-xs text-gray-400 text-start ml-1">
              Last updated: {lastUpdated}
            </div>
          </div>
          <div className="mt-2 md:mt-3">
            <RefreshButton
              isRefreshing={isRefreshing}
              onClick={handleForceRefresh}
            />
          </div>
        </div>

        {/* Competitions Sections */}
        <div className="space-y-2">
          <CompetitionSection
            title="Upcoming Competitions"
            competitions={upcomingCompetitions}
            type="upcoming"
            emptyMessage={{
              title: "Stay tuned!",
              subtitle: "New competitions are on the way...",
            }}
          />

          <CompetitionSection
            title="Past Competitions"
            competitions={pastCompetitions}
            type="past"
            emptyMessage={{
              title: "No past competitions yet!",
              subtitle: "Check back later...",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompetitionsPage;
