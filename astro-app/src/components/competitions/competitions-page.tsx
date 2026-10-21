import { useState, useMemo } from "react";
import { CompetitionsList } from "./competition-list";
import type { Competition } from "@/types/competition";

interface CompetitionsPageProps {
  upcoming: Competition[];
  past: Competition[];
}

// Note: the original app's refresh button + useCompetitions hook (live
// re-fetch from /api/get-competitions) is dropped here — there's no backend
// yet. It comes back once Phase 2 wires up the real sync endpoint.
export default function CompetitionsPage({ upcoming, past }: CompetitionsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUpcoming = useMemo(() => {
    return upcoming.filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.country_iso2.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [upcoming, searchQuery]);

  const filteredPast = useMemo(() => {
    return past.filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.country_iso2.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [past, searchQuery]);

  return (
    <CompetitionsList
      upcomingCompetitions={filteredUpcoming}
      pastCompetitions={filteredPast}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
