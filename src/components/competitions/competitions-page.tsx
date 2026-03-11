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
      <LoadingComponent />
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-10 px-4 sm:px-6 lg:px-8 text-foreground flex flex-col min-h-screen">
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
