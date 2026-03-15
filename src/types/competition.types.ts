export interface Competition {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  venue: string;
  country_iso2: string;
  cancelled_at?: string | null;
  has_results: boolean;
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
