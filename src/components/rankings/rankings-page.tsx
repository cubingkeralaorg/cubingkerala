"use client";

import { FilterComponent } from "./filter";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import { CompetitorData } from "@/types/api";
import { sortMembersByResult } from "@/utils/wcaSorting";
import { getEventName } from "@/utils/eventNames";
import { RankingsTable } from "./rankingsTable";
import { FilterState, RankingsComponentProps } from "@/types/rankings.types";

const processResults = (cacheObj: Record<string, any>, membersList: any[]): CompetitorData[] => {
  return membersList.map(member => {
    const cached = cacheObj[member.wcaid];
    if (cached && cached.data) {
      return cached.data;
    }
    return {
      person: {
        id: member.wcaid,
        name: member.name,
        wca_id: member.wcaid,
        avatar: { url: "", pending_url: "", thumb_url: "", is_default: true },
        gender: member.gender,
        country_iso2: "IN",
        url: `https://www.worldcubeassociation.org/persons/${member.wcaid}`,
        country: { id: "India", name: "India", continentId: "_Asia", iso2: "IN" },
        delegate_status: null,
        class: "person",
        teams: []
      },
      competition_count: 0,
      personal_records: {},
      medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
      records: { national: 0, continental: 0, world: 0, total: 0 },
      // @ts-ignore
      isUnavailable: true
    };
  });
};

export default function RankingsComponent({ members, initialWcaCache }: RankingsComponentProps) {
  const memberResults = useMemo<CompetitorData[]>(() => {
    if (!members?.length || !initialWcaCache) return [];
    return processResults(initialWcaCache, members);
  }, [members, initialWcaCache]);

  const [selectedFilter, setSelectedFilter] = useState<FilterState>({
    event: "333",
    round: "single",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sortedResults = useMemo(() => {
    if (!memberResults.length) return [];
    return sortMembersByResult(
      memberResults,
      selectedFilter.event,
      selectedFilter.round,
    );
  }, [memberResults, selectedFilter]);

  const getResult = useCallback(
    (member: CompetitorData) => {
      const roundType =
        selectedFilter.round === "average" ? "average" : "single";
      return member.personal_records[selectedFilter.event]?.[roundType];
    },
    [selectedFilter],
  );

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-foreground">
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4 gap-3">
            <div>
              <BlurIn
                word="Rankings"
                className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-1 md:mb-4"
              />
              <p className="text-[10px] md:text-xs text-muted-foreground ml-1">
                Showing results for{" "}
                <span>{getEventName(selectedFilter.event)}</span>
                {"  "}
                <span>{selectedFilter.round}</span>
              </p>
            </div>
            <div className="flex justify-end items-center mt-0">
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
