"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@cubing/icons";
import { getEventName } from "@/utils/event-names";

interface EventsListProps {
  eventIds: string[];
  mainEventId?: string;
  showMainEvent?: boolean;
  title: string;
}

export function EventsList({
  eventIds,
  mainEventId,
  showMainEvent = false,
  title,
}: EventsListProps) {
  const eventsToShow = showMainEvent && mainEventId ? [mainEventId] : eventIds;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
        {eventsToShow.map((event) => (
          <TooltipProvider key={event}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`cubing-icon event-${event} text-lg`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{getEventName(event)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
