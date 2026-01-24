"use client";

import { CiLink } from "react-icons/ci";
import { isCompetitionUpcoming, isCompetitionOngoing } from "@/utils/dateUtils";
import {
  openCompetitionRegistration,
  openCompetitionPage,
} from "@/utils/competitionNavigation";

interface RegistrationStatusProps {
  competitionId: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
}

export function RegistrationStatus({
  competitionId,
  startDate,
  endDate,
  cancelledAt,
}: RegistrationStatusProps) {
  if (isCompetitionUpcoming(endDate)) {
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

  if (isCompetitionOngoing(startDate, endDate)) {
    return (
      <div className="flex gap-1 text-blue-500 hover:text-blue-600 w-fit">
        <p
          onClick={() => openCompetitionPage(competitionId)}
          className="cursor-pointer"
        >
          Competition is ongoing.
        </p>
        <CiLink />
      </div>
    );
  }

  if (cancelledAt) {
    return (
      <div className="text-red-500 hover:text-red-600 flex gap-1 w-fit">
        <p
          onClick={() => openCompetitionPage(competitionId)}
          className="cursor-pointer"
        >
          Competition was cancelled.
        </p>
        <CiLink />
      </div>
    );
  }

  return (
    <div className="text-red-500 hover:text-red-600 flex gap-1 w-fit">
      <p
        onClick={() => openCompetitionPage(competitionId)}
        className="cursor-pointer"
      >
        Competition is over. Check results here
      </p>
      <CiLink />
    </div>
  );
}
