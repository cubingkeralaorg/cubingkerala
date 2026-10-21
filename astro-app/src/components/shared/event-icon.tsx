import "@cubing/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getEventName } from "@/utils/event-names";
import { cn } from "@/lib/utils";

interface EventIconProps {
  eventId: string;
  className?: string;
}

/**
 * A WCA event icon with its name as a tooltip — the one place this pairing
 * is built, so every spot an event icon appears (competition tables, the
 * detail page, personal records, results) behaves identically instead of
 * each one re-implementing its own (previously inconsistent: some used the
 * slow native `title` attribute, some had no tooltip at all).
 */
export function EventIcon({ eventId, className }: EventIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(`cubing-icon event-${eventId}`, className)} tabIndex={0} />
        </TooltipTrigger>
        <TooltipContent>{getEventName(eventId)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
