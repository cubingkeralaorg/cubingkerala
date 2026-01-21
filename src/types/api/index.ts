/**
 * API Types Barrel Export
 * Central export for all WCA API-related types
 * 
 * Usage:
 * import { Competition as ApiCompetition, EventDetails } from '@/types/api';
 */

// Competition API types
export type {
  Competition,
  ApiResponse,
  CompetitionDetails,
} from './competition';

// Event API types
export type {
  EventType,
  EventAvatar,
  EventCountry,
  EventPerson,
  EventDetails,
} from './event';

// User API types
export type {
  Avatar,
  Country,
  UserInfo,
  RequestInfo,
} from './user';

// Competitor API types
export type {
  PersonalRecords,
  Medals,
  Person,
  CompetitorData,
} from './competitor';

// Results API types
export type {
  MemberCompetitionResult,
  MemberEventResult,
  MemberCompetitionDetails,
  MemberRankDetails,
  MemberRecordDetails,
  MemberPersonResult,
} from './results';
