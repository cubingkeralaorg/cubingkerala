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
        <TableHeader className="border-y hover:bg-transparent border-y-border">
          <TableRow className="text-sm md:text-[15px] border-none">
            <TableHead className="text-muted-foreground">#</TableHead>
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">WCA ID</TableHead>
            <TableHead className="text-muted-foreground">Role</TableHead>
            <TableHead className="text-muted-foreground">Competitions</TableHead>
            <TableHead className="text-muted-foreground">Medals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              className="text-muted-foreground px-4 hover:bg-accent py-4"
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
      <TableHeader className="border-y hover:bg-transparent border-y-border">
        <TableRow className="text-sm md:text-[15px] hover:bg-transparent border-none">
          <TableHead className="text-muted-foreground">#</TableHead>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-muted-foreground">WCA ID</TableHead>
          <TableHead className="text-muted-foreground">Role</TableHead>
          <TableHead className="text-muted-foreground">Competitions</TableHead>
          <TableHead className="text-muted-foreground">Medals</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => {
          const memberDetails = membersDetails.find(
            (details) => details.id === member.wcaid,
          );

          return (
            <TableRow
              className="border-border hover:bg-transparent text-sm md:text-[15px]"
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
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary/60 text-muted-foreground text-xs font-mono border border-border/50 hover:text-blue-500">
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
