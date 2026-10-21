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

export interface CompetitionOrganizer {
  id: number;
  name: string;
  wcaId: string | null;
}

export interface CompetitionDetail {
  venueAddress: string;
  competitorLimit: number;
  informationHtml: string;
  registrationOpen: string;
  registrationClose: string;
  mainEventId: string;
  organizers: CompetitionOrganizer[];
  coordinates: [number, number];
}

export interface CompetitionResultEntry {
  id: number;
  eventId: string;
  pos: number;
  name: string;
  best: number;
  average: number;
}
