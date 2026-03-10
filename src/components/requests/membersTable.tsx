"use client";

import { Request } from "@/types/request.types";
import { RoleSelector } from "./roleSelector";
import UpdatePopover from "@/components/shared/popovers/update-popover";
import DeleteMemberPopover from "@/components/shared/popovers/delete-member-popover";
import { extractFirstName } from "@/utils/nameUtils";
import Link from "next/link";

interface MembersTableProps {
  members: Request[];
  onUpdate: (index: number) => void;
  onDelete: (index: number) => void;
}

export function MembersTable({
  members,
  onUpdate,
  onDelete,
}: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-lg bg-background/50">
        <div className="rounded-full bg-secondary mb-4 flex items-center justify-center w-12 h-12">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground">No active members</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          No members have been added to the system yet. Approved requests will appear here.
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
            {[...members]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member, index) => (
              <tr
                key={member.wcaid}
                className="transition-all duration-200 group"
              >
                <td className="px-6 py-4 text-nowrap font-medium text-foreground">
                  {extractFirstName(member.name)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`https://www.worldcubeassociation.org/persons/${member.wcaid}`}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary/60 text-muted-foreground text-xs font-mono border border-border/50 hover:text-blue-500">
                      {member.wcaid}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <RoleSelector
                    id={`role-${index}`}
                    defaultValue={member.role}
                  />
                </td>
                <td className="px-6 py-4 text-right text-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <UpdatePopover handleUpdate={onUpdate} index={index} />
                    <DeleteMemberPopover
                      handleMemberDelete={onDelete}
                      index={index}
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
