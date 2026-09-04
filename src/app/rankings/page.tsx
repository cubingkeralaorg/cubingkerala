import { Suspense } from "react";
import { Metadata } from "next";
import { RankingsData } from "@/components/rankings/rankings-data";
import { RankingsFallback } from "@/components/rankings/rankings-fallback";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Rankings | Cubing Kerala",
  description:
    "Fastest Cuber in Kerala. The rankings of members within the Rubik's Cube community in Kerala.",
};

export default function Rankings() {
  return (
    <Suspense fallback={<RankingsFallback />}>
      <RankingsData />
    </Suspense>
  );
}
