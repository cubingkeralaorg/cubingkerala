import {
  HeroSection,
  UnravelSection,
  LandingShell,
} from "@/components/home";
import { getCachedCompetitions } from "@/lib/cached-queries";
import { selectFeaturedCompetition } from "@/utils/featuredCompetition";

export const revalidate = 300;

async function getHomeCompetitions() {
  try {
    return await getCachedCompetitions();
  } catch {
    return {
      upcomingCompetitions: [],
      pastCompetitions: [],
    };
  }
}

export default async function Home() {
  const { upcomingCompetitions, pastCompetitions } =
    await getHomeCompetitions();
  const featured = selectFeaturedCompetition(
    upcomingCompetitions,
    pastCompetitions,
  );

  return (
    <LandingShell>
      <HeroSection
        competition={featured?.competition ?? null}
        kind={featured?.kind ?? null}
      />
      <UnravelSection />
    </LandingShell>
  );
}
