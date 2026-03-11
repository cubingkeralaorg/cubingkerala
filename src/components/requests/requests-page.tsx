"use client";

import { useRequests } from "@/utils/nameUtils";
import LoadingComponent from "@/components/shared/loading";
import BlurIn from "../ui/blur-in";
import { Request } from "@/types/request.types";
import { RequestsTable } from "./requestsTable";
import { MembersTable } from "./membersTable";

interface RequestsComponentProps {
  requests: Request[];
  members: Request[];
}

export default function RequestsComponent({
  requests,
  members,
}: RequestsComponentProps) {
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
    return (
      <LoadingComponent />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-foreground">
      <BlurIn
        word="Requests"
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl mb-10"
      />

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <RequestsTable
          requests={requestsData}
          onApprove={handleApprove}
          onDelete={handleRequestDelete}
        />
      </div>

      <BlurIn
        word="Members"
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl my-10"
      />

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <MembersTable
          members={membersData}
          onUpdate={handleUpdate}
          onDelete={handleMemberDelete}
        />
      </div>
    </div>
  );
}
