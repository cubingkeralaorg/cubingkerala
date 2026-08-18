"use client";

import { useState, useMemo } from "react";
import { CompetitionsList } from "./competitionList";
import { CompetitionsHeader } from "./CompetitionsHeader";
import { useCompetitions } from "@/hooks/useCompetitions";
import { Competition } from "@/types/competition.types";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

interface CompetitionsPageProps {
  initialUpcoming?: Competition[];
  initialPast?: Competition[];
  initialLastUpdated?: string;
}

const CompetitionsPage = ({
  initialUpcoming = [],
  initialPast = [],
  initialLastUpdated = "",
}: CompetitionsPageProps) => {
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
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <CompetitionsHeader
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleForceRefresh}
        isLoading={loading}
      />
      <CompetitionsList
        upcomingCompetitions={filteredUpcoming}
        pastCompetitions={filteredPast}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
};

export default CompetitionsPage;
