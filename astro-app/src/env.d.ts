/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Note: as of the installed @astrojs/cloudflare version, bindings are NOT
// read via Astro.locals.runtime.env (that was removed — accessing it throws
// "Astro.locals.runtime.env has been removed in Astro v6"). Use
// `import { env } from "cloudflare:workers"` instead, in any server-side
// file (pages, endpoints, middleware, the scheduled() handler) — it's fully
// typed against Cloudflare.Env, which worker-configuration.d.ts generates
// from wrangler.jsonc's bindings (DB, MEDIA, ASSETS, .dev.vars secrets) via
// `npm run generate-types`.
//
// Locals still exposes `cfContext: ExecutionContext` (e.g. for
// `Astro.locals.cfContext.waitUntil(...)`, replacing Next's `after()`).
type Runtime = import("@astrojs/cloudflare").Runtime;

declare namespace App {
  interface Locals extends Runtime {}
}
