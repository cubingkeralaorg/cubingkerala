import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Competition } from "@/types/competition.types";
import {
  WHATSAPP_GROUP_URL,
  HERO_BLOCK_GAP_CLASS,
  LANDING_SECTION_INNER_PY_CLASS,
  LANDING_VIEWPORT_SECTION_CLASS,
} from "./constants";
import { DestinationsSection } from "./destinations-section";
import { FeaturedCompetitionCard } from "./featured-competition-card";

type HeroSectionProps = {
  competition: Competition | null;
  kind: "upcoming" | "past" | null;
};

export default function HeroSection({ competition, kind }: HeroSectionProps) {
  return (
    <section className={LANDING_VIEWPORT_SECTION_CLASS}>
      <div
        className={`container mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8 ${HERO_BLOCK_GAP_CLASS} ${LANDING_SECTION_INNER_PY_CLASS}`}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="block">The Rubik&apos;s Cube community in</span>
                <span className="mt-1 block">Kerala.</span>
              </h1>
              <p className="max-w-md text-muted-foreground md:text-lg">
                Connect with fellow cubers for discussions, competition updates,
                and everything happening in the community.
              </p>
            </div>
            <Button size="lg" asChild>
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join WhatsApp
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </div>

          <FeaturedCompetitionCard competition={competition} kind={kind} />
        </div>

        <DestinationsSection />
      </div>
    </section>
  );
}
