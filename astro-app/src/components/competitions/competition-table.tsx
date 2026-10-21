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
import { CompetitionStatusBadge } from "./status-badge";
import { formatCompetitionDateRange } from "@/utils/date-utils";
import { getEventName } from "@/utils/event-names";
import "@cubing/icons";
import type { Competition } from "@/types/competition";
import { cn } from "@/lib/utils";
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
} from "@/components/ui/data-grid";

interface CompetitionTableProps {
  upcoming: Competition[];
  past: Competition[];
  searchQuery?: string;
}

function SectionRow({ label }: { label: string }) {
  return (
    <TableRow className={DATA_GRID_ROW}>
      <TableCell
        colSpan={5}
        className={cn(DATA_GRID_CELL, "text-sm font-medium text-foreground")}
      >
        {label}
      </TableCell>
    </TableRow>
  );
}

function CompetitionRow({ competition }: { competition: Competition }) {
  const href = `/competitions/${competition.id}`;

  return (
    <TableRow className={DATA_GRID_ROW}>
      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap tabular-nums text-muted-foreground")}>
        {formatCompetitionDateRange(competition.start_date, competition.end_date)}
      </TableCell>
      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap")}>
        <a href={href} className="font-medium text-foreground hover:text-primary">
          {competition.name}
        </a>
      </TableCell>
      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap")}>
        <CompetitionStatusBadge
          competitionId={competition.id}
          startDate={competition.start_date}
          endDate={competition.end_date}
          hasResults={competition.has_results}
          cancelledAt={competition.cancelled_at}
        />
      </TableCell>
      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap")}>
        {competition.city}
      </TableCell>
      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap")}>
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
    <Table className={DATA_GRID_TABLE}>
      <TableHeader className="[&_tr]:border-0">
        <TableRow className={DATA_GRID_ROW}>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[180px] md:w-[220px] whitespace-nowrap")}>
            Date
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "whitespace-nowrap")}>
            Name
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "whitespace-nowrap")}>
            Status
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "whitespace-nowrap")}>
            Location
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "text-right whitespace-nowrap")}>
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
          <TableRow className={DATA_GRID_ROW}>
            <TableCell
              colSpan={5}
              className={cn(DATA_GRID_CELL, "py-6 text-sm text-muted-foreground")}
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
