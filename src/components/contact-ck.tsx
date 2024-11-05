'use client';

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

export function ContactAnimatedShinyTextComponent({ text, userInfo }: {
  text: string
  userInfo: string | undefined | null
}) {
  return (
    <div>
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-800 text-white transition-all ease-in hover:cursor-pointer dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className={`flex items-center justify-center px-3 py-[4px] md:px-4 transition ${text === "Logout" ? 'hover:text-red-500' : 'hover:text-green-400'} text-stone-200 ease-out hover:duration-300`}>
          <span className={`text-sm font-medium`}>{text === "Logout" ? userInfo?.toString() : text}</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}
