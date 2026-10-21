# Agent instructions (Cubing Kerala)

Cubing Kerala is an Astro + Cloudflare Workers app, live at [cubingkerala.com](https://cubingkerala.com). All code lives under **`astro-app/`** — every command in this file runs from there, not the repo root. (The old Next.js/Prisma/Vercel version of this app has been removed; if you see a reference to it anywhere, it's stale.)

## Never commit or push — give instructions instead

**Agents must never run `git commit`, `git push`, `git merge`, or open a PR in this
repo, under any circumstances — even if explicitly asked to "just commit it" or "push
this."** This is a hard block, not a default-off preference.

When changes are ready: stop, and give the user two things in the chat reply —
1. The exact commit message (ready to paste, following the style below).
2. The exact shell commands to run themselves (`git add ...`, `git commit -m "..."`,
   `git push ...`).

Do not stage files (`git add`) or run any other state-changing git command either.
`git status` / `git diff` for your own review are fine.

Commit message style: short imperative subject line, optional body explaining *why*
(not what — the diff shows what). Match whatever style the user's recent commits use.

## Secrets and env files

- Never read, open, `cat`, or paste the contents of `.env`, `.env.local`,
  `.env.*.local`, `.dev.vars`, `.dev.vars.*`, or any file holding real credentials.
- Use [`astro-app/.env.example`](astro-app/.env.example) to learn what variables exist
  and their shape — it documents two separate systems: Worker secrets/bindings (read via
  `cloudflare:workers`, local values in `astro-app/.dev.vars`) and Astro/Vite `PUBLIC_*`
  build-time vars (read via `import.meta.env`, local values in `astro-app/.env`/`.env.local`).
- Never commit secrets, tokens, or real credential values. Flag it to the user instead
  of fixing it silently if you ever see one staged.
- Tell the user to set real values via `wrangler secret put <NAME>` (Worker secrets) or
  GitHub Actions secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
  `SYNC_UPSTREAM_TOKEN`) — never put them in a file that gets committed.

## UI / design consistency

Before building or changing anything visual — a new section, a new page, a tweak to an
existing component — load the `ui-design-system` skill (`astro-app/.claude/skills/ui-design-system/SKILL.md`
if the skill isn't surfaced by name). It documents the layout primitives, the shared table
system, color tokens / dark mode wiring, button and link conventions, and the patterns
already established across the site (hero marquee, side-by-side content sections, preview
tables with gradient fades, tooltips, etc.). The goal is that every new component looks
like it was built by the same hand as the existing ones — reuse the established primitive
instead of inventing a new one-off pattern.

## Verification ritual (every change)

No lint/test scripts exist in `astro-app/` yet, so verification is:

```bash
cd astro-app
npx tsc --noEmit
npm run build
# inspect dist/client/**/*.html (or grep) for the markup you expect to see
rm -rf dist
```

Run this after every non-trivial change, before reporting the work as done. If the
build or typecheck fails, fix it — don't report success with a failing check.

## Local dev server (don't kill the user's session)

Before starting a dev server to check a change:

1. **Check whether one is already running first** — `lsof -ti:4321` (this project's
   default port) or `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321`. If
   it responds, use it. Do not restart it, and do not assume you own it.
2. **Never broadly kill dev server processes** as a setup/cleanup step — that can kill
   the user's own already-running session (work-in-progress state, terminal output
   they were watching).
3. If you need your own throwaway instance, use a different port
   (`PORT=3999 npm run dev`) and only ever stop the specific PID you started yourself.
   `astro dev` itself refuses to start a second instance when one is already running and
   will just point you at the existing one — treat that as "already running," not an
   error to work around.
4. Note: this dev server binds to the **real remote** D1 database and R2 bucket (see
   `wrangler.jsonc`'s `"remote": true` bindings), not a local simulation — writes made
   while testing locally land in production. Confirmed acceptable for this project's
   traffic level, but worth remembering before bulk-testing destructive operations.

## Project context

- **Stack:** Astro (SSR, `@astrojs/cloudflare` adapter, Workers mode) + React islands,
  TypeScript, Tailwind CSS v4, Cloudflare D1 (Drizzle ORM), Cloudflare R2.
- **Deploy:** GitHub Actions ([`astro-app-ci.yml`](.github/workflows/astro-app-ci.yml)) —
  triggers on push to `main` on the fork (`allenjohn07/cubingkeralaorg`), builds,
  applies D1 migrations, deploys via `wrangler deploy`, then mirrors the commit to
  upstream (`cubingkeralaorg/cubingkerala`). Needs `CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`, and `SYNC_UPSTREAM_TOKEN` set as repo secrets on the fork.
- **Cron:** a native Cloudflare Cron Trigger (see `astro-app/src/worker.ts`'s
  `scheduled()` export) runs the WCA member/competition sync daily — not a GitHub
  Actions workflow.

## Git

- Create commits only when the user asks.
- Match existing commit message style (short imperative subject, optional body for "why").
- Do not push or open PRs unless asked.
