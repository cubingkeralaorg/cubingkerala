/**
 * Competitor API Types
 * Competitor data and personal records from WCA API
 */

import { Avatar, Country } from '../api/user';

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
