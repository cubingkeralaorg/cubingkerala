"use client";

import "@cubing/icons";
import { CompetitionResultEntry } from "@/types/api";
import { formatEventResult } from "@/utils/wcaFormatters";
import { getEventName } from "@/utils/eventNames";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
  DATA_GRID_WRAP,
} from "@/components/ui/data-grid";

interface CompetitionResultsProps {
  results: CompetitionResultEntry[];
}

function formatTime(
  value: number,
  eventId: string,
  type: "single" | "average" = "single",
): string {
  if (value <= 0) return "DNF";
  return formatEventResult(value, eventId, type) || "";
}

const ROUND_TYPE_ORDER: Record<string, number> = {
  "0": 0,
  h: 1,
  "1": 2,
  d: 3,
  "2": 4,
  e: 5,
  "3": 6,
  g: 7,
  c: 8,
  f: 9,
};

function getLastRoundResults(
  results: CompetitionResultEntry[],
): Record<string, CompetitionResultEntry[]> {
  const byEvent: Record<string, CompetitionResultEntry[]> = {};
  for (const result of results) {
    if (!byEvent[result.event_id]) {
      byEvent[result.event_id] = [];
    }
    byEvent[result.event_id].push(result);
  }

  const finalResults: Record<string, CompetitionResultEntry[]> = {};
  for (const eventId of Object.keys(byEvent)) {
    const eventResults = byEvent[eventId];
    let maxOrder = -1;
    let lastRoundType = "";
    for (const r of eventResults) {
      const order = ROUND_TYPE_ORDER[r.round_type_id] ?? -1;
      if (order > maxOrder) {
        maxOrder = order;
        lastRoundType = r.round_type_id;
      }
    }
    finalResults[eventId] = eventResults
      .filter((r) => r.round_type_id === lastRoundType)
      .sort((a, b) => a.pos - b.pos)
      .slice(0, 3);
  }

  return finalResults;
}

export function CompetitionResults({ results }: CompetitionResultsProps) {
  if (results.length === 0) return null;

  const grouped = getLastRoundResults(results);
  const eventIds = Object.keys(grouped);

  if (eventIds.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Results
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {eventIds.map((eventId) => (
          <div key={eventId} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`cubing-icon event-${eventId}`} />
              <h3 className="text-lg font-semibold tracking-tight">
                {getEventName(eventId)}
              </h3>
            </div>
            <div className={DATA_GRID_WRAP}>
              <Table className={DATA_GRID_TABLE}>
                <TableHeader className="[&_tr]:border-0">
                  <TableRow className={DATA_GRID_ROW}>
                    <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                      #
                    </TableHead>
                    <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                      Name
                    </TableHead>
                    <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                      Best
                    </TableHead>
                    <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
                      Average
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grouped[eventId].map((result) => (
                    <TableRow key={result.id} className={DATA_GRID_ROW}>
                      <TableCell
                        className={cn(
                          DATA_GRID_CELL,
                          "tabular-nums text-muted-foreground",
                        )}
                      >
                        {result.pos}
                      </TableCell>
                      <TableCell
                        className={cn(
                          DATA_GRID_CELL,
                          "whitespace-nowrap font-medium",
                        )}
                      >
                        {result.name}
                      </TableCell>
                      <TableCell
                        className={cn(DATA_GRID_CELL, "whitespace-nowrap tabular-nums")}
                      >
                        {formatTime(result.best, eventId, "single")}
                      </TableCell>
                      <TableCell
                        className={cn(DATA_GRID_CELL, "whitespace-nowrap tabular-nums")}
                      >
                        {formatTime(result.average, eventId, "average")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
