import RequestsComponent from "@/components/requests";
import db from "@/lib/db";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Requests | Cubing Kerala",
  description: "Requests to join Rubik's Cube community in Kerala",
};

const Request = async () => {
  const requests = await db.requests.findMany();
  const members = await db.members.findMany();

  return <RequestsComponent requests={requests} members={members} />;
};

export default Request;
