"use client";

import { FilterComponent } from "@/components/filter";
import axios from "axios";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import RankingsLoading from "../app/rankings/loading";
import BlurIn from "./ui/blur-in";
import { MemberPersonResult } from "@/types/api";
import { sortMembersByResult } from "@/utils/wcaSorting";
import { RankingsTable } from "./rankings/rankingsTable";
import { FilterState, RankingsComponentProps } from "@/types/rankings";

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
        const results = await Promise.all(
          members.map((member) =>
            axios.get(
              `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${member.wcaid}.json`,
            ),
          ),
        );

        setMemberResults(results.map((res) => res.data));
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
    return <RankingsLoading />;
  }

  return (
    <Suspense fallback={<RankingsLoading />}>
      <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-stone-200">
        <div className="animate-fade-in">
          <div className="flex align-center justify-between mb-4">
            <BlurIn
              word="Rankings"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
            />
            <div className="flex justify-end w-full">
              <FilterComponent onFilterChange={setSelectedFilter} />
            </div>
          </div>

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
