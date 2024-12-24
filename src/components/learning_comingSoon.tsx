'use client';

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import Link from "next/link";

export function AnimatedShinyTextLearnignComingSoon() {
  return (
    <div className="z-10 flex min-h-64 items-center justify-center">
      <Link href={"/learning"}>
          <div
            className={cn(
              "group rounded-full border border-white/10 bg-neutral-900 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex text-xs items-center text-stone-200 justify-center px-4 py-1 transition ease-out hover:text-neutral-100 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Learning Coming Soon!</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
      </Link>
    </div>
  );
}
