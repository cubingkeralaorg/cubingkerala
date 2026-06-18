import { CompetitionsPage } from "@/components/competitions";
import { getCachedCompetitions } from "@/lib/cached-queries";

export async function CompetitionsData() {
  const { upcomingCompetitions, pastCompetitions, initialLastUpdated } =
    await getCachedCompetitions();

  return (
    <CompetitionsPage
      initialUpcoming={upcomingCompetitions}
      initialPast={pastCompetitions}
      initialLastUpdated={initialLastUpdated}
    />
  );
}
