"use client";

import { RegistrationStatus } from "./registrationStatus";
import {
  formatRegistrationDate,
  isRegistrationClosed,
} from "@/utils/dateUtils";

interface RegistrationDetailsProps {
  competitionId: string;
  registrationOpen: string;
  registrationClose: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  hasResults: boolean;
}

export function RegistrationDetails({
  competitionId,
  registrationOpen,
  registrationClose,
  startDate,
  endDate,
  cancelledAt,
  hasResults,
}: RegistrationDetailsProps) {
  const isClosed = isRegistrationClosed(registrationClose);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">Registration</h2>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">
          Registration period
        </p>
        <p className="text-muted-foreground md:text-base">
          Online registration opened on{" "}
          {formatRegistrationDate(registrationOpen)}
        </p>
        <p className="text-muted-foreground md:text-base">
          {isClosed
            ? `Registration closed on ${formatRegistrationDate(registrationClose)}`
            : `Registration will close on ${formatRegistrationDate(registrationClose)}`}
        </p>
      </div>
      <RegistrationStatus
        competitionId={competitionId}
        startDate={startDate}
        endDate={endDate}
        cancelledAt={cancelledAt}
        hasResults={hasResults}
      />
    </div>
  );
}
