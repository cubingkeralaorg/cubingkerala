import SearchComponent from "@/components/shared/search";
import { useMemo, useState } from "react";
import type { RequestInfo, MemberWcaSummary } from "@/types/member";
import { sortMembersByName } from "@/utils/member-utils";
import { MembersTable } from "./members-table";
import { DATA_GRID_TOOLBAR, DATA_GRID_WRAP } from "@/components/ui/data-grid";

interface MembersListProps {
  members: RequestInfo[];
  wcaSummaries?: Record<string, MemberWcaSummary>;
}

export default function MembersList({
  members,
  wcaSummaries = {},
}: MembersListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedMembers = useMemo(() => {
    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return sortMembersByName(filtered);
  }, [members, searchTerm]);

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
