import { Suspense } from "react";
import { Metadata } from "next";
import Loading from "@/components/shared/loading";
import { CompetitionsData } from "@/components/competitions/competitions-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description:
    "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

export default function Competitions() {
  return (
    <Suspense fallback={<Loading />}>
      <CompetitionsData />
    </Suspense>
  );
}
