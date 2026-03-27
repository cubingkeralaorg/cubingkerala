"use client";

import { FilterComponent } from "./filter";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import { CompetitorData } from "@/types/api";
import { sortMembersByResult } from "@/utils/wcaSorting";
import { getEventName } from "@/utils/eventNames";
import { RankingsTable } from "./rankingsTable";
import { RankingsSkeleton } from "./rankingsSkeleton";
import { FilterState, RankingsComponentProps } from "@/types/rankings.types";
import { fetchMultiplePersonsData, getCachedPersonData, getUnifiedCache } from "@/services/wca.api";

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
  const [memberResults, setMemberResults] = useState<CompetitorData[]>(() => {
    if (!members?.length) return [];
    
    if (typeof window !== "undefined") {
      let currentCache = getUnifiedCache();
      if (initialWcaCache && Object.keys(initialWcaCache).length > 0) {
        const mergedCache = { ...currentCache };
        for (const [wcaId, serverEntry] of Object.entries(initialWcaCache)) {
          const localEntry = mergedCache[wcaId];
          if (!localEntry || serverEntry.updatedAt > localEntry.updatedAt) {
            mergedCache[wcaId] = serverEntry as any;
          }
        }
        currentCache = mergedCache;
      }
      
      const wcaIds = members.map((m) => m.wcaid);
      const now = Date.now();
      const missingWcaIds = wcaIds.filter((id) => {
        const cached = currentCache[id];
        return !cached || now >= cached.expiry;
      });

      if (missingWcaIds.length === 0) {
        return processResults(currentCache, members);
      }
    }
    return [];
  });

  const [selectedFilter, setSelectedFilter] = useState<FilterState>({
    event: "333",
    round: "single",
  });
  
  const [loading, setLoading] = useState(() => memberResults.length === 0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMemberResults = async () => {
      if (!members?.length) return;

      try {
        const wcaIds = members.map((member) => member.wcaid);
        
        // 1. Check for initial cache from server
        let currentCache = getUnifiedCache();
        
        if (initialWcaCache && Object.keys(initialWcaCache).length > 0) {
          // Merge initial cache into local cache based on updatedAt
          const mergedCache = { ...currentCache };
          let changed = false;
          for (const [wcaId, serverEntry] of Object.entries(initialWcaCache)) {
            const localEntry = mergedCache[wcaId];
            if (!localEntry || serverEntry.updatedAt > localEntry.updatedAt) {
              mergedCache[wcaId] = serverEntry as any;
              changed = true;
            }
          }
          if (changed) {
            localStorage.setItem("ck_members_wca_data", JSON.stringify(mergedCache));
          }
          currentCache = mergedCache;
        }

        const now = Date.now();
        const missingWcaIds = wcaIds.filter(id => {
          const cached = currentCache[id];
          return !cached || now >= cached.expiry;
        });

        // 2. If everything is cached, show immediately
        if (missingWcaIds.length === 0) {
          setMemberResults(processResults(currentCache, members));
          setLoading(false);
          return;
        }

        // 3. Otherwise, show what we have and fetch missing
        const partialResults = wcaIds
          .map(id => currentCache[id]?.data)
          .filter((data): data is CompetitorData => Boolean(data));
          
        if (partialResults.length > 0) {
           setMemberResults(partialResults);
           if (partialResults.length < wcaIds.length) {
             setLoading(true);
           } else {
             setLoading(false);
           }
        }

        // Fetch missing data
        await fetchMultiplePersonsData(missingWcaIds);
        
        // 4. Final merge
        const finalCache = getUnifiedCache();
        setMemberResults(processResults(finalCache, members));
      } catch (error) {
        console.error("Error fetching member results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberResults();
  }, [members, initialWcaCache]);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div>
              <BlurIn
                word="Rankings"
                className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-4"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Showing results for{" "}
                <span>{getEventName(selectedFilter.event)}</span>
                {"  "}
                <span>{selectedFilter.round}</span>
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <FilterComponent onFilterChange={setSelectedFilter} />
            </div>
          </div>

          {loading ? (
            <RankingsSkeleton />
          ) : (
            <RankingsTable
              sortedResults={sortedResults}
              selectedEvent={selectedFilter.event}
              selectedRound={selectedFilter.round}
              getResult={getResult}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
