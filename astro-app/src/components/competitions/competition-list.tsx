import type { Competition } from "@/types/competition";
import { CompetitionTable } from "./competition-table";
import SearchComponent from "@/components/shared/search";
import { DATA_GRID_TOOLBAR, DATA_GRID_WRAP } from "@/components/ui/data-grid";

interface CompetitionsListProps {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CompetitionsList({
  upcomingCompetitions,
  pastCompetitions,
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
      <CompetitionTable
        upcoming={upcomingCompetitions}
        past={pastCompetitions}
        searchQuery={searchQuery}
      />
    </div>
  );
}
