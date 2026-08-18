import { Suspense } from "react";
import { Metadata } from "next";
import { RankingsData } from "@/components/rankings/rankings-data";
import { RankingsSkeleton } from "@/components/rankings/rankings-skeleton";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Rankings | Cubing Kerala",
  description:
    "Fastest Cuber in Kerala. The rankings of members within the Rubik's Cube community in Kerala.",
};

function RankingsFallback() {
  return (
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Rankings
        </h1>
        <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
          Loading rankings...
        </p>
      </div>
      <RankingsSkeleton />
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
