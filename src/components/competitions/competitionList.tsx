"use client";

import { Competition } from "@/types/competition.types";
import CompetitionSection from "./CompetitionSection";

interface CompetitionsListProps {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
}

export function CompetitionsList({
  upcomingCompetitions,
  pastCompetitions,
}: CompetitionsListProps) {
  return (
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
  );
}
