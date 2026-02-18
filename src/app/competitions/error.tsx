"use client";

import { useEffect } from "react";

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
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-foreground flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t load the competitions. This might be a temporary
          issue with the WCA API.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-foreground rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
