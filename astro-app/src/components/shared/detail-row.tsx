import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared label/value row for the competition and member detail pages — a thin divider instead of a bordered table cell. */
export function DetailRow({
  label,
  children,
  divider = true,
}: {
  label: string;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 py-3 sm:flex-row sm:items-start sm:gap-6",
        divider && "border-b border-border",
      )}
    >
      <p className="text-sm font-medium text-muted-foreground sm:w-32 sm:shrink-0">{label}</p>
      <div className="text-foreground md:text-base">{children}</div>
    </div>
  );
}
