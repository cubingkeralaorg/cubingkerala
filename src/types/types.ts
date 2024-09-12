//interface for single competition details
export interface Competition {
  city: string;
  country: string;
  date: {
    from: string;
    till: string;
    numberOfDays: number;
  };
  events: string[];
  externalWebsite: string | null;
  id: string;
  information: string;
  isCanceled: boolean;
  name: string;
  organisers: {
    name: string;
    email: string;
  }[];
  venue: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    details: string;
    name: string;
  };
  wcaDelegates: {
    name: string;
    email: string;
  }[];
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



