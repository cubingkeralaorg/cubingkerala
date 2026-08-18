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
import { Badge } from "@/components/ui/badge";
import {
  formatCompetitionDateRange,
  getDetailedCompetitionStatus,
} from "@/utils/dateUtils";
import { getEventName } from "@/utils/eventNames";
import "@cubing/icons";
import { Competition } from "@/types";
import { cn } from "@/lib/utils";

interface CompetitionTableProps {
  upcoming: Competition[];
  past: Competition[];
  searchQuery?: string;
}

const cellClass =
  "border border-border px-4 py-2.5 align-middle";

function SectionRow({ label }: { label: string }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={5}
        className={cn(cellClass, "py-2.5 text-sm font-medium text-foreground")}
      >
        {label}
      </TableCell>
    </TableRow>
  );
}

function CompetitionRow({ competition }: { competition: Competition }) {
  const status = getDetailedCompetitionStatus(
    competition.start_date,
    competition.end_date,
    competition.has_results,
    competition.cancelled_at || null,
  );

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className={cn(cellClass, "whitespace-nowrap tabular-nums text-muted-foreground")}>
        {formatCompetitionDateRange(competition.start_date, competition.end_date)}
      </TableCell>
      <TableCell className={cn(cellClass, "whitespace-nowrap")}>
        <Link
          href={`/competitions/${competition.id}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {competition.name}
        </Link>
      </TableCell>
      <TableCell className={cn(cellClass, "whitespace-nowrap")}>
        {status === "Upcoming" && (
          <a
            href={`https://www.worldcubeassociation.org/competitions/${competition.id}/register`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge
              variant="outline"
              className="border-none bg-primary/10 px-2 py-0 text-[11px] font-medium tracking-wide text-primary hover:bg-primary/15"
            >
              Register
            </Badge>
          </a>
        )}
        {status === "Ongoing" && (
          <Badge
            variant="outline"
            className="border-none bg-secondary px-2 py-0 text-[11px] font-medium tracking-wide text-secondary-foreground"
          >
            Ongoing
          </Badge>
        )}
        {status === "Completed" && (
          <Badge
            variant="outline"
            className="border-none bg-muted px-2 py-0 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            Completed
          </Badge>
        )}
        {status === "Cancelled" && (
          <Badge
            variant="outline"
            className="border-none bg-muted px-2 py-0 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            Cancelled
          </Badge>
        )}
      </TableCell>
      <TableCell className={cn(cellClass, "whitespace-nowrap")}>
        {competition.city}
      </TableCell>
      <TableCell className={cn(cellClass, "whitespace-nowrap")}>
        <div className="flex items-center justify-end gap-1.5">
          <TooltipProvider>
            {competition.event_ids.map((event: string) => (
              <Tooltip key={`${competition.id}-${event}`}>
                <TooltipTrigger asChild>
                  <span className={`cubing-icon event-${event} text-base`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getEventName(event)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function CompetitionTable({
  upcoming,
  past,
  searchQuery = "",
}: CompetitionTableProps) {
  const isSearch = searchQuery.trim().length > 0;

  return (
    <Table className="w-full border-collapse text-sm [&_tr]:border-0">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground w-[180px] md:w-[220px] whitespace-nowrap")}>
            Date
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Name
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Status
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 font-medium text-muted-foreground whitespace-nowrap")}>
            Location
          </TableHead>
          <TableHead className={cn(cellClass, "h-10 text-right font-medium text-muted-foreground whitespace-nowrap")}>
            Events
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <SectionRow label="Upcoming Competitions" />
        {upcoming.length > 0 ? (
          upcoming.map((competition) => (
            <CompetitionRow key={competition.id} competition={competition} />
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className={cn(cellClass, "py-6 text-sm text-muted-foreground")}
            >
              {isSearch ? (
                <p>No upcoming competitions match your search.</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    No upcoming competitions right now
                  </p>
                  <p>
                    Stay tuned — new Kerala competitions will show up here when
                    they&apos;re announced.
                  </p>
                </div>
              )}
            </TableCell>
          </TableRow>
        )}
        {past.length > 0 ? (
          <>
            <SectionRow label="Past Competitions" />
            {past.map((competition) => (
              <CompetitionRow key={competition.id} competition={competition} />
            ))}
          </>
        ) : null}
      </TableBody>
    </Table>
  );
}
