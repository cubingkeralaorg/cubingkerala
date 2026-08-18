"use client";

import RefreshButton from "./RefreshButton";

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
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Competitions
        </h1>
        <p className="text-sm text-muted-foreground">
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
