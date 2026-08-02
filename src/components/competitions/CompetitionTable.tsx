"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  formatCompetitionDateRange,
  getDetailedCompetitionStatus,
} from "@/utils/dateUtils";
import { getEventName } from "@/utils/eventNames";
import "@cubing/icons";
import { Competition } from "@/types";
import {
  AnimatedTableBody,
  AnimatedTableRow,
} from "@/components/ui/reveal-table";

interface CompetitionTableProps {
  competitions: Competition[];
  searchQuery?: string;
}

export function CompetitionTable({
  competitions,
  searchQuery = "",
}: CompetitionTableProps) {
  return (
      <Table className="w-full text-sm md:text-[15px]">
        <AnimatedTableBody>
          {competitions.map((competition, index) => {
            if (competition.id === "upcoming-header" || competition.id === "past-header") {
              const nextId = competitions[index + 1]?.id;
              const showColumnHeaders = nextId !== "upcoming-empty";

              return (
                <React.Fragment key={competition.id}>
                  <AnimatedTableRow className="border-b border-t border-border">
                    <TableCell colSpan={5} className={`text-sm py-3 font-semibold ${competition.id === "upcoming-header" ? "text-green-500" : "text-red-500"}`}>
                      {competition.id === "upcoming-header" ? "Upcoming Competitions" : "Past Competitions"}
                    </TableCell>
                  </AnimatedTableRow>
                  {showColumnHeaders ? (
                    <AnimatedTableRow className="border-y border-y-border border-border">
                      <TableHead className="text-muted-foreground w-[180px] md:w-[220px] whitespace-nowrap transition-none">Date</TableHead>
                      <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Name</TableHead>
                      <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Status</TableHead>
                      <TableHead className="text-muted-foreground whitespace-nowrap transition-none">Location</TableHead>
                      <TableHead className="text-muted-foreground whitespace-nowrap transition-none text-right">Events</TableHead>
                    </AnimatedTableRow>
                  ) : null}
                </React.Fragment>
              );
            }

            if (competition.id === "upcoming-empty") {
              const isSearch = searchQuery.trim().length > 0;
              return (
                <AnimatedTableRow
                  key="upcoming-empty"
                  className="border-border"
                >
                  <TableCell
                    colSpan={5}
                    className="py-6 text-sm text-muted-foreground"
                  >
                    {isSearch ? (
                      <p>No upcoming competitions match your search.</p>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          No upcoming competitions right now
                        </p>
                        <p>
                          Stay tuned — new Kerala competitions will show up here
                          when they&apos;re announced.
                        </p>
                      </div>
                    )}
                  </TableCell>
                </AnimatedTableRow>
              );
            }

            const status = getDetailedCompetitionStatus(
              competition.start_date,
              competition.end_date,
              competition.has_results,
              competition.cancelled_at || null
            );

            return (
              <AnimatedTableRow
                key={competition.id}
                className="border-border"
              >
                <TableCell className="whitespace-nowrap transition-none">
                  {formatCompetitionDateRange(competition.start_date, competition.end_date)}
                </TableCell>
                <TableCell className="whitespace-nowrap transition-none">
                  <Link
                    href={`/competitions/${competition.id}`}
                    className="hover:text-blue-500 transition-colors font-medium text-foreground"
                  >
                    {competition.name}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap transition-none">
                  {status === "Upcoming" && (
                    <a href={`https://www.worldcubeassociation.org/competitions/${competition.id}/register`} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="text-green-500 bg-green-500/5 hover:bg-green-500/15 transition-colors py-0 px-2 border-none text-[11px] font-medium tracking-wide">
                        Register
                      </Badge>
                    </a>
                  )}
                  {status === "Ongoing" && (
                    <Badge variant="outline" className="text-blue-500 bg-blue-500/5 py-0 px-2 border-none text-[11px] font-medium tracking-wide">
                      Ongoing
                    </Badge>
                  )}
                  {status === "Completed" && (
                    <Badge variant="outline" className="text-red-500 bg-red-500/5 py-0 px-2 border-none text-[11px] font-medium tracking-wide">
                      Completed
                    </Badge>
                  )}
                  {status === "Cancelled" && (
                    <Badge variant="outline" className="text-gray-500 bg-gray-500/5 py-0 px-2 border-none text-[11px] font-medium tracking-wide">
                      Cancelled
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap transition-none">
                  {competition.city}
                </TableCell>
                <TableCell className="whitespace-nowrap transition-none">
                  <div className="flex items-center justify-end gap-1.5">
                    <TooltipProvider>
                      {competition.event_ids.map((event: string) => (
                        <Tooltip key={`${competition.id}-${event}`}>
                          <TooltipTrigger asChild>
                            <span
                              className={`cubing-icon event-${event} text-base`}
                            ></span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getEventName(event)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </TableCell>
              </AnimatedTableRow>
            );
          })}
        </AnimatedTableBody>
      </Table>
  );
}
