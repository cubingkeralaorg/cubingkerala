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
import { MemberPersonResult } from "@/types/api";
import { formatResult } from "@/utils/wcaFormatters";

interface RankingsTableProps {
  sortedResults: MemberPersonResult[];
  selectedEvent: string;
  selectedRound: string;
  getResult: (member: MemberPersonResult) => any;
}

export function RankingsTable({
  sortedResults,
  selectedEvent,
  selectedRound,
  getResult,
}: RankingsTableProps) {
  return (
    <div className="rounded-md border border-neutral-800">
      <Table className="w-full rounded-md text-sm md:text-[15px]">
        <TableHeader>
          <TableRow className="border-neutral-800 hover:bg-transparent">
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
            const result = getResult(member);
            return (
              <TableRow
                className="border-neutral-800 hover:bg-transparent"
                key={member.id}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium text-nowrap">
                  <Link href={`/members/${member.id}`}>
                    <span className="cursor-pointer hover:text-blue-500">
                      {member.name.split("(")[0]}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="font-semibold text-nowrap">
                  {formatResult(result, selectedEvent, selectedRound)}
                </TableCell>
                <TableCell>{result?.rank?.country || ""}</TableCell>
                <TableCell>{result?.rank?.continent || ""}</TableCell>
                <TableCell>{result?.rank?.world || ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
