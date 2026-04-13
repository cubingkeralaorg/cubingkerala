"use client";
import Link from "next/link";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatEventResult } from "@/utils/wcaFormatters";
import "@cubing/icons";

interface PersonalRecord {
  event: string;
  ranking: any;
}

interface PersonalRecordsTableProps {
  personalRecords: PersonalRecord[];
  wcaid: string;
  competitionCount: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export function PersonalRecordsTable({
  personalRecords,
  wcaid,
  competitionCount,
  medals,
}: PersonalRecordsTableProps) {
  return (
    <div className="w-full max-w-screen-md mt-5 flex flex-col gap-3">
      {/* Stats Box */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-3 py-3 px-4 md:px-8 w-full border rounded-md border-border bg-card text-foreground text-sm shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">WCA ID:</span>
          <Link
            className="hover:text-blue-500 transition-colors font-semibold"
            href={`https://www.worldcubeassociation.org/persons/${wcaid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {wcaid}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Competitions:</span>
          <span className="font-semibold">{competitionCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Medals:</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"/><span className="font-semibold">{medals.gold}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400"/><span className="font-semibold">{medals.silver}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-800"/><span className="font-semibold">{medals.bronze}</span></div>
          </div>
        </div>
      </div>

      {/* Table Box */}
      <div className="w-full border rounded-md border-border bg-card shadow-sm">
        <Table className="text-sm md:text-[15px] rounded-md">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Event</TableHead>
            <TableHead className="text-muted-foreground">NR</TableHead>
            <TableHead className="text-muted-foreground">CR</TableHead>
            <TableHead className="text-muted-foreground">WR</TableHead>
            <TableHead className="text-muted-foreground">Best</TableHead>
            <TableHead className="text-muted-foreground">Average</TableHead>
            <TableHead className="text-muted-foreground">WR</TableHead>
            <TableHead className="text-muted-foreground">CR</TableHead>
            <TableHead className="text-muted-foreground">NR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalRecords.map((record, index) => (
            <TableRow
              className="hover:bg-transparent border-border"
              key={index}
            >
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-default">
                      <span
                        className={`cubing-icon event-${record.event}`}
                      ></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{record.event}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              {/* Single Rankings */}
              <TableCell>
                {record.ranking?.single?.country_rank ?? null}
              </TableCell>
              <TableCell>
                {record.ranking?.single?.continent_rank ?? null}
              </TableCell>
              <TableCell>
                {record.ranking?.single?.world_rank ?? null}
              </TableCell>

              {/* Single Best Time */}
              <TableCell className="font-semibold text-nowrap">
                {formatEventResult(record.ranking?.single?.best, record.event)}
              </TableCell>

              {/* Average Best Time */}
              <TableCell className="font-semibold text-nowrap">
                {record.event !== "333mbf"
                  ? formatEventResult(
                      record.ranking?.average?.best,
                      record.event,
                      "average"
                    )
                  : null}
              </TableCell>

              {/* Average Rankings */}
              <TableCell>
                {record.ranking?.average?.world_rank ?? null}
              </TableCell>
              <TableCell>
                {record.ranking?.average?.continent_rank ?? null}
              </TableCell>
              <TableCell>
                {record.ranking?.average?.country_rank ?? null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
