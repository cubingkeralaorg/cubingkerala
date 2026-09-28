"use client";

import RefreshButton from "./refresh-button";

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
    <div className="mb-4 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:justify-between">
      <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-1">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Competitions
        </h1>
        <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
          {isLoading
            ? "Fetching competitions..."
            : lastUpdated
              ? `Last updated: ${lastUpdated}`
              : ""}
        </p>
      </div>
      <RefreshButton isRefreshing={isRefreshing} onClick={onRefresh} />
    </div>
  );
}
