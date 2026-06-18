"use client";

import { useState, useMemo } from "react";
import { CompetitionsList } from "./competitionList";
import { CompetitionsHeader } from "./CompetitionsHeader";
import { useCompetitions } from "@/hooks/useCompetitions";
import { Competition } from "@/types/competition.types";
import { FadeUp, PageReveal } from "../ui/fade-up";

interface CompetitionsPageProps {
  initialUpcoming?: Competition[];
  initialPast?: Competition[];
  initialLastUpdated?: string;
}

const CompetitionsPage = ({ initialUpcoming = [], initialPast = [], initialLastUpdated = "" }: CompetitionsPageProps) => {
  const {
    upcomingCompetitions,
    pastCompetitions,
    loading,
    lastUpdated,
    isRefreshing,
    handleForceRefresh,
  } = useCompetitions(initialUpcoming, initialPast, initialLastUpdated);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUpcoming = useMemo(() => {
    return upcomingCompetitions.filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.country_iso2.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [upcomingCompetitions, searchQuery]);

  const filteredPast = useMemo(() => {
    return pastCompetitions.filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.country_iso2.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [pastCompetitions, searchQuery]);

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 text-foreground flex flex-col min-h-screen">
      <PageReveal className="w-full">
        <FadeUp>
          <CompetitionsHeader
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={handleForceRefresh}
            isLoading={loading}
          />
        </FadeUp>

        <FadeUp>
          <CompetitionsList
            upcomingCompetitions={filteredUpcoming}
            pastCompetitions={filteredPast}
            isLoading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </FadeUp>
      </PageReveal>
    </div>
  );
};

export default CompetitionsPage;
