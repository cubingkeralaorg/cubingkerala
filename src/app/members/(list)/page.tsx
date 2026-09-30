import { Suspense } from "react";
import { Metadata } from "next";
import { MembersData } from "@/components/members/members-data";
import { MembersPageShell } from "@/components/members/members-page-shell";
import { PageContentLoading } from "@/components/shared/page-shell";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
};

export default function Members() {
  return (
    <MembersPageShell>
      <Suspense fallback={<PageContentLoading />}>
        <MembersData />
      </Suspense>
    </MembersPageShell>
  );
}
