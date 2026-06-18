import { unstable_cache } from "next/cache";
import db from "./db";
import { fetchCompetitionsFromDb } from "./competitions.queries";
import {
  getRankingsWcaDataForMembers,
  getWcaSummaryForMembers,
} from "./wca.sync";

export const CACHE_REVALIDATE_SECONDS = 300;

export const getCachedMembers = unstable_cache(
  async () =>
    db.members.findMany({
      orderBy: { name: "asc" },
    }),
  ["members-list"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["members"] },
);

export const getCachedWcaSummaries = unstable_cache(
  async () => {
    const members = await db.members.findMany({ select: { wcaid: true } });
    const wcaIds = members.map((m) => m.wcaid).filter(Boolean);
    return getWcaSummaryForMembers(wcaIds);
  },
  ["wca-summaries"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["members", "wca-data"] },
);

export const getCachedRankingsWcaData = unstable_cache(
  async () => {
    const members = await db.members.findMany({ select: { wcaid: true } });
    const wcaIds = members.map((m) => m.wcaid).filter(Boolean);
    return getRankingsWcaDataForMembers(wcaIds);
  },
  ["rankings-wca-data"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["members", "wca-data"] },
);

export const getCachedCompetitions = unstable_cache(
  async () => fetchCompetitionsFromDb(),
  ["competitions-list"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["competitions"] },
);
