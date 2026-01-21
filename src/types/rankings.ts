import { RequestInfo } from "./api";

export interface RankingsComponentProps {
  members: RequestInfo[];
}

export interface FilterState {
  event: string;
  round: string;
}
