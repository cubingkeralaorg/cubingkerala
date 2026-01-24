"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { MemberPersonResult, RequestInfo } from "@/types/api";
import { getTotalMedals, capitalizeRole } from "@/utils/memberUtils";

interface MembersTableProps {
  members: RequestInfo[];
  membersDetails: MemberPersonResult[];
}

export function MembersTable({ members, membersDetails }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <Table className="w-full">
        <TableHeader className="border-y hover:bg-neutral-950 border-y-neutral-800">
          <TableRow className="text-sm md:text-[15px] border-none">
            <TableHead className="text-neutral-500">#</TableHead>
            <TableHead className="text-neutral-500">Name</TableHead>
            <TableHead className="text-neutral-500">WCA ID</TableHead>
            <TableHead className="text-neutral-500">Role</TableHead>
            <TableHead className="text-neutral-500">Competitions</TableHead>
            <TableHead className="text-neutral-500">Medals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              className="text-stone-600 px-4 hover:bg-neutral-900 py-4"
              colSpan={6}
            >
              No results found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table className="w-full">
      <TableHeader className="border-y hover:bg-neutral-950 border-y-neutral-800">
        <TableRow className="text-sm md:text-[15px] hover:bg-neutral-950 border-none">
          <TableHead className="text-neutral-500">#</TableHead>
          <TableHead className="text-neutral-500">Name</TableHead>
          <TableHead className="text-neutral-500">WCA ID</TableHead>
          <TableHead className="text-neutral-500">Role</TableHead>
          <TableHead className="text-neutral-500">Competitions</TableHead>
          <TableHead className="text-neutral-500">Medals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => {
          const memberDetails = membersDetails.find(
            (details) => details.id === member.wcaid,
          );

          return (
            <TableRow
              className="border-y-neutral-800 hover:bg-neutral-950 text-sm md:text-[15px]"
              key={member.wcaid}
            >
              <TableCell className="cursor-default">{index + 1}</TableCell>
              <TableCell className="text-nowrap">
                <Link prefetch={true} href={`/members/${member.wcaid}`}>
                  <span className="cursor-pointer hover:text-blue-500">
                    {member.name.split("(")[0]}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  prefetch={true}
                  href={`https://www.worldcubeassociation.org/persons/${member.wcaid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-neutral-800/60 text-neutral-300 text-xs font-mono border border-neutral-700/50 hover:text-blue-500">
                    {member.wcaid}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="cursor-default text-nowrap">
                {capitalizeRole(member.role)}
              </TableCell>
              <TableCell className="cursor-default">
                {memberDetails?.numberOfCompetitions || 0}
              </TableCell>
              <TableCell className="cursor-default">
                {getTotalMedals(memberDetails)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
