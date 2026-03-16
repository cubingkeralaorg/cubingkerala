import { RequestInfo } from "./api";

export interface RankingsComponentProps {
  members: RequestInfo[];
  initialWcaCache?: Record<string, any>;
}

export interface FilterState {
  event: string;
  round: string;
}
