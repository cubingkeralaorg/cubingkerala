"use client";

import SearchComponent from "@/components/search";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { CompetitorData, RequestInfo, UserInfo } from "@/types/types";
import cookie from "cookie";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import LoadingComponent from "./loading";
import { RainbowButton } from "./ui/rainbow-button";
import BlurIn from "./ui/blur-in";
import LoginLoadingComponent from "./login-loading";

export default function MembersComponent({ membersfromdb }: { membersfromdb: RequestInfo[] }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [filteredMembersList, setFilteredMembersList] = useState<RequestInfo[]>([]);
  const [membersDetails, setMembersDetails] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsJoinCkLoading(true);
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
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 bg-black text-stone-200">
      {
        isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <LoadingComponent />
        </div>) : (
          <div className="animate-fade-in">
            <div className="flex-col justify-center items-center mb-6">
              <BlurIn
                word="Members"
                className="text-4xl text-center md:text-center font-bold tracking-tighter md:text-6xl"
              />
              <div className="flex justify-center items-center my-6">
                <RainbowButton className="text-green-400 hover:text-green-500 w-[200px]" disabled={isJoinCkLoading} onClick={handleJoinCK}>
                  {
                    isJoinCkLoading ? (
                      <div className="flex items-center justify-center h-6">
                        <LoginLoadingComponent />
                      </div>
                    ) : (
                      <span className="text-sm font-semibold">Join Cubing Kerala</span>
                    )
                  }
                </RainbowButton>
              </div>
            </div>
            <div className="mb-6">
              <SearchComponent handleSearch={handleSearch} />
            </div>
            <div className="rounded-none border-none">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent text-sm md:text-[15px] border-none">
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
                    filteredMembersList.sort((a,b)=>a.name.localeCompare(b.name)).map((member, index) => {
                      const memberDetails = membersDetails.find((details) => details.person.wca_id === member.wcaid);
                      return (
                        <TableRow className="border-none hover:bg-neutral-900 text-sm md:text-[15px]" key={index}>
                          <TableCell className="cursor-default">{index + 1}</TableCell>
                          <TableCell className="text-nowrap">
                            <Link prefetch={true} href={`/members/${member.wcaid}`}>
                              <span className="cursor-pointer hover:text-blue-500">
                                {member.name.split('(')[0]}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link prefetch={true} href={`/members/${member.wcaid}`}>
                              <span className="cursor-pointer hover:text-blue-500">
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
                        No results found
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