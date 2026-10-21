import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// No singleton/caching here on purpose — unlike the old src/lib/db.ts
// (which cached a Prisma client on globalThis to survive Next.js dev-mode
// HMR reloads), a Cloudflare Worker has no persistent module-level state
// to protect across requests in the same way, and the D1 binding itself
// (env.DB) is what Cloudflare hands each request — there's nothing
// expensive to instantiate here. Call this once per request with the
// binding from Astro.locals.runtime.env.DB (pages/endpoints) or
// context.env.DB (the scheduled() handler).
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof getDb>;
