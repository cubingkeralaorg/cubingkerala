// Stand-in for real D1 data while we build out the frontend. Each mock export
// mirrors the shape the eventual Drizzle query will return, so swapping this
// module out for a real query later is a one-line change in the page, not a
// component rewrite.

import type { RequestInfo, MemberWcaSummary } from "@/types/member";
import type { RankingsWcaEntry } from "@/types/ranking";
import type { Competition, CompetitionDetail, CompetitionResultEntry } from "@/types/competition";

export const mockMembers: RequestInfo[] = [
  {
    wcaid: "2015ALEX01",
    name: "Alex Thomas",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "organiser",
    createdAt: new Date("2015-03-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2018PRIY02",
    name: "Priya Nair",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "f",
    role: "member",
    createdAt: new Date("2018-07-12"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2020ROHI03",
    name: "Rohit Menon",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "co-founder",
    createdAt: new Date("2020-01-20"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2022SREE04",
    name: "Sreelakshmi Kumar",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "f",
    role: "member",
    createdAt: new Date("2022-11-05"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2017AKHI05",
    name: "Akhil Baby",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "co-founder",
    createdAt: new Date("2017-06-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2019MEER06",
    name: "Meera Pillai",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "f",
    role: "co-founder",
    createdAt: new Date("2019-02-20"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2016VISH07",
    name: "Vishnu Das",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "organiser",
    createdAt: new Date("2016-09-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    wcaid: "2022DEEP01",
    name: "Hari Anjana Deepak",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "member",
    createdAt: new Date("2022-04-10"),
    updatedAt: new Date("2025-01-01"),
  },
];

export const mockWcaSummaries: Record<string, MemberWcaSummary> = {
  "2015ALEX01": {
    competition_count: 12,
    medals: { gold: 3, silver: 2, bronze: 1, total: 6 },
  },
  "2018PRIY02": {
    competition_count: 4,
    medals: { gold: 0, silver: 1, bronze: 2, total: 3 },
  },
  "2020ROHI03": {
    competition_count: 20,
    medals: { gold: 8, silver: 5, bronze: 4, total: 17 },
  },
  "2022SREE04": {
    competition_count: 1,
    medals: { gold: 0, silver: 0, bronze: 0, total: 0 },
  },
  "2017AKHI05": {
    competition_count: 25,
    medals: { gold: 6, silver: 7, bronze: 3, total: 16 },
  },
  "2019MEER06": {
    competition_count: 9,
    medals: { gold: 1, silver: 2, bronze: 2, total: 5 },
  },
  "2016VISH07": {
    competition_count: 16,
    medals: { gold: 2, silver: 3, bronze: 5, total: 10 },
  },
  "2022DEEP01": {
    competition_count: 14,
    medals: { gold: 10, silver: 2, bronze: 1, total: 13 },
  },
};

const record = (
  best: number,
  countryRank: number,
  continentRank: number,
  worldRank: number,
) => ({
  best,
  country_rank: countryRank,
  continent_rank: continentRank,
  world_rank: worldRank,
});

export const mockRankingsWcaData: Record<string, RankingsWcaEntry> = {
  "2015ALEX01": {
    personal_records: {
      "222": { single: record(340, 2, 15, 420), average: record(410, 2, 18, 500) },
      "333": { single: record(850, 2, 15, 420), average: record(1020, 2, 18, 500) },
      "444": { single: record(2050, 2, 15, 420), average: record(2400, 2, 18, 500) },
      "333oh": { single: record(1340, 2, 15, 420), average: record(1550, 2, 18, 500) },
    },
  },
  "2018PRIY02": {
    personal_records: {
      "222": { single: record(520, 5, 40, 1100), average: record(610, 5, 42, 1150) },
      "333": { single: record(1340, 5, 40, 1100), average: record(1510, 5, 42, 1150) },
      "444": { single: record(3100, 5, 40, 1100), average: record(3550, 5, 42, 1150) },
      "333oh": { single: record(2050, 5, 40, 1100), average: record(2350, 5, 42, 1150) },
    },
  },
  "2020ROHI03": {
    personal_records: {
      "222": { single: record(250, 1, 5, 90), average: record(310, 1, 6, 110) },
      "333": { single: record(620, 1, 5, 90), average: record(780, 1, 6, 110) },
      "444": { single: record(1550, 1, 5, 90), average: record(1820, 1, 6, 110) },
      "333oh": { single: record(980, 1, 5, 90), average: record(1140, 1, 6, 110) },
    },
  },
  "2022SREE04": {
    isUnavailable: true,
    personal_records: {},
  },
  "2017AKHI05": {
    personal_records: {
      "222": { single: record(290, 1, 8, 140), average: record(350, 1, 9, 160) },
      "333": { single: record(710, 1, 8, 140), average: record(890, 1, 9, 160) },
      "444": { single: record(1750, 1, 8, 140), average: record(2050, 1, 9, 160) },
      "333oh": { single: record(1120, 1, 8, 140), average: record(1300, 1, 9, 160) },
    },
  },
  "2019MEER06": {
    personal_records: {
      "222": { single: record(600, 6, 48, 1300), average: record(700, 6, 50, 1360) },
      "333": { single: record(1580, 6, 48, 1300), average: record(1740, 6, 50, 1360) },
      "444": { single: record(3600, 6, 48, 1300), average: record(4100, 6, 50, 1360) },
      "333oh": { single: record(2400, 6, 48, 1300), average: record(2750, 6, 50, 1360) },
    },
  },
  "2016VISH07": {
    personal_records: {
      "222": { single: record(390, 3, 22, 610), average: record(460, 3, 24, 650) },
      "333": { single: record(990, 3, 22, 610), average: record(1150, 3, 24, 650) },
      "444": { single: record(2350, 3, 22, 610), average: record(2700, 3, 24, 650) },
      "333oh": { single: record(1550, 3, 22, 610), average: record(1780, 3, 24, 650) },
    },
  },
  "2022DEEP01": {
    personal_records: {
      // National-record single — set in 2025, see AchievementBanner.
      "222": { single: record(280, 2, 10, 110), average: record(340, 2, 11, 130) },
      "333": { single: record(477, 1, 3, 40), average: record(650, 1, 4, 55) },
      "444": { single: record(1900, 2, 10, 110), average: record(2200, 2, 11, 130) },
      "333oh": { single: record(1050, 1, 5, 70), average: record(1220, 1, 6, 85) },
    },
  },
};

export const mockUpcomingCompetitions: Competition[] = [
  {
    id: "KeralaCubeOpen2026",
    name: "Kerala Cube Open 2026",
    city: "Kochi",
    start_date: "2026-12-05",
    end_date: "2026-12-06",
    event_ids: ["333", "222", "444", "pyram"],
    venue: "Lulu International Convention Centre",
    country_iso2: "IN",
    has_results: false,
  },
];

export const mockPastCompetitions: Competition[] = [
  {
    id: "TrivandrumSpeedcubing2026",
    name: "Trivandrum Speedcubing 2026",
    city: "Thiruvananthapuram",
    start_date: "2026-05-10",
    end_date: "2026-05-10",
    event_ids: ["333", "222", "333oh"],
    venue: "Technopark Convention Centre",
    country_iso2: "IN",
    has_results: true,
  },
  {
    id: "CochinCubersCup2025",
    name: "Cochin Cubers Cup 2025",
    city: "Kochi",
    start_date: "2025-09-20",
    end_date: "2025-09-21",
    event_ids: ["333", "444", "555", "333bf"],
    venue: "Kochi Convention Hall",
    country_iso2: "IN",
    has_results: true,
    cancelled_at: null,
  },
  {
    id: "CalicutCubeFest2025",
    name: "Calicut Cube Fest 2025",
    city: "Kozhikode",
    start_date: "2025-03-15",
    end_date: "2025-03-15",
    event_ids: ["333", "222", "skewb"],
    venue: "Calicut Town Hall",
    country_iso2: "IN",
    has_results: true,
  },
  {
    id: "KannurCubeMeet2024",
    name: "Kannur Cube Meet 2024",
    city: "Kannur",
    start_date: "2024-11-09",
    end_date: "2024-11-09",
    event_ids: ["333", "444", "pyram"],
    venue: "Kannur Town Hall",
    country_iso2: "IN",
    has_results: true,
  },
  {
    id: "PalakkadOpen2024",
    name: "Palakkad Open 2024",
    city: "Palakkad",
    start_date: "2024-06-22",
    end_date: "2024-06-23",
    event_ids: ["333", "222", "555", "clock"],
    venue: "Palakkad District Stadium",
    country_iso2: "IN",
    has_results: true,
  },
];

export const mockCompetitionDetails: Record<string, CompetitionDetail> = {
  KeralaCubeOpen2026: {
    venueAddress: "NH 49, Kochi, Kerala 682304",
    competitorLimit: 120,
    informationHtml:
      "<p>Kerala's biggest cubing event returns for 2026, with a packed schedule across four events.</p><p>Spectators are welcome — entry is free for non-competitors.</p>",
    registrationOpen: "2026-10-01T09:00:00+05:30",
    registrationClose: "2026-11-25T23:59:00+05:30",
    mainEventId: "333",
    organizers: [
      { id: 1, name: "Rohit Menon", wcaId: "2020ROHI03" },
      { id: 2, name: "Akhil Baby", wcaId: "2017AKHI05" },
    ],
    coordinates: [9.9816, 76.2999],
  },
  TrivandrumSpeedcubing2026: {
    venueAddress: "Technopark Campus, Thiruvananthapuram, Kerala 695581",
    competitorLimit: 80,
    informationHtml:
      "<p>A one-day event hosted inside Technopark, built around 3x3x3 with a One-Handed side event.</p>",
    registrationOpen: "2026-03-01T09:00:00+05:30",
    registrationClose: "2026-04-20T23:59:00+05:30",
    mainEventId: "333",
    organizers: [{ id: 3, name: "Meera Pillai", wcaId: "2019MEER06" }],
    coordinates: [8.5565, 76.8816],
  },
  CochinCubersCup2025: {
    venueAddress: "Kochi Convention Hall, MG Road, Kochi, Kerala 682016",
    competitorLimit: 100,
    informationHtml:
      "<p>Two-day event with 4x4x4, 5x5x5, and Blindfolded alongside the usual 3x3x3 rounds.</p>",
    registrationOpen: "2025-07-01T09:00:00+05:30",
    registrationClose: "2025-08-30T23:59:00+05:30",
    mainEventId: "333",
    organizers: [
      { id: 2, name: "Akhil Baby", wcaId: "2017AKHI05" },
      { id: 4, name: "Vishnu Das", wcaId: "2016VISH07" },
    ],
    coordinates: [9.9312, 76.2673],
  },
  CalicutCubeFest2025: {
    venueAddress: "Calicut Town Hall, Kozhikode, Kerala 673001",
    competitorLimit: 70,
    informationHtml: "<p>A community favourite — Skewb alongside the staple 3x3x3 and 2x2x2 rounds.</p>",
    registrationOpen: "2025-01-05T09:00:00+05:30",
    registrationClose: "2025-02-20T23:59:00+05:30",
    mainEventId: "333",
    organizers: [{ id: 5, name: "Priya Nair", wcaId: "2018PRIY02" }],
    coordinates: [11.2588, 75.7804],
  },
  KannurCubeMeet2024: {
    venueAddress: "Kannur Town Hall, Kannur, Kerala 670001",
    competitorLimit: 60,
    informationHtml: "<p>A small, friendly meet to close out the year — 3x3x3, 4x4x4, and Pyraminx.</p>",
    registrationOpen: "2024-09-01T09:00:00+05:30",
    registrationClose: "2024-10-15T23:59:00+05:30",
    mainEventId: "333",
    organizers: [{ id: 1, name: "Rohit Menon", wcaId: "2020ROHI03" }],
    coordinates: [11.8745, 75.3704],
  },
  PalakkadOpen2024: {
    venueAddress: "Palakkad District Stadium, Palakkad, Kerala 678001",
    competitorLimit: 90,
    informationHtml: "<p>Palakkad's first open event — 3x3x3, 2x2x2, 5x5x5, and Clock.</p>",
    registrationOpen: "2024-04-01T09:00:00+05:30",
    registrationClose: "2024-05-25T23:59:00+05:30",
    mainEventId: "333",
    organizers: [{ id: 4, name: "Vishnu Das", wcaId: "2016VISH07" }],
    coordinates: [10.7867, 76.6548],
  },
};

export const mockCompetitionResults: Record<string, CompetitionResultEntry[]> = {
  TrivandrumSpeedcubing2026: [
    { id: 1, eventId: "333", pos: 1, name: "Rohit Menon", best: 620, average: 780 },
    { id: 2, eventId: "333", pos: 2, name: "Akhil Baby", best: 710, average: 890 },
    { id: 3, eventId: "333", pos: 3, name: "Alex Thomas", best: 850, average: 1020 },
    { id: 4, eventId: "222", pos: 1, name: "Rohit Menon", best: 250, average: 310 },
    { id: 5, eventId: "222", pos: 2, name: "Akhil Baby", best: 290, average: 350 },
    { id: 6, eventId: "222", pos: 3, name: "Alex Thomas", best: 340, average: 410 },
    { id: 7, eventId: "333oh", pos: 1, name: "Rohit Menon", best: 980, average: 1140 },
    { id: 8, eventId: "333oh", pos: 2, name: "Akhil Baby", best: 1120, average: 1300 },
    { id: 9, eventId: "333oh", pos: 3, name: "Alex Thomas", best: 1340, average: 1550 },
  ],
  CochinCubersCup2025: [
    { id: 10, eventId: "333", pos: 1, name: "Rohit Menon", best: 620, average: 780 },
    { id: 11, eventId: "333", pos: 2, name: "Akhil Baby", best: 710, average: 890 },
    { id: 12, eventId: "333", pos: 3, name: "Vishnu Das", best: 990, average: 1150 },
    { id: 13, eventId: "444", pos: 1, name: "Rohit Menon", best: 1550, average: 1820 },
    { id: 14, eventId: "444", pos: 2, name: "Akhil Baby", best: 1750, average: 2050 },
    { id: 15, eventId: "444", pos: 3, name: "Vishnu Das", best: 2350, average: 2700 },
  ],
};

// Pending membership requests — same shape as mockMembers (mirrors the old
// app's Requests/Members tables, which were structurally identical). New
// WCA sign-ins default to role "member" until an admin approves them.
export const mockPendingRequests: RequestInfo[] = [
  {
    wcaid: "2023ARJU08",
    name: "Arjun Krishnan",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "m",
    role: "member",
    createdAt: new Date("2026-09-20"),
    updatedAt: new Date("2026-09-20"),
  },
  {
    wcaid: "2024DEVI09",
    name: "Devika Suresh",
    avatarUrl: "https://www.worldcubeassociation.org/assets/missing_avatar_thumb.png",
    country: "India",
    gender: "f",
    role: "member",
    createdAt: new Date("2026-10-02"),
    updatedAt: new Date("2026-10-02"),
  },
];
