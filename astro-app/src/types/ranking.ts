import type { Medals, RequestInfo } from "@/types/member";

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

export interface WcaTeamMembership {
  friendly_id: string;
  leader: boolean;
  senior_member: boolean;
}

export interface Person {
  name: string;
  wca_id: string;
  avatar: { url: string; pending_url: string; thumb_url: string; is_default: boolean };
  gender: string;
  country_iso2: string;
  url: string;
  country: { id: string; name: string; continentId: string; iso2: string };
  delegate_status: string | null;
  class: string;
  // Not actually string[] — real WCA API responses return full team
  // membership objects (confirmed against live data), each person's name/
  // avatar duplicated per entry. Only the fields this app actually uses.
  teams: WcaTeamMembership[];
  id: string;
}

export interface CompetitorData {
  person: Person;
  competition_count: number;
  personal_records: PersonalRecords;
  medals: Medals;
  records: { national: number; continental: number; world: number; total: number };
}

export type RankingsWcaEntry = {
  personal_records: PersonalRecords;
  isUnavailable?: boolean;
};

export interface FilterState {
  event: string;
  round: string;
}

export interface RankingsComponentProps {
  members: RequestInfo[];
  rankingsWcaData?: Record<string, RankingsWcaEntry>;
}
