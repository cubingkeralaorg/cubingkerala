"use client";

import React from "react";
import "@cubing/icons";
import { CompetitionResultEntry } from "@/types/api";
import { convertMillisecondsToTime } from "@/utils/wcaFormatters";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface CompetitionResultsProps {
  results: CompetitionResultEntry[];
}

function formatTime(value: number, eventId: string): string {
  if (value <= 0) return "DNF";
  if (eventId === "333fm") return value.toString();
  return convertMillisecondsToTime(value);
}

// WCA round type priority — higher number = later round
const ROUND_TYPE_ORDER: Record<string, number> = {
  "0": 0, // Qualification round
  "h": 1, // Combined qualification
  "1": 2, // First round
  "d": 3, // Combined First round
  "2": 4, // Second round
  "e": 5, // Combined Second round
  "3": 6, // Semi Final
  "g": 7, // Combined Semi Final
  "c": 8, // Combined Final
  "f": 9, // Final
};

function getLastRoundResults(
  results: CompetitionResultEntry[]
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
    <div className="w-full mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-green-500 mb-8">
        Results
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {eventIds.map((eventId) => (
          <div key={eventId}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`cubing-icon event-${eventId}`}></span>
              <h3 className="text-lg font-bold">{eventId}</h3>
            </div>

            <div className="rounded-md border border-border">
              <Table className="w-full rounded-md text-sm md:text-[15px]">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground w-full">Name</TableHead>
                    <TableHead className="text-muted-foreground">Best</TableHead>
                    <TableHead className="text-muted-foreground">Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grouped[eventId].map((result) => (
                    <TableRow
                      key={result.id}
                      className="border-border hover:bg-transparent"
                    >
                      <TableCell>{result.pos}</TableCell>
                      <TableCell className="font-medium text-nowrap">
                        {result.name}
                      </TableCell>
                      <TableCell className="font-semibold text-nowrap">
                        {formatTime(result.best, eventId)}
                      </TableCell>
                      <TableCell className="font-semibold text-nowrap">
                        {formatTime(result.average, eventId)}
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


