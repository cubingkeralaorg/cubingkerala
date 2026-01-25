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
        <div className="w-full min-w-[500px] border border-neutral-800/50 rounded-md shadow-2xl overflow-hidden">
          <table className="w-full table-auto text-sm md:text-[15px]">
            <thead>
              <tr className="border-b border-neutral-700/50">
                <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                  WCA ID
                </th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                  Role
                </th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="text-neutral-500 px-6 py-12 text-center italic"
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
      <div className="w-full min-w-[500px] border border-neutral-800/50 rounded-md shadow-2xl overflow-hidden">
        <table className="w-full table-auto text-sm md:text-[15px]">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                Name
              </th>
              <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                WCA ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-neutral-200">
                Role
              </th>
              <th className="px-6 py-4 text-right font-semibold text-neutral-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {requests.map((request, index) => (
              <tr
                key={request.wcaid}
                className="transition-all duration-200 hover:bg-neutral-800/30 group"
              >
                <td className="px-6 py-4 text-nowrap font-medium text-neutral-100">
                  {extractFirstName(request.name)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`https://www.worldcubeassociation.org/persons/${request.wcaid}`}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-neutral-800/60 text-neutral-300 text-xs font-mono border border-neutral-700/50 hover:text-blue-500">
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
