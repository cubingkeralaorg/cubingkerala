import { MembersList } from "@/components/members";
import { getCachedMembers, getCachedWcaSummaries } from "@/lib/cached-queries";
import { RequestInfo } from "@/types/api";

export async function MembersData() {
  const [members, wcaSummaries] = await Promise.all([
    getCachedMembers(),
    getCachedWcaSummaries(),
  ]);

  return (
    <MembersList
      membersfromdb={members as RequestInfo[]}
      wcaSummaries={wcaSummaries}
    />
  );
}
