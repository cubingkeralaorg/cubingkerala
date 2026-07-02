"use client";

import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export function AnimatedGradientTextComponent({name, width}: { name: string, width: number }) {
  const sizeClass =
    width >= 4
      ? "text-xl md:text-2xl lg:text-4xl"
      : width >= 3
        ? "text-xl md:text-2xl lg:text-3xl"
        : "text-xl md:text-2xl";

  return (
    <div>
      <AnimatedGradientText>
        <span
          className={cn(
            "inline animate-gradient pb-1 bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
            sizeClass,
          )}
        >
          {name}
        </span>
      </AnimatedGradientText>
    </div>
  );
}
