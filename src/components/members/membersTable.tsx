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
import { RequestInfo } from "@/types/api";
import { capitalizeRole, getTotalMedalsFromSummary } from "@/utils/memberUtils";
import { MemberWcaSummary } from "@/types/wca";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
} from "@/components/ui/data-grid";

interface MembersTableProps {
  members: RequestInfo[];
  wcaSummaries: Record<string, MemberWcaSummary>;
}

export function MembersTable({ members, wcaSummaries }: MembersTableProps) {
  const summaryByWcaId = useMemo(
    () => new Map(Object.entries(wcaSummaries)),
    [wcaSummaries],
  );

  return (
    <Table className={DATA_GRID_TABLE}>
      <TableHeader className="[&_tr]:border-0">
        <TableRow className={DATA_GRID_ROW}>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[50px]")}>
            #
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>
            Name
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[150px]")}>
            WCA ID
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[120px]")}>
            Role
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[120px]")}>
            Competitions
          </TableHead>
          <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[100px]")}>
            Medals
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow className={DATA_GRID_ROW}>
            <TableCell
              colSpan={6}
              className={cn(DATA_GRID_CELL, "py-6 text-muted-foreground")}
            >
              No results found
            </TableCell>
          </TableRow>
        ) : (
          members.map((member, index) => {
            const summary = summaryByWcaId.get(member.wcaid);
            const isUnavailable = Boolean(summary?.isUnavailable);

            return (
              <TableRow key={member.wcaid} className={DATA_GRID_ROW}>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums text-muted-foreground")}>
                  {index + 1}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap font-medium")}>
                  <Link
                    prefetch={true}
                    href={`/members/${member.wcaid}`}
                    className={cn(
                      "hover:text-primary",
                      isUnavailable && "text-muted-foreground",
                    )}
                  >
                    {member.name.split("(")[0]}
                  </Link>
                </TableCell>
                <TableCell className={DATA_GRID_CELL}>
                  <Link
                    prefetch={true}
                    href={`https://www.worldcubeassociation.org/persons/${member.wcaid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted-foreground hover:text-primary"
                  >
                    {member.wcaid}
                  </Link>
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap")}>
                  {capitalizeRole(member.role)}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {isUnavailable ? (
                    <span className="italic text-muted-foreground">N/A</span>
                  ) : (
                    summary?.competition_count || 0
                  )}
                </TableCell>
                <TableCell className={cn(DATA_GRID_CELL, "tabular-nums")}>
                  {isUnavailable ? (
                    <span className="italic text-muted-foreground">N/A</span>
                  ) : (
                    getTotalMedalsFromSummary(summary)
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
