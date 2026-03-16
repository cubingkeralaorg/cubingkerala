"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { CompetitorData } from "@/types/api";
import { formatResult } from "@/utils/wcaFormatters";

interface RankingsTableProps {
  sortedResults: CompetitorData[];
  selectedEvent: string;
  selectedRound: string;
  getResult: (member: CompetitorData) => any;
}

export function RankingsTable({
  sortedResults,
  selectedEvent,
  selectedRound,
  getResult,
}: RankingsTableProps) {
  return (
    <div className="rounded-md border border-border">
      <Table className="w-full rounded-md text-sm md:text-[15px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground w-[50px]">#</TableHead>
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground w-[100px]">Best</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">NR</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">CR</TableHead>
            <TableHead className="text-muted-foreground w-[60px]">WR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((member, index) => {
            const result = getResult(member);
            return (
              <TableRow
                className="border-border hover:bg-transparent"
                key={member.person.id}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium text-nowrap">
                  <Link href={`/members/${member.person.id}`}>
                    {/* @ts-ignore */}
                    <span className={`cursor-pointer hover:text-blue-500 ${member.isUnavailable ? "text-muted-foreground opacity-70" : ""}`}>
                      {member.person.name.split("(")[0]}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="font-semibold text-nowrap">
                  {/* @ts-ignore */}
                  {member.isUnavailable ? (
                    <span className="text-xs text-red-500/70 font-normal">
                      Data Unavailable
                    </span>
                  ) : (
                    formatResult(result, selectedEvent, selectedRound)
                  )}
                </TableCell>
                <TableCell>{result?.country_rank || ""}</TableCell>
                <TableCell>{result?.continent_rank || ""}</TableCell>
                <TableCell>{result?.world_rank || ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
