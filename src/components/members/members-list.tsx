"use client";

import SearchComponent from "@/components/shared/search";
import { useMemo, useState } from "react";
import { RequestInfo } from "@/types/api";
import { sortMembersByName } from "@/utils/memberUtils";
import { MembersTable } from "./membersTable";
import { MemberWcaSummary } from "@/types/wca";
import { FadeUp, StaggerReveal } from "../ui/fade-up";
import { RevealTableSection } from "../ui/reveal-table";

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <StaggerReveal>
      <FadeUp>
        <SearchComponent handleSearch={handleSearch} placeholder="Search Member" />
      </FadeUp>
      <RevealTableSection>
        <MembersTable
          members={filteredAndSortedMembers}
          wcaSummaries={wcaSummaries}
        />
      </RevealTableSection>
    </StaggerReveal>
  );
}
