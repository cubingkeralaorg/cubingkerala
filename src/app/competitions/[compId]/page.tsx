import CompetitionDetailsComponent from "@/components/competitionDetailsComponent";
import axios from "axios";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competition Details | Cubing Kerala",
  description:
    "Details of a competition in the Rubik's Cube community in Kerala",
};

interface CompetitionDetailsProps {
  params: {
    compId: string;
  };
}

const CompetitionsDetails = async ({ params }: CompetitionDetailsProps) => {
  const competitionResponse = await axios.get(
    `https://www.worldcubeassociation.org/api/v0/competitions/${params.compId}`,
  );

  return <CompetitionDetailsComponent compInfo={competitionResponse.data} />;
};

export default CompetitionsDetails;
