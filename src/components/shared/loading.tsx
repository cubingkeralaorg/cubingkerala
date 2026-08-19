"use client";

import { cn } from "@/lib/utils";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center min-h-[calc(100dvh-8rem)]",
        className,
      )}
    >
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
      />
    </div>
  );
}
