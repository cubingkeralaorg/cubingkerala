"use client";

import { FadeUp } from "./fade-up";
import { cn } from "@/lib/utils";

interface BlurInProps {
  word: React.ReactNode;
  className?: string;
}

/** Page title entrance — uses the shared FadeUp animation */
const BlurIn = ({ word, className }: BlurInProps) => (
  <FadeUp
    as="h1"
    className={cn(
      "font-display tracking-[-0.02em] drop-shadow-sm",
      className,
    )}
  >
    {word}
  </FadeUp>
);

export default BlurIn;
