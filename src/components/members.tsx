"use client";

import SearchComponent from "@/components/search";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { CompetitorData, RequestInfo, UserInfo } from "@/types/types";
import cookie from "cookie";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import LoadingComponent from "./loading";
import ShimmerButton from "./magicui/shimmer-button";

export default function MembersComponent({ membersfromdb }: { membersfromdb: RequestInfo[] }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [filteredMembersList, setFilteredMembersList] = useState<RequestInfo[]>([]);
  const [membersDetails, setMembersDetails] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [membersfromdb]);

  const getMembersDetails = async (wcaids: string[]) => {
    try {
      const responses = await Promise.all(
        wcaids.map((wcaid) =>
          axios.get(`https://www.worldcubeassociation.org/api/v0/persons/${wcaid}`)
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

    try {
      const response = await fetch('/api/join-cubingkerala', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        toast(`${error.message}`);
      }
    } catch (error) {
      toast(`${error}`);
    }
  };

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 bg-black text-stone-200">
      {
        isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <LoadingComponent />
        </div>) : (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-start mb-10 text-green-500">Members</h1>
            <div className="flex items-center justify-center gap-2 md:justify-between mb-6">
              <SearchComponent handleSearch={handleSearch} />
              <ShimmerButton onClick={handleJoinCK}>
                <span className="text-xs md:text-sm px-4 md:px-0 font-semibold text-green-400">Join Cubing Kerala</span>
              </ShimmerButton>
            </div>
            <div className="overflow-auto rounded-none border-none h-[400px]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-neutral-900 border-none">
                    <TableHead className="text-neutral-500">#</TableHead>
                    <TableHead className="text-neutral-500">Name</TableHead>
                    <TableHead className="text-neutral-500">WCA ID</TableHead>
                    <TableHead className="text-neutral-500">Role</TableHead>
                    <TableHead className="hidden md:table-cell text-neutral-500">Competitions</TableHead>
                    <TableHead className="hidden md:table-cell text-neutral-500">Medals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembersList.length > 0 ? (
                    filteredMembersList.map((member, index) => {
                      const memberDetails = membersDetails.find((details) => details.person.wca_id === member.wcaid);
                      return (
                        <TableRow className="border-none hover:bg-neutral-900" key={index}>
                          <TableCell className="cursor-default">{index + 1}</TableCell>
                          <TableCell className="text-nowrap">
                            <Link prefetch={true} href={`/members/${member.wcaid}`}>
                              <span className="hover:underline hover:underline-offset-2 cursor-pointer hover:text-blue-500">
                                {member.name.split('(')[0]}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link prefetch={true} href={`/members/${member.wcaid}`}>
                              <span className="hover:underline hover:underline-offset-2 cursor-pointer hover:text-blue-500">
                                {member.wcaid}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="cursor-default text-nowrap">
                            {(member.role).split('')[0].toUpperCase() + (member.role).slice(1)}
                          </TableCell>
                          <TableCell className="cursor-default hidden md:table-cell">
                            {memberDetails?.competition_count || 0}
                          </TableCell>
                          <TableCell className="cursor-default hidden md:table-cell">
                            {memberDetails?.medals.total || 0}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell className="text-stone-600 px-4 hover:bg-neutral-900 py-4" colSpan={6}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      }
    </div>
  );
}