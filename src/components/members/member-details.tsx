"use client";

import React, { useEffect, useState, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import { CompetitorData, RequestInfo } from "@/types/api";
import { fetchPersonFromWCA } from "@/services/wca.api";
import { MemberHeader } from "./memberHeader";
import { MemberStats } from "./memberStats";
import { PersonalRecordsTable } from "./personalRecordsTable";

interface MemberInfoComponentProps {
  member: RequestInfo;
  memberResult: CompetitorData;
}

export default function MemberInfoComponent({
  member,
  memberResult,
}: MemberInfoComponentProps) {
  const [memberDataFromWCA, setMemberDataFromWCA] =
    useState<CompetitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadMemberData = async () => {
      try {
        const data = await fetchPersonFromWCA(member.wcaid);
        setMemberDataFromWCA(data);
      } catch (error) {
        console.error("Error fetching WCA member data:", error);
      } finally {
        // Add slight delay for smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadMemberData();
  }, [member.wcaid]);

  const personalRecordsArray = useMemo(() => {
    return Object.entries(memberResult.personal_records).map(
      ([event, ranking]) => ({
        event,
        ranking,
      }),
    );
  }, [memberResult.personal_records]);

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-200">
      <main className="flex flex-col items-center py-6 md:py-8 px-4 md:px-6 cursor-default animate-fade-in">
        <MemberHeader
          name={member.name}
          role={member.role}
          delegateStatus={memberDataFromWCA?.person?.delegate_status ?? ""}
          avatarUrl={memberDataFromWCA?.person?.avatar?.url ?? ""}
        />

        <MemberStats
          country={member.country}
          wcaid={member.wcaid}
          competitionCount={memberResult.competition_count}
          medals={memberResult.medals}
        />

        <PersonalRecordsTable personalRecords={personalRecordsArray} />
      </main>
    </div>
  );
}
