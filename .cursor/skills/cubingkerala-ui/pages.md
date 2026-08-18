# Page inventory

## Home `/`

**Files:** `src/app/page.tsx`, `src/components/home/*`

Two full-viewport screens:

1. Hero — community headline + featured meet browser card + destination cards
2. Unravel — about + mission + socials, then Get in touch

Featured competition: next upcoming (not cancelled), else latest past, else
browse-competitions fallback. Fetch via `getCachedCompetitions` (`revalidate =
300`). Helper: `src/utils/featured-competition.ts`.

Navbar wordmark: Cubing Kerala. Favicon: `src/app/icon.svg` (CK).

## Competitions `/competitions`

**Files:** `src/app/competitions/page.tsx`, `src/components/competitions/*`

Landing-aligned page: static H1, refresh, search, grid table. No motion.

Detail `/competitions/[compId]`: start-aligned H1, two-column event/registration
layout, grid result tables. No motion.

## Rankings `/rankings`

**Files:** `src/app/rankings/page.tsx`, `src/components/rankings/*`

Landing-aligned page: static H1, event/round filter, grid table. No motion.

## Members `/members`

**Files:** `src/app/members/page.tsx`, `src/components/members/*`

Landing-aligned list page: static H1, Join Cubing Kerala, search, grid table.
No motion.

Detail `/members/[wca_id]`: start-aligned H1, avatar, stats, personal-records
grid. No motion.

## Learn `/learn`

**Files:** `src/app/learn/page.tsx`, `src/components/learn/*`

Landing-aligned learning page: static H1, three level sections, destination-style
video cards. No motion.
