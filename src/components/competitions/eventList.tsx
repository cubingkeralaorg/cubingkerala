"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@cubing/icons";

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
    <div className="flex items-center gap-2 mt-2">
      <div className="space-y-1">
        <p className="font-medium text-[17px] md:text-[18px]">{title}</p>
        <div className="text-sm md:text-[16px] text-muted-foreground">
          {eventsToShow.map((event) => (
            <span key={event} className="inline-flex pr-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`cubing-icon event-${event}`}></span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{event}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
