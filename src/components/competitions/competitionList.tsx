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
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border px-3 py-2">
        <SearchComponent
          handleSearch={onSearchChange}
          placeholder="Search competitions"
          className="rounded-md border border-input bg-background shadow-none"
        />
      </div>
      {isLoading ? (
        <CompetitionSkeleton />
      ) : (
        <CompetitionTable
          upcoming={upcomingCompetitions}
          past={pastCompetitions}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
