import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RoleSelect } from "./role-select";
import { useMockAuth } from "@/hooks/useMockAuth";
import type { RequestInfo, RoleType } from "@/types/member";
import { cn } from "@/lib/utils";
import {
  DATA_GRID_CELL,
  DATA_GRID_HEAD,
  DATA_GRID_ROW,
  DATA_GRID_TABLE,
  DATA_GRID_WRAP,
} from "@/components/ui/data-grid";

interface RequestsAdminPageProps {
  initialRequests: RequestInfo[];
  initialMembers: RequestInfo[];
}

function sortByName(list: RequestInfo[]): RequestInfo[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export function RequestsAdminPage({ initialRequests, initialMembers }: RequestsAdminPageProps) {
  const { isAdmin, login } = useMockAuth();
  const [requests, setRequests] = useState<RequestInfo[]>(initialRequests);
  const [members, setMembers] = useState<RequestInfo[]>(initialMembers);
  // Role picked in a member row's dropdown but not yet saved — Update
  // commits it into `members`, so picking a role alone doesn't change
  // anything until you confirm.
  const [draftMemberRoles, setDraftMemberRoles] = useState<Record<string, RoleType>>({});
  // Reject and Delete are both irreversible removals — route both through
  // one shared confirm dialog instead of acting immediately on click.
  const [pendingRemoval, setPendingRemoval] = useState<{ type: "request" | "member"; wcaid: string; name: string } | null>(
    null,
  );

  const handleApprove = (wcaid: string) => {
    const request = requests.find((entry) => entry.wcaid === wcaid);
    if (!request) return;
    setMembers((prev) => [...prev, request]);
    setRequests((prev) => prev.filter((entry) => entry.wcaid !== wcaid));
  };

  const handleReject = (wcaid: string) => {
    setRequests((prev) => prev.filter((entry) => entry.wcaid !== wcaid));
  };

  const handleRequestRoleChange = (wcaid: string, role: RoleType) => {
    setRequests((prev) => prev.map((entry) => (entry.wcaid === wcaid ? { ...entry, role } : entry)));
  };

  const handleMemberRoleSelect = (wcaid: string, role: RoleType) => {
    setDraftMemberRoles((prev) => ({ ...prev, [wcaid]: role }));
  };

  const handleUpdateMember = (wcaid: string) => {
    const role = draftMemberRoles[wcaid];
    if (role === undefined) return;
    setMembers((prev) => prev.map((entry) => (entry.wcaid === wcaid ? { ...entry, role } : entry)));
    setDraftMemberRoles((prev) => {
      const { [wcaid]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleDeleteMember = (wcaid: string) => {
    setMembers((prev) => prev.filter((entry) => entry.wcaid !== wcaid));
    setDraftMemberRoles((prev) => {
      const { [wcaid]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const confirmPendingRemoval = () => {
    if (!pendingRemoval) return;
    if (pendingRemoval.type === "request") {
      handleReject(pendingRemoval.wcaid);
    } else {
      handleDeleteMember(pendingRemoval.wcaid);
    }
    setPendingRemoval(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-start gap-3 py-10">
        <p className="text-sm text-muted-foreground md:text-base">
          You need to be logged in as an admin to view this page.
        </p>
        <Button onClick={login}>Login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Pending requests</h2>
        <div className={DATA_GRID_WRAP}>
          <Table className={DATA_GRID_TABLE}>
            <TableHeader className="[&_tr]:border-0">
              <TableRow className={DATA_GRID_ROW}>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>Name</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[150px]")}>WCA ID</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[160px]")}>Role</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[180px] text-right")}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow className={DATA_GRID_ROW}>
                  <TableCell colSpan={4} className={cn(DATA_GRID_CELL, "py-6 text-sm text-muted-foreground")}>
                    No pending requests.
                  </TableCell>
                </TableRow>
              ) : (
                sortByName(requests).map((request) => (
                  <TableRow key={request.wcaid} className={DATA_GRID_ROW}>
                    <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap font-medium")}>
                      {request.name.split("(")[0]}
                    </TableCell>
                    <TableCell className={DATA_GRID_CELL}>
                      <a
                        href={`https://www.worldcubeassociation.org/persons/${request.wcaid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted-foreground hover:text-primary"
                      >
                        {request.wcaid}
                      </a>
                    </TableCell>
                    <TableCell className={DATA_GRID_CELL}>
                      <RoleSelect
                        value={request.role}
                        onChange={(role) => handleRequestRoleChange(request.wcaid, role)}
                      />
                    </TableCell>
                    <TableCell className={cn(DATA_GRID_CELL, "text-right")}>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleApprove(request.wcaid)}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setPendingRemoval({ type: "request", wcaid: request.wcaid, name: request.name })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Members</h2>
        <div className={DATA_GRID_WRAP}>
          <Table className={DATA_GRID_TABLE}>
            <TableHeader className="[&_tr]:border-0">
              <TableRow className={DATA_GRID_ROW}>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD)}>Name</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[150px]")}>WCA ID</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[160px]")}>Role</TableHead>
                <TableHead className={cn(DATA_GRID_CELL, DATA_GRID_HEAD, "w-[180px] text-right")}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow className={DATA_GRID_ROW}>
                  <TableCell colSpan={4} className={cn(DATA_GRID_CELL, "py-6 text-sm text-muted-foreground")}>
                    No active members.
                  </TableCell>
                </TableRow>
              ) : (
                sortByName(members).map((member) => {
                  const draftRole = draftMemberRoles[member.wcaid];
                  const isDirty = draftRole !== undefined && draftRole !== member.role;

                  return (
                    <TableRow key={member.wcaid} className={DATA_GRID_ROW}>
                      <TableCell className={cn(DATA_GRID_CELL, "whitespace-nowrap font-medium")}>
                        <a href={`/members/${member.wcaid}`} className="hover:text-primary">
                          {member.name.split("(")[0]}
                        </a>
                      </TableCell>
                      <TableCell className={DATA_GRID_CELL}>
                        <a
                          href={`https://www.worldcubeassociation.org/persons/${member.wcaid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-muted-foreground hover:text-primary"
                        >
                          {member.wcaid}
                        </a>
                      </TableCell>
                      <TableCell className={DATA_GRID_CELL}>
                        <RoleSelect
                          value={draftRole ?? member.role}
                          onChange={(role) => handleMemberRoleSelect(member.wcaid, role)}
                        />
                      </TableCell>
                      <TableCell className={cn(DATA_GRID_CELL, "text-right")}>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!isDirty}
                            onClick={() => handleUpdateMember(member.wcaid)}
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              setPendingRemoval({ type: "member", wcaid: member.wcaid, name: member.name })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <DialogContent>
          <DialogTitle>{pendingRemoval?.type === "request" ? "Reject this request?" : "Delete this member?"}</DialogTitle>
          <DialogDescription className="mt-2">
            {pendingRemoval?.type === "request"
              ? `${pendingRemoval?.name}'s membership request will be removed. This can't be undone.`
              : `${pendingRemoval?.name} will be removed from the members list. This can't be undone.`}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={confirmPendingRemoval}>
              {pendingRemoval?.type === "request" ? "Reject" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
