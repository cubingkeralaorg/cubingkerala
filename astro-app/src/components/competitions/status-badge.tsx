import { Badge } from "@/components/ui/badge";
import { getDetailedCompetitionStatus } from "@/utils/date-utils";

interface CompetitionStatusBadgeProps {
  competitionId: string;
  startDate: string;
  endDate: string;
  hasResults: boolean;
  cancelledAt?: string | null;
}

export function CompetitionStatusBadge({
  competitionId,
  startDate,
  endDate,
  hasResults,
  cancelledAt,
}: CompetitionStatusBadgeProps) {
  const status = getDetailedCompetitionStatus(startDate, endDate, hasResults, cancelledAt ?? null);

  if (status === "Upcoming") {
    return (
      <a
        href={`https://www.worldcubeassociation.org/competitions/${competitionId}/register`}
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
    );
  }

  if (status === "Ongoing") {
    return (
      <Badge
        variant="outline"
        className="border-none bg-secondary px-2 py-0 text-[11px] font-medium tracking-wide text-secondary-foreground"
      >
        Ongoing
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-none bg-muted px-2 py-0 text-[11px] font-medium tracking-wide text-muted-foreground"
    >
      {status === "Cancelled" ? "Cancelled" : "Completed"}
    </Badge>
  );
}
