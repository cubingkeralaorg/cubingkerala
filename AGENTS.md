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

## Dependabot auto-merge

Workflow: [`.github/workflows/dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml). Config: [`.github/dependabot.yml`](.github/dependabot.yml).

**What auto-merges:** only Dependabot PRs where every reported `update-type` is `version-update:semver-patch` (npm and GitHub Actions). Grouped PRs with any minor/major, or missing metadata, are skipped.

**What never auto-merges:** semver-minor, semver-major, mixed/unknown grouped updates, draft PRs, non-Dependabot PRs. Critical package **majors** are also ignored in `dependabot.yml` so Dependabot should not open them.

**What does not bypass safety:** the workflow does **not** auto-approve. It only runs `gh pr merge --auto --squash`. Merge still requires your branch protection (required checks, and reviews if you require them).

### GitHub settings you must enable

Do these in the repo UI (or org rulesets); they are not in git:

1. **Settings → General → Pull Requests → Allow auto-merge** — on.
2. **Branch protection / ruleset for `main`:**
   - Require a pull request before merging.
   - Require status checks to pass: at least `Main Branch CI/CD` / `test` (lint, `tsc`, unit/integration, e2e).
   - Do **not** allow admins or bots to bypass required checks.
   - Prefer squash merge (matches the workflow).
3. **Reviews:** keep required reviews if you want a human gate on minors/majors. Patch auto-merge will then wait until someone approves (workflow does not approve). To fully hands-off **patches only**, either exempt `dependabot[bot]` from required reviews or leave reviews optional and rely on required CI.
4. Confirm Dependabot version updates are enabled for the repo.

### Manual Dependabot triage

- **Patch, CI green:** should auto-merge once checks (and any required review) pass.
- **Minor:** review manually; run full verify; merge one at a time.
- **Major / ignored majors:** dedicated migration PR; do not stack lockfile PRs.
- **Red CI or conflicts:** fix or close/rebase; do not force-merge.

## Maintainer fork sync

Workflow: [`.github/workflows/sync-maintainer-fork.yml`](.github/workflows/sync-maintainer-fork.yml).

On every **push to `main`** on `cubingkeralaorg/cubingkerala` (including merged PRs), force-pushes that commit to the configured fork’s `main`. No schedule — merge/push only.

### GitHub settings (upstream repo)

On `cubingkeralaorg/cubingkerala` (not in git):

1. **Settings → Secrets and variables → Actions → Variables**  
   - `SYNC_FORK_REPO` = `allenjohn07/cubingkeralaorg` (or your fork `owner/name`)
2. **Settings → Secrets and variables → Actions → Secrets**  
   - `SYNC_FORK_TOKEN` = fine-grained PAT (or classic) with **Contents: Read and write** on the fork only  
   - Create at GitHub → Settings → Developer settings → Personal access tokens  
   - Prefer fine-grained, repository access = fork only, permission **Contents: Read and write**
3. On the **fork**, do **not** require PR / block force-pushes on `main` for this token (or the sync push will fail). Upstream `main` protection stays as-is.

If `SYNC_FORK_REPO` is unset, the job is skipped. If the token is missing, the step exits without failing the pipeline.

Treat fork `main` as a mirror only — do feature work on branches, not unique commits on fork `main`.

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
