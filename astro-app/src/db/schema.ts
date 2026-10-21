import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Timestamps are stored as SQLite integers (Unix epoch ms) via Drizzle's
// `{ mode: "timestamp" }` — Drizzle converts to/from a real JS Date
// automatically, so query code gets Date objects back just like Prisma gave.
// No DB-level `createdAt` default (Prisma had `@default(now())`) — set it
// explicitly as `new Date()` at insert time in app code instead, so the
// schema doesn't need a SQL default expression for one field.

// 1:1 port of prisma/schema.prisma's SystemMetadata model (root repo).
// Used today for two keys: "wca_sync_offset" (rotating cursor for the
// member-sync batch job) and "last_competition_sync" (timestamp).
export const systemMetadata = sqliteTable("SystemMetadata", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Confirmed WCA accounts — anyone who has ever logged in via the OAuth flow,
// regardless of membership status. `email`/`emailConsent` are only ever set
// via the profile endpoint, not at account-creation time.
export const users = sqliteTable("Users", {
  wcaid: text("wcaid").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatarUrl").notNull(),
  country: text("country"),
  gender: text("gender"),
  email: text("email"),
  emailConsent: integer("emailConsent", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Pending membership requests awaiting admin approval.
export const requests = sqliteTable("Requests", {
  wcaid: text("wcaid").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatarUrl").notNull(),
  country: text("country"),
  gender: text("gender"),
  role: text("role"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Approved members — same shape as `requests`; a row moves from one table
// to the other on approval (see approve-requests route).
export const members = sqliteTable("Members", {
  wcaid: text("wcaid").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatarUrl").notNull(),
  country: text("country"),
  gender: text("gender"),
  role: text("role"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Kerala competitions, cached from the WCA API by competitions/sync.ts.
export const competitions = sqliteTable("Competitions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  // Postgres String[] → JSON-stringified text. Use serializeEventIds/
  // parseEventIds helpers (added alongside competitions/sync.ts in Phase 7)
  // at every read/write site rather than touching this column directly.
  eventIds: text("event_ids").notNull(),
  venue: text("venue").notNull(),
  countryIso2: text("country_iso2").notNull(),
  hasResults: integer("has_results", { mode: "boolean" }).notNull().default(false),
  cancelledAt: text("cancelled_at"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Per-member WCA competitor data (personal records, medal counts), cached
// from the WCA API by wca/sync.ts. `data` is a JSON-stringified blob, same
// treatment as `competitions.eventIds` above.
export const memberWcaData = sqliteTable("MemberWcaData", {
  wcaid: text("wcaid").primaryKey(),
  data: text("data").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Homepage photo-marquee gallery, admin-managed from /requests. `path` is
// the R2 object key (e.g. "images/gallery/<uuid>.jpg"), resolved to a full
// URL via mediaUrl() at render time — never store the full URL here, so a
// future PUBLIC_MEDIA_BASE_URL change (e.g. r2.dev -> a custom subdomain)
// doesn't require touching every row.
export const photos = sqliteTable("Photos", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  alt: text("alt").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
