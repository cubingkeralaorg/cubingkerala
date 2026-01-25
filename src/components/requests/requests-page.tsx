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
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-stone-200">
      <BlurIn
        word="Requests"
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl mb-10"
      />

      <RequestsTable
        requests={requestsData}
        onApprove={handleApprove}
        onDelete={handleRequestDelete}
      />

      <BlurIn
        word="Members"
        className="text-4xl text-center font-bold tracking-tighter md:text-6xl my-10"
      />

      <MembersTable
        members={membersData}
        onUpdate={handleUpdate}
        onDelete={handleMemberDelete}
      />
    </div>
  );
}
