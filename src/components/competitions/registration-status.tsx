"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDetailedCompetitionStatus } from "@/utils/date-utils";
import { openCompetitionRegistration } from "@/utils/competition-navigation";

interface RegistrationStatusProps {
  competitionId: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  hasResults?: boolean;
}

export function RegistrationStatus({
  competitionId,
  startDate,
  endDate,
  cancelledAt,
  hasResults = false,
}: RegistrationStatusProps) {
  const status = getDetailedCompetitionStatus(
    startDate,
    endDate,
    hasResults,
    cancelledAt,
  );

  if (status === "Cancelled") {
    return (
      <p className="text-sm font-medium text-muted-foreground md:text-base">
        Competition was cancelled.
      </p>
    );
  }

  if (status === "Upcoming") {
    return (
      <Button
        variant="link"
        className="h-auto w-fit px-0"
        onClick={() => openCompetitionRegistration(competitionId)}
      >
        Register for this competition
        <ArrowUpRight data-icon="inline-end" />
      </Button>
    );
  }

  if (status === "Ongoing") {
    return (
      <p className="text-sm font-medium text-muted-foreground md:text-base">
        Competition is ongoing.
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-muted-foreground md:text-base">
      Competition is over.
      {hasResults ? " Results are available." : ""}
    </p>
  );
}
