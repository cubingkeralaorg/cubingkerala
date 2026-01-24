"use client";

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
}

export function PersonalRecordsTable({
  personalRecords,
}: PersonalRecordsTableProps) {
  return (
    <div className="w-full max-w-screen-md mt-5 border rounded-md border-neutral-800">
      <Table className="text-sm md:text-[15px] rounded-md">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-neutral-800">
            <TableHead className="text-neutral-500">Event</TableHead>
            <TableHead className="text-neutral-500">NR</TableHead>
            <TableHead className="text-neutral-500">CR</TableHead>
            <TableHead className="text-neutral-500">WR</TableHead>
            <TableHead className="text-neutral-500">Best</TableHead>
            <TableHead className="text-neutral-500">Average</TableHead>
            <TableHead className="text-neutral-500">WR</TableHead>
            <TableHead className="text-neutral-500">CR</TableHead>
            <TableHead className="text-neutral-500">NR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalRecords.map((record, index) => (
            <TableRow
              className="hover:bg-transparent border-y-neutral-800"
              key={index}
            >
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className={`cubing-icon event-${record.event}`}
                      ></span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-green-400 py-1 px-2 rounded-none text-black">
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
  );
}
