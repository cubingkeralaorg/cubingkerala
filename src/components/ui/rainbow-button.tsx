import React from "react";

import { cn } from "@/lib/utils";
interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex min-h-11 h-auto cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-4 sm:px-6 lg:px-8 py-2.5 font-medium text-foreground transition-all duration-200 hover:bg-secondary hover:border-foreground/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 text-center">
        {children}
      </span>
    </button>
  );
}
