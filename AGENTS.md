# Agent instructions (Cubing Kerala)

This file is the default checklist for AI agents and contributors before opening or merging changes.

## Before every commit

Run the same checks as [`.github/workflows/main-branch-ci.yml`](.github/workflows/main-branch-ci.yml), in order:

```bash
npm ci
npm run lint
npx tsc --noEmit
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cubingkerala_test" npx prisma generate
# If Postgres is running locally (see CI service config):
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cubingkerala_test" npx prisma db push --skip-generate
npm run test:ci
# Optional but recommended before large UI/routing changes:
npm run test:e2e
```

Do not commit until lint, typecheck, and `npm run test:ci` pass. Fix failures; do not skip steps with `--no-verify` unless the user explicitly asks.

## After dependency changes

1. Run the full pre-commit stack above.
2. Prefer **patch/minor** updates; treat **major** bumps (Next.js, Tailwind, ESLint major) as separate migration tasks.
3. If resolving Dependabot PRs, merge safe updates on `main` and close or rebase stale bot PRs rather than stacking conflicting lockfiles.

## Security guardrails (required)

| Do | Don't |
|----|--------|
| Use [`.env.example`](.env.example) to learn which variables exist | Read, open, or paste contents of `.env`, `.env.local`, `.env.*.local`, or any file with real credentials |
| Tell the user to set secrets in Vercel / GitHub Actions | Commit secrets, tokens, or production `DATABASE_URL` values |
| Use placeholder URLs in docs and CI | Run destructive commands against production databases |
| Run `git status` / `git diff` before commits | Force-push `main` or amend pushed commits without explicit user request |

CI uses an ephemeral Postgres service (see workflow); local DB work should use a dev/test database only.

## Project context

- **Stack:** Next.js (App Router), TypeScript, Tailwind, Prisma + PostgreSQL, Vitest, Playwright.
- **Tests:** Unit/integration in `src/__tests__/` (Vitest, mocked DB). E2E in `e2e/` (Playwright, dev server).
- **Upstream:** `cubingkeralaorg/cubingkerala` — open Dependabot PRs are tracked there.

## Git

- Create commits only when the user asks.
- Match existing commit message style (short imperative subject, optional body for “why”).
- Do not push or open PRs unless asked.

## Cursor rules

Additional always-on guardrails live in [`.cursor/rules/`](.cursor/rules/).
