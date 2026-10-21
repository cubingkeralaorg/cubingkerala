// Trimmed down from the old app's src/types/api + src/types/wca — only what
// the pages we've ported so far actually need. Grows as we port more pages.

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

export type RoleType = "member" | "organiser" | "co-founder";

export interface Medals {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export type MemberWcaSummary = {
  competition_count: number;
  medals: Medals;
  isUnavailable?: boolean;
};

export interface UserProfile {
  isMember: boolean;
  email: string | null;
  emailConsent: boolean;
}
