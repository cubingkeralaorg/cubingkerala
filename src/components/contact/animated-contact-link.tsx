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
          "group rounded-lg border border-border bg-card text-foreground transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-accent"
        )}
      >
        <AnimatedShinyText
          className={`flex text-[15px] items-center justify-center px-3 py-[4px] md:px-4 transition ${
            text === "Logout"
              ? "hover:text-red-500"
              : text === "Login"
              ? "hover:text-green-500"
              : "hover:text-primary"
          } text-foreground ease-out hover:duration-300`}
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
