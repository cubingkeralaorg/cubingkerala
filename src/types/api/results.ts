/**
 * Results API Types
 * Competition results and member performance from WCA API
 */

export interface CompetitionResultEntry {
  id: number;
  pos: number;
  best: number;
  average: number;
  name: string;
  country_iso2: string;
  competition_id: string;
  event_id: string;
  round_type_id: string;
  format_id: string;
  wca_id: string;
  attempts: number[];
  best_index: number;
  worst_index: number;
  regional_single_record: string | null;
  regional_average_record: string | null;
}

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

