'use client';

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import Link from "next/link";

export function AnimatedShinyTextLearnignComingSoon() {
  return (
    <div className="z-50 flex items-center justify-start md:justify-center">
      <Link href={"/learn"}>
          <div
            className={cn(
              "group rounded-lg border border-border bg-card text-base text-foreground transition-all ease-in hover:cursor-pointer hover:bg-accent",
            )}
          >
            <AnimatedShinyText className="inline-flex text-xs items-center text-foreground justify-center px-2 md:px-4 py-1 transition ease-out hover:text-foreground hover:duration-300">
              <span>✨ Learn to solve a Rubik&apos;s Cube</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
      </Link>
    </div>
  );
}
