"use client";

import { CiLink } from "react-icons/ci";
import { RegistrationStatus } from "./registrationStatus";
import {
  formatRegistrationDate,
  isRegistrationClosed,
} from "@/utils/dateUtils";
import { openCompetitionPage } from "@/utils/competitionNavigation";

interface RegistrationDetailsProps {
  competitionId: string;
  registrationOpen: string;
  registrationClose: string;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
}

export function RegistrationDetails({
  competitionId,
  registrationOpen,
  registrationClose,
  startDate,
  endDate,
  cancelledAt,
}: RegistrationDetailsProps) {
  const isClosed = isRegistrationClosed(registrationClose);

  return (
    <div className="space-y-2">
      <h2 className="text-xl md:text-2xl font-bold">Registration Details</h2>
      <div>
        <p className="font-medium text-[17px] md:text-[18px]">
          Registration period
        </p>
        <p className="text-muted-foreground text-[15px] md:text-[16px]">
          Online registration opened on{" "}
          {formatRegistrationDate(registrationOpen)}
        </p>
        <p className="text-muted-foreground text-[15px] md:text-[16px]">
          {isClosed
            ? `Registration closed on ${formatRegistrationDate(registrationClose)}`
            : `Registration will close on ${formatRegistrationDate(registrationClose)}`}
        </p>
      </div>
      <div className="my-2 text-[15px] md:text-[16px]">
        <RegistrationStatus
          competitionId={competitionId}
          startDate={startDate}
          endDate={endDate}
          cancelledAt={cancelledAt}
        />
      </div>
      <div
        onClick={() => openCompetitionPage(competitionId)}
        className="flex mt-10 gap-1 text-[15px] md:text-[16px] text-green-500 hover:text-green-600 cursor-pointer"
      >
        <p>More details on World Cube Association</p>
        <CiLink />
      </div>
    </div>
  );
}
