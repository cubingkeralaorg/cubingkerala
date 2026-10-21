# Agent instructions (Cubing Kerala — Astro rewrite)

This directory is the Astro + Cloudflare Workers rewrite of Cubing Kerala, built in
parallel against mock data on branch `refactor/core-architecture` while the production
Next.js app (repo root) stays live. See `/Users/allenjohn/.claude/plans/okay-right-now-there-dapper-rossum.md`
for the full migration plan.

**This file governs everything under `astro-app/`.** It does not replace the repo-root
`AGENTS.md` — that one's CI checklist (`npm run lint`, `prisma generate`, Postgres,
Vitest/Playwright) describes the *old* Next.js app and does not apply here. This stack
has no lint/test scripts configured yet (deliberate — see the plan's "How we'll work"
section: testing is minimal during this exploratory build).

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
  `.env.*.local`, or any file holding real credentials, in this directory or anywhere
  else in the repo.
- Use `astro-app/.env.example` to learn what variables exist and their shape.
  (It documents the *planned* set — see the plan's "Env var changes" note. Nothing is
  wired to real secrets yet; D1/auth/Cloudflare bindings are Phase 2+.)
- Never commit secrets, tokens, or real credential values. Flag it to the user instead
  of fixing it silently if you ever see one staged.
- Tell the user to set real values in the Cloudflare dashboard / `wrangler secret put` /
  GitHub Actions secrets — never put them in a file that gets committed.

## UI / design consistency

Before building or changing anything visual — a new section, a new page, a tweak to an
existing component — load the `ui-design-system` skill first (`astro-app:ui-design-system`
in a skill listing). It documents the layout primitives, the shared table system, color
tokens / dark mode wiring, button and link conventions, and the patterns already
established across the site (hero marquee, side-by-side content sections, preview
tables with gradient fades, etc.). The goal is that every new component looks like it
was built by the same hand as the existing ones — reuse the established primitive
instead of inventing a new one-off pattern.

## Verification ritual (every change)

No lint/test scripts exist yet in `astro-app/`, so verification is:

```bash
npx tsc --noEmit
npm run build
# inspect dist/client/**/*.html (or grep) for the markup you expect to see
rm -rf dist
```

Run this after every non-trivial change, before reporting the work as done. If the
build or typecheck fails, fix it — don't report success with a failing check.

## Local dev server

Same rule as the repo root: check whether one is already running (`lsof -ti:4321` —
this project's default port) before starting another. Never broadly kill dev server
processes. If you need your own throwaway instance, use a different port
(`PORT=3999 npm run dev`) and only ever stop the specific PID you started yourself.
`astro dev` itself refuses to start a second instance when one is already running and
will just point you at the existing one — treat that as "already running," not an
error to work around.

## Mock data

`src/lib/mock-data.ts` is the single source of mock data for every page/component.
Don't inline fixture data in a component — add it there instead, so swapping to a real
D1 query later (Phase 2) stays a one-line change per page, not a component rewrite.
