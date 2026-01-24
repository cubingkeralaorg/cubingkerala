"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
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
        <div className="text-sm md:text-[16px] text-stone-400">
          {eventsToShow.map((event) => (
            <TooltipProvider key={event}>
              <Tooltip>
                <TooltipTrigger>
                  <span className={`cubing-icon event-${event} pr-3`}></span>
                </TooltipTrigger>
                <TooltipContent className="bg-green-400 rounded-none text-xs py-1 px-2 text-black">
                  <p>{event}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
