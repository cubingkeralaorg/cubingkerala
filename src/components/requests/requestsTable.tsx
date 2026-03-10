"use client";

import { Request } from "@/types/request.types";
import { RoleSelector } from "./roleSelector";
import ApprovePopover from "@/components/shared/popovers/approve-popover";
import DeleteRequestPopover from "@/components/shared/popovers/delete-request-popover";
import { extractFirstName } from "@/utils/nameUtils";
import Link from "next/link";

interface RequestsTableProps {
  requests: Request[];
  onApprove: (wcaid: string) => void;
  onDelete: (wcaid: string) => void;
}

export function RequestsTable({
  requests,
  onApprove,
  onDelete,
}: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-lg bg-background/50">
        <div className="rounded-full bg-secondary po-3 mb-4 flex items-center justify-center w-12 h-12">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">No pending requests</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          You're caught up! There are no new membership requests waiting for approval right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 overflow-hidden shadow-sm dark:shadow-2xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto text-sm md:text-[15px] min-w-[800px]">
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
            {[...requests]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((request, index) => (
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
                    id={`role-${request.wcaid}`}
                    defaultValue={request.role}
                  />
                </td>
                <td className="px-6 py-4 text-right text-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <ApprovePopover handleApprove={onApprove} index={request.wcaid} />
                    <DeleteRequestPopover
                      handleRequestDelete={onDelete}
                      index={request.wcaid}
                    />
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
