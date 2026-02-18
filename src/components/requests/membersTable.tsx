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
                  No members...
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
            {members.map((member, index) => (
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
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <DeleteMemberPopover
                      handleMemberDelete={onDelete}
                      index={index}
                    />
                    <UpdatePopover handleUpdate={onUpdate} index={index} />
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
