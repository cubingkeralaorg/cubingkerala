import { MemberDetails } from "@/components/members";
import { ErrorState } from "@/components/shared/error-state";
import db from "@/lib/db";
import { CompetitorData, RequestInfo } from "@/types/api";
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
      <ErrorState
        code="404"
        title="Member Not Found"
        description="The requested member does not exist in our database."
      />
    );
  }

  let memberResult;
  // Fetch from the local database synchronized by the cron job
  // @ts-ignore - Prisma model newly added
  const wcaDataObj = await db.memberWcaData.findUnique({
    where: { wcaid: params.wca_id }
  });

  if (wcaDataObj && wcaDataObj.data) {
    memberResult = wcaDataObj.data;
  } else {
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
