"use client";

import { FilterComponent } from "./filter";
import { useCallback, useMemo, useState } from "react";
import { CompetitorData } from "@/types/api";
import { sortMembersByResult } from "@/utils/wca-sorting";
import { getEventName } from "@/utils/event-names";
import { RankingsTable } from "./rankings-table";
import { FilterState, RankingsComponentProps } from "@/types/rankings.types";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

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

  const handleFilterChange = useCallback((newFilter: FilterState) => {
    setSelectedFilter(newFilter);
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
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Rankings
          </h1>
          <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
            Showing results for {getEventName(selectedFilter.event)}{" "}
            {selectedFilter.round}
          </p>
        </div>
        <FilterComponent onFilterChange={handleFilterChange} />
      </div>

      <RankingsTable
        sortedResults={sortedResults}
        selectedEvent={selectedFilter.event}
        selectedRound={selectedFilter.round}
        getResult={getResult}
      />
    </div>
  );
}
