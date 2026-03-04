import { CompetitionDetails } from "@/components/competitions";
import axios from "axios";
import { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
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
  try {
    const [competitionResponse, resultsResponse] = await Promise.all([
      axios.get(
        `https://www.worldcubeassociation.org/api/v0/competitions/${params.compId}`,
      ),
      axios
        .get(
          `https://www.worldcubeassociation.org/api/v0/competitions/${params.compId}/results`,
        )
        .catch(() => ({ data: [] })),
    ]);
    return (
      <CompetitionDetails
        compInfo={competitionResponse.data}
        results={resultsResponse.data}
      />
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
};

export default CompetitionsDetails;
