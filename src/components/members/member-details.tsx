"use client";

import React, { useEffect, useState, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import { CompetitorData, RequestInfo } from "@/types/api";
import { fetchPersonFromWCA, getCachedPersonData } from "@/services/wca.api";
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
      // 1. Try to get from cache first
      const cached = getCachedPersonData(member.wcaid);
      if (cached) {
        setMemberDataFromWCA(cached);
        setIsLoading(false);
        return;
      }

      // 2. Fallback to fresh fetch
      try {
        const data = await fetchPersonFromWCA(member.wcaid);
        setMemberDataFromWCA(data);
      } catch (error) {
        console.error("Error fetching WCA member data:", error);
      } finally {
        setIsLoading(false);
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
      <LoadingComponent />
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      {/* @ts-ignore */}
      {memberResult.isUnavailable ? (
        <div className="flex items-center justify-center min-h-[60vh] w-full bg-background mt-10">
          <div className="max-w-xl px-4 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">
              404
            </p>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Data Unavailable
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
              No results for this ID, cannot fetch results from WCA.
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
