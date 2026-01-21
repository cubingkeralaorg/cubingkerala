export interface Competition {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  cancelled_at?: string | null;
}

export interface CompetitionsData {
  upcomingCompetitions: Competition[];
  pastCompetitions: Competition[];
  lastFetch?: number;
}

export interface CachedData {
  data: CompetitionsData;
  cachedAt: number;
}

export interface CompetitionCardProps {
  competition: Competition;
  type: "upcoming" | "past";
  index: number;
}

export interface CompetitionSectionProps {
  title: string;
  competitions: Competition[];
  type: "upcoming" | "past";
  emptyMessage: {
    title: string;
    subtitle: string;
  };
}
