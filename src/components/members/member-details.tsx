"use client";

import { useEffect, useMemo } from "react";
import { CompetitorData, RequestInfo } from "@/types/api";
import { MemberHeader } from "./memberHeader";
import { PersonalRecordsTable } from "./personalRecordsTable";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";

interface MemberInfoComponentProps {
  member: RequestInfo;
  memberResult: CompetitorData & { isUnavailable?: boolean };
}

export default function MemberInfoComponent({
  member,
  memberResult,
}: MemberInfoComponentProps) {
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

  if (memberResult.isUnavailable) {
    return (
      <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Data unavailable
          </h1>
          <p className="w-full text-sm text-muted-foreground md:text-base">
            No results for this ID, cannot fetch results from WCA.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="flex flex-col gap-12">
        <MemberHeader
          name={member.name}
          role={member.role}
          delegateStatus={memberResult?.person?.delegate_status ?? ""}
          avatarUrl={memberResult?.person?.avatar?.url ?? ""}
          wcaid={member.wcaid}
          country={memberResult?.person?.country?.name || member.country}
          countryIso2={memberResult?.person?.country_iso2}
          competitionCount={memberResult.competition_count}
          medals={memberResult.medals}
        />
        <PersonalRecordsTable personalRecords={personalRecordsArray} />
      </div>
    </div>
  );
}
