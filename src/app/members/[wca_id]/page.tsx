import { MemberDetails } from "@/components/members";
import db from "@/lib/db";
import { CompetitorData, RequestInfo } from "@/types/api";
import axios from "axios";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Info | Cubing Kerala",
  description:
    "Information about a member of the Rubik's Cube community in Kerala",
  icons: [
    { rel: "icon", url: "/logoblack.png" },
    { rel: "cubingkerala-icon", url: "/logoblack.png" },
  ],
};

const MemberInfo = async ({ params }: { params: { wca_id: string } }) => {
  const member = await db.members.findUnique({
    where: {
      wcaid: params.wca_id,
    },
  });

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] w-full bg-background -mt-20">
        <div className="max-w-xl px-4 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">
            404
          </p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Member Not Found
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground/80 leading-relaxed">
            The requested member does not exist in our database.
          </p>
        </div>
      </div>
    );
  }

  let memberResult;
  try {
    const response = await axios.get(
      `https://www.worldcubeassociation.org/api/v0/persons/${params.wca_id}`,
    );
    memberResult = response.data;
  } catch (error) {
    console.error(`Error fetching WCA data for ${params.wca_id}:`, error);
    // Provide a fallback structure for invalid/missing WCA IDs
    memberResult = {
      person: {
        id: params.wca_id,
        name: member.name,
        wca_id: params.wca_id,
        avatar: { url: "", pending_url: "", thumb_url: "", is_default: true },
        gender: member.gender,
        country_iso2: "IN",
        url: `https://www.worldcubeassociation.org/persons/${params.wca_id}`,
        country: { id: "India", name: "India", continentId: "_Asia", iso2: "IN" },
        delegate_status: null,
        class: "person",
        teams: []
      },
      competition_count: 0,
      personal_records: {},
      medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
      records: { national: 0, continental: 0, world: 0, total: 0 },
      // @ts-ignore
      isUnavailable: true
    };
  }

  return (
    <MemberDetails
      member={member as RequestInfo}
      memberResult={memberResult as CompetitorData}
    />
  );
};

export default MemberInfo;
