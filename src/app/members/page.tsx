import { Suspense } from "react";
import { Metadata } from "next";
import { MembersData } from "@/components/members/members-data";
import { MembersSkeleton } from "@/components/members/membersSkeleton";
import { MembersPageShell } from "@/components/members/members-page-shell";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
  icons: {
    icon: "logoblack.png",
  },
};

export default function Members() {
  return (
    <MembersPageShell>
      <Suspense fallback={<MembersSkeleton />}>
        <MembersData />
      </Suspense>
    </MembersPageShell>
  );
}
