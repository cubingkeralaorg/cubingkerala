"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ShinyButton = ({ children, className, ...props }: ShinyButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "relative rounded-lg bg-card border border-border text-foreground font-medium text-sm px-5 py-2 overflow-hidden transition-colors duration-200 hover:bg-accent active:scale-[0.98]",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {/* Shimmer layer: uses transform (GPU-accelerated) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 h-full w-[200%] -translate-x-full animate-[shimmer-slide_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      </div>
    </button>
  );
};

export default ShinyButton;
