import { Suspense } from "react";
import { Metadata } from "next";
import { CompetitionSkeleton } from "@/components/competitions";
import { CompetitionsData } from "@/components/competitions/competitions-data";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description:
    "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

function CompetitionsFallback() {
  return (
    <div className={`ck-landing min-h-screen py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Competitions
        </h1>
        <p className="text-sm text-muted-foreground">Loading competitions...</p>
      </div>
      <div className="overflow-hidden rounded-md border border-border">
        <CompetitionSkeleton />
      </div>
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
