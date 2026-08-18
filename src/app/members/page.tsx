import { Suspense } from "react";
import { Metadata } from "next";
import { MembersData } from "@/components/members/members-data";
import { MembersSkeleton } from "@/components/members/members-skeleton";
import { MembersPageShell } from "@/components/members/members-page-shell";
import { DATA_GRID_WRAP } from "@/components/ui/data-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
};

export default function Members() {
  return (
    <MembersPageShell>
      <Suspense
        fallback={
          <div className={DATA_GRID_WRAP}>
            <MembersSkeleton />
          </div>
        }
      >
        <MembersData />
      </Suspense>
    </MembersPageShell>
  );
}
