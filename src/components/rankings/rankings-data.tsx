import { RankingsPage } from "@/components/rankings";
import { getCachedMembers, getCachedRankingsWcaData } from "@/lib/cached-queries";
import { RequestInfo } from "@/types/api";

export async function RankingsData() {
  const [members, rankingsWcaData] = await Promise.all([
    getCachedMembers(),
    getCachedRankingsWcaData(),
  ]);

  return (
    <RankingsPage
      members={members as RequestInfo[]}
      rankingsWcaData={rankingsWcaData}
    />
  );
}
