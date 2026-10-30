// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: cloudflare(),
  // Astro's Sessions API isn't used anywhere in this app — without this,
  // @astrojs/cloudflare auto-provisions a KV "SESSION" binding by default,
  // which has no real namespace id in wrangler.jsonc and breaks `wrangler
  // dev --remote`/deploy with "SESSION bindings must have an id field".
  // Disabling it outright (supported since Astro 7.2) also drops the
  // session runtime from the SSR bundle entirely.
  session: false,
  // Inline all CSS into the HTML instead of <link>ing it: the site-wide
  // stylesheet is small (~6KB gzipped) and was the only render-blocking
  // request on every page. Pages are edge-cached, so the extra HTML bytes
  // are cheap.
  build: {
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()]
  }
});