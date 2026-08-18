"use client";

import SearchComponent from "@/components/shared/search";
import { useMemo, useState } from "react";
import { RequestInfo } from "@/types/api";
import { sortMembersByName } from "@/utils/memberUtils";
import { MembersTable } from "./membersTable";
import { MemberWcaSummary } from "@/types/wca";
import { DATA_GRID_TOOLBAR, DATA_GRID_WRAP } from "@/components/ui/data-grid";

interface MembersComponentProps {
  membersfromdb: RequestInfo[];
  wcaSummaries?: Record<string, MemberWcaSummary>;
}

export default function MembersComponent({
  membersfromdb,
  wcaSummaries = {},
}: MembersComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedMembers = useMemo(() => {
    const filtered = membersfromdb.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return sortMembersByName(filtered);
  }, [membersfromdb, searchTerm]);

  return (
    <div className={DATA_GRID_WRAP}>
      <div className={DATA_GRID_TOOLBAR}>
        <SearchComponent
          handleSearch={setSearchTerm}
          placeholder="Search members"
          className="rounded-md border border-input bg-background shadow-none"
        />
      </div>
      <MembersTable
        members={filteredAndSortedMembers}
        wcaSummaries={wcaSummaries}
      />
    </div>
  );
}
