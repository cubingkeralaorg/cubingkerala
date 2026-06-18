import { Suspense } from "react";
import { Metadata } from "next";
import { CompetitionSkeleton } from "@/components/competitions";
import { CompetitionsData } from "@/components/competitions/competitions-data";
import BlurIn from "@/components/ui/blur-in";
import { FadeUp, PageReveal } from "@/components/ui/fade-up";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description:
    "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

function CompetitionsFallback() {
  return (
    <div className="container mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 text-foreground flex flex-col min-h-screen">
      <PageReveal className="w-full">
        <BlurIn
          word="Competitions"
          className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-4"
        />
        <FadeUp className="text-xs text-muted-foreground text-start ml-1 h-4 mb-4">
          Loading competitions...
        </FadeUp>
        <FadeUp>
          <CompetitionSkeleton />
        </FadeUp>
      </PageReveal>
    </div>
  );
}

export default function Competitions() {
  return (
    <Suspense fallback={<CompetitionsFallback />}>
      <CompetitionsData />
    </Suspense>
  );
}
