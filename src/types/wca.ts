import { Medals, PersonalRecords } from "@/types/api";

export type MemberWcaSummary = {
  competition_count: number;
  medals: Medals;
  isUnavailable?: boolean;
};

export type RankingsWcaEntry = {
  personal_records: PersonalRecords;
  isUnavailable?: boolean;
};
