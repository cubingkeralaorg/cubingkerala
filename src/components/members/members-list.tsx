"use client";

import SearchComponent from "@/components/shared/search";
import { Suspense, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import { Loader } from "lucide-react";
import { CompetitorData, RequestInfo, UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";
import { sortMembersByName } from "@/utils/memberUtils";
import { joinCubingKerala } from "@/services/member.api";
import { MembersTable } from "./membersTable";

interface MembersComponentProps {
  membersfromdb: RequestInfo[];
  initialWcaCache?: Record<string, any>;
}

export default function MembersComponent({
  membersfromdb,
  initialWcaCache,
}: MembersComponentProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isJoinCkLoading, setIsJoinCkLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const userInfoFromCookie = getUserInfoFromCookie();
    if (userInfoFromCookie) {
      setUserInfo(userInfoFromCookie);
    }
  }, []);

  const membersDetails = useMemo(() => {
    if (!membersfromdb?.length || !initialWcaCache) return [];

    return membersfromdb.map((member) => {
      const cached = initialWcaCache[member.wcaid];
      if (cached && cached.data) {
        return cached.data as CompetitorData;
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
      } as CompetitorData;
    });
  }, [membersfromdb, initialWcaCache]);

  const filteredAndSortedMembers = useMemo(() => {
    const filtered = membersfromdb.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return sortMembersByName(filtered);
  }, [membersfromdb, searchTerm]);

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
            <div className="w-2/3 md:w-1/4 flex justify-end items-center">
              <button
                onClick={handleJoinCK}
                disabled={isJoinCkLoading}
                className={`rounded-md w-[150px] md:w-[200px] px-3 py-1 md:px-5 md:py-2 bg-card border border-border hover:bg-accent hover:text-foreground transition-all duration-200 ease-in-out ${isJoinCkLoading ? "opacity-70 cursor-not-allowed delay-0" : ""}`}
              >
                {isJoinCkLoading ? (
                  <div className="flex items-center justify-center py-[2px] md:py-[1px]">
                    <Loader className="animate-spin text-foreground" size={14} />
                  </div>
                ) : (
                  <span className="text-xs md:text-sm text-foreground font-semibold">
                    Join Cubing Kerala
                  </span>
                )}
              </button>
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
            <MembersTable
              members={filteredAndSortedMembers}
              membersDetails={membersDetails}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
