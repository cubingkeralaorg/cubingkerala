import type { Competition, CompetitionDetail, CompetitionOrganizer, CompetitionResultEntry } from "@/types/competition";
import { renderCompetitionInformation } from "./render-information";

// Unlike everything else ported so far, the competition detail page is NOT
// D1-backed in production — the real Next.js app fetches this live from the
// public WCA API on every request (no caching, no DB), and passes the raw
// response straight through. astro-app's Competition/CompetitionDetail/
// CompetitionResultEntry types were hand-picked subsets invented during the
// mock-data-only UI phase, so these two functions map the real (much
// larger) WCA response shape onto those existing types rather than
// expanding the UI to show everything WCA returns — same curated-subset
// choice the mock data already made, just backed by real data now.

const WCA_API_ORIGIN = "https://www.worldcubeassociation.org";

// Only the fields actually used below — the real response has ~60 fields.
interface WcaCompetitionRaw {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  venue: string;
  venue_address: string;
  country_iso2: string;
  cancelled_at: string | null;
  results_posted_at: string | null;
  competitor_limit: number | null;
  information: string;
  registration_open: string;
  registration_close: string;
  main_event_id: string;
  organizers: { id: number; name: string; wca_id: string | null }[];
  latitude_degrees: number;
  longitude_degrees: number;
}

interface WcaResultRaw {
  id: number;
  event_id: string;
  round_id: number;
  pos: number;
  name: string;
  best: number;
  average: number;
}

function toCompetition(raw: WcaCompetitionRaw): Competition {
  return {
    id: raw.id,
    name: raw.name,
    city: raw.city,
    start_date: raw.start_date,
    end_date: raw.end_date,
    event_ids: raw.event_ids,
    venue: raw.venue,
    country_iso2: raw.country_iso2,
    cancelled_at: raw.cancelled_at,
    has_results: raw.results_posted_at !== null,
  };
}

function toCompetitionDetail(raw: WcaCompetitionRaw): CompetitionDetail {
  const organizers: CompetitionOrganizer[] = raw.organizers.map((organizer) => ({
    id: organizer.id,
    name: organizer.name,
    wcaId: organizer.wca_id,
  }));

  return {
    venueAddress: raw.venue_address,
    competitorLimit: raw.competitor_limit ?? 0,
    informationHtml: renderCompetitionInformation(raw.information),
    registrationOpen: raw.registration_open,
    registrationClose: raw.registration_close,
    mainEventId: raw.main_event_id,
    organizers,
    coordinates: [raw.latitude_degrees, raw.longitude_degrees],
  };
}

function toCompetitionResultEntry(raw: WcaResultRaw): CompetitionResultEntry {
  return {
    id: raw.id,
    eventId: raw.event_id,
    pos: raw.pos,
    name: raw.name,
    best: raw.best,
    average: raw.average,
  };
}

/**
 * Fetches a single competition + its detail info from the live WCA API.
 * Returns null if the competition doesn't exist (WCA returns 404) — ported
 * from the Next.js app's try/catch-404-then-notFound() pattern.
 */
export async function fetchCompetition(
  compId: string,
): Promise<{ competition: Competition; detail: CompetitionDetail } | null> {
  const response = await fetch(`${WCA_API_ORIGIN}/api/v0/competitions/${compId}`);
  if (!response.ok) return null;

  const raw = (await response.json()) as WcaCompetitionRaw;
  return { competition: toCompetition(raw), detail: toCompetitionDetail(raw) };
}

/**
 * Results can be an empty array for a competition that hasn't run yet or
 * has none posted.
 *
 * WCA's API returns one row per *round* per competitor, not one row per
 * competitor per event — someone who advanced from a qualifying round into
 * the final has a result row for each round, each with its own
 * round-relative `pos` (confirmed against a real multi-round event: the
 * same competitor appeared at pos 1 twice, once for the first round, once
 * for the final — the visible bug this fixes). Only the final round's
 * standings are the event's official result, so this keeps just the
 * highest `round_id` per event_id — round ids are assigned in creation
 * order within a competition, so the max is reliably the last/final round
 * regardless of which round_type_id code WCA used for it (confirmed across
 * "f"/"c"-coded finals in real data; avoids hardcoding WCA's round-type
 * enum, which has more variants than are worth encoding here).
 */
export async function fetchCompetitionResults(compId: string): Promise<CompetitionResultEntry[]> {
  const response = await fetch(`${WCA_API_ORIGIN}/api/v0/competitions/${compId}/results`);
  if (!response.ok) return [];

  const raw = (await response.json()) as WcaResultRaw[];

  const finalRoundIdByEvent = new Map<string, number>();
  for (const result of raw) {
    const current = finalRoundIdByEvent.get(result.event_id) ?? -Infinity;
    if (result.round_id > current) finalRoundIdByEvent.set(result.event_id, result.round_id);
  }

  return raw
    .filter((result) => result.round_id === finalRoundIdByEvent.get(result.event_id))
    .map(toCompetitionResultEntry);
}
