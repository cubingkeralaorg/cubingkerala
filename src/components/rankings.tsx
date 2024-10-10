'use client';

import { FilterComponent } from "@/components/filter";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MemberPersonResult, RequestInfo } from "@/types/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingComponent from "./loading";

export default function RankingsComponent({ members }: { members: RequestInfo[] }) {
  const [membersList, setMembersList] = useState<RequestInfo[]>([]);
  const [memberResults, setMemberResults] = useState<MemberPersonResult[]>([]);
  const [sortedResults, setSortedResults] = useState<MemberPersonResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{ event: string; round: string }>({ event: "333", round: "single" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (members) {
      setMembersList(members);
    }
  }, [members]);

  useEffect(() => {
    if (membersList.length > 0) {
      fetchMemberResults();
    }
  }, [membersList]);

  const fetchMemberResults = async () => {
    try {
      const results = await Promise.all(
        membersList.map(member =>
          axios.get(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${member.wcaid}.json`)
        )
      );

      const data: MemberPersonResult[] = results.map(res => res.data);
      setMemberResults(data);
      // Automatically sort on initial load for event "333" and round "single"
      sortMembers(data);
    } catch (error) {
      console.error("Error fetching member results:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const sortMembers = (results: MemberPersonResult[]) => {
    const { event, round } = selectedFilter;
    const roundType = round === "average" ? "averages" : "singles";

    const sorted = results.slice().sort((a, b) => {
      const aEvent = a.rank[roundType]?.find(r => r.eventId === event);
      const bEvent = b.rank[roundType]?.find(r => r.eventId === event);
      const aBest = aEvent ? aEvent.best : Infinity;
      const bBest = bEvent ? bEvent.best : Infinity;
      return aBest - bBest;
    });

    setSortedResults(sorted);
  };

  function convertMillisecondsToTime(milliseconds: number) {
    if (milliseconds === Infinity) { return '' }
    if (milliseconds < 0) {
      return 'DNF';
    }

    let totalSeconds = milliseconds / 100;

    if (totalSeconds < 60) {
      return totalSeconds.toFixed(2);
    } else {
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = (totalSeconds % 60).toFixed(2);
      if (Number(seconds) < 10) {
        return `${minutes}.0${seconds}`;
      }
      return `${minutes}.${seconds}`;
    }
  }


  function convertMbldToMinutes(number: number): string {
    if(number === Infinity) { return '' }
    const numStr = `0${number.toString()}`;

    const DD = parseInt(numStr.substring(1, 3), 10);
    const TTTTT = parseInt(numStr.substring(3, 8), 10);
    const MM = parseInt(numStr.substring(8, 10), 10);

    const difference = 99 - DD;
    const missed = MM;
    const solved = difference + missed;
    const attempted = solved + missed;

    const totalSeconds = TTTTT;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const timeFormatted = `${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;

    const finalOutput = `${solved}/${attempted} ${timeFormatted}`;
    return finalOutput;
  }


  // Effect to sort members whenever selectedFilter changes
  useEffect(() => {
    if (memberResults.length > 0) {
      sortMembers(memberResults);
    }
  }, [selectedFilter, memberResults]);

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-stone-200">
      {isLoading ? (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <LoadingComponent />
        </div>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-start mb-6 md:mb-10 text-green-500">Rankings</h1>
          <div className="flex items-center justify-center gap-3 md:justify-between mb-6">
            <div className="flex items-start justify-start w-full">
              <FilterComponent
                onFilterChange={setSelectedFilter}
              />
            </div>
          </div>
          <div className="overflow-auto rounded-none max-h-[400px]">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-neutral-500">#</TableHead>
                  <TableHead className="text-neutral-500">Name</TableHead>
                  <TableHead className="text-neutral-500">Best</TableHead>
                  <TableHead className="text-neutral-500">NR</TableHead>
                  <TableHead className="text-neutral-500">CR</TableHead>
                  <TableHead className="text-neutral-500">WR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((member, index) => {
                  const result = member.rank[selectedFilter.round === 'average' ? 'averages' : 'singles'].find(r => r.eventId === selectedFilter.event);
                  return (
                    <TableRow className="border-none hover:bg-neutral-900" key={member.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium text-nowrap">
                        <Link href={`/members/${member.id}`}><span className="cursor-pointer hover:text-blue-500">{member.name.split('(')[0]}</span></Link>
                      </TableCell>
                      <TableCell className="font-semibold text-nowrap">
                        {result?.eventId === '333fm' && selectedFilter.round === 'single'
                          ? result.best
                          : result?.eventId === '333mbf'
                          ? convertMbldToMinutes(result?.best || Infinity)
                          : convertMillisecondsToTime(result?.best || Infinity)
                          }
                      </TableCell>
                      <TableCell>{result?.rank?.country || ''}</TableCell>
                      <TableCell>{result?.rank?.continent || ''}</TableCell>
                      <TableCell>{result?.rank?.world || ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}




