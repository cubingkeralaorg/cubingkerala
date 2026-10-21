// Competitions.event_ids was a Postgres String[] in the old schema; D1/SQLite
// has no array column type, so it's stored as JSON text instead (see the
// comment on `competitions.eventIds` in schema.ts). These two helpers are the
// only place that JSON encode/decode should happen — every read/write site
// goes through them rather than calling JSON.parse/stringify directly.
export function serializeEventIds(eventIds: string[]): string {
  return JSON.stringify(eventIds);
}

export function parseEventIds(raw: string): string[] {
  return JSON.parse(raw) as string[];
}
