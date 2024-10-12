"use client";

import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";

export function AnimatedGradientTextComponent() {
  return (
    <div>
      <AnimatedGradientText className="bg-black">
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Cubing Kerala
        </span>
      </AnimatedGradientText>
    </div>
  );
}
