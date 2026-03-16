import { RankingsPage } from "@/components/rankings";
import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { Metadata } from "next";
import React from "react";
import { getUnifiedWcaCacheForMembers } from "@/lib/wca.sync";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rankings | Cubing Kerala",
  description:
    "Fastest Cuber in Kerala. The rankings of members within the Rubik's Cube community in Kerala.",
};

const Rankings = async () => {
  const members = await db.members.findMany();
  const wcaIds = members.map(m => m.wcaid).filter(Boolean);
  
  // Fetch server-cached WCA data
  const initialWcaCache = await getUnifiedWcaCacheForMembers(wcaIds);

  return <RankingsPage members={members as RequestInfo[]} initialWcaCache={initialWcaCache} />;
};

export default Rankings;
