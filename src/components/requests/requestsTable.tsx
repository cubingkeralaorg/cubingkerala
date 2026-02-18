"use client";

import { Request } from "@/types/request.types";
import { RoleSelector } from "./roleSelector";
import ApprovePopover from "@/components/shared/popovers/approve-popover";
import DeleteRequestPopover from "@/components/shared/popovers/delete-request-popover";
import { extractFirstName } from "@/utils/nameUtils";
import Link from "next/link";

interface RequestsTableProps {
  requests: Request[];
  onApprove: (index: number) => void;
  onDelete: (index: number) => void;
}

export function RequestsTable({
  requests,
  onApprove,
  onDelete,
}: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="w-full min-w-[500px] border border-border/50 rounded-md shadow-sm dark:shadow-2xl overflow-hidden">
          <table className="w-full table-auto text-sm md:text-[15px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  WCA ID
                </th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="text-muted-foreground px-6 py-12 text-center italic"
                  colSpan={4}
                >
                  No new requests...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="w-full min-w-[500px] border border-border/50 rounded-md shadow-sm dark:shadow-2xl overflow-hidden">
        <table className="w-full table-auto text-sm md:text-[15px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                WCA ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((request, index) => (
              <tr
                key={request.wcaid}
                className="transition-all duration-200 hover:bg-accent/30 group"
              >
                <td className="px-6 py-4 text-nowrap font-medium text-foreground">
                  {extractFirstName(request.name)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`https://www.worldcubeassociation.org/persons/${request.wcaid}`}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary/60 text-muted-foreground text-xs font-mono border border-border/50 hover:text-blue-500">
                      {request.wcaid}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <RoleSelector
                    id={`role-${index}`}
                    defaultValue={request.role}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <DeleteRequestPopover
                      handleRequestDelete={onDelete}
                      index={index}
                    />
                    <ApprovePopover handleApprove={onApprove} index={index} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
