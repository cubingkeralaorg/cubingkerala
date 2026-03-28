import { MembersList } from "@/components/members";
import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { Metadata } from "next";
import React from "react";
import { getUnifiedWcaCacheForMembers } from "@/lib/wca.sync";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
  icons: {
    icon: "logoblack.png",
  },
};

const Members = async () => {
  const members = await db.members.findMany();
  const wcaIds = members.map(m => m.wcaid).filter(Boolean);
  
  const initialWcaCache = await getUnifiedWcaCacheForMembers(wcaIds);

  return (
    <MembersList 
      membersfromdb={members as RequestInfo[]} 
      initialWcaCache={initialWcaCache} 
    />
  );
};

export default Members;
