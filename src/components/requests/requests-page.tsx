"use client";

import { useRequests } from "@/hooks/useRequests";
import { Request } from "@/types/request.types";
import { RequestsTable } from "./requests-table";
import { MembersTable } from "./members-table";
import { PageShell } from "@/components/shared/page-shell";

interface RequestsPageProps {
  requests: Request[];
  members: Request[];
}

export default function RequestsPage({
  requests,
  members,
}: RequestsPageProps) {
  const {
    requestsData,
    membersData,
    handleApprove,
    handleUpdate,
    handleMemberDelete,
    handleRequestDelete,
  } = useRequests(requests, members);

  return (
    <PageShell
      title="Requests"
      description="Review pending membership requests and manage existing members."
    >
      <RequestsTable
        requests={requestsData}
        onApprove={handleApprove}
        onDelete={handleRequestDelete}
      />

      <h2 className="mb-4 mt-12 text-lg font-semibold tracking-tight">
        Members
      </h2>

      <MembersTable
        members={membersData}
        onUpdate={handleUpdate}
        onDelete={handleMemberDelete}
      />
    </PageShell>
  );
}
