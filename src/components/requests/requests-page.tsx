"use client";

import { useRequests } from "@/hooks/useRequests";
import Loading from "@/components/shared/loading";
import { Request } from "@/types/request.types";
import { RequestsTable } from "./requests-table";
import { MembersTable } from "./members-table";

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
    isLoading,
    handleApprove,
    handleUpdate,
    handleMemberDelete,
    handleRequestDelete,
  } = useRequests(requests, members);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Requests
      </h1>

      <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <RequestsTable
          requests={requestsData}
          onApprove={handleApprove}
          onDelete={handleRequestDelete}
        />
      </div>

      <h2 className="my-10 text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Members
      </h2>

      <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <MembersTable
          members={membersData}
          onUpdate={handleUpdate}
          onDelete={handleMemberDelete}
        />
      </div>
    </div>
  );
}
