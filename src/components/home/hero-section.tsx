"use client";

import { useRouter } from "next/navigation";
import { cn, isMobileDevice } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";

import { RainbowButton } from "../ui/rainbow-button";
import { FadeIn, FadeUp, StaggerReveal } from "../ui/fade-up";
import {
  HOME_FADE_IN_DELAY,
  HOME_FADE_IN_DURATION,
  HOME_REVEAL_DURATION,
  HOME_STAGGER,
  HOME_STAGGER_DELAY,
} from "./reveal-config";
import { IoIosArrowForward } from "react-icons/io";
import ShinyButton from "../ui/shiny-button";
import { GradientText } from "@/components/shared";
import { ComingSoonBadge } from "@/components/learn";
import type { Competition } from "@/types/competition.types";
import { formatCompetitionDateRange } from "@/utils/dateUtils";

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS";

type HeroSectionProps = {
  competition: Competition | null;
  kind: "upcoming" | "past" | null;
};

export default function CubingKeralaGetStarted({
  competition,
  kind,
}: HeroSectionProps) {
  const router = useRouter();

  const handleRedirectToContactPage = (): void => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRedirectToWhatsapp = (): void => {
    if (isMobileDevice()) {
      window.location.assign(WHATSAPP_GROUP_URL);
    } else {
      window.open(WHATSAPP_GROUP_URL, "_blank", "noopener,noreferrer");
    }
  };

  const handleViewCompetition = (): void => {
    if (!competition) return;
    router.push(`/competitions/${competition.id}`);
  };

  const dateLabel = competition
    ? formatCompetitionDateRange(competition.start_date, competition.end_date)
    : null;
  const eventCount = competition?.event_ids?.length ?? 0;
  const eyebrow =
    kind === "past" ? "Latest competition" : "Next competition";
  const competitionCta =
    kind === "past" ? "View results" : "View competition";

  return (
    <div className="relative flex min-h-[calc(100dvh-60px)] w-full flex-col items-center justify-center overflow-hidden text-foreground">
      <div className="container relative z-10 mx-auto flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8 md:py-12">
        <StaggerReveal
          className="w-full max-w-3xl space-y-2 md:space-y-4 text-start lg:mx-auto lg:max-w-none lg:w-[50vw] lg:text-center"
          stagger={HOME_STAGGER}
          delay={HOME_STAGGER_DELAY}
        >
            <FadeUp className="mb-2 md:mb-3" duration={HOME_REVEAL_DURATION}>
              <ComingSoonBadge />
            </FadeUp>

            <FadeUp
              className="w-full flex justify-start lg:justify-center"
              duration={HOME_REVEAL_DURATION}
            >
              <GradientText width={4} name="Cubing Kerala" />
            </FadeUp>

            <FadeUp
              as="h1"
              duration={HOME_REVEAL_DURATION}
              className="text-4xl text-start lg:text-center font-bold tracking-tighter sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              Rubik&apos;s Cube Community in Kerala.
            </FadeUp>

            <FadeUp
              as="p"
              duration={HOME_REVEAL_DURATION}
              className="text-muted-foreground mx-auto text-[15px] md:text-lg text-start lg:text-center lg:pt-5"
            >
              Join us for competitions and meetups that connect cubers of all
              skill levels. <br />{" "}
              <strong className="text-foreground font-bold">
                Cubing Kerala
              </strong>{" "}
              is here to help you learn and grow.
            </FadeUp>

            {competition ? (
              <FadeUp
                duration={HOME_REVEAL_DURATION}
                className="w-full pt-2 pb-1"
              >
                <button
                  type="button"
                  onClick={handleViewCompetition}
                  className="w-full max-w-xl mx-auto lg:mx-auto text-start lg:text-center rounded-lg border border-border bg-neutral-500/[0.04] px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-sm text-green-500">{eyebrow}</p>
                  <p className="mt-1 text-base sm:text-lg font-semibold tracking-tight">
                    {competition.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                    <span>{dateLabel}</span>
                    <span className="mx-1.5 text-border">·</span>
                    <span>{competition.city}</span>
                    {eventCount > 0 ? (
                      <>
                        <span className="mx-1.5 text-border">·</span>
                        <span>
                          {eventCount}{" "}
                          {eventCount === 1 ? "event" : "events"}
                        </span>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    {competitionCta}
                    <IoIosArrowForward className="size-3.5" />
                  </p>
                </button>
              </FadeUp>
            ) : null}

            <FadeUp
              className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-4 lg:gap-5 w-full max-w-lg lg:max-w-none mx-auto lg:mx-0 pt-2"
              duration={HOME_REVEAL_DURATION}
            >
              <ShinyButton
                onClick={() => handleRedirectToContactPage()}
                className="w-full lg:w-fit lg:min-w-[200px] h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Contact Us</span>
                  <IoIosArrowForward />
                </div>
              </ShinyButton>
              <RainbowButton
                className="w-full lg:w-fit rounded-lg gap-2 text-sm sm:text-[15px] text-green-600 dark:text-green-400"
                onClick={handleRedirectToWhatsapp}
              >
                Join our Whatsapp group
                <IoIosArrowForward />
              </RainbowButton>
            </FadeUp>
          </StaggerReveal>
      </div>

      <FadeIn
        className="absolute inset-0 pointer-events-none"
        delay={HOME_FADE_IN_DELAY}
        duration={HOME_FADE_IN_DURATION}
      >
        <div className="container mx-auto h-full max-sm:px-3 px-4 sm:px-6 lg:px-8">
          <div className="relative h-full w-full overflow-hidden">
            <DotPattern
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1}
              className={cn(
                "[mask-image:linear-gradient(to_bottom_right,white,rgba(255,255,255,0.2),transparent)]",
              )}
            />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
