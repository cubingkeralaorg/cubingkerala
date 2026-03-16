"use client";

import SearchComponent from "@/components/shared/search";
import { Suspense, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import ShinyButton from "../ui/shiny-button";
import { Loader } from "lucide-react";
import { CompetitorData, RequestInfo, UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";
import { sortMembersByName } from "@/utils/memberUtils";
import { fetchMultiplePersonsData, getCachedPersonData, getUnifiedCache } from "@/services/wca.api";
import { joinCubingKerala } from "@/services/member.api";
import { MembersTable } from "./membersTable";
import { MembersSkeleton } from "./membersSkeleton";

interface MembersComponentProps {
  membersfromdb: RequestInfo[];
}

export default function MembersComponent({
  membersfromdb,
}: MembersComponentProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membersDetails, setMembersDetails] = useState<CompetitorData[]>(
    [],
  );
  const [isJoinCkLoading, setIsJoinCkLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const userInfoFromCookie = getUserInfoFromCookie();
    if (userInfoFromCookie) {
      setUserInfo(userInfoFromCookie);
    }

    if (membersfromdb) {
      setMembersList(membersfromdb);
      
      // 1. Clean up legacy individual cache keys (one-time cleanup)
      const hasCleaned = localStorage.getItem("ck_legacy_cleaned");
      if (!hasCleaned) {
        import("@/services/wca.api").then(m => m.cleanLegacyCache());
        localStorage.setItem("ck_legacy_cleaned", "true");
      }

      const wcaIds = membersfromdb.map((member) => member.wcaid);
      
      // 2. Perform synchronous cache check for instant load
      const cachedDetails: CompetitorData[] = [];
      const missingWcaIds: string[] = [];
      
      const cache = getUnifiedCache();
      const now = Date.now();

      for (const wcaId of wcaIds) {
        const cached = cache[wcaId];
        if (cached && now < cached.expiry) {
          cachedDetails.push(cached.data);
        } else {
          missingWcaIds.push(wcaId);
        }
      }

      // 3. Instant UI Update
      if (cachedDetails.length > 0) {
        setMembersDetails(cachedDetails);
        // We can hide loading immediately if we have some data to show
        setIsLoading(false);
      } else if (wcaIds.length > 0) {
        // Only show loading if we have ABSOLUTELY NO data for anyone
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }

      // 4. Strictly Incremental Background Fetch
      if (missingWcaIds.length > 0) {
        // Only fetch what is actually missing
        fetchMultiplePersonsData(wcaIds)
          .then(() => {
            // After potential fetch, consolidate all data including placeholders
            const finalCache = getUnifiedCache();
            const resultsWithPlaceholders: CompetitorData[] = [];
            
            for (const member of membersfromdb) {
              const cached = finalCache[member.wcaid];
              if (cached && cached.data) {
                resultsWithPlaceholders.push(cached.data);
              } else {
                resultsWithPlaceholders.push({
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
                });
              }
            }
            setMembersDetails(resultsWithPlaceholders);
          })
          .catch((error) => {
            console.error("Failed to fetch missing member details:", error);
            if (cachedDetails.length === 0) {
              toast.error("Failed to load member details");
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // No missing IDs, but still ensure we have a complete list if some were already missing in cache
        const finalCache = getUnifiedCache();
        const resultsWithPlaceholders: CompetitorData[] = [];
        for (const member of membersfromdb) {
          const cached = finalCache[member.wcaid];
          if (cached && cached.data) {
            resultsWithPlaceholders.push(cached.data);
          } else {
            resultsWithPlaceholders.push({
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
            });
          }
        }
        setMembersDetails(resultsWithPlaceholders);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [membersfromdb]);

  const filteredAndSortedMembers = useMemo(() => {
    const filtered = membersList.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return sortMembersByName(filtered);
  }, [membersList, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleJoinCK = async () => {
    if (!userInfo) {
      toast.error("Please login to join Cubing Kerala");
      return;
    }

    setIsJoinCkLoading(true);

    try {
      const data = await joinCubingKerala(userInfo);
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join Cubing Kerala",
      );
    } finally {
      setIsJoinCkLoading(false);
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-foreground flex flex-col">
        <div className="animate-fade-in">
          <div className="flex justify-between items-center gap-6 mb-4">
            <BlurIn
              word="Members"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
            />
            <div
              onClick={handleJoinCK}
              className="w-2/3 md:w-1/4 flex justify-end items-center"
            >
              <ShinyButton className="rounded-lg w-[150px] md:w-[200px] px-3 py-1 md:px-5 md:py-2 bg-secondary border border-border hover:bg-accent/80 hover:border-foreground/20 transition-all duration-200 ease-in-out">
                {isJoinCkLoading ? (
                  <div className="flex items-center justify-center h-6">
                    <Loader className="animate-spin text-foreground" size={16} />
                  </div>
                ) : (
                  <span className="text-xs md:text-sm text-foreground font-semibold">
                    Join Cubing Kerala
                  </span>
                )}
              </ShinyButton>
            </div>
          </div>

          <div
            className="rounded-md border border-border"
            style={{ minHeight: "600px", overflow: "hidden" }}
          >
            <SearchComponent 
              handleSearch={handleSearch} 
              placeholder="Search Member" 
            />
            {isLoading ? (
              <MembersSkeleton />
            ) : (
              <MembersTable
                members={filteredAndSortedMembers}
                membersDetails={membersDetails}
              />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
