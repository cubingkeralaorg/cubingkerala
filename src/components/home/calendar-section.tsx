import Link from "next/link";
import { AnimatedContactLink } from "@/components/contact";

export function CubingKeralaCalendars() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-none text-foreground">
      <div className="container mx-auto px-4 md:px-8 z-20 bg-neutral-500/[0.04] border border-border rounded-lg py-10 md:py-24">
        <div className="space-y-4 sm:px-10 text-start lg:text-center flex flex-col items-start lg:items-center">
          <div className="inline-block rounded-lg text-sm text-green-500">
            Upcoming Competitions
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Mark Your Calendars
          </h2>
          <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg">
            Stay tuned for our upcoming Rubik&apos;s Cube competitions in
            Kerala.
          </p>
          <Link href="/competitions" className="w-fit">
            <AnimatedContactLink userInfo={null} text="Competitions" />
          </Link>
        </div>
      </div>
    </div>
  );
}
