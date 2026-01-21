/**
 * Competition API Types
 * Full competition types from WCA API
 */

export interface Competition {
  announced_at: string;
  cancelled_at: string | null;
  city: string;
  class: string;
  competitor_limit: number;
  country_iso2: string;
  date_range: string;
  delegates: {
    name: string;
    email: string;
  }[];
  end_date: string;
  event_ids: string[];
  id: string;
  latitude_degrees: number;
  longitude_degrees: number;
  name: string;
  organizers: {
    name: string;
    email: string;
  }[];
  registration_close: string;
  registration_open: string;
  results_posted_at: string;
  short_display_name: string;
  short_name: string;
  start_date: string;
  time_until_registration: string;
  url: string;
  venue: string;
  venue_address: string;
  venue_details: string;
  website: string;
}

export interface ApiResponse {
  items: Competition[];
  pagination: {
    page: number;
    size: number;
  };
  total: number;
}

export interface CompetitionDetails {
  id: string;
  name: string;
  city: string;
  country: string;
  date: {
    from: string;
    till: string;
    numberOfDays: number;
  };
  isCanceled: boolean;
  events: string[];
  wcaDelegates: {
    name: string;
    email: string;
  }[];
  organisers: {
    name: string;
    email: string;
  }[];
  venue: {
    name: string;
    address: string;
    details?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  information: string;
  externalWebsite: string | null;
}
