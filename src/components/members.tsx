"use client";

import SearchComponent from "@/components/search";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Suspense, useEffect, useState } from "react";
import {
  MemberPersonResult,
  RequestInfo,
  UserInfo,
} from "@/types/types";
import cookie from "cookie";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import MembersLoading from "../app/members/loading";
import BlurIn from "./ui/blur-in";
import ShinyButton from "./ui/shiny-button";
import { Loader } from "lucide-react";

export default function MembersComponent({
  membersfromdb,
}: {
  membersfromdb: RequestInfo[];
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [filteredMembersList, setFilteredMembersList] = useState<RequestInfo[]>(
    []
  );
  const [membersDetails, setMembersDetails] = useState<MemberPersonResult[]>(
    []
  );
  const [isJoinCkLoading, setIsJoinCkLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const cookies = cookie.parse(document.cookie);
    const userInfoFromCookie = cookies.userInfo;
    if (userInfoFromCookie) {
      setUserInfo(JSON.parse(userInfoFromCookie));
    }
    if (membersfromdb) {
      setMembersList(membersfromdb);
      setFilteredMembersList(membersfromdb);
      getMembersDetails(membersfromdb.map((member) => member.wcaid));
    }
  }, [membersfromdb]);

  const getMembersDetails = async (wcaids: string[]) => {
    try {
      const responses = await Promise.all(
        wcaids.map((wcaid) =>
          axios.get(
            `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${wcaid}.json`
          )
        )
      );
      setMembersDetails(responses.map((response) => response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    const filteredMembers = membersList.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembersList(filteredMembers);
  };

  const handleJoinCK = async () => {
    if (userInfo == null) {
      toast.error("Please login to join Cubing Kerala");
      return;
    }
    setIsJoinCkLoading(true);
    try {
      const response = await fetch("/api/join-cubingkerala", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const data = await response.json();
        setIsJoinCkLoading(false);
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        setIsJoinCkLoading(false);
        toast(`${error.message}`);
      }
    } catch (error) {
      setIsJoinCkLoading(false);
      toast(`${error}`);
    }
  };

  return (
    <Suspense fallback={<MembersLoading />}>
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200 flex flex-col">
        <div className="animate-fade-in">
          <div className="flex justify-between items-center gap-6 mb-6">
            <BlurIn
              word="Members"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
            />
            <div
              onClick={() => handleJoinCK()}
              className="w-2/3 md:w-1/4 flex justify-end items-center"
            >
              <ShinyButton className="rounded px-3 py-1 md:px-5 md:py-2 bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 ease-in-out">
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
            <Table className="w-full">
              <TableHeader className="border-y border-y-neutral-800">
                <TableRow className="hover:bg-transparent text-sm md:text-[15px] border-none">
                  <TableHead className="text-neutral-500 ">#</TableHead>
                  <TableHead className="text-neutral-500 ">Name</TableHead>
                  <TableHead className="text-neutral-500 ">WCA ID</TableHead>
                  <TableHead className="text-neutral-500 ">Role</TableHead>
                  <TableHead className="text-neutral-500 ">
                    Competitions
                  </TableHead>
                  <TableHead className="text-neutral-500 ">Medals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembersList.length > 0 ? (
                  filteredMembersList
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((member, index) => {
                      const memberDetails = membersDetails.find(
                        (details) => details.id === member.wcaid
                      );
                      return (
                        <TableRow
                          className="border-y-neutral-800 hover:bg-neutral-900 text-sm md:text-[15px]"
                          key={index}
                        >
                          <TableCell className="cursor-default ">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-nowrap ">
                            <Link
                              prefetch={true}
                              href={`/members/${member.wcaid}`}
                            >
                              <span className="cursor-pointer hover:text-blue-500">
                                {member.name.split("(")[0]}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              prefetch={true}
                              href={`https://www.worldcubeassociation.org/persons/${member.wcaid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="cursor-pointer hover:text-blue-500">
                                {member.wcaid}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="cursor-default text-nowrap ">
                            {member.role.split("")[0].toUpperCase() +
                              member.role.slice(1)}
                          </TableCell>
                          <TableCell className="cursor-default">
                            {memberDetails?.numberOfCompetitions || 0}
                          </TableCell>
                          <TableCell className="cursor-default">
                            {(memberDetails?.medals.gold || 0) +
                              (memberDetails?.medals.silver || 0) +
                              (memberDetails?.medals.bronze || 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      className="text-stone-600 px-4 hover:bg-neutral-900 py-4"
                      colSpan={6}
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
