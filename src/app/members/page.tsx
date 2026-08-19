import { Suspense } from "react";
import { Metadata } from "next";
import Loading from "@/components/shared/loading";
import { MembersData } from "@/components/members/members-data";
import { MembersPageShell } from "@/components/members/members-page-shell";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
};

export default function Members() {
  return (
    <MembersPageShell>
      <Suspense fallback={<Loading className="min-h-64 flex-none" />}>
        <MembersData />
      </Suspense>
    </MembersPageShell>
  );
}
