'use client';

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

export function ContactAnimatedShinyTextComponent() {
  return (
    <div className="w-fit">
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-800 text-white transition-all ease-in hover:cursor-pointer dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="flex items-center justify-center px-2 py-[3px] md:px-3 transition ease-out text-neutral-400 hover:text-neutral-200 hover:duration-300 hover:dark:text-neutral-400">
          <span className="text-xs md:text-sm">✨ Get in touch with us</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}
