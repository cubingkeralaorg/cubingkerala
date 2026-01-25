import { MembersList } from "@/components/members";
import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { Metadata } from "next";
import React from "react";
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

  return <MembersList membersfromdb={members as RequestInfo[]} />;
};

export default Members;
