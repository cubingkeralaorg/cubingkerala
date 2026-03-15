"use client";

import { getDetailedCompetitionStatus } from "@/utils/dateUtils";
import { openCompetitionRegistration } from "@/utils/competitionNavigation";
import { CiLink } from "react-icons/ci";

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
  const status = getDetailedCompetitionStatus(startDate, endDate, hasResults);

  if (status === "Upcoming") {
    return (
      <div className="flex gap-1 text-blue-500 hover:text-blue-600 w-fit">
        <p
          onClick={() => openCompetitionRegistration(competitionId)}
          className="cursor-pointer"
        >
          Register for this competition here
        </p>
        <CiLink />
      </div>
    );
  }

  if (status === "Ongoing") {
    return (
      <div className="text-green-600 font-medium">
        Competition is ongoing.
      </div>
    );
  }

  if (cancelledAt) {
    return (
      <div className="text-red-500 font-medium">
        Competition was cancelled.
      </div>
    );
  }

  return (
    <div className="text-red-500 font-medium">
      Competition is over. {hasResults ? "Results are available." : ""}
    </div>
  );
}
