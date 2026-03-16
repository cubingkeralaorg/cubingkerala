"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function CompetitionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Competitions page error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong!"
      description="We couldn't load the competitions. This might be a temporary issue with the WCA API."
    >
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-foreground rounded-lg transition-all duration-200 font-medium active:scale-[0.98]"
      >
        Try again
      </button>
    </ErrorState>
  );
}
