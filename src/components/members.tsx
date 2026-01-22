"use client";

import SearchComponent from "@/components/search";
import { Suspense, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import MembersLoading from "../app/members/loading";
import BlurIn from "./ui/blur-in";
import ShinyButton from "./ui/shiny-button";
import { Loader } from "lucide-react";
import { MemberPersonResult, RequestInfo, UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";
import { sortMembersByName } from "@/utils/memberUtils";
import { fetchMultiplePersonsData } from "@/services/wcaApi";
import { joinCubingKerala } from "@/services/memberApi";
import { MembersTable } from "./members/membersTable";

interface MembersComponentProps {
  membersfromdb: RequestInfo[];
}

export default function MembersComponent({
  membersfromdb,
}: MembersComponentProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membersDetails, setMembersDetails] = useState<MemberPersonResult[]>(
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

      const wcaIds = membersfromdb.map((member) => member.wcaid);
      fetchMultiplePersonsData(wcaIds)
        .then(setMembersDetails)
        .catch((error) => {
          console.error("Failed to fetch member details:", error);
          toast.error("Failed to load member details");
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  if (isLoading) {
    return <MembersLoading />;
  }

  return (
    <Suspense fallback={<MembersLoading />}>
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200 flex flex-col">
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
              <ShinyButton className="rounded w-[150px] md:w-[200px] px-3 py-1 md:px-5 md:py-2 bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 ease-in-out">
                {isJoinCkLoading ? (
                  <div className="flex items-center justify-center h-6">
                    <Loader className="animate-spin text-black" size={16} />
                  </div>
                ) : (
                  <span className="text-xs md:text-sm text-black font-semibold">
                    Join Cubing Kerala
                  </span>
                )}
              </ShinyButton>
            </div>
          </div>

          <div
            className="rounded-md border border-neutral-800"
            style={{ minHeight: "600px", overflow: "hidden" }}
          >
            <SearchComponent handleSearch={handleSearch} />
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
