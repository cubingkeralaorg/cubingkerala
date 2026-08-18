import type { Competition } from "@/types/competition.types";

export type FeaturedCompetitionKind = "upcoming" | "past";

export type FeaturedCompetition = {
  competition: Competition;
  kind: FeaturedCompetitionKind;
};

export function selectFeaturedCompetition(
  upcomingCompetitions: Competition[],
  pastCompetitions: Competition[],
): FeaturedCompetition | null {
  const next = upcomingCompetitions.find((comp) => !comp.cancelled_at);
  if (next) {
    return { competition: next, kind: "upcoming" };
  }

  const latestPast = pastCompetitions.find((comp) => !comp.cancelled_at);
  if (latestPast) {
    return { competition: latestPast, kind: "past" };
  }

  return null;
}

export function selectUpcomingPreview(
  upcomingCompetitions: Competition[],
  limit = 3,
): Competition[] {
  return upcomingCompetitions
    .filter((comp) => !comp.cancelled_at)
    .slice(0, limit);
}
