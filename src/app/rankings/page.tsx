import { Suspense } from "react";
import { Metadata } from "next";
import { RankingsData } from "@/components/rankings/rankings-data";
import { RankingsSkeleton } from "@/components/rankings/rankingsSkeleton";
import BlurIn from "@/components/ui/blur-in";
import { FadeUp, PageReveal } from "@/components/ui/fade-up";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Rankings | Cubing Kerala",
  description:
    "Fastest Cuber in Kerala. The rankings of members within the Rubik's Cube community in Kerala.",
};

function RankingsFallback() {
  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-6 text-foreground">
      <PageReveal>
        <BlurIn
          word="Rankings"
          className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-4"
        />
        <FadeUp>
          <RankingsSkeleton />
        </FadeUp>
      </PageReveal>
    </div>
  );
}

export default function Rankings() {
  return (
    <Suspense fallback={<RankingsFallback />}>
      <RankingsData />
    </Suspense>
  );
}
