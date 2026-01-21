import RankingsComponent from "@/components/rankings";
import db from "@/lib/db";
import { RequestInfo } from "@/types/api";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rankings | Cubing Kerala",
  description:
    "Fastest Cuber in Kerala. The rankings of members within the Rubik's Cube community in Kerala.",
};

const Rankings = async () => {
  const members = await db.members.findMany();

  return <RankingsComponent members={members as RequestInfo[]} />;
};

export default Rankings;
