"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

export function AnimatedShinyTextComponent({
  text,
  userInfo,
}: {
  text: string;
  userInfo: string | undefined | null;
}) {
  return (
    <div>
      <div
        className={cn(
          "group rounded border border-black/5 bg-neutral-800 text-white transition-all duration-200 ease-in-out hover:cursor-pointer dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText
          className={`flex text-[15px] items-center justify-center px-3 py-[4px] md:px-4 transition ${
            text === "Logout"
              ? "hover:text-red-500"
              : text === "Login"
              ? "hover:text-green-400"
              : "hover:text-stone-300"
          } text-stone-200 ease-out hover:duration-300`}
        >
          <span
            className={
              text === "Login" || text === "Logout"
                ? "font-medium text-sm"
                : "font-medium text-md"
            }
          >
            {text === "Logout" ? userInfo?.toString() : text}
          </span>
          {text === "Logout" ? null : (
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          )}
        </AnimatedShinyText>
      </div>
    </div>
  );
}
