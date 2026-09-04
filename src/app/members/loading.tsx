import { MembersPageShell } from "@/components/members/members-page-shell";
import { PageContentLoading } from "@/components/shared/page-shell";

export default function Loading() {
  return (
    <MembersPageShell>
      <PageContentLoading />
    </MembersPageShell>
  );
}
