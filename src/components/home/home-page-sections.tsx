"use client";

import { Children, type ReactNode } from "react";
import { FadeUp, StaggerReveal } from "@/components/ui/fade-up";
import {
  HOME_REVEAL_DURATION,
  HOME_STAGGER,
  HOME_STAGGER_DELAY,
} from "./reveal-config";

/** Staggered reveal for stacked home page sections below the hero */
export function HomePageSections({ children }: { children: ReactNode }) {
  return (
    <StaggerReveal
      className="space-y-5 flex flex-col"
      stagger={HOME_STAGGER}
      delay={HOME_STAGGER_DELAY}
    >
      {Children.toArray(children).map((child, index) => (
        <FadeUp key={index} duration={HOME_REVEAL_DURATION}>
          {child}
        </FadeUp>
      ))}
    </StaggerReveal>
  );
}
