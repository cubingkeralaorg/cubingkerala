"use client";

import { FilterComponent } from "./filter";
import { useCallback, useMemo, useState } from "react";
import BlurIn from "../ui/blur-in";
import { RankingsSkeleton } from "./rankingsSkeleton";
import { CompetitorData } from "@/types/api";
import { sortMembersByResult } from "@/utils/wcaSorting";
import { getEventName } from "@/utils/eventNames";
import { RankingsTable } from "./rankingsTable";
import { FilterState, RankingsComponentProps } from "@/types/rankings.types";
import { FadeUp, StaggerReveal } from "../ui/fade-up";
import { RevealTableSection } from "../ui/reveal-table";

const buildMemberResults = (
  rankingsWcaData: RankingsComponentProps["rankingsWcaData"],
  membersList: RankingsComponentProps["members"],
): CompetitorData[] => {
  return membersList.map((member) => {
    const entry = rankingsWcaData?.[member.wcaid];
    if (entry && !entry.isUnavailable) {
      return {
        person: {
          id: member.wcaid,
          name: member.name,
          wca_id: member.wcaid,
          avatar: {
            url: "",
            pending_url: "",
            thumb_url: "",
            is_default: true,
          },
          gender: member.gender,
          country_iso2: "IN",
          url: `https://www.worldcubeassociation.org/persons/${member.wcaid}`,
          country: {
            id: "India",
            name: "India",
            continentId: "_Asia",
            iso2: "IN",
          },
          delegate_status: null,
          class: "person",
          teams: [],
        },
        competition_count: 0,
        personal_records: entry.personal_records,
        medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
        records: { national: 0, continental: 0, world: 0, total: 0 },
      };
    }

    return {
      person: {
        id: member.wcaid,
        name: member.name,
        wca_id: member.wcaid,
        avatar: {
          url: "",
          pending_url: "",
          thumb_url: "",
          is_default: true,
        },
        gender: member.gender,
        country_iso2: "IN",
        url: `https://www.worldcubeassociation.org/persons/${member.wcaid}`,
        country: {
          id: "India",
          name: "India",
          continentId: "_Asia",
          iso2: "IN",
        },
        delegate_status: null,
        class: "person",
        teams: [],
      },
      competition_count: 0,
      personal_records: {},
      medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
      records: { national: 0, continental: 0, world: 0, total: 0 },
      isUnavailable: true,
    } as CompetitorData & { isUnavailable: true };
  });
};

export default function RankingsComponent({
  members,
  rankingsWcaData = {},
}: RankingsComponentProps) {
  const memberResults = useMemo<CompetitorData[]>(() => {
    if (!members?.length) return [];
    return buildMemberResults(rankingsWcaData, members);
  }, [members, rankingsWcaData]);

  const [selectedFilter, setSelectedFilter] = useState<FilterState>({
    event: "333",
    round: "single",
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = useCallback((newFilter: FilterState) => {
    setIsFiltering(true);
    setSelectedFilter(newFilter);
    setTimeout(() => setIsFiltering(false), 300);
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
    <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-foreground">
      <StaggerReveal>
        <FadeUp className="flex justify-between items-center mb-1 md:mb-2 gap-3">
          <BlurIn
            word="Rankings"
            className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
          />
          <div className="flex justify-end items-center mt-0">
            <FilterComponent onFilterChange={handleFilterChange} />
          </div>
        </FadeUp>

        <FadeUp
          as="p"
          className="text-[10px] md:text-xs text-muted-foreground ml-1 mb-4 w-full"
        >
          Showing results for{" "}
          <span>{getEventName(selectedFilter.event)}</span>
          {"  "}
          <span>{selectedFilter.round}</span>
        </FadeUp>

        <FadeUp>
          {isFiltering ? (
            <RankingsSkeleton />
          ) : (
            <RevealTableSection>
              <RankingsTable
                sortedResults={sortedResults}
                selectedEvent={selectedFilter.event}
                selectedRound={selectedFilter.round}
                getResult={getResult}
              />
            </RevealTableSection>
          )}
        </FadeUp>
      </StaggerReveal>
    </div>
  );
}
