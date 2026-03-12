"use client";

import { FilterComponent } from "./filter";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import { MemberPersonResult } from "@/types/api";
import { sortMembersByResult } from "@/utils/wcaSorting";
import { getEventName } from "@/utils/eventNames";
import { RankingsTable } from "./rankingsTable";
import { FilterState, RankingsComponentProps } from "@/types/rankings.types";
import { fetchMultiplePersonsData } from "@/services/wca.api";

export default function RankingsComponent({ members }: RankingsComponentProps) {
  const [memberResults, setMemberResults] = useState<MemberPersonResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterState>({
    event: "333",
    round: "single",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMemberResults = async () => {
      if (!members?.length) {
        setLoading(false);
        return;
      }

      try {
        const results = await fetchMultiplePersonsData(
          members.map((member) => member.wcaid),
        );
        setMemberResults(results);
      } catch (error) {
        console.error("Error fetching member results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberResults();
  }, [members]);

  const sortedResults = useMemo(() => {
    if (!memberResults.length) return [];
    return sortMembersByResult(
      memberResults,
      selectedFilter.event,
      selectedFilter.round,
    );
  }, [memberResults, selectedFilter]);

  const getResult = useCallback(
    (member: MemberPersonResult) => {
      const roundType =
        selectedFilter.round === "average" ? "averages" : "singles";
      return member.rank[roundType]?.find(
        (r) => r.eventId === selectedFilter.event,
      );
    },
    [selectedFilter],
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-foreground">
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <BlurIn
              word="Rankings"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
            />
            <div className="flex justify-start md:justify-end">
              <FilterComponent onFilterChange={setSelectedFilter} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for{" "}
            <span>{getEventName(selectedFilter.event)}</span>
            {"  "}
            <span>{selectedFilter.round}</span>
          </p>

          <RankingsTable
            sortedResults={sortedResults}
            selectedEvent={selectedFilter.event}
            selectedRound={selectedFilter.round}
            getResult={getResult}
          />
        </div>
      </div>
    </Suspense>
  );
}
