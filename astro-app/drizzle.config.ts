import { defineConfig } from "drizzle-kit";

// `out` points at `./migrations` (not drizzle-kit's usual `./drizzle`
// default) because that's the folder `wrangler d1 migrations apply`
// expects by default — keeping both tools pointed at the same place avoids
// a second config knob to keep in sync.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
});
