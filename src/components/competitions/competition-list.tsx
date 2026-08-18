import { Competition } from "@/types/competition.types";
import { CompetitionTable } from "./competition-table";
import { CompetitionSkeleton } from "./competition-skeleton";
import SearchComponent from "@/components/shared/search";
import { DATA_GRID_TOOLBAR, DATA_GRID_WRAP } from "@/components/ui/data-grid";

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
    <div className={DATA_GRID_WRAP}>
      <div className={DATA_GRID_TOOLBAR}>
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
