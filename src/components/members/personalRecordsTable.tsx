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
    <div className="w-full max-w-screen-md mt-5 border rounded-md border-border">
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
                    <TooltipTrigger>
                      <span
                        className={`cubing-icon event-${record.event}`}
                      ></span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-green-500 py-1 px-2 rounded-none text-foreground">
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
