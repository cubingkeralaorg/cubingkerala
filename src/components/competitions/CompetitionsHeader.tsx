"use client";

import BlurIn from "../ui/blur-in";
import RefreshButton from "./RefreshButton";
import { FadeUp, StaggerReveal } from "../ui/fade-up";

interface CompetitionsHeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function CompetitionsHeader({
  lastUpdated,
  isRefreshing,
  onRefresh,
  isLoading,
}: CompetitionsHeaderProps) {
  return (
    <StaggerReveal className="flex align-center justify-between mb-4">
      <div>
        <BlurIn
          word="Competitions"
          className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-4"
        />
        <FadeUp className="text-xs text-muted-foreground text-start ml-1 flex items-center gap-2 h-4">
          <span>
            {isLoading
              ? "Fetching competitions..."
              : lastUpdated
                ? `Last updated: ${lastUpdated}`
                : ""}
          </span>
        </FadeUp>
      </div>
      <FadeUp className="mt-2 md:mt-5">
        <RefreshButton isRefreshing={isRefreshing} onClick={onRefresh} />
      </FadeUp>
    </StaggerReveal>
  );
}
