/**
 * Results API Types
 * Competition results and member performance from WCA API
 */

export interface MemberCompetitionResult {
  round: string;
  position: number;
  best: number;
  average?: number;
  format: string;
  attempts?: number[];
}

export interface MemberEventResult {
  [eventId: string]: MemberCompetitionResult[];
}

export interface MemberCompetitionDetails {
  [competitionId: string]: MemberEventResult;
}

export interface MemberRankDetails {
  world: number;
  continent: number;
  country: number;
}

export interface MemberRecordDetails {
  eventId: string;
  best: number;
  rank: {
    country?: number;
    continent?: number;
    world?: number;
  };
}

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
