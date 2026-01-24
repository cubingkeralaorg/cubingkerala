"use client";

import BlurIn from "../ui/blur-in";
import { formatCompetitionDateRange } from "@/utils/dateUtils";

interface CompetitionHeaderProps {
  name: string;
  startDate: string;
  endDate: string;
}

export function CompetitionHeader({
  name,
  startDate,
  endDate,
}: CompetitionHeaderProps) {
  return (
    <div>
      <BlurIn
        word={name}
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl"
      />
      <p className="mt-2 md:mt-4 text-stone-400 text-center text-[15px]">
        {formatCompetitionDateRange(startDate, endDate)}
      </p>
    </div>
  );
}
