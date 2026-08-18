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
import { formatEventResult } from "@/utils/wca-formatters";
import { getEventName } from "@/utils/event-names";
import { cn } from "@/lib/utils";
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
  DATA_GRID_WRAP,
} from "@/components/ui/data-grid";
import "@cubing/icons";

interface PersonalRecord {
  event: string;
  ranking: {
    single?: {
      country_rank?: number;
      continent_rank?: number;
      world_rank?: number;
      best?: number;
    };
    average?: {
      country_rank?: number;
      continent_rank?: number;
      world_rank?: number;
      best?: number;
    };
  };
}

interface PersonalRecordsTableProps {
  personalRecords: PersonalRecord[];
}

export function PersonalRecordsTable({
  personalRecords,
}: PersonalRecordsTableProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Personal records</h2>
      <div className={DATA_GRID_WRAP}>
        <Table className={DATA_GRID_TABLE}>
          <TableHeader className="[&_tr]:border-0">
            <TableRow className={DATA_GRID_ROW}>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                Event
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                NR
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                CR
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                WR
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                Best
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                Average
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                WR
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                CR
              </TableHead>
              <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                NR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalRecords.map((record) => (
              <TableRow key={record.event} className={DATA_GRID_ROW}>
                <TableCell className={DATA_GRID_CELL}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-default">
                        <span className={`cubing-icon event-${record.event}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getEventName(record.event)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {record.ranking?.single?.country_rank ?? null}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {record.ranking?.single?.continent_rank ?? null}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {record.ranking?.single?.world_rank ?? null}
                </TableCell>
                <TableCell
                  className={cn(DATA_GRID_CELL, "whitespace-nowrap tabular-nums")}
                >
                  {formatEventResult(
                    record.ranking?.single?.best,
                    record.event,
                  )}
                </TableCell>
                <TableCell
                  className={cn(DATA_GRID_CELL, "whitespace-nowrap tabular-nums")}
                >
                  {record.event !== "333mbf"
                    ? formatEventResult(
                        record.ranking?.average?.best,
                        record.event,
                        "average",
                      )
                    : null}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {record.ranking?.average?.world_rank ?? null}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {record.ranking?.average?.continent_rank ?? null}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
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
