import { Competition } from "@/types/competition.types";
import { CompetitionTable } from "./CompetitionTable";
import { CompetitionSkeleton } from "./CompetitionSkeleton";
import SearchComponent from "@/components/shared/search";

interface CompetitionsListProps {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CompetitionsList({
  upcomingCompetitions,
  pastCompetitions,
  isLoading,
  searchQuery,
  onSearchChange,
}: CompetitionsListProps) {
  // Combine all competitions
  const allCompetitions = [...upcomingCompetitions, ...pastCompetitions];

  return (
    <div className="mt-6 rounded-md border border-border overflow-hidden">
      <SearchComponent 
        handleSearch={onSearchChange} 
        placeholder="Search Competitions" 
      />
      {isLoading ? (
        <CompetitionSkeleton />
      ) : (
        <CompetitionTable competitions={allCompetitions} />
      )}
    </div>
  );
}
