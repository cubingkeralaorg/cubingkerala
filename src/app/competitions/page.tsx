import { CompetitionsPage } from "@/components/competitions";
import { Metadata } from "next";
import React from "react";
import db from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description:
    "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

const Competitions = async () => {
  let allKeralaFromDb = await db.$queryRaw<any[]>`SELECT * FROM "Competitions" ORDER BY "start_date" DESC`;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingCompetitions = allKeralaFromDb
    .filter((c: any) => new Date(c.start_date) >= now)
    .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
  const pastCompetitions = allKeralaFromDb
    .filter((c: any) => new Date(c.start_date) < now)
    .sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  const syncMeta = await db.systemMetadata.findUnique({
    where: { key: "last_competition_sync" }
  });

  let initialLastUpdated = "";
  if (syncMeta && syncMeta.value) {
    initialLastUpdated = new Date(syncMeta.value).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <CompetitionsPage 
      initialUpcoming={upcomingCompetitions} 
      initialPast={pastCompetitions}
      initialLastUpdated={initialLastUpdated}
    />
  );
};

export default Competitions;
