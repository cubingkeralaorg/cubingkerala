import { RequestInfo } from "./api";
import { RankingsWcaEntry } from "./wca";

export interface RankingsComponentProps {
  members: RequestInfo[];
  rankingsWcaData?: Record<string, RankingsWcaEntry>;
}

export interface FilterState {
  event: string;
  round: string;
}
