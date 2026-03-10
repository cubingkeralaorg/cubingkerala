"use client";

import { CompetitionsList } from "./competitionList";
import { CompetitionsHeader } from "./CompetitionsHeader";
import LoadingComponent from "@/components/shared/loading";
import { useCompetitions } from "@/hooks/useCompetitions";

const CompetitionsPage = () => {
  const {
    upcomingCompetitions,
    pastCompetitions,
    loading,
    lastUpdated,
    isRefreshing,
    handleForceRefresh,
  } = useCompetitions();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-foreground flex flex-col min-h-screen">
      <div className="animate-fade-in w-full">
        <CompetitionsHeader
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={handleForceRefresh}
        />

        <CompetitionsList
          upcomingCompetitions={upcomingCompetitions}
          pastCompetitions={pastCompetitions}
        />
      </div>
    </div>
  );
};

export default CompetitionsPage;
