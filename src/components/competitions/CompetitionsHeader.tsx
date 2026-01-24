"use client";

import BlurIn from "../ui/blur-in";
import RefreshButton from "./RefreshButton";

interface CompetitionsHeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function CompetitionsHeader({
  lastUpdated,
  isRefreshing,
  onRefresh,
}: CompetitionsHeaderProps) {
  return (
    <div className="flex align-center justify-between mb-4">
      <div>
        <BlurIn
          word="Competitions"
          className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-2 md:mb-4"
        />
        <div className="text-xs text-gray-400 text-start ml-1">
          Last updated: {lastUpdated}
        </div>
      </div>
      <div className="mt-2 md:mt-3">
        <RefreshButton isRefreshing={isRefreshing} onClick={onRefresh} />
      </div>
    </div>
  );
}
