"use client";

import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export function AnimatedGradientTextComponent({name, width}: { name: string, width: number }) {
  return (
    <div>
      <AnimatedGradientText>
        <span
          className={cn(
            `inline animate-gradient pb-1 text-xl md:text-${width}xl bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          {name}
        </span>
      </AnimatedGradientText>
    </div>
  );
}
