"use client";

import { Children, type ReactNode } from "react";
import { FadeUp, StaggerReveal } from "@/components/ui/fade-up";

/** Staggered reveal for stacked home page sections below the hero */
export function HomePageSections({ children }: { children: ReactNode }) {
  return (
    <StaggerReveal className="space-y-5 flex flex-col">
      {Children.toArray(children).map((child, index) => (
        <FadeUp key={index}>{child}</FadeUp>
      ))}
    </StaggerReveal>
  );
}
