"use client";

import BlurIn from "../ui/blur-in";
import { formatCompetitionDateRange } from "@/utils/dateUtils";
import { FadeUp, StaggerReveal } from "../ui/fade-up";

interface CompetitionHeaderProps {
  name: string;
  startDate: string;
  endDate: string;
  hasResults: boolean;
}

export function CompetitionHeader({
  name,
  startDate,
  endDate,
}: CompetitionHeaderProps) {
  return (
    <StaggerReveal className="text-center">
      <BlurIn
        word={name}
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl"
      />
      <FadeUp
        as="p"
        className="mt-2 md:mt-4 text-muted-foreground text-center text-[15px]"
      >
        {formatCompetitionDateRange(startDate, endDate)}
      </FadeUp>
    </StaggerReveal>
  );
}
