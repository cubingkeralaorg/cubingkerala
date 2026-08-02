import { Competition } from "@/types/competition.types";
import { CompetitionTable } from "./CompetitionTable";
import { CompetitionSkeleton } from "./CompetitionSkeleton";
import SearchComponent from "@/components/shared/search";
import { FadeUp, StaggerReveal } from "../ui/fade-up";
import { RevealTableSection } from "../ui/reveal-table";

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
  // Always show the upcoming block so an empty state is visible when none are scheduled.
  const allCompetitions = [
    { id: "upcoming-header" } as Competition,
    ...(upcomingCompetitions.length > 0
      ? upcomingCompetitions
      : [{ id: "upcoming-empty" } as Competition]),
    ...(pastCompetitions.length > 0
      ? [{ id: "past-header" } as Competition, ...pastCompetitions]
      : []),
  ];

  return (
    <StaggerReveal className="mt-0 rounded-md border border-border overflow-hidden">
      <FadeUp>
        <SearchComponent
          handleSearch={onSearchChange}
          placeholder="Search Competitions"
        />
      </FadeUp>
      <RevealTableSection>
        {isLoading ? (
          <CompetitionSkeleton />
        ) : (
          <CompetitionTable
            competitions={allCompetitions}
            searchQuery={searchQuery}
          />
        )}
      </RevealTableSection>
    </StaggerReveal>
  );
}
