export interface Competition {
  announced_at: string; // e.g. "2025-01-30T19:52:22.000Z"
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




//interface for competitions
export interface ApiResonse {
  items: Competition[];
  pagination: {
    page: number;
    size: number;
  };
  total: number;
}



//interface for competition details
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



//for user info
export interface Avatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface Country {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface UserInfo {
  me: {
    avatar: Avatar;
    class: string;
    country: Country;
    country_iso2: string;
    created_at: string;
    delegate_status: string | null;
    gender: string;
    id: number;
    name: string;
    teams: any[];
    updated_at: string;
    url: string;
    wca_id: string;
  }
}

export interface RequestInfo {
  avatarUrl: string;
  country: string;
  createdAt: Date;
  gender: string;
  name: string;
  role: string;
  updatedAt: Date;
  wcaid: string;
}



//for memberResult info from api
export interface Avatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface Country {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface PersonalRecords {
  [event: string]: {
    single: {
      best: number;
      country_rank: number;
      continent_rank: number;
      world_rank: number;
    };
    average: {
      best: number;
      country_rank: number;
      continent_rank: number;
      world_rank: number;
    };
  };
}

export interface Medals {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface Person {
  name: string;
  wca_id: string;
  avatar: Avatar;
  gender: string;
  country_iso2: string;
  url: string;
  country: Country;
  delegate_status: string | null;
  class: string;
  teams: string[];
  id: string;
}

export interface CompetitorData {
  person: Person;
  competition_count: number;
  personal_records: PersonalRecords;
  medals: Medals;
  records: {
    national: number;
    continental: number;
    world: number;
    total: number;
  };
}


//for event type
export interface EventType {
  event: string;
  ranking: {
    single: {
      best: number;
      country_rank: number;
      continent_rank: number;
      world_rank: number;
    };
    average: {
      best: number;
      country_rank: number;
      continent_rank: number;
      world_rank: number;
    };
  };
}

// Renamed interface for member competition results
export interface MemberCompetitionResult {
  round: string;
  position: number;
  best: number;
  average?: number;
  format: string;
  attempts?: number[];
}

// Renamed interface for event results of a member
export interface MemberEventResult {
  [eventId: string]: MemberCompetitionResult[];
}

// Renamed interface for competition details for a member
export interface MemberCompetitionDetails {
  [competitionId: string]: MemberEventResult;
}

// Renamed interface for rank details
export interface MemberRankDetails {
  world: number;
  continent: number;
  country: number;
}

// Renamed interface for records
export interface MemberRecordDetails {
  eventId: string;
  best: number;
  rank: {
    country?: number;
    continent?: number;
    world?: number;
  };
}

// Renamed interface for personal results of a member
export interface MemberPersonResult {
  id: string;
  name: string;
  country: string;
  slug: string;
  numberOfChampionships: number;
  numberOfCompetitions: number;
  rank: {
    singles: MemberRecordDetails[];
    averages: MemberRecordDetails[];
  };
  results: MemberCompetitionDetails;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  records: {
    average: any[];
    single: any[];
  };
  championshipIds: string[];
  competitionIds: string[];
}



//new type for competition details from wca api
export interface EventDetails {
  id: string;
  name: string;
  information: string;
  venue: string;
  contact: string;
  registration_open: string; // ISO date format
  registration_close: string; // ISO date format
  use_wca_registration: boolean;
  announced_at: string; // ISO date format
  base_entry_fee_lowest_denomination: number;
  currency_code: string;
  start_date: string; // ISO date format
  end_date: string; // ISO date format
  enable_donations: boolean;
  competitor_limit: number;
  extra_registration_requirements: string;
  on_the_spot_registration: boolean;
  on_the_spot_entry_fee_lowest_denomination: number | null;
  refund_policy_percent: number;
  refund_policy_limit_date: string; // ISO date format
  guests_entry_fee_lowest_denomination: number;
  qualification_results: boolean;
  external_registration_page: string | null;
  event_restrictions: boolean;
  cancelled_at: string | null;
  waiting_list_deadline_date: string; // ISO date format
  event_change_deadline_date: string; // ISO date format
  guest_entry_status: string;
  allow_registration_edits: boolean;
  allow_registration_self_delete_after_acceptance: boolean;
  allow_registration_without_qualification: boolean;
  guests_per_registration_limit: number | null;
  events_per_registration_limit: number | null;
  force_comment_in_registration: string | null;
  url: string;
  website: string;
  short_name: string;
  city: string;
  venue_address: string;
  venue_details: string;
  latitude_degrees: number;
  longitude_degrees: number;
  country_iso2: string;
  event_ids: string[];
  registration_currently_open: boolean;
  main_event_id: string;
  number_of_bookmarks: number;
  using_payment_integrations: boolean;
  uses_qualification: boolean;
  uses_cutoff: boolean;
  competition_series_ids: string[];
  registration_full: boolean;
  delegates: EventPerson[];
  organizers: EventPerson[];
}

export interface EventPerson {
  id: number;
  created_at: string; // ISO date format
  updated_at: string; // ISO date format
  name: string;
  wca_id: string | null;
  gender: string;
  country_iso2: string;
  url: string;
  country: EventCountry;
  delegate_status: string | null;
  email: string;
  location: string;
  region_id: number;
  class: string;
  teams: any[];
  avatar: EventAvatar;
}

export interface EventCountry {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface EventAvatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}




