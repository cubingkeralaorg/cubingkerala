/**
 * Event API Types
 * Event-related types from WCA API
 */

export interface EventType {
  event: string;
  ranking: {
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

export interface EventAvatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface EventCountry {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface EventPerson {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  wca_id: string | null;
  gender: string;
  country_iso2: string;
  url: string;
  country: EventCountry;
  delegate_status: string | null;
  email: string;
  location: string;
  region_id: number;
  class: string;
  teams: any[];
  avatar: EventAvatar;
}

export interface EventDetails {
  id: string;
  name: string;
  information: string;
  venue: string;
  contact: string;
  registration_open: string;
  registration_close: string;
  use_wca_registration: boolean;
  announced_at: string;
  base_entry_fee_lowest_denomination: number;
  currency_code: string;
  start_date: string;
  end_date: string;
  enable_donations: boolean;
  competitor_limit: number;
  extra_registration_requirements: string;
  on_the_spot_registration: boolean;
  on_the_spot_entry_fee_lowest_denomination: number | null;
  refund_policy_percent: number;
  refund_policy_limit_date: string;
  guests_entry_fee_lowest_denomination: number;
  qualification_results: boolean;
  external_registration_page: string | null;
  event_restrictions: boolean;
  cancelled_at: string | null;
  waiting_list_deadline_date: string;
  event_change_deadline_date: string;
  guest_entry_status: string;
  allow_registration_edits: boolean;
  allow_registration_self_delete_after_acceptance: boolean;
  allow_registration_without_qualification: boolean;
  guests_per_registration_limit: number | null;
  events_per_registration_limit: number | null;
  force_comment_in_registration: string | null;
  url: string;
  website: string;
  short_name: string;
  city: string;
  venue_address: string;
  venue_details: string;
  latitude_degrees: number;
  longitude_degrees: number;
  country_iso2: string;
  event_ids: string[];
  registration_currently_open: boolean;
  main_event_id: string;
  number_of_bookmarks: number;
  using_payment_integrations: boolean;
  uses_qualification: boolean;
  uses_cutoff: boolean;
  competition_series_ids: string[];
  registration_full: boolean;
  delegates: EventPerson[];
  organizers: EventPerson[];
}
