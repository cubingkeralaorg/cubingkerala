/**
 * User API Types
 * User-related types from WCA API
 */

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
  };
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
