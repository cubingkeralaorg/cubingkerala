"use client";

import React, { useEffect, useState, useMemo } from "react";
import LoadingComponent from "@/components/shared/loading";
import { CompetitorData, RequestInfo } from "@/types/api";

import { MemberHeader } from "./memberHeader";
import { PersonalRecordsTable } from "./personalRecordsTable";

interface MemberInfoComponentProps {
  member: RequestInfo;
  memberResult: CompetitorData;
}

export default function MemberInfoComponent({
  member,
  memberResult,
}: MemberInfoComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
            delegateStatus={memberResult?.person?.delegate_status ?? ""}
            avatarUrl={memberResult?.person?.avatar?.url ?? ""}
          />

          <PersonalRecordsTable 
            personalRecords={personalRecordsArray}
            wcaid={member.wcaid}
            country={memberResult?.person?.country?.name || member.country}
            countryIso2={memberResult?.person?.country_iso2}
            competitionCount={memberResult.competition_count}
            medals={memberResult.medals}
          />
        </main>
      )}
    </div>
  );
}
