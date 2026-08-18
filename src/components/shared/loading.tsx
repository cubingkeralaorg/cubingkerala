"use client";

export default function Loading() {
  return (
    <div className="flex w-full flex-1 items-center justify-center min-h-[calc(100dvh-8rem)]">
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
      />
    </div>
  );
}
