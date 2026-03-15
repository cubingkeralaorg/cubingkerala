import { Competition } from "@/types/competition.types";
import { CompetitionTable } from "./CompetitionTable";

interface CompetitionsListProps {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
}

export function CompetitionsList({
  upcomingCompetitions,
  pastCompetitions,
}: CompetitionsListProps) {
  // Combine all competitions
  const allCompetitions = [...upcomingCompetitions, ...pastCompetitions];

  return (
    <div className="mt-6">
      <CompetitionTable competitions={allCompetitions} />
    </div>
  );
}
